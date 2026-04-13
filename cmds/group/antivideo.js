export default {
  command: ['antivideo'],
  category: 'grupo',

  run: async (client, m, args) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    const option = (args[0] || '').toLowerCase()

    if (!option) {
      return m.reply(
        `🎥 *AntiVideo*\n\nEstado actual: ${chat.antivideo ? '✓ Activado' : '✗ Desactivado'}\n\nUso:\n.antivideo on\n.antivideo off`
      )
    }

    if (['on', 'enable'].includes(option)) {
      chat.antivideo = true
      return m.reply('🎥 Anti-video activado.')
    }

    if (['off', 'disable'].includes(option)) {
      chat.antivideo = false
      return m.reply('🎥 Anti-video desactivado.')
    }

    return m.reply('Usa `.antivideo on` o `.antivideo off`')
  }
}