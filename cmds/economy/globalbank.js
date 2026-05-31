import { resolveLidToRealJid } from '../../core/utils.js'

const PERMANENT_UNTIL = 4102444800000
const STAR_VALUE_SOLES = 10000

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const VIP_TYPES = {
  basico: { badge: '💎', name: 'VIP Básico' },
  plus: { badge: '🔥', name: 'VIP Plus' },
  ultra: { badge: '👑', name: 'VIP Ultra' }
}

const COMMANDS = {
  donate: ['vdonar', 'vdonate', 'donarstars', 'donarvip'],
  info: ['gbank', 'globalbank', 'bancoglobal', 'donationbank'],
  claim: ['claimgbank', 'claimdonacion', 'reclamarbanco', 'reclamarbank']
}

function cleanJid(jid = '') {
  if (!jid) return ''

  if (typeof jid === 'object') {
    jid =
      jid?.id ||
      jid?.jid ||
      jid?.user ||
      jid?.participant ||
      jid?.remoteJid ||
      jid?.lid ||
      jid?.phoneNumber ||
      jid?.phone ||
      ''
  }

  jid = String(jid).trim()
  if (!jid) return ''

  if (jid.includes('@')) {
    const [left, server] = jid.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = jid.replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : ''
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function sameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (rawA && rawB && rawA === rawB) return true

  const numA = onlyNumber(rawA)
  const numB = onlyNumber(rawB)

  return !!numA && !!numB && numA === numB
}

async function resolveRealJid(jid, client, chatId) {
  try {
    return await resolveLidToRealJid(jid, client, chatId)
  } catch {
    return cleanJid(jid)
  }
}

async function getSenderReal(m, client) {
  return await resolveRealJid(m.sender, client, m.chat)
}

function getDB() {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}
  global.db.data.chats ||= {}
  global.db.data.vipLogs ||= []
  global.db.data.globalDonationBank ||= {
    soles: 0,
    donatedStars: 0,
    donations: [],
    lastClaim: 0,
    lastWinner: ''
  }

  return global.db.data
}

function getCommandType(command = '') {
  const cmd = String(command || '').toLowerCase()

  for (const [type, list] of Object.entries(COMMANDS)) {
    if (list.includes(cmd)) return type
  }

  return ''
}

function findUserKey(users = {}, jid = '') {
  const target = cleanJid(jid)
  if (users[target]) return target

  const found = Object.keys(users).find(key => sameUser(key, target))
  return found || target
}

function getGlobalUser(jid = '') {
  const db = getDB()
  const key = findUserKey(db.users, jid)

  db.users[key] ||= {}
  db.users[key].vip ||= {}

  return {
    key,
    user: db.users[key]
  }
}

function ensureLocalUser(chatId = '', jid = '', pushName = 'Usuario') {
  const db = getDB()

  db.chats[chatId] ||= {}
  db.chats[chatId].users ||= {}

  const key = findUserKey(db.chats[chatId].users, jid)

  db.chats[chatId].users[key] ||= {}
  const user = db.chats[chatId].users[key]

  user.id ??= key
  user.name ??= pushName
  user.coins = typeof user.coins === 'number' ? user.coins : 0
  user.bank = typeof user.bank === 'number' ? user.bank : 0

  return {
    key,
    user
  }
}

function ensureVip(user = {}) {
  user.vip ||= {}

  if (typeof user.vip.active !== 'boolean') user.vip.active = false
  if (typeof user.vip.type !== 'string') user.vip.type = ''
  if (typeof user.vip.until !== 'number') user.vip.until = 0
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false
  if (typeof user.vip.stars !== 'number') user.vip.stars = 0
  if (typeof user.vip.starsBank !== 'number') user.vip.starsBank = 0

  return user.vip
}

function normalizeVipType(type = '') {
  const t = String(type || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (['basico', 'basic', 'b'].includes(t)) return 'basico'
  if (['plus', 'p'].includes(t)) return 'plus'
  if (['ultra', 'u'].includes(t)) return 'ultra'

  return ''
}

function isPermanentVip(vip = {}) {
  return !!vip.permanent || Number(vip.until || 0) >= PERMANENT_UNTIL
}

function isVipActive(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!vip.active || !type || !VIP_TYPES[type]) return false

  if (isPermanentVip(vip)) {
    vip.active = true
    return true
  }

  if (Number(vip.until || 0) <= Date.now()) {
    vip.active = false
    return false
  }

  return true
}




function hadVipBefore(user = {}) {
  const vip = ensureVip(user)

  return !!(
    vip.type ||
    vip.since ||
    vip.until ||
    vip.stars ||
    vip.starsBank ||
    vip.title
  )
}

