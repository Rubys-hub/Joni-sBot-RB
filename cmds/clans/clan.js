import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import sharp from 'sharp'
import { normalizeJid, onlyNumber, resolveLidToRealJid, sameUserIdentity } from '../../core/utils.js'
import { saveDB } from '../../core/vipNormalBonus.js'

const DATA_DIR = path.join(process.cwd(), 'data', 'clans')
const BANNER_DIR = path.join(DATA_DIR, 'banners')
const GALLERY_DIR = path.join(DATA_DIR, 'galleries')

const CREATE_CLAN_COST = 5000000
const CUSTOM_BANNER_COST = 1000000
const RENAME_COST = 2000000
const DESCRIPTION_COST = 500000
const BASE_MEMBER_LIMIT = 10
const BANNER_WIDTH = 1280
const BANNER_HEIGHT = 720
const PAGE_SIZE = 6
const WAR_ENTRY_COST = 1000000
const WAR_DURATION_MS = 24 * 60 * 60 * 1000
const WAR_BURN_RATE = 0.30

const COMMAND_ALIASES = {
  crearclan: 'create',
  clancrear: 'create',
  claninfo: 'info',
  clanperfil: 'profile',
  claninvitar: 'invite',
  clanaceptar: 'accept',
  clansalir: 'leave',
  clanmiembros: 'members',
  clantop: 'top',
  clanes: 'list',
  clandonar: 'donate',
  clanbank: 'bank',
  clanbanco: 'bank',
  clanupgrade: 'upgrade',
  clanmejorar: 'upgrade',
  clantienda: 'shop',
  clancomprar: 'buy',
  clanexpulsar: 'kick',
  clanascender: 'promote',
  clandegradar: 'demote',
  clandesc: 'description',
  clandescripcion: 'description',
  clanbanner: 'banner',
  setclan: 'setclan',
  clanrename: 'rename',
  clannombre: 'rename',
  clandisolver: 'disband',
  clanmisiones: 'missions',
  clanwar: 'war'
}

const SUBCOMMAND_ALIASES = {
  menu: 'menu',
  ayuda: 'menu',
  help: 'menu',
  crear: 'create',
  create: 'create',
  info: 'info',
  perfil: 'profile',
  invitar: 'invite',
  invite: 'invite',
  aceptar: 'accept',
  accept: 'accept',
  salir: 'leave',
  leave: 'leave',
  miembros: 'members',
  members: 'members',
  top: 'top',
  clanes: 'list',
  lista: 'list',
  donar: 'donate',
  donate: 'donate',
  banco: 'bank',
  bank: 'bank',
  upgrade: 'upgrade',
  mejorar: 'upgrade',
  tienda: 'shop',
  shop: 'shop',
  comprar: 'buy',
  buy: 'buy',
  expulsar: 'kick',
  kick: 'kick',
  ascender: 'promote',
  promote: 'promote',
  degradar: 'demote',
  demote: 'demote',
  desc: 'description',
  descripcion: 'description',
  description: 'description',
  banner: 'banner',
  rename: 'rename',
  nombre: 'rename',
  disolver: 'disband',
  misiones: 'missions',
  missions: 'missions',
  war: 'war',
  guerra: 'war'
}

const DECORATIONS = {
  basic: {
    id: 'basic',
    name: 'Marco Base',
    cost: 0,
    color: '#a855f7',
    glow: '#7c3aed',
    description: 'Marco RubyJX basico incluido con todos los clanes.'
  },
  neon: {
    id: 'neon',
    name: 'Neon Violeta',
    cost: 5000000,
    color: '#d946ef',
    glow: '#22d3ee',
    description: 'Borde neon con brillo extra en la galeria de clanes.'
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby Pulse',
    cost: 20000000,
    color: '#fb7185',
    glow: '#f0abfc',
    description: 'Marco premium rosa/rubi con energia RubyJX.'
  },
  circuit: {
    id: 'circuit',
    name: 'Circuito JX',
    cost: 40000000,
    color: '#38bdf8',
    glow: '#a78bfa',
    description: 'Decoracion tecnologica con lineas tipo circuito.'
  },
  legend: {
    id: 'legend',
    name: 'Legendario',
    cost: 75000000,
    color: '#facc15',
    glow: '#f472b6',
    description: 'Marco dorado para clanes que quieren aparecer como jefes finales.'
  }
}

function formatNumber(value = 0) {
  return Math.floor(Number(value || 0)).toLocaleString('en-US')
}

