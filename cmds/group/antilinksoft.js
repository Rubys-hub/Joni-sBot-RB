const OWNER_NUMBER = '51901931862'

const allowedLinks = [
  'https://whatsapp.com/channel/0029Vb64nWqLo4hb8cuxe23n'
]

const strictLinkRegex = new RegExp(
  [
    '(?:https?:\\/\\/|www\\.)\\S+',
    '(?:chat\\.whatsapp\\.com|whatsapp\\.com\\/channel|wa\\.me)\\/\\S+',
    '(?:t\\.me|telegram\\.me|discord\\.gg|discord\\.com\\/invite)\\/\\S+',
    '(?:bit\\.ly|tinyurl\\.com|cutt\\.ly|shorturl\\.at|linktr\\.ee)\\/\\S+',
    '(?:youtube\\.com|youtu\\.be|tiktok\\.com|instagram\\.com|facebook\\.com|fb\\.watch|x\\.com|twitter\\.com)\\/\\S+',
    '\\b[a-z0-9][a-z0-9-]{1,}\\.(?:com|net|org|io|gg|me|tv|app|dev|xyz|site|online|store|shop|club|info|biz|pe|co|es|mx|ar|cl|br|ly|to|cc|link)\\b(?:\\/\\S*)?'
  ].join('|'),
  'i'
)

function normalizeJid(value = '') {
  return String(value).trim()
}

function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '')
}

function getText(m) {
  return (
    m.text ||
    m.body ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    m.message?.documentMessage?.caption ||
    ''
  )
}

function cleanText(text = '') {
  return String(text)
    .replace(/\u200b/g, '')
    .replace(/\u200c/g, '')
    .replace(/\u200d/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function deleteMessage(client, m) {
  try {
    await client.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.key.participant || m.sender
      }
    })
    return true
  } catch {
    return false
  }
}

function getReason(text = '') {
  if (/chat\.whatsapp\.com/i.test(text)) return 'enlace de grupo'
  if (/whatsapp\.com\/channel/i.test(text)) return 'enlace de canal'
  if (/wa\.me/i.test(text)) return 'enlace de WhatsApp'
  if (/t\.me|telegram\.me/i.test(text)) return 'enlace de Telegram'
  if (/discord\.gg|discord\.com\/invite/i.test(text)) return 'enlace de Discord'
  if (/tiktok\.com/i.test(text)) return 'enlace de TikTok'
  if (/instagram\.com/i.test(text)) return 'enlace de Instagram'
  if (/facebook\.com|fb\.watch/i.test(text)) return 'enlace de Facebook'
  if (/youtube\.com|youtu\.be/i.test(text)) return 'enlace de YouTube'
  return 'enlace externo'
}

export default {
  command: ['antilinksoft'],
  category: 'grupo',

  async all(m, { client }) {
    try {
      if (!m?.key) return false
      if (!m.isGroup) return false
      if (m.key.fromMe) return false

      const text = cleanText(getText(m))
      if (!text) return false

      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const OWNER_JID = `${OWNER_NUMBER}@s.whatsapp.net`

      const senderRaw = normalizeJid(m.sender)
      const senderDigits = digitsOnly(m.sender)

      const isOwner =
        senderRaw === OWNER_JID ||
        senderDigits === digitsOnly(OWNER_JID)

      if (isOwner) return false
      if (senderRaw === botId || senderDigits === digitsOnly(botId)) return false

      const isSelf = global.db.data.settings?.[botId]?.self ?? false
      if (isSelf) return false

      const chat = global?.db?.data?.chats?.[m.chat]
      if (!chat?.antilinksoft) return false

      const primaryBotId = chat?.primaryBot
      const isPrimary = !primaryBotId || primaryBotId === botId
      if (!isPrimary) return false

      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      if (!groupMetadata) return false

      const participants = groupMetadata.participants || []
      const groupAdmins = participants
        .filter(p => p.admin)
        .map(p => p.phoneNumber || p.jid || p.id || p.lid)

      const isAdmin = groupAdmins.some(v => {
        const raw = normalizeJid(v)
        const dig = digitsOnly(v)
        return raw === senderRaw || dig === senderDigits
      })

      if (isAdmin) return false

      const isBotAdmin = groupAdmins.some(v => {
        const raw = normalizeJid(v)
        const dig = digitsOnly(v)
        return raw === botId || dig === digitsOnly(botId)
      })

      if (!isBotAdmin) return false

      const hasAllowedLink = allowedLinks.some(link => text.includes(link))
      if (hasAllowedLink) return false

      const hasLink = strictLinkRegex.test(text)
      if (!hasLink) return false

      await deleteMessage(client, m)

      const reason = getReason(text)

      await client.sendMessage(
        m.chat,
        {
          text: `╭━━━〔 🧹 *ANTILINK SOFT* 〕━━━╮
┃
┃ Mensaje eliminado.
┃ Motivo: *${reason}*
┃
┃ ⚠️ No se permiten enlaces en este grupo.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        },
        { quoted: null }
      )

      return false
    } catch (e) {
      console.error('[ANTILINKSOFT ERROR]', e)
      return false
    }
  },

  run: async (client, m, args, usedPrefix) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    const chat = global.db.data.chats[m.chat] ||= {}
    const option = (args[0] || '').toLowerCase()

    if (!option) {
      return m.reply(`🧹 *AntiLink Soft*

Estado actual: ${chat.antilinksoft ? '✅ Activado' : '❌ Desactivado'}

Uso:
*${usedPrefix}antilinksoft on*
*${usedPrefix}antilinksoft off*`)
    }

    if (['on', 'enable', 'activar'].includes(option)) {
      chat.antilinksoft = true
      return m.reply('🧹 AntiLink Soft activado en modo estricto.')
    }

    if (['off', 'disable', 'desactivar'].includes(option)) {
      chat.antilinksoft = false
      return m.reply('🧹 AntiLink Soft desactivado.')
    }

    return m.reply(`Usa *${usedPrefix}antilinksoft on* o *${usedPrefix}antilinksoft off*`)
  }
}