import { resolveLidToRealJid } from '../../core/utils.js'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const PERMANENT_UNTIL = 4102444800000
const STAR_VALUE_SOLES = 10000
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
    name: 'VIP Básico',
    missionCooldown: 3 * HOUR,
    missionReward: [5, 15],
    missionSuccess: 88,
    missionPenalty: [1, 3]
  },
  plus: {
    badge: '🔥',
    name: 'VIP Plus',
    missionCooldown: 2 * HOUR,
    missionReward: [12, 28],
    missionSuccess: 90,
    missionPenalty: [2, 5]
  },
  ultra: {
    badge: '👑',
    name: 'VIP Ultra',
    missionCooldown: 90 * 60 * 1000,
    missionReward: [25, 55],
    missionSuccess: 92,
    missionPenalty: [3, 8]
  }
}

const COMMANDS = {
  history: ['vhistory', 'vhistorial', 'vmovimientos'],
  logs: ['viplogs', 'vlogs', 'vipmovs'],
  calc: ['vcalc', 'vpreview', 'vconvertirinfo'],
  addStars: ['addstars', 'darstars'],
  delStars: ['delstars', 'quitarstars'],
  mission: ['vmission', 'vquest', 'vreto', 'vmision']
}

const MISSIONS = [
  'completaste una misión secreta del servidor',
  'ayudaste a estabilizar el sistema VIP',
  'superaste una prueba de velocidad',
  'limpiaste una zona corrupta del bot',
  'ganaste una misión especial del inframundo',
  'resolviste una tarea premium antes que todos',
  'completaste una operación VIP sin errores'
]

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
  global.db.data.vipLogs ||= []
  return global.db.data
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
  if (typeof user.vip.lastVMission !== 'number') user.vip.lastVMission = 0

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
    `_Misiones VIP_\n` +
    `_Historial VIP_\n` +
    `_Recompensas premium_\n\n` +
    `Ver planes:\n` +
    `*${prefix}vipshop*\n\n` +
    `Canjear código:\n` +
    `*${prefix}redeem CODIGO*`
  )
}


function getVipConfig(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!isVipActive(user)) return null
  return VIP_TYPES[type] || null
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

function starsText(num = 0) {
  return `⭐ ${formatStars(num)} stars`
}

function formatMoney(num = 0, currency = 'Soles') {
  return `S/${formatNumber(Math.floor(Number(num || 0)))} ${currency}`
}

function starsToSoles(stars = 0) {
  return Math.floor(Number(stars || 0) * STAR_VALUE_SOLES)
}

function parseAmount(input = '') {
  const text = String(input || '').toLowerCase().trim()
  if (text === 'all' || text === 'todo') return 'all'

  const clean = text.replace(/[^\d.,]/g, '').replace(',', '.')
  const num = Number(clean)

  return Number.isFinite(num) ? num : 0
}

function getAmountFromArgs(args = []) {
  for (const arg of args) {
    const raw = String(arg || '').trim()
    if (!raw || raw.includes('@')) continue

    const n = parseAmount(raw)
    if (n && n > 0) return n
  }

  return 0
}

function roundStars(num = 0) {
  return Math.round(Number(num || 0) * 100) / 100
}

