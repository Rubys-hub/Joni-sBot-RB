export default {
  command: ['autoadmin'],
  category: 'owner',
  isOwner: true,

  run: async (client, m, args) => {
    if (!m.isGroup) return

    const chat = global.db.data.chats[m.chat]

    const option = (args[0] || '').toLowerCase()

    if (option === 'on') {
      chat.autoAdmin = true
      return m.reply('AutoAdmin activado.')
    }

    if (option === 'off') {
      chat.autoAdmin = false
      return m.reply('AutoAdmin desactivado.')
    }

    return m.reply('Usa: .autoadmin on / off')
  }
}