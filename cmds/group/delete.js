export default {
  command: ['delete', 'del', 'borrar'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) {
      return m.reply('Este comando solo funciona en grupos.')
    }

    const quoted = m.quoted
    if (!quoted) {
      return m.reply('Responde al mensaje que quieres borrar.')
    }

    try {
      const targetKey = quoted.key || {
        remoteJid: m.chat,
        fromMe: quoted.fromMe || false,
        id: quoted.id,
        participant: quoted.sender || quoted.participant || quoted.key?.participant
      }

      if (!targetKey?.id) {
        return m.reply('No pude obtener el mensaje para borrarlo.')
      }

      await client.sendMessage(m.chat, {
        delete: {
          remoteJid: targetKey.remoteJid || m.chat,
          fromMe: targetKey.fromMe || false,
          id: targetKey.id,
          participant: targetKey.participant || quoted.sender || undefined
        }
      })

      try {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant || m.sender
          }
        })
      } catch {}

    } catch (e) {
      return m.reply(`No pude borrar ese mensaje.\nError: ${e.message}`)
    }
  }
}