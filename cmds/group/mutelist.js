export default {
  command: ['mutelist'],
  category: 'grupo',

  run: async (client, m) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    const chat = global.db.data.chats[m.chat] || {}
    const muted = chat.mutedUsers || {}
    const entries = Object.entries(muted)

    if (!entries.length) return m.reply('No hay usuarios muteados.')

    let text = '🔇 *Usuarios muteados:*\n\n'
    const mentions = []

    for (const [jid, info] of entries) {
      mentions.push(jid)

      let line = `• @${jid.split('@')[0]}`
      if (info?.type === 'temporary' && info?.expires) {
        const remaining = Math.max(0, info.expires - Date.now())
        const mins = Math.ceil(remaining / 60000)
        line += ` - temporal (${mins} min aprox)`
      } else {
        line += ' - permanente'
      }

      text += line + '\n'
    }

    return client.reply(m.chat, text.trim(), m, { mentions })
  }
}