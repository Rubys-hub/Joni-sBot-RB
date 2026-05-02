export default {
  command: ['log', 'logs'],
  category: 'grupo',

  run: async (client, m) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
    }

    const chat = global.db.data.chats[m.chat]

    if (!chat?.botLogs?.length) {
      return m.reply('No hay logs registrados todavía.')
    }

    const logs = chat.botLogs.slice(0, 15)

    let text = `> _Logs recientes del grupo_\n\n`

    logs.forEach((log, i) => {
      const date = new Date(log.time).toLocaleString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      })

      text += `> *${i + 1}.* ${log.action}\n`
      text += `> _Por:_ @${log.by.split('@')[0]} — ${date}\n\n`
    })

    return client.reply(m.chat, text.trim(), m, {
      mentions: logs.map(v => v.by).filter(Boolean)
    })
  }
}