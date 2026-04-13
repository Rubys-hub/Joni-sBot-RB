export default {
  command: ['badwords', 'antitoxic', 'antigroserias'],
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
        `💀 *BadWords / AntiToxic*\n\nEstado actual: ${chat.badwords ? '✓ Activado' : '✗ Desactivado'}\n\nUso:\n.badwords on\n.badwords off`
      )
    }

    if (['on', 'enable'].includes(option)) {
      chat.badwords = true
      return m.reply('💀 Filtro de groserías fuertes activado.')
    }

    if (['off', 'disable'].includes(option)) {
      chat.badwords = false
      return m.reply('💀 Filtro de groserías fuertes desactivado.')
    }

    return m.reply('Usa `.badwords on` o `.badwords off`')
  }
}