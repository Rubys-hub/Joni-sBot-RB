export default {
  command: ['setgpname'],
  category: 'grupo',
  
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {

    const OWNER_NUMBER = '51901931862'
const senderNumber = m.sender.split('@')[0]
const isOwnerBot = senderNumber === OWNER_NUMBER

if (!isOwnerBot && !m.isAdmin) {
  return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
}

    const newName = args.join(' ').trim()
    if (!newName)
      return m.reply('《✧》 Por favor, ingrese el nuevo nombre que desea ponerle al grupo.')
    try {
      await client.groupUpdateSubject(m.chat, newName)
      m.reply(`✿ El nombre del grupo se modificó correctamente.`)
    } catch (e) {
     return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
