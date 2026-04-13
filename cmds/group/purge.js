export default {
  command: ['purge', 'clearchat'],
  category: 'grupo',
  botAdmin: true,

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

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat?.messageLog || !chat.messageLog.length) {
      return m.reply('No hay mensajes registrados para borrar todavía.')
    }

    const raw = (args[0] || '').toLowerCase()
    const deleteAll = raw === 'all' || raw === 'todo' || raw === 'todos'

    let amount = deleteAll ? chat.messageLog.length : parseInt(args[0], 10)
    if (!deleteAll && (!amount || isNaN(amount))) amount = 10

    if (!deleteAll) {
      amount = Math.max(1, Math.min(amount, 100))
    }

    const targets = deleteAll
      ? [...chat.messageLog]
      : chat.messageLog.slice(-amount)

    if (!targets.length) {
      return m.reply('No encontré mensajes para borrar.')
    }

    let deleted = 0

    for (const msg of targets.reverse()) {
      try {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: msg.chat || m.chat,
            fromMe: !!msg.fromMe,
            id: msg.id,
            participant: msg.participant || msg.sender || undefined
          }
        })
        deleted++
      } catch {}
    }

    const ids = new Set(targets.map(v => v.id))
    chat.messageLog = chat.messageLog.filter(v => !ids.has(v.id))

    if (chat.userMessageLog) {
      for (const jid of Object.keys(chat.userMessageLog)) {
        chat.userMessageLog[jid] = (chat.userMessageLog[jid] || []).filter(v => !ids.has(v.id))
        if (!chat.userMessageLog[jid].length) delete chat.userMessageLog[jid]
      }
    }

    return m.reply(`🧹 Se intentaron borrar ${targets.length} mensajes.\n✅ Borrados: ${deleted}`)
  }
}