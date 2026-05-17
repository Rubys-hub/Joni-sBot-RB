export default {
  command: ['rt', 'roulette', 'ruleta'],
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
    const currency = botSettings.currency || 'Monedas'

    if (args.length < 2) return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Usa: *${usedPrefix}rt 2000 black* o *${usedPrefix}rt green 2000*`)

    let amount, color

    if (!isNaN(parseInt(args[0]))) {
      amount = parseInt(args[0])
      color = args[1].toLowerCase()
    } else if (!isNaN(parseInt(args[1]))) {
      color = args[0].toLowerCase()
      amount = parseInt(args[1])
    } else {
      return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Formato inválido. Ejemplo: *${usedPrefix}rt 2000 black*`)
    }

    const validColors = ['red', 'black', 'green']

    if (isNaN(amount) || amount < 200) return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Apuesta mínima: *200 ${currency}*.`)
    if (!validColors.includes(color)) return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Elige: *red*, *black* o *green*.`)
    if (user.coins < amount) return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ No tienes suficientes *${currency}*.`)

    const resultColor = validColors[Math.floor(Math.random() * validColors.length)]

    if (resultColor === color) {
      const reward = amount * (resultColor === 'green' ? 14 : 2)
      user.coins += reward
      await client.sendMessage(chatId, { text: `🎡 ʀᴜʟᴇᴛᴀ ✦ Salió *${resultColor}* ✦ Ganaste *S/${reward.toLocaleString()} ${currency}*.`, mentions: [senderId] }, { quoted: m })
    } else {
      user.coins -= amount
      await client.sendMessage(chatId, { text: `🎡 ʀᴜʟᴇᴛᴀ ✦ Salió *${resultColor}* ✦ Perdiste *S/${amount.toLocaleString()} ${currency}*.`, mentions: [senderId] }, { quoted: m })
    }
  }
}