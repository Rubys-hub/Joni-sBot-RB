import { resolveLidToRealJid } from "../../core/utils.js"

function cleanJid(jid = '') {
  return String(jid || '').split(':')[0].trim()
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function formatNumber(amount = 0) {
  return Number(amount || 0).toLocaleString()
}

function formatMoney(amount = 0, currency = 'Soles') {
  return `S/${formatNumber(amount)} ${currency}`
}

function parseAmount(input = '') {
  const text = String(input || '').toLowerCase().trim()
  if (text === 'all') return 'all'

  const number = Number(text.replace(/[^\d]/g, ''))
  return number
}

function findUser(chatData = {}, ...jids) {
  chatData.users ||= {}

  for (const jid of jids) {
    const clean = cleanJid(jid)
    if (clean && chatData.users[clean]) return chatData.users[clean]

    const number = onlyNumber(clean)
    if (!number) continue

    const foundKey = Object.keys(chatData.users).find(key => onlyNumber(key) === number)
    if (foundKey) return chatData.users[foundKey]
  }

  return null
}

export default {
  command: ['withdraw', 'with', 'retirar'],
  category: 'rpg',

  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat

    db.chats[chatId] ||= {}
    db.chats[chatId].users ||= {}

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId] || {}
    const chatData = db.chats[chatId]
    const currency = botSettings.currency || 'Soles'

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(
        `▣ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ\n` +
        `▪ La economía está desactivada.\n` +
        `▪ Actívala con: ${usedPrefix}economy on`
      )
    }

    let senderReal = m.sender
    try {
      senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
    } catch {}

    const user = findUser(chatData, senderReal, m.sender)

    if (!user) {
      return m.reply(
        `▣ ᴡɪᴛʜᴅʀᴀᴡ\n` +
        `▪ No estás registrado en la economía.\n` +
        `▪ Usa ${usedPrefix}daily para empezar.`
      )
    }

    if (!args[0]) {
      return m.reply(
        `▣ ᴡɪᴛʜᴅʀᴀᴡ\n` +
        `▪ Ingresa una cantidad o usa all.\n` +
        `▪ Ejemplo: ${usedPrefix + command} 25000\n` +
        `▪ Todo: ${usedPrefix + command} all`
      )
    }

    const input = parseAmount(args[0])

    if (input === 'all') {
      const amount = Number(user.bank || 0)

      if (amount <= 0) {
        return m.reply(
          `▣ sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ\n` +
          `▪ No tienes ${currency} en el banco.`
        )
      }

      user.bank = 0
      user.coins = Number(user.coins || 0) + amount

      return m.reply(
        `▣ ʀᴇᴛɪʀᴏ ᴇxɪᴛᴏsᴏ\n` +
        `▪ Retiraste: ${formatMoney(amount, currency)}\n` +
        `▪ Cartera: ${formatMoney(user.coins, currency)}\n` +
        `▪ Banco: ${formatMoney(user.bank, currency)}`
      )
    }

    const count = input

    if (!count || isNaN(count) || count < 1) {
      return m.reply(
        `▣ ᴡɪᴛʜᴅʀᴀᴡ\n` +
        `▪ Cantidad inválida.\n` +
        `▪ Ejemplo: ${usedPrefix + command} 25000`
      )
    }

    if (Number(user.bank || 0) < count) {
      return m.reply(
        `▣ sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ\n` +
        `▪ Banco actual: ${formatMoney(user.bank || 0, currency)}\n` +
        `▪ Intentaste retirar: ${formatMoney(count, currency)}`
      )
    }

    user.bank = Number(user.bank || 0) - count
    user.coins = Number(user.coins || 0) + count

    await m.reply(
      `▣ ʀᴇᴛɪʀᴏ ᴇxɪᴛᴏsᴏ\n` +
      `▪ Retiraste: ${formatMoney(count, currency)}\n` +
      `▪ Cartera: ${formatMoney(user.coins, currency)}\n` +
      `▪ Banco: ${formatMoney(user.bank, currency)}`
    )
  }
}