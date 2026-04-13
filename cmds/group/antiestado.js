export default {
  command: ['antiestado'],
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
        `📢 *AntiEstado*\n\nEstado actual: ${chat.antiestado ? '✓ Activado' : '✗ Desactivado'}\n\nUso:\n.antiestado on\n.antiestado off`
      )
    }

    if (['on', 'enable'].includes(option)) {
      chat.antiestado = true
      return m.reply('📢 Anti-estado activado.')
    }

    if (['off', 'disable'].includes(option)) {
      chat.antiestado = false
      return m.reply('📢 Anti-estado desactivado.')
    }

    return m.reply('Usa `.antiestado on` o `.antiestado off`')
  }
}