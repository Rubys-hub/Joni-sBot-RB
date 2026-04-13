export default {
  command: ['purgeuser', 'clearuser', 'deluser'],
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

    const user = m.mentionedJid?.[0] || m.quoted?.sender
    if (!user) {
      return m.reply('Menciona o responde al usuario cuyos mensajes quieres borrar.')
    }

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat?.userMessageLog?.[user]?.length) {
      return m.reply('No hay mensajes registrados de ese usuario.')
    }

    const raw = (args.find(v => v && !v.startsWith('@')) || '').toLowerCase()
    const deleteAll = raw === 'all' || raw === 'todo' || raw === 'todos'

    let amount = deleteAll ? chat.userMessageLog[user].length : parseInt(raw, 10)
    if (!deleteAll && (!amount || isNaN(amount))) amount = 10

    if (!deleteAll) {
      amount = Math.max(1, Math.min(amount, 200))
    }

    const targets = deleteAll
      ? [...chat.userMessageLog[user]]
      : chat.userMessageLog[user].slice(-amount)

    if (!targets.length) {
      return m.reply('No encontré mensajes para borrar de ese usuario.')
    }

    let deleted = 0

    for (const msg of targets.reverse()) {
      try {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: msg.chat || m.chat,
            fromMe: !!msg.fromMe,
            id: msg.id,
            participant: msg.participant || msg.sender || user
          }
        })
        deleted++
      } catch {}
    }

    const ids = new Set(targets.map(v => v.id))

    chat.userMessageLog[user] = (chat.userMessageLog[user] || []).filter(v => !ids.has(v.id))
    if (!chat.userMessageLog[user].length) delete chat.userMessageLog[user]

    chat.messageLog = (chat.messageLog || []).filter(v => !ids.has(v.id))

    return client.reply(
      m.chat,
      `🧹 Se intentaron borrar ${targets.length} mensajes de @${user.split('@')[0]}.\n✅ Borrados: ${deleted}`,
      m,
      { mentions: [user] }
    )
  }
}