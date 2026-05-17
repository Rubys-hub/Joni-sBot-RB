export default {
  command: ['mine', 'minar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const botId = client?.user?.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings[botId]
    const monedas = botSettings?.currency || 'Coins'
    const chat = global.db.data.chats[m.chat]

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const user = chat.users[m.sender]
    user.health ??= 100
    user.lastmine ||= 0

    if (user.health < 5) return m.reply(`❤️ sᴀʟᴜᴅ ʙᴀᴊᴀ ✦ No tienes suficiente salud para volver a *minar*. ✦ Usa *${usedPrefix}heal* para curarte.`)

    const remaining = user.lastmine - Date.now()
    if (remaining > 0) return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remaining)}* para minar de nuevo.`)

    user.lastmine = Date.now() + 10 * 60 * 1000

    const isLegendary = Math.random() < 0.02
    let reward
    let narration
    let bonusMsg = ''

    if (isLegendary) {
      reward = Math.floor(Math.random() * (13000 - 11000 + 1)) + 11000
      narration = 'descubriste un tesoro legendario'
      bonusMsg = ' ✦ 🏆 Recompensa épica.'
    } else {
      reward = Math.floor(Math.random() * (9500 - 7000 + 1)) + 7000
      narration = `En ${pickRandom(escenarios)}, ${pickRandom(mineria)}`

      if (Math.random() < 0.1) {
        const bonus = Math.floor(Math.random() * (4500 - 2500 + 1)) + 2500
        reward += bonus
        bonusMsg = ` ✦ Bonus: *S/${bonus.toLocaleString()} ${monedas}*`
      }
    }

    user.coins += reward

    const salud = Math.floor(Math.random() * (15 - 5 + 1)) + 5
    user.health = Math.max(0, user.health - salud)

    let msg = `⛏️ ᴍɪɴᴀ ✦ ${narration} ✦ Ganaste *S/${reward.toLocaleString()} ${monedas}*`
    if (bonusMsg) msg += bonusMsg

    await client.reply(m.chat, msg, m)
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

const escenarios = [
  'una cueva oscura',
  'una mina abandonada',
  'un bosque misterioso',
  'un río cristalino',
  'unas ruinas antiguas',
  'un valle escondido'
]

const mineria = [
  'encontraste un cofre con monedas',
  'hallaste una bolsa de oro',
  'rompiste una roca llena de gemas',
  'desenterraste monedas antiguas',
  'encontraste un saco de tesoros',
  'descubriste minerales brillantes'
]