export default {
  command: ['todos', 'invocar', 'tagall'],
  category: 'grupo',
  
  run: async (client, m, args) => {

    const OWNER_NUMBER = '51901931862'
const senderNumber = m.sender.split('@')[0]
const isOwnerBot = senderNumber === OWNER_NUMBER

if (!isOwnerBot && !m.isAdmin) {
  return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
}

    const groupInfo = await client.groupMetadata(m.chat)
    const participants = groupInfo.participants
    const pesan = args.join(' ')
    let teks = `﹒⌗﹒🌱 .ৎ˚₊‧  ${pesan || 'Revivan 🪴'}\n\n𐚁 ֹ ִ \`GROUP TAG\` ! ୧ ֹ ִ🍃\n\n🍄 \`Miembros :\` ${participants.length}\n🌿 \`Solicitado por :\` @${m.sender.split('@')[0]}\n\n` +
      `╭┄ ꒰ \`Lista de usuarios:ׄ\` ꒱ ┄\n`
    for (const mem of participants) {
      teks += `┊⌬ @${mem.id.split('@')[0]}\n`
    }
    teks += `╰⸼ ┄ ┄ ꒰ \`${version}\` ꒱ ┄ ┄⸼`
    return client.reply(m.chat, teks, m, { mentions: [m.sender, ...participants.map(p => p.id)] })
  }
}