function formatMoney(value = 0, currency = 'Soles') {
  return `S/${formatNumber(value)} ${currency}`
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function cleanId(value = '') {
  return normalizeJid(value)
}

function jidNumber(jid = '') {
  return onlyNumber(jid || '')
}

function escapeXml(value = '') {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function safeFileName(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80) || 'clan'
}

function normalizeText(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function normalizeClanName(name = '') {
  return String(name || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 32)
}

function hashString(value = '') {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededRandom(seed = '') {
  let state = hashString(seed) || 1
  return () => {
    state += 0x6D2B79F5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stableShuffle(items = [], seed = '') {
  const random = seededRandom(seed)
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function getDayKey(now = Date.now()) {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

function getWeekKey(now = Date.now()) {
  const date = new Date(new Date(now).toLocaleString('en-US', { timeZone: 'America/Lima' }))
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  return date.toISOString().slice(0, 10)
}

function getBotCurrency(client) {
  const botId = client?.user?.id?.split(':')?.[0] + '@s.whatsapp.net'
  return global.db.data.settings?.[botId]?.currency || 'Soles'
}

function parseAmount(value = '') {
  let text = String(value || '').toLowerCase().trim()
  if (!text) return NaN

  let multiplier = 1
  if (text.endsWith('k')) {
    multiplier = 1000
    text = text.slice(0, -1)
  } else if (text.endsWith('m')) {
    multiplier = 1000000
    text = text.slice(0, -1)
  } else if (text.endsWith('b')) {
    multiplier = 1000000000
    text = text.slice(0, -1)
  } else if (/millones?$/.test(text)) {
    multiplier = 1000000
    text = text.replace(/millones?$/, '')
  } else if (/mil$/.test(text)) {
    multiplier = 1000
    text = text.replace(/mil$/, '')
  }

  const clean = text.replace(/[^\d.,-]/g, '').replace(',', '.')
  const number = Number(clean)
  return Number.isFinite(number) ? Math.floor(number * multiplier) : NaN
}

async function ensureAssetDirs() {
  await fs.mkdir(BANNER_DIR, { recursive: true })
  await fs.mkdir(GALLERY_DIR, { recursive: true })
}

function getChatData(chatId = '') {
  global.db.data ||= {}
  global.db.data.chats ||= {}
  global.db.data.chats[chatId] ||= {}
  global.db.data.chats[chatId].users ||= {}
  global.db.data.chats[chatId].clans ||= {
    clans: {},
    invites: {},
    pendingWars: {},
    activeWar: null
  }

  const data = global.db.data.chats[chatId].clans
  data.clans ||= {}
  data.invites ||= {}
  data.pendingWars ||= {}
  data.activeWar ||= null

  return global.db.data.chats[chatId]
}

function findUserKey(users = {}, jid = '') {
  const clean = cleanId(jid)
  if (clean && users[clean]) return clean

  const found = Object.keys(users).find(key => sameUserIdentity(key, clean || jid))
  return found || clean || jid
}

function ensureLocalUser(chatId = '', jid = '', name = 'Usuario') {
  const chat = getChatData(chatId)
  const key = findUserKey(chat.users, jid)
  chat.users[key] ||= {}
  const user = chat.users[key]

  user.id ??= key
  user.name ||= name || `Usuario ${jidNumber(key) || key}`
  user.coins = typeof user.coins === 'number' ? user.coins : 0
  user.bank = typeof user.bank === 'number' ? user.bank : 0

  return { key, user }
}

async function getSenderKey(client, m) {
  const resolved = m.senderReal || await resolveLidToRealJid(m.sender, client, m.chat).catch(() => m.sender)
  return ensureLocalUser(m.chat, resolved || m.sender, m.pushName || 'Usuario')
}

function getMentionList(m = {}) {
  const context =
    m.message?.extendedTextMessage?.contextInfo ||
    m.msg?.contextInfo ||
    m.message?.imageMessage?.contextInfo ||
    m.message?.videoMessage?.contextInfo ||
    {}

  return [
    ...(Array.isArray(m.mentionedJid) ? m.mentionedJid : []),
    ...(Array.isArray(context.mentionedJid) ? context.mentionedJid : [])
  ].filter(Boolean)
}

async function getTargetKey(client, m) {
  const mentioned = getMentionList(m)
  const raw = mentioned[0] || m.quoted?.sender || m.quoted?.participant || ''
  if (!raw) return null

  const resolved = await resolveLidToRealJid(raw, client, m.chat).catch(() => raw)
  return ensureLocalUser(m.chat, resolved, `Usuario ${jidNumber(resolved) || resolved}`)
}

function getGroupClans(chatId = '') {
  return getChatData(chatId).clans
}

function getClanList(groupData) {
  return Object.values(groupData.clans || {})
    .filter(clan => clan && clan.id && !clan.disbanded)
}

function getClanById(groupData, clanId = '') {
  return groupData.clans?.[clanId] || null
}

function getClanByNameOrId(groupData, input = '') {
  const query = normalizeText(input)
  if (!query) return null

  return getClanList(groupData).find(clan =>
    normalizeText(clan.id) === query ||
    normalizeText(clan.name) === query ||
    normalizeText(clan.name).includes(query)
  ) || null
}

function findMemberKey(clan, jid = '') {
  if (!clan?.members) return ''
  return Object.keys(clan.members).find(key => sameUserIdentity(key, jid)) || ''
}

function findClanByUser(groupData, jid = '') {
  for (const clan of getClanList(groupData)) {
    const memberKey = findMemberKey(clan, jid)
    if (memberKey) {
      return { clan, memberKey, member: clan.members[memberKey] }
    }
  }
  return null
}

function ensureClanDefaults(clan) {
  clan.level = Math.max(1, Math.floor(Number(clan.level || 1)))
  clan.bank = Math.max(0, Math.floor(Number(clan.bank || 0)))
  clan.totalDonated = Math.max(0, Math.floor(Number(clan.totalDonated || 0)))
  clan.points = Math.max(0, Math.floor(Number(clan.points || 0)))
  clan.xp = Math.max(0, Math.floor(Number(clan.xp || 0)))
  clan.maxMembers = Math.max(BASE_MEMBER_LIMIT, Math.floor(Number(clan.maxMembers || BASE_MEMBER_LIMIT)))
  clan.admins = Array.isArray(clan.admins) ? clan.admins : []
  clan.members ||= {}
  clan.logs = Array.isArray(clan.logs) ? clan.logs : []
  clan.banner ||= {}
  clan.banner.freeCustomUsed = Boolean(clan.banner.freeCustomUsed)
  clan.decorationsOwned = Array.isArray(clan.decorationsOwned) ? clan.decorationsOwned : ['basic']
  if (!clan.decorationsOwned.includes('basic')) clan.decorationsOwned.unshift('basic')
  clan.decoration ||= 'basic'
  if (!DECORATIONS[clan.decoration]) clan.decoration = 'basic'
  clan.missionStats ||= {}
  clan.missionClaims ||= {}
  clan.warStats ||= {
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0
  }
  return clan
}

function memberCount(clan) {
  return Object.keys(clan?.members || {}).length
}

function isClanLeader(clan, jid = '') {
  return sameUserIdentity(clan?.leader, jid)
}

function isClanAdmin(clan, jid = '') {
  if (isClanLeader(clan, jid)) return true
  return (clan?.admins || []).some(admin => sameUserIdentity(admin, jid))
}

function roleLabel(clan, jid = '') {
  if (isClanLeader(clan, jid)) return '👑 Líder'
  if ((clan.admins || []).some(admin => sameUserIdentity(admin, jid))) return '⚔️ Admin'
  return '🧑 Miembro'
}

function topDonorKey(clan) {
  let best = ''
  let amount = 0
  for (const [jid, member] of Object.entries(clan.members || {})) {
    const donated = Math.max(0, Number(member.donated || 0))
    if (donated > amount) {
      best = jid
      amount = donated
    }
  }
  return best
}

function pushClanLog(clan, text = '') {
  clan.logs ||= []
  clan.logs.unshift({
    at: Date.now(),
    text: String(text || '').slice(0, 180)
  })
  clan.logs = clan.logs.slice(0, 25)
}

function getUpgradeCost(clan) {
  const level = Math.max(1, Number(clan.level || 1))
  return Math.floor(10000000 * Math.pow(2.2, level - 1))
}

function getDecoration(id = '') {
  return DECORATIONS[normalizeText(id)] || null
}

function getMemberDisplayName(chatId = '', jid = '') {
  const chat = getChatData(chatId)
  const key = findUserKey(chat.users, jid)
  return chat.users?.[key]?.name || `@${jidNumber(jid) || jid}`
}

function mentionTag(jid = '') {
  return `@${jidNumber(jid) || jid}`
}

function buildClanMenu(usedPrefix = '.', clan = null, currency = 'Soles') {
  const status = clan
    ? `Tu clan: *${clan.name}* | Nivel ${clan.level} | Banco ${formatMoney(clan.bank, currency)}`
    : 'No perteneces a ningun clan.'

  return (
    `╭━━━〔 🛡️ CLANES RUBYJX 〕━━━╮\n` +
    `┃ ${status}\n` +
    `┃\n` +
    `┃ ${usedPrefix}crearclan <nombre>\n` +
    `┃ ${usedPrefix}claninfo / ${usedPrefix}clanperfil\n` +
    `┃ ${usedPrefix}clanmiembros\n` +
    `┃ ${usedPrefix}clanes [pagina]\n` +
    `┃ ${usedPrefix}clantop\n` +
    `┃\n` +
    `┃ Economia del clan\n` +
    `┃ ${usedPrefix}clandonar <cantidad>\n` +
    `┃ ${usedPrefix}clanbank\n` +
    `┃ ${usedPrefix}clanupgrade\n` +
    `┃ ${usedPrefix}clantienda\n` +
    `┃ ${usedPrefix}clancomprar <decoracion>\n` +
    `┃\n` +
    `┃ Lider/Admin\n` +
    `┃ ${usedPrefix}claninvitar @user\n` +
    `┃ ${usedPrefix}clanexpulsar @user\n` +
    `┃ ${usedPrefix}clanascender @user\n` +
    `┃ ${usedPrefix}clandegradar @user\n` +
    `┃ ${usedPrefix}clandesc <texto>\n` +
    `┃ ${usedPrefix}clanrename <nombre>\n` +
    `┃ ${usedPrefix}setclan banner (responde imagen)\n` +
    `┃\n` +
    `┃ Misiones y guerra\n` +
    `┃ ${usedPrefix}clanmisiones\n` +
    `┃ ${usedPrefix}clanwar\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  )
}

function makeClanId(groupData, name = '') {
  const base = safeFileName(name).toLowerCase().slice(0, 16) || 'clan'
  let id = `${base}_${Date.now().toString(36).slice(-5)}`
  while (groupData.clans[id]) {
    id = `${base}_${Math.random().toString(36).slice(2, 7)}`
  }
  return id
}

function randomPalette(seed = '') {
  const palettes = [
    ['#16051f', '#a855f7', '#22d3ee'],
    ['#07111f', '#38bdf8', '#d946ef'],
    ['#190712', '#fb7185', '#facc15'],
    ['#071a13', '#34d399', '#a78bfa'],
    ['#130b2e', '#8b5cf6', '#f472b6'],
    ['#080b18', '#60a5fa', '#f0abfc']
  ]
  const random = seededRandom(seed || String(Date.now()))
  return palettes[Math.floor(random() * palettes.length)]
}

function clanBannerPath(chatId, clanId) {
  return path.join(BANNER_DIR, `${safeFileName(chatId)}_${safeFileName(clanId)}.jpg`)
}

function storedPath(filePath = '') {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/')
}

function resolveStoredPath(filePath = '') {
  if (!filePath) return ''
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
}

async function generateDefaultBanner(clan) {
  await ensureAssetDirs()
  const filePath = clanBannerPath(clan.chatId, clan.id)
  const [dark, primary, accent] = randomPalette(`${clan.id}:${clan.name}`)
  const title = escapeXml(clan.name)
  const svg = `
  <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" viewBox="0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${dark}"/>
        <stop offset="48%" stop-color="#070814"/>
        <stop offset="100%" stop-color="${primary}"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
        <path d="M64 0H0V64" fill="none" stroke="${accent}" stroke-opacity="0.14" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <g opacity="0.62" fill="none" stroke="${accent}" stroke-width="4">
      <path d="M80 110H310L390 190H610"/>
      <path d="M1210 590H990L900 510H690"/>
      <path d="M100 590H270L360 500H510"/>
      <path d="M1180 110H1010L910 210H760"/>
    </g>
    <g opacity="0.35" fill="${primary}">
      <circle cx="180" cy="180" r="8"/>
      <circle cx="1080" cy="160" r="10"/>
      <circle cx="220" cy="560" r="7"/>
      <circle cx="1050" cy="540" r="9"/>
    </g>
    <rect x="92" y="86" width="1096" height="548" rx="42" fill="#050713" fill-opacity="0.46" stroke="${primary}" stroke-width="4"/>
    <rect x="122" y="116" width="1036" height="488" rx="34" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="2"/>
    <text x="640" y="348" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="86" fill="${accent}" filter="url(#glow)" letter-spacing="2">${title}</text>
    <text x="640" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" opacity="0.88">CLAN RUBYJX</text>
  </svg>`

  await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(filePath)
  clan.banner = {
    path: storedPath(filePath),
    custom: false,
    freeCustomUsed: false,
    color: primary,
    updatedAt: Date.now()
  }
}

async function saveCustomBanner(clan, buffer) {
  await ensureAssetDirs()
  const filePath = clanBannerPath(clan.chatId, clan.id)
  await sharp(buffer)
    .rotate()
    .resize(BANNER_WIDTH, BANNER_HEIGHT, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(filePath)

  clan.banner ||= {}
  clan.banner.path = storedPath(filePath)
  clan.banner.custom = true
  clan.banner.freeCustomUsed = true
  clan.banner.updatedAt = Date.now()
}

async function ensureClanBanner(clan) {
  const current = resolveStoredPath(clan.banner?.path || '')
  if (current && fsSync.existsSync(current)) return current
  await generateDefaultBanner(clan)
  return resolveStoredPath(clan.banner.path)
}

function backgroundSvg(width, height, title = 'CLANES RUBYJX') {
  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050713"/>
        <stop offset="48%" stop-color="#130b2e"/>
        <stop offset="100%" stop-color="#07111f"/>
      </linearGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M60 0H0V60" fill="none" stroke="#a855f7" stroke-opacity="0.13" stroke-width="1"/>
      </pattern>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <text x="${width / 2}" y="92" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="54" fill="#f0abfc" filter="url(#glow)">${escapeXml(title)}</text>
    <text x="${width / 2}" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#93c5fd">galeria diaria estable</text>
  </svg>`)
}

function decorationSvg(width, height, decoration, clan, currency) {
  const deco = DECORATIONS[clan.decoration] || DECORATIONS.basic
  const name = escapeXml(clan.name)
  const members = memberCount(clan)
  const level = Math.max(1, clan.level || 1)
  const bank = escapeXml(formatMoney(clan.bank, currency))
  const circuit = clan.decoration === 'circuit'
    ? `<path d="M18 36H96L130 70H210" stroke="${deco.glow}" stroke-width="3" opacity="0.75" fill="none"/><path d="M${width - 18} ${height - 36}H${width - 96}L${width - 130} ${height - 70}H${width - 210}" stroke="${deco.glow}" stroke-width="3" opacity="0.75" fill="none"/>`
    : ''
  const star = clan.decoration === 'legend'
    ? `<text x="${width - 42}" y="48" text-anchor="middle" font-size="34" fill="${deco.color}">★</text>`
    : ''

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="24" fill="none" stroke="${deco.glow}" stroke-width="8" opacity="0.36" filter="url(#glow)"/>
    <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="22" fill="none" stroke="${deco.color}" stroke-width="4"/>
    ${circuit}
    ${star}
    <rect x="0" y="${height - 74}" width="${width}" height="74" fill="#050713" fill-opacity="0.78"/>
    <text x="24" y="${height - 42}" font-family="Arial Black, Impact, sans-serif" font-size="26" fill="#ffffff">${name}</text>
    <text x="24" y="${height - 16}" font-family="Arial, sans-serif" font-size="18" fill="#c4b5fd">Nivel ${level} • ${members} miembros • ${bank}</text>
  </svg>`)
}

async function renderClanCard(clan, width, height, currency) {
  const bannerPath = await ensureClanBanner(clan)
  const banner = await sharp(bannerPath)
    .resize(width, height, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toBuffer()
  const overlay = decorationSvg(width, height, DECORATIONS[clan.decoration] || DECORATIONS.basic, clan, currency)
  return sharp(banner).composite([{ input: overlay, left: 0, top: 0 }]).png().toBuffer()
}

function getLayout(count, canvasWidth, canvasHeight) {
  const cardW = 386
  const cardH = 224
  const gapX = 38
  const gapY = 42
  const rows =
    count <= 1 ? [1] :
    count === 2 ? [2] :
    count === 3 ? [2, 1] :
    count === 4 ? [2, 2] :
    count === 5 ? [3, 2] :
    [3, 3]

  const totalHeight = rows.length * cardH + (rows.length - 1) * gapY
  const startY = Math.floor((canvasHeight - totalHeight) / 2) + 70
  const positions = []

  rows.forEach((cols, rowIndex) => {
    const rowWidth = cols * cardW + (cols - 1) * gapX
    const startX = Math.floor((canvasWidth - rowWidth) / 2)
    for (let col = 0; col < cols; col++) {
      positions.push({
        left: startX + col * (cardW + gapX),
        top: startY + rowIndex * (cardH + gapY),
        width: cardW,
        height: cardH
      })
    }
  })

  return positions.slice(0, count)
}

async function renderClanGallery(chatId, groupData, page, currency) {
  await ensureAssetDirs()
  const clans = getClanList(groupData)
  const shuffled = stableShuffle(clans, `${chatId}:${getDayKey()}`)
  const totalPages = Math.max(1, Math.ceil(shuffled.length / PAGE_SIZE))
  const currentPage = clamp(Number(page || 1), 1, totalPages)
  const pageClans = shuffled.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const width = 1400
  const height = 980

  const composites = [{ input: backgroundSvg(width, height, `CLANES RUBYJX • PAGINA ${currentPage}/${totalPages}`), left: 0, top: 0 }]
  const positions = getLayout(pageClans.length, width, height)

  for (let i = 0; i < pageClans.length; i++) {
    const pos = positions[i]
    const card = await renderClanCard(pageClans[i], pos.width, pos.height, currency)
    composites.push({ input: card, left: pos.left, top: pos.top })
  }

  const footer = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <text x="${width / 2}" y="${height - 38}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#c4b5fd">Orden aleatorio estable por dia • RubyJX Bot</text>
  </svg>`)
  composites.push({ input: footer, left: 0, top: 0 })

  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#050713'
    }
  }).composite(composites).jpeg({ quality: 90 }).toBuffer()

  return { buffer, currentPage, totalPages, count: clans.length, pageClans }
}

function buildMembersText(chatId, clan, currency) {
  const topDonor = topDonorKey(clan)
  let text =
    `╭━━━〔 👥 MIEMBROS: ${clan.name} 〕━━━╮\n` +
    `┃ Nivel: ${clan.level} | Banco: ${formatMoney(clan.bank, currency)}\n` +
    `┃ Espacios: ${memberCount(clan)}/${clan.maxMembers}\n` +
    `┃\n`

  const entries = Object.entries(clan.members || {})
    .sort(([a], [b]) => {
      if (isClanLeader(clan, a)) return -1
      if (isClanLeader(clan, b)) return 1
      const adminA = isClanAdmin(clan, a)
      const adminB = isClanAdmin(clan, b)
      if (adminA !== adminB) return adminA ? -1 : 1
      return Number(clan.members[b].donated || 0) - Number(clan.members[a].donated || 0)
    })

  for (const [jid, member] of entries) {
    const donorTag = topDonor && sameUserIdentity(jid, topDonor) && Number(member.donated || 0) > 0 ? ' 💎 Donador Top' : ''
    text +=
      `┃ ${mentionTag(jid)} — ${roleLabel(clan, jid)}${donorTag}\n` +
      `┃ Donado: ${formatMoney(member.donated || 0, currency)}\n`
  }

  text += `╰━━━━━━━━━━━━━━━━━━━━╯`
  return text
}

function buildClanInfo(chatId, clan, currency, usedPrefix = '.') {
  const topDonor = topDonorKey(clan)
  const topLine = topDonor
    ? `${mentionTag(topDonor)} (${formatMoney(clan.members[topDonor]?.donated || 0, currency)})`
    : 'Sin donaciones'

  return (
    `╭━━━〔 🛡️ ${clan.name} 〕━━━╮\n` +
    `┃ ID: ${clan.id}\n` +
    `┃ Lider: ${mentionTag(clan.leader)}\n` +
    `┃ Nivel: ${clan.level}\n` +
    `┃ Miembros: ${memberCount(clan)}/${clan.maxMembers}\n` +
    `┃ Banco: ${formatMoney(clan.bank, currency)}\n` +
    `┃ Donado total: ${formatMoney(clan.totalDonated, currency)}\n` +
    `┃ Puntos: ${formatNumber(clan.points)}\n` +
    `┃ Decoracion: ${DECORATIONS[clan.decoration]?.name || 'Base'}\n` +
    `┃ Donador top: ${topLine}\n` +
    `┃ War: ${clan.warStats?.wins || 0}W / ${clan.warStats?.losses || 0}L / ${clan.warStats?.draws || 0}D\n` +
    `┃\n` +
    `┃ Descripcion:\n` +
    `┃ ${clan.description || 'Sin descripcion.'}\n` +
    `┃\n` +
    `┃ Ver miembros: ${usedPrefix}clanmiembros\n` +
    `┃ Ver misiones: ${usedPrefix}clanmisiones\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  )
}

function buildTopText(groupData, currency) {
  const clans = getClanList(groupData)
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0)
      return (b.totalDonated || 0) - (a.totalDonated || 0)
    })
    .slice(0, 10)

  if (!clans.length) {
    return '📭 No hay clanes en este grupo todavia.'
  }

  let text = `╭━━━〔 🏆 TOP CLANES 〕━━━╮\n`
  clans.forEach((clan, index) => {
    text +=
      `┃ ${index + 1}. ${clan.name}\n` +
      `┃ Nivel ${clan.level} • ${memberCount(clan)} miembros • ${formatMoney(clan.bank, currency)}\n` +
      `┃ Puntos: ${formatNumber(clan.points || 0)} • Donado: ${formatMoney(clan.totalDonated || 0, currency)}\n`
  })
  text += `╰━━━━━━━━━━━━━━━━━━━━╯`
  return text
}

function getMissionStats(clan) {
  const week = getWeekKey()
  clan.missionStats ||= {}
  clan.missionStats[week] ||= {
    donated: 0,
    warAttacks: 0
  }
  return { week, stats: clan.missionStats[week] }
}

function getMemberWeekStats(chatId, jid) {
  const stats = global.db.data.stats?.[chatId] || {}
  const foundKey = Object.keys(stats).find(key => sameUserIdentity(key, jid))
  const userStats = stats[foundKey] || {}
  const now = Date.now()
  let msgs = 0
  let cmds = 0

  for (const [date, data] of Object.entries(userStats)) {
    const time = new Date(`${date}T00:00:00-05:00`).getTime()
    if (!Number.isFinite(time) || now - time > 7 * 24 * 60 * 60 * 1000) continue
    msgs += Number(data.msgs || 0)
    cmds += Number(data.cmds || 0)
  }

  return { msgs, cmds }
}

function getMissionProgress(chatId, clan) {
  const { week, stats } = getMissionStats(clan)
  const donationTarget = Math.max(3000000, clan.level * 5000000)
  const attackTarget = Math.max(5, clan.level * 4)
  const activeTarget = Math.min(Math.max(2, Math.ceil(memberCount(clan) * 0.4)), memberCount(clan))
  const recruitedTarget = memberCount(clan) >= clan.maxMembers ? 0 : 1

  let activeMembers = 0
  let recruited = 0
  const weekStart = new Date(`${week}T00:00:00-05:00`).getTime()

  for (const [jid, member] of Object.entries(clan.members || {})) {
    const activity = getMemberWeekStats(chatId, jid)
    if (activity.cmds >= 3 || activity.msgs >= 25) activeMembers += 1
    if (Number(member.joinedAt || 0) >= weekStart && !isClanLeader(clan, jid)) recruited += 1
  }

  const missions = [
    {
      id: 'donate',
      name: 'Tesoreria del clan',
      description: 'Donar dinero al banco del clan entre todos.',
      progress: Math.min(stats.donated || 0, donationTarget),
      target: donationTarget,
      unit: 'money'
    },
    {
      id: 'activity',
      name: 'Miembros activos',
      description: 'Miembros con 25 mensajes o 3 comandos esta semana.',
      progress: activeMembers,
      target: activeTarget,
      unit: 'count'
    },
    {
      id: 'war',
      name: 'Fuerza de guerra',
      description: 'Realizar ataques en clan war.',
      progress: Math.min(stats.warAttacks || 0, attackTarget),
      target: attackTarget,
      unit: 'count'
    }
  ]

  if (recruitedTarget > 0) {
    missions.push({
      id: 'recruit',
      name: 'Nuevo recluta',
      description: 'Invitar al menos un miembro nuevo esta semana.',
      progress: Math.min(recruited, recruitedTarget),
      target: recruitedTarget,
      unit: 'count'
    })
  }

  return { week, missions, complete: missions.every(item => item.progress >= item.target) }
}

function formatMissionValue(value, unit, currency) {
  return unit === 'money' ? formatMoney(value, currency) : formatNumber(value)
}

function buildMissionsText(chatId, clan, currency, usedPrefix = '.') {
  const progress = getMissionProgress(chatId, clan)
  let text =
    `╭━━━〔 🎯 MISIONES DE CLAN 〕━━━╮\n` +
    `┃ Clan: ${clan.name}\n` +
    `┃ Semana: ${progress.week}\n` +
    `┃ Premio: XP y puntos de clan, no coins.\n` +
    `┃\n`

  for (const mission of progress.missions) {
    text +=
      `┃ ${mission.progress >= mission.target ? '✅' : '⏳'} ${mission.name}\n` +
      `┃ ${mission.description}\n` +
      `┃ ${formatMissionValue(mission.progress, mission.unit, currency)} / ${formatMissionValue(mission.target, mission.unit, currency)}\n`
  }

  text +=
    `┃\n` +
    `┃ Reclamar: ${usedPrefix}clanmisiones reclamar\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  return text
}

function buildShopText(clan, currency, usedPrefix = '.') {
  let text =
    `╭━━━〔 🛒 TIENDA DEL CLAN 〕━━━╮\n` +
    `┃ Banco: ${formatMoney(clan.bank, currency)}\n` +
    `┃ Decoracion activa: ${DECORATIONS[clan.decoration]?.name || 'Base'}\n` +
    `┃\n`

  for (const deco of Object.values(DECORATIONS)) {
    const owned = (clan.decorationsOwned || []).includes(deco.id)
    text +=
      `┃ ${owned ? '✅' : '💸'} ${deco.id} — ${deco.name}\n` +
      `┃ Costo: ${owned ? 'Comprado' : formatMoney(deco.cost, currency)}\n` +
      `┃ ${deco.description}\n`
  }

  text +=
    `┃\n` +
    `┃ Comprar/activar: ${usedPrefix}clancomprar <id>\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  return text
}

function getInvocation(command, args) {
  const cmd = String(command || 'clan').toLowerCase()
  if (cmd === 'clan') {
    const sub = SUBCOMMAND_ALIASES[String(args[0] || '').toLowerCase()] || 'menu'
    return { action: sub, rest: sub === 'menu' ? args : args.slice(1) }
  }

  if (cmd === 'setclan') {
    const sub = SUBCOMMAND_ALIASES[String(args[0] || '').toLowerCase()] || ''
    return { action: sub === 'banner' ? 'banner' : 'menu', rest: args.slice(1) }
  }

  return { action: COMMAND_ALIASES[cmd] || 'menu', rest: args }
}

function requireClan(groupData, userKey) {
  const found = findClanByUser(groupData, userKey)
  return found?.clan || null
}

function getMediaCandidate(m) {
  if (m.quoted) return m.quoted
  if (m.message?.imageMessage) return m
  return null
}

async function downloadImageFromMessage(client, m) {
  const source = getMediaCandidate(m)
  if (!source) return null

  const mime =
    source.mimetype ||
    source.mediaType ||
    source.msg?.mimetype ||
    source.message?.imageMessage?.mimetype ||
    ''

  if (!/image\/(png|jpe?g|webp)/i.test(mime)) return null

  if (typeof source.download === 'function') {
    return await source.download()
  }

  if (typeof client.downloadMediaMessage === 'function') {
    return await client.downloadMediaMessage(source)
  }

  return null
}

function warId() {
  return `war_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

function getPendingWarForClan(groupData, clanId) {
  const now = Date.now()
  for (const [id, pending] of Object.entries(groupData.pendingWars || {})) {
    if (now - Number(pending.createdAt || 0) > 12 * 60 * 60 * 1000) {
      delete groupData.pendingWars[id]
      continue
    }
    if (pending.targetClanId === clanId) return { id, pending }
  }
  return null
}

function formatTimeLeft(ms = 0) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function getWarMemberCounter(war, jid, type) {
  const day = getDayKey()
  war.memberCounters ||= {}
  const key = Object.keys(war.memberCounters).find(item => sameUserIdentity(item, jid)) || cleanId(jid)
  war.memberCounters[key] ||= {}
  war.memberCounters[key][type] ||= { day, count: 0 }
  if (war.memberCounters[key][type].day !== day) {
    war.memberCounters[key][type] = { day, count: 0 }
  }
  return war.memberCounters[key][type]
}

function buildWarStatus(groupData, currency) {
  const war = groupData.activeWar
  if (!war) return 'No hay clan war activa en este grupo.'

  const a = getClanById(groupData, war.clanA)
  const b = getClanById(groupData, war.clanB)
  const left = formatTimeLeft(Number(war.endsAt || 0) - Date.now())

  return (
    `╭━━━〔 ⚔️ CLAN WAR 〕━━━╮\n` +
    `┃ ${a?.name || war.clanA}: ${formatNumber(war.scores?.[war.clanA] || 0)} pts\n` +
    `┃ ${b?.name || war.clanB}: ${formatNumber(war.scores?.[war.clanB] || 0)} pts\n` +
    `┃ Tiempo restante: ${left}\n` +
    `┃ Pozo: ${formatMoney(war.pot || 0, currency)}\n` +
    `┃ Defensa ${a?.name || 'A'}: ${formatNumber(war.defense?.[war.clanA] || 0)}\n` +
    `┃ Defensa ${b?.name || 'B'}: ${formatNumber(war.defense?.[war.clanB] || 0)}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  )
}

function finishWar(groupData, currency) {
  const war = groupData.activeWar
  if (!war) return { finished: false, text: 'No hay guerra activa.' }
  if (Date.now() < Number(war.endsAt || 0)) {
    return { finished: false, text: `La guerra aun no termina. Falta ${formatTimeLeft(Number(war.endsAt || 0) - Date.now())}.` }
  }

  const clanA = getClanById(groupData, war.clanA)
  const clanB = getClanById(groupData, war.clanB)
  const scoreA = Number(war.scores?.[war.clanA] || 0)
  const scoreB = Number(war.scores?.[war.clanB] || 0)
  const burned = Math.floor(Number(war.pot || 0) * WAR_BURN_RATE)
  const distributable = Math.max(0, Number(war.pot || 0) - burned)

  let resultText = ''
  if (scoreA === scoreB) {
    const each = Math.floor(distributable / 2)
    if (clanA) {
      clanA.bank += each
      clanA.warStats.draws += 1
      clanA.points += 20
    }
    if (clanB) {
      clanB.bank += each
      clanB.warStats.draws += 1
      clanB.points += 20
    }
    resultText = `Empate. Cada clan recupera ${formatMoney(each, currency)}.`
  } else {
    const winner = scoreA > scoreB ? clanA : clanB
    const loser = scoreA > scoreB ? clanB : clanA
    if (winner) {
      winner.bank += distributable
      winner.warStats.wins += 1
      winner.warStats.points += 1
      winner.points += 80
    }
    if (loser) {
      loser.warStats.losses += 1
      loser.points += 20
    }
    resultText = `Ganador: ${winner?.name || 'Clan desconocido'} recibe ${formatMoney(distributable, currency)}.`
  }

  const text =
    `╭━━━〔 🏁 CLAN WAR FINALIZADA 〕━━━╮\n` +
    `┃ ${clanA?.name || war.clanA}: ${formatNumber(scoreA)} pts\n` +
    `┃ ${clanB?.name || war.clanB}: ${formatNumber(scoreB)} pts\n` +
    `┃ ${resultText}\n` +
    `┃ Quemado anti-inflacion: ${formatMoney(burned, currency)}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`

  groupData.activeWar = null
  return { finished: true, text }
}

async function handleCreate(client, m, rest, usedPrefix, currency, groupData, senderKey, senderUser) {
  const name = normalizeClanName(rest.join(' '))
  if (!name || name.length < 3) {
    return m.reply(`❌ Uso correcto:\n${usedPrefix}crearclan <nombre>\n\nEjemplo:\n${usedPrefix}crearclan Ruby Shadow`)
  }

  if (findClanByUser(groupData, senderKey)) {
    return m.reply('❌ Ya perteneces a un clan. Sal primero de tu clan actual.')
  }

  const duplicated = getClanList(groupData).some(clan => normalizeText(clan.name) === normalizeText(name))
  if (duplicated) {
    return m.reply('❌ Ya existe un clan con ese nombre en este grupo.')
  }

  senderUser.bank = Number(senderUser.bank || 0)
  if (!m.isOwner && senderUser.bank < CREATE_CLAN_COST) {
    return m.reply(
      `💸 No tienes suficiente dinero en el banco para crear un clan.\n` +
      `Costo: ${formatMoney(CREATE_CLAN_COST, currency)}\n` +
      `Tu banco: ${formatMoney(senderUser.bank, currency)}`
    )
  }

  const id = makeClanId(groupData, name)
  const now = Date.now()
  const clan = ensureClanDefaults({
    id,
    chatId: m.chat,
    name,
    description: 'Un nuevo clan ha nacido en RubyJX.',
    leader: senderKey,
    admins: [],
    members: {
      [senderKey]: {
        role: 'leader',
        joinedAt: now,
        donated: 0
      }
    },
    bank: 0,
    totalDonated: 0,
    level: 1,
    xp: 0,
    points: 0,
    maxMembers: BASE_MEMBER_LIMIT,
    createdAt: now,
    decorationsOwned: ['basic'],
    decoration: 'basic',
    banner: {
      freeCustomUsed: false
    }
  })

  await generateDefaultBanner(clan)
  if (!m.isOwner) senderUser.bank -= CREATE_CLAN_COST
  groupData.clans[id] = clan
  senderUser.clanId = id
  pushClanLog(clan, `${mentionTag(senderKey)} creo el clan.`)
  saveDB()

  const buffer = await sharp(await ensureClanBanner(clan)).jpeg().toBuffer()
  return client.sendMessage(m.chat, {
    image: buffer,
    caption:
      `✅ CLAN CREADO\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Clan: *${clan.name}*\n` +
      `Lider: ${mentionTag(senderKey)}\n` +
      `Costo quemado: ${formatMoney(CREATE_CLAN_COST, currency)}\n` +
      `Banner inicial: generado automaticamente.\n\n` +
      `Tu primer cambio personalizado con ${usedPrefix}setclan banner sera gratis.`,
    mentions: [senderKey]
  }, { quoted: m })
}

async function handleBanner(client, m, currency, groupData, senderKey) {
  const found = findClanByUser(groupData, senderKey)
  const clan = found?.clan
  if (!clan) return m.reply('❌ No perteneces a ningun clan.')
  if (!isClanLeader(clan, senderKey)) return m.reply('❌ Solo el creador/lider del clan puede cambiar el banner.')

  const image = await downloadImageFromMessage(client, m)
  if (!image) {
    return m.reply('❌ Responde a una imagen o envia una imagen con el comando en el caption:\n.setclan banner')
  }

  const cost = clan.banner?.freeCustomUsed ? CUSTOM_BANNER_COST : 0
  if (cost > 0 && clan.bank < cost) {
    return m.reply(
      `💸 El banco del clan no alcanza para cambiar el banner.\n` +
      `Costo: ${formatMoney(cost, currency)}\n` +
      `Banco del clan: ${formatMoney(clan.bank, currency)}`
    )
  }

  if (cost > 0) clan.bank -= cost
  await saveCustomBanner(clan, image)
  pushClanLog(clan, `${mentionTag(senderKey)} cambio el banner${cost > 0 ? ` por ${formatMoney(cost, currency)}` : ' gratis'}.`)
  saveDB()

  return m.reply(
    `✅ Banner del clan actualizado.\n` +
    `${cost > 0 ? `Costo pagado desde el banco del clan: ${formatMoney(cost, currency)}` : 'Este fue el primer cambio personalizado gratis.'}`
  )
}

async function handleList(client, m, rest, currency, groupData) {
  const page = Math.max(1, Math.floor(Number(rest[0] || 1)))
  const clans = getClanList(groupData)
  if (!clans.length) return m.reply('📭 No hay clanes en este grupo todavia.')

  const rendered = await renderClanGallery(m.chat, groupData, page, currency)
  return client.sendMessage(m.chat, {
    image: rendered.buffer,
    caption:
      `🛡️ Clanes del grupo\n` +
      `Pagina: ${rendered.currentPage}/${rendered.totalPages}\n` +
      `Total de clanes: ${rendered.count}\n` +
      `Orden estable por dia.`
  }, { quoted: m })
}

async function handleWar(client, m, rest, usedPrefix, currency, groupData, senderKey) {
  const sub = String(rest[0] || 'menu').toLowerCase()
  const found = findClanByUser(groupData, senderKey)
  const clan = found?.clan

  if (groupData.activeWar && Date.now() >= Number(groupData.activeWar.endsAt || 0) && ['estado', 'status', 'finalizar'].includes(sub)) {
    const result = finishWar(groupData, currency)
    saveDB()
    return m.reply(result.text)
  }

  if (!clan && !['estado', 'status', 'menu', 'help'].includes(sub)) return m.reply('❌ Necesitas estar en un clan para usar clan war.')

  if (!sub || ['menu', 'help'].includes(sub)) {
    return m.reply(
      `╭━━━〔 ⚔️ CLAN WAR 〕━━━╮\n` +
      `┃ ${usedPrefix}clanwar declarar <clan>\n` +
      `┃ ${usedPrefix}clanwar aceptar\n` +
      `┃ ${usedPrefix}clanwar atacar\n` +
      `┃ ${usedPrefix}clanwar defender\n` +
      `┃ ${usedPrefix}clanwar estado\n` +
      `┃ ${usedPrefix}clanwar finalizar\n` +
      `┃\n` +
      `┃ Entrada: ${formatMoney(WAR_ENTRY_COST, currency)} por clan\n` +
      `┃ Duracion: 24 horas\n` +
      `┃ Se quema el ${Math.round(WAR_BURN_RATE * 100)}% del pozo.\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  if (['estado', 'status'].includes(sub)) {
    return m.reply(buildWarStatus(groupData, currency))
  }

  if (sub === 'declarar' || sub === 'desafiar') {
    if (!isClanAdmin(clan, senderKey)) return m.reply('❌ Solo lider/admin puede declarar guerra.')
    if (groupData.activeWar) return m.reply('❌ Ya hay una clan war activa en este grupo.')

    const target = getClanByNameOrId(groupData, rest.slice(1).join(' '))
    if (!target) return m.reply(`❌ Indica un clan valido.\nEjemplo: ${usedPrefix}clanwar declarar Shadow`)
    if (target.id === clan.id) return m.reply('❌ No puedes declarar guerra contra tu propio clan.')

    const id = warId()
    groupData.pendingWars[id] = {
      id,
      challengerClanId: clan.id,
      targetClanId: target.id,
      createdBy: senderKey,
      createdAt: Date.now(),
      entryCost: WAR_ENTRY_COST
    }
    saveDB()

    return m.reply(
      `⚔️ DESAFIO ENVIADO\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${clan.name} desafio a ${target.name}.\n` +
      `Un lider/admin de ${target.name} debe usar:\n` +
      `${usedPrefix}clanwar aceptar\n\n` +
      `Costo por clan: ${formatMoney(WAR_ENTRY_COST, currency)} desde el banco del clan.`
    )
  }

  if (sub === 'aceptar') {
    if (!isClanAdmin(clan, senderKey)) return m.reply('❌ Solo lider/admin puede aceptar guerra.')
    if (groupData.activeWar) return m.reply('❌ Ya hay una clan war activa.')

    const pendingData = getPendingWarForClan(groupData, clan.id)
    if (!pendingData) return m.reply('❌ Tu clan no tiene desafios pendientes.')

    const challenger = getClanById(groupData, pendingData.pending.challengerClanId)
    if (!challenger) {
      delete groupData.pendingWars[pendingData.id]
      saveDB()
      return m.reply('❌ El clan retador ya no existe.')
    }

    if (challenger.bank < WAR_ENTRY_COST || clan.bank < WAR_ENTRY_COST) {
      return m.reply(
        `💸 Ambos clanes necesitan ${formatMoney(WAR_ENTRY_COST, currency)} en su banco.\n` +
        `${challenger.name}: ${formatMoney(challenger.bank, currency)}\n` +
        `${clan.name}: ${formatMoney(clan.bank, currency)}`
      )
    }

    challenger.bank -= WAR_ENTRY_COST
    clan.bank -= WAR_ENTRY_COST
    groupData.activeWar = {
      id: pendingData.id,
      clanA: challenger.id,
      clanB: clan.id,
      startedAt: Date.now(),
      endsAt: Date.now() + WAR_DURATION_MS,
      pot: WAR_ENTRY_COST * 2,
      scores: {
        [challenger.id]: 0,
        [clan.id]: 0
      },
      defense: {
        [challenger.id]: 0,
        [clan.id]: 0
      },
      memberCounters: {}
    }
    delete groupData.pendingWars[pendingData.id]
    pushClanLog(challenger, `Clan war iniciada contra ${clan.name}.`)
    pushClanLog(clan, `Clan war aceptada contra ${challenger.name}.`)
    saveDB()

    return m.reply(
      `⚔️ CLAN WAR INICIADA\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${challenger.name} vs ${clan.name}\n` +
      `Duracion: 24 horas\n` +
      `Pozo: ${formatMoney(WAR_ENTRY_COST * 2, currency)}\n\n` +
      `Atacar: ${usedPrefix}clanwar atacar\n` +
      `Defender: ${usedPrefix}clanwar defender`
    )
  }

  if (sub === 'atacar') {
    const war = groupData.activeWar
    if (!war) return m.reply('❌ No hay clan war activa.')
    if (![war.clanA, war.clanB].includes(clan.id)) return m.reply('❌ Tu clan no participa en esta guerra.')

    const counter = getWarMemberCounter(war, senderKey, 'attacks')
    if (counter.count >= 3) return m.reply('⏳ Ya usaste tus 3 ataques de hoy.')

    const enemyId = clan.id === war.clanA ? war.clanB : war.clanA
    const enemy = getClanById(groupData, enemyId)
    const random = seededRandom(`${war.id}:${senderKey}:${Date.now()}`)
    const roleBonus = isClanLeader(clan, senderKey) ? 12 : isClanAdmin(clan, senderKey) ? 7 : 0
    const power = Math.floor(35 + clan.level * 6 + roleBonus + random() * 70)
    const defense = Math.max(0, Number(war.defense?.[enemyId] || 0))
    const win = power >= Math.max(25, defense)
    const points = win ? Math.floor(28 + random() * 24) : Math.floor(8 + random() * 14)

    war.scores[clan.id] = Number(war.scores[clan.id] || 0) + points
    war.defense[enemyId] = Math.max(0, defense - Math.floor(10 + random() * 14))
    counter.count += 1

    const { stats } = getMissionStats(clan)
    stats.warAttacks = Number(stats.warAttacks || 0) + 1
    pushClanLog(clan, `${mentionTag(senderKey)} ataco en war y sumo ${points} puntos.`)
    saveDB()

    return client.reply(
      m.chat,
      `⚔️ ATAQUE DE CLAN\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Atacante: ${mentionTag(senderKey)}\n` +
      `Objetivo: ${enemy?.name || 'Clan rival'}\n` +
      `Poder: ${power}\n` +
      `Defensa rival: ${defense}\n` +
      `Resultado: ${win ? 'Victoria' : 'Ataque resistido'}\n` +
      `Puntos ganados: ${points}\n` +
      `Ataques restantes hoy: ${3 - counter.count}`,
      m,
      { mentions: [senderKey] }
    )
  }

  if (sub === 'defender') {
    const war = groupData.activeWar
    if (!war) return m.reply('❌ No hay clan war activa.')
    if (![war.clanA, war.clanB].includes(clan.id)) return m.reply('❌ Tu clan no participa en esta guerra.')

    const counter = getWarMemberCounter(war, senderKey, 'defenses')
    if (counter.count >= 2) return m.reply('⏳ Ya usaste tus 2 defensas de hoy.')

    const random = seededRandom(`${war.id}:def:${senderKey}:${Date.now()}`)
    const gain = Math.floor(14 + clan.level * 2 + random() * 22)
    war.defense[clan.id] = Math.min(160, Number(war.defense?.[clan.id] || 0) + gain)
    counter.count += 1
    saveDB()

    return m.reply(
      `🛡️ DEFENSA REFORZADA\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Clan: ${clan.name}\n` +
      `Defensa agregada: ${gain}\n` +
      `Defensa actual: ${war.defense[clan.id]}\n` +
      `Defensas restantes hoy: ${2 - counter.count}`
    )
  }

  if (sub === 'finalizar') {
    const result = finishWar(groupData, currency)
    saveDB()
    return m.reply(result.text)
  }

  return m.reply(`❌ Subcomando invalido.\nUsa ${usedPrefix}clanwar`)
}

export default {
  command: [
    'clan',
    'crearclan',
    'clancrear',
    'claninfo',
    'clanperfil',
    'claninvitar',
    'clanaceptar',
    'clansalir',
    'clanmiembros',
    'clantop',
    'clanes',
    'clandonar',
    'clanbank',
    'clanbanco',
    'clanupgrade',
    'clanmejorar',
    'clantienda',
    'clancomprar',
    'clanexpulsar',
    'clanascender',
    'clandegradar',
    'clandesc',
    'clandescripcion',
    'clanbanner',
    'setclan',
    'clanrename',
    'clannombre',
    'clandisolver',
    'clanmisiones',
    'clanwar'
  ],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'clan') => {
    const currency = getBotCurrency(client)
    const chat = getChatData(m.chat)
    const groupData = chat.clans
    const { key: senderKey, user: senderUser } = await getSenderKey(client, m)
    const { action, rest } = getInvocation(command, args)
    const current = findClanByUser(groupData, senderKey)
    const ownClan = current?.clan ? ensureClanDefaults(current.clan) : null

    for (const clan of getClanList(groupData)) ensureClanDefaults(clan)

    if (action === 'menu') {
      return m.reply(buildClanMenu(usedPrefix, ownClan, currency))
    }

    if (action === 'create') {
      return handleCreate(client, m, rest, usedPrefix, currency, groupData, senderKey, senderUser)
    }

    if (action === 'list') {
      return handleList(client, m, rest, currency, groupData)
    }

    if (action === 'top') {
      return m.reply(buildTopText(groupData, currency))
    }

    if (action === 'accept') {
      const inviteKey = Object.keys(groupData.invites || {}).find(key => sameUserIdentity(key, senderKey))
      const invite = inviteKey ? groupData.invites[inviteKey] : null
      if (!invite || Date.now() > Number(invite.expiresAt || 0)) {
        if (inviteKey) delete groupData.invites[inviteKey]
        saveDB()
        return m.reply('❌ No tienes invitaciones de clan pendientes.')
      }

      if (findClanByUser(groupData, senderKey)) return m.reply('❌ Ya perteneces a un clan.')

      const clan = getClanById(groupData, invite.clanId)
      if (!clan) {
        delete groupData.invites[inviteKey]
        saveDB()
        return m.reply('❌ Ese clan ya no existe.')
      }

      if (memberCount(clan) >= clan.maxMembers) return m.reply('❌ El clan ya no tiene espacios disponibles.')

      clan.members[senderKey] = {
        role: 'member',
        joinedAt: Date.now(),
        donated: 0
      }
      senderUser.clanId = clan.id
      delete groupData.invites[inviteKey]
      pushClanLog(clan, `${mentionTag(senderKey)} entro al clan.`)
      saveDB()
      return m.reply(`✅ Entraste al clan *${clan.name}*.`)
    }

    if (action === 'info' || action === 'profile') {
      const requested = rest.join(' ')
      const clan = requested ? getClanByNameOrId(groupData, requested) : ownClan
      if (!clan) return m.reply('❌ No encontre ese clan o no perteneces a ninguno.')

      const caption = buildClanInfo(m.chat, clan, currency, usedPrefix)
      if (action === 'profile') {
        const buffer = await sharp(await ensureClanBanner(clan)).jpeg().toBuffer()
        return client.sendMessage(m.chat, { image: buffer, caption, mentions: [clan.leader] }, { quoted: m })
      }
      return m.reply(caption)
    }

    if (!ownClan && !['war'].includes(action)) {
      return m.reply(`❌ Necesitas pertenecer a un clan.\nCrea uno con ${usedPrefix}crearclan <nombre> o acepta una invitacion.`)
    }

    if (action === 'members') {
      return client.reply(m.chat, buildMembersText(m.chat, ownClan, currency), m, {
        mentions: Object.keys(ownClan.members || {})
      })
    }

    if (action === 'invite') {
      if (!isClanAdmin(ownClan, senderKey)) return m.reply('❌ Solo lider/admin puede invitar.')
      const target = await getTargetKey(client, m)
      if (!target) return m.reply(`❌ Menciona a un usuario.\nEjemplo: ${usedPrefix}claninvitar @user`)
      if (findClanByUser(groupData, target.key)) return m.reply('❌ Ese usuario ya pertenece a un clan.')
      if (memberCount(ownClan) >= ownClan.maxMembers) return m.reply('❌ Tu clan no tiene espacios libres.')

      groupData.invites[target.key] = {
        clanId: ownClan.id,
        invitedBy: senderKey,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      }
      saveDB()
      return client.reply(
        m.chat,
        `📨 Invitacion enviada a ${mentionTag(target.key)}.\nDebe usar ${usedPrefix}clanaceptar en menos de 24 horas.`,
        m,
        { mentions: [target.key] }
      )
    }

    if (action === 'leave') {
      if (isClanLeader(ownClan, senderKey) && memberCount(ownClan) > 1) {
        return m.reply('❌ Eres lider. Primero expulsa miembros o disuelve el clan.')
      }

      if (isClanLeader(ownClan, senderKey)) {
        delete groupData.clans[ownClan.id]
        senderUser.clanId = ''
        saveDB()
        return m.reply(`✅ Disolviste el clan *${ownClan.name}* al salir.`)
      }

      delete ownClan.members[current.memberKey]
      ownClan.admins = (ownClan.admins || []).filter(admin => !sameUserIdentity(admin, senderKey))
      senderUser.clanId = ''
      pushClanLog(ownClan, `${mentionTag(senderKey)} salio del clan.`)
      saveDB()
      return m.reply(`✅ Saliste del clan *${ownClan.name}*.`)
    }

    if (action === 'donate') {
      const amount = parseAmount(rest[0])
      if (!Number.isFinite(amount) || amount <= 0) return m.reply(`❌ Uso: ${usedPrefix}clandonar <cantidad>`)
      senderUser.bank = Number(senderUser.bank || 0)
      if (!m.isOwner && senderUser.bank < amount) {
        return m.reply(`💸 No tienes suficiente banco.\nTu banco: ${formatMoney(senderUser.bank, currency)}`)
      }

      if (!m.isOwner) senderUser.bank -= amount
      ownClan.bank += amount
      ownClan.totalDonated += amount
      ownClan.members[current.memberKey].donated = Number(ownClan.members[current.memberKey].donated || 0) + amount
      const { stats } = getMissionStats(ownClan)
      stats.donated = Number(stats.donated || 0) + amount
      pushClanLog(ownClan, `${mentionTag(senderKey)} dono ${formatMoney(amount, currency)}.`)
      saveDB()
      return m.reply(
        `✅ Donacion recibida.\n` +
        `Donaste: ${formatMoney(amount, currency)}\n` +
        `Banco del clan: ${formatMoney(ownClan.bank, currency)}`
      )
    }

    if (action === 'bank') {
      const logs = (ownClan.logs || []).slice(0, 8).map(log => `┃ ${log.text}`).join('\n') || '┃ Sin movimientos recientes.'
      return m.reply(
        `╭━━━〔 🏦 BANCO DEL CLAN 〕━━━╮\n` +
        `┃ Clan: ${ownClan.name}\n` +
        `┃ Disponible: ${formatMoney(ownClan.bank, currency)}\n` +
        `┃ Donado total: ${formatMoney(ownClan.totalDonated, currency)}\n` +
        `┃\n` +
        `${logs}\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`
      )
    }

    if (action === 'upgrade') {
      if (!isClanAdmin(ownClan, senderKey)) return m.reply('❌ Solo lider/admin puede mejorar el clan.')
      const cost = getUpgradeCost(ownClan)
      if (ownClan.bank < cost) {
        return m.reply(`💸 Banco insuficiente.\nCosto: ${formatMoney(cost, currency)}\nBanco: ${formatMoney(ownClan.bank, currency)}`)
      }

      ownClan.bank -= cost
      ownClan.level += 1
      ownClan.maxMembers += 5
      ownClan.points += 30
      pushClanLog(ownClan, `${mentionTag(senderKey)} subio el clan a nivel ${ownClan.level}.`)
      saveDB()
      return m.reply(
        `⬆️ CLAN MEJORADO\n` +
        `Nivel actual: ${ownClan.level}\n` +
        `Espacios: ${ownClan.maxMembers}\n` +
        `Costo quemado: ${formatMoney(cost, currency)}`
      )
    }

    if (action === 'shop') {
      return m.reply(buildShopText(ownClan, currency, usedPrefix))
    }

    if (action === 'buy') {
      if (!isClanAdmin(ownClan, senderKey)) return m.reply('❌ Solo lider/admin puede comprar decoraciones.')
      const deco = getDecoration(rest[0])
      if (!deco) return m.reply(`❌ Decoracion invalida.\nUsa ${usedPrefix}clantienda`)

      ownClan.decorationsOwned ||= ['basic']
      if (ownClan.decorationsOwned.includes(deco.id)) {
        ownClan.decoration = deco.id
        saveDB()
        return m.reply(`✅ Decoracion activa: ${deco.name}`)
      }

      if (ownClan.bank < deco.cost) {
        return m.reply(`💸 Banco insuficiente.\nCosto: ${formatMoney(deco.cost, currency)}\nBanco: ${formatMoney(ownClan.bank, currency)}`)
      }

      ownClan.bank -= deco.cost
      ownClan.decorationsOwned.push(deco.id)
      ownClan.decoration = deco.id
      pushClanLog(ownClan, `${mentionTag(senderKey)} compro decoracion ${deco.name}.`)
      saveDB()
      return m.reply(`✅ Decoracion comprada y activada: ${deco.name}\nCosto quemado: ${formatMoney(deco.cost, currency)}`)
    }

    if (action === 'banner') {
      return handleBanner(client, m, currency, groupData, senderKey)
    }

    if (action === 'description') {
      if (!isClanAdmin(ownClan, senderKey)) return m.reply('❌ Solo lider/admin puede cambiar la descripcion.')
      const desc = rest.join(' ').trim().slice(0, 180)
      if (!desc) return m.reply(`❌ Uso: ${usedPrefix}clandesc <descripcion>`)
      if (ownClan.bank < DESCRIPTION_COST) return m.reply(`💸 Banco insuficiente. Costo: ${formatMoney(DESCRIPTION_COST, currency)}`)
      ownClan.bank -= DESCRIPTION_COST
      ownClan.description = desc
      pushClanLog(ownClan, `${mentionTag(senderKey)} cambio la descripcion.`)
      saveDB()
      return m.reply(`✅ Descripcion actualizada.\nCosto quemado: ${formatMoney(DESCRIPTION_COST, currency)}`)
    }

    if (action === 'rename') {
      if (!isClanLeader(ownClan, senderKey)) return m.reply('❌ Solo el lider puede renombrar el clan.')
      const name = normalizeClanName(rest.join(' '))
      if (!name || name.length < 3) return m.reply(`❌ Uso: ${usedPrefix}clanrename <nuevo nombre>`)
      if (getClanList(groupData).some(clan => clan.id !== ownClan.id && normalizeText(clan.name) === normalizeText(name))) {
        return m.reply('❌ Ya existe otro clan con ese nombre.')
      }
      if (ownClan.bank < RENAME_COST) return m.reply(`💸 Banco insuficiente. Costo: ${formatMoney(RENAME_COST, currency)}`)
      const old = ownClan.name
      ownClan.bank -= RENAME_COST
      ownClan.name = name
      pushClanLog(ownClan, `${mentionTag(senderKey)} cambio el nombre de ${old} a ${name}.`)
      saveDB()
      return m.reply(`✅ Clan renombrado a *${name}*.\nCosto quemado: ${formatMoney(RENAME_COST, currency)}`)
    }

    if (action === 'kick' || action === 'promote' || action === 'demote') {
      if (!isClanAdmin(ownClan, senderKey)) return m.reply('❌ Solo lider/admin puede gestionar miembros.')
      const target = await getTargetKey(client, m)
      if (!target) return m.reply('❌ Menciona a un miembro.')
      const targetKey = findMemberKey(ownClan, target.key)
      if (!targetKey) return m.reply('❌ Ese usuario no esta en tu clan.')
      if (sameUserIdentity(targetKey, ownClan.leader)) return m.reply('❌ No puedes modificar al lider.')

      if (action === 'kick') {
        if (!isClanLeader(ownClan, senderKey) && isClanAdmin(ownClan, targetKey)) return m.reply('❌ Un admin no puede expulsar a otro admin.')
        delete ownClan.members[targetKey]
        ownClan.admins = (ownClan.admins || []).filter(admin => !sameUserIdentity(admin, targetKey))
        target.user.clanId = ''
        pushClanLog(ownClan, `${mentionTag(senderKey)} expulso a ${mentionTag(targetKey)}.`)
        saveDB()
        return client.reply(m.chat, `✅ ${mentionTag(targetKey)} fue expulsado del clan.`, m, { mentions: [targetKey] })
      }

      if (!isClanLeader(ownClan, senderKey)) return m.reply('❌ Solo el lider puede ascender o degradar admins.')

      if (action === 'promote') {
        if (!ownClan.admins.some(admin => sameUserIdentity(admin, targetKey))) ownClan.admins.push(targetKey)
        ownClan.members[targetKey].role = 'admin'
        saveDB()
        return client.reply(m.chat, `✅ ${mentionTag(targetKey)} ahora es ⚔️ Admin.`, m, { mentions: [targetKey] })
      }

      ownClan.admins = (ownClan.admins || []).filter(admin => !sameUserIdentity(admin, targetKey))
      ownClan.members[targetKey].role = 'member'
      saveDB()
      return client.reply(m.chat, `✅ ${mentionTag(targetKey)} ahora es 🧑 Miembro.`, m, { mentions: [targetKey] })
    }

    if (action === 'disband') {
      if (!isClanLeader(ownClan, senderKey)) return m.reply('❌ Solo el lider puede disolver el clan.')
      delete groupData.clans[ownClan.id]
      for (const key of Object.keys(chat.users || {})) {
        if (chat.users[key]?.clanId === ownClan.id) chat.users[key].clanId = ''
      }
      saveDB()
      return m.reply(`✅ Clan *${ownClan.name}* disuelto. El banco del clan no se devuelve para evitar abuso.`)
    }

    if (action === 'missions') {
      if (String(rest[0] || '').toLowerCase() === 'reclamar') {
        const progress = getMissionProgress(m.chat, ownClan)
        if (!progress.complete) return m.reply('⏳ Aun no completaron todas las misiones semanales.')
        ownClan.missionClaims ||= {}
        if (ownClan.missionClaims[progress.week]) return m.reply('✅ Las misiones de esta semana ya fueron reclamadas.')
        ownClan.missionClaims[progress.week] = true
        ownClan.xp += 300
        ownClan.points += 120
        pushClanLog(ownClan, 'Misiones semanales reclamadas.')
        saveDB()
        return m.reply('🎯 Misiones reclamadas: +300 XP de clan y +120 puntos. No se crearon coins.')
      }

      return m.reply(buildMissionsText(m.chat, ownClan, currency, usedPrefix))
    }

    if (action === 'war') {
      return handleWar(client, m, rest, usedPrefix, currency, groupData, senderKey)
    }

    return m.reply(buildClanMenu(usedPrefix, ownClan, currency))
  }
}
