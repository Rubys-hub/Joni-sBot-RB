import { delay } from "baileys"

let buatall = 1

export default {
  command: ['apostar', 'casino'],
  category: 'economy',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatData = db.chats[m.chat]

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const botname = bot.botname
    const user = db.chats[m.chat].users[m.sender]

    user.lastApuesta ||= 0

    const userName = db.users[m.sender]?.name || m.sender.split('@')[0]
    const tiempoEspera = 30 * 1000
    const ahora = Date.now()

    if (user.lastApuesta && ahora - user.lastApuesta < tiempoEspera) {
      const restante = user.lastApuesta + tiempoEspera - ahora
      return client.reply(m.chat, `⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* otra vez.`, m)
    }

    let count = args[0]
    count = count ? /all/i.test(count) ? Math.floor(db.users[m.sender].limit / buatall) : parseInt(count) : 1
    count = Math.max(1, count)

    if (args.length < 1) return client.reply(m.chat, `🎰 ᴄᴀsɪɴᴏ ✦ Ingresa una cantidad ✦ Ejemplo: *${usedPrefix + command} 100*`, m)
    if (user.coins < count) return client.reply(m.chat, `💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ Te faltan *S/${formatNumber(count)} ${currency}* para apostar.`, m)

    user.lastApuesta = ahora

    const Aku = Math.floor(Math.random() * 101)
    const Kamu = Math.floor(Math.random() * 55)

    user.coins -= count

    let resultado = ''
    let ganancia = 0

    if (Aku > Kamu) {
      resultado = `💔 *${userName}*, perdiste *S/${formatNumber(count)} ${currency}*.`
    } else {
      ganancia = Aku < Kamu ? count * 2 : count
      user.coins += ganancia
      resultado = `💰 *${userName}*, ganaste *S/${formatNumber(ganancia)} ${currency}*.`
    }

    const { key } = await client.sendMessage(m.chat, { text: `🎲 ᴄᴀsɪɴᴏ ✦ El crupier lanza los dados...` }, { quoted: m })
    await delay(2000)
    await client.sendMessage(m.chat, { text: `✨ ᴄᴀsɪɴᴏ ✦ Los números están girando...`, edit: key }, { quoted: m })
    await delay(2000)

    const replyMsg = `🎰 ᴄᴀsɪɴᴏ ✦ ${botname}: *${Aku}* ✦ ${userName}: *${Kamu}* ✦ ${resultado}`
    await client.sendMessage(m.chat, { text: replyMsg.trim(), edit: key }, { quoted: m })
  }
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatTime(ms) {
  if (ms <= 0 || isNaN(ms)) return 'Ahora'
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  const partes = []
  if (min) partes.push(`${min} minuto${min !== 1 ? 's' : ''}`)
  partes.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
  return partes.join(' ')
}