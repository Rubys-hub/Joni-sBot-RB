import { delay } from "baileys"

export default {
  command: ['slot'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chat = db.chats[m.chat]

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const user = db.chats[m.chat].users[m.sender]

    user.lastslot ||= 0

    if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
      return m.reply(`🎰 sʟᴏᴛ ✦ Ingresa una cantidad válida. Ejemplo: *${usedPrefix + command} 500*`)
    }

    const apuesta = parseInt(args[0])

    if (Date.now() - user.lastslot < 30000) {
      const restante = user.lastslot + 30000 - Date.now()
      return m.reply(`⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* otra vez.`)
    }

    if (apuesta < 100) return m.reply(`🎰 sʟᴏᴛ ✦ Apuesta mínima: *100 ${currency}*.`)
    if (user.coins < apuesta) return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ No tienes suficientes *${currency}*.`)

    const emojis = ['🍒', '🍋', '💎', '⭐', '7️⃣']
    const spin = () => Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])

    const { key } = await client.sendMessage(m.chat, { text: `🎰 sʟᴏᴛ ✦ Girando...` }, { quoted: m })

    for (let i = 0; i < 5; i++) {
      const r = spin()
      await client.sendMessage(m.chat, { text: `🎰 sʟᴏᴛ ✦ ${r[0]} ${r[1]} ${r[2]} ✦ Girando...`, edit: key }, { quoted: m })
      await delay(300)
    }

    const r = spin()
    let resultado = ''

    if (r[0] === r[1] && r[1] === r[2]) {
      const win = apuesta * 2
      user.coins += apuesta
      resultado = `💎 Jackpot ✦ Ganaste *S/${win.toLocaleString()} ${currency}*.`
    } else if (r[0] === r[1] || r[0] === r[2] || r[1] === r[2]) {
      user.coins += 10
      resultado = `✨ Casi ✦ Recuperaste *S/10 ${currency}*.`
    } else {
      user.coins -= apuesta
      resultado = `💔 Mala suerte ✦ Perdiste *S/${apuesta.toLocaleString()} ${currency}*.`
    }

    user.lastslot = Date.now()

    await client.sendMessage(m.chat, { text: `🎰 sʟᴏᴛ ✦ ${r[0]} ${r[1]} ${r[2]} ✦ ${resultado}`, edit: key }, { quoted: m })
  }
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}