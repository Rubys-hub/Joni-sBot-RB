export default {
  command: ['dungeon', 'mazmorra'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    user.lastdungeon ||= 0
    if (user.coins == null) user.coins = 0
    if (user.health == null) user.health = 100

    if (user.health < 5) return m.reply(`❤️ sᴀʟᴜᴅ ʙᴀᴊᴀ ✦ No tienes suficiente salud para volver a la *mazmorra*. ✦ Usa *${usedPrefix}heal* para curarte.`)

    if (Date.now() < user.lastdungeon) {
      const restante = user.lastdungeon - Date.now()
      return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(restante)}* antes de volver a la mazmorra.`)
    }

    const rand = Math.random()
    let cantidad = 0
    let salud = Math.floor(Math.random() * (18 - 10 + 1)) + 10
    let message

    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (15000 - 12000 + 1)) + 12000
      user.coins += cantidad
      user.health -= salud

      const successMessages = [
        `Derrotaste al guardián de las ruinas y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Descifraste runas antiguas y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Un espíritu ancestral te premió con *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Derrotaste a un gólem de obsidiana y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (9000 - 7500 + 1)) + 7500
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
        `Un espectro te drenó energía y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Un basilisco te sorprendió y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Una criatura oscura robó tu botín y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `El demonio de las sombras te derrotó y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `Activaste una trampa, pero lograste escapar sin pérdidas.`,
        `La sala cambió de forma y perdiste tiempo explorando.`,
        `Caíste en una ilusión, pero fortaleciste tu mente.`,
        `Encontraste símbolos antiguos, pero ningún tesoro.`
      ]

      message = pickRandom(neutralMessages)
    }

    user.lastdungeon = Date.now() + 17 * 60 * 1000
    await client.sendMessage(m.chat, { text: `🏰 ᴍᴀᴢᴍᴏʀʀᴀ ✦ ${message}` }, { quoted: m })
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