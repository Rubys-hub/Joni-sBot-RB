export default {
  command: ['cazar', 'hunt'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    user.lasthunt ||= 0
    if (user.coins == null) user.coins = 0
    if (user.health == null) user.health = 100

    if (user.health < 5) return m.reply(`❤️ sᴀʟᴜᴅ ʙᴀᴊᴀ ✦ No tienes suficiente salud para volver a *cazar*. ✦ Usa *${usedPrefix}heal* para curarte.`)

    if (Date.now() < user.lasthunt) {
      const restante = user.lasthunt - Date.now()
      return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(restante)}* antes de volver a cazar.`)
    }

    const rand = Math.random()
    let cantidad = 0
    let salud = Math.floor(Math.random() * (15 - 10 + 1)) + 10
    let message

    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (13000 - 10000 + 1)) + 10000
      user.coins += cantidad
      user.health -= salud

      const successMessages = [
        `Cazaste un oso y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Cazaste un tigre feroz y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Cazaste un jabalí salvaje y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Cazaste un ciervo robusto y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000
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

      user.health -= salud
      if (user.health < 0) user.health = 0

      const failMessages = [
        `Tu presa escapó y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Tu arco se rompió y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Un jabalí te embistió y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Un tigre te sorprendió y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `Pasaste la tarde cazando, pero no atrapaste nada.`,
        `El bosque estuvo tranquilo y los animales se escondieron.`,
        `Encontraste huellas frescas, pero la presa escapó.`,
        `Tu jornada fue tranquila, aunque sin recompensas.`
      ]

      message = pickRandom(neutralMessages)
    }

    user.lasthunt = Date.now() + 15 * 60 * 1000
    await client.sendMessage(m.chat, { text: `🏹 ᴄᴀᴢᴀ ✦ ${message}` }, { quoted: m })
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