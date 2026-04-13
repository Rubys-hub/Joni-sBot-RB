function msParser(str) {
  const match = String(str || '').match(/^(\d+)([smhd])$/i)
  if (!match) return null

  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()

  switch (unit) {
    case 's': return num * 1000
    case 'm': return num * 60 * 1000
    case 'h': return num * 60 * 60 * 1000
    case 'd': return num * 24 * 60 * 60 * 1000
    default: return null
  }
}

export default {
  command: ['mutetime', 'tempmute'],
  category: 'grupo',

  run: async (client, m, args) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    const user = m.mentionedJid?.[0] || m.quoted?.sender
    if (!user) return m.reply('Menciona o responde al usuario que quieres mutear.')

    const timeArg = args.find(v => /^\d+[smhd]$/i.test(v))
    if (!timeArg) return m.reply('Ejemplo: .mutetime @usuario 10m')

    const duration = msParser(timeArg)
    if (!duration) return m.reply('Tiempo inválido. Usa por ejemplo: 30s, 10m, 2h, 1d')

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]

    chat.mutedUsers = chat.mutedUsers || {}
    chat.mutedUsers[user] = {
      active: true,
      type: 'temporary',
      by: m.sender,
      at: Date.now(),
      expires: Date.now() + duration
    }

    return client.reply(
      m.chat,
      `⏳ Se silenció a @${user.split('@')[0]} por ${timeArg}.`,
      m,
      { mentions: [user] }
    )
  }
}