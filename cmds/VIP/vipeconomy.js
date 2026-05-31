import { resolveLidToRealJid } from '../../core/utils.js'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const MINUTE = 60 * 1000
const PERMANENT_UNTIL = 4102444800000
const STAR_VALUE_SOLES = 10000

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const VIP_LEVELS = {
  basico: {
    name: 'VIP Básico',
    badge: '💎',
    multiplier: 1,
    cooldowns: {
      work: 45 * MINUTE,
      slut: 70 * MINUTE,
      crime: 100 * MINUTE
    },
    ranges: {
      work: [50000, 120000],
      slut: [120000, 300000],
      crime: [250000, 700000]
    },
    success: {
      slut: 78,
      crime: 55
    },
    penalties: {
      slut: [2, 8],
      crime: [8, 35]
    }
  },

  plus: {
    name: 'VIP Plus',
    badge: '🔥',
    multiplier: 1.25,
    cooldowns: {
      work: 35 * MINUTE,
      slut: 55 * MINUTE,
      crime: 80 * MINUTE
    },
    ranges: {
      work: [80000, 180000],
      slut: [200000, 480000],
      crime: [450000, 1100000]
    },
    success: {
      slut: 82,
      crime: 60
    },
    penalties: {
      slut: [4, 12],
      crime: [12, 55]
    }
  },

  ultra: {
    name: 'VIP Ultra',
    badge: '👑',
    multiplier: 1.5,
    cooldowns: {
      work: 25 * MINUTE,
      slut: 40 * MINUTE,
      crime: 60 * MINUTE
    },
    ranges: {
      work: [120000, 280000],
      slut: [350000, 750000],
      crime: [800000, 1800000]
    },
    success: {
      slut: 86,
      crime: 66
    },
    penalties: {
      slut: [6, 18],
      crime: [18, 85]
    }
  }
}

const COMMAND_GROUPS = {
  work: [
    'vwork',
    'vw',
    'vchambear',
    'vtrabajar',
    'vtrabajo',
    'vlaburar',
    'vcurro',
    'vjob'
  ],

  slut: [
    'vslut',
    'vsl',
    'vnocturno',
    'vnight',
    'vriesgo',
    'vcalle'
  ],

  crime: [
    'vcrime',
    'vc',
    'vcrimen',
    'vdelito',
    'vmision',
    'vrisk',
    'vilegal'
  ],

  menu: [
    'vjobs',
    'vtrabajos',
    'veco',
    'vjobmenu'
  ]
}

const WORK_EVENTS = [
  'reparaste un servidor del inframundo',
  'hiciste soporte VIP en un grupo caótico',
  'trabajaste organizando comandos del bot',
  'limpiaste bugs y cobraste tu pago VIP',
  'ayudaste a mantener prendido el sistema'
]

const SLUT_EVENTS = [
  'hiciste una misión nocturna de carisma',
  'entraste a un evento privado del bot',
  'trabajaste en relaciones públicas VIP',
  'aceptaste una tarea rara pero rentable',
  'hiciste una movida social de alto riesgo'
]

const CRIME_EVENTS = [
  'hiciste una misión turbia del inframundo',
  'ejecutaste una operación secreta del bot',
  'entraste a una jugada arriesgada',
  'hiciste una vuelta peligrosa y silenciosa',
  'probaste suerte en una misión prohibida'
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

async function getSenderReal(m, client) {
  try {
    return await resolveLidToRealJid(m.sender, client, m.chat)
  } catch {
    return m.sender
  }
}

function getDB() {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}
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

function ensureVip(user = {}) {
  user.vip ||= {}

  if (typeof user.vip.active !== 'boolean') user.vip.active = false
  if (typeof user.vip.type !== 'string') user.vip.type = ''
  if (typeof user.vip.since !== 'number') user.vip.since = 0
  if (typeof user.vip.until !== 'number') user.vip.until = 0
  if (typeof user.vip.title !== 'string') user.vip.title = ''
  if (typeof user.vip.stars !== 'number') user.vip.stars = 0
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false

  if (typeof user.vip.lastVWork !== 'number') user.vip.lastVWork = 0
  if (typeof user.vip.lastVSlut !== 'number') user.vip.lastVSlut = 0
  if (typeof user.vip.lastVCrime !== 'number') user.vip.lastVCrime = 0

  return user.vip
}

function isPermanentVip(vip = {}) {
  return !!vip.permanent || Number(vip.until || 0) >= PERMANENT_UNTIL
}

function isVipActive(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!vip.active || !type || !VIP_LEVELS[type]) return false

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



function getVipConfig(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!isVipActive(user)) return null

  return VIP_LEVELS[type] || null
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

function starsText(amount = 0) {
  return `⭐ ${formatStars(amount)} stars`
}

function formatSoles(num = 0) {
  return `${formatNumber(num)} SOLES`
}

function solesToStars(amount = 0) {
  const stars = Number(amount || 0) / STAR_VALUE_SOLES
  return Math.round(stars * 100) / 100
}

function addStars(user = {}, amount = 0) {
  const vip = ensureVip(user)
  vip.stars = Math.round((Number(vip.stars || 0) + Number(amount || 0)) * 100) / 100
  return vip.stars
}

function removeStars(user = {}, amount = 0) {
  const vip = ensureVip(user)
  vip.stars = Math.max(0, Math.round((Number(vip.stars || 0) - Number(amount || 0)) * 100) / 100)
  return vip.stars
}


function saveDB() {
  if (typeof global.saveDatabase === 'function') {
    global.saveDatabase()
  }
}


function randomInt(min = 0, max = 0) {
  const a = Math.ceil(Number(min || 0))
  const b = Math.floor(Number(max || 0))

  if (b <= a) return a

  return Math.floor(Math.random() * (b - a + 1)) + a
}

function randomItem(list = []) {
  return list[Math.floor(Math.random() * list.length)] || ''
}

function formatTime(ms = 0) {
  const n = Math.max(0, Number(ms || 0))

  if (n <= 0) return 'Disponible'

  const d = Math.floor(n / DAY)
  const h = Math.floor((n % DAY) / HOUR)
  const m = Math.floor((n % HOUR) / MINUTE)

  const parts = []

  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)

  return parts.length ? parts.join(' ') : 'menos de 1m'
}

