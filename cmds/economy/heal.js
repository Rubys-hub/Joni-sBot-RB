import { resolveLidToRealJid } from "../../core/utils.js"

export default {
  command: ['heal', 'curar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatData = db.chats[m.chat]

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency

    const mentioned = m.mentionedJid || []
    const who2 = mentioned[0] || (m.quoted ? m.quoted.sender : null)
    const who = who2 ? await resolveLidToRealJid(who2, client, m.chat) : null

    const healer = chatData.users[m.sender]
    const target = who ? chatData.users[who] : healer

    if (!target) return m.reply(`👤 ᴜsᴜᴀʀɪᴏ ✦ El usuario no se encuentra en la base de datos.`)

    target.health ??= 100
    healer.coins ??= 0
    healer.bank ??= 0

    if (target.health >= 100) {
      const maximo = who ? `❤️ sᴀʟᴜᴅ ✦ La salud de *${db.users[who]?.name || who.split('@')[0]}* ya está al máximo. ✦ Salud: *${target.health}*` : `❤️ sᴀʟᴜᴅ ✦ Tu salud ya está al máximo. ✦ Salud: *${target.health}*`
      return m.reply(maximo)
    }

    const faltante = 100 - target.health
    const bloques = Math.ceil(faltante / 10)
    const costo = bloques * 500
    const totalFondos = healer.coins + healer.bank

    if (totalFondos < costo) {
      const fondos = who ? `💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ Necesitas *S/${costo.toLocaleString()} ${currency}* para curar a *${db.users[who]?.name || who.split('@')[0]}*.` : `💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ Necesitas *S/${costo.toLocaleString()} ${currency}* para curarte.`
      return m.reply(fondos)
    }

    if (healer.coins >= costo) {
      healer.coins -= costo
    } else {
      const restante = costo - healer.coins
      healer.coins = 0
      healer.bank = Math.max(0, healer.bank - restante)
    }

    target.health = 100

    const info = who ? `✅ ʟɪsᴛᴏ ✦ Curaste a *${db.users[who]?.name || who.split('@')[0]}* al máximo. ✦ Costo: *S/${costo.toLocaleString()} ${currency}*` : `✅ ʟɪsᴛᴏ ✦ Te curaste al máximo. ✦ Costo: *S/${costo.toLocaleString()} ${currency}*`
    m.reply(info)
  }
}