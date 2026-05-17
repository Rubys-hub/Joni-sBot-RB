export default {
  command: ['cf', 'flip', 'coinflip'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings[botId]
    const monedas = botSettings.currency

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    let cantidad, eleccion
    const a0 = parseFloat(args[0])
    const a1 = parseFloat(args[1])

    if (!isNaN(a0)) {
      cantidad = a0
      eleccion = (args[1] || '').toLowerCase()
    } else if (!isNaN(a1)) {
      cantidad = a1
      eleccion = (args[0] || '').toLowerCase()
    } else {
      return m.reply(`🪙 ᴄᴏɪɴғʟɪᴘ ✦ Usa: *${usedPrefix + command} 200 cara* o *${usedPrefix + command} cruz 200*`)
    }

    if (Math.abs(cantidad) < 100) return m.reply(`🪙 ᴄᴏɪɴғʟɪᴘ ✦ Apuesta mínima: *100 ${monedas}*.`)
    if (!['cara', 'cruz'].includes(eleccion)) return m.reply(`🪙 ᴄᴏɪɴғʟɪᴘ ✦ Elige *cara* o *cruz*.`)
    if (cantidad > user.coins) return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ Tienes *S/${user.coins.toLocaleString()} ${monedas}* fuera del banco.`)

    const resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
    const acierto = resultado === eleccion
    const cambio = acierto ? cantidad : -cantidad

    user.coins += cambio
    if (user.coins < 0) user.coins = 0

    const mensaje = `🪙 ᴄᴏɪɴғʟɪᴘ ✦ Cayó *${capitalize(resultado)}* ✦ Elegiste *${capitalize(eleccion)}* ✦ ${acierto ? 'Ganaste' : 'Perdiste'} *S/${Math.abs(cambio).toLocaleString()} ${monedas}*.`
    await client.sendMessage(m.chat, { text: mensaje }, { quoted: m })
  }
}

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1)
}