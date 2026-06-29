export default {
  command: ['kick'],
  category: 'grupo',
  
  botAdmin: true,
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
    const isOwnerBot = isBotOwnerJid(m.sender)

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
    }


    if (!m.mentionedJid[0] && !m.quoted) {
      return m.reply('《✧》 Etiqueta o responde al *mensaje* de la *persona* que quieres eliminar')
    }
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    const groupInfo = await client.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const participant = groupInfo.participants.find((p) => p.phoneNumber === user || p.jid === user || p.id === user || p.lid === user)
    if (!participant) {
      return client.reply(m.chat, `《✧》 *@${user.split('@')[0]}* ya no está en el grupo.`, m, { mentions: [user] })
    }
    if (user === client.decodeJid(client.user.id)) {
      return m.reply('《✧》 No puedo eliminar al *bot* del grupo')
    }
    if (user === ownerGroup) {
      return m.reply('《✧》 No puedo eliminar al *propietario* del grupo')
    }
    if (participantIds(participant, user).some(isBotOwnerJid)) {
      return m.reply('《✧》 No puedo eliminar al *propietario* del bot')
    }
    try {
      await client.groupParticipantsUpdate(m.chat, [user], 'remove')
      client.reply(m.chat, `✎ @${user.split('@')[0]} *eliminado* correctamente`, m, { mentions: [user] })
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
