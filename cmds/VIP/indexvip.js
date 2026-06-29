import { resolveLidToRealJid } from '../../core/utils.js'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const VIP_CODE_TTL = 15 * 60 * 1000
const VIP_CODE_MIN_LENGTH = 10
const VIP_CODE_MAX_LENGTH = 20
const VIP_CODE_AUTO_LENGTH = 16
const VIP_REDEEM_FAIL_LIMIT = 5
const VIP_REDEEM_BLOCK_TIME = 15 * 60 * 1000
const STAR_VALUE_SOLES = 10000

const PERMANENT_UNTIL = 4102444800000 // 01/01/2100

const VIP_PRICES = {
  basico: {
    soles30: 3,
    solesPermanent: 10,
    coins30: 25000000,
    coinsPermanent: 250000000
  },
  plus: {
    soles30: 5,
    solesPermanent: 15,
    coins30: 60000000,
    coinsPermanent: 400000000
  },
  ultra: {
    soles30: 10,
    solesPermanent: 20,
    coins30: 150000000,
    coinsPermanent: 900000000
  }
}


const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const VIP_TYPES = {
  basico: {
    key: 'basico',
    name: 'VIP Básico',
    badge: '💎',
    dailyBonus: 35,
    weeklyBonus: 0,
    monthlyBonus: 0,
    cofreCooldownDiscount: 30,
    robberyDefense: 20,
    canTitle: false,
    price: 25000000,
    vipdaily: {
      coins: [16500, 38500],
      stars: [20, 50],
      cooldown: DAY
    },
    vipcofre: {
      cooldown: 8 * HOUR,
      stars: [30, 120],
      rewards: [
        { name: 'Vacío', chance: 22, coins: [0, 0], stars: [0, 8] },
        { name: 'Común', chance: 48, coins: [25000, 70000], stars: [30, 60] },
        { name: 'Bueno', chance: 22, coins: [70000, 120000], stars: [60, 95] },
        { name: 'Raro', chance: 7, coins: [120000, 180000], stars: [95, 120] },
        { name: 'Épico', chance: 1, coins: [180000, 250000], stars: [120, 160] }
      ]
    },
    vipbox: {
      cooldown: 7 * DAY,
      coins: [50000, 150000],
      stars: [50, 120],
      rewards: [
        { name: 'Común', chance: 60 },
        { name: 'Bueno', chance: 30 },
        { name: 'Raro', chance: 9 },
        { name: 'Épico', chance: 1 }
      ]
    }
  },

  plus: {
    key: 'plus',
    name: 'VIP Plus',
    badge: '🔥',
    dailyBonus: 60,
    weeklyBonus: 40,
    monthlyBonus: 0,
    cofreCooldownDiscount: 40,
    robberyDefense: 30,
    canTitle: true,
    price: 60000000,
    vipdaily: {
      coins: [38500, 82500],
      stars: [45, 100],
      cooldown: DAY
    },
    vipcofre: {
      cooldown: 6 * HOUR,
      stars: [70, 250],
      rewards: [
        { name: 'Vacío', chance: 15, coins: [0, 0], stars: [0, 15] },
        { name: 'Común', chance: 38, coins: [80000, 150000], stars: [70, 120] },
        { name: 'Bueno', chance: 30, coins: [150000, 250000], stars: [120, 190] },
        { name: 'Raro', chance: 13, coins: [250000, 380000], stars: [190, 250] },
        { name: 'Épico', chance: 3.5, coins: [380000, 520000], stars: [250, 330] },
        { name: 'Legendario', chance: 0.5, coins: [520000, 700000], stars: [330, 420] }
      ]
    },
    vipbox: {
      cooldown: 6 * DAY,
      coins: [150000, 350000],
      stars: [120, 280],
      rewards: [
        { name: 'Común', chance: 45 },
        { name: 'Bueno', chance: 35 },
        { name: 'Raro', chance: 16 },
        { name: 'Épico', chance: 3.5 },
        { name: 'Legendario', chance: 0.5 }
      ]
    }
  },

  ultra: {
    key: 'ultra',
    name: 'VIP Ultra',
    badge: '👑',
    dailyBonus: 85,
    weeklyBonus: 60,
    monthlyBonus: 40,
    cofreCooldownDiscount: 50,
    robberyDefense: 45,
    canTitle: true,
    price: 150000000,
    vipdaily: {
      coins: [82500, 165000],
      stars: [90, 180],
      cooldown: DAY
    },
    vipcofre: {
      cooldown: 4 * HOUR,
      stars: [150, 450],
      rewards: [
        { name: 'Vacío', chance: 10, coins: [0, 0], stars: [0, 25] },
        { name: 'Común', chance: 30, coins: [150000, 280000], stars: [150, 220] },
        { name: 'Bueno', chance: 32, coins: [280000, 500000], stars: [220, 330] },
        { name: 'Raro', chance: 18, coins: [500000, 750000], stars: [330, 450] },
        { name: 'Épico', chance: 8, coins: [750000, 1000000], stars: [450, 620] },
        { name: 'Legendario', chance: 2, coins: [1000000, 1500000], stars: [620, 850] }
      ]
    },
    vipbox: {
      cooldown: 5 * DAY,
      coins: [350000, 800000],
      stars: [280, 600],
      rewards: [
        { name: 'Común', chance: 35 },
        { name: 'Bueno', chance: 35 },
        { name: 'Raro', chance: 20 },
        { name: 'Épico', chance: 8 },
        { name: 'Legendario', chance: 2 }
      ]
    }
  }
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

function solesToStars(amount = 0) {
  const stars = Number(amount || 0) / STAR_VALUE_SOLES
  return Math.round(stars * 100) / 100
}

function starsText(amount = 0) {
  return `⭐ ${formatStars(amount)} stars`
}


function formatMoney(num = 0, currency = 'Soles') {
  return `S/${formatNumber(num)} ${currency}`
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

function formatDate(ms = 0) {
  const date = new Date(Number(ms || 0))
  if (!Number(ms)) return 'No definido'

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getCurrency(client) {
  const db = global.db?.data || {}
  const botId = cleanJid(client?.user?.id || client?.user?.jid || '')
  return db.settings?.[botId]?.currency || 'Soles'
}

function getDB() {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}
  global.db.data.chats ||= {}
  global.db.data.vipCodes ||= {}

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

function getEcoUser(chatId = '', jid = '') {
  const db = getDB()
  const isGroup = String(chatId || '').endsWith('@g.us')

  if (isGroup) {
    db.chats[chatId] ||= {}
    db.chats[chatId].users ||= {}

    const key = findUserKey(db.chats[chatId].users, jid)

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

  const global = getGlobalUser(jid)

  if (typeof global.user.coins !== 'number') {
    global.user.coins = 0
  }

  if (typeof global.user.bank !== 'number') {
    global.user.bank = 0
  }

  return global
}

function normalizeVipType(type = '') {
  const t = String(type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  if (['basico', 'basic', 'b'].includes(t)) return 'basico'
  if (['plus', 'p'].includes(t)) return 'plus'
  if (['ultra', 'u'].includes(t)) return 'ultra'

  return ''
}

function ensureVip(user = {}) {
  user.vip ||= {}

  if (typeof user.vip.stars !== 'number') user.vip.stars = 0
  if (typeof user.vip.lastDaily !== 'number') user.vip.lastDaily = 0
  if (typeof user.vip.lastCofre !== 'number') user.vip.lastCofre = 0
  if (typeof user.vip.lastBox !== 'number') user.vip.lastBox = 0
  if (typeof user.vip.since !== 'number') user.vip.since = 0
  if (typeof user.vip.until !== 'number') user.vip.until = 0
  if (typeof user.vip.title !== 'string') user.vip.title = ''
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false

  return user.vip
}

function isPermanentVip(vip = {}) {
  return !!vip.permanent || Number(vip.until || 0) >= PERMANENT_UNTIL
}

function formatVipDate(vip = {}) {
  return isPermanentVip(vip) ? 'Permanente' : formatDate(vip.until)
}

function formatVipRemaining(vip = {}) {
  return isPermanentVip(vip) ? 'Permanente' : formatTime(Number(vip.until || 0) - Date.now())
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

function getVipConfig(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)

  if (!isVipActive(user)) return null

  return VIP_TYPES[type] || null
}

function getVipLabel(user = {}) {
  const cfg = getVipConfig(user)
  if (!cfg) return 'Sin VIP'

  return `${cfg.badge} ${cfg.name}`
}

function randomInt(min = 0, max = 0) {
  const a = Math.ceil(Number(min || 0))
  const b = Math.floor(Number(max || 0))

  if (b <= a) return a

  return Math.floor(Math.random() * (b - a + 1)) + a
}

function rollReward(list = []) {
  const total = list.reduce((sum, item) => sum + Number(item.chance || 0), 0)
  let roll = Math.random() * total

  for (const item of list) {
    roll -= Number(item.chance || 0)
    if (roll <= 0) return item
  }

  return list[list.length - 1]
}

function canUseCooldown(last = 0, cooldown = 0) {
  const now = Date.now()
  const next = Number(last || 0) + Number(cooldown || 0)

  return {
    ok: now >= next,
    remaining: Math.max(0, next - now)
  }
}

function addVipStars(user = {}, amount = 0) {
  const vip = ensureVip(user)
  vip.stars = Math.round((Number(vip.stars || 0) + Number(amount || 0)) * 100) / 100
  return vip.stars
}

function grantVip(user = {}, {
  type = '',
  days = 30,
  permanent = false,
  givenBy = '',
  reason = 'manual',
  code = ''
} = {}) {
  const vipType = normalizeVipType(type)
  const cfg = VIP_TYPES[vipType]

  if (!cfg) {
    throw new Error('tipo VIP inválido. Usa: basico, plus o ultra')
  }

  const vip = ensureVip(user)
  const now = Date.now()

  const oldType = normalizeVipType(vip.type)
  const oldUntil = Number(vip.until || 0)
  const oldPermanent = isPermanentVip(vip)
  const wasActive = !!vip.active && !!oldType && !!VIP_TYPES[oldType] && (oldPermanent || oldUntil > now)

  vip.type = vipType
  vip.since = vip.since || now
  vip.givenBy = givenBy
  vip.reason = reason
  vip.redeemedCode = code || vip.redeemedCode || ''

  if (permanent) {
    vip.permanent = true
    vip.until = PERMANENT_UNTIL
  } else {
    const safeDays = Math.max(1, Math.min(Math.floor(Number(days || 30)), 365))
    const extra = safeDays * DAY
    const base = wasActive && !oldPermanent
      ? Math.max(oldUntil, now)
      : now

    vip.permanent = false
    vip.until = base + extra
  }

  vip.active = true

  if (!cfg.canTitle) {
    vip.title = ''
  }

  return vip
}

async function getTargetJid(client, m, args = []) {
  const mentioned =
    m.mentionedJid?.[0] ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
    m.quoted?.sender ||
    ''

  if (mentioned) {
    return await resolveRealJid(mentioned, client, m.chat)
  }

  const raw = args[0] || ''
  const num = String(raw).replace(/\D/g, '')

  if (num.length >= 5) {
    return `${num}@s.whatsapp.net`
  }

  return ''
}

function parseDays(value = '') {
  const n = Number(value || 30)
  if (!Number.isFinite(n)) return 30
  return Math.max(1, Math.min(Math.floor(n), 365))
}


function parseVipDuration(value = '30') {
  const raw = String(value || '30').toLowerCase().trim()

  if (['permanente', 'permanent', 'perm', 'perma', 'forever'].includes(raw)) {
    return {
      permanent: true,
      days: 0,
      label: 'Permanente'
    }
  }

  const days = parseDays(value)

  return {
    permanent: false,
    days,
    label: `${days} días`
  }
}

function getVipPrice(type = '', permanent = false) {
  const key = normalizeVipType(type)
  const prices = VIP_PRICES[key]

  if (!prices) return null

  return {
    soles: permanent ? prices.solesPermanent : prices.soles30,
    coins: permanent ? prices.coinsPermanent : prices.coins30
  }
}


const VIP_ORDER = {
  basico: 1,
  plus: 2,
  ultra: 3
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

function getVipAccessText(user = {}, prefix = '.', commandName = 'este comando') {
  const vip = ensureVip(user)

  if (hadVipBefore(user)) {
    return (
      `> *[ ⌬ ] ⏳ VIP EXPIRADO*\n\n` +
      `🚫 Tu VIP ya no está activo.\n` +
      `⭐ Tus stars están protegidas y no se borraron.\n\n` +
      `💎 *Renovar VIP:* ${prefix}vipshop\n` +
      `🎟️ *Canjear código:* ${prefix}redeem CODIGO\n\n` +
      `_Si no deseas renovar, puedes convertir tus stars con:_\n` +
      `_${prefix}vstars2soles all_\n\n` +
      `_Comisión de salida: 15%._`
    )
  }

  return (
    `> *[ ⌬ ] 🔒 ACCESO VIP*\n\n` +
    `🚫 *${commandName}* es exclusivo para usuarios VIP.\n` +
    `💎 Tu cuenta aún no tiene un plan activo.\n\n` +
    `✨ *Desbloquea:*\n` +
    `⭐ Stars VIP\n` +
    `🏦 Banco VIP\n` +
    `🎁 Recompensas premium\n` +
    `🧩 Misiones VIP\n` +
    `🏆 Ranking VIP\n\n` +
    `💎 *Ver planes:* ${prefix}vipshop\n` +
    `🎟️ *Canjear código:* ${prefix}redeem CODIGO`
  )
}

function currentVipBenefitsText(type = '') {
  const cfg = VIP_TYPES[normalizeVipType(type)]
  if (!cfg) return 'Sin beneficios activos.'

  const normal = {
    basico: { gain: 30, cd: 25, success: 5, loss: 5 },
    plus: { gain: 50, cd: 30, success: 10, loss: 10 },
    ultra: { gain: 70, cd: 35, success: 15, loss: 15 }
  }[cfg.key]

  return (
    `> *[ ⌬ ] ${cfg.badge} BENEFICIOS VIP*\n\n` +
    `💎 *Plan:* ${cfg.name}\n\n` +

    `⚙️ *Economía normal*\n` +
    `📈 Ganancias compatibles: *+${normal.gain}%*\n` +
    `⏳ Cooldown compatible: *-${normal.cd}%*\n` +
    `🎯 Éxito en riesgo: *+${normal.success}%*\n` +
    `🛡️ Reducción de pérdidas: *-${normal.loss}%*\n\n` +

    `⭐ *Economía VIP*\n` +
    `🏦 Banco VIP\n` +
    `🤝 Transferencias VIP\n` +
    `🎁 Recompensas premium\n` +
    `🧩 Misiones VIP\n` +
    `🏆 Ranking VIP\n\n` +

    `🎁 *Recompensas exclusivas*\n` +
    `🎁 *vipdaily* — recompensa diaria\n` +
    `🎰 *vipcofre* — cofre según tu nivel\n` +
    `📦 *vipbox* — caja de mayor valor\n\n` +

    `✨ *Extra:* ${cfg.canTitle ? 'Título personalizado disponible.' : 'Acceso inicial VIP.'}`
  )
}

function publicBenefitsText() {
  return (
    `> *[ ⌬ ] 💎 PLANES VIP*\n\n` +

    `💎 *VIP BÁSICO*\n` +
    `📈 +30% en ganancias compatibles\n` +
    `⏳ -25% de cooldown\n` +
    `🎯 +5% de éxito en riesgo\n` +
    `🛡️ -5% de reducción de pérdidas\n` +
    `⭐ Acceso a stars, banco y recompensas VIP\n\n` +

    `🔥 *VIP PLUS*\n` +
    `📈 +50% en ganancias compatibles\n` +
    `⏳ -30% de cooldown\n` +
    `🎯 +10% de éxito en riesgo\n` +
    `🛡️ -10% de reducción de pérdidas\n` +
    `🏷️ Título personalizado disponible\n\n` +

    `👑 *VIP ULTRA*\n` +
    `📈 +70% en ganancias compatibles\n` +
    `⏳ -35% de cooldown\n` +
    `🎯 +15% de éxito en riesgo\n` +
    `🛡️ -15% de reducción de pérdidas\n` +
    `🚀 Máximo rendimiento VIP`
  )
}

function getVipPurchaseAction(user = {}, newType = '', duration = {}) {
  const vip = ensureVip(user)
  const currentType = normalizeVipType(vip.type)
  const currentCfg = VIP_TYPES[currentType]
  const newCfg = VIP_TYPES[newType]

  if (!newCfg) {
    return {
      ok: false,
      mode: 'invalid',
      text: 'Tipo VIP inválido.'
    }
  }

  if (!isVipActive(user) || !currentCfg) {
    return {
      ok: true,
      mode: 'new',
      text: `Activarás ${newCfg.badge} ${newCfg.name}.`
    }
  }

  if (isPermanentVip(vip)) {
    if (currentType === newType) {
      return {
        ok: false,
        mode: 'already_permanent',
        text:
          `Ya tienes ${currentCfg.badge} ${currentCfg.name} permanente.\n` +
          `No necesitas comprar más días.`
      }
    }

    if (VIP_ORDER[newType] > VIP_ORDER[currentType]) {
      if (!duration.permanent) {
        return {
          ok: false,
          mode: 'need_permanent_upgrade',
          text:
            `Tienes ${currentCfg.badge} ${currentCfg.name} permanente.\n` +
            `Para subir a ${newCfg.badge} ${newCfg.name}, usa compra permanente:\n` +
            `.buyvip ${newType} permanente`
        }
      }

      return {
        ok: true,
        mode: 'upgrade_permanent',
        text:
          `Subirás de ${currentCfg.badge} ${currentCfg.name} permanente ` +
          `a ${newCfg.badge} ${newCfg.name} permanente.`
      }
    }

    return {
      ok: false,
      mode: 'downgrade_blocked',
      text:
        `No puedes bajar de ${currentCfg.badge} ${currentCfg.name} ` +
        `a ${newCfg.badge} ${newCfg.name}.`
    }
  }

  if (VIP_ORDER[newType] < VIP_ORDER[currentType]) {
    return {
      ok: false,
      mode: 'downgrade_blocked',
      text:
        `No puedes bajar de ${currentCfg.badge} ${currentCfg.name} ` +
        `a ${newCfg.badge} ${newCfg.name}.\n\n` +
        `Solo puedes renovar el mismo nivel o subir a uno superior.`
    }
  }

  if (VIP_ORDER[newType] === VIP_ORDER[currentType]) {
    return {
      ok: true,
      mode: 'renew',
      text:
        `Renovarás tu ${currentCfg.badge} ${currentCfg.name}.\n` +
        `Los días nuevos se sumarán a tu tiempo restante.`
    }
  }

  return {
    ok: true,
    mode: 'upgrade',
    text:
      `Subirás de ${currentCfg.badge} ${currentCfg.name} ` +
      `a ${newCfg.badge} ${newCfg.name}.\n` +
      `Tu tiempo restante se conserva y se suman los nuevos días.`
  }
}


function sanitizeTitle(text = '') {
  return String(text || '')
    .replace(/[^\p{L}\p{N}\s._\-👑🔥💎⭐]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 35)
}

function benefitsText(type = '') {
  return currentVipBenefitsText(type)
}

function allBenefitsText() {
  return publicBenefitsText()
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

function buildVipStatusText({ cfg, vip, usedPrefix = '.' } = {}) {
  const totalStars = Number(vip.stars || 0) + Number(vip.starsBank || 0)

  return (
    `> *[ ⌬ ] ${cfg.badge} ESTADO VIP*\n\n` +
    `✅ *Estado:* Activo\n` +
    `💎 *Plan:* ${cfg.name}\n` +
    `📅 *Vence:* ${formatVipDate(vip)}\n` +
    `⏳ *Restante:* ${formatVipRemaining(vip)}\n\n` +

    `⭐ *Cartera:* ${starsText(vip.stars || 0)}\n` +
    `🏦 *Banco:* ${starsText(vip.starsBank || 0)}\n` +
    `✨ *Total:* ${starsText(totalStars)}\n` +
    `🏷️ *Título:* ${vip.title || 'Sin título'}\n\n` +

    `📌 *Comandos útiles:*\n` +
    `💎 ${usedPrefix}vipmenu\n` +
    `🎁 ${usedPrefix}vipdaily\n` +
    `🏦 ${usedPrefix}vbal\n` +
    `⏱️ ${usedPrefix}vipcooldowns`
  )
}

function buildNoVipStatusText(usedPrefix = '.') {
  return (
    `> *[ ⌬ ] 💎 ESTADO VIP*\n\n` +

    `🚫 No tienes VIP activo.\n\n` +
    `✨ *Con VIP desbloqueas:*\n` +
    `⭐ Stars VIP\n` +
    `🏦 Banco VIP\n` +
    `🎁 Recompensas premium\n` +
    `🧩 Misiones VIP\n` +
    `🏆 Ranking VIP\n\n` +
    `💎 *Ver planes:* ${usedPrefix}vipshop\n` +
    `🎟️ *Canjear código:* ${usedPrefix}redeem CODIGO`
  )
}

function buildVipProfileText({ cfg, vip, senderReal, usedPrefix = '.' } = {}) {
  const totalStars = Number(vip.stars || 0) + Number(vip.starsBank || 0)

  return (
    `> *[ ⌬ ] 👤 PERFIL VIP*\n\n` +
    `👤 *Usuario:* @${onlyNumber(senderReal)}\n` +
    `💎 *Nivel:* ${cfg.badge} ${cfg.name}\n` +
    `🏷️ *Título:* ${vip.title || 'Sin título'}\n` +
    `📅 *Desde:* ${formatDate(vip.since)}\n` +
    `⏳ *Vence:* ${formatVipDate(vip)}\n` +
    `🕒 *Restante:* ${formatVipRemaining(vip)}\n\n` +

    `⭐ *Economía VIP*\n` +
    `💰 Cartera: ${starsText(vip.stars || 0)}\n` +
    `🏦 Banco: ${starsText(vip.starsBank || 0)}\n` +
    `✨ Total: ${starsText(totalStars)}\n\n` +

    `🎁 *Accesos rápidos*\n` +
    `🎁 ${usedPrefix}vipdaily\n` +
    `🎰 ${usedPrefix}vipcofre\n` +
    `📦 ${usedPrefix}vipbox\n` +
    `💼 ${usedPrefix}vwork\n` +
    `📌 ${usedPrefix}vipbeneficios`
  )
}

function vipRulesText(usedPrefix = '.') {
  return (
    `> *[ ⌬ ] 📜 REGLAS VIP*\n\n` +

    `💎 *Duración*\n` +
    `_El VIP dura 30 días o puede ser permanente según el plan._\n` +
    `_Si renuevas el mismo nivel, los días se suman._\n` +
    `_Si subes de nivel, conservas tu tiempo restante._\n\n` +

    `🔥 *Upgrade*\n` +
    `_Básico puede subir a Plus o Ultra._\n` +
    `_Plus puede subir a Ultra._\n` +
    `_No se permite bajar de nivel._\n\n` +

    `⭐ *Stars VIP*\n` +
    `_Las stars pertenecen al sistema VIP._\n` +
    `_Si tu VIP vence, tus stars quedan protegidas._\n` +
    `_Para usarlas normalmente debes renovar._\n\n` +

    `🔁 *Conversión*\n` +
    `_SOLES a stars no tiene comisión._\n` +
    `_Stars a SOLES con VIP activo tiene 60% de comisión._\n` +
    `_Stars a SOLES con VIP vencido tiene 15% de comisión de salida._\n\n` +

    `🎟️ *Códigos VIP*\n` +
    `_Los códigos tienen tiempo limitado._\n` +
    `_Si caducan o ya fueron usados, no se pueden canjear._\n\n` +

    `📌 *Importante*\n` +
    `_No se devuelve SOLES si compras el plan equivocado._\n` +
    `_No se transfiere VIP a otra cuenta._\n` +
    `_El aporte real ayuda al servidor y mantenimiento._\n\n` +

    `💎 *Ver planes:* ${usedPrefix}vipshop`
  )
}


function vipShopText(currency = 'Soles') {
  return (
`> *[ ⌬ ] 💎 TIENDA VIP RUBYJX*

✨ Planes disponibles por *30 días* o *permanente*.
Puedes comprar con dinero real o con SOLES del bot.

💎 *VIP BÁSICO*
💵 30 días: *S/3* (moneda peruana real)
👑 Permanente: *S/10* (moneda peruana real)
💰 SOLES bot 30 días: *${formatMoney(VIP_PRICES.basico.coins30, currency)}*
🏦 SOLES bot permanente: *${formatMoney(VIP_PRICES.basico.coinsPermanent, currency)}*

🛒 Comprar:
*.buyvip basico*
*.buyvip basico permanente*

🔥 *VIP PLUS*
💵 30 días: *S/5* (moneda peruana real)
👑 Permanente: *S/15* (moneda peruana real)
💰 SOLES bot 30 días: *${formatMoney(VIP_PRICES.plus.coins30, currency)}*
🏦 SOLES bot permanente: *${formatMoney(VIP_PRICES.plus.coinsPermanent, currency)}*

🛒 Comprar:
*.buyvip plus*
*.buyvip plus permanente*

👑 *VIP ULTRA*
💵 30 días: *S/10* (moneda peruana real)
👑 Permanente: *S/20* (moneda peruana real)
💰 SOLES bot 30 días: *${formatMoney(VIP_PRICES.ultra.coins30, currency)}*
🏦 SOLES bot permanente: *${formatMoney(VIP_PRICES.ultra.coinsPermanent, currency)}*

🛒 Comprar:
*.buyvip ultra*
*.buyvip ultra permanente*

📌 *Aclaración*
_El aporte real ayuda a pagar servidor, mantenimiento y mantener el bot prendido._`
  )
}




function getVipCodeExpiresAt(data = {}) {
  const createdAt = Number(data.createdAt || 0)
  const expiresAt = Number(data.expiresAt || 0)

  if (expiresAt) return expiresAt
  if (createdAt) return createdAt + VIP_CODE_TTL

  return Date.now() + VIP_CODE_TTL
}

function isVipCodeExpired(data = {}) {
  if (!data) return true
  if (data.used) return false

  return Date.now() > getVipCodeExpiresAt(data)
}

function getVipCodeStatus(data = {}) {
  if (data.used) return 'Usado'
  if (isVipCodeExpired(data)) return 'Caducado'
  return 'Disponible'
}


function normalizeVipCode(code = '') {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
}

function generateVipCode(length = VIP_CODE_AUTO_LENGTH) {
  const safeLength = Math.max(
    VIP_CODE_MIN_LENGTH,
    Math.min(Number(length || VIP_CODE_AUTO_LENGTH), VIP_CODE_MAX_LENGTH)
  )

  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''

  for (let i = 0; i < safeLength; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return code
}


function generateUniqueVipCode(length = VIP_CODE_AUTO_LENGTH) {
  const db = getDB()
  db.vipCodes ||= {}

  for (let i = 0; i < 30; i++) {
    const code = generateVipCode(length)

    if (!db.vipCodes[code]) {
      return code
    }
  }

  return `${generateVipCode(12)}${Date.now().toString(36).toUpperCase().slice(-4)}`
    .slice(0, VIP_CODE_MAX_LENGTH)
}

function isValidVipCodeFormat(code = '') {
  const cleanCode = normalizeVipCode(code)

  return (
    cleanCode.length >= VIP_CODE_MIN_LENGTH &&
    cleanCode.length <= VIP_CODE_MAX_LENGTH &&
    /^[A-Z0-9_-]+$/.test(cleanCode)
  )
}

function getRedeemAttemptKey(jid = '') {
  return cleanJid(jid) || String(jid || 'unknown')
}

function getRedeemAttempt(jid = '') {
  const db = getDB()
  db.vipRedeemAttempts ||= {}

  const key = getRedeemAttemptKey(jid)

  db.vipRedeemAttempts[key] ||= {
    count: 0,
    blockedUntil: 0,
    lastFail: 0
  }

  return db.vipRedeemAttempts[key]
}

function getRedeemBlockRemaining(jid = '') {
  const attempt = getRedeemAttempt(jid)
  const blockedUntil = Number(attempt.blockedUntil || 0)

  if (blockedUntil > Date.now()) {
    return blockedUntil - Date.now()
  }

  if (blockedUntil) {
    attempt.count = 0
    attempt.blockedUntil = 0
    attempt.lastFail = 0
    saveDB()
  }

  return 0
}

function registerRedeemFail(jid = '') {
  const attempt = getRedeemAttempt(jid)
  const now = Date.now()

  if (now - Number(attempt.lastFail || 0) > VIP_REDEEM_BLOCK_TIME) {
    attempt.count = 0
  }

  attempt.count = Number(attempt.count || 0) + 1
  attempt.lastFail = now

  if (attempt.count >= VIP_REDEEM_FAIL_LIMIT) {
    attempt.blockedUntil = now + VIP_REDEEM_BLOCK_TIME
  }

  saveDB()
  return attempt
}

function resetRedeemFails(jid = '') {
  const db = getDB()
  db.vipRedeemAttempts ||= {}

  const key = getRedeemAttemptKey(jid)

  if (db.vipRedeemAttempts[key]) {
    delete db.vipRedeemAttempts[key]
    saveDB()
  }
}



function getVipCodeEntries(filter = 'todos') {
  const db = getDB()
  const mode = String(filter || 'todos').toLowerCase()

  let entries = Object.entries(db.vipCodes || {})

  if (['activo', 'activos', 'disponible', 'disponibles', 'libre', 'libres'].includes(mode)) {
    entries = entries.filter(([, data]) => !data.used && !isVipCodeExpired(data))
  }

  if (['usado', 'usados', 'canjeado', 'canjeados'].includes(mode)) {
    entries = entries.filter(([, data]) => data.used)
  }

  if (['caducado', 'caducados', 'vencido', 'vencidos', 'expirado', 'expirados'].includes(mode)) {
    entries = entries.filter(([, data]) => !data.used && isVipCodeExpired(data))
  }

  return entries.sort((a, b) => Number(b[1]?.createdAt || 0) - Number(a[1]?.createdAt || 0))
}

function buildVipCodesList(filter = 'todos') {
  const entries = getVipCodeEntries(filter)

  if (!entries.length) return ''

  return entries.slice(0, 40).map(([code, data], index) => {
    const cfg = VIP_TYPES[normalizeVipType(data.type)] || {}
    const status = getVipCodeStatus(data)
    const expiresIn = data.used ? 'Ya usado' : formatTime(getVipCodeExpiresAt(data) - Date.now())

    const icon =
      status === 'Disponible' ? '🟢' :
      status === 'Usado' ? '🔒' :
      '⏳'

    return (
      `${index + 1}. ${icon} *${code}*\n` +
      `   ▪️ Nivel: ${cfg.badge || '💎'} ${cfg.name || data.type}\n` +
      `   ▪️ Duración VIP: ${data.permanent ? 'Permanente' : `${data.days || 30} días`}\n` +
      `   ▪️ Estado: ${status}\n` +
      `   ▪️ Caduca en: ${expiresIn}`
    )
  }).join('\n\n')
}

function buildVipCodeInfo(code = '') {
  const db = getDB()
  const cleanCode = normalizeVipCode(code)
  const data = db.vipCodes?.[cleanCode]

  if (!data) return null

  const cfg = VIP_TYPES[normalizeVipType(data.type)] || {}
  const status = getVipCodeStatus(data)
  const expiresIn = data.used ? 'Ya usado' : formatTime(getVipCodeExpiresAt(data) - Date.now())

  return (
    `🎟️ ▣ INFO CÓDIGO VIP\n` +
    `▪️ Código: *${cleanCode}*\n` +
    `▪️ Nivel: ${cfg.badge || '💎'} ${cfg.name || data.type}\n` +
    `▪️ Duración VIP: ${data.permanent ? 'Permanente' : `${data.days || 30} días`}\n` +
    `▪️ Estado: ${status}\n` +
    `▪️ Tiempo válido: 15 minutos\n` +
    `▪️ Caduca en: ${expiresIn}\n` +
    `▪️ Creado por: @${onlyNumber(data.createdBy)}\n` +
    `▪️ Creado: ${formatDate(data.createdAt)}\n` +
    `▪️ Usado por: ${data.usedBy ? `@${onlyNumber(data.usedBy)}` : 'Nadie'}\n` +
    `▪️ Usado: ${data.usedAt ? formatDate(data.usedAt) : 'No usado'}`
  )
}

export default {
  command: [
    'vip',
    'vipstatus',
    'vipperfil',
    'vipbeneficios',
    'vipbonus',
    'vipstars',
    'viprank',
    'vipdaily',
    'vipcofre',
    'vipbox',
    'vipcooldowns',
    'vipshop',
    'vipreglas',
    'viprules',
    'reglasvip',
    'buyvip',
    'titulo',
    'deltitulo',
  'addvip',
'addvipdays',
'delvip',
    'vipinfo',
    'viplist',
    'vipcode',
    'redeem',
'vipcodes',
'vipcodeinfo',
'delvipcode'
  ],
  category: 'economy',

  run: async (client, m, args = [], usedPrefix = '.', command = 'vip') => {
    const db = getDB()
    const currency = getCurrency(client)
    const senderReal = await getSenderReal(m, client)
    const senderGlobal = getGlobalUser(senderReal)
    const senderEco = getEcoUser(m.chat, senderReal)
    const senderUser = senderGlobal.user
    const senderVip = ensureVip(senderUser)
    const isOwner = isOwnerUser(senderReal) || isOwnerUser(m.sender)

    const cmd = String(command || '').toLowerCase()

    try {
      if (cmd === 'vip' || cmd === 'vipstatus') {
        const active = isVipActive(senderUser)
        const cfg = getVipConfig(senderUser)

        if (!active || !cfg) {
          return m.reply(buildNoVipStatusText(usedPrefix))
        }

        return m.reply(buildVipStatusText({
          cfg,
          vip: senderVip,
          usedPrefix
        }))
      }

      if (cmd === 'vipperfil') {
        const active = isVipActive(senderUser)
        const cfg = getVipConfig(senderUser)

        if (!active || !cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        return m.reply(buildVipProfileText({
          cfg,
          vip: senderVip,
          senderReal,
          usedPrefix
        }))
      }
    if (cmd === 'vipbeneficios' || cmd === 'vipbonus') {
  const cfg = getVipConfig(senderUser)

  if (cfg) {
    return m.reply(currentVipBenefitsText(cfg.key))
  }

  return m.reply(
    `╭━━〔 💎 BENEFICIOS VIP 〕━━\n` +
    `┃ Aún no tienes VIP activo.\n` +
    `┃ Estos son los beneficios disponibles.\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +
    publicBenefitsText() +
    `\n\nVer precios:\n` +
    `*${usedPrefix}vipshop*`
  )
}


      if (cmd === 'vipdaily') {
        const cfg = getVipConfig(senderUser)

        if (!cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        const cd = canUseCooldown(senderVip.lastDaily, cfg.vipdaily.cooldown)

        if (!cd.ok) {
          return m.reply(
            `⏳ ▣ VIP DAILY\n` +
            `▪️ Ya reclamaste tu daily VIP.\n` +
            `▪️ Disponible en: *${formatTime(cd.remaining)}*`
          )
        }

        const baseSoles = randomInt(...cfg.vipdaily.coins)
        const baseStars = solesToStars(baseSoles)
        const bonusStars = randomInt(...cfg.vipdaily.stars)
        const totalStars = Math.round((baseStars + bonusStars) * 100) / 100

        addVipStars(senderUser, totalStars)
        senderVip.lastDaily = Date.now()
        saveDB()

        return m.reply(
          `🎁 ▣ VIP DAILY\n` +
          `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
          `▪️ Base: ${formatMoney(baseSoles, currency)}\n` +
          `▪️ Bonus: ${starsText(bonusStars)}\n` +
          `▪️ Ganaste: ${starsText(totalStars)}\n` +
          `▪️ Total: ${starsText(senderVip.stars)}`
        )
      }

      if (cmd === 'vipcofre') {
        const cfg = getVipConfig(senderUser)

        if (!cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        const cd = canUseCooldown(senderVip.lastCofre, cfg.vipcofre.cooldown)

        if (!cd.ok) {
          return m.reply(
            `⏳ ▣ VIP COFRE\n` +
            `▪️ Tu cofre aún está cerrado.\n` +
            `▪️ Disponible en: *${formatTime(cd.remaining)}*`
          )
        }

        const reward = rollReward(cfg.vipcofre.rewards)
        const soles = randomInt(...(reward.coins || [0, 0]))
        const rewardStars = randomInt(...(reward.stars || [0, 0]))
        const totalStars = Math.round((solesToStars(soles) + rewardStars) * 100) / 100

        addVipStars(senderUser, totalStars)
        senderVip.lastCofre = Date.now()
        saveDB()

        return m.reply(
          `🎰 ▣ VIP COFRE\n` +
          `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
          `▪️ Premio: ${reward.name}\n` +
          `▪️ Valor: ${formatMoney(soles, currency)}\n` +
          `▪️ Stars extra: ${starsText(rewardStars)}\n` +
          `▪️ Ganaste: ${starsText(totalStars)}\n` +
          `▪️ Total: ${starsText(senderVip.stars)}`
        )
      }

      if (cmd === 'vipbox') {
        const cfg = getVipConfig(senderUser)

        if (!cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        const cd = canUseCooldown(senderVip.lastBox, cfg.vipbox.cooldown)

        if (!cd.ok) {
          return m.reply(
            `⏳ ▣ VIP BOX\n` +
            `▪️ Tu caja VIP aún no está lista.\n` +
            `▪️ Disponible en: *${formatTime(cd.remaining)}*`
          )
        }

        const reward = rollReward(cfg.vipbox.rewards)
        const multiplier = {
          'Común': 1,
          'Bueno': 1.25,
          'Raro': 1.6,
          'Épico': 2.2,
          'Legendario': 3
        }[reward.name] || 1

        const soles = randomInt(...cfg.vipbox.coins)
        const bonusStars = randomInt(...cfg.vipbox.stars)
        const totalStars = Math.round((solesToStars(soles) + bonusStars) * multiplier * 100) / 100

        addVipStars(senderUser, totalStars)
        senderVip.lastBox = Date.now()
        saveDB()

        return m.reply(
          `📦 ▣ VIP BOX\n` +
          `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
          `▪️ Rareza: ${reward.name}\n` +
          `▪️ Multiplicador: x${multiplier}\n` +
          `▪️ Valor: ${formatMoney(soles, currency)}\n` +
          `▪️ Bonus: ${starsText(bonusStars)}\n` +
          `▪️ Ganaste: ${starsText(totalStars)}\n` +
          `▪️ Total: ${starsText(senderVip.stars)}`
        )
      }

      if (cmd === 'vipcooldowns') {
        const cfg = getVipConfig(senderUser)

        if (!cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        const daily = canUseCooldown(senderVip.lastDaily, cfg.vipdaily.cooldown)
        const cofre = canUseCooldown(senderVip.lastCofre, cfg.vipcofre.cooldown)
        const box = canUseCooldown(senderVip.lastBox, cfg.vipbox.cooldown)

        return m.reply(
          `⏱️ ▣ COOLDOWNS VIP\n` +
          `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
          `▪️ vipdaily: ${daily.ok ? 'Disponible' : formatTime(daily.remaining)}\n` +
          `▪️ vipcofre: ${cofre.ok ? 'Disponible' : formatTime(cofre.remaining)}\n` +
          `▪️ vipbox: ${box.ok ? 'Disponible' : formatTime(box.remaining)}`
        )
      }


      if (cmd === 'vipshop') {
        return m.reply(vipShopText(currency))
      }

            if (cmd === 'vipreglas' || cmd === 'viprules' || cmd === 'reglasvip') {
        return m.reply(vipRulesText(usedPrefix))
      }

    if (cmd === 'buyvip') {
  const type = normalizeVipType(args[0])
  const cfg = VIP_TYPES[type]

  const rawDuration = String(args[1] || '30').toLowerCase()
  const isConfirm =
    ['confirmar', 'confirm', 'si', 'sí'].includes(rawDuration) ||
    ['confirmar', 'confirm', 'si', 'sí'].includes(String(args[2] || '').toLowerCase())

  const durationArg = isConfirm && ['confirmar', 'confirm', 'si', 'sí'].includes(rawDuration)
    ? '30'
    : (args[1] || '30')

  const duration = parseVipDuration(durationArg)
  const price = getVipPrice(type, duration.permanent)

  if (!cfg || !price) {
    return m.reply(
      `╭━━〔 💎 COMPRAR VIP 〕━━\n` +
      `┃ Plan inválido.\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `Usa:\n` +
      `*${usedPrefix}buyvip basico*\n` +
      `*${usedPrefix}buyvip plus*\n` +
      `*${usedPrefix}buyvip ultra*\n\n` +
      `Permanente:\n` +
      `*${usedPrefix}buyvip ultra permanente*`
    )
  }

  const action = getVipPurchaseAction(senderUser, type, duration)

  if (!action.ok) {
    return m.reply(
      `╭━━〔 ⚠️ COMPRA BLOQUEADA 〕━━\n` +
      `┃ ${cfg.badge} ${cfg.name}\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `${action.text}`
    )
  }

  senderEco.user.coins = Number(senderEco.user.coins || 0)
  senderEco.user.bank = Number(senderEco.user.bank || 0)

  if (!m.isOwner && senderEco.user.coins < price.coins) {
    return m.reply(
      `╭━━〔 ❌ SALDO INSUFICIENTE 〕━━\n` +
      `┃ Plan: ${cfg.badge} ${cfg.name}\n` +
      `┃ Duración: ${duration.label}\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `Costo: *${formatMoney(price.coins, currency)}*\n` +
      `Tu cartera: *${formatMoney(senderEco.user.coins, currency)}*\n\n` +
      `Necesitas más SOLES en cartera para comprar este VIP.`
    )
  }

  if (!isConfirm) {
    return m.reply(
      `╭━━〔 ${cfg.badge} CONFIRMAR COMPRA VIP 〕━━\n` +
      `┃ Plan: ${cfg.name}\n` +
      `┃ Duración: ${duration.label}\n` +
      `┃ Costo: ${formatMoney(price.coins, currency)}\n` +
      `┃ Modo: ${action.mode}\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `${action.text}\n\n` +
      `Para confirmar usa:\n` +
      `*${usedPrefix}buyvip ${type}${duration.permanent ? ' permanente' : ''} confirmar*\n\n` +
      `_No se descontará nada hasta que confirmes._`
    )
  }

  if (!m.isOwner) senderEco.user.coins -= price.coins

  grantVip(senderUser, {
    type,
    days: duration.days || 30,
    permanent: duration.permanent,
    givenBy: senderReal,
    reason: 'buyvip'
  })

  pushVipLog({
    action: 'buyvip',
    jid: senderReal,
    amount: price.coins,
    detail: `${cfg.name} | ${duration.label} | ${action.mode}`,
    by: senderReal
  })

  saveDB()

  return m.reply(
    `╭━━〔 ${cfg.badge} VIP ACTIVADO 〕━━\n` +
    `┃ Plan: ${cfg.name}\n` +
    `┃ Duración: ${duration.label}\n` +
    `┃ Pagaste: ${formatMoney(price.coins, currency)}\n` +
    `┃ Vence: ${formatVipDate(senderVip)}\n` +
    `╰━━━━━━━━━━━━━━━━━━\n\n` +

    `Tu cuenta ya tiene acceso premium.\n\n` +

    `> 🚀 *PRIMEROS PASOS*\n\n` +
    `*${usedPrefix}vipdaily*\n` +
    `_Reclama tu primera recompensa VIP._\n\n` +

    `*${usedPrefix}vwork*\n` +
    `_Gana tus primeras ⭐ stars sin riesgo._\n\n` +

    `*${usedPrefix}vbal*\n` +
    `_Revisa tu cartera y banco VIP._\n\n` +

    `*${usedPrefix}vipmenu*\n` +
    `_Abre la guía completa de comandos._\n\n` +

    `*${usedPrefix}vipreglas*\n` +
    `_Lee las reglas del sistema VIP._`
  )
}
      if (cmd === 'titulo') {
        const cfg = getVipConfig(senderUser)

        if (!cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        if (!cfg.canTitle) {
          return m.reply(`❌ El título personalizado está disponible desde VIP Plus.`)
        }

        const title = sanitizeTitle(args.join(' '))

        if (!title) {
          return m.reply(`📌 Usa: *${usedPrefix}titulo Rey del Caos*`)
        }

        senderVip.title = title
        saveDB()

        return m.reply(
          `✅ ▣ TÍTULO ACTUALIZADO\n` +
          `▪️ Nuevo título: ${title}`
        )
      }

      if (cmd === 'deltitulo') {
        const cfg = getVipConfig(senderUser)

        if (!cfg) {
          return m.reply(getVipAccessText(senderUser, usedPrefix, usedPrefix + cmd))
        }

        if (!cfg.canTitle) {
          return m.reply(`❌ El título personalizado está disponible desde VIP Plus.`)
        }

        senderVip.title = ''
       saveDB()

        return m.reply(`✅ Título eliminado correctamente.`)
      }

      if (cmd === 'addvip') {
        if (!isOwner) return m.reply('Comando no encontrado.')

        const target = await getTargetJid(client, m, args)

        if (!target) {
          return m.reply(
            `📌 Usa:\n` +
            `▪️ *${usedPrefix}addvip @usuario basico 30*\n` +
            `▪️ *${usedPrefix}addvip @usuario plus 7*\n` +
            `▪️ *${usedPrefix}addvip @usuario ultra permanente*`
          )
        }

        const typeArg = args.find(arg => normalizeVipType(arg))

        const durationArg = args.find(arg => {
          const text = String(arg || '').trim().toLowerCase()

          if (!text) return false
          if (text.includes('@')) return false
          if (normalizeVipType(text)) return false

          if (['permanente', 'permanent', 'perm', 'perma', 'forever'].includes(text)) {
            return true
          }

          const digits = text.replace(/\D/g, '')

          if (!digits) return false
          if (digits.length >= 5) return false

          return true
        })

        const type = normalizeVipType(typeArg)
        const duration = parseVipDuration(durationArg || '30')
        const cfg = VIP_TYPES[type]

        if (!cfg) {
          return m.reply(
            `❌ Tipo inválido.\n` +
            `▪️ Usa: *basico*, *plus* o *ultra*.\n\n` +
            `Ejemplo:\n` +
            `*${usedPrefix}addvip @usuario basico 30*`
          )
        }

        const targetReal = await resolveRealJid(target, client, m.chat)
        const targetGlobal = getGlobalUser(targetReal)

        grantVip(targetGlobal.user, {
          type,
          days: duration.days || 30,
          permanent: duration.permanent,
          givenBy: senderReal,
          reason: 'owner'
        })

        pushVipLog({
          action: 'addvip',
          jid: targetReal,
          target: targetReal,
          detail: `${cfg.name} | ${duration.label}`,
          by: senderReal
        })

        saveDB()

        return m.reply(
          `✅ ▣ VIP ASIGNADO\n` +
          `▪️ Usuario: @${onlyNumber(targetReal)}\n` +
          `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
          `▪️ Duración: ${duration.label}\n` +
          `▪️ Vence: ${formatVipDate(targetGlobal.user.vip)}`
        )
      }


      if (cmd === 'addvipdays') {
  if (!isOwner) return m.reply('Comando no encontrado.')

  const target = await getTargetJid(client, m, args)

  if (!target) {
    return m.reply(
      `📌 Usa: *${usedPrefix}addvipdays @usuario 7*\n` +
      `▪️ Ejemplo: *${usedPrefix}addvipdays @usuario 30*`
    )
  }

  const daysArg = args.find(arg => {
    const text = String(arg || '').trim().toLowerCase()
    const digits = text.replace(/\D/g, '')

    if (!text || text.includes('@')) return false
    if (!digits) return false
    if (digits.length >= 5) return false

    return true
  })

  const days = parseDays(daysArg || '1')

  const targetReal = await resolveRealJid(target, client, m.chat)
  const targetGlobal = getGlobalUser(targetReal)
  const vip = ensureVip(targetGlobal.user)

  const type = normalizeVipType(vip.type)
  const cfg = VIP_TYPES[type]

  if (!cfg) {
    return m.reply(
      `❌ ▣ USUARIO SIN VIP\n` +
      `▪️ Ese usuario no tiene un tipo VIP asignado.\n` +
      `▪️ Primero usa: *${usedPrefix}addvip @usuario basico 30*`
    )
  }

  if (isPermanentVip(vip)) {
    return m.reply(
      `👑 ▣ VIP PERMANENTE\n` +
      `▪️ Usuario: @${onlyNumber(targetReal)}\n` +
      `▪️ Ese usuario ya tiene VIP permanente.\n` +
      `▪️ No necesita días extra.`
    )
  }

  const now = Date.now()
  const beforeUntil = Number(vip.until || 0)
  const base = isVipActive(targetGlobal.user)
    ? Math.max(beforeUntil, now)
    : now

  vip.active = true
  vip.since = vip.since || now
  vip.until = base + days * DAY
  vip.reason = 'extra_days'
  vip.givenBy = senderReal

  saveDB()

  return m.reply(
    `✅ ▣ DÍAS VIP AÑADIDOS\n` +
    `▪️ Usuario: @${onlyNumber(targetReal)}\n` +
    `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
    `▪️ Días añadidos: ${days}\n` +
    `▪️ Vence ahora: ${formatVipDate(vip)}\n` +
    `▪️ Tiempo restante: ${formatVipRemaining(vip)}`
  )
}


      if (cmd === 'delvip') {
        if (!isOwner) return m.reply('Comando no encontrado.')

        const target = await getTargetJid(client, m, args)

        if (!target) {
          return m.reply(`📌 Usa: *${usedPrefix}delvip @usuario*`)
        }

        const targetReal = await resolveRealJid(target, client, m.chat)
        const targetGlobal = getGlobalUser(targetReal)

        ensureVip(targetGlobal.user)
targetGlobal.user.vip.active = false
targetGlobal.user.vip.type = ''
targetGlobal.user.vip.until = 0
targetGlobal.user.vip.permanent = false
targetGlobal.user.vip.reason = 'removed'
targetGlobal.user.vip.givenBy = senderReal

        saveDB()

        return m.reply(
          `✅ ▣ VIP ELIMINADO\n` +
          `▪️ Usuario: @${onlyNumber(targetReal)}`
        )
      }

      if (cmd === 'vipinfo') {
        const target = await getTargetJid(client, m, args)
        const targetReal = target
          ? await resolveRealJid(target, client, m.chat)
          : senderReal

        const isSelf = sameUser(senderReal, targetReal)

        if (!isSelf && !isOwner) {
          return m.reply(
            `🔒 ▣ VIP INFO\n` +
            `▪️ Solo puedes consultar tu propio VIP.\n` +
            `▪️ Para ver el VIP de otro usuario se requiere owner.`
          )
        }

        const targetGlobal = getGlobalUser(targetReal)
        const vip = ensureVip(targetGlobal.user)
        const cfg = getVipConfig(targetGlobal.user)

        const ownerExtra = isOwner
          ? (
            `\n▪️ Estrellas: ⭐ ${formatNumber(vip.stars)}\n` +
            `▪️ Razón: ${vip.reason || 'No definida'}`
          )
          : ''

        return m.reply(
          `💎 ▣ VIP INFO\n` +
          `▪️ Usuario: @${onlyNumber(targetReal)}\n` +
          `▪️ Estado: ${cfg ? 'Activo' : 'Inactivo'}\n` +
          `▪️ Nivel: ${cfg ? `${cfg.badge} ${cfg.name}` : 'Sin VIP'}\n` +
          `▪️ Título: ${vip.title || 'Sin título'}\n` +
          `▪️ Desde: ${formatDate(vip.since)}\n` +
          `▪️ Vence: ${formatVipDate(vip)}\n` +
          `▪️ Restante: ${formatVipRemaining(vip)}` +
          ownerExtra
        )
      }

      if (cmd === 'viplist') {
        if (!isOwner) return m.reply('Comando no encontrado.')

        const entries = Object.entries(db.users)
          .filter(([, user]) => isVipActive(user))
          .sort((a, b) => Number(b[1]?.vip?.until || 0) - Number(a[1]?.vip?.until || 0))

        if (!entries.length) {
          return m.reply(`💎 No hay usuarios VIP activos.`)
        }

        const text = entries.slice(0, 30).map(([jid, user], index) => {
          const cfg = getVipConfig(user)
          return `${index + 1}. ${cfg.badge} @${onlyNumber(jid)} — ${cfg.name} — ⭐ ${formatNumber(user.vip.stars || 0)} — vence ${formatDate(user.vip.until)}`
        }).join('\n')

        return m.reply(
          `💎 ▣ VIPS ACTIVOS\n\n` +
          text
        )
      }

    if (cmd === 'vipcode') {
      if (!isOwner) return m.reply('Comando no encontrado.')

      const action = String(args[0] || '').toLowerCase()

      if (['ver', 'list', 'lista', 'codes', 'codigos', 'códigos'].includes(action)) {
        const filter = args[1] || 'todos'
        const list = buildVipCodesList(filter)

        if (!list) {
          return m.reply(
            `🎟️ ▣ CÓDIGOS VIP\n` +
            `▪️ No hay códigos para mostrar.`
          )
        }

        return m.reply(
          `🎟️ ▣ CÓDIGOS VIP\n` +
          `▪️ Filtro: ${filter}\n\n` +
          list +
          `\n\n📌 Opciones:\n` +
          `▪️ *${usedPrefix}vipcode ver activos*\n` +
          `▪️ *${usedPrefix}vipcode ver usados*\n` +
          `▪️ *${usedPrefix}vipcode info CODIGO*\n` +
          `▪️ *${usedPrefix}vipcode eliminar CODIGO*`
        )
      }

      if (['info', 'verinfo', 'detalle', 'detalles'].includes(action)) {
        const code = normalizeVipCode(args[1])
        const info = buildVipCodeInfo(code)

        if (!code) {
          return m.reply(`📌 Usa: *${usedPrefix}vipcode info CODIGO*`)
        }

        if (!info) {
          return m.reply(`❌ Ese código VIP no existe.`)
        }

        return m.reply(info)
      }

      if (['eliminar', 'delete', 'del', 'borrar', 'remove'].includes(action)) {
        const code = normalizeVipCode(args[1])

        if (!code) {
          return m.reply(`📌 Usa: *${usedPrefix}vipcode eliminar CODIGO*`)
        }

        if (!db.vipCodes[code]) {
          return m.reply(`❌ Ese código VIP no existe.`)
        }

        delete db.vipCodes[code]
        saveDB()

        return m.reply(
          `✅ ▣ CÓDIGO VIP ELIMINADO\n` +
          `▪️ Código: *${code}*`
        )
      }

      const type = normalizeVipType(args[0])
      const duration = parseVipDuration(args[1] || '30')
      let code = normalizeVipCode(args[2])

      const cfg = VIP_TYPES[type]

      if (!cfg) {
        return m.reply(
          `🎟️ ▣ CÓDIGOS VIP\n\n` +
          `Crear código automático:\n` +
          `▪️ *${usedPrefix}vipcode basico 30*\n` +
          `▪️ *${usedPrefix}vipcode plus 7*\n` +
          `▪️ *${usedPrefix}vipcode ultra permanente*\n\n` +
          `Crear código manual:\n` +
          `▪️ *${usedPrefix}vipcode basico 30 RUBYVIP2026*\n\n` +
          `Regla del código manual:\n` +
          `▪️ Mínimo ${VIP_CODE_MIN_LENGTH} caracteres\n` +
          `▪️ Máximo ${VIP_CODE_MAX_LENGTH} caracteres\n\n` +
          `Ver códigos:\n` +
          `▪️ *${usedPrefix}vipcode ver*\n` +
          `▪️ *${usedPrefix}vipcode ver activos*\n` +
          `▪️ *${usedPrefix}vipcode ver usados*\n\n` +
          `Info:\n` +
          `▪️ *${usedPrefix}vipcode info CODIGO*\n\n` +
          `Eliminar:\n` +
          `▪️ *${usedPrefix}vipcode eliminar CODIGO*`
        )
      }

      const wasGenerated = !code

      if (wasGenerated) {
        code = generateUniqueVipCode(VIP_CODE_AUTO_LENGTH)
      }

      if (!isValidVipCodeFormat(code)) {
        return m.reply(
          `❌ ▣ CÓDIGO VIP INVÁLIDO\n` +
          `▪️ Usa solo letras, números, guion o guion bajo.\n` +
          `▪️ Mínimo: ${VIP_CODE_MIN_LENGTH} caracteres.\n` +
          `▪️ Máximo: ${VIP_CODE_MAX_LENGTH} caracteres.\n\n` +
          `Ejemplo válido:\n` +
          `*${usedPrefix}vipcode basico 30 RUBYVIP2026*`
        )
      }

      if (db.vipCodes[code]) {
        return m.reply(`❌ Ese código ya existe.`)
      }

      const nowCode = Date.now()

      db.vipCodes[code] = {
        code,
        type,
        days: duration.days || 30,
        permanent: duration.permanent,
        durationLabel: duration.label,
        createdBy: senderReal,
        createdAt: nowCode,
        expiresAt: nowCode + VIP_CODE_TTL,
        used: false,
        usedBy: '',
        usedAt: 0,
        autoGenerated: wasGenerated
      }

      saveDB()

      return m.reply(
        `✅ ▣ CÓDIGO VIP CREADO\n` +
        `▪️ Código: *${code}*\n` +
        `▪️ Modo: ${wasGenerated ? 'Automático seguro' : 'Manual'}\n` +
        `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
        `▪️ Duración: ${duration.label}\n` +
        `▪️ Estado: Disponible\n` +
        `▪️ Canjear con: *${usedPrefix}redeem ${code}*`
      )
    }

if (cmd === 'vipcodes') {
  if (!isOwner) return m.reply('Comando no encontrado.')

  const filter = args[0] || 'todos'
  const list = buildVipCodesList(filter)

  if (!list) {
    return m.reply(
      `🎟️ ▣ CÓDIGOS VIP\n` +
      `▪️ No hay códigos para mostrar.`
    )
  }

  return m.reply(
    `🎟️ ▣ CÓDIGOS VIP\n` +
    `▪️ Filtro: ${filter}\n\n` +
    list
  )
}

if (cmd === 'vipcodeinfo') {
  if (!isOwner) return m.reply('Comando no encontrado.')

  const code = normalizeVipCode(args[0])
  const info = buildVipCodeInfo(code)

  if (!code) {
    return m.reply(`📌 Usa: *${usedPrefix}vipcodeinfo CODIGO*`)
  }

  if (!info) {
    return m.reply(`❌ Ese código VIP no existe.`)
  }

  return m.reply(info)
}

if (cmd === 'delvipcode') {
  if (!isOwner) return m.reply('Comando no encontrado.')

  const code = normalizeVipCode(args[0])

  if (!code) {
    return m.reply(`📌 Usa: *${usedPrefix}delvipcode CODIGO*`)
  }

  if (!db.vipCodes[code]) {
    return m.reply(`❌ Ese código VIP no existe.`)
  }

  delete db.vipCodes[code]

  return m.reply(
    `✅ ▣ CÓDIGO VIP ELIMINADO\n` +
    `▪️ Código: *${code}*`
  )
}

      if (cmd === 'redeem') {
        const blocked = getRedeemBlockRemaining(senderReal)

        if (blocked > 0) {
          return m.reply(
            `⛔ ▣ REDEEM BLOQUEADO\n` +
            `▪️ Demasiados intentos fallidos.\n` +
            `▪️ Intenta otra vez en: *${formatTime(blocked)}*`
          )
        }

        const code = normalizeVipCode(args[0])

        if (!code) {
          return m.reply(`📌 Usa: *${usedPrefix}redeem CODIGO*`)
        }

        const data = db.vipCodes[code]

        if (!data) {
          const attempt = registerRedeemFail(senderReal)
          const remaining = Math.max(0, VIP_REDEEM_FAIL_LIMIT - Number(attempt.count || 0))

          return m.reply(
            `╭━━〔 ❌ CÓDIGO NO EXISTE 〕━━\n` +
            `┃ El código ingresado no fue encontrado.\n` +
            `╰━━━━━━━━━━━━━━━━━━\n\n` +
            `▪️ Verifica que esté bien escrito.\n` +
            `▪️ Intentos restantes: *${remaining}*`
          )
        }

        if (data.used) {
          return m.reply(
            `╭━━〔 🔒 CÓDIGO USADO 〕━━\n` +
            `┃ Este código VIP ya fue canjeado.\n` +
            `╰━━━━━━━━━━━━━━━━━━\n\n` +
            `Pide otro código válido o revisa planes con:\n` +
            `*${usedPrefix}vipshop*`
          )
        }

        if (isVipCodeExpired(data)) {
          return m.reply(
            `⏳ ▣ CÓDIGO CADUCADO\n` +
            `▪️ Este código VIP ya venció.\n` +
            `▪️ Los códigos solo duran 15 minutos desde que se crean.`
          )
        }

        const cfg = VIP_TYPES[data.type]

        if (!cfg) {
          return m.reply(`❌ Código dañado: tipo VIP inválido.`)
        }

        const currentCfg = getVipConfig(senderUser)

        if (currentCfg) {
          return m.reply(
            `> *[ ⌬ ] 🔒 CÓDIGO VIP BLOQUEADO*\n\n` +
            `💎 Ya tienes un VIP activo.\n` +
            `📌 *Plan actual:* ${currentCfg.badge} ${currentCfg.name}\n` +
            `📅 *Vence:* ${formatVipDate(senderVip)}\n` +
            `⏳ *Restante:* ${formatVipRemaining(senderVip)}\n\n` +
            `_No puedes canjear otro código hasta que tu VIP termine._`
          )
        }

        grantVip(senderUser, {
          type: data.type,
          days: data.days || 30,
          permanent: !!data.permanent,
          givenBy: data.createdBy,
          reason: 'codigo',
          code
        })

        data.used = true
        data.usedBy = senderReal
        data.usedAt = Date.now()

        resetRedeemFails(senderReal)
        saveDB()

        return m.reply(
          `✅ ▣ CÓDIGO CANJEADO\n` +
          `▪️ Nivel: ${cfg.badge} ${cfg.name}\n` +
          `▪️ Duración: ${data.permanent ? 'Permanente' : `${data.days || 30} días`}\n` +
          `▪️ Vence: ${formatVipDate(senderUser.vip)}`
        )
           }

      return m.reply(`Usa: ${usedPrefix}vipmenu`)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}