function buildVipAccessText(user = {}, prefix = '.') {
  if (hadVipBefore(user)) {
    return (
      `╭━━〔 ⏳ VIP EXPIRADO 〕━━\n` +
      `┃ Tu VIP ya no está activo.\n` +
      `┃ Tus ⭐ stars están protegidas.\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `Renueva con:\n` +
      `*${prefix}vipshop*\n\n` +
      `O convierte tus stars:\n` +
      `*${prefix}vstars2soles all*`
    )
  }

  return (
    `╭━━〔 🔒 ACCESO VIP 〕━━\n` +
    `┃ Donar ⭐ stars es exclusivo VIP.\n` +
    `┃ Tu cuenta aún no tiene un plan activo.\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +
    `Ver planes:\n` +
    `*${prefix}vipshop*\n\n` +
    `Canjear código:\n` +
    `*${prefix}redeem CODIGO*`
  )
}



function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function formatStars(num = 0) {
  const n = Number(num || 0)

  return n.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2
  })
}

function starsText(num = 0) {
  return `⭐ ${formatStars(num)} stars`
}

function formatMoney(num = 0, currency = 'Soles') {
  return `S/${formatNumber(Math.floor(Number(num || 0)))} ${currency}`
}

function parseAmount(input = '') {
  const text = String(input || '').toLowerCase().trim()
  if (text === 'all' || text === 'todo') return 'all'

  const clean = text.replace(/[^\d.,]/g, '').replace(',', '.')
  const num = Number(clean)

  return Number.isFinite(num) ? num : 0
}

function starsToSoles(stars = 0) {
  return Math.floor(Number(stars || 0) * STAR_VALUE_SOLES)
}

function roundStars(num = 0) {
  return Math.round(Number(num || 0) * 100) / 100
}

function getTotalStars(user = {}) {
  const vip = ensureVip(user)
  return roundStars(Number(vip.stars || 0) + Number(vip.starsBank || 0))
}

function removeStarsAll(user = {}, amount = 0) {
  const vip = ensureVip(user)
  let remaining = roundStars(amount)

  const fromWallet = Math.min(Number(vip.stars || 0), remaining)
  vip.stars = roundStars(Number(vip.stars || 0) - fromWallet)
  remaining = roundStars(remaining - fromWallet)

  const fromBank = Math.min(Number(vip.starsBank || 0), remaining)
  vip.starsBank = roundStars(Number(vip.starsBank || 0) - fromBank)
  remaining = roundStars(remaining - fromBank)

  return {
    ok: remaining <= 0,
    removed: roundStars(fromWallet + fromBank),
    fromWallet,
    fromBank
  }
}

function getCurrency(client) {
  const db = getDB()
  const botId = cleanJid(client?.user?.id || client?.user?.jid || '')
  return db.settings?.[botId]?.currency || 'Soles'
}

function checkGroupEconomy(m, usedPrefix = '.') {
  const db = getDB()
  const chatId = m.chat

  if (!String(chatId || '').endsWith('@g.us')) {
    return {
      ok: false,
      text:
        `▣ BANCO GLOBAL\n` +
        `▪ Este comando debe usarse en un grupo.`
    }
  }

  db.chats[chatId] ||= {}
  const chatData = db.chats[chatId]

  if (chatData.adminonly || !chatData.economy) {
    return {
      ok: false,
      text:
        `▣ ECONOMÍA OFF\n` +
        `▪ La economía está desactivada en este grupo.\n` +
        `▪ Actívala con: ${usedPrefix}economy on`
    }
  }

  return {
    ok: true,
    chatData
  }
}

function saveDB() {
  if (typeof global.saveDatabase === 'function') {
    global.saveDatabase()
  }
}

function pushVipLog({
  action = '',
  jid = '',
  target = '',
  amount = 0,
  detail = '',
  by = ''
} = {}) {
  const db = getDB()

  db.vipLogs ||= []

  db.vipLogs.unshift({
    time: Date.now(),
    action,
    jid: cleanJid(jid),
    target: cleanJid(target),
    amount: Number(amount || 0),
    detail,
    by: cleanJid(by)
  })

  db.vipLogs = db.vipLogs.slice(0, 300)
}

function getBank() {
  const db = getDB()

  db.globalDonationBank ||= {
    soles: 0,
    donatedStars: 0,
    donations: [],
    lastClaim: 0,
    lastWinner: ''
  }

  return db.globalDonationBank
}

async function handleDonate({ client, m, args, usedPrefix, senderReal }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const senderGlobal = getGlobalUser(senderReal)
  const senderUser = senderGlobal.user
  const vip = ensureVip(senderUser)

if (!isVipActive(senderUser)) {
  return m.reply(buildVipAccessText(senderUser, usedPrefix))
}

  const input = parseAmount(args[0])

  if (!args[0] || !input || input <= 0 || input === 'all') {
    return m.reply(
      `💝 ▣ DONAR STARS\n` +
      `▪️ Usa: *${usedPrefix}vdonar 10*\n` +
      `▪️ Tus ⭐ stars se convierten a SOLES.\n` +
      `▪️ Van al banco global para que alguien los reclame.\n` +
      `▪️ Conversión: ⭐ 1 star = 10,000 SOLES`
    )
  }

  const amountStars = Number(input)
  const totalStars = getTotalStars(senderUser)

  if (totalStars < amountStars) {
    return m.reply(
      `❌ ▣ STARS INSUFICIENTES\n` +
      `▪️ Total VIP: ${starsText(totalStars)}\n` +
      `▪️ Intentaste donar: ${starsText(amountStars)}`
    )
  }

  const removed = removeStarsAll(senderUser, amountStars)

  if (!removed.ok) {
    return m.reply(`❌ No pude retirar tus ⭐ stars.`)
  }

  const soles = starsToSoles(amountStars)
  const bank = getBank()
  const currency = getCurrency(client)

  bank.soles = Math.floor(Number(bank.soles || 0) + soles)
  bank.donatedStars = roundStars(Number(bank.donatedStars || 0) + amountStars)
  bank.donations ||= []
  bank.donations.unshift({
    jid: senderReal,
    stars: amountStars,
    soles,
    time: Date.now()
  })
  bank.donations = bank.donations.slice(0, 50)

  pushVipLog({
    action: 'VDONAR',
    jid: senderReal,
    amount: amountStars,
    detail: `Banco global +${formatMoney(soles, currency)}`
  })

  saveDB()

  return m.reply(
    `💝 ▣ DONACIÓN GLOBAL\n` +
    `▪️ Donaste: ${starsText(amountStars)}\n` +
    `▪️ Convertido a: ${formatMoney(soles, currency)}\n` +
    `▪️ Banco global actual: ${formatMoney(bank.soles, currency)}\n\n` +
    `⚡ El más rápido en usar *${usedPrefix}claimgbank* se lo lleva.`
  )
}

async function handleInfo({ client, m, usedPrefix }) {
  const bank = getBank()
  const currency = getCurrency(client)

  const lastDonations = (bank.donations || []).slice(0, 5)

  let text =
    `🏦 ▣ BANCO GLOBAL\n` +
    `▪️ Disponible: ${formatMoney(bank.soles || 0, currency)}\n` +
    `▪️ Stars donadas: ${starsText(bank.donatedStars || 0)}\n` +
    `▪️ Último ganador: ${bank.lastWinner ? '@' + onlyNumber(bank.lastWinner) : '-'}\n\n` +
    `🎁 Reclamar: *${usedPrefix}claimgbank*\n` +
    `💝 Donar VIP: *${usedPrefix}vdonar 10*\n`

  if (lastDonations.length) {
    text += `\n📌 Últimas donaciones:\n`
    text += lastDonations.map((d, i) => {
      return `${i + 1}. @${onlyNumber(d.jid)} — ${starsText(d.stars)} → ${formatMoney(d.soles, currency)}`
    }).join('\n')
  }

  return m.reply(text)
}

async function handleClaim({ client, m, usedPrefix, senderReal }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const bank = getBank()
  const currency = getCurrency(client)
  const amount = Math.floor(Number(bank.soles || 0))

  if (!amount || amount <= 0) {
    return m.reply(
      `🏦 ▣ BANCO GLOBAL VACÍO\n` +
      `▪️ No hay SOLES disponibles para reclamar.\n` +
      `▪️ Los VIP pueden donar con: *${usedPrefix}vdonar 10*`
    )
  }

  const local = ensureLocalUser(m.chat, senderReal, m.pushName || 'Usuario')
  local.user.bank = Number(local.user.bank || 0) + amount

  bank.soles = 0
  bank.donatedStars = 0
  bank.lastClaim = Date.now()
  bank.lastWinner = senderReal

  pushVipLog({
    action: 'CLAIM_GBANK',
    jid: senderReal,
    amount: 0,
    detail: `Reclamó ${formatMoney(amount, currency)}`
  })

  saveDB()

  return client.sendMessage(m.chat, {
    text:
      `🎁 ▣ BANCO GLOBAL RECLAMADO\n` +
      `▪️ Ganador: @${onlyNumber(senderReal)}\n` +
      `▪️ Reclamó: ${formatMoney(amount, currency)}\n` +
      `▪️ Depositado en su banco normal.\n\n` +
      `⚡ Fue el más rápido.`,
    mentions: [senderReal]
  }, { quoted: m })
}

export default {
  command: [
    ...COMMANDS.donate,
    ...COMMANDS.info,
    ...COMMANDS.claim
  ],
  category: 'economy',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = '') => {
    try {
      const senderReal = await getSenderReal(m, client)
      const type = getCommandType(command)

      if (type === 'donate') {
        return await handleDonate({ client, m, args, usedPrefix, senderReal })
      }

      if (type === 'info') {
        return await handleInfo({ client, m, usedPrefix })
      }

      if (type === 'claim') {
        return await handleClaim({ client, m, usedPrefix, senderReal })
      }

      return m.reply(
        `🏦 ▣ BANCO GLOBAL\n` +
        `▪️ Ver banco: *${usedPrefix}gbank*\n` +
        `▪️ Reclamar: *${usedPrefix}claimgbank*\n` +
        `▪️ Donar VIP: *${usedPrefix}vdonar 10*`
      )
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}