function cooldownStatus(last = 0, cooldown = 0) {
  const now = Date.now()
  const next = Number(last || 0) + Number(cooldown || 0)

  return {
    ok: now >= next,
    remaining: Math.max(0, next - now)
  }
}

function getCommandType(command = '') {
  const cmd = String(command || '').toLowerCase()

  for (const [type, aliases] of Object.entries(COMMAND_GROUPS)) {
    if (aliases.includes(cmd)) return type
  }

  return ''
}

function buildMenu(prefix = '.') {
  return (
    `💼 ▣ ECONOMÍA VIP\n` +
    `▪️ Moneda VIP: ⭐ stars\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES\n\n` +

    `🛠️ ▣ TRABAJO VIP\n` +
    `▪️ *${prefix}vwork* / *${prefix}vw* / *${prefix}vchambear*\n` +
    `   Trabajo VIP seguro para ganar ⭐ stars.\n\n` +

    `🌙 ▣ MISIÓN NOCTURNA\n` +
    `▪️ *${prefix}vslut* / *${prefix}vsl* / *${prefix}vnocturno*\n` +
    `   Misión VIP con riesgo bajo.\n\n` +

    `🕶️ ▣ MISIÓN RIESGOSA\n` +
    `▪️ *${prefix}vcrime* / *${prefix}vc* / *${prefix}vcrimen*\n` +
    `   Misión VIP con más riesgo y más recompensa.\n\n` +

    `📌 ▣ NOTA\n` +
    `▪️ Estos comandos no dan SOLES directos.\n` +
    `▪️ Solo suman o restan ⭐ stars.\n` +
    `▪️ Requieren VIP activo.`
  )
}

