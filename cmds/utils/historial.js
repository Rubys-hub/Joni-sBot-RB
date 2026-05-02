export default {
  command: ['historialcmd', 'cmdhistory'],
  category: 'utils',

  run: async (client, m) => {
    const chat = global.db.data.chats[m.chat]

    if (!chat?.commandHistory?.length) {
      return m.reply('Todavía no hay historial de comandos.')
    }

    const history = chat.commandHistory.slice(0, 10)

    let text = `> _Últimos comandos usados_\n\n`
    const mentions = []

    history.forEach((item, i) => {
      const date = new Date(item.time).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
      })

      text += `> *${i + 1}.* .${item.command} — @${item.sender.split('@')[0]} _${date}_\n`
      mentions.push(item.sender)
    })

    return client.reply(m.chat, text.trim(), m, { mentions })
  }
}