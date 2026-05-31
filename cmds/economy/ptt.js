import { applyEventoEconomyMultiplier } from '../adminabuse/eventoEconomy.js'

export default {
  command: ['ppt'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency
    const botname = botSettings.namebot
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)
    }

    const user = chatData.users[m.sender]
    user.lastppt ||= 0
    user.coins ||= 0
    user.bank ||= 0

    const remainingTime = user.lastppt - Date.now()
    if (remainingTime > 0) {
      return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${msToTime(remainingTime)}* antes de jugar otra vez.`)
    }

    const options = ['piedra', 'papel', 'tijera']
    const userChoice = args[0]?.trim().toLowerCase()

    if (!options.includes(userChoice)) {
      return m.reply(
        `> *[ ⌬ ] ✊ PPT*\n\n` +
        `📌 *Uso:*\n` +
        `• ${usedPrefix}ppt piedra\n` +
        `• ${usedPrefix}ppt papel\n` +
        `• ${usedPrefix}ppt tijera`
      )
    }

    const botChoice = options[Math.floor(Math.random() * options.length)]
    const result = determineWinner(userChoice, botChoice)
    const reward = Math.floor(Math.random() * (5500 - 3000 + 1)) + 3000
    const loss = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
    const tieReward = Math.floor(Math.random() * (1500 - 800 + 1)) + 800

    let text = ''

    if (result === 'win') {
      const eventMult = await applyEventoEconomyMultiplier(chatId, reward, {
        currency: monedas
      })

      user.coins += eventMult.amount

      text =
        `> *[ ⌬ ] ✊ PPT — GANASTE*\n\n` +
        `👤 *Tú:* ${userChoice}\n` +
        `🤖 *${botname}:* ${botChoice}\n` +
        `💰 *Premio:* +S/${eventMult.amount.toLocaleString()} ${monedas}` +
        `${eventMult.text || ''}`
    } else if (result === 'lose') {
      const total = user.coins + user.bank
      const actualLoss = Math.min(loss, total)

      if (user.coins >= actualLoss) {
        user.coins -= actualLoss
      } else {
        const remaining = actualLoss - user.coins
        user.coins = 0
        user.bank = Math.max(0, user.bank - remaining)
      }

      text =
        `> *[ ⌬ ] ✊ PPT — PERDISTE*\n\n` +
        `👤 *Tú:* ${userChoice}\n` +
        `🤖 *${botname}:* ${botChoice}\n` +
        `💸 *Pérdida:* -S/${actualLoss.toLocaleString()} ${monedas}`
    } else {
      const eventMult = await applyEventoEconomyMultiplier(chatId, tieReward, {
        currency: monedas
      })

      user.coins += eventMult.amount

      text =
        `> *[ ⌬ ] ✊ PPT — EMPATE*\n\n` +
        `👤 *Tú:* ${userChoice}\n` +
        `🤖 *${botname}:* ${botChoice}\n` +
        `💰 *Recompensa:* +S/${eventMult.amount.toLocaleString()} ${monedas}` +
        `${eventMult.text || ''}`
    }

    user.lastppt = Date.now() + 1 * 60 * 1000

    await client.sendMessage(chatId, { text }, { quoted: m })
  }
}

function determineWinner(user, bot) {
  if (user === bot) return 'tie'
  if ((user === 'piedra' && bot === 'tijera') || (user === 'papel' && bot === 'piedra') || (user === 'tijera' && bot === 'papel')) return 'win'
  return 'lose'
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes} minuto${minutes !== 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`
}