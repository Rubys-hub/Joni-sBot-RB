export default {
  command: ['anclar', 'pin'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    if (!m.quoted) {
      return m.reply('Responde al mensaje que quieres anclar.')
    }

    try {
      await client.sendMessage(m.chat, {
        pin: {
          type: 1,
          time: 604800,
          key: m.quoted.key
        }
      })
    } catch (e) {
      console.log(e)
      return m.reply(`No se pudo anclar el mensaje.\n> Error: ${e.message}`)
    }
  }
}