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
  command: ['dep', 'deposit', 'd'],
  category: 'rpg',

  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat

    db.chats[chatId] ||= {}
    db.chats[chatId].users ||= {}

    const chatData = db.chats[chatId]
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = db.settings[idBot] || {}
    const monedas = settings.currency || 'Soles'

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(
        `╭━━〔 ⚠️ ECONOMÍA DESACTIVADA 〕━━⬣\n` +
        `┃ 📴 La economía está apagada en este grupo.\n` +
        `┃ 🔧 Actívala con: *${usedPrefix}economy on*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    let senderReal = m.sender
    try {
      senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
    } catch {}

    const user = findUser(chatData, senderReal, m.sender)

    if (!user) {
      return m.reply(
        `╭━━〔 🏦 DEPÓSITO 〕━━⬣\n` +
        `┃ 👤 Aún no estás registrado en la economía.\n` +
        `┃ 🎁 Empieza reclamando: *${usedPrefix}daily*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    if (!args[0]) {
      return m.reply(
        `╭━━〔 🏦 DEPÓSITO 〕━━⬣\n` +
        `┃ 💰 Ingresa cuánto quieres guardar.\n` +
        `┃ 🧾 Ejemplo: *${usedPrefix}dep 25000*\n` +
        `┃ 📦 Todo: *${usedPrefix}dep all*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    const input = parseAmount(args[0])

    if (input === 'all') {
      const count = Number(user.coins || 0)

      if (count <= 0) {
        return m.reply(
          `╭━━〔 💸 SIN MONEDAS 〕━━⬣\n` +
          `┃ 🪙 No tienes ${monedas} en cartera para depositar.\n` +
          `┃ 🏦 Tu banco sigue igual de seguro.\n` +
          `╰━━━━━━━━━━━━━━━━━━━━⬣`
        )
      }

      user.coins = 0
      user.bank = Number(user.bank || 0) + count

      return m.reply(
        `╭━━〔 ✅ DEPÓSITO EXITOSO 〕━━⬣\n` +
        `┃ 🏦 Guardaste: *${formatMoney(count, monedas)}*\n` +
        `┃ 👛 Cartera: *${formatMoney(user.coins, monedas)}*\n` +
        `┃ 💳 Banco: *${formatMoney(user.bank, monedas)}*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    const count = input

    if (!count || isNaN(count) || count < 1) {
      return m.reply(
        `╭━━〔 🔢 CANTIDAD INVÁLIDA 〕━━⬣\n` +
        `┃ 💰 Ingresa una cantidad válida para depositar.\n` +
        `┃ 🧾 Ejemplo: *${usedPrefix}dep 25000*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    if (Number(user.coins || 0) < count) {
      return m.reply(
        `╭━━〔 🚫 SALDO INSUFICIENTE 〕━━⬣\n` +
        `┃ 👛 Cartera actual: *${formatMoney(user.coins || 0, monedas)}*\n` +
        `┃ 🏦 Querías guardar: *${formatMoney(count, monedas)}*\n` +
        `┃ 💡 Usa *${usedPrefix}dep all* para guardar todo.\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    user.coins = Number(user.coins || 0) - count
    user.bank = Number(user.bank || 0) + count

    await m.reply(
      `╭━━〔 ✅ DEPÓSITO EXITOSO 〕━━⬣\n` +
      `┃ 🏦 Guardaste: *${formatMoney(count, monedas)}*\n` +
      `┃ 👛 Cartera: *${formatMoney(user.coins, monedas)}*\n` +
      `┃ 💳 Banco: *${formatMoney(user.bank, monedas)}*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━⬣`
    )
  }
}
