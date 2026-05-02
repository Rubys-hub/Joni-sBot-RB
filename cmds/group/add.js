export default {
  command: ['add'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {

    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
    }

    if (!m.isGroup) {
      return m.reply('Este comando solo funciona en grupos.')
    }

    if (!args[0]) {
      return m.reply(`《✧》 Ingresa un número.\n\nEjemplo:\n${usedPrefix + command} +51999999999`)
    }

    try {
      // limpiar número (acepta + o sin +)
      let number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      await client.groupParticipantsUpdate(m.chat, [number], 'add')

      await client.sendMessage(
        m.chat,
        { text: `✿ Usuario agregado correctamente: @${number.split('@')[0]}`, mentions: [number] },
        { quoted: m }
      )

    } catch (e) {
      console.log(e)
      return m.reply(`❌ No se pudo agregar al usuario.\n> Error: ${e.message}`)
    }
  }
}