const OWNER_NUMBER = '51901931862'

const stateRegex =
  /(?:estado|estados|status|historias|historia|story|stories|etiqueta|etiqueten|mencionen|mencionar|suban|sube|subir|compartan|comparte|difundan|difunde|viral|resuban|resube|publiquen|publica|publicar|vean mi estado|miren mi estado|reaccionen a mi estado|denle amor a mi estado)/i

const statePhraseRegex =
  /(?:etiquet(?:a|en|ame|arme|arnos)|mencion(?:a|en|ame|arme|arnos)).{0,40}(?:estado|estados|status|historia|historias|story|stories)|(?:estado|estados|status|historia|historias|story|stories).{0,40}(?:etiquet(?:a|en|ame|arme|arnos)|mencion(?:a|en|ame|arme|arnos)|suban|sube|compartan|comparte|difundan|viral)/i

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

function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '')
}

function normalizeJid(value = '') {
  return String(value).trim()
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

function isStatusMentionMessage(m) {
  const msg = m.message || {}
  const keys = Object.keys(msg)

  if (keys.some(k => /status|estado/i.test(k))) return true

  const raw = JSON.stringify(msg).toLowerCase()

  return (
    raw.includes('statusmention') ||
    raw.includes('groupstatusmention') ||
    raw.includes('estado') ||
    raw.includes('status')
  )
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

export default {
  command: ['antiestado'],
  category: 'grupo',

  async all(m, { client }) {
    try {
      if (!m?.key) return false
      if (!m.isGroup) return false
      if (m.key.fromMe) return false

      const chat = global?.db?.data?.chats?.[m.chat]
      if (!chat?.antiestado) return false

      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const OWNER_JID = `${OWNER_NUMBER}@s.whatsapp.net`

      const senderRaw = normalizeJid(m.sender)
      const senderDigits = digitsOnly(m.sender)

      const isOwner =
        senderRaw === OWNER_JID ||
        senderDigits === digitsOnly(OWNER_JID)

      if (isOwner) return false
      if (senderRaw === botId || senderDigits === digitsOnly(botId)) return false

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

      const text = cleanText(getText(m))

      const detectedByText =
        text &&
        stateRegex.test(text) &&
        statePhraseRegex.test(text)

      const detectedByType = isStatusMentionMessage(m)

      if (!detectedByText && !detectedByType) return false

      await deleteMessage(client, m)

      const totalWarns = addWarning(
        chat,
        m.sender,
        'AntiEstado: etiquetación o promoción de estados',
        botId
      )

      const number = m.sender.split('@')[0]

      await client.sendMessage(
        m.chat,
        {
          text: `╭━━━〔 📢 *ANTIESTADO* 〕━━━╮
┃
┃ Usuario: @${number}
┃
┃ 🧹 Mensaje eliminado.
┃ ⚠️ Warn aplicado.
┃ 📋 Warns totales: *${totalWarns}*
┃
┃ No se permite etiquetar o pedir difusión
┃ mediante estados en este grupo.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
          mentions: [m.sender]
        },
        { quoted: null }
      )

      return false
    } catch (e) {
      console.error('[ANTIESTADO AUTO ERROR]', e)
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
      return m.reply(`📢 *AntiEstado*

Estado actual: ${chat.antiestado ? '✅ Activado' : '❌ Desactivado'}

Uso:
*${usedPrefix}antiestado on*
*${usedPrefix}antiestado off*`)
    }

    if (['on', 'enable', 'activar'].includes(option)) {
      chat.antiestado = true
      return m.reply('📢 AntiEstado activado. Ahora eliminará mensajes de etiquetación de estados y dará warn.')
    }

    if (['off', 'disable', 'desactivar'].includes(option)) {
      chat.antiestado = false
      return m.reply('📢 AntiEstado desactivado.')
    }

    return m.reply(`Usa *${usedPrefix}antiestado on* o *${usedPrefix}antiestado off*`)
  }
}