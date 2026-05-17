export default {
  command: ['ritual', 'invoke', 'invocar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const botId = client?.user?.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings[botId]
    const monedas = botSettings?.currency || 'Coins'
    const chat = global.db.data.chats[m.chat]

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const user = chat.users[m.sender]
    user.lastinvoke ||= 0

    const remaining = user.lastinvoke - Date.now()
    if (remaining > 0) return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remaining)}* para invocar otro ritual.`)

    user.lastinvoke = Date.now() + 12 * 60 * 1000

    const roll = Math.random()
    let reward = 0
    let narration = ''
    let bonusMsg = ''

    if (roll < 0.05) {
      reward = Math.floor(Math.random() * (13000 - 11000 + 1)) + 11000
      narration = pickRandom(legendaryInvocations)
      bonusMsg = ' ✦ 👑 Recompensa legendaria.'
    } else {
      reward = Math.floor(Math.random() * (11000 - 8000 + 1)) + 8000
      narration = pickRandom(normalInvocations)

      if (Math.random() < 0.15) {
        const bonus = Math.floor(Math.random() * (4500 - 2500 + 1)) + 2500
        reward += bonus
        bonusMsg = ` ✦ Energía extra: *S/${bonus.toLocaleString()} ${monedas}*`
      }
    }

    user.coins += reward

    let msg = `🔮 ʀɪᴛᴜᴀʟ ✦ ${narration} ✦ Ganaste *S/${reward.toLocaleString()} ${monedas}*`
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

const normalInvocations = [
  'tu ritual abre un portal de riquezas',
  'las velas revelan monedas antiguas',
  'el círculo mágico crea gemas brillantes',
  'un espíritu menor te entrega oro',
  'la luna ilumina un tesoro oculto',
  'el humo se convierte en monedas'
]

const legendaryInvocations = [
  'invocaste un espíritu ancestral con un tesoro legendario',
  'un dragón cósmico te concedió riquezas',
  'los dioses antiguos derramaron oro celestial',
  'un ángel guardián dejó un cofre sagrado',
  'un fénix dejó joyas ardientes como recompensa'
]