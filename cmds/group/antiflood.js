export default {
  command: ['antiflood', 'flood'],
  category: 'grupo',

  run: async (client, m, args) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) {
      return m.reply('Este comando solo funciona en grupos.')
    }

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]

    chat.antiflood = chat.antiflood || false
    chat.floodSettings = chat.floodSettings || {
      maxMessages: 5,
      intervalMs: 5000,
      action: 'delete'
    }

    const option = (args[0] || '').toLowerCase()

    if (!option) {
      return m.reply(
        `⚡ *AntiFlood*\n\n` +
        `Estado: ${chat.antiflood ? '✓ Activado' : '✗ Desactivado'}\n` +
        `Máximo: ${chat.floodSettings.maxMessages} mensajes\n` +
        `Ventana: ${Math.floor(chat.floodSettings.intervalMs / 1000)} segundos\n` +
        `Acción: ${chat.floodSettings.action}\n\n` +
        `Uso:\n` +
        `.antiflood on\n` +
        `.antiflood off\n` +
        `.antiflood set 5 5\n` +
        `.antiflood action delete`
      )
    }

    if (['on', 'enable'].includes(option)) {
      chat.antiflood = true
      return m.reply('⚡ AntiFlood activado.')
    }

    if (['off', 'disable'].includes(option)) {
      chat.antiflood = false
      return m.reply('⚡ AntiFlood desactivado.')
    }

    if (option === 'set') {
      const maxMessages = parseInt(args[1], 10)
      const seconds = parseInt(args[2], 10)

      if (!maxMessages || !seconds) {
        return m.reply('Ejemplo: .antiflood set 5 5')
      }

      chat.floodSettings.maxMessages = Math.max(2, Math.min(maxMessages, 20))
      chat.floodSettings.intervalMs = Math.max(2000, Math.min(seconds * 1000, 30000))

      return m.reply(
        `⚡ AntiFlood configurado:\n` +
        `Máximo: ${chat.floodSettings.maxMessages} mensajes\n` +
        `Ventana: ${Math.floor(chat.floodSettings.intervalMs / 1000)} segundos`
      )
    }

    if (option === 'action') {
      const action = (args[1] || '').toLowerCase()
      const valid = ['delete', 'warn']

      if (!valid.includes(action)) {
        return m.reply('Usa: .antiflood action delete')
      }

      chat.floodSettings.action = action
      return m.reply(`⚡ Acción de AntiFlood: ${action}`)
    }

    return m.reply('Usa `.antiflood on`, `.antiflood off` o `.antiflood set 5 5`')
  }
}