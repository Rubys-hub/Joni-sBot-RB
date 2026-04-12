export default {
  command: ['setgpdesc'],
  category: 'grupo',
  
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {

    const OWNER_NUMBER = '51901931862'
const senderNumber = m.sender.split('@')[0]
const isOwnerBot = senderNumber === OWNER_NUMBER

if (!isOwnerBot && !m.isAdmin) {
  return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
}

    const newDesc = args.join(' ').trim()
    if (!newDesc)
      return m.reply('《✧》 Por favor, ingrese la nueva descripción que desea ponerle al grupo.')

    try {
      await client.groupUpdateDescription(m.chat, newDesc)
      m.reply('✿ La descripción del grupo se modificó correctamente.')
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
