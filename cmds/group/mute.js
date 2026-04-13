export default {
  command: ['mute'],
  category: 'grupo',

  run: async (client, m) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    const user = m.mentionedJid?.[0] || m.quoted?.sender
    if (!user) return m.reply('Menciona o responde al usuario que quieres mutear.')

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]

    chat.mutedUsers = chat.mutedUsers || {}
    chat.mutedUsers[user] = { active: true, type: 'permanent', by: m.sender, at: Date.now() }

    return client.reply(
      m.chat,
      `🔇 Se silenció a @${user.split('@')[0]} permanentemente.`,
      m,
      { mentions: [user] }
    )
  }
}