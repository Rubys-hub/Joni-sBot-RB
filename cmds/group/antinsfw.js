export default {
  command: ['nsfwfilter', 'antinsfw'],
  category: 'grupo',

  run: async (client, m, args) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Solo admins o owner')
    }

    if (!m.isGroup) return m.reply('Solo en grupos')

    if (!global.db.data.chats[m.chat]) {
      global.db.data.chats[m.chat] = {}
    }

    const chat = global.db.data.chats[m.chat]
    const option = (args[0] || '').toLowerCase()

    if (!option) {
      return m.reply(
        `🔞 Anti NSFW\n\nEstado: ${chat.nsfwFilter ? 'ON' : 'OFF'}\n\nUso:\n.nsfwfilter on\n.nsfwfilter off`
      )
    }

    if (['on', 'enable'].includes(option)) {
      chat.nsfwFilter = true
      return m.reply('🔞 Filtro NSFW activado')
    }

    if (['off', 'disable'].includes(option)) {
      chat.nsfwFilter = false
      return m.reply('🔞 Filtro NSFW desactivado')
    }

    return m.reply('Usa on/off')
  }
}