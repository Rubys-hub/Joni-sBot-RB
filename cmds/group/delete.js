export default {
  command: ['delete', 'del', 'borrar'],
  category: 'grupo',
  botAdmin: false,

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
        fromMe: quoted.fromMe || quoted.isBot || false,
        id: quoted.id,
        participant: quoted.sender || quoted.participant || quoted.key?.participant
      }

      if (!targetKey?.id) {
        return m.reply('No pude obtener el mensaje para borrarlo.')
      }

      // Intenta borrar el mensaje citado.
      // Si el bot no es admin y el mensaje es de otra persona, WhatsApp rechaza la acción
      // y el "catch" hace que falle en silencio, exactamente como pediste.
      try {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: targetKey.remoteJid || m.chat,
            fromMe: targetKey.fromMe || false,
            id: targetKey.id,
            participant: targetKey.participant || quoted.sender || undefined
          }
        })
      } catch {}

      // Intenta borrar el mensaje del comando.
      // Corregido a m.key.fromMe para que identifique correctamente si el mensaje es suyo.
      try {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: m.key.fromMe || false,
            id: m.key.id,
            participant: m.key.participant || m.sender
          }
        })
      } catch {}

    } catch (e) {
      // Solo reporta error si algo crítico falla, no si falla el borrado silencioso
      return m.reply(`No pude procesar la solicitud.\nError: ${e.message}`)
    }
  }
}