import { resolveLidToRealJid } from '../../core/utils.js'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const PERMANENT_UNTIL = 4102444800000
const STAR_VALUE_SOLES = 10000
const VPAY_LIMIT_STARS = 150
const VPAY_LIMIT_WINDOW = 2 * HOUR
const STAR_TO_SOLES_TAX = 0.60
const EXPIRED_STAR_TO_SOLES_TAX = 0.15


const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const VIP_TYPES = {
  basico: {
    badge: '💎',
    name: 'VIP Básico'
  },
  plus: {
    badge: '🔥',
    name: 'VIP Plus'
  },
  ultra: {
    badge: '👑',
    name: 'VIP Ultra'
  }
}

const COMMANDS = {
  balance: ['vbal', 'vbalance', 'vstars', 'vbank'],
  deposit: ['vdep', 'vdeposit', 'vguardar'],
  withdraw: ['vwith', 'vwithdraw', 'vretirar', 'vret'],
  pay: ['vpay', 'vgive', 'vtransfer', 'vstarsgive'],
  solesToStars: ['vcoins2stars', 'vsoles2stars', 'vsellcoins', 'vvendercoins', 'vcomprarstars', 'vbuystars'],
  starsToSoles: ['vstars2soles', 'vsellstars', 'vvenderstars', 'vcashout', 'vretirarstars'],
  board: ['eboardvip', 'vipboard', 'baltopvip'],
  boardGlobal: ['eboardvipglobal', 'vipboardglobal', 'baltopvipglobal'],
  menu: ['vipbank', 'vbankmenu', 'vstarbank']
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

function isOwnerUser(jid = '') {
  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].filter(Boolean)

  return owners.some(owner => sameUser(owner, jid))
}

async function getSenderReal(m, client) {
  try {
    return await resolveLidToRealJid(m.sender, client, m.chat)
  } catch {
    return m.sender
  }
}

async function resolveRealJid(jid, client, chatId) {
  try {
    return await resolveLidToRealJid(jid, client, chatId)
  } catch {
    return cleanJid(jid)
  }
}

function getDB() {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}
  global.db.data.chats ||= {}
  return global.db.data
}

