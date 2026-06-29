import { resolveLidToRealJid } from '../../core/utils.js'
import {
  loadEventoDB,
  saveEventoDB,
  updateEventoDB,
  createEventoId,
  ensureEventoUser,
  ensureEventoGroup,
  addEventoTickets,
  addEventoFragments,
  pushEventoLog,
  resetActiveEvento
} from './eventoDB.js'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const PERMANENT_UNTIL = 4102444800000

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const EVENT_NAME = 'EVENTO GLOBAL'
const MAX_DURATION = 60 * MINUTE
const CACHE_TTL = 30 * MINUTE
const BOX_RAIN_TTL = 3 * MINUTE
const MIN_EVENT_GROUP_USERS = 50
const SAFE_EVENT_SEND_COOLDOWN = 30 * SECOND
const AUTO_DROP_INTERVAL = 30 * SECOND
const DROP_CODE_TTL = 2 * MINUTE

const COMMANDS = ['evento', 'eventoglobal', 'vipcraft']

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
    return cleanJid(m.sender)
  }
}

function getDB() {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}
  global.db.data.chats ||= {}
  return global.db.data
}

function saveMainDB() {
  if (typeof global.saveDatabase === 'function') {
    global.saveDatabase()
  }
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

function getLocalEcoUser(chatId = '', jid = '') {
  const db = getDB()
  const chat = String(chatId || '')

  db.chats[chat] ||= {}
  db.chats[chat].users ||= {}

  const key = findUserKey(db.chats[chat].users, jid)

  db.chats[chat].users[key] ||= {}

  if (typeof db.chats[chat].users[key].coins !== 'number') {
    db.chats[chat].users[key].coins = 0
  }

  if (typeof db.chats[chat].users[key].bank !== 'number') {
    db.chats[chat].users[key].bank = 0
  }

  return {
    key,
    user: db.chats[chat].users[key]
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

  return user.vip
}

function isPermanentVip(vip = {}) {
  return !!vip.permanent || Number(vip.until || 0) >= PERMANENT_UNTIL
}

function isVipActive(user = {}) {
  const vip = ensureVip(user)
  const type = String(vip.type || '').toLowerCase()

  if (!vip.active || !['basico', 'plus', 'ultra'].includes(type)) return false

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

function grantVipTrial(user = {}, ms = HOUR, givenBy = '', reason = 'evento') {
  const vip = ensureVip(user)
  const now = Date.now()

  if (isVipActive(user)) {
    return {
      ok: false,
      reason: 'already_vip'
    }
  }

  vip.active = true
  vip.type = 'basico'
  vip.since = now
  vip.until = now + Math.max(HOUR, Number(ms || HOUR))
  vip.permanent = false
  vip.givenBy = givenBy
  vip.reason = reason

  return {
    ok: true,
    until: vip.until
  }
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function formatMoney(num = 0) {
  return `S/${formatNumber(Math.floor(Number(num || 0)))}`
}

function formatTime(ms = 0) {
  const n = Math.max(0, Number(ms || 0))

  if (n <= 0) return 'finalizado'

  const d = Math.floor(n / DAY)
  const h = Math.floor((n % DAY) / HOUR)
  const m = Math.floor((n % HOUR) / MINUTE)
  const s = Math.floor((n % MINUTE) / SECOND)

  const parts = []
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  if (!d && !h && !m && s) parts.push(`${s}s`)

  return parts.length ? parts.join(' ') : 'menos de 1s'
}

function parseDuration(input = '15m') {
  const raw = String(input || '15m').trim().toLowerCase()
  const match = raw.match(/^(\d+)(s|seg|m|min|h|hora|horas)?$/)

  if (!match) return 15 * MINUTE

  const value = Math.max(1, Number(match[1] || 15))
  const unit = match[2] || 'm'

  let ms = value * MINUTE

  if (['s', 'seg'].includes(unit)) ms = value * SECOND
  if (['m', 'min'].includes(unit)) ms = value * MINUTE
  if (['h', 'hora', 'horas'].includes(unit)) ms = value * HOUR

  return Math.min(ms, MAX_DURATION)
}

function randomInt(min = 0, max = 0) {
  const a = Math.ceil(Number(min || 0))
  const b = Math.floor(Number(max || 0))

  if (b <= a) return a
  return Math.floor(Math.random() * (b - a + 1)) + a
}

function pickRandom(list = []) {
  return list[Math.floor(Math.random() * list.length)]
}

function chance(percent = 0) {
  return Math.random() * 100 < Number(percent || 0)
}

function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function normalizeEventoSettings(eventDb = {}) {
  eventDb.settings ||= {}

  eventDb.settings.minGroupParticipants = Math.max(
    MIN_EVENT_GROUP_USERS,
    Number(eventDb.settings.minGroupParticipants || MIN_EVENT_GROUP_USERS)
  )

  eventDb.settings.broadcastDelayMs = Math.max(
    SAFE_EVENT_SEND_COOLDOWN,
    Number(eventDb.settings.broadcastDelayMs || SAFE_EVENT_SEND_COOLDOWN)
  )

  eventDb.settings.globalNoticeCooldownMs = Math.max(
    SAFE_EVENT_SEND_COOLDOWN,
    Number(eventDb.settings.globalNoticeCooldownMs || SAFE_EVENT_SEND_COOLDOWN)
  )

  eventDb.settings.autoDropCooldownMs = Math.max(
    SAFE_EVENT_SEND_COOLDOWN,
    Number(eventDb.settings.autoDropCooldownMs || AUTO_DROP_INTERVAL)
  )

  if (typeof eventDb.settings.autoDropsEnabled !== 'boolean') {
    eventDb.settings.autoDropsEnabled = true
  }

  if (typeof eventDb.settings.byeMessage !== 'string' || !eventDb.settings.byeMessage.trim()) {
    eventDb.settings.byeMessage = 'Fue una pequeña prueba del sistema. Gracias por participar, pronto se viene algo más grande.'
  }

  eventDb.settings.byeNoticeBeforeMs = Math.max(
    30 * SECOND,
    Number(eventDb.settings.byeNoticeBeforeMs || 60 * SECOND)
  )

  return eventDb.settings
}

function getMinGroupUsers(eventDb = {}) {
  normalizeEventoSettings(eventDb)
  return Number(eventDb.settings.minGroupParticipants || MIN_EVENT_GROUP_USERS)
}

function getGroupParticipantsCount(group = {}) {
  return Number(
    group?.participantsCount ||
    group?.participants ||
    group?.size ||
    group?.memberCount ||
    0
  )
}

function isLargeEnoughGroup(eventDb = {}, group = {}) {
  return getGroupParticipantsCount(group) > getMinGroupUsers(eventDb)
}

async function getLiveGroupParticipants(client, chatId = '') {
  try {
    if (typeof client?.groupMetadata !== 'function') return 0

    const metadata = await client.groupMetadata(chatId)
    return Array.isArray(metadata?.participants) ? metadata.participants.length : 0
  } catch {
    return 0
  }
}

async function canUseEventoInGroup(client, eventDb = {}, m = {}) {
  if (!isGroup(m.chat)) {
    return {
      ok: false,
      count: 0,
      reason: 'not_group'
    }
  }

  if (isSorteosGroup(eventDb, m.chat)) {
    return {
      ok: true,
      count: 999999,
      reason: 'sorteos'
    }
  }

  const cached = eventDb.sharedGroupsCache?.groups?.[m.chat]
  let count = getGroupParticipantsCount(cached)

  if (!count) {
    count = await getLiveGroupParticipants(client, m.chat)
  }

  const min = getMinGroupUsers(eventDb)

  return {
    ok: count > min,
    count,
    min,
    reason: count > min ? 'ok' : 'small_group'
  }
}

function smallGroupText(eventDb = {}, count = 0) {
  const min = getMinGroupUsers(eventDb)

  return (
    `> *[ ⌬ ] 🎉 ${EVENT_NAME}*\n\n` +
    `🚫 Este evento solo se activa en grupos grandes.\n` +
    `👥 *Este grupo:* ${formatNumber(count)} usuarios\n` +
    `📌 *Requisito:* más de ${formatNumber(min)} usuarios\n\n` +
    `_Medida anti-spam para proteger el número del bot._`
  )
}

async function waitEventoSendCooldown() {
  global.eventoLastSafeSendAt ||= 0

  const last = Number(global.eventoLastSafeSendAt || 0)
  const wait = Math.max(0, last + SAFE_EVENT_SEND_COOLDOWN - Date.now())

  if (wait > 0) {
    await delay(wait)
  }
}


async function sendMessageSafe(client, jid, text) {
  try {
    await waitEventoSendCooldown()
    await client.sendMessage(jid, { text })
    global.eventoLastSafeSendAt = Date.now()
    return true
  } catch (error) {
    console.log('[EVENTO AVISO ERROR]', jid, error?.message || error)
    return false
  }
}

function isGroup(chatId = '') {
  return String(chatId || '').endsWith('@g.us')
}

function getBotJid(client) {
  return cleanJid(client?.user?.id || client?.user?.jid || '')
}

function getParticipantJid(participant = {}) {
  if (typeof participant === 'string') {
    return cleanJid(participant)
  }

  return cleanJid(
    participant?.id ||
    participant?.jid ||
    participant?.participant ||
    participant?.user ||
    participant?.lid ||
    participant?.phoneNumber ||
    participant?.phone ||
    ''
  )
}

function groupHasOwner(metadata = {}) {
  const directOwners = [
    metadata?.owner,
    metadata?.subjectOwner,
    metadata?.creator,
    metadata?.author
  ].filter(Boolean)

  if (directOwners.some(owner => isOwnerUser(owner))) {
    return true
  }

  const participants = Array.isArray(metadata?.participants) ? metadata.participants : []

  return participants.some(participant => {
    const jid = getParticipantJid(participant)
    return isOwnerUser(jid)
  })
}

function groupHasBot(metadata = {}, client) {
  const bot = getBotJid(client)
  const participants = Array.isArray(metadata?.participants) ? metadata.participants : []

  if (!bot) return true
  if (!participants.length) return true

  const found = participants.some(participant => {
    const jid = getParticipantJid(participant)
    return sameUser(jid, bot)
  })

  // groupFetchAllParticipating ya devuelve grupos donde el bot está.
  // Si no lo detecta por @lid o formato raro, no bloqueamos el aviso.
  return found || true
}

async function getSharedGroups(client, m, eventDb, forceRefresh = false) {
  normalizeEventoSettings(eventDb)
  eventDb.sharedGroupsCache ||= { updatedAt: 0, groups: {} }

  const cache = eventDb.sharedGroupsCache
  const cacheAge = Date.now() - Number(cache.updatedAt || 0)

  if (!forceRefresh && cacheAge < CACHE_TTL && Object.keys(cache.groups || {}).length) {
    return cache.groups
  }

  const groups = {}
  const minUsers = getMinGroupUsers(eventDb)
  const sorteosGroup = String(eventDb.settings?.sorteosGroup || '')

  try {
    if (typeof client.groupFetchAllParticipating !== 'function') {
      throw new Error('groupFetchAllParticipating no disponible')
    }

    const all = await client.groupFetchAllParticipating()
    const values = Array.isArray(all) ? all : Object.values(all || {})

    for (const meta of values) {
      const id = String(meta?.id || '')
      if (!isGroup(id)) continue
      if (!groupHasOwner(meta)) continue
      if (!groupHasBot(meta, client)) continue

      const participants = Array.isArray(meta?.participants) ? meta.participants.length : 0
      const isSorteos = sorteosGroup && id === sorteosGroup

      if (!isSorteos && participants <= minUsers) continue

      groups[id] = {
        id,
        name: String(meta?.subject || 'Grupo').slice(0, 80),
        participants,
        eligible: isSorteos || participants > minUsers,
        isSorteos
      }
    }
  } catch {
    if (isGroup(m.chat)) {
      const participants = await getLiveGroupParticipants(client, m.chat)
      const isSorteos = sorteosGroup && m.chat === sorteosGroup

      if (isSorteos || participants > minUsers) {
        groups[m.chat] = {
          id: m.chat,
          name: m.name || m.subject || 'Grupo actual',
          participants,
          eligible: true,
          isSorteos
        }
      }
    }
  }

  cache.updatedAt = Date.now()
  cache.groups = groups

  return groups
}

async function broadcastToSharedGroups(client, eventDb, text, {
  exclude = '',
  forceRefresh = false,
  m = null
} = {}) {
  normalizeEventoSettings(eventDb)

  const groups = await getSharedGroups(client, m || { chat: exclude }, eventDb, forceRefresh)
  const list = Object.values(groups || {})
    .filter(group => group?.id && group.id !== exclude)
    .filter(group => group.isSorteos || isLargeEnoughGroup(eventDb, group))
    .slice(0, Number(eventDb.settings?.maxBroadcastGroups || 30))

  let sent = 0

  for (const group of list) {
    const ok = await sendMessageSafe(client, group.id, text)
    if (ok) sent++
  }

  return sent
}

function getActiveMultiplier(eventDb = {}, chatId = '') {
  const now = Date.now()
  const active = eventDb.active || {}
  const global = active.multipliers?.global
  const group = active.multipliers?.groups?.[chatId]

  let value = 1
  let label = ''

  if (global && Number(global.until || 0) > now && Number(global.value || 1) > value) {
    value = Number(global.value || 1)
    label = `x${value} global`
  }

  if (group && Number(group.until || 0) > now && Number(group.value || 1) > value) {
    value = Number(group.value || 1)
    label = `x${value} del grupo`
  }

  return { value, label }
}

function isSorteosGroup(eventDb = {}, chatId = '') {
  return !!eventDb.settings?.sorteosGroup && eventDb.settings.sorteosGroup === chatId
}

function getClaimCount(eventDb = {}, jid = '') {
  return Number(eventDb.active?.claims?.[cleanJid(jid)] || 0)
}

function totalClaims(eventDb = {}) {
  return Object.values(eventDb.active?.claims || {}).reduce((sum, value) => sum + Number(value || 0), 0)
}

function totalTickets(eventDb = {}) {
  return Object.values(eventDb.active?.tickets || {}).reduce((sum, value) => sum + Number(value || 0), 0)
}

function ensureActiveExtra(eventDb = {}) {
  normalizeEventoSettings(eventDb)

  eventDb.active ||= {}
  eventDb.active.claims ||= {}
  eventDb.active.tickets ||= {}
  eventDb.active.boxRains ||= {}
  eventDb.active.drops ||= {}
  eventDb.active.lastAutoDropAt ||= 0
  eventDb.active.autoDropCounter ||= 0

  if (typeof eventDb.active.byeNoticeSent !== 'boolean') {
    eventDb.active.byeNoticeSent = false
  }

  eventDb.active.multipliers ||= { global: null, groups: {} }
  eventDb.active.multipliers.groups ||= {}

  eventDb.active.rewardsGiven ||= {
    soles: 0,
    fragments: 0,
    boxes: 0,
    tickets: 0,
    vipTrials: 0,
    jackpotWins: 0
  }

  eventDb.active.jackpot ||= {
    base: Number(eventDb.settings?.baseJackpot || 1000000),
    current: Number(eventDb.settings?.baseJackpot || 1000000),
    won: false,
    winner: '',
    wonAt: 0
  }
}

function activeEventText(eventDb = {}) {
  if (!eventDb.active?.enabled) {
    return (
      `> *[ ⌬ ] 🎉 ${EVENT_NAME}*\n\n` +
      `🚫 No hay evento activo.\n\n` +
      `📣 *Avisar:* .evento aviso\n` +
`✨ *Iniciar:* .evento iniciar 15m`
    )
  }

  const remaining = Math.max(0, Number(eventDb.active.endsAt || 0) - Date.now())
  const tickets = totalTickets(eventDb)
  const claims = totalClaims(eventDb)
  const jackpot = Number(eventDb.active?.jackpot?.current || 0)

  return (
    `> *[ ⌬ ] 🎉 ${EVENT_NAME}*\n\n` +
    `✅ *Estado:* activo\n` +
    `🆔 *ID:* ${eventDb.active.id || 'sin ID'}\n` +
    `⏳ *Restante:* ${formatTime(remaining)}\n` +
    `🎯 *Reclamos:* ${claims}/${eventDb.settings?.maxClaimsGlobal || 30}\n` +
    `🎫 *Boletos:* ${formatNumber(tickets)}\n` +
    `💰 *Jackpot:* ${formatMoney(jackpot)}\n` +
    `🏆 *Grupo de sorteos:* ${eventDb.settings?.sorteosGroup ? 'configurado' : 'no configurado'}`
  )
}

function buildHelp(prefix = '.') {
  return (
    `> *[ ⌬ ] 🎉 EVENTO GLOBAL*\n\n` +

    `🎯 *Comandos para participar*\n` +
    `> Usa estos comandos mientras el evento esté activo.\n\n` +

    `🎁 *${prefix}evento reclamar*\n` +
    `_Reclama tu premio del evento._\n` +
    `Puedes ganar SOLES, fragmentos VIP, boletos, cajas o VIP temporal.\n\n` +

    `📦 *${prefix}evento caja*\n` +
    `_Abre una caja cuando haya lluvia de cajas activa._\n` +
    `Solo funciona si en el grupo apareció una lluvia de cajas.\n\n` +

    `📊 *${prefix}evento estado*\n` +
    `_Muestra el estado actual del evento._\n` +
    `Verás tiempo restante, reclamos, boletos y jackpot.\n\n` +

    `🎫 *${prefix}evento boletos*\n` +
    `_Muestra tus boletos del sorteo final._\n` +
    `Mientras más boletos tengas, más oportunidades tienes de ganar al final.\n\n` +

    `🎟️ *${prefix}evento fragmentos*\n` +
    `_Muestra tus fragmentos VIP acumulados._\n` +
    `Los fragmentos sirven para canjear VIP temporal.\n\n` +

    `💎 *${prefix}vipcraft*\n` +
    `_Muestra los canjes disponibles con fragmentos._\n` +
    `También puedes usar:\n` +
    `• *${prefix}vipcraft 1d* — VIP Básico 1 día\n` +
    `• *${prefix}vipcraft 3d* — VIP Básico 3 días\n` +
    `• *${prefix}vipcraft 7d* — VIP Básico 7 días\n\n` +

    `🔁 *${prefix}evento canjear 1d*\n` +
    `_Otra forma de canjear fragmentos por VIP._\n` +
    `También acepta: *3d* y *7d*.\n\n` +

    `🏆 *${prefix}evento ranking*\n` +
    `_Muestra el ranking del evento._\n` +
    `Ordena usuarios por boletos y fragmentos acumulados.\n\n` +

    `📌 *Notas importantes*\n` +
    `> _No caen stars en este evento._\n` +
    `> _Los boletos solo sirven para el sorteo final del evento activo._\n` +
    `> _Los fragmentos VIP se guardan para canjear VIP temporal._\n` +
    `> _Si ya tienes VIP activo, no puedes canjear más VIP temporal._\n\n` +

    `_Participa mientras el evento esté activo._`
  )
}

function buildOwnerHelp(prefix = '.') {
  return (
    `> *[ ⌬ ] 🛠️ PANEL PRIVADO DEL EVENTO*\n\n` +

    `👑 *Acceso owner*\n` +
    `> Este panel solo puede verlo el owner.\n` +
    `> Aquí están los comandos internos para controlar el evento global.\n\n` +

    `🎉 *Control principal*\n` +
    `📣 *${prefix}evento aviso*\n` +
    `_Envía un aviso previo a los grupos elegibles._\n` +
    `_Esto puede tardar porque respeta 30s entre mensajes._\n` +
    `_No consume el tiempo real del evento._\n` +

    `✅ *${prefix}evento iniciar 15m*\n` +
    `_Inicia el evento real sin avisos globales._\n` +
    `_El tiempo empieza recién aquí._\n` +
    `_Los premios, códigos y lluvias salen automáticamente._\n` +

    `🛑 *${prefix}evento parar*\n` +
    `_Finaliza el evento activo._\n` +
    `_También ejecuta el sorteo final si hay boletos disponibles._\n\n` +

    `📊 *${prefix}evento estado*\n` +
    `_Muestra el estado actual del evento._\n` +
    `Incluye tiempo restante, reclamos, boletos, jackpot y grupo principal.\n\n` +

    `👥 *${prefix}evento grupos*\n` +
    `_Revisa los grupos detectados para avisos globales._\n` +
    `_Solo se toman grupos donde están tú y el bot._\n\n` +

    `🏆 *Grupo principal de sorteos*\n` +
    `📌 *${prefix}evento setsorteos*\n` +
    `_Configura el grupo actual como grupo principal del evento._\n` +
    `_Ahí aparecerán los premios más fuertes._\n\n` +

    `📦 *Eventos rápidos*\n` +
    `📦 *${prefix}evento lluvia 5*\n` +
    `_Crea una lluvia de cajas en el grupo actual._\n` +
    `_Los usuarios abren con: ${prefix}evento caja._\n\n` +

    `🔥 *${prefix}evento multiplicador 2 3m*\n` +
    `_Activa multiplicador x2 por 3 minutos en este grupo._\n` +
    `_Afecta premios del evento y economía compatible._\n\n` +

    `🌎 *${prefix}evento multiplicador global 2 3m*\n` +
    `_Activa multiplicador global en todos los grupos._\n` +
    `_Úsalo con cuidado para no inflar mucho la economía._\n\n` +

    `🧾 *Revisión y control*\n` +
    `📜 *${prefix}evento logs*\n` +
    `_Muestra los últimos movimientos del evento._\n` +
    `_Sirve para revisar premios, cajas, jackpot, canjes y reclamos._\n\n` +

    `🏆 *${prefix}evento ranking*\n` +
    `_Muestra el top de usuarios por boletos y fragmentos._\n\n` +

    `🎫 *${prefix}evento boletos*\n` +
    `_Muestra tus boletos actuales del sorteo final._\n\n` +

    `🎟️ *${prefix}evento fragmentos*\n` +
    `_Muestra tus fragmentos VIP acumulados._\n\n` +

    `💎 *Canjes VIP*\n` +
    `💎 *${prefix}vipcraft*\n` +
    `_Muestra opciones para canjear fragmentos._\n\n` +
    `💎 *${prefix}vipcraft 1d*\n` +
    `_Canjea 10 fragmentos por VIP Básico 1 día._\n\n` +
    `💎 *${prefix}vipcraft 3d*\n` +
    `_Canjea 30 fragmentos por VIP Básico 3 días._\n\n` +
    `💎 *${prefix}vipcraft 7d*\n` +
    `_Canjea 70 fragmentos por VIP Básico 7 días._\n\n` +

    `📌 *Reglas internas importantes*\n` +
    `> _No caen stars en este evento._\n` +
    `> _No se usa la palabra admin ni abuse en mensajes públicos._\n` +
    `> _Los boletos sirven solo para el sorteo final activo._\n` +
    `> _Los fragmentos VIP sí se guardan._\n` +
    `> _Si un usuario ya tiene VIP, no puede canjear más VIP temporal._\n` +
    `> _Los premios mejores deben concentrarse en el grupo de sorteos._\n\n` +

    `_Panel privado del sistema de evento global._`
  )
}

function buildStartText(eventDb = {}, usedPrefix = '.') {
  const remaining = Math.max(0, Number(eventDb.active.endsAt || 0) - Date.now())
  const minUsers = getMinGroupUsers(eventDb)

  return (
    `> *[ ⌬ ] 🎉 ${EVENT_NAME}*\n\n` +
    `✅ El evento está activo.\n` +
    `⏳ *Duración:* ${formatTime(remaining)}\n` +
    `🌎 *Modo:* global protegido\n` +
    `👥 *Grupos:* solo más de ${formatNumber(minUsers)} usuarios\n` +
    `🛡️ *Cooldown:* 30s entre avisos automáticos\n` +
    `🎁 *Premios:* SOLES, fragmentos, cajas, boletos, códigos y VIP temporal.\n` +
    `🏆 Los avisos especiales también llegan al grupo de sorteos.\n\n` +
    `🎯 *Reclamar:* ${usedPrefix}evento reclamar\n` +
    `📦 *Cajas:* ${usedPrefix}evento caja\n` +
    `🎫 *Boletos:* ${usedPrefix}evento boletos\n\n` +
    `_Premios limitados. No hay stars en este evento._`
  )
}



function buildAvisoText(eventDb = {}, usedPrefix = '.') {
  normalizeEventoSettings(eventDb)

  const minUsers = getMinGroupUsers(eventDb)

  return (
    `> *[ ⌬ ] 🎉 AVISO DEL ${EVENT_NAME}*\n\n` +
    `✨ Se está preparando una prueba especial del evento.\n` +
    `👥 *Grupos:* solo grupos con más de ${formatNumber(minUsers)} usuarios\n` +
    `🛡️ *Protección:* avisos con espera para evitar spam\n` +
    `🏆 *Grupo principal:* configurado\n\n` +
    `🎁 *Puede caer:*\n` +
    `> 💰 Códigos de SOLES\n` +
    `> 🎟️ Fragmentos VIP\n` +
    `> 🎫 Boletos de sorteo\n` +
    `> 📦 Lluvias de cajas\n` +
    `> 💎 VIP temporal\n\n` +
    `📌 *Cuando empiece:* usa ${usedPrefix}evento reclamar\n` +
    `🔐 *Si cae código:* ${usedPrefix}evento codigo <código>\n\n` +
    `_Este es solo un aviso. El tiempo real del evento aún no empieza._`
  )
}


function buildByeNoticeText(eventDb = {}) {
  normalizeEventoSettings(eventDb)

  const message = String(eventDb.settings?.byeMessage || '').trim()
  const remaining = Math.max(0, Number(eventDb.active?.endsAt || 0) - Date.now())

  return (
    `> *[ ⌬ ] 🧪 PRUEBA DEL SISTEMA*\n\n` +
    `${message}\n\n` +
    `⏳ *Finaliza en:* ${formatTime(remaining)}\n` +
    `🎫 *Boletos activos:* ${formatNumber(totalTickets(eventDb))}\n` +
    `💰 *Jackpot:* ${formatMoney(eventDb.active?.jackpot?.current || 0)}\n\n` +
    `_Mensaje automático de cierre del evento._`
  )
}

async function sendByeNoticeIfNeeded(client, eventDb = {}) {
  ensureActiveExtra(eventDb)

  if (!eventDb.active?.enabled) return false
  if (eventDb.active.byeNoticeSent) return false

  const remaining = Number(eventDb.active.endsAt || 0) - Date.now()
  const beforeMs = Number(eventDb.settings?.byeNoticeBeforeMs || 60 * SECOND)

  if (remaining <= 0 || remaining > beforeMs) return false

  const sorteos = String(eventDb.settings?.sorteosGroup || '')

  eventDb.active.byeNoticeSent = true

  if (!sorteos) {
    pushEventoLog(eventDb, {
      action: 'BYE_NOTICE_SKIPPED',
      chat: '',
      reward: 'bye',
      detail: 'No hay grupo de sorteos configurado',
      by: eventDb.active.startedBy || ''
    })

    return true
  }

  const ok = await sendMessageSafe(
    client,
    sorteos,
    buildByeNoticeText(eventDb)
  )

  pushEventoLog(eventDb, {
    action: ok ? 'BYE_NOTICE_SENT' : 'BYE_NOTICE_FAILED',
    chat: sorteos,
    reward: 'bye',
    detail: ok ? 'Mensaje de cierre enviado' : 'No se pudo enviar',
    by: eventDb.active.startedBy || ''
  })

  return true
}



function buildBigPrizeNotice({ winner = '', prize = '', groupName = '', originGroupName = '', usedPrefix = '.' } = {}) {
  return (
    `> *[ ⌬ ] 🏆 PREMIO CONFIRMADO*\n\n` +
    `${originGroupName ? `📍 *Grupo:* ${originGroupName}\n` : ''}` +
    `${winner ? `👤 *Usuario:* @${onlyNumber(winner)}\n` : ''}` +
    `🎁 *Premio:* ${prize}\n\n`
  )
}

function buildRewardText({ senderReal, rewardText, multiplier, jackpotWon, jackpotAmount, ticketsNow } = {}) {
  let text =
    `> *[ ⌬ ] 🎁 PREMIO DEL EVENTO*\n\n` +
    `👤 *Usuario:* @${onlyNumber(senderReal)}\n` +
    `${rewardText}\n`

  if (multiplier?.value > 1) {
    text += `🔥 *Multiplicador:* ${multiplier.label}\n`
  }

  if (jackpotWon) {
    text += `\n🚨 *Jackpot ganado:* ${formatMoney(jackpotAmount)}\n`
  }

  if (ticketsNow > 0) {
    text += `\n🎫 *Tus boletos:* ${formatNumber(ticketsNow)}\n`
  }

  text += `\n_Sigue participando mientras el evento esté activo._`
  return text
}


function createDropCode() {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase()
  const b = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `RJX-${a}-${b}`
}

function rewardUseTip(type = '', usedPrefix = '.') {
  if (type === 'fragments') {
    return `\n> 🎟️ *Fragmentos VIP:* se guardan y sirven para canjear VIP temporal.\n> Usa: *${usedPrefix}vipcraft* o *${usedPrefix}evento canjear 1d*`
  }

  if (type === 'tickets') {
    return `\n> 🎫 *Boletos:* son entradas para el sorteo final del evento activo.\n> Mientras más boletos tengas, más chances tienes.`
  }

  if (type === 'viptrial') {
    return `\n> 💎 *VIP temporal:* activa beneficios por tiempo limitado.\n> Si ya tienes VIP activo, se convierte en fragmentos.`
  }

  if (type === 'rain') {
    return `\n> 📦 *Lluvia de cajas:* abre una con *${usedPrefix}evento caja*.\n> Solo puedes abrir una caja por lluvia.`
  }

  if (type === 'soles') {
    return `\n> 💰 *SOLES:* se agregan a tu cartera local de este grupo.`
  }

  return ''
}

function buildDropText({ code = '', drop = {}, usedPrefix = '.' } = {}) {
  let title = '🎁 PREMIO OCULTO'
  let prize = ''

  if (drop.type === 'soles') {
    title = '💰 CÓDIGO DE SOLES'
    prize = `${formatMoney(drop.amount)}`
  }

  if (drop.type === 'fragments') {
    title = '🎟️ CÓDIGO DE FRAGMENTOS VIP'
    prize = `${formatNumber(drop.amount)} fragmentos VIP`
  }

  if (drop.type === 'tickets') {
    title = '🎫 CÓDIGO DE BOLETOS'
    prize = `${formatNumber(drop.amount)} boletos`
  }

  if (drop.type === 'viptrial') {
    title = '💎 CÓDIGO VIP TEMPORAL'
    prize = `VIP Básico ${formatTime(drop.amount)}`
  }

  const stock = Math.max(1, Number(drop.stock || drop.initialStock || 1))

  return (
    `> *[ ⌬ ] ${title}*\n\n` +
    `⚡ Acaba de caer un premio en este grupo.\n` +
    `🎁 *Premio:* ${prize}\n` +
    `📦 *Stock:* ${formatNumber(stock)} canjes\n` +
    `🔐 *Código:* *${code}*\n\n` +
    `✅ *Reclamar:* ${usedPrefix}evento codigo ${code}\n` +
    `🎟️ *También:* ${usedPrefix}canjear ${code}\n` +
    `⏳ *Expira:* ${formatTime(DROP_CODE_TTL)}\n` +
    rewardUseTip(drop.type, usedPrefix) +
    `\n\n_Los primeros en reclamar se lo llevan._`
  )
}

function buildSorteosDropNotice({ groupName = '', drop = {}, usedPrefix = '.' } = {}) {
  let prize = 'premio especial'

  if (drop.type === 'soles') prize = `${formatMoney(drop.amount)}`
  if (drop.type === 'fragments') prize = `${formatNumber(drop.amount)} fragmentos VIP`
  if (drop.type === 'tickets') prize = `${formatNumber(drop.amount)} boletos`
  if (drop.type === 'viptrial') prize = `VIP Básico ${formatTime(drop.amount)}`
  if (drop.type === 'rain') prize = `${formatNumber(drop.stock || 0)} cajas del evento`

  const stockLine = drop.type !== 'rain'
    ? `📦 *Stock:* ${formatNumber(drop.stock || drop.initialStock || 1)} canjes\n`
    : ''

  return (
    `> *[ ⌬ ] 🏆 RADAR DEL EVENTO*\n\n` +
    `✨ Cayó un premio automático en un grupo del evento.\n` +
    `🎁 *Premio:* ${prize}\n` +
    stockLine +
    `\n_Aviso confirmado. El premio sí fue enviado correctamente._\n` +
    `🎯 *Participa:* ${usedPrefix}evento reclamar`
  )
}


function buildSorteosRedeemNotice({ groupName = '', user = '', code = '', drop = {}, stockLeft = 0 } = {}) {
  let prize = 'premio especial'

  if (drop.type === 'soles') prize = `${formatMoney(drop.amount)}`
  if (drop.type === 'fragments') prize = `${formatNumber(drop.amount)} fragmentos VIP`
  if (drop.type === 'tickets') prize = `${formatNumber(drop.amount)} boletos`
  if (drop.type === 'viptrial') prize = `VIP Básico ${formatTime(drop.amount)}`

  return (
    `> *[ ⌬ ] ✅ CÓDIGO CANJEADO*\n\n` +
    `${user ? `👤 *Usuario:* @${onlyNumber(user)}\n` : ''}` +
    `🔐 *Código:* ${code}\n` +
    `🎁 *Premio:* ${prize}\n` +
    `📦 *Stock restante:* ${formatNumber(stockLeft)}\n\n` +
    `_Canje registrado en el grupo de sorteos._`
  )
}



function getAutoDropReward(isSorteos = false) {
  const roll = Math.random() * 100

  // Jackpot NO se toca. Esto solo controla códigos automáticos.
  if (isSorteos) {
    if (roll < 38) return { type: 'soles', amount: randomInt(80000, 280000) }
    if (roll < 60) return { type: 'fragments', amount: randomInt(5, 18) }
    if (roll < 80) return { type: 'tickets', amount: randomInt(3, 10) }
    if (roll < 92) return { type: 'viptrial', amount: randomInt(1, 3) * HOUR }
    return { type: 'rain', stock: randomInt(3, 6) }
  }

  if (roll < 45) return { type: 'soles', amount: randomInt(25000, 120000) }
  if (roll < 68) return { type: 'fragments', amount: randomInt(2, 8) }
  if (roll < 84) return { type: 'tickets', amount: randomInt(1, 5) }
  if (roll < 93) return { type: 'viptrial', amount: HOUR }
  return { type: 'rain', stock: randomInt(2, 5) }
}

function getDropStock(type = '', isSorteos = false) {
  if (type === 'soles') return isSorteos ? randomInt(1, 2) : randomInt(1, 3)
  if (type === 'fragments') return isSorteos ? randomInt(1, 3) : randomInt(2, 4)
  if (type === 'tickets') return isSorteos ? randomInt(2, 5) : randomInt(3, 6)
  if (type === 'viptrial') return 1
  return 1
}



async function sendSorteosOnlyNotice(client, eventDb = {}, originChat = '', text = '') {
  const sorteos = String(eventDb.settings?.sorteosGroup || '')

  if (!sorteos) return false
  if (sorteos === originChat) return false
  if (!text) return false

  return await sendMessageSafe(client, sorteos, text)
}

async function createAutoRain(client, eventDb = {}, target = {}, usedPrefix = '.') {
  const chatId = String(target?.id || '')

  if (!chatId.endsWith('@g.us')) {
    return false
  }

  const stock = Math.max(1, Math.min(Number(target.stock || target.dropStock || randomInt(3, 6)), 12))

  const text =
    `> *[ ⌬ ] 📦 LLUVIA AUTOMÁTICA*\n\n` +
    `🌧️ Cayeron *${stock} cajas* en este grupo.\n` +
    `⚡ *Abrir:* ${usedPrefix}evento caja\n` +
    `⏳ *Tiempo:* ${formatTime(BOX_RAIN_TTL)}\n` +
    rewardUseTip('rain', usedPrefix) +
    `\n\n_Cajas limitadas. Se acaban rápido._`

  const sentOrigin = await sendMessageSafe(client, chatId, text)

  if (!sentOrigin) {
    pushEventoLog(eventDb, {
      action: 'AUTO_BOX_RAIN_FAILED',
      chat: chatId,
      amount: stock,
      reward: 'boxes',
      detail: 'No se pudo enviar al grupo original',
      by: eventDb.active?.startedBy || ''
    })

    return false
  }

  eventDb.active.boxRains[chatId] = {
    id: createEventoId(),
    stock,
    createdAt: Date.now(),
    expiresAt: Date.now() + BOX_RAIN_TTL,
    claimed: {},
    automatic: true
  }

  const groupData = ensureEventoGroup(eventDb, chatId)
  groupData.name = target.name || groupData.name || 'Grupo'
  groupData.lastRainAt = Date.now()

  pushEventoLog(eventDb, {
    action: 'AUTO_BOX_RAIN',
    chat: chatId,
    amount: stock,
    reward: 'boxes',
    by: eventDb.active?.startedBy || ''
  })

  await sendSorteosOnlyNotice(
    client,
    eventDb,
    chatId,
    buildSorteosDropNotice({
      groupName: target.name || 'Grupo',
      drop: { type: 'rain', stock },
      usedPrefix
    })
  )

  return true
}

async function createAutoDrop(client, eventDb = {}, target = {}, usedPrefix = '.') {
  ensureActiveExtra(eventDb)

  const chatId = String(target?.id || '')

  if (!chatId.endsWith('@g.us')) {
    return false
  }

  const isSorteos = isSorteosGroup(eventDb, chatId)
  const drop = getAutoDropReward(isSorteos)

  if (drop.type === 'rain') {
    return await createAutoRain(client, eventDb, { ...target, stock: drop.stock }, usedPrefix)
  }

  const code = createDropCode()
  const stock = typeof getDropStock === 'function'
    ? getDropStock(drop.type, isSorteos)
    : 1

  const finalDrop = {
    code,
    chat: chatId,
    type: drop.type,
    amount: drop.amount,
    stock,
    initialStock: stock,
    redeemed: {},
    createdAt: Date.now(),
    expiresAt: Date.now() + DROP_CODE_TTL,
    claimedBy: '',
    claimedAt: 0
  }

  const text = buildDropText({
    code,
    drop: finalDrop,
    usedPrefix
  })

  const sentOrigin = await sendMessageSafe(client, chatId, text)

  if (!sentOrigin) {
    pushEventoLog(eventDb, {
      action: 'AUTO_DROP_FAILED',
      chat: chatId,
      amount: drop.amount,
      reward: drop.type,
      detail: code,
      by: eventDb.active?.startedBy || ''
    })

    return false
  }

  eventDb.active.drops[code] = finalDrop

  pushEventoLog(eventDb, {
    action: 'AUTO_DROP',
    chat: chatId,
    amount: drop.amount,
    reward: drop.type,
    detail: code,
    by: eventDb.active?.startedBy || ''
  })

  await sendSorteosOnlyNotice(
    client,
    eventDb,
    chatId,
    buildSorteosDropNotice({
      groupName: target.name || 'Grupo',
      drop: finalDrop,
      usedPrefix
    })
  )

  return true
}

function getAutoGroupWeight(group = {}) {
  const count = getGroupParticipantsCount(group)

  // Mientras más usuarios tenga el grupo, más probabilidad tendrá.
  if (count >= 500) return 10
  if (count >= 300) return 8
  if (count >= 200) return 6
  if (count >= 150) return 4
  if (count >= 100) return 3
  return 1
}

function pickWeightedGroup(groups = []) {
  if (!groups.length) return null

  const totalWeight = groups.reduce((sum, group) => {
    return sum + getAutoGroupWeight(group)
  }, 0)

  let roll = Math.random() * totalWeight

  for (const group of groups) {
    roll -= getAutoGroupWeight(group)

    if (roll <= 0) {
      return group
    }
  }

  return pickRandom(groups)
}

function pickAutoTarget(eventDb = {}) {
  ensureActiveExtra(eventDb)

  const groups = Object.values(eventDb.sharedGroupsCache?.groups || {})
    .filter(group => group?.id)

  const sorteosId = String(eventDb.settings?.sorteosGroup || '')

  const sorteosGroup = groups.find(group =>
    group.isSorteos || group.id === sorteosId
  )

  const normalGroups = groups
    .filter(group => !group.isSorteos && group.id !== sorteosId)
    .filter(group => isLargeEnoughGroup(eventDb, group))

  eventDb.active.autoDropCounter = Number(eventDb.active.autoDropCounter || 0) + 1

  // El grupo de sorteos sigue siendo principal:
  // cada 3 premios automáticos, 1 cae en sorteos.
  if (sorteosGroup && (!normalGroups.length || eventDb.active.autoDropCounter % 3 === 1)) {
    return sorteosGroup
  }

  if (!normalGroups.length) {
    return sorteosGroup || null
  }

  // Los otros premios caen con más probabilidad en grupos grandes.
  return pickWeightedGroup(normalGroups)
}

async function autoEventoLoop(client, eventId = '', usedPrefix = '.') {
  global.eventoAutoLoops ||= {}

  try {
    const eventDb = await loadEventoDB()
    ensureActiveExtra(eventDb)

    if (!eventDb.active.enabled || eventDb.active.id !== eventId || Number(eventDb.active.endsAt || 0) <= Date.now()) {
      delete global.eventoAutoLoops[eventId]
      return
    }

    if (!eventDb.settings.autoDropsEnabled) {
      delete global.eventoAutoLoops[eventId]
      return
    }

const cooldown = Math.max(SAFE_EVENT_SEND_COOLDOWN, Number(eventDb.settings.autoDropCooldownMs || AUTO_DROP_INTERVAL))
const last = Number(eventDb.active.lastAutoDropAt || 0)

const byeChanged = await sendByeNoticeIfNeeded(client, eventDb)

if (byeChanged) {
  await saveEventoDB(eventDb)
}

if (Date.now() - last >= cooldown) {
      const target = pickAutoTarget(eventDb)

      if (target) {
const created = await createAutoDrop(client, eventDb, target, usedPrefix)

if (created) {
  eventDb.active.lastAutoDropAt = Date.now()
  await saveEventoDB(eventDb)
}
      }
    }

    const fresh = await loadEventoDB()

    if (fresh.active?.enabled && fresh.active?.id === eventId && Number(fresh.active.endsAt || 0) > Date.now()) {
      global.eventoAutoLoops[eventId] = setTimeout(() => {
        autoEventoLoop(client, eventId, usedPrefix).catch(error => {
          console.log('[EVENTO AUTO ERROR]', error?.message || error)
        })
      }, cooldown)

      if (typeof global.eventoAutoLoops[eventId].unref === 'function') {
        global.eventoAutoLoops[eventId].unref()
      }
    } else {
      delete global.eventoAutoLoops[eventId]
    }
  } catch (error) {
    console.log('[EVENTO AUTO ERROR]', error?.message || error)
    delete global.eventoAutoLoops[eventId]
  }
}

function scheduleAutoEvento(client, eventDb = {}, usedPrefix = '.') {
  ensureActiveExtra(eventDb)
  global.eventoAutoLoops ||= {}

  const eventId = eventDb.active?.id
  if (!eventId || global.eventoAutoLoops[eventId]) return

  const cooldown = Math.max(SAFE_EVENT_SEND_COOLDOWN, Number(eventDb.settings?.autoDropCooldownMs || AUTO_DROP_INTERVAL))

  global.eventoAutoLoops[eventId] = setTimeout(() => {
    autoEventoLoop(client, eventId, usedPrefix).catch(error => {
      console.log('[EVENTO AUTO ERROR]', error?.message || error)
    })
  }, cooldown)

  if (typeof global.eventoAutoLoops[eventId].unref === 'function') {
    global.eventoAutoLoops[eventId].unref()
  }
}


function chooseReward(isSorteos = false) {
  const roll = Math.random() * 100

  if (isSorteos) {
    if (roll < 38) return 'soles'
    if (roll < 63) return 'fragments'
    if (roll < 78) return 'tickets'
    if (roll < 94) return 'box'
    return 'viptrial'
  }

  if (roll < 50) return 'soles'
  if (roll < 73) return 'fragments'
  if (roll < 88) return 'tickets'
  if (roll < 98) return 'box'
  return 'viptrial'
}

function getBoxReward(isSorteos = false) {
  const roll = Math.random() * 100

  if (isSorteos) {
    if (roll < 45) return { type: 'soles', amount: randomInt(500000, 2500000), label: '💰 SOLES' }
    if (roll < 70) return { type: 'fragments', amount: randomInt(15, 60), label: '🎟️ Fragmentos VIP' }
    if (roll < 90) return { type: 'tickets', amount: randomInt(5, 20), label: '🎫 Boletos' }
    return { type: 'viptrial', amount: 12 * HOUR, label: '💎 VIP Básico 12h' }
  }

  if (roll < 55) return { type: 'soles', amount: randomInt(80000, 600000), label: '💰 SOLES' }
  if (roll < 78) return { type: 'fragments', amount: randomInt(3, 18), label: '🎟️ Fragmentos VIP' }
  if (roll < 96) return { type: 'tickets', amount: randomInt(1, 8), label: '🎫 Boletos' }
  return { type: 'viptrial', amount: HOUR, label: '💎 VIP Básico 1h' }
}

function applySoles(chatId = '', jid = '', amount = 0) {
  const { user } = getLocalEcoUser(chatId, jid)
  if (!isOwnerUser(jid)) {
    user.coins = Number(user.coins || 0) + Math.floor(Number(amount || 0))
  }
  saveMainDB()
  return user.coins
}

function applyVipTrialOrConvert(eventDb = {}, jid = '', ms = HOUR, givenBy = '') {
  const { user } = getGlobalUser(jid)

  if (isVipActive(user)) {
    const fragments = Math.max(10, Math.floor(Number(ms || HOUR) / HOUR) * 3)
    const total = addEventoFragments(eventDb, jid, fragments)

    return {
      type: 'converted',
      fragments,
      total
    }
  }

  const result = grantVipTrial(user, ms, givenBy, 'evento')
  saveMainDB()

  if (!result.ok) {
    const total = addEventoFragments(eventDb, jid, 15)
    return { type: 'converted', fragments: 15, total }
  }

  eventDb.active.rewardsGiven.vipTrials = Number(eventDb.active.rewardsGiven.vipTrials || 0) + 1

  return {
    type: 'vip',
    until: result.until
  }
}

async function maybeGlobalNotice(client, eventDb, m, prizeText, winner = '') {
  normalizeEventoSettings(eventDb)

  const sorteos = String(eventDb.settings?.sorteosGroup || '')
  if (!sorteos || sorteos === m.chat) return 0

  // Evita avisos confusos por premios normales, multiplicadores o reclamos comunes.
  // El radar de códigos automáticos se maneja solo desde createAutoDrop/createAutoRain.
  const isJackpot = /jackpot/i.test(String(prizeText || ''))

  if (!isJackpot) return 0

  const now = Date.now()
  const last = Number(eventDb.settings?.lastGlobalNoticeAt || 0)
  const cooldown = Number(eventDb.settings?.globalNoticeCooldownMs || SAFE_EVENT_SEND_COOLDOWN)

  if (now - last < cooldown) return 0

  eventDb.settings.lastGlobalNoticeAt = now
  await saveEventoDB(eventDb)

  const ok = await sendMessageSafe(
    client,
    sorteos,
    buildBigPrizeNotice({
      winner,
      prize: prizeText,
      originGroupName: eventDb.groups?.[m.chat]?.name || m.subject || m.name || 'Grupo',
      usedPrefix: '.'
    })
  )

  return ok ? 1 : 0
}

async function handleClaim({ client, m, usedPrefix, senderReal }) {
  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!eventDb.active.enabled || Number(eventDb.active.endsAt || 0) <= Date.now()) {
    eventDb.active.enabled = false
    await saveEventoDB(eventDb)

    return m.reply(
      `> *[ ⌬ ] 🎉 ${EVENT_NAME}*\n\n` +
      `🚫 No hay evento activo ahora.\n\n` +
      `_Espera el próximo evento._`
    )
  }

const groupAccess = await canUseEventoInGroup(client, eventDb, m)

if (!groupAccess.ok) {
  return m.reply(smallGroupText(eventDb, groupAccess.count))
}

  const maxClaims = Number(eventDb.settings?.maxClaimsGlobal || 30)
  if (totalClaims(eventDb) >= maxClaims) {
    return m.reply(
      `> *[ ⌬ ] 🎉 EVENTO COMPLETO*\n\n` +
      `🎯 Ya se alcanzó el límite de reclamos.\n` +
      `🏆 Espera el sorteo final o el próximo evento.`
    )
  }

  const claimLimit = Number(eventDb.settings?.claimPerUser || 1)
  if (getClaimCount(eventDb, senderReal) >= claimLimit) {
    return m.reply(
      `> *[ ⌬ ] ⏳ YA RECLAMASTE*\n\n` +
      `🚫 Solo puedes reclamar *${claimLimit} vez* por evento.\n\n` +
      `_Tus boletos siguen participando en el sorteo final._`
    )
  }

  const groupData = ensureEventoGroup(eventDb, m.chat)
  groupData.name = groupData.name || m.subject || m.name || 'Grupo'

  const userData = ensureEventoUser(eventDb, senderReal)
  const inSorteos = isSorteosGroup(eventDb, m.chat)
  const multiplier = getActiveMultiplier(eventDb, m.chat)
  const reward = chooseReward(inSorteos)

  eventDb.active.claims[cleanJid(senderReal)] = getClaimCount(eventDb, senderReal) + 1
  groupData.totalClaims = Number(groupData.totalClaims || 0) + 1
  userData.totalClaims = Number(userData.totalClaims || 0) + 1
  userData.lastClaim = Date.now()

  const jackpotAdd = Number(eventDb.settings?.jackpotAddPerClaim || 50000)
  eventDb.active.jackpot.current = Number(eventDb.active.jackpot.current || eventDb.settings.baseJackpot || 1000000) + jackpotAdd

  let rewardText = ''
  let bigPrize = false
  let bigPrizeText = ''

  if (reward === 'soles') {
    const base = inSorteos ? randomInt(300000, 2500000) : randomInt(50000, 500000)
    const amount = Math.floor(base * multiplier.value)

    applySoles(m.chat, senderReal, amount)
    eventDb.active.rewardsGiven.soles = Number(eventDb.active.rewardsGiven.soles || 0) + amount
    rewardText = `💰 *Premio:* ${formatMoney(amount)}` + rewardUseTip('soles', usedPrefix)

    if (inSorteos && amount >= 1000000) {
      bigPrize = true
      bigPrizeText = `💰 ${formatMoney(amount)}`
    }

    pushEventoLog(eventDb, { action: 'CLAIM_SOLES', chat: m.chat, jid: senderReal, amount, reward: 'soles' })
  }

  if (reward === 'fragments') {
    const base = inSorteos ? randomInt(8, 35) : randomInt(2, 10)
    const amount = Math.floor(base * multiplier.value)
    const total = addEventoFragments(eventDb, senderReal, amount)

    eventDb.active.rewardsGiven.fragments = Number(eventDb.active.rewardsGiven.fragments || 0) + amount
    rewardText = `🎟️ *Fragmentos VIP:* ${amount}\n📌 *Total:* ${total}` + rewardUseTip('fragments', usedPrefix)

    if (inSorteos && amount >= 30) {
      bigPrize = true
      bigPrizeText = `🎟️ ${amount} fragmentos VIP`
    }

    pushEventoLog(eventDb, { action: 'CLAIM_FRAGMENTS', chat: m.chat, jid: senderReal, amount, reward: 'fragments' })
  }

  if (reward === 'tickets') {
    const base = inSorteos ? randomInt(3, 12) : randomInt(1, 5)
    const amount = Math.floor(base * multiplier.value)
    const total = addEventoTickets(eventDb, senderReal, amount)

    eventDb.active.rewardsGiven.tickets = Number(eventDb.active.rewardsGiven.tickets || 0) + amount
    rewardText = `🎫 *Boletos:* ${amount}\n🏆 *Tus boletos:* ${total}` + rewardUseTip('tickets', usedPrefix)

    pushEventoLog(eventDb, { action: 'CLAIM_TICKETS', chat: m.chat, jid: senderReal, amount, reward: 'tickets' })
  }

  if (reward === 'box') {
    const box = getBoxReward(inSorteos)
    const applied = applyBoxReward({ eventDb, m, senderReal, box, multiplier, givenBy: eventDb.active.startedBy, usedPrefix })

    rewardText = `📦 *Caja del evento:* ${box.label}\n${applied.text}`
    eventDb.active.rewardsGiven.boxes = Number(eventDb.active.rewardsGiven.boxes || 0) + 1

    if (inSorteos && applied.big) {
      bigPrize = true
      bigPrizeText = applied.bigText
    }

    pushEventoLog(eventDb, { action: 'CLAIM_BOX', chat: m.chat, jid: senderReal, amount: applied.amount || 1, reward: box.type })
  }

  if (reward === 'viptrial') {
    const usedVipTrials = Number(eventDb.active.rewardsGiven.vipTrials || 0)
    const maxVipTrials = Number(eventDb.settings?.maxVipTrials || 2)

    if (usedVipTrials >= maxVipTrials) {
      const amount = inSorteos ? 25 : 8
      const total = addEventoFragments(eventDb, senderReal, amount)
      rewardText = `🎟️ *Fragmentos VIP:* ${amount}\n📌 *Total:* ${total}` + rewardUseTip('fragments', usedPrefix)
      pushEventoLog(eventDb, { action: 'CLAIM_VIP_CONVERTED_LIMIT', chat: m.chat, jid: senderReal, amount, reward: 'fragments' })
    } else {
      const time = inSorteos ? 12 * HOUR : HOUR
      const applied = applyVipTrialOrConvert(eventDb, senderReal, time, eventDb.active.startedBy)

      if (applied.type === 'vip') {
        rewardText = `💎 *VIP temporal:* VIP Básico ${formatTime(time)}` + rewardUseTip('viptrial', usedPrefix)
        bigPrize = inSorteos
        bigPrizeText = `💎 VIP Básico ${formatTime(time)}`
      } else {
        rewardText = `🎟️ *Premio convertido:* ${applied.fragments} fragmentos VIP\n📌 *Total:* ${applied.total}\n_Ya tenías VIP activo._` + rewardUseTip('fragments', usedPrefix)
      }

      pushEventoLog(eventDb, { action: 'CLAIM_VIP_TRIAL', chat: m.chat, jid: senderReal, amount: time, reward: 'viptrial' })
    }
  }

  let jackpotWon = false
  let jackpotAmount = 0
  const jackpotChance = inSorteos
    ? Number(eventDb.settings?.jackpotChanceSorteos || 1.2)
    : Number(eventDb.settings?.jackpotChanceNormal || 0.6)

  const jackpotMultiplier = multiplier.value > 1 ? Math.min(multiplier.value, 5) : 1
  const canWinJackpot = Number(eventDb.active.rewardsGiven.jackpotWins || 0) < Number(eventDb.settings?.maxJackpotWins || 1)

  if (canWinJackpot && chance(jackpotChance * jackpotMultiplier)) {
    jackpotWon = true
    jackpotAmount = Number(eventDb.active.jackpot.current || eventDb.settings.baseJackpot || 1000000)

    applySoles(m.chat, senderReal, jackpotAmount)

    eventDb.active.rewardsGiven.soles = Number(eventDb.active.rewardsGiven.soles || 0) + jackpotAmount
    eventDb.active.rewardsGiven.jackpotWins = Number(eventDb.active.rewardsGiven.jackpotWins || 0) + 1
    eventDb.active.jackpot.won = true
    eventDb.active.jackpot.winner = cleanJid(senderReal)
    eventDb.active.jackpot.wonAt = Date.now()
    eventDb.active.jackpot.current = Number(eventDb.settings?.baseJackpot || 1000000)

    bigPrize = inSorteos
    bigPrizeText = `💰 Jackpot ${formatMoney(jackpotAmount)}`

    pushEventoLog(eventDb, { action: 'JACKPOT_WIN', chat: m.chat, jid: senderReal, amount: jackpotAmount, reward: 'jackpot' })
  }

  const ticketsNow = Number(eventDb.active.tickets?.[cleanJid(senderReal)] || 0)

  await saveEventoDB(eventDb)

  const text = buildRewardText({
    senderReal,
    rewardText,
    multiplier,
    jackpotWon,
    jackpotAmount,
    ticketsNow
  })

  await m.reply(text)

  if (bigPrize) {
    await maybeGlobalNotice(client, eventDb, m, bigPrizeText, senderReal)
  }
}

function applyBoxReward({ eventDb, m, senderReal, box, multiplier, givenBy, usedPrefix = '.' }) {
  let text = ''
  let big = false
  let bigText = ''
  let amount = Number(box.amount || 0)

  if (box.type === 'soles') {
    amount = Math.floor(amount * multiplier.value)
    applySoles(m.chat, senderReal, amount)
    eventDb.active.rewardsGiven.soles = Number(eventDb.active.rewardsGiven.soles || 0) + amount
    text = `💰 *Contenido:* ${formatMoney(amount)}` + rewardUseTip('soles', usedPrefix)
    big = amount >= 1000000
    bigText = `💰 ${formatMoney(amount)}`
  }

  if (box.type === 'fragments') {
    amount = Math.floor(amount * multiplier.value)
    const total = addEventoFragments(eventDb, senderReal, amount)
    eventDb.active.rewardsGiven.fragments = Number(eventDb.active.rewardsGiven.fragments || 0) + amount
    text = `🎟️ *Contenido:* ${amount} fragmentos VIP\n📌 *Total:* ${total}` + rewardUseTip('fragments', usedPrefix)
    big = amount >= 30
    bigText = `🎟️ ${amount} fragmentos VIP`
  }

  if (box.type === 'tickets') {
    amount = Math.floor(amount * multiplier.value)
    const total = addEventoTickets(eventDb, senderReal, amount)
    eventDb.active.rewardsGiven.tickets = Number(eventDb.active.rewardsGiven.tickets || 0) + amount
    text = `🎫 *Contenido:* ${amount} boletos\n🏆 *Tus boletos:* ${total}` + rewardUseTip('tickets', usedPrefix)
  }

  if (box.type === 'viptrial') {
    const applied = applyVipTrialOrConvert(eventDb, senderReal, amount, givenBy)

    if (applied.type === 'vip') {
      text = `💎 *Contenido:* VIP Básico ${formatTime(amount)}` + rewardUseTip('viptrial', usedPrefix)
      big = amount >= 12 * HOUR
      bigText = `💎 VIP Básico ${formatTime(amount)}`
    } else {
      text = `🎟️ *Contenido convertido:* ${applied.fragments} fragmentos VIP\n📌 *Total:* ${applied.total}\n_Ya tenías VIP activo._` + rewardUseTip('fragments', usedPrefix)
    }
  }

  return { text, big, bigText, amount }
}

async function handleBox({ client, m, senderReal, usedPrefix = '.' }) {
  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!eventDb.active.enabled || Number(eventDb.active.endsAt || 0) <= Date.now()) {
    eventDb.active.enabled = false
    await saveEventoDB(eventDb)
    return m.reply(`> *[ ⌬ ] 📦 CAJAS*\n\n🚫 No hay evento activo ahora.`)
  }

  const groupAccess = await canUseEventoInGroup(client, eventDb, m)

if (!groupAccess.ok) {
  return m.reply(smallGroupText(eventDb, groupAccess.count))
}

  const rain = eventDb.active.boxRains?.[m.chat]

  if (!rain || Number(rain.expiresAt || 0) <= Date.now() || Number(rain.stock || 0) <= 0) {
    return m.reply(
      `> *[ ⌬ ] 📦 CAJAS DEL EVENTO*\n\n` +
      `🚫 No hay lluvia de cajas activa en este grupo.\n\n` +
      `_Espera que aparezca una nueva._`
    )
  }

  rain.claimed ||= {}

  if (rain.claimed[cleanJid(senderReal)]) {
    return m.reply(
      `> *[ ⌬ ] 📦 CAJA YA RECLAMADA*\n\n` +
      `🚫 Solo puedes abrir una caja por lluvia.`
    )
  }

  const inSorteos = isSorteosGroup(eventDb, m.chat)
  const multiplier = getActiveMultiplier(eventDb, m.chat)
  const box = getBoxReward(inSorteos)
  const applied = applyBoxReward({ eventDb, m, senderReal, box, multiplier, givenBy: eventDb.active.startedBy, usedPrefix })

  rain.stock = Number(rain.stock || 0) - 1
  rain.claimed[cleanJid(senderReal)] = true

  const groupData = ensureEventoGroup(eventDb, m.chat)
  groupData.totalBoxes = Number(groupData.totalBoxes || 0) + 1

  pushEventoLog(eventDb, { action: 'BOX_CLAIM', chat: m.chat, jid: senderReal, amount: applied.amount || 1, reward: box.type })

  await saveEventoDB(eventDb)

  await m.reply(
    `> *[ ⌬ ] 📦 CAJA ABIERTA*\n\n` +
    `👤 *Usuario:* @${onlyNumber(senderReal)}\n` +
    `${applied.text}\n` +
    `📦 *Cajas restantes:* ${rain.stock}`
  )

  if (inSorteos && applied.big) {
    await maybeGlobalNotice(client, eventDb, m, applied.bigText, senderReal)
  }
}


async function handleCode({ client, m, args, senderReal, usedPrefix = '.' }) {
  const code = String(args[0] || '').trim().toUpperCase()

  if (!code) {
    return m.reply(
      `> *[ ⌬ ] 🔐 CÓDIGO DEL EVENTO*\n\n` +
      `✍️ Escribe el código que cayó en el grupo.\n\n` +
      `📌 *Ejemplo:* ${usedPrefix}evento codigo RJX-ABCD-1234`
    )
  }

  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!eventDb.active.enabled || Number(eventDb.active.endsAt || 0) <= Date.now()) {
    eventDb.active.enabled = false
    await saveEventoDB(eventDb)

    return m.reply(
      `> *[ ⌬ ] 🔐 CÓDIGO DEL EVENTO*\n\n` +
      `🚫 No hay evento activo ahora.`
    )
  }

  const groupAccess = await canUseEventoInGroup(client, eventDb, m)

  if (!groupAccess.ok) {
    return m.reply(smallGroupText(eventDb, groupAccess.count))
  }

  const drop = eventDb.active.drops?.[code]

  if (!drop) {
    return m.reply(
      `> *[ ⌬ ] 🔐 CÓDIGO INVÁLIDO*\n\n` +
      `🚫 Ese código no existe o ya fue limpiado.\n\n` +
      `_Revisa que lo hayas escrito igual._`
    )
  }

  if (drop.chat !== m.chat) {
    return m.reply(
      `> *[ ⌬ ] 🔒 CÓDIGO DE OTRO GRUPO*\n\n` +
      `🚫 Este código solo se puede reclamar en el grupo donde cayó.\n\n` +
      `_Cada premio pertenece a su grupo._`
    )
  }

  if (Number(drop.expiresAt || 0) <= Date.now()) {
    delete eventDb.active.drops[code]
    await saveEventoDB(eventDb)

    return m.reply(
      `> *[ ⌬ ] ⌛ CÓDIGO EXPIRADO*\n\n` +
      `🚫 El premio ya venció.\n\n` +
      `_Los códigos del evento duran poco para evitar abuso._`
    )
  }

  drop.redeemed ||= {}

  const senderKey = cleanJid(senderReal)

  if (drop.redeemed[senderKey]) {
    return m.reply(
      `> *[ ⌬ ] ⚠️ YA CANJEADO*\n\n` +
      `🚫 Ya reclamaste este código.\n\n` +
      `_Cada usuario solo puede reclamarlo una vez._`
    )
  }

  if (Number(drop.stock || 0) <= 0) {
    return m.reply(
      `> *[ ⌬ ] 📦 STOCK AGOTADO*\n\n` +
      `🚫 Este código ya no tiene canjes disponibles.\n\n` +
      `_Llegaste tarde esta vez._`
    )
  }

  let resultText = ''

  if (drop.type === 'soles') {
    applySoles(m.chat, senderReal, drop.amount)
    eventDb.active.rewardsGiven.soles = Number(eventDb.active.rewardsGiven.soles || 0) + Number(drop.amount || 0)
    resultText = `💰 *Ganaste:* ${formatMoney(drop.amount)}` + rewardUseTip('soles', usedPrefix)
  }

  if (drop.type === 'fragments') {
    const total = addEventoFragments(eventDb, senderReal, drop.amount)
    eventDb.active.rewardsGiven.fragments = Number(eventDb.active.rewardsGiven.fragments || 0) + Number(drop.amount || 0)
    resultText = `🎟️ *Ganaste:* ${formatNumber(drop.amount)} fragmentos VIP\n📌 *Total:* ${formatNumber(total)}` + rewardUseTip('fragments', usedPrefix)
  }

  if (drop.type === 'tickets') {
    const total = addEventoTickets(eventDb, senderReal, drop.amount)
    eventDb.active.rewardsGiven.tickets = Number(eventDb.active.rewardsGiven.tickets || 0) + Number(drop.amount || 0)
    resultText = `🎫 *Ganaste:* ${formatNumber(drop.amount)} boletos\n🏆 *Tus boletos:* ${formatNumber(total)}` + rewardUseTip('tickets', usedPrefix)
  }

  if (drop.type === 'viptrial') {
    const applied = applyVipTrialOrConvert(eventDb, senderReal, drop.amount, eventDb.active.startedBy)

    if (applied.type === 'vip') {
      resultText = `💎 *Ganaste:* VIP Básico ${formatTime(drop.amount)}` + rewardUseTip('viptrial', usedPrefix)
    } else {
      resultText =
        `🎟️ *Premio convertido:* ${formatNumber(applied.fragments)} fragmentos VIP\n` +
        `📌 *Total:* ${formatNumber(applied.total)}\n` +
        `_Ya tenías VIP activo._` +
        rewardUseTip('fragments', usedPrefix)
    }
  }

  drop.stock = Math.max(0, Number(drop.stock || 0) - 1)
  drop.redeemed[senderKey] = Date.now()
  drop.claimedBy = senderKey
  drop.claimedAt = Date.now()

  pushEventoLog(eventDb, {
    action: 'DROP_CLAIM',
    chat: m.chat,
    jid: senderReal,
    amount: drop.amount,
    reward: drop.type,
    detail: code
  })

  await saveEventoDB(eventDb)

  await sendSorteosOnlyNotice(
    client,
    eventDb,
    m.chat,
    buildSorteosRedeemNotice({
      groupName: eventDb.sharedGroupsCache?.groups?.[m.chat]?.name || m.subject || m.name || 'Grupo',
      user: senderReal,
      code,
      drop,
      stockLeft: drop.stock
    })
  )

  return m.reply(
    `> *[ ⌬ ] ✅ CÓDIGO RECLAMADO*\n\n` +
    `👤 *Usuario:* @${onlyNumber(senderReal)}\n` +
    `🔐 *Código:* ${code}\n` +
    `📦 *Stock restante:* ${formatNumber(drop.stock)}\n` +
    `${resultText}`
  )
}


async function handleSetBye({ m, args, usedPrefix, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const raw = args.join(' ').trim()
  const message = raw.replace(/^["'“”]+|["'“”]+$/g, '').trim()

  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!message) {
    return m.reply(
      `> *[ ⌬ ] 🧪 MENSAJE DE CIERRE*\n\n` +
      `📌 *Actual:*\n` +
      `${eventDb.settings?.byeMessage || 'No configurado'}\n\n` +
      `✍️ *Cambiar:*\n` +
      `${usedPrefix}evento setbye "Fue una pequeña prueba del sistema, gracias por participar."`
    )
  }

  eventDb.settings.byeMessage = message
  await saveEventoDB(eventDb)

  return m.reply(
    `> *[ ⌬ ] ✅ CIERRE CONFIGURADO*\n\n` +
    `🧪 El mensaje final del evento fue actualizado.\n\n` +
    `📌 *Nuevo mensaje:*\n` +
    `${message}\n\n` +
    `_Se enviará automáticamente cuando el evento esté por terminar._`
  )
}


async function handleAviso({ client, m, args, usedPrefix, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  const groups = await getSharedGroups(client, m, eventDb, true)
  await saveEventoDB(eventDb)

  const text = buildAvisoText(eventDb, usedPrefix)
  const sent = await broadcastToSharedGroups(client, eventDb, text, {
    m,
    forceRefresh: false
  })

  return m.reply(
    `> *[ ⌬ ] 📣 AVISO ENVIADO*\n\n` +
    `✅ Aviso previo enviado.\n` +
    `📣 *Grupos avisados:* ${sent}\n` +
    `👥 *Elegibles detectados:* ${Object.keys(groups || {}).length}\n` +
    `🛡️ *Cooldown:* 30s entre mensajes\n\n` +
    `🚀 *Iniciar sin avisos:* ${usedPrefix}evento iniciar 10m\n` +
    `_El tiempo del evento no se consumió con este aviso._`
  )
}



async function handleStart({ client, m, args, usedPrefix, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const durationArg = args.find(arg =>
    /^(\d+)(s|seg|m|min|h|hora|horas)?$/i.test(String(arg || '').trim())
  ) || '15m'

  const duration = parseDuration(durationArg)

  const result = await updateEventoDB(async eventDb => {
    ensureActiveExtra(eventDb)

    if (eventDb.active.enabled && Number(eventDb.active.endsAt || 0) > Date.now()) {
      return { already: true, eventDb }
    }

    resetActiveEvento(eventDb)
    ensureActiveExtra(eventDb)

    eventDb.active.enabled = true
    eventDb.active.id = createEventoId()
    eventDb.active.mode = 'global'
    eventDb.active.startedBy = cleanJid(senderReal)
    eventDb.active.startedAt = Date.now()
    eventDb.active.endsAt = Date.now() + duration

    eventDb.active.jackpot.base = Number(eventDb.settings?.baseJackpot || 1000000)
    eventDb.active.jackpot.current = Number(eventDb.settings?.baseJackpot || 1000000)

    eventDb.active.announcedGroups = Object.values(eventDb.sharedGroupsCache?.groups || {})
      .filter(group => group.isSorteos || isLargeEnoughGroup(eventDb, group))
      .map(group => group.id)

    eventDb.active.drops = {}
    eventDb.active.boxRains = {}
    eventDb.active.lastAutoDropAt = 0
    eventDb.active.autoDropCounter = 0

    pushEventoLog(eventDb, {
      action: 'EVENT_START_NO_NOTICE',
      chat: m.chat,
      jid: senderReal,
      amount: duration,
      reward: 'start',
      by: senderReal
    })

    return { already: false, eventDb }
  })

  const eventDb = result.eventDb

  if (result.already) {
    return m.reply(
      `> *[ ⌬ ] 🎉 ${EVENT_NAME}*\n\n` +
      `🚫 Ya hay un evento activo.\n` +
      `⏳ *Restante:* ${formatTime(Number(eventDb.active.endsAt || 0) - Date.now())}`
    )
  }

  await saveEventoDB(eventDb)
  scheduleAutoEvento(client, eventDb, usedPrefix)

  const cachedGroups = Object.keys(eventDb.sharedGroupsCache?.groups || {}).length

  return m.reply(
    `> *[ ⌬ ] ✅ EVENTO INICIADO*\n\n` +
    `🚀 Iniciado sin enviar avisos globales.\n` +
    `⏳ *Duración real:* ${formatTime(duration)}\n` +
    `👥 *Grupos en cache:* ${cachedGroups}\n` +
    `🏆 *Grupo principal:* ${eventDb.settings?.sorteosGroup ? 'configurado' : 'no configurado'}\n` +
    `🛡️ *Cooldown automático:* 30s\n\n` +
    `🎁 *Automático:* códigos, lluvias, cajas, boletos, fragmentos, SOLES y VIP temporal.\n` +
    `📌 *Avisar antes:* ${usedPrefix}evento aviso\n` +
    `🎯 *Participar:* ${usedPrefix}evento reclamar`
  )

}

function pickFinalTicketWinner(tickets = {}) {
  const entries = Object.entries(tickets || {})
    .map(([jid, count]) => ({
      jid: cleanJid(jid),
      count: Math.max(0, Math.floor(Number(count || 0)))
    }))
    .filter(item => item.jid && item.count > 0)

  const total = entries.reduce((sum, item) => sum + item.count, 0)

  if (!entries.length || total <= 0) {
    return {
      winner: '',
      winnerTickets: 0,
      totalTickets: 0
    }
  }

  let roll = Math.floor(Math.random() * total) + 1

  for (const item of entries) {
    roll -= item.count

    if (roll <= 0) {
      return {
        winner: item.jid,
        winnerTickets: item.count,
        totalTickets: total
      }
    }
  }

  const fallback = entries[0]

  return {
    winner: fallback.jid,
    winnerTickets: fallback.count,
    totalTickets: total
  }
}

function buildFinalDrawText({
  eventId = '',
  winner = '',
  winnerTickets = 0,
  totalTickets = 0,
  prize = 0
} = {}) {
  return (
    `> *[ ⌬ ] 🏆 SORTEO FINAL DEL EVENTO*\n\n` +
    `🆔 *Evento:* ${eventId || 'sin ID'}\n` +
    `🎫 *Boletos totales:* ${formatNumber(totalTickets)}\n\n` +
    `👤 *Ganador:* @${onlyNumber(winner)}\n` +
    `🎟️ *Boletos del ganador:* ${formatNumber(winnerTickets)}\n` +
    `💰 *Premio final:* ${formatMoney(prize)}\n\n` +
    `_Mientras más boletos tengas, más chances tienes en el sorteo final._`
  )
}

async function handleStop({ client, m, usedPrefix = '.', senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!eventDb.active?.enabled) {
    return m.reply(
      `> *[ ⌬ ] 🛑 EVENTO GLOBAL*\n\n` +
      `🚫 No hay evento activo para finalizar.`
    )
  }

  const eventId = eventDb.active.id || ''
  const sorteos = String(eventDb.settings?.sorteosGroup || '')
  const finalChat = sorteos || m.chat

  const draw = pickFinalTicketWinner(eventDb.active.tickets || {})
  const hasWinner = !!draw.winner

  let finalText = ''
  let finalPrize = 0

  if (hasWinner) {
    finalPrize = Number(eventDb.active?.jackpot?.current || eventDb.settings?.baseJackpot || 1000000)

    applySoles(finalChat, draw.winner, finalPrize)

    const winnerData = ensureEventoUser(eventDb, draw.winner)
    winnerData.wonFinals = Number(winnerData.wonFinals || 0) + 1

    finalText = buildFinalDrawText({
      eventId,
      winner: draw.winner,
      winnerTickets: draw.winnerTickets,
      totalTickets: draw.totalTickets,
      prize: finalPrize
    })

    pushEventoLog(eventDb, {
      action: 'FINAL_DRAW',
      chat: finalChat,
      jid: draw.winner,
      amount: finalPrize,
      reward: 'final',
      detail: eventId,
      by: senderReal
    })
  } else {
    finalText =
      `> *[ ⌬ ] 🛑 EVENTO FINALIZADO*\n\n` +
      `🆔 *Evento:* ${eventId || 'sin ID'}\n` +
      `🎫 No hubo boletos para sorteo final.\n\n` +
      `_El evento fue cerrado correctamente._`

    pushEventoLog(eventDb, {
      action: 'EVENT_STOP_NO_TICKETS',
      chat: m.chat,
      jid: senderReal,
      reward: 'stop',
      detail: eventId,
      by: senderReal
    })
  }

  pushEventoLog(eventDb, {
    action: 'EVENT_STOP',
    chat: m.chat,
    jid: senderReal,
    amount: finalPrize,
    reward: 'stop',
    detail: eventId,
    by: senderReal
  })

  resetActiveEvento(eventDb)
  await saveEventoDB(eventDb)

  if (global.eventoAutoLoops?.[eventId]) {
    clearTimeout(global.eventoAutoLoops[eventId])
    delete global.eventoAutoLoops[eventId]
  }

  if (sorteos && sorteos !== m.chat) {
    await sendMessageSafe(client, sorteos, finalText)

    return m.reply(
      `> *[ ⌬ ] 🛑 EVENTO FINALIZADO*\n\n` +
      `✅ El evento fue cerrado correctamente.\n` +
      `🏆 El resultado final fue enviado al grupo de sorteos.\n\n` +
      `${hasWinner ? `👤 *Ganador:* @${onlyNumber(draw.winner)}\n💰 *Premio:* ${formatMoney(finalPrize)}` : `🎫 No hubo boletos para sorteo.`}`
    )
  }

  return m.reply(finalText)
}


async function handleSetSorteos({ m, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  if (!isGroup(m.chat)) {
    return m.reply(
      `> *[ ⌬ ] 🏆 GRUPO DE SORTEOS*\n\n` +
      `🚫 Este comando debe usarse dentro del grupo de sorteos.`
    )
  }

  const eventDb = await loadEventoDB()
  eventDb.settings.sorteosGroup = m.chat
  ensureEventoGroup(eventDb, m.chat).name = m.subject || m.name || 'Grupo de sorteos'

  pushEventoLog(eventDb, { action: 'SET_SORTEOS', chat: m.chat, jid: senderReal, reward: 'settings', by: senderReal })
  await saveEventoDB(eventDb)

  return m.reply(
    `> *[ ⌬ ] 🏆 GRUPO DE SORTEOS*\n\n` +
    `✅ Este grupo fue configurado como grupo principal del evento.\n\n` +
    `_Aquí aparecerán los premios más fuertes._`
  )
}

async function handleGroups({ client, m, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const eventDb = await loadEventoDB()
  const groups = await getSharedGroups(client, m, eventDb, true)
  await saveEventoDB(eventDb)

  const list = Object.values(groups)
    .slice(0, 20)
    .map((g, i) => {
      const tag = g.isSorteos ? '🏆 sorteos' : `👥 ${formatNumber(g.participants || 0)}`
      return `${i + 1}. ${g.name || 'Grupo'}\n   ${g.id}\n   ${tag}`
    })
    .join('\n')

  return m.reply(
    `> *[ ⌬ ] 👥 GRUPOS DEL EVENTO*\n\n` +
    `📌 *Detectados:* ${Object.keys(groups).length}\n` +
    `👥 *Filtro:* más de ${formatNumber(getMinGroupUsers(eventDb))} usuarios\n` +
    `🛡️ *Cooldown:* 30s entre mensajes\n` +
    `📣 *Máximo por aviso:* ${eventDb.settings?.maxBroadcastGroups || 30}\n\n` +
    `${list || '_No se detectaron grupos elegibles._'}`
  )
}

async function handleRain({ client, m, args, senderReal, usedPrefix = '.' }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  if (!isGroup(m.chat)) {
    return m.reply(`> *[ ⌬ ] 📦 LLUVIA DE CAJAS*\n\n🚫 Úsalo en un grupo.`)
  }

  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!eventDb.active.enabled || Number(eventDb.active.endsAt || 0) <= Date.now()) {
    return m.reply(`> *[ ⌬ ] 📦 LLUVIA DE CAJAS*\n\n🚫 No hay evento activo.`)
  }

  const groupAccess = await canUseEventoInGroup(client, eventDb, m)

  if (!groupAccess.ok) {
    return m.reply(smallGroupText(eventDb, groupAccess.count))
  }

  const stock = Math.max(1, Math.min(Number(args[1] || args[0] || 5), 20))

  eventDb.active.boxRains[m.chat] = {
    id: createEventoId(),
    stock,
    createdAt: Date.now(),
    expiresAt: Date.now() + BOX_RAIN_TTL,
    claimed: {}
  }

  const groupData = ensureEventoGroup(eventDb, m.chat)
  groupData.name = groupData.name || m.subject || m.name || 'Grupo'
  groupData.lastRainAt = Date.now()

  pushEventoLog(eventDb, { action: 'BOX_RAIN', chat: m.chat, jid: senderReal, amount: stock, reward: 'boxes', by: senderReal })
  await saveEventoDB(eventDb)

  const text =
    `> *[ ⌬ ] 📦 LLUVIA DE CAJAS*\n\n` +
    `🌧️ Cayeron *${stock} cajas* en este grupo.\n` +
    `⚡ *Abrir:* ${usedPrefix}evento caja\n` +
    `⏳ *Tiempo:* ${formatTime(BOX_RAIN_TTL)}\n` +
    rewardUseTip('rain', usedPrefix) +
    `\n\n_Se acaban rápido._`

  await m.reply(text)

  await sendSorteosOnlyNotice(
    client,
    eventDb,
    m.chat,
    buildSorteosDropNotice({
      groupName: groupData.name || m.subject || m.name || 'Grupo',
      drop: { type: 'rain', stock },
      usedPrefix
    })
  )
}

async function handleMultiplier({ client, m, args, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const eventDb = await loadEventoDB()
  ensureActiveExtra(eventDb)

  if (!eventDb.active.enabled || Number(eventDb.active.endsAt || 0) <= Date.now()) {
    return m.reply(`> *[ ⌬ ] 🔥 MULTIPLICADOR*\n\n🚫 No hay evento activo.`)
  }

let target = 'group'
let valueArg = args[0] || '2'
let durationArg = args[1] || '3m'

if (String(args[0] || '').toLowerCase() === 'global') {
  target = 'global'
  valueArg = args[1] || '2'
  durationArg = args[2] || '3m'
}


  if (target !== 'global') {
  const groupAccess = await canUseEventoInGroup(client, eventDb, m)

  if (!groupAccess.ok) {
    return m.reply(smallGroupText(eventDb, groupAccess.count))
  }
}


  const value = Math.max(2, Math.min(Number(String(valueArg).replace(/x/gi, '')) || 2, 5))
  const duration = Math.min(parseDuration(durationArg), 10 * MINUTE)
  const until = Date.now() + duration

  if (target === 'global') {
    eventDb.active.multipliers.global = { value, until, by: cleanJid(senderReal) }
  } else {
    eventDb.active.multipliers.groups[m.chat] = { value, until, by: cleanJid(senderReal) }
    ensureEventoGroup(eventDb, m.chat).lastMultiplierAt = Date.now()
  }

  pushEventoLog(eventDb, { action: 'MULTIPLIER', chat: target === 'global' ? 'global' : m.chat, jid: senderReal, amount: value, reward: `x${value}`, by: senderReal })
  await saveEventoDB(eventDb)

  const text =
    `> *[ ⌬ ] 🔥 MULTIPLICADOR ACTIVO*\n\n` +
    `⚡ *Valor:* x${value}\n` +
    `⏳ *Duración:* ${formatTime(duration)}\n` +
    `📍 *Alcance:* ${target === 'global' ? 'todos los grupos' : 'este grupo'}\n\n` +
    `_Aplica a premios del evento y economía compatible mientras esté activo._`

  await m.reply(text)

  if (target === 'global' || isSorteosGroup(eventDb, m.chat)) {
    await maybeGlobalNotice(client, eventDb, m, `🔥 Multiplicador x${value}`, '')
  }
}

async function handleTickets({ m, senderReal }) {
  const eventDb = await loadEventoDB()
  const tickets = Number(eventDb.active?.tickets?.[cleanJid(senderReal)] || 0)

  return m.reply(
    `> *[ ⌬ ] 🎫 TUS BOLETOS*\n\n` +
    `👤 *Usuario:* @${onlyNumber(senderReal)}\n` +
    `🎫 *Boletos actuales:* ${formatNumber(tickets)}\n\n` +
    `_Sirven para el sorteo final del evento activo._`
  )
}

async function handleFragments({ m, senderReal, usedPrefix }) {
  const eventDb = await loadEventoDB()
  const user = ensureEventoUser(eventDb, senderReal)

  return m.reply(
    `> *[ ⌬ ] 🎟️ FRAGMENTOS VIP*\n\n` +
    `👤 *Usuario:* @${onlyNumber(senderReal)}\n` +
    `🎟️ *Fragmentos:* ${formatNumber(user.fragments || 0)}\n\n` +
    `💎 *Canjes:*\n` +
    `10 fragmentos → VIP Básico 1 día\n` +
    `30 fragmentos → VIP Básico 3 días\n` +
    `70 fragmentos → VIP Básico 7 días\n\n` +
    `✨ *Canjear:* ${usedPrefix}vipcraft 1d`
  )
}

async function handleRanking({ m }) {
  const eventDb = await loadEventoDB()
  const rows = Object.entries(eventDb.users || {})
    .map(([jid, user]) => ({
      jid,
      fragments: Number(user.fragments || 0),
      tickets: Number(eventDb.active?.tickets?.[jid] || 0),
      claims: Number(user.totalClaims || 0)
    }))
    .sort((a, b) => (b.tickets + b.fragments) - (a.tickets + a.fragments))
    .slice(0, 10)

  const text = rows.map((row, i) => (
    `${i + 1}. @${onlyNumber(row.jid)}\n` +
    `   🎫 Boletos: ${formatNumber(row.tickets)} | 🎟️ Fragmentos: ${formatNumber(row.fragments)}`
  )).join('\n')

  return m.reply(
    `> *[ ⌬ ] 🏆 RANKING DEL EVENTO*\n\n` +
    `${text || '_Aún no hay participantes._'}`
  )
}

async function handleLogs({ m, senderReal }) {
  if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
    return m.reply('Comando no encontrado.')
  }

  const eventDb = await loadEventoDB()
  const rows = (eventDb.logs || []).slice(0, 12)

  const text = rows.map((log, i) => (
    `${i + 1}. ${log.action} | ${log.reward || '-'} | ${formatNumber(log.amount || 0)}\n` +
    `   @${onlyNumber(log.jid)} | ${new Date(log.time).toLocaleString('es-PE')}`
  )).join('\n')

  return m.reply(
    `> *[ ⌬ ] 🧾 LOGS DEL EVENTO*\n\n` +
    `${text || '_Sin logs todavía._'}`
  )
}

async function handleCraft({ m, args, usedPrefix, senderReal }) {
  const eventDb = await loadEventoDB()
  const userData = ensureEventoUser(eventDb, senderReal)
  const { user } = getGlobalUser(senderReal)

  if (isVipActive(user)) {
    return m.reply(
      `> *[ ⌬ ] 💎 CANJE VIP*\n\n` +
      `🚫 Ya tienes VIP activo.\n\n` +
      `_No puedes canjear más VIP temporal hasta que termine tu plan actual._`
    )
  }

  const option = String(args[0] || 'info').toLowerCase()
  const plans = {
    '1d': { cost: 10, ms: DAY, label: '1 día' },
    '1dia': { cost: 10, ms: DAY, label: '1 día' },
    '3d': { cost: 30, ms: 3 * DAY, label: '3 días' },
    '3dias': { cost: 30, ms: 3 * DAY, label: '3 días' },
    '7d': { cost: 70, ms: 7 * DAY, label: '7 días' },
    '7dias': { cost: 70, ms: 7 * DAY, label: '7 días' }
  }

  const plan = plans[option]

  if (!plan) {
    return m.reply(
      `> *[ ⌬ ] 💎 VIPCRAFT*\n\n` +
      `🎟️ *Tus fragmentos:* ${formatNumber(userData.fragments || 0)}\n\n` +
      `💎 *Opciones:*\n` +
      `10 fragmentos → ${usedPrefix}vipcraft 1d\n` +
      `30 fragmentos → ${usedPrefix}vipcraft 3d\n` +
      `70 fragmentos → ${usedPrefix}vipcraft 7d`
    )
  }

  if (Number(userData.fragments || 0) < plan.cost) {
    return m.reply(
      `> *[ ⌬ ] 💎 VIPCRAFT*\n\n` +
      `🚫 No tienes suficientes fragmentos.\n` +
      `🎟️ *Necesitas:* ${plan.cost}\n` +
      `📌 *Tienes:* ${formatNumber(userData.fragments || 0)}`
    )
  }

  userData.fragments = Number(userData.fragments || 0) - plan.cost
  grantVipTrial(user, plan.ms, senderReal, 'vipcraft')
  saveMainDB()

  pushEventoLog(eventDb, { action: 'VIPCRAFT', chat: m.chat, jid: senderReal, amount: plan.cost, reward: plan.label })
  await saveEventoDB(eventDb)

  return m.reply(
    `> *[ ⌬ ] 💎 VIP CANJEADO*\n\n` +
    `✅ Activaste *VIP Básico ${plan.label}*.\n` +
    `🎟️ *Fragmentos usados:* ${plan.cost}\n` +
    `📌 *Restantes:* ${formatNumber(userData.fragments || 0)}`
  )
}

async function routeEvento({ client, m, args, usedPrefix, command }) {
  const senderReal = await getSenderReal(m, client)
  const action = String(args[0] || 'menu').toLowerCase()

    if (['owner', 'panel', 'privado', 'ownermenu', 'menuowner'].includes(action)) {
    if (!isOwnerUser(senderReal) && !isOwnerUser(m.sender)) {
      return m.reply('Comando no encontrado.')
    }

    return m.reply(buildOwnerHelp(usedPrefix))
  }

  if (String(command || '').toLowerCase() === 'vipcraft') {
    return await handleCraft({ m, args, usedPrefix, senderReal })
  }

  if (['menu', 'ayuda', 'help'].includes(action)) {
    return m.reply(buildHelp(usedPrefix))
  }

  if (['setsorteos', 'sorteos', 'setgrupo'].includes(action)) {
    return await handleSetSorteos({ m, senderReal })
  }

if (['setbye', 'bye', 'despedida', 'setdespedida'].includes(action)) {
  return await handleSetBye({ m, args: args.slice(1), usedPrefix, senderReal })
}

if (['aviso', 'avisar', 'preaviso', 'anuncio'].includes(action)) {
  return await handleAviso({ client, m, args: args.slice(1), usedPrefix, senderReal })
}

if (['iniciar', 'start', 'activar'].includes(action)) {
  return await handleStart({ client, m, args: args.slice(1), usedPrefix, senderReal })
}

  if (['parar', 'stop', 'terminar', 'finalizar'].includes(action)) {
    return await handleStop({ client, m, usedPrefix, senderReal })
  }

  if (['estado', 'status'].includes(action)) {
    const eventDb = await loadEventoDB()
    return m.reply(activeEventText(eventDb))
  }

  if (['grupos', 'groups'].includes(action)) {
    return await handleGroups({ client, m, senderReal })
  }

  if (['reclamar', 'claim'].includes(action)) {
    return await handleClaim({ client, m, usedPrefix, senderReal })
  }

if (['caja', 'box', 'abrir'].includes(action)) {
  return await handleBox({ client, m, senderReal, usedPrefix })
}

if (['codigo', 'code', 'claimcode', 'cod'].includes(action)) {
  return await handleCode({ client, m, args: args.slice(1), senderReal, usedPrefix })
}
if (['lluvia', 'cajas'].includes(action)) {
  return await handleRain({ client, m, args: args.slice(1), senderReal, usedPrefix })
}

  if (['multiplicador', 'multi', 'x'].includes(action)) {
    return await handleMultiplier({ client, m, args: args.slice(1), senderReal })
  }

  if (['boletos', 'tickets'].includes(action)) {
    return await handleTickets({ m, senderReal })
  }

  if (['fragmentos', 'frags'].includes(action)) {
    return await handleFragments({ m, senderReal, usedPrefix })
  }

  if (['ranking', 'rank', 'top'].includes(action)) {
    return await handleRanking({ m })
  }

  if (['logs', 'historial'].includes(action)) {
    return await handleLogs({ m, senderReal })
  }

  if (['canjear', 'craft'].includes(action)) {
    return await handleCraft({ m, args: args.slice(1), usedPrefix, senderReal })
  }

  return m.reply(buildHelp(usedPrefix))
}

export default {
  command: COMMANDS,
  category: 'eventos',

  run: async (client, m, args = [], usedPrefix = '.', command = 'evento') => {
    try {
      return await routeEvento({ client, m, args, usedPrefix, command })
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}