function addStars(user = {}, amount = 0) {
  const vip = ensureVip(user)
  vip.stars = roundStars(Number(vip.stars || 0) + Number(amount || 0))
  return vip.stars
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

function getTotalStars(user = {}) {
  const vip = ensureVip(user)
  return roundStars(Number(vip.stars || 0) + Number(vip.starsBank || 0))
}

function randomInt(min = 0, max = 0) {
  const a = Math.ceil(Number(min || 0))
  const b = Math.floor(Number(max || 0))
  if (b <= a) return a
  return Math.floor(Math.random() * (b - a + 1)) + a
}

function pickRandom(list = []) {
  return list[Math.floor(Math.random() * list.length)] || ''
}

function formatTime(ms = 0) {
  const n = Math.max(0, Number(ms || 0))

  if (n <= 0) return 'Disponible'

  const d = Math.floor(n / DAY)
  const h = Math.floor((n % DAY) / HOUR)
  const m = Math.floor((n % HOUR) / (60 * 1000))

  const parts = []
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)

  return parts.length ? parts.join(' ') : 'menos de 1m'
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

function formatLogDate(ms = 0) {
  const d = new Date(Number(ms || 0))
  return d.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatLogLine(log = {}, index = 0) {
  const who = log.jid ? `@${onlyNumber(log.jid)}` : '-'
  const target = log.target ? ` → @${onlyNumber(log.target)}` : ''
  const amount = log.amount ? ` | ${starsText(log.amount)}` : ''
  const detail = log.detail ? ` | ${log.detail}` : ''

  return `${index + 1}. [${formatLogDate(log.time)}] ${log.action} ${who}${target}${amount}${detail}`
}

async function getTargetJid(client, m, args = []) {
  const mentioned =
    m.mentionedJid?.[0] ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
    m.quoted?.sender ||
    ''

  if (mentioned) return await resolveRealJid(mentioned, client, m.chat)

  const raw = args.find(x => String(x || '').replace(/\D/g, '').length >= 5) || ''
  const num = String(raw).replace(/\D/g, '')

  if (num.length >= 5) return `${num}@s.whatsapp.net`
  return ''
}

function buildVipExpiredText(prefix = '.') {
  return (
    `╭━━〔 ⏳ VIP EXPIRADO 〕━━\n` +
    `┃ Tu VIP ya no está activo.\n` +
    `┃ Tus ⭐ stars están protegidas.\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +
    `Para volver a usar comandos VIP:\n` +
    `*${prefix}vipshop*\n` +
    `*${prefix}redeem CODIGO*\n\n` +
    `Si ya no deseas renovar:\n` +
    `*${prefix}vstars2soles all*\n\n` +
    `_Comisión de salida sin renovar: 15%_`
  )
}

async function handleHistory({ m, senderReal }) {
  const db = getDB()
  const logs = (db.vipLogs || [])
    .filter(log => sameUser(log.jid, senderReal) || sameUser(log.target, senderReal))
    .slice(0, 12)

  if (!logs.length) {
    return m.reply(
      `📜 ▣ HISTORIAL VIP\n` +
      `▪️ Aún no tienes movimientos VIP registrados.`
    )
  }

  return m.reply(
    `📜 ▣ HISTORIAL VIP\n` +
    `▪️ Últimos movimientos registrados:\n\n` +
    logs.map(formatLogLine).join('\n')
  )
}

async function handleLogs({ m, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const db = getDB()
  const logs = (db.vipLogs || []).slice(0, 20)

  if (!logs.length) {
    return m.reply(
      `📋 ▣ VIP LOGS\n` +
      `▪️ Aún no hay movimientos registrados.`
    )
  }

  return m.reply(
    `📋 ▣ VIP LOGS OWNER\n` +
    `▪️ Últimos movimientos del sistema:\n\n` +
    logs.map(formatLogLine).join('\n')
  )
}

async function handleCalc({ m, args, usedPrefix, senderUser }) {
  const amount = parseAmount(args[0])
  const active = isVipActive(senderUser)
  const taxRate = active ? STAR_TO_SOLES_TAX : EXPIRED_STAR_TO_SOLES_TAX
  const taxPercent = Math.round(taxRate * 100)

  if (!amount || amount <= 0 || amount === 'all') {
    return m.reply(
      `🔁 ▣ CÁLCULO VIP\n` +
      `▪️ Usa: *${usedPrefix}vcalc 10*\n` +
      `▪️ Calcula cuánto recibirías al convertir ⭐ stars a SOLES.\n` +
      `▪️ Activo: 60% comisión\n` +
      `▪️ VIP expirado: 15% comisión`
    )
  }

  const gross = starsToSoles(amount)
  const tax = Math.floor(gross * taxRate)
  const received = gross - tax

  return m.reply(
    `🔁 ▣ CÁLCULO VIP\n` +
    `▪️ Estado VIP: ${active ? 'Activo' : 'Expirado'}\n` +
    `▪️ Convertirías: ${starsText(amount)}\n` +
    `▪️ Valor bruto: ${formatMoney(gross)}\n` +
    `▪️ Comisión ${taxPercent}%: ${formatMoney(tax)}\n` +
    `▪️ Recibirías: ${formatMoney(received)}`
  )
}

async function handleAddStars({ client, m, args, usedPrefix, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const target = await getTargetJid(client, m, args)
  const amount = getAmountFromArgs(args)

  if (!target || !amount || amount <= 0) {
    return m.reply(
      `⭐ ▣ ADDSTARS\n` +
      `▪️ Usa: *${usedPrefix}addstars @usuario 50*`
    )
  }

  const targetGlobal = getGlobalUser(target)
  const vip = ensureVip(targetGlobal.user)

  addStars(targetGlobal.user, amount)

  pushVipLog({
    action: 'ADDSTARS',
    jid: target,
    amount,
    by: senderReal,
    detail: 'owner'
  })

  saveDB()

  return m.reply(
    `✅ ▣ STARS AÑADIDOS\n` +
    `▪️ Usuario: @${onlyNumber(target)}\n` +
    `▪️ Añadido: ${starsText(amount)}\n` +
    `▪️ Cartera VIP: ${starsText(vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(vip.starsBank)}`
  )
}

async function handleDelStars({ client, m, args, usedPrefix, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const target = await getTargetJid(client, m, args)
  const amount = getAmountFromArgs(args)

  if (!target || !amount || amount <= 0) {
    return m.reply(
      `⭐ ▣ DELSTARS\n` +
      `▪️ Usa: *${usedPrefix}delstars @usuario 50*`
    )
  }

  const targetGlobal = getGlobalUser(target)
  const vip = ensureVip(targetGlobal.user)
  const total = getTotalStars(targetGlobal.user)

  if (total < amount) {
    return m.reply(
      `❌ ▣ STARS INSUFICIENTES\n` +
      `▪️ Usuario: @${onlyNumber(target)}\n` +
      `▪️ Total actual: ${starsText(total)}\n` +
      `▪️ Intentaste quitar: ${starsText(amount)}`
    )
  }

  const removed = removeStarsAll(targetGlobal.user, amount)

  pushVipLog({
    action: 'DELSTARS',
    jid: target,
    amount: removed.removed,
    by: senderReal,
    detail: 'owner'
  })

  saveDB()

  return m.reply(
    `✅ ▣ STARS QUITADOS\n` +
    `▪️ Usuario: @${onlyNumber(target)}\n` +
    `▪️ Quitado: ${starsText(removed.removed)}\n` +
    `▪️ Cartera VIP: ${starsText(vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(vip.starsBank)}`
  )
}

async function handleMission({ m, usedPrefix, senderReal, senderUser }) {
  const cfg = getVipConfig(senderUser)

if (!cfg) {
  return m.reply(buildVipAccessText(senderUser, usedPrefix, usedPrefix + 'vmission'))
}

  const vip = ensureVip(senderUser)
  const next = Number(vip.lastVMission || 0) + cfg.missionCooldown
  const now = Date.now()

  if (now < next) {
    return m.reply(
      `⏳ ▣ VMISSION EN COOLDOWN\n` +
      `▪️ Disponible en: *${formatTime(next - now)}*`
    )
  }

  vip.lastVMission = now

  const roll = randomInt(1, 100)
  const success = roll <= cfg.missionSuccess

  if (!success) {
    const penalty = randomInt(...cfg.missionPenalty)
    const total = getTotalStars(senderUser)
    const loss = Math.min(total, penalty)

    if (loss > 0) {
      removeStarsAll(senderUser, loss)
    }

    pushVipLog({
      action: 'VMISSION_FAIL',
      jid: senderReal,
      amount: loss,
      detail: cfg.name
    })

    saveDB()

    return m.reply(
      `🎯 ▣ VMISSION FALLIDA\n` +
      `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
      `▪️ La misión salió mal.\n` +
      `▪️ Perdiste: ${starsText(loss)}\n` +
      `▪️ Total VIP: ${starsText(getTotalStars(senderUser))}`
    )
  }

  const reward = randomInt(...cfg.missionReward)
  addStars(senderUser, reward)

  pushVipLog({
    action: 'VMISSION_WIN',
    jid: senderReal,
    amount: reward,
    detail: cfg.name
  })

  saveDB()

  return m.reply(
    `🎯 ▣ VMISSION COMPLETADA\n` +
    `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
    `▪️ Misión: ${pickRandom(MISSIONS)}.\n` +
    `▪️ Ganaste: ${starsText(reward)}\n` +
    `▪️ Cartera VIP: ${starsText(vip.stars)}\n` +
    `▪️ Banco VIP: ${starsText(vip.starsBank)}`
  )
}

export default {
  command: [
    ...COMMANDS.history,
    ...COMMANDS.logs,
    ...COMMANDS.calc,
    ...COMMANDS.addStars,
    ...COMMANDS.delStars,
    ...COMMANDS.mission
  ],
  category: 'VIP',

  run: async (client, m, args = [], usedPrefix = '.', command = '') => {
    try {
      const senderReal = await getSenderReal(m, client)
      const senderGlobal = getGlobalUser(senderReal)
      const senderUser = senderGlobal.user
      const type = getCommandType(command)

      if (type === 'history') {
        return await handleHistory({ m, senderReal })
      }

      if (type === 'logs') {
        return await handleLogs({ m, senderReal })
      }

      if (type === 'calc') {
        return await handleCalc({ m, args, usedPrefix, senderUser })
      }

      if (type === 'addStars') {
        return await handleAddStars({ client, m, args, usedPrefix, senderReal })
      }

      if (type === 'delStars') {
        return await handleDelStars({ client, m, args, usedPrefix, senderReal })
      }

      if (type === 'mission') {
        return await handleMission({ m, usedPrefix, senderReal, senderUser })
      }

      return m.reply(`Usa: ${usedPrefix}vipmenu`)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}