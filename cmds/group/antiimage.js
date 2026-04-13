export default {
  command: ['antiimage', 'antiimg'],
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
        `🖼️ *AntiImage*\n\nEstado actual: ${chat.antiimage ? '✓ Activado' : '✗ Desactivado'}\n\nUso:\n.antiimage on\n.antiimage off`
      )
    }

    if (['on', 'enable'].includes(option)) {
      chat.antiimage = true
      return m.reply('🖼️ Anti-imagen activado.')
    }

    if (['off', 'disable'].includes(option)) {
      chat.antiimage = false
      return m.reply('🖼️ Anti-imagen desactivado.')
    }

    return m.reply('Usa `.antiimage on` o `.antiimage off`')
  }
}