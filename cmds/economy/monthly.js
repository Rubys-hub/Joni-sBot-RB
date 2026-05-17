export default {
  command: ['monthly', 'mensual'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = global.db.data.settings[botId]
    const currency = bot.currency

    const user = global.db.data.chats[m.chat].users[m.sender]
    const users = global.db.data.users[m.sender]

    const gap = 2592000000
    const now = Date.now()

    users.monthlyStreak ||= 0
    users.lastMonthlyGlobal ||= 0
    user.coins ||= 0
    user.lastmonthly ||= 0

    if (now < user.lastmonthly) {
      const wait = formatTime(Math.floor((user.lastmonthly - now) / 1000))
      return client.sendMessage(m.chat, { text: `⏳ ᴇsᴘᴇʀᴀ ✦ Ya reclamaste tu recompensa mensual. ✦ Vuelve en *${wait}*` }, { quoted: m })
    }

    const lost = users.monthlyStreak >= 1 && now - users.lastMonthlyGlobal > gap * 1.5
    if (lost) users.monthlyStreak = 0

    const canClaimGlobal = now - users.lastMonthlyGlobal >= gap
    if (canClaimGlobal) {
      users.monthlyStreak = Math.min(users.monthlyStreak + 1, 8)
      users.lastMonthlyGlobal = now
    }

    const coins = Math.min(60000 + (users.monthlyStreak - 1) * 5000, 95000)
    user.coins += coins
    user.lastmonthly = now + gap

    const next = Math.min(60000 + users.monthlyStreak * 5000, 95000).toLocaleString()
    let msg = `🎁 ᴍᴇɴsᴜᴀʟ ✦ Reclamaste *+${coins.toLocaleString()} ${currency}* ✦ Mes *${users.monthlyStreak}* ✦ Próximo: *+${next}*`
    if (lost) msg += ` ✦ ⚠️ Perdiste tu racha.`

    await client.sendMessage(m.chat, { text: msg }, { quoted: m })
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
