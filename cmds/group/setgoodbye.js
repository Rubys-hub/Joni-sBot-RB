export default {
  command: ['setgoodbye'],
  category: 'grupo',
  
  run: async (client, m, args, usedPrefix, command, text) => {

    const OWNER_NUMBER = '51901931862'
const senderNumber = m.sender.split('@')[0]
const isOwnerBot = senderNumber === OWNER_NUMBER

if (!isOwnerBot && !m.isAdmin) {
  return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
}

    if (!global?.db?.data?.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    const value = text ? text.trim() : ''
    if (!value) {
      return m.reply(`⌬ Debes enviar un mensaje para establecerlo como mensaje de despedida.\n> Puedes usar {usuario}, {grupo} y {desc} como variables dinámicas.\n\n✐ Ejemplo:\n${usedPrefix + command} Adiós {usuario}, te extrañaremos en {grupo}!`)
    }
    chat.sGoodbye = value
    return m.reply(`⌬ Has establecido el mensaje de despedida correctamente.`)
  }
}