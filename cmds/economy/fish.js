export default {
  command: ['pescar', 'fish'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    user.lastfish ||= 0

    const remainingTime = user.lastfish - Date.now()
    if (remainingTime > 0) return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remainingTime)}* antes de volver a pescar.`)

    const rand = Math.random()
    let cantidad = 0
    let message

    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000
      user.coins ||= 0
      user.coins += cantidad

      const successMessages = [
        `Pescaste un salmón y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Capturaste una trucha y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Atrapaste un pez dorado y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Sacaste una carpa real y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (6500 - 5000 + 1)) + 5000
      user.coins ||= 0
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

      const failMessages = [
        `Tu anzuelo se enredó y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Una corriente arrastró tu caña y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Un pez rompió tu línea y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Tu bote se dañó y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `Pasaste la tarde pescando, pero ningún pez mordió el anzuelo.`,
        `El agua estuvo tranquila, pero no atrapaste nada.`,
        `Los peces se acercaron, pero escaparon rápido.`,
        `Tu jornada fue relajada, aunque sin recompensa.`
      ]

      message = pickRandom(neutralMessages)
    }

    user.lastfish = Date.now() + 8 * 60 * 1000
    await client.sendMessage(m.chat, { text: `🎣 ᴘᴇsᴄᴀ ✦ ${message}` }, { quoted: m })
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