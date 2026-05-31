import { resolveLidToRealJid } from '../../core/utils.js'
const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const PERMANENT_UNTIL = 4102444800000

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

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

const VIP_DATA = {
  basico: {
    badge: '💎',
    name: 'VIP Básico',
    short: 'Básico',
    normalGain: 30,
    cooldown: 25,
    success: 5,
    loss: 5,
    title: false
  },
  plus: {
    badge: '🔥',
    name: 'VIP Plus',
    short: 'Plus',
    normalGain: 50,
    cooldown: 30,
    success: 10,
    loss: 10,
    title: true
  },
  ultra: {
    badge: '👑',
    name: 'VIP Ultra',
    short: 'Ultra',
    normalGain: 70,
    cooldown: 35,
    success: 15,
    loss: 15,
    title: true
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
  if (typeof user.vip.stars !== 'number') user.vip.stars = 0
  if (typeof user.vip.starsBank !== 'number') user.vip.starsBank = 0
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false

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

  if (!vip.active || !type || !VIP_DATA[type]) return false

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

function formatPrice(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function getVipTypeData(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)
  return VIP_DATA[type] || null
}


function getVipData(user = {}) {
  const vip = ensureVip(user)
  const type = normalizeVipType(vip.type)
  const data = VIP_DATA[type]

  if (!isVipActive(user) || !data) {
    return {
      active: false,
      badge: '❌',
      name: 'Sin VIP',
      short: 'Sin VIP',
      normalGain: 0,
      cooldown: 0,
      success: 0,
      loss: 0,
      title: false
    }
  }

  return {
    active: true,
    ...data
  }
}


function buildPublicShopMenu(prefix = '.', name = 'Usuario') {
  return (
`╭━━〔 💎 RUBYJX VIP 〕━━
┃ Hola, ${name}.
┃ Aún no tienes VIP activo.
┃ Elige un plan para desbloquear ⭐ stars,
┃ recompensas premium y comandos exclusivos.
╰━━━━━━━━━━━━━━━━━━

> 💎 *VIP BÁSICO*
_30 días:_ S/3
_Permanente:_ S/10
_SOLES bot 30 días:_ ${formatPrice(VIP_PRICES.basico.coins30)}
_SOLES bot permanente:_ ${formatPrice(VIP_PRICES.basico.coinsPermanent)}

Beneficios:
_+30% en ganancias normales compatibles_
_-25% de cooldown_
_+5% de éxito en comandos de riesgo_
_-5% de reducción de pérdidas_
_Acceso a ⭐ stars, banco VIP y recompensas VIP_

Comprar:
*${prefix}buyvip basico*
*${prefix}buyvip basico permanente*

> 🔥 *VIP PLUS*
_30 días:_ S/5
_Permanente:_ S/15
_SOLES bot 30 días:_ ${formatPrice(VIP_PRICES.plus.coins30)}
_SOLES bot permanente:_ ${formatPrice(VIP_PRICES.plus.coinsPermanent)}

Beneficios:
_+50% en ganancias normales compatibles_
_-30% de cooldown_
_+10% de éxito en comandos de riesgo_
_-10% de reducción de pérdidas_
_Título personalizado disponible_
_Mejores recompensas VIP que Básico_

Comprar:
*${prefix}buyvip plus*
*${prefix}buyvip plus permanente*

> 👑 *VIP ULTRA*
_30 días:_ S/10
_Permanente:_ S/20
_SOLES bot 30 días:_ ${formatPrice(VIP_PRICES.ultra.coins30)}
_SOLES bot permanente:_ ${formatPrice(VIP_PRICES.ultra.coinsPermanent)}

Beneficios:
_+70% en ganancias normales compatibles_
_-35% de cooldown_
_+15% de éxito en comandos de riesgo_
_-15% de reducción de pérdidas_
_Máximo rendimiento VIP_
_Mejores recompensas, cofres y misiones_

Comprar:
*${prefix}buyvip ultra*
*${prefix}buyvip ultra permanente*

> 🎟️ *CÓDIGO VIP*
Si tienes un código, usa:
*${prefix}redeem CODIGO*

> 📌 *ACLARACIÓN*
El aporte real no es para ganancia propia.
Ayuda a pagar servidor, mantenimiento y mantener el bot prendido.`
  )
}

function buildExpiredMenu(prefix = '.', name = 'Usuario', vip = {}) {
  const total = Number(vip.stars || 0) + Number(vip.starsBank || 0)

  return (
`╭━━〔 ⏳ VIP EXPIRADO 〕━━
┃ Usuario: ${name}
┃ Estado: VIP vencido
┃ Stars protegidas: ${starsText(total)}
╰━━━━━━━━━━━━━━━━━━

Tu VIP ya no está activo.
Tus ⭐ stars están protegidas y no se borraron.

Para volver a usar comandos VIP:
*${prefix}vipshop*
*${prefix}redeem CODIGO*

Si ya no deseas renovar, puedes convertir tus ⭐ stars a SOLES:

*${prefix}vstars2soles all*

_Al salir sin renovar, la comisión es 15%._`
  )
}

function buildPlanBenefits(vipData = {}) {
  if (!vipData?.active) return ''

  const cfg = vipData

  return (
`> ${cfg.badge} *LOS BENEFICIOS DE TU ${cfg.name.toUpperCase()}*

*Economía normal*
_+${cfg.normalGain}% en ganancias compatibles_
_-${cfg.cooldown}% de cooldown_
_+${cfg.success}% de éxito en comandos de riesgo_
_-${cfg.loss}% de reducción de pérdidas_

*Economía VIP*
_Acceso a ⭐ stars_
_Banco VIP_
_Transferencias VIP_
_Misiones VIP_
_Recompensas VIP_
_Ranking VIP_

*Extra*
_${cfg.title ? 'Título personalizado disponible' : 'Primer nivel de acceso VIP'}_`
  )
}

function buildActiveVipMenu(prefix = '.', info = {}) {
  const {
    pushName = 'Usuario',
    number = '',
    isOwner = false,
    botName = 'RubyJX',
    vip = {},
    vipData = {}
  } = info

  const totalStars = Number(vip.stars || 0) + Number(vip.starsBank || 0)
  const expiresText = isPermanentVip(vip)
    ? 'Permanente'
    : formatTime(Number(vip.until || 0) - Date.now())

  return (
`╭━━〔 ${vipData.badge} ${botName.toUpperCase()} VIP 〕━━
┃ Usuario: ${pushName}
┃ Número: ${number || '-'}
┃ Plan: ${vipData.badge} ${vipData.name}
┃ Vence: ${expiresText}
┃ Cartera: ${starsText(vip.stars || 0)}
┃ Banco: ${starsText(vip.starsBank || 0)}
┃ Total: ${starsText(totalStars)}
┃ Título: ${vip.title || 'Sin título'}
╰━━━━━━━━━━━━━━━━━━

_Usa este menú como guía. Los comandos VIP trabajan con ⭐ stars, no con SOLES normales._

> 🎁 *RECOMPENSAS VIP*

*${prefix}vipdaily*
Reclama tu recompensa diaria VIP.
Te entrega ⭐ stars según tu nivel.

*${prefix}vipcofre*
Abre un cofre VIP con premios especiales.
Mientras mayor sea tu nivel, mejores pueden ser las recompensas.

*${prefix}vipbox*
Caja VIP de mayor valor.
Sirve para reclamar premios grandes cada varios días.

*${prefix}vipcooldowns*
Muestra cuánto falta para volver a usar tus recompensas VIP.

> 💼 *TRABAJOS VIP*

*${prefix}vwork*
Trabajo VIP seguro.
Ganas ⭐ stars sin riesgo de pérdida.
_Alias:_ ${prefix}vw, ${prefix}vchambear, ${prefix}vjob

*${prefix}vslut*
Misión nocturna VIP.
Tiene riesgo bajo y puede pagar más que vwork.
_Alias:_ ${prefix}vsl, ${prefix}vnocturno

*${prefix}vcrime*
Misión riesgosa VIP.
Puede pagar mucho más, pero también puedes perder ⭐ stars.
_Alias:_ ${prefix}vc, ${prefix}vcrimen

*${prefix}vmission*
Misión especial VIP.
Tiene cooldown propio y recompensa según tu nivel.
_Alias:_ ${prefix}vquest, ${prefix}vreto

> 🏦 *BANCO VIP*

*${prefix}vbal*
Muestra tu cartera VIP, banco VIP y total de ⭐ stars.

*${prefix}vdep cantidad*
Guarda ⭐ stars en tu banco VIP.
También puedes usar: *${prefix}vdep all*

*${prefix}vwith cantidad*
Retira ⭐ stars del banco VIP a tu cartera.

*${prefix}vpay cantidad @usuario*
Envía ⭐ stars a otro usuario VIP.
La transferencia sale desde tu banco VIP.
_Límite: máximo 150 stars cada 2 horas._

> 🔁 *CONVERSIÓN*

*${prefix}vcoins2stars cantidad*
Convierte tus SOLES normales en ⭐ stars.
_No tiene comisión._

*${prefix}vcoins2stars all*
Convierte todos tus SOLES disponibles en ⭐ stars.

*${prefix}vstars2soles cantidad*
Convierte ⭐ stars a SOLES normales.
_Tiene 60% de comisión si tu VIP está activo._

*${prefix}vcalc cantidad*
Calcula cuánto recibirías antes de convertir.
_Úsalo antes de vender stars._

> 🏆 *RANKING VIP*

*${prefix}eboardvip*
Muestra el ranking VIP del grupo.

*${prefix}eboardvipglobal*
Muestra el ranking VIP global.

> 🤝 *DONACIONES VIP*

*${prefix}vdonar cantidad*
Dona ⭐ stars al banco global.

*${prefix}gbank*
Muestra cuánto hay acumulado en el banco global.

*${prefix}claimgbank*
Reclama el banco global cuando esté disponible.

> 🧾 *HISTORIAL Y PERFIL*

*${prefix}vhistory*
Muestra tus últimos movimientos VIP.

*${prefix}vipbeneficios*
Muestra solo los beneficios de tu plan actual.

*${prefix}vipperfil*
Muestra tu perfil VIP completo.

*${prefix}vipstatus*
Muestra tu estado, nivel, vencimiento y datos importantes.

${buildPlanBenefits(vipData)}

${isOwner ? `> 🛠️ *OWNER*\nTienes acceso owner. Para administrar VIP usa los comandos de gestión:\n*${prefix}addvip*, *${prefix}delvip*, *${prefix}vipcode*, *${prefix}viplogs*` : ''}`
  ).trim()
}

async function getHeaderInfo(client, m) {
  let sender = m.sender || m.participant || m.key?.participant || ''

  try {
    sender = await resolveLidToRealJid(sender, client, m.chat)
  } catch {
    sender = cleanJid(sender)
  }

  const pushName = (m.pushName || 'Usuario').slice(0, 24)
  const number = onlyNumber(sender)
  const isOwner = isOwnerUser(sender) || isOwnerUser(m.sender)
  const botName =
    client?.user?.name ||
    client?.user?.verifiedName ||
    'RubyJX'

  const { user } = getGlobalUser(sender)
  const vip = ensureVip(user)
  const vipData = getVipData(user)

  return {
    sender,
    user,
    pushName,
    number,
    isOwner,
    botName,
    vip,
    vipData
  }
}

export default {
  command: ['vipmenu', 'menuvip'],
  category: 'VIP',

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const info = await getHeaderInfo(client, m)

      if (info.vipData.active) {
        return m.reply(buildActiveVipMenu(usedPrefix, info))
      }

      if (hadVipBefore(info.user)) {
        return m.reply(buildExpiredMenu(usedPrefix, info.pushName, info.vip))
      }

      return m.reply(buildPublicShopMenu(usedPrefix, info.pushName))
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}