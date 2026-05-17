export default {
  command: ['crime', 'crimen'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const monedas = global.db.data.settings[botId].currency

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    user.lastcrime ||= 0

    const remainingTime = user.lastcrime - Date.now()
    if (remainingTime > 0) return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remainingTime)}* antes de intentar nuevamente.`)

    const exito = Math.random() < 0.4
    let cantidad

    if (exito) {
      cantidad = Math.floor(Math.random() * (7500 - 5500 + 1)) + 5500
      user.coins += cantidad
    } else {
      cantidad = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000
      user.bank ||= 0

      const total = user.coins + user.bank
      if (total >= cantidad) {
        if (user.coins >= cantidad) user.coins -= cantidad
        else {
          const restante = cantidad - user.coins
          user.coins = 0
          user.bank -= restante
        }
      } else {
        cantidad = total
        user.coins = 0
        user.bank = 0
      }
    }

    user.lastcrime = Date.now() + 7 * 60 * 1000

    const successMessages = [
      `Hiciste un movimiento arriesgado y ganaste *S/${cantidad.toLocaleString()} ${monedas}*.`,
      `Lograste escapar sin ser visto y ganaste *S/${cantidad.toLocaleString()} ${monedas}*.`,
      `Tu plan salió perfecto y ganaste *S/${cantidad.toLocaleString()} ${monedas}*.`,
      `Con mucha suerte conseguiste *S/${cantidad.toLocaleString()} ${monedas}*.`
    ]

    const failMessages = [
      `Tu plan salió mal y perdiste *S/${cantidad.toLocaleString()} ${monedas}*.`,
      `Te atraparon en el intento y perdiste *S/${cantidad.toLocaleString()} ${monedas}*.`,
      `Fallaste la jugada y perdiste *S/${cantidad.toLocaleString()} ${monedas}*.`,
      `La suerte no estuvo de tu lado y perdiste *S/${cantidad.toLocaleString()} ${monedas}*.`
    ]

    const message = exito ? pickRandom(successMessages) : pickRandom(failMessages)
    await client.sendMessage(m.chat, { text: `🕵️ ᴄʀɪᴍᴇ ✦ ${message}` }, { quoted: m })
  }
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return minutes <= 0 ? `${seconds} segundo${seconds !== 1 ? 's' : ''}` : `${minutes} minuto${minutes !== 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}