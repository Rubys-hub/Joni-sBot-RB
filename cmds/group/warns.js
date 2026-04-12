import { resolveLidToRealJid } from "../../core/utils.js"

export default {
  command: ['warns'],
  category: 'group',
  
  run: async (client, m, args) => {

    const OWNER_NUMBER = '51901931862'
const senderNumber = m.sender.split('@')[0]
const isOwnerBot = senderNumber === OWNER_NUMBER

if (!isOwnerBot && !m.isAdmin) {
  return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
}


    const chat = global.db.data.chats[m.chat]
    const mentioned = m.mentionedJid
    const who2 = mentioned.length > 0 ? mentioned[0] : m.quoted ? m.quoted.sender : false
   const userId = await resolveLidToRealJid(who2, client, m.chat);
    if (!who2 || !chat.users[userId]) {
      return m.reply('《✧》 Menciona o responde a un usuario válido para ver sus advertencias.')
    }
    const user = chat.users[userId]
    const total = user.warnings?.length || 0
    if (total === 0) {
      return client.reply(m.chat, `《✧》 @${userId.split('@')[0]} no tiene advertencias registradas.`, m, { mentions: [userId] })
    }
    const name = (global.db.data.users[userId].name) || 'Usuario'
    const warningList = user.warnings.map((w, i) => {
        const index = total - i
        const author = w.by ? `\n> » Por: @${w.by.split('@')[0]}` : ''
        return `\`#${index}\` » ${w.reason}\n> » Fecha: ${w.timestamp}${author}`
      }).join('\n')
    await client.reply(m.chat, `✐ Advertencias de @${userId.split('@')[0]} (${name}):\n> ✧ Total de advertencias: \`${total}\`\n\n${warningList}`, m, { mentions: [userId, ...user.warnings.map(w => w.by).filter(Boolean)] })
  },
};