function getBotCurrency(client) {
  const db = getDB()
  const botId = cleanJid(client?.user?.id || client?.user?.jid || '')
  return db.settings?.[botId]?.currency || 'Soles'
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

function getLocalUser(chatId = '', jid = '', create = true) {
  const db = getDB()

  db.chats[chatId] ||= {}
  db.chats[chatId].users ||= {}

  const key = findUserKey(db.chats[chatId].users, jid)

  if (!db.chats[chatId].users[key] && !create) {
    return {
      key,
      user: null
    }
  }

  db.chats[chatId].users[key] ||= {}

  if (typeof db.chats[chatId].users[key].coins !== 'number') {
    db.chats[chatId].users[key].coins = 0
  }

  if (typeof db.chats[chatId].users[key].bank !== 'number') {
    db.chats[chatId].users[key].bank = 0
  }

  return {
    key,
    user: db.chats[chatId].users[key]
  }
}

function ensureVip(user = {}) {
  user.vip ||= {}

  if (typeof user.vip.active !== 'boolean') user.vip.active = false
  if (typeof user.vip.type !== 'string') user.vip.type = ''
  if (typeof user.vip.since !== 'number') user.vip.since = 0
  if (typeof user.vip.until !== 'number') user.vip.until = 0
  if (typeof user.vip.title !== 'string') user.vip.title = ''
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false

  if (typeof user.vip.stars !== 'number') user.vip.stars = 0
  if (typeof user.vip.starsBank !== 'number') user.vip.starsBank = 0
  if (typeof user.vip.vpayWindowStart !== 'number') user.vip.vpayWindowStart = 0
  if (typeof user.vip.vpayWindowAmount !== 'number') user.vip.vpayWindowAmount = 0

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

function getVipLabel(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)
  const cfg = VIP_TYPES[type]

  if (!isVipActive(user) || !cfg) return 'Sin VIP'
  return `${cfg.badge} ${cfg.name}`
}

function getCommandType(command = '') {
  const cmd = String(command || '').toLowerCase()

  for (const [type, list] of Object.entries(COMMANDS)) {
    if (list.includes(cmd)) return type
  }

  return ''
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

function formatMoney(num = 0, currency = 'Soles') {
  return `S/${formatNumber(Math.floor(Number(num || 0)))} ${currency}`
}

function starsText(num = 0) {
  return `⭐ ${formatStars(num)} stars`
}


function formatTime(ms = 0) {
  const n = Math.max(0, Number(ms || 0))

  if (n <= 0) return 'Disponible'

  const h = Math.floor(n / HOUR)
  const m = Math.floor((n % HOUR) / (60 * 1000))

  const parts = []

  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)

  return parts.length ? parts.join(' ') : 'menos de 1m'
}

function getVpayLimitStatus(vip = {}, amount = 0) {
  const now = Date.now()
  const start = Number(vip.vpayWindowStart || 0)
  const used = Number(vip.vpayWindowAmount || 0)

  if (!start || now - start >= VPAY_LIMIT_WINDOW) {
    vip.vpayWindowStart = now
    vip.vpayWindowAmount = 0

    return {
      ok: Number(amount || 0) <= VPAY_LIMIT_STARS,
      used: 0,
      available: VPAY_LIMIT_STARS,
      remaining: VPAY_LIMIT_WINDOW
    }
  }

  const available = Math.max(0, VPAY_LIMIT_STARS - used)

  return {
    ok: Number(amount || 0) <= available,
    used,
    available,
    remaining: Math.max(0, VPAY_LIMIT_WINDOW - (now - start))
  }
}

function registerVpayLimit(vip = {}, amount = 0) {
  const status = getVpayLimitStatus(vip, 0)

  vip.vpayWindowAmount = Math.round((Number(vip.vpayWindowAmount || 0) + Number(amount || 0)) * 100) / 100

  return {
    ...status,
    used: vip.vpayWindowAmount,
    available: Math.max(0, VPAY_LIMIT_STARS - vip.vpayWindowAmount)
  }
}

function getUserDisplayName(jid = '', localData = {}, globalData = {}) {
  const name =
    globalData?.name ||
    globalData?.pushName ||
    localData?.name ||
    localData?.pushName ||
    ''

  if (name) return String(name).trim().slice(0, 25)

  const number = onlyNumber(jid)
  return number ? `@${number}` : 'Usuario'
}


function buildVipExpiredText(prefix = '.') {
  return (
    `╭━━〔 ⏳ VIP EXPIRADO 〕━━\n` +
    `┃ Tu VIP ya no está activo.\n` +
    `┃ Tus ⭐ stars están protegidas.\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +
    `Puedes renovar para volver a usar todo el sistema VIP:\n` +
    `*${prefix}vipshop*\n` +
    `*${prefix}redeem CODIGO*\n\n` +
    `Si ya no deseas renovar, puedes convertir tus ⭐ stars a SOLES:\n` +
    `*${prefix}vstars2soles all*\n\n` +
    `_Comisión de salida sin renovar: 15%_`
  )
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

function buildVipAccessText(user = {}, prefix = '.', commandName = 'este comando') {
  if (hadVipBefore(user)) {
    return buildVipExpiredText(prefix)
  }

  return (
    `╭━━〔 🔒 ACCESO VIP 〕━━\n` +
    `┃ ${commandName} es exclusivo VIP.\n` +
    `┃ Tu cuenta aún no tiene un plan activo.\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +
    `Con VIP desbloqueas:\n` +
    `_⭐ stars_\n` +
    `_Banco VIP_\n` +
    `_Transferencias VIP_\n` +
    `_Conversión VIP_\n\n` +
    `Ver planes:\n` +
    `*${prefix}vipshop*\n\n` +
    `Canjear código:\n` +
    `*${prefix}redeem CODIGO*`
  )
}

function roundStars(num = 0) {
  return Math.round(Number(num || 0) * 100) / 100
}

function getVipTotalStars(user = {}) {
  const vip = ensureVip(user)
  return roundStars(Number(vip.stars || 0) + Number(vip.starsBank || 0))
}

function removeStarsFromAllVip(user = {}, amount = 0) {
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
    fromWallet,
    fromBank,
    removed: roundStars(fromWallet + fromBank)
  }
}


function starsToSoles(stars = 0) {
  return Math.floor(Number(stars || 0) * STAR_VALUE_SOLES)
}

function solesToStars(soles = 0) {
  return Math.round((Number(soles || 0) / STAR_VALUE_SOLES) * 100) / 100
}

function parseAmount(input = '', allowDecimal = false) {
  const text = String(input || '').toLowerCase().trim()
  if (text === 'all' || text === 'todo') return 'all'

  const clean = allowDecimal
    ? text.replace(/[^\d.,]/g, '').replace(',', '.')
    : text.replace(/[^\d]/g, '')

  const number = Number(clean)
  return Number.isFinite(number) ? number : 0
}

