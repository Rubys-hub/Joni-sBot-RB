export default {
  command: ['withdraw', 'with', 'retirar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const user = chatData.users[m.sender]
    const currency = botSettings.currency || 'Monedas'

    if (!args[0]) return m.reply(`🏦 ᴡɪᴛʜᴅʀᴀᴡ ✦ Ingresa una cantidad o usa *all*.`)

    if (args[0].toLowerCase() === 'all') {
      if ((user.bank || 0) <= 0) return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ No tienes *${currency}* en tu banco.`)

      const amount = user.bank
      user.bank = 0
      user.coins = (user.coins || 0) + amount

      return m.reply(`🏦 ᴡɪᴛʜᴅʀᴀᴡ ✦ Retiraste *S/${amount.toLocaleString()} ${currency}* del banco.`)
    }

    const count = parseInt(args[0])

    if (isNaN(count) || count < 1) {
      return m.reply(`✎ ᴜsᴏ ✦ Cantidad inválida. Ejemplo: *${usedPrefix + command} 25000* o *${usedPrefix + command} all*`)
    }

    if ((user.bank || 0) < count) {
      return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ En tu banco solo tienes *S/${(user.bank || 0).toLocaleString()} ${currency}*.`)
    }

    user.bank -= count
    user.coins = (user.coins || 0) + count

    await m.reply(`🏦 ᴡɪᴛʜᴅʀᴀᴡ ✦ Retiraste *S/${count.toLocaleString()} ${currency}* del banco.`)
  }
}