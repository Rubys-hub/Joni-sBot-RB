export default {
  command: ['slut', 'prostituirse'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat
    const senderId = m.sender
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const user = chatData.users[m.sender]
    const cooldown = 5 * 60 * 1000
    const now = Date.now()
    const remaining = (user.lastslut || 0) - now
    const currency = botSettings.currency || 'Monedas'

    if (remaining > 0) return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remaining)}* antes de intentar nuevamente.`)

    const success = Math.random() < 0.5
    const amount = success
      ? Math.floor(Math.random() * (6000 - 3500 + 1)) + 3500
      : Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000

    user.lastslut = now + cooldown

    const winMessages = [
      `Hiciste un show privado y ganaste *S/${amount.toLocaleString()} ${currency}*.`,
      `Tu actuación fue un éxito y ganaste *S/${amount.toLocaleString()} ${currency}*.`,
      `Te contrataron para un evento elegante y ganaste *S/${amount.toLocaleString()} ${currency}*.`,
      `Vendiste contenido exclusivo y ganaste *S/${amount.toLocaleString()} ${currency}*.`,
      `Tu presentación se volvió popular y ganaste *S/${amount.toLocaleString()} ${currency}*.`
    ]

    const loseMessages = [
      `Tu show salió mal y perdiste *S/${amount.toLocaleString()} ${currency}*.`,
      `Cancelaron el evento y perdiste *S/${amount.toLocaleString()} ${currency}*.`,
      `Invertiste en vestuario y no recuperaste nada, perdiste *S/${amount.toLocaleString()} ${currency}*.`,
      `Tu actuación no convenció y perdiste *S/${amount.toLocaleString()} ${currency}*.`,
      `Un mal día te dejó pérdidas de *S/${amount.toLocaleString()} ${currency}*.`
    ]

    const message = success
      ? winMessages[Math.floor(Math.random() * winMessages.length)]
      : loseMessages[Math.floor(Math.random() * loseMessages.length)]

    if (success) {
      user.coins = (user.coins || 0) + amount
    } else {
      const total = (user.coins || 0) + (user.bank || 0)

      if (total >= amount) {
        if (user.coins >= amount) {
          user.coins -= amount
        } else {
          const remainingLoss = amount - user.coins
          user.coins = 0
          user.bank -= remainingLoss
        }
      } else {
        user.coins = 0
        user.bank = 0
      }
    }

    await client.sendMessage(chatId, { text: `💋 ʀɪᴇsɢᴏ ✦ ${message}`, mentions: [senderId] }, { quoted: m })
  }
}

const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const pad = (n) => n.toString().padStart(2, '0')
  if (minutes === 0) return `${pad(seconds)} segundo${seconds !== 1 ? 's' : ''}`
  return `${pad(minutes)} minuto${minutes !== 1 ? 's' : ''}, ${pad(seconds)} segundo${seconds !== 1 ? 's' : ''}`
}