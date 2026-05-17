export default {
  command: ['weekly', 'semanal'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chat = db.chats[m.chat]

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const user = db.chats[m.chat].users[m.sender]
    const users = db.users[m.sender]

    const gap = 604800000
    const now = Date.now()

    users.weeklyStreak ||= 0
    users.lastWeeklyGlobal ||= 0
    user.coins ||= 0
    user.lastweekly ||= 0

    if (now < user.lastweekly) {
      const wait = formatTime(Math.floor((user.lastweekly - now) / 1000))
      return client.reply(m.chat, `⏳ ᴇsᴘᴇʀᴀ ✦ Ya reclamaste tu recompensa semanal. ✦ Vuelve en *${wait}*`, m)
    }

    const lost = users.weeklyStreak >= 1 && now - users.lastWeeklyGlobal > gap * 1.5
    if (lost) users.weeklyStreak = 0

    const canClaimWeeklyGlobal = now - users.lastWeeklyGlobal >= gap

    if (canClaimWeeklyGlobal) {
      users.weeklyStreak = Math.min(users.weeklyStreak + 1, 30)
      users.lastWeeklyGlobal = now
    }

    const coins = Math.min(40000 + (users.weeklyStreak - 1) * 5000, 185000)
    user.coins += coins
    user.lastweekly = now + gap

    const nextReward = Math.min(40000 + users.weeklyStreak * 5000, 185000).toLocaleString()

    let msg = `🎁 sᴇᴍᴀɴᴀʟ ✦ Reclamaste *S/${coins.toLocaleString()} ${currency}* ✦ Semana *${users.weeklyStreak}* ✦ Próximo: *+S/${nextReward}*`
    if (lost) msg += ` ✦ ⚠️ Perdiste tu racha.`

    client.reply(m.chat, msg, m)
  }
}

function formatTime(t) {
  const d = Math.floor(t / 86400)
  const h = Math.floor((t % 86400) / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  if (d) return `${d} día${d !== 1 ? 's' : ''} ${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''}`
  if (h) return `${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`
  if (m) return `${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`
  return `${s} segundo${s !== 1 ? 's' : ''}`
}