export default {
  command: ['kickall'],
  category: 'grupo',

  botAdmin: true,
  group: true,

  run: async (client, m, args, usedPrefix, command) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const botNumber = client.user.id.split(':')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER || senderNumber === botNumber

    if (!isOwnerBot) {
      return m.reply('Este comando solo puede ser usado por el owner del bot o por el número del bot.')
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    try {
      const groupInfo = await client.groupMetadata(m.chat)
      const participants = groupInfo.participants || []

      const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
      const ownerBot = global.owner?.[0]?.[0]
        ? global.owner[0][0] + '@s.whatsapp.net'
        : OWNER_NUMBER + '@s.whatsapp.net'

      const botJid = client.decodeJid(client.user.id)

      const kickList = participants
        .map(p => p.id || p.jid || p.lid)
        .filter(Boolean)
        .filter(user =>
          user !== botJid &&
          user !== ownerGroup &&
          user !== ownerBot &&
          user !== m.sender
        )

      if (!kickList.length) {
        return m.reply('No encontré usuarios para expulsar.')
      }

      await m.reply(`Iniciando limpieza...\nUsuarios a expulsar: ${kickList.length}`)

      let eliminados = 0
      let fallos = 0

      for (const user of kickList) {
        try {
          await client.groupParticipantsUpdate(m.chat, [user], 'remove')
          eliminados++
          await sleep(1200)
        } catch (e) {
          fallos++
          console.log('Error expulsando a', user, e)
        }
      }

      return m.reply(`Limpieza terminada.\n\nExpulsados: ${eliminados}\nFallos: ${fallos}`)
    } catch (e) {
      return m.reply(`Error en ${usedPrefix + command}\n[${e.message}]`)
    }
  },
}