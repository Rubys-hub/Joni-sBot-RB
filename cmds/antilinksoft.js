const OWNER_NUMBER = '51901931862'

const allowedLinks = [
  'https://whatsapp.com/channel/0029Vb64nWqLo4hb8cuxe23n'
]

const linkRegex =
  /(?:https?:\/\/|www\.|chat\.whatsapp\.com\/|whatsapp\.com\/channel\/|wa\.me\/|t\.me\/|discord\.gg\/)[^\s]+/i

const stateRegex =
  /estado|estados|etiqueten en sus estados|etiqueta en tus estados|suban a sus estados|sube a tu estado|comparte en tu estado|compartan en sus estados|difundan en sus estados|viral en estados/i

export default async function antilinksoft(client, m) {
  try {
    const text =
      m.text ||
      m.body ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption ||
      ''

    if (!m.isGroup || !text) return

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const OWNER_JID = '51901931862@s.whatsapp.net'

    const normalizeJid = (value = '') => String(value).trim()
    const digitsOnly = (value = '') => String(value).replace(/\D/g, '')

    const senderRaw = normalizeJid(m.sender)
    const senderDigits = digitsOnly(m.sender)

    const isOwner =
      senderRaw === OWNER_JID ||
      senderDigits === digitsOnly(OWNER_JID)

    if (isOwner) return
    if (senderRaw === botId || senderDigits === digitsOnly(botId)) return

    const isSelf = global.db.data.settings[botId]?.self ?? false
    if (isSelf) return

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat?.antilinksoft) return

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

    const hasLink = linkRegex.test(text)
    const hasStateSpam = stateRegex.test(text)

    if (!hasLink && !hasStateSpam) return

    try {
      await client.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant || m.sender
        }
      })
    } catch {}

    let reason = 'contenido prohibido'
    if (hasStateSpam && hasLink) reason = 'enlaces y promoción en estados'
    else if (hasStateSpam) reason = 'promoción o etiquetado en estados'
    else if (/whatsapp\.com\/channel\//i.test(text)) reason = 'enlaces de canales'
    else if (/chat\.whatsapp\.com\//i.test(text)) reason = 'enlaces de grupos'
    else reason = 'enlaces externos'

    await client.reply(
      m.chat,
      `> ⌬ Mensaje eliminado por *AntiLink Soft*.\n> Motivo: *${reason}*.`,
      null
    )
  } catch (e) {
    console.error('[ANTILINKSOFT ERROR]', e)
  }
}