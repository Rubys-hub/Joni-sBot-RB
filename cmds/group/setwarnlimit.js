export default {
  command: ['setwarnlimit'],
  category: 'group',
  
  run: async (client, m, args) => {

    const OWNER_NUMBER = '51901931862'
const senderNumber = m.sender.split('@')[0]
const isOwnerBot = senderNumber === OWNER_NUMBER

if (!isOwnerBot && !m.isAdmin) {
  return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
}

    const chat = global.db.data.chats[m.chat]
    const raw = args[0]
    const limit = parseInt(raw)
    if (isNaN(limit) || limit < 0 || limit > 10) {
      return m.reply(`✐ El límite de advertencias debe ser un número entre \`1\` y \`10\`, o \`0\` para desactivar.\n> Ejemplo 1 › *${prefa}setwarnlimit 5*\n> Ejemplo 2 › *${prefa}setwarnlimit 0*\n\n> Si usas \`0\`, se desactivará la función de eliminar usuarios al alcanzar el límite de advertencias.\n❖ Estado actual: ${chat.expulsar ? `\`${chat.warnLimit}\` advertencias` : '`Desactivado`'}`)
    }
    if (limit === 0) {
      chat.warnLimit = 0
      chat.expulsar = false
      return m.reply(`✐ Has desactivado la función de eliminar usuarios al alcanzar el límite de advertencias.`)
    }
    chat.warnLimit = limit
    chat.expulsar = true
    await m.reply(`✐ Límite de advertencias establecido en \`${limit}\` para este grupo.\n> ❖ Los usuarios serán eliminados automáticamente al alcanzar este límite.`)
  },
};