import { resolveLidToRealJid } from "../../core/utils.js"

export default {
  command: ['robar', 'steal', 'rob'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatData = db.chats[m.chat]

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const user = db.chats[m.chat].users[m.sender]

    user.coins ||= 0
    user.laststeal ||= 0

    if (Date.now() < user.laststeal) {
      const restante = user.laststeal - Date.now()
      return client.reply(m.chat, `⏳ ᴇsᴘᴇʀᴀ ✦ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* otra vez.`, m)
    }

    const mentioned = m.mentionedJid || []
    const who2 = mentioned[0] || (m.quoted ? m.quoted.sender : null)
    const who = await resolveLidToRealJid(who2, client, m.chat)

    if (!who) return client.reply(m.chat, `🥷 ʀᴏʙᴏ ✦ Menciona a alguien para intentarlo.`, m)

    if (!(who in db.chats[m.chat].users)) {
      return client.reply(m.chat, `👤 ᴜsᴜᴀʀɪᴏ ✦ Ese usuario no está registrado en el bot.`, m)
    }

    const name = db.users[who]?.name || who.split('@')[0]
    const target = db.chats[m.chat].users[who]
    const lastCmd = db.chats[m.chat].users[who]?.lastCmd || 0
    const tiempoInactivo = Date.now() - lastCmd

    if (tiempoInactivo < 3600000) {
      return client.reply(m.chat, `🥷 ʀᴏʙᴏ ✦ Solo puedes robar a usuarios con más de *1 hora inactivos*.`, m)
    }

    const chance = Math.random()

    if (chance < 0.3) {
      let loss = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000
      const total = user.coins + (user.bank || 0)

      if (total >= loss) {
        if (user.coins >= loss) {
          user.coins -= loss
        } else {
          const restante = loss - user.coins
          user.coins = 0
          user.bank = Math.max(0, (user.bank || 0) - restante)
        }
      } else {
        loss = total
        user.coins = 0
        user.bank = 0
      }

      user.laststeal = Date.now() + 3600000
      return client.reply(m.chat, `🥷 ʀᴏʙᴏ ✦ Fallaste y perdiste *S/${loss.toLocaleString()} ${currency}*.`, m)
    }

    const rob = Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000

    if ((target.coins || 0) < rob) {
      return client.reply(m.chat, `🥷 ʀᴏʙᴏ ✦ *${name}* no tiene suficiente dinero fuera del banco.`, m, { mentions: [who] })
    }

    user.coins += rob
    target.coins -= rob
    user.laststeal = Date.now() + 3600000

    await client.reply(m.chat, `🥷 ʀᴏʙᴏ ✦ Le robaste *S/${rob.toLocaleString()} ${currency}* a *${name}*.`, m, { mentions: [who] })
  }
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (hours) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`)
  if (minutes) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}