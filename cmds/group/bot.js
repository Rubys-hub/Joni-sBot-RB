export default {
  command: ['botruby'],
  category: 'grupo',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando solo puede ser usado por administradores del grupo o por el owner del bot.')
    }

    const chat = global.db.data.chats[m.chat]
    const estado = chat.isBanned ?? false

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botName = global.db.data.settings?.[botId]?.namebot || 'RubyJX Bot'

    if (args[0] === 'off') {
      if (estado) return m.reply('《✧》 El *Bot* ya estaba *desactivado* en este grupo.')

      chat.isBanned = true
      return m.reply(`《✧》 Has *Desactivado* a *${botName}* en este grupo.`)
    }

    if (args[0] === 'on') {
      if (!estado) return m.reply(`《✧》 *${botName}* ya estaba *activado* en este grupo.`)

      chat.isBanned = false
      return m.reply(`《✧》 Has *Activado* a *${botName}* en este grupo.`)
    }

    return m.reply(`*✿ Estado de ${botName} (｡•́‿•̀｡)*

✐ *Actual ›* ${estado ? '✗ Desactivado' : '✓ Activado'}

✎ Puedes cambiarlo con:
> ● _Activar ›_ *${currentPrefix}botruby on*
> ● _Desactivar ›_ *${currentPrefix}botruby off*`)
  }
}