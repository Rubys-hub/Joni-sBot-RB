export default {
  command: ['adventure', 'aventura'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency
    if (chat.adminonly || !chat.economy) return client.reply(m.chat, `⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`, m)

    user.lastadventure ||= 0
    if (user.coins == null) user.coins = 0
    if (user.health == null) user.health = 100

    if (user.health < 5) return m.reply(`❤️ sᴀʟᴜᴅ ʙᴀᴊᴀ ✦ No tienes suficiente salud para volver a *aventurarte*. ✦ Usa *${usedPrefix}heal* para curarte.`)

    const remainingTime = user.lastadventure - Date.now()
    if (remainingTime > 0) return client.reply(m.chat, `⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remainingTime)}* antes de volver a aventurarte.`, m)

    const rand = Math.random()
    let cantidad = 0
    let salud = Math.floor(Math.random() * (20 - 10 + 1)) + 10
    let message

    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (18000 - 14000 + 1)) + 14000
      user.coins += cantidad
      user.health -= salud

      const successMessages = [
        `Derrotaste a un ogro de Drakonia y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Ganaste el torneo de Valoria y recibiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Rescataste un libro mágico y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Venciste trolls en Ulderan y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Derrotaste a un dragón joven y ganaste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (11000 - 9000 + 1)) + 9000
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
        `Un hechicero oscuro te maldijo y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Te asaltaron en la jungla de Zarkelia y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Un basilisco te embistió y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`,
        `Caíste en una trampa mágica y perdiste *S/${cantidad.toLocaleString()} ${currency}*.`
      ]

      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `Exploraste ruinas antiguas y aprendiste secretos ocultos.`,
        `Seguiste a un espectro, pero desapareció entre la niebla.`,
        `Recorriste un bosque encantado y descubriste nuevas rutas.`,
        `Visitaste una aldea remota y escuchaste viejas historias.`
      ]

      message = pickRandom(neutralMessages)
    }

    user.lastadventure = Date.now() + 20 * 60 * 1000
    await client.sendMessage(m.chat, { text: `⚔️ ᴀᴠᴇɴᴛᴜʀᴀ ✦ ${message}` }, { quoted: m })
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