function addStars(user = {}, amount = 0) {
  const vip = ensureVip(user)
  vip.stars = Math.round((Number(vip.stars || 0) + Number(amount || 0)) * 100) / 100
  return vip.stars
}

function removeStarsFromWallet(user = {}, amount = 0) {
  const vip = ensureVip(user)
  const count = Math.round(Number(amount || 0) * 100) / 100

  if (Number(vip.stars || 0) < count) return false

  vip.stars = Math.round((Number(vip.stars || 0) - count) * 100) / 100
  return true
}

function saveDB() {
  if (typeof global.saveDatabase === 'function') {
    global.saveDatabase()
  }
}

function checkGroupEconomy(m, usedPrefix = '.') {
  const db = getDB()
  const chatId = m.chat

  if (!String(chatId || '').endsWith('@g.us')) {
    return {
      ok: false,
      text:
        `▣ ECONOMÍA VIP\n` +
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

function getTargetJidFromArgs(m, args = []) {
  const mentioned =
    m.mentionedJid?.[0] ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
    m.quoted?.sender ||
    ''

  if (mentioned) return mentioned

  const possible = args.find(arg => String(arg || '').replace(/\D/g, '').length >= 5)
  if (!possible) return ''

  return `${String(possible).replace(/\D/g, '')}@s.whatsapp.net`
}

function buildMenu(prefix = '.') {
  return (
    `🏦 ▣ BANCO VIP\n` +
    `▪️ Moneda: ⭐ stars\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES\n\n` +

    `💼 ▣ BALANCE VIP\n` +
    `▪️ ${prefix}vbal / ${prefix}vbalance / ${prefix}vstars\n` +
    `   Ver cartera, banco y total VIP.\n\n` +

    `🏦 ▣ BANCO DE STARS\n` +
    `▪️ ${prefix}vdep cantidad / ${prefix}vdep all\n` +
    `   Guardar ⭐ stars en tu banco VIP.\n` +
    `▪️ ${prefix}vwith cantidad / ${prefix}vretirar all\n` +
    `   Retirar ⭐ stars del banco VIP.\n\n` +

    `🤝 ▣ TRANSFERENCIAS VIP\n` +
    `▪️ ${prefix}vpay 10 @usuario / ${prefix}vgive 10 @usuario\n` +
    `   Enviar ⭐ stars desde tu banco VIP.\n\n` +

    `🔁 ▣ CONVERSIÓN\n` +
    `▪️ ${prefix}vcoins2stars 100000 / ${prefix}vsellcoins all\n` +
    `   Vender SOLES normales por ⭐ stars sin comisión.\n` +
    `▪️ ${prefix}vstars2soles 10 / ${prefix}vsellstars all\n` +
    `   Convertir ⭐ stars a SOLES con 60% de comisión.\n\n` +

    `🏆 ▣ TABLAS VIP\n` +
    `▪️ ${prefix}eboardvip\n` +
    `   Simulación de ranking del grupo.\n` +
    `▪️ ${prefix}eboardvipglobal\n` +
    `   Simulación de ranking global.\n\n` +

    `📌 ▣ AVISO\n` +
    `▪️ El VIP no entra a la tabla normal.\n` +
    `▪️ Esta tabla solo simula su valor convertido.\n` +
    `▪️ Categoría superior: ⭐ stars.`
  )
}

function buildBalanceText({ user, normalUser, currency }) {
  const vip = ensureVip(user)

  const wallet = Number(vip.stars || 0)
  const bank = Number(vip.starsBank || 0)
  const total = Math.round((wallet + bank) * 100) / 100
  const simulatedSoles = starsToSoles(total)

  const normalWallet = Number(normalUser?.coins || 0)
  const normalBank = Number(normalUser?.bank || 0)
  const normalTotal = normalWallet + normalBank

  return (
    `🏦 ▣ BALANCE VIP\n` +
    `▪️ Nivel: ${getVipLabel(user)}\n` +
    `▪️ Cartera VIP: ${starsText(wallet)}\n` +
    `▪️ Banco VIP: ${starsText(bank)}\n` +
    `▪️ Total VIP: ${starsText(total)}\n\n` +
    `🔁 ▣ VALOR SIMULADO\n` +
    `▪️ Stars a SOLES: ${formatMoney(simulatedSoles, currency)}\n` +
    `▪️ Economía normal: ${formatMoney(normalTotal, currency)}\n` +
    `▪️ Simulado total: ${formatMoney(normalTotal + simulatedSoles, currency)}\n\n` +
    `📌 Esto no te mete al ranking normal.\n` +
    `Tu categoría superior es VIP.`
  )
}

async function handleBalance({ m, client, usedPrefix, senderReal, senderUser }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const { user: normalUser } = getLocalUser(m.chat, senderReal, false)
  const currency = getBotCurrency(client)

  return m.reply(buildBalanceText({
    user: senderUser,
    normalUser,
    currency
  }))
}

async function handleDeposit({ m, args, usedPrefix, senderUser }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const vip = ensureVip(senderUser)
  const input = parseAmount(args[0], true)

  if (!args[0]) {
    return m.reply(
      `🏦 ▣ DEPÓSITO VIP\n` +
      `▪️ Usa: *${usedPrefix}vdep 10*\n` +
      `▪️ Todo: *${usedPrefix}vdep all*`
    )
  }

  const amount = input === 'all'
    ? Number(vip.stars || 0)
    : Number(input || 0)

  if (!amount || amount <= 0) {
    return m.reply(`❌ Cantidad inválida.`)
  }

  if (Number(vip.stars || 0) < amount) {
    return m.reply(
      `❌ ▣ STARS INSUFICIENTES\n` +
      `▪️ Cartera VIP: ${starsText(vip.stars || 0)}\n` +
      `▪️ Intentaste guardar: ${starsText(amount)}`
    )
  }

  vip.stars = Math.round((Number(vip.stars || 0) - amount) * 100) / 100
  vip.starsBank = Math.round((Number(vip.starsBank || 0) + amount) * 100) / 100

  saveDB()

  return m.reply(
    `✅ ▣ DEPÓSITO VIP\n` +
    `▪️ Guardaste: ${starsText(amount)}\n` +
    `▪️ Cartera VIP: ${starsText(vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(vip.starsBank)}`
  )
}

async function handleWithdraw({ m, args, usedPrefix, senderUser }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const vip = ensureVip(senderUser)
  const input = parseAmount(args[0], true)

  if (!args[0]) {
    return m.reply(
      `🏦 ▣ RETIRO VIP\n` +
      `▪️ Usa: *${usedPrefix}vwith 10*\n` +
      `▪️ Todo: *${usedPrefix}vretirar all*`
    )
  }

  const amount = input === 'all'
    ? Number(vip.starsBank || 0)
    : Number(input || 0)

  if (!amount || amount <= 0) {
    return m.reply(`❌ Cantidad inválida.`)
  }

  if (Number(vip.starsBank || 0) < amount) {
    return m.reply(
      `❌ ▣ BANCO VIP INSUFICIENTE\n` +
      `▪️ Banco VIP: ${starsText(vip.starsBank || 0)}\n` +
      `▪️ Intentaste retirar: ${starsText(amount)}`
    )
  }

  vip.starsBank = Math.round((Number(vip.starsBank || 0) - amount) * 100) / 100
  vip.stars = Math.round((Number(vip.stars || 0) + amount) * 100) / 100

  saveDB()

  return m.reply(
    `✅ ▣ RETIRO VIP\n` +
    `▪️ Retiraste: ${starsText(amount)}\n` +
    `▪️ Cartera VIP: ${starsText(vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(vip.starsBank)}`
  )
}

async function handlePay({ m, client, args, usedPrefix, senderReal, senderUser }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const targetRaw = getTargetJidFromArgs(m, args)

  if (!targetRaw) {
    return m.reply(
      `🤝 ▣ VPAY\n` +
      `▪️ Usa: *${usedPrefix}vpay 10 @usuario*\n` +
      `▪️ Se envía desde tu banco VIP.`
    )
  }

  const amount = parseAmount(args[0], true)

  if (!amount || amount <= 0 || amount === 'all') {
    return m.reply(`❌ Ingresa una cantidad válida.`)
  }

  const targetReal = await resolveRealJid(targetRaw, client, m.chat)

  if (sameUser(senderReal, targetReal)) {
    return m.reply(`❌ No puedes enviarte stars a ti mismo.`)
  }

  const senderVip = ensureVip(senderUser)
  const targetGlobal = getGlobalUser(targetReal)
  const targetVip = ensureVip(targetGlobal.user)

  if (!isVipActive(targetGlobal.user)) {
    return m.reply(
      `❌ ▣ USUARIO NO VIP\n` +
      `▪️ El usuario mencionado no tiene VIP activo.\n` +
      `▪️ Solo se pueden enviar ⭐ stars a usuarios VIP.`
    )
  }

  const limit = getVpayLimitStatus(senderVip, amount)

  if (!limit.ok) {
    return m.reply(
      `⛔ ▣ LÍMITE VPAY\n` +
      `▪️ Máximo: ${starsText(VPAY_LIMIT_STARS)} cada 2 horas.\n` +
      `▪️ Ya usaste: ${starsText(limit.used)}\n` +
      `▪️ Disponible ahora: ${starsText(limit.available)}\n` +
      `▪️ Reinicia en: *${formatTime(limit.remaining)}*`
    )
  }

  if (Number(senderVip.starsBank || 0) < amount) {
    return m.reply(
      `❌ ▣ BANCO VIP INSUFICIENTE\n` +
      `▪️ Tu banco VIP: ${starsText(senderVip.starsBank || 0)}\n` +
      `▪️ Intentaste enviar: ${starsText(amount)}\n` +
      `▪️ Guarda con: *${usedPrefix}vdep all*`
    )
  }

  registerVpayLimit(senderVip, amount)

  senderVip.starsBank = Math.round((Number(senderVip.starsBank || 0) - amount) * 100) / 100
  targetVip.starsBank = Math.round((Number(targetVip.starsBank || 0) + amount) * 100) / 100

  saveDB()

  return client.sendMessage(m.chat, {
    text:
      `✅ ▣ TRANSFERENCIA VIP\n` +
      `▪️ Destino: @${onlyNumber(targetReal)}\n` +
      `▪️ Enviado: ${starsText(amount)}\n` +
      `▪️ Tu banco VIP: ${starsText(senderVip.starsBank)}`,
    mentions: [targetReal]
  }, { quoted: m })
}

function takeNormalSoles(normalUser = {}, amount = 0) {
  let remaining = Math.floor(Number(amount || 0))

  const fromWallet = Math.min(Number(normalUser.coins || 0), remaining)
  normalUser.coins = Number(normalUser.coins || 0) - fromWallet
  remaining -= fromWallet

  const fromBank = Math.min(Number(normalUser.bank || 0), remaining)
  normalUser.bank = Number(normalUser.bank || 0) - fromBank
  remaining -= fromBank

  return {
    ok: remaining <= 0,
    fromWallet,
    fromBank,
    taken: fromWallet + fromBank
  }
}

async function handleSolesToStars({ m, client, args, usedPrefix, senderReal, senderUser }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const { user: normalUser } = getLocalUser(m.chat, senderReal, false)
  const currency = getBotCurrency(client)

  if (!normalUser) {
    return m.reply(
      `❌ ▣ ECONOMÍA NORMAL\n` +
      `▪️ No tienes economía normal en este grupo.\n` +
      `▪️ Usa: *${usedPrefix}daily* para empezar.`
    )
  }

  const normalTotal = Number(normalUser.coins || 0) + Number(normalUser.bank || 0)
  const input = parseAmount(args[0], false)

  if (!args[0]) {
    return m.reply(
      `🔁 ▣ SOLES A STARS\n` +
      `▪️ Usa: *${usedPrefix}vcoins2stars 100000*\n` +
      `▪️ Todo: *${usedPrefix}vsellcoins all*\n` +
      `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES\n` +
      `▪️ Comisión: 0%`
    )
  }

  const amount = input === 'all'
    ? normalTotal
    : Math.floor(Number(input || 0))

  if (!amount || amount <= 0) {
    return m.reply(`❌ Cantidad inválida.`)
  }

  if (normalTotal < amount) {
    return m.reply(
      `❌ ▣ SOLES INSUFICIENTES\n` +
      `▪️ Total normal: ${formatMoney(normalTotal, currency)}\n` +
      `▪️ Intentaste vender: ${formatMoney(amount, currency)}`
    )
  }

  const taken = takeNormalSoles(normalUser, amount)

  if (!taken.ok) {
    return m.reply(`❌ No pude retirar los SOLES normales.`)
  }

  const stars = solesToStars(amount)
  addStars(senderUser, stars)

  saveDB()

  return m.reply(
    `✅ ▣ SOLES VENDIDOS\n` +
    `▪️ Vendiste: ${formatMoney(amount, currency)}\n` +
    `▪️ Comisión: 0%\n` +
    `▪️ Recibiste: ${starsText(stars)}\n\n` +
    `🏦 ▣ SALDOS\n` +
    `▪️ Cartera VIP: ${starsText(senderUser.vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(senderUser.vip.starsBank)}\n` +
    `▪️ Normal restante: ${formatMoney(Number(normalUser.coins || 0) + Number(normalUser.bank || 0), currency)}`
  )
}

async function handleStarsToSoles({
  m,
  client,
  args,
  usedPrefix,
  senderReal,
  senderUser,
  allowExpiredCashout = false
}) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const { user: normalUser } = getLocalUser(m.chat, senderReal, true)
  const currency = getBotCurrency(client)
  const vip = ensureVip(senderUser)

  const activeVip = isVipActive(senderUser)
  const taxRate = activeVip ? STAR_TO_SOLES_TAX : EXPIRED_STAR_TO_SOLES_TAX
  const taxPercent = Math.round(taxRate * 100)

  const availableStars = activeVip
    ? Number(vip.stars || 0)
    : getVipTotalStars(senderUser)

  const input = parseAmount(args[0], true)

  if (!args[0]) {
    return m.reply(
      `🔁 ▣ STARS A SOLES\n` +
      `▪️ Usa: *${usedPrefix}vstars2soles 10*\n` +
      `▪️ Todo: *${usedPrefix}vsellstars all*\n` +
      `▪️ Comisión: ${taxPercent}%\n` +
      `▪️ Disponible: ${starsText(availableStars)}\n\n` +
      `📌 Si tu VIP expiró, puedes hacer salida con 15% de comisión.`
    )
  }

if (!activeVip && !allowExpiredCashout) {
  return m.reply(buildVipAccessText(senderUser, usedPrefix, usedPrefix + 'vstars2soles'))
}

  const amountStars = input === 'all'
    ? availableStars
    : Number(input || 0)

  if (!amountStars || amountStars <= 0) {
    return m.reply(`❌ Cantidad inválida.`)
  }

  if (availableStars < amountStars) {
    return m.reply(
      `❌ ▣ STARS INSUFICIENTES\n` +
      `▪️ Disponible: ${starsText(availableStars)}\n` +
      `▪️ Intentaste convertir: ${starsText(amountStars)}`
    )
  }

  const grossSoles = starsToSoles(amountStars)
  const tax = Math.floor(grossSoles * taxRate)
  const received = grossSoles - tax

  if (activeVip) {
    const removed = removeStarsFromWallet(senderUser, amountStars)

    if (!removed) {
      return m.reply(`❌ No pude retirar tus stars.`)
    }
  } else {
    const removed = removeStarsFromAllVip(senderUser, amountStars)

    if (!removed.ok) {
      return m.reply(`❌ No pude retirar tus stars protegidas.`)
    }
  }

  normalUser.coins = Number(normalUser.coins || 0) + received

  saveDB()

  return m.reply(
    `✅ ▣ STARS CONVERTIDOS\n` +
    `▪️ Estado VIP: ${activeVip ? 'Activo' : 'Expirado'}\n` +
    `▪️ Vendiste: ${starsText(amountStars)}\n` +
    `▪️ Valor bruto: ${formatMoney(grossSoles, currency)}\n` +
    `▪️ Comisión ${taxPercent}%: ${formatMoney(tax, currency)}\n` +
    `▪️ Recibiste: ${formatMoney(received, currency)}\n\n` +
    `🏦 ▣ SALDOS\n` +
    `▪️ Cartera VIP: ${starsText(vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(vip.starsBank)}\n` +
    `▪️ SOLES normales: ${formatMoney(Number(normalUser.coins || 0) + Number(normalUser.bank || 0), currency)}\n\n` +
    `📌 ${activeVip ? 'Conversión normal con comisión alta para proteger el ranking.' : 'Salida por VIP expirado con comisión reducida.'}`
  )
}

function buildLocalVipBoard({ chatId, senderReal, currency, page = 1, usedPrefix = '.' }) {
  const db = getDB()
  const chatData = db.chats?.[chatId] || {}
  const usersMap = chatData.users || {}

  const rows = []

  for (const [jid, localData] of Object.entries(usersMap)) {
    const globalKey = findUserKey(db.users, jid)
    const globalData = db.users[globalKey] || {}
    const vip = ensureVip(globalData)

    const normalTotal = Number(localData.coins || 0) + Number(localData.bank || 0)
    const starsTotal = Number(vip.stars || 0) + Number(vip.starsBank || 0)
    const starsValue = starsToSoles(starsTotal)
    const simulatedTotal = normalTotal + starsValue

    if (simulatedTotal <= 0) continue
    if (!isVipActive(globalData) && starsTotal <= 0) continue

    rows.push({
      jid,
      name: getUserDisplayName(jid, localData, globalData),
      normalTotal,
      starsTotal,
      starsValue,
      simulatedTotal,
      vipLabel: getVipLabel(globalData)
    })
  }

  rows.sort((a, b) => b.simulatedTotal - a.simulatedTotal)

  if (!rows.length) {
    return (
      `🏆 ▣ EBOARD VIP\n` +
      `▪️ Aún no hay usuarios VIP con economía para mostrar.`
    )
  }

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  const senderPos = rows.findIndex(row => sameUser(row.jid, senderReal)) + 1
  const medals = ['🥇', '🥈', '🥉']

  let text =
    `🏆 ▣ EBOARD VIP\n` +
    `▪️ Modo: Grupo\n` +
    `▪️ Página: ${safePage}/${totalPages}\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES\n\n` +
    `📌 Esta es una simulación VIP.\n` +
    `Los VIP no entran a la tabla normal porque tienen una categoría superior.\n\n`

  text += pageRows.map((row, i) => {
    const rank = start + i + 1
    const medal = medals[rank - 1] || '🏅'

    return (
      `${medal} TOP ${rank} — ${row.name}\n` +
      `┃ ${row.vipLabel}\n` +
      `┃ ⭐ Stars: ${starsText(row.starsTotal)}\n` +
      `┃ 🔁 Stars convertidos: ${formatMoney(row.starsValue, currency)}\n` +
      `┃ 💰 SOLES normales: ${formatMoney(row.normalTotal, currency)}\n` +
      `┃ 📊 Total simulado: ${formatMoney(row.simulatedTotal, currency)}`
    )
  }).join('\n\n')

  if (senderPos > 0) {
    text += `\n\n📍 Tu posición simulada: #${senderPos}`
  }

  if (safePage < totalPages) {
    text += `\n\n➡️ Siguiente: *${usedPrefix}eboardvip ${safePage + 1}*`
  }

  if (safePage > 1) {
    text += `\n⬅️ Anterior: *${usedPrefix}eboardvip ${safePage - 1}*`
  }

  return text
}

function buildGlobalVipBoard({ senderReal, currency, page = 1, usedPrefix = '.' }) {
  const db = getDB()
  const globalUsers = new Map()

  for (const [groupId, groupData] of Object.entries(db.chats || {})) {
    if (!groupData?.users) continue

    for (const [jid, localData] of Object.entries(groupData.users || {})) {
      const key = findUserKey(db.users, jid)
      const normalTotal = Number(localData.coins || 0) + Number(localData.bank || 0)

      if (!globalUsers.has(key)) {
        globalUsers.set(key, {
          jid: key,
          normalTotal: 0,
          groups: 0
        })
      }

      const item = globalUsers.get(key)
      item.normalTotal += normalTotal
      item.groups += 1
    }
  }

  for (const jid of Object.keys(db.users || {})) {
    if (!globalUsers.has(jid)) {
      globalUsers.set(jid, {
        jid,
        normalTotal: 0,
        groups: 0
      })
    }
  }

  const rows = []

  for (const item of globalUsers.values()) {
    const globalKey = findUserKey(db.users, item.jid)
    const globalData = db.users[globalKey] || {}
    const vip = ensureVip(globalData)

    const starsTotal = Number(vip.stars || 0) + Number(vip.starsBank || 0)
    const starsValue = starsToSoles(starsTotal)
    const simulatedTotal = Number(item.normalTotal || 0) + starsValue

    if (simulatedTotal <= 0) continue
    if (!isVipActive(globalData) && starsTotal <= 0) continue

    rows.push({
      jid: globalKey,
      name: globalData?.name || globalKey.split('@')[0],
      normalTotal: Number(item.normalTotal || 0),
      groups: item.groups || 0,
      starsTotal,
      starsValue,
      simulatedTotal,
      vipLabel: getVipLabel(globalData)
    })
  }

  rows.sort((a, b) => b.simulatedTotal - a.simulatedTotal)

  if (!rows.length) {
    return (
      `🌍 ▣ EBOARD VIP GLOBAL\n` +
      `▪️ Aún no hay usuarios VIP con economía global para mostrar.`
    )
  }

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  const senderPos = rows.findIndex(row => sameUser(row.jid, senderReal)) + 1
  const medals = ['🥇', '🥈', '🥉']

  let text =
    `🌍 ▣ EBOARD VIP GLOBAL\n` +
    `▪️ Modo: Global\n` +
    `▪️ Página: ${safePage}/${totalPages}\n` +
    `▪️ Usuarios: ${rows.length}\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES\n\n` +
    `📌 Esta tabla es simulada.\n` +
    `Los VIP no compiten en la tabla normal; se muestra su valor convertido como referencia.\n\n`

  text += pageRows.map((row, i) => {
    const rank = start + i + 1
    const medal = medals[rank - 1] || '🏅'

    return (
      `${medal} TOP ${rank} — ${row.name}\n` +
      `┃ ${row.vipLabel}\n` +
      `┃ ⭐ Stars: ${starsText(row.starsTotal)}\n` +
      `┃ 🔁 Stars convertidos: ${formatMoney(row.starsValue, currency)}\n` +
      `┃ 💰 SOLES normales globales: ${formatMoney(row.normalTotal, currency)}\n` +
      `┃ 📊 Total simulado: ${formatMoney(row.simulatedTotal, currency)}\n` +
      `┃ 👥 Grupos: ${row.groups}`
    )
  }).join('\n\n')

  if (senderPos > 0) {
    text += `\n\n📍 Tu posición simulada global: #${senderPos}`
  }

  if (safePage < totalPages) {
    text += `\n\n➡️ Siguiente: *${usedPrefix}eboardvipglobal ${safePage + 1}*`
  }

  if (safePage > 1) {
    text += `\n⬅️ Anterior: *${usedPrefix}eboardvipglobal ${safePage - 1}*`
  }

  return text
}

async function handleBoard({ m, client, args, usedPrefix, senderReal }) {
  const check = checkGroupEconomy(m, usedPrefix)
  if (!check.ok) return m.reply(check.text)

  const currency = getBotCurrency(client)
  const page = Math.max(1, parseInt(args[0]) || 1)

  return m.reply(buildLocalVipBoard({
    chatId: m.chat,
    senderReal,
    currency,
    page,
    usedPrefix
  }))
}

async function handleBoardGlobal({ m, client, args, usedPrefix, senderReal }) {
  const currency = getBotCurrency(client)
  const page = Math.max(1, parseInt(args[0]) || 1)

  return m.reply(buildGlobalVipBoard({
    senderReal,
    currency,
    page,
    usedPrefix
  }))
}

export default {
  command: [
    ...COMMANDS.balance,
    ...COMMANDS.deposit,
    ...COMMANDS.withdraw,
    ...COMMANDS.pay,
    ...COMMANDS.solesToStars,
    ...COMMANDS.starsToSoles,
    ...COMMANDS.board,
    ...COMMANDS.boardGlobal,
    ...COMMANDS.menu
  ],
  category: 'VIP',

  run: async (client, m, args = [], usedPrefix = '.', command = '') => {
    try {
      const cmdType = getCommandType(command)

      const senderReal = await getSenderReal(m, client)
      const senderGlobal = getGlobalUser(senderReal)
      const senderUser = senderGlobal.user

      if (cmdType === 'menu') {
        return m.reply(buildMenu(usedPrefix))
      }

const activeVip = isVipActive(senderUser)
const hadVip = hadVipBefore(senderUser)

const allowExpiredCashout = !activeVip && hadVip && cmdType === 'starsToSoles'
const allowExpiredBalance = !activeVip && hadVip && cmdType === 'balance'

if (!activeVip && !allowExpiredCashout && !allowExpiredBalance) {
  return m.reply(buildVipAccessText(senderUser, usedPrefix, usedPrefix + command))
}

      if (cmdType === 'balance') {
        return await handleBalance({ m, client, usedPrefix, senderReal, senderUser })
      }

      if (cmdType === 'deposit') {
        return await handleDeposit({ m, args, usedPrefix, senderUser })
      }

      if (cmdType === 'withdraw') {
        return await handleWithdraw({ m, args, usedPrefix, senderUser })
      }

      if (cmdType === 'pay') {
        return await handlePay({ m, client, args, usedPrefix, senderReal, senderUser })
      }

      if (cmdType === 'solesToStars') {
        return await handleSolesToStars({ m, client, args, usedPrefix, senderReal, senderUser })
      }

if (cmdType === 'starsToSoles') {
  return await handleStarsToSoles({
    m,
    client,
    args,
    usedPrefix,
    senderReal,
    senderUser,
    allowExpiredCashout
  })
}

      if (cmdType === 'board') {
        return await handleBoard({ m, client, args, usedPrefix, senderReal })
      }

      if (cmdType === 'boardGlobal') {
        return await handleBoardGlobal({ m, client, args, usedPrefix, senderReal })
      }

      return m.reply(buildMenu(usedPrefix))
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}