export default {
  command: ['dep', 'deposit', 'd'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chatData = global.db.data.chats[m.chat]
    const user = chatData.users[m.sender]
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings[idBot]
    const monedas = settings.currency

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    if (!args[0]) return m.reply(`🏦 ᴅᴇᴘᴏsɪᴛ ✦ Ingresa una cantidad o usa *all*.`)

    if (args[0].toLowerCase() === 'all') {
      if (user.coins <= 0) return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ No tienes *${monedas}* para depositar.`)
      const count = user.coins
      user.coins = 0
      user.bank += count
      return m.reply(`🏦 ᴅᴇᴘᴏsɪᴛ ✦ Guardaste *S/${count.toLocaleString()} ${monedas}* en tu banco.`)
    }

    const count = parseInt(args[0])
    if (!count || count < 1) return m.reply(`✎ ᴀᴠɪsᴏ ✦ Ingresa una cantidad válida.`)
    if (user.coins < count) return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ No tienes suficientes *${monedas}* para depositar.`)

    user.coins -= count
    user.bank += count

    await m.reply(`🏦 ᴅᴇᴘᴏsɪᴛ ✦ Guardaste *S/${count.toLocaleString()} ${monedas}* en tu banco.`)
  }
}