export default {
  command: ['kickall'],
  category: 'grupo',

  botAdmin: true,
  group: true,

  run: async (client, m, args, usedPrefix, command) => {
    const OWNER_NUMBER = '51901931862'
    const normalizeNumber = (jid = '') => String(jid).split('@')[0].split(':')[0].replace(/\D/g, '')
    const ownerNumbers = [OWNER_NUMBER, ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [global.owner])]
      .map(normalizeNumber)
      .filter((number, index, list) => number.length > 5 && list.indexOf(number) === index)
    const isBotOwnerJid = (jid = '') => ownerNumbers.includes(normalizeNumber(jid))
    const participantIds = (participant, fallback) => [
      fallback,
      participant?.id,
      participant?.jid,
      participant?.lid,
      participant?.phoneNumber,
    ]
    const sameIdentity = (a = '', b = '') => {
      const textA = String(a)
      const textB = String(b)
      const numberA = normalizeNumber(textA)
      const numberB = normalizeNumber(textB)
      return (textA && textA === textB) || (numberA && numberB && numberA === numberB)
    }
    const senderNumber = normalizeNumber(m.sender)
    const botNumber = normalizeNumber(client.user.id)
    const isOwnerBot = ownerNumbers.includes(senderNumber) || senderNumber === botNumber

    if (!isOwnerBot) {
      return m.reply('Este comando solo puede ser usado por el owner del bot o por el número del bot.')
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    try {
      const groupInfo = await client.groupMetadata(m.chat)
      const participants = groupInfo.participants || []

      const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
      const botJid = client.decodeJid(client.user.id)

      const kickList = participants
        .filter(participant => {
          const ids = participantIds(participant, participant.id || participant.jid || participant.lid)
          return ids.some(Boolean) &&
            !ids.some(id => sameIdentity(id, botJid)) &&
            !ids.some(id => sameIdentity(id, ownerGroup)) &&
            !ids.some(id => sameIdentity(id, m.sender)) &&
            !ids.some(isBotOwnerJid)
        })
        .map(participant => participant.id || participant.jid || participant.lid || participant.phoneNumber)

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
