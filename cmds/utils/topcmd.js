export default {
  command: ['topcmd', 'topcommands'],
  category: 'utils',

  run: async (client, m) => {
    const chat = global.db.data.chats[m.chat]

    if (!chat?.commandStats || !Object.keys(chat.commandStats).length) {
      return m.reply('Todavía no hay comandos registrados.')
    }

    const top = Object.entries(chat.commandStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    let text = `> _Top comandos usados_\n\n`

    top.forEach(([cmd, count], i) => {
      text += `> *${i + 1}.* .${cmd} — _${count} usos_\n`
    })

    return m.reply(text.trim())
  }
}