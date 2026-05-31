import { resolveLidToRealJid } from './utils.js'

const PERMANENT_UNTIL = 4102444800000

export const VIP_NORMAL_BONUS = {
  basico: {
    badge: '💎',
    name: 'VIP Básico',
    short: 'Básico',
    gainBonus: 30,
    cooldownDiscount: 25,
    successBonus: 5,
    lossReduction: 5
  },

  plus: {
    badge: '🔥',
    name: 'VIP Plus',
    short: 'Plus',
    gainBonus: 50,
    cooldownDiscount: 30,
    successBonus: 10,
    lossReduction: 10
  },

  ultra: {
    badge: '👑',
    name: 'VIP Ultra',
    short: 'Ultra',
    gainBonus: 70,
    cooldownDiscount: 35,
    successBonus: 15,
    lossReduction: 15
  }
}

export function cleanJid(jid = '') {
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

export function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

export function sameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (rawA && rawB && rawA === rawB) return true

  const numA = onlyNumber(rawA)
  const numB = onlyNumber(rawB)

  return !!numA && !!numB && numA === numB
}

export async function resolveRealJid(jid, client, chatId) {
  try {
    return await resolveLidToRealJid(jid, client, chatId)
  } catch {
    return cleanJid(jid)
  }
}

export async function getSenderReal(m, client) {
  return await resolveRealJid(m.sender, client, m.chat)
}

export function getDB() {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}
  global.db.data.chats ||= {}
  global.db.data.settings ||= {}

  return global.db.data
}

export function findUserKey(users = {}, jid = '') {
  const target = cleanJid(jid)
  if (users[target]) return target

  const found = Object.keys(users).find(key => sameUser(key, target))
  return found || target
}

export function getGlobalUser(jid = '') {
  const db = getDB()
  const key = findUserKey(db.users, jid)

  db.users[key] ||= {}
  db.users[key].vip ||= {}

  return {
    key,
    user: db.users[key]
  }
}

