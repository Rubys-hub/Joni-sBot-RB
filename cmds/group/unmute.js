export default {
  command: ['unmute'],
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
    if (!user) return m.reply('Menciona o responde al usuario que quieres desmutear.')

    const chat = global.db.data.chats[m.chat]
    if (!chat?.mutedUsers?.[user]) {
      return m.reply('Ese usuario no está muteado.')
    }

    delete chat.mutedUsers[user]

    return client.reply(
      m.chat,
      `🔊 Se quitó el mute a @${user.split('@')[0]}.`,
      m,
      { mentions: [user] }
    )
  }
}