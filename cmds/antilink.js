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

function timestamp() {
  return new Date().toLocaleString('es-CO', {
    timeZone: 'America/Lima',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

function addWarning(chat, sender, reason, by) {
  chat.users ||= {}
  chat.users[sender] ||= {}
  chat.users[sender].warnings ||= []

  chat.users[sender].warnings.unshift({
    reason,
    timestamp: timestamp(),
    by
  })

  return chat.users[sender].warnings.length
}

export default async function antilink(client, m) {
  try {
    const text = cleanText(getText(m))

    if (!m.isGroup || !text) return

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const OWNER_JID = `${OWNER_NUMBER}@s.whatsapp.net`

    const senderRaw = normalizeJid(m.sender)
    const senderDigits = digitsOnly(m.sender)

    const isOwner =
      senderRaw === OWNER_JID ||
      senderDigits === digitsOnly(OWNER_JID)

    if (isOwner) return
    if (senderRaw === botId || senderDigits === digitsOnly(botId)) return

    const isSelf = global.db.data.settings?.[botId]?.self ?? false
    if (isSelf) return

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat?.antilinks) return

    const primaryBotId = chat?.primaryBot
    const isPrimary = !primaryBotId || primaryBotId === botId
    if (!isPrimary) return

    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    if (!groupMetadata) return

    const participants = groupMetadata.participants || []
    const groupAdmins = participants
      .filter(p => p.admin)
      .map(p => p.phoneNumber || p.jid || p.id || p.lid)

    const isAdmin = groupAdmins.some(v => {
      const raw = normalizeJid(v)
      const dig = digitsOnly(v)
      return raw === senderRaw || dig === senderDigits
    })

    if (isAdmin) return

    const isBotAdmin = groupAdmins.some(v => {
      const raw = normalizeJid(v)
      const dig = digitsOnly(v)
      return raw === botId || dig === digitsOnly(botId)
    })

    if (!isBotAdmin) return

    const hasAllowedLink = allowedLinks.some(link => text.includes(link))
    if (hasAllowedLink) return

    const hasLink = strictLinkRegex.test(text)
    if (!hasLink) return

    await deleteMessage(client, m)

    const reason = getReason(text)

    chat.antilinkWarnings ||= {}
    chat.antilinkWarnings[m.sender] = Number(chat.antilinkWarnings[m.sender] || 0) + 1

    const linkWarns = chat.antilinkWarnings[m.sender]
    const totalWarns = addWarning(chat, m.sender, `AntiLink: ${reason}`, botId)

    const mention = [m.sender]
    const number = m.sender.split('@')[0]

    if (linkWarns >= 2) {
      try {
        await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        delete chat.antilinkWarnings[m.sender]

        return client.sendMessage(
          m.chat,
          {
            text: `╭━━━〔 🚫 *ANTILINK* 〕━━━╮
┃
┃ Usuario: @${number}
┃ Motivo: *${reason}*
┃
┃ 🧹 Mensaje eliminado.
┃ ⚠️ Warn por link: *2/2*
┃ 🚪 Acción: *expulsado por reincidencia*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
            mentions: mention
          },
          { quoted: null }
        )
      } catch {
        return client.sendMessage(
          m.chat,
          {
            text: `╭━━━〔 ⚠️ *ANTILINK* 〕━━━╮
┃
┃ Usuario: @${number}
┃ Motivo: *${reason}*
┃
┃ 🧹 Mensaje eliminado.
┃ ⚠️ Warn por link: *2/2*
┃ ❌ No pude expulsarlo.
┃
┃ Revisa si el bot sigue siendo admin.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
            mentions: mention
          },
          { quoted: null }
        )
      }
    }

    return client.sendMessage(
      m.chat,
      {
        text: `╭━━━〔 ⚠️ *ANTILINK* 〕━━━╮
┃
┃ Usuario: @${number}
┃ Motivo: *${reason}*
┃
┃ 🧹 Mensaje eliminado.
┃ ⚠️ Warn por link: *${linkWarns}/2*
┃ 📋 Warns totales: *${totalWarns}*
┃
┃ Si vuelve a enviar links será expulsado.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: mention
      },
      { quoted: null }
    )
  } catch (e) {
    console.error('[ANTILINK ERROR]', e)
  }
}