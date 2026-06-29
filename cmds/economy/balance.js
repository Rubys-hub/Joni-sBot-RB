import { resolveLidToRealJid } from "../../core/utils.js"

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

function cleanJid(jid = '') {
  return String(jid).split(':')[0].trim()
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}


function findUserKey(chatData = {}, ...jids) {
  chatData.users ||= {}

  for (const jid of jids) {
    const clean = cleanJid(jid)

    if (clean && chatData.users[clean]) return clean

    const number = onlyNumber(clean)
    if (!number) continue

    const foundKey = Object.keys(chatData.users).find(key => onlyNumber(key) === number)

    if (foundKey) return foundKey
  }

  return null
}

function isOwnerUser(jid = '') {
  const raw = cleanJid(jid)
  const number = onlyNumber(jid)

  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ]

  return owners.some(owner => {
    const ownerRaw = cleanJid(owner)
    const ownerNumber = onlyNumber(owner)

    return (
      ownerRaw === raw ||
      ownerNumber === number ||
      ownerRaw === `${number}@s.whatsapp.net` ||
      ownerRaw === `${number}@lid`
    )
  })
}

function formatNumber(amount = 0) {
  return Number(amount || 0).toLocaleString()
}

function formatMoney(amount = 0, jid = '', currency = 'Soles') {
  if (isOwnerUser(jid)) return `∞ ${currency}`
  return `S/${formatNumber(amount)} ${currency}`
}

export default {
  command: ['balance', 'bal', 'coins', 'bank'],
  category: 'rpg',

  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat

    db.chats[chatId] ||= {}
    db.chats[chatId].users ||= {}

    const chatData = db.chats[chatId]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId] || {}
    const monedas = botSettings.currency || 'Soles'

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(
        `╭━━〔 ⚠️ ECONOMÍA DESACTIVADA 〕━━⬣\n` +
        `┃ 📴 La economía está apagada en este grupo.\n` +
        `┃ 🔧 Actívala con: *${usedPrefix}economy on*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    const mentioned = m.mentionedJid || []
    const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat)

const userKey = findUserKey(chatData, who, who2)

if (!userKey) {
  return m.reply(
    `╭━━〔 👤 SIN BALANCE 〕━━⬣\n` +
    `┃ 🧾 Ese usuario aún no tiene cuenta económica.\n` +
    `┃ 🎁 Puede empezar con: *${usedPrefix}daily*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━⬣`
  )
}

const user = chatData.users[userKey]
    const wallet = Number(user.coins || 0)
    const bank = Number(user.bank || 0)
    const total = wallet + bank

    const name = db.users[userKey]?.name || user.name || userKey.split('@')[0]

const walletText = formatMoney(wallet, userKey, monedas)
const bankText = formatMoney(bank, userKey, monedas)
const totalText = formatMoney(total, userKey, monedas)

    const bal =
      `╭━━〔 💎 BANCO PERSONAL 〕━━⬣\n` +
      `┃ 👤 Usuario: *${name}*\n` +
      `┃\n` +
      `┃ 🪙 Cartera: *${walletText}*\n` +
      `┃ 🏦 Banco: *${bankText}*\n` +
      `┃ ✨ Total: *${totalText}*\n` +
      `╰━━〔 💰 Economy 〕━━⬣`

    await client.sendMessage(chatId, { text: bal }, { quoted: m })
  }
}