async function runWork({ m, usedPrefix, senderUser, senderVip, cfg }) {
  const cd = cooldownStatus(senderVip.lastVWork, cfg.cooldowns.work)

  if (!cd.ok) {
    return m.reply(
      `⏳ ▣ VWORK EN COOLDOWN\n` +
      `▪️ Disponible en: *${formatTime(cd.remaining)}*`
    )
  }

  const baseSoles = randomInt(...cfg.ranges.work)
  const rawStars = solesToStars(baseSoles)
  const stars = Math.round(rawStars * cfg.multiplier * 100) / 100

  addStars(senderUser, stars)
  senderVip.lastVWork = Date.now()
  saveDB()

  return m.reply(
    `🛠️ ▣ VWORK COMPLETADO\n` +
    `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
    `▪️ Trabajo: ${randomItem(WORK_EVENTS)}.\n` +
    `▪️ Base: ${formatSoles(baseSoles)}\n` +
    `▪️ Multiplicador: x${cfg.multiplier}\n` +
    `▪️ Ganaste: ${starsText(stars)}\n` +
    `▪️ Total: ${starsText(senderVip.stars)}\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES`
  )
}

async function runSlut({ m, senderUser, senderVip, cfg }) {
  const cd = cooldownStatus(senderVip.lastVSlut, cfg.cooldowns.slut)

  if (!cd.ok) {
    return m.reply(
      `⏳ ▣ VSLUT EN COOLDOWN\n` +
      `▪️ Disponible en: *${formatTime(cd.remaining)}*`
    )
  }

  const successRoll = randomInt(1, 100)
  const success = successRoll <= cfg.success.slut

  senderVip.lastVSlut = Date.now()

  if (!success) {
    const penalty = randomInt(...cfg.penalties.slut)
    removeStars(senderUser, penalty)
    saveDB()

    return m.reply(
      `🌙 ▣ VSLUT FALLIDO\n` +
      `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
      `▪️ La misión nocturna salió mal.\n` +
      `▪️ Perdiste: ${starsText(penalty)}\n` +
      `▪️ Total: ${starsText(senderVip.stars)}`
    )
  }

  const baseSoles = randomInt(...cfg.ranges.slut)
  const rawStars = solesToStars(baseSoles)
  const stars = Math.round(rawStars * cfg.multiplier * 100) / 100

  addStars(senderUser, stars)
  saveDB()

  return m.reply(
    `🌙 ▣ VSLUT COMPLETADO\n` +
    `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
    `▪️ Misión: ${randomItem(SLUT_EVENTS)}.\n` +
    `▪️ Base: ${formatSoles(baseSoles)}\n` +
    `▪️ Multiplicador: x${cfg.multiplier}\n` +
    `▪️ Ganaste: ${starsText(stars)}\n` +
    `▪️ Total: ${starsText(senderVip.stars)}\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES`
  )
}

async function runCrime({ m, senderUser, senderVip, cfg }) {
  const cd = cooldownStatus(senderVip.lastVCrime, cfg.cooldowns.crime)

  if (!cd.ok) {
    return m.reply(
      `⏳ ▣ VCRIME EN COOLDOWN\n` +
      `▪️ Disponible en: *${formatTime(cd.remaining)}*`
    )
  }

  const successRoll = randomInt(1, 100)
  const success = successRoll <= cfg.success.crime

  senderVip.lastVCrime = Date.now()

  if (!success) {
    const penalty = randomInt(...cfg.penalties.crime)
    removeStars(senderUser, penalty)
    saveDB()

    return m.reply(
      `🕶️ ▣ VCRIME FALLIDO\n` +
      `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
      `▪️ La misión fue detectada por el sistema.\n` +
      `▪️ Perdiste: ${starsText(penalty)}\n` +
      `▪️ Total: ${starsText(senderVip.stars)}`
    )
  }

  const baseSoles = randomInt(...cfg.ranges.crime)
  const rawStars = solesToStars(baseSoles)
  const stars = Math.round(rawStars * cfg.multiplier * 100) / 100

  addStars(senderUser, stars)
  saveDB()

  return m.reply(
    `🕶️ ▣ VCRIME EXITOSO\n` +
    `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
    `▪️ Misión: ${randomItem(CRIME_EVENTS)}.\n` +
    `▪️ Base: ${formatSoles(baseSoles)}\n` +
    `▪️ Multiplicador: x${cfg.multiplier}\n` +
    `▪️ Ganaste: ${starsText(stars)}\n` +
    `▪️ Total: ${starsText(senderVip.stars)}\n` +
    `▪️ Equivalencia: ⭐ 1 star = 10,000 SOLES`
  )
}

export default {
  command: [
    ...COMMAND_GROUPS.work,
    ...COMMAND_GROUPS.slut,
    ...COMMAND_GROUPS.crime,
    ...COMMAND_GROUPS.menu
  ],
  category: 'VIP',

  run: async (client, m, args = [], usedPrefix = '.', command = '') => {
    try {
      const senderReal = await getSenderReal(m, client)
      const { user: senderUser } = getGlobalUser(senderReal)
      const senderVip = ensureVip(senderUser)
      const cfg = getVipConfig(senderUser)
      const type = getCommandType(command)

      if (type === 'menu') {
        return m.reply(buildMenu(usedPrefix))
      }

if (!cfg) {
  const vip = ensureVip(senderUser)
  const hadVip = !!(
    vip.type ||
    vip.since ||
    vip.until ||
    vip.stars ||
    vip.starsBank ||
    vip.title
  )

  if (hadVip) {
    return m.reply(
      `╭━━〔 ⏳ VIP EXPIRADO 〕━━\n` +
      `┃ Tu VIP ya no está activo.\n` +
      `┃ Tus ⭐ stars están protegidas.\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `Para volver a usar comandos VIP:\n` +
      `*${usedPrefix}vipshop*\n` +
      `*${usedPrefix}redeem CODIGO*\n\n` +
      `Si ya no deseas renovar:\n` +
      `*${usedPrefix}vstars2soles all*\n\n` +
      `_Comisión de salida sin renovar: 15%_`
    )
  }

  return m.reply(
    `╭━━〔 🔒 ACCESO VIP 〕━━\n` +
    `┃ Este comando pertenece al sistema VIP.\n` +
    `┃ Tu cuenta aún no tiene un plan activo.\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +
    `Con VIP desbloqueas:\n` +
    `_⭐ stars_\n` +
    `_Trabajos VIP_\n` +
    `_Misiones VIP_\n` +
    `_Recompensas premium_\n\n` +
    `Ver planes:\n` +
    `*${usedPrefix}vipshop*\n\n` +
    `Canjear código:\n` +
    `*${usedPrefix}redeem CODIGO*`
  )
}

      if (type === 'work') {
        return await runWork({ m, usedPrefix, senderUser, senderVip, cfg })
      }

      if (type === 'slut') {
        return await runSlut({ m, senderUser, senderVip, cfg })
      }

      if (type === 'crime') {
        return await runCrime({ m, senderUser, senderVip, cfg })
      }

      return m.reply(buildMenu(usedPrefix))
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}