export function getLocalUser(chatId = '', jid = '', pushName = 'Usuario') {
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

export function ensureVip(user = {}) {
  user.vip ||= {}

  if (typeof user.vip.active !== 'boolean') user.vip.active = false
  if (typeof user.vip.type !== 'string') user.vip.type = ''
  if (typeof user.vip.since !== 'number') user.vip.since = 0
  if (typeof user.vip.until !== 'number') user.vip.until = 0
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false
  if (typeof user.vip.stars !== 'number') user.vip.stars = 0
  if (typeof user.vip.starsBank !== 'number') user.vip.starsBank = 0

  return user.vip
}

export function normalizeVipType(type = '') {
  const t = String(type || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (['basico', 'basic', 'b'].includes(t)) return 'basico'
  if (['plus', 'p'].includes(t)) return 'plus'
  if (['ultra', 'u'].includes(t)) return 'ultra'

  return ''
}

export function isPermanentVip(vip = {}) {
  return !!vip.permanent || Number(vip.until || 0) >= PERMANENT_UNTIL
}

export function isVipActive(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!vip.active || !type || !VIP_NORMAL_BONUS[type]) return false

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

export function getVipBonus(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!isVipActive(user)) {
    return {
      active: false,
      type: '',
      badge: '',
      name: '',
      short: '',
      gainBonus: 0,
      cooldownDiscount: 0,
      successBonus: 0,
      lossReduction: 0
    }
  }

  return {
    active: true,
    type,
    ...VIP_NORMAL_BONUS[type]
  }
}

export function getBotCurrency(client) {
  const db = getDB()
  const botId = cleanJid(client?.user?.id || client?.user?.jid || '')
  return db.settings?.[botId]?.currency || 'Soles'
}

export async function getEconomyContext(client, m, usedPrefix = '.') {
  const db = getDB()
  const chatId = m.chat

  db.chats[chatId] ||= {}
  db.chats[chatId].users ||= {}

  const chatData = db.chats[chatId]
  const senderReal = await getSenderReal(m, client)

  const global = getGlobalUser(senderReal)
  const local = getLocalUser(chatId, senderReal, m.pushName || 'Usuario')

  return {
    db,
    chatId,
    chatData,
    senderReal,
    globalUser: global.user,
    user: local.user,
    currency: getBotCurrency(client),
    vipBonus: getVipBonus(global.user)
  }
}

export function economyOffText(usedPrefix = '.') {
  return (
    `⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ\n\n` +
    `La economía está desactivada en este grupo.\n` +
    `Un admin puede activarla con: *${usedPrefix}economy on*`
  )
}

export function formatNumber(amount = 0) {
  return Number(amount || 0).toLocaleString('en-US')
}

export function formatMoney(amount = 0, currency = 'Soles') {
  return `S/${formatNumber(Math.floor(Number(amount || 0)))} ${currency}`
}

export function formatTime(ms = 0) {
  const totalSec = Math.ceil(Number(ms || 0) / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  const parts = []

  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (seconds && !days && !hours) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
}

export function randomInt(min = 0, max = 0) {
  const a = Math.ceil(Number(min || 0))
  const b = Math.floor(Number(max || 0))

  if (b <= a) return a

  return Math.floor(Math.random() * (b - a + 1)) + a
}

export function pickRandom(list = []) {
  return list[Math.floor(Math.random() * list.length)] || ''
}

export function applyCooldown(baseMs = 0, vipBonus = {}) {
  if (!vipBonus.active) return Number(baseMs || 0)

  const reduced = Number(baseMs || 0) * (1 - Number(vipBonus.cooldownDiscount || 0) / 100)
  return Math.max(1000, Math.floor(reduced))
}

export function applyGainBonus(baseAmount = 0, vipBonus = {}) {
  const base = Math.floor(Number(baseAmount || 0))

  if (!vipBonus.active) {
    return {
      base,
      bonus: 0,
      total: base
    }
  }

  const bonus = Math.floor(base * (Number(vipBonus.gainBonus || 0) / 100))

  return {
    base,
    bonus,
    total: base + bonus
  }
}

export function applyLossReduction(baseLoss = 0, vipBonus = {}) {
  const base = Math.floor(Number(baseLoss || 0))

  if (!vipBonus.active) {
    return {
      base,
      reduced: 0,
      total: base
    }
  }

  const reduced = Math.floor(base * (Number(vipBonus.lossReduction || 0) / 100))

  return {
    base,
    reduced,
    total: Math.max(0, base - reduced)
  }
}

export function applySuccessChance(baseChance = 0, vipBonus = {}) {
  const base = Number(baseChance || 0)

  if (!vipBonus.active) return base

  return Math.min(0.95, base + Number(vipBonus.successBonus || 0) / 100)
}

export function takeMoney(user = {}, amount = 0) {
  let remaining = Math.floor(Number(amount || 0))

  user.coins = Number(user.coins || 0)
  user.bank = Number(user.bank || 0)

  const fromWallet = Math.min(user.coins, remaining)
  user.coins -= fromWallet
  remaining -= fromWallet

  const fromBank = Math.min(user.bank, remaining)
  user.bank -= fromBank
  remaining -= fromBank

  return {
    requested: Math.floor(Number(amount || 0)),
    lost: fromWallet + fromBank,
    fromWallet,
    fromBank
  }
}

export function vipReminder(vipBonus = {}, usedPrefix = '.') {
  if (!vipBonus.active) return ''

  return (
    `\n\n` +
    `⭐ Eres ${vipBonus.badge} ${vipBonus.name}. Usa *${usedPrefix}vipmenu* para comandos exclusivos.`
  )
}

export function vipBenefitLine(vipBonus = {}, amount = 0, currency = 'Soles') {
  if (!vipBonus.active) return ''

  return (
    `Base: ${formatMoney(amount.base, currency)}\n` +
    `Bonus VIP ${vipBonus.badge} ${vipBonus.short}: +${vipBonus.gainBonus}% | ${formatMoney(amount.bonus, currency)}\n`
  )
}

export function vipLossLine(vipBonus = {}, loss = {}, currency = 'Soles') {
  if (!vipBonus.active) return ''

  return (
    `Pérdida inicial: ${formatMoney(loss.base, currency)}\n` +
    `Protección VIP ${vipBonus.badge} ${vipBonus.short}: -${vipBonus.lossReduction}% | ${formatMoney(loss.reduced, currency)}\n`
  )
}

export function saveDB() {
  if (typeof global.saveDatabase === 'function') {
    global.saveDatabase()
  }
}