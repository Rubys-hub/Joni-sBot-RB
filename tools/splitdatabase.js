import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)

function hasFlag(flag) {
  return args.includes(flag)
}

function readArg(name, fallback) {
  const idx = args.indexOf(name)
  if (idx === -1) return fallback
  return args[idx + 1] || fallback
}

const INPUT_FILE = path.resolve(readArg('--input', args[0] && !args[0].startsWith('--') ? args[0] : './database.json'))
const OUTPUT_DIR = path.resolve(readArg('--out', './core/database'))
const DRY_RUN = hasFlag('--dry-run')
const KEEP_YUKI_SETTINGS = hasFlag('--keep-yuki-settings')
const KEEP_CHAT_LOGS = hasFlag('--keep-chat-logs')
const ECONOMY_MODE = String(readArg('--economy', 'both')).toLowerCase()

const VALID_ECONOMY_MODES = new Set(['both', 'global', 'local'])

if (!VALID_ECONOMY_MODES.has(ECONOMY_MODE)) {
  console.error('\n[ERROR] Modo de economía inválido.')
  console.error('Usa: --economy both | global | local')
  process.exit(1)
}

const BRAND = {
  botName: 'RubyJX',
  fullName: 'RubyJX Bot',
  stickerAuthor: 'RubyJX Bot'
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function safeNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value ?? {}))
}

function deepMergeDefaults(defaults, source) {
  const out = deepClone(defaults)
  const src = isObject(source) ? source : {}

  for (const [key, value] of Object.entries(src)) {
    if (isObject(value) && isObject(out[key])) {
      out[key] = deepMergeDefaults(out[key], value)
    } else {
      out[key] = value
    }
  }

  return out
}

function ensureDir(dir) {
  if (!DRY_RUN) fs.mkdirSync(dir, { recursive: true })
}

function writeJson(filePath, data) {
  if (DRY_RUN) return
  fs.writeFileSync(filePath, JSON.stringify(data ?? {}, null, 2), 'utf8')
  JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeText(filePath, text) {
  if (DRY_RUN) return
  fs.writeFileSync(filePath, text, 'utf8')
}

function timestamp() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

function containsYuki(value = '') {
  const text = String(value || '').toLowerCase()
  return text.includes('yuki') || text.includes('ʏᴜᴋɪ') || text.includes('ყµҡ') || text.includes('ყuki')
}

function isUrlKey(key = '') {
  return ['link', 'banner', 'icon', 'url', 'api', 'endpoint'].includes(String(key).toLowerCase())
}

function sanitizeRubyBrand(value, key = '') {
  if (typeof value === 'string') {
    if (isUrlKey(key)) return value
    if (containsYuki(value)) {
      return value
        .replace(/yuki/gi, BRAND.botName)
        .replace(/ʏᴜᴋɪ/gi, BRAND.botName)
        .replace(/ყµҡเ/gi, BRAND.botName)
        .replace(/ყµҡ/gi, BRAND.botName)
        .replace(/ყuki/gi, BRAND.botName)
    }
    return value
  }

  if (Array.isArray(value)) return value.map(item => sanitizeRubyBrand(item, key))

  if (isObject(value)) {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = sanitizeRubyBrand(v, k)
    return out
  }

  return value
}

function isChatJid(jid = '') {
  return String(jid).endsWith('@g.us')
}

function globalUserDefaults(jid) {
  return {
    id: jid,
    name: 'Usuario',

    exp: 0,
    level: 0,
    usedcommands: 0,
    usedcmds: 0,
    minxp: 0,
    maxxp: 0,

    coins: 0,
    bank: 0,

    vip: false,
    vipType: '',
    vipExpire: 0,
    vipSince: 0,
    vipReason: '',

    banned: false,
    ban: false,
    isBanned: false,
    banReason: '',
    banDate: '',
    banChat: '',
    bannedBy: '',
    bannedByNumber: '',
    banWarnCount: 0,
    banFirstWarned: false,
    banLastWarn: '',
    banWarnEvery: 10,
    banInfo: {
      active: false,
      reason: '',
      date: '',
      chat: '',
      by: '',
      byNumber: '',
      attempts: 0,
      lastAttempt: '',
      warnEvery: 10
    },

    streak: 0,
    lastDailyGlobal: 0,
    weeklyStreak: 0,
    lastWeeklyGlobal: 0,
    monthlyStreak: 0,
    lastMonthlyGlobal: 0,

    pasatiempo: '',
    description: '',
    marry: '',
    genre: '',
    birth: '',
    favorite: '',
    claimMessage: '',

    Subs: 0,

    metadatos: null,
    metadatos2: null,

    mainJid: jid,
    jidAliases: [jid],

    firstSeen: 0,
    lastSeen: 0
  }
}

function chatUserDefaults(jid, name = 'Usuario') {
  return {
    id: jid,
    name,

    coins: 0,
    bank: 0,

    warns: 0,
    warnings: 0,

    afk: -1,
    afkReason: '',

    usedTime: null,
    lastCmd: 0,

    lastwork: 0,
    lastdaily: 0,
    lastcrime: 0,
    lastmine: 0,
    laststeal: 0,
    lastweekly: 0,
    lastmonthly: 0,
    lastRoll: 0,
    lastslut: 0,
    lastClaim: 0,
    lastadventure: 0,
    lasthunt: 0,
    lastfish: 0,
    lastdungeon: 0,
    lastppt: 0,
    lastApuesta: 0,
    lastinvoke: 0,

    health: 100,
    characters: [],
    favorite: ''
  }
}

function chatDefaults() {
  return {
    isBanned: false,

    welcome: false,
    goodbye: false,
    sWelcome: '',
    sGoodbye: '',

    nsfw: false,
    alerts: true,
    gacha: true,
    economy: true,
    adminonly: false,
    primaryBot: null,
    antilinks: false,
    rolls: {},

    autoAdmin: false,

    antiflood: false,
    floodSettings: {},
    antifloodConfig: {},
    antifloodUsers: {},

    mutedUsers: [],
    warnLimit: 3,
    expulsar: false,

    sales: {},
    antilinkWarnings: {},
    nsfwFilter: false,
    antisticker: false,
    badwords: [],
    antilinksoft: false,
    antiestado: false,
    antivideo: false,

    commandStats: {},
    users: {}
  }
}

function normalizeStats(rawStats) {
  const out = {}
  if (!isObject(rawStats)) return out

  for (const [date, data] of Object.entries(rawStats)) {
    if (!isObject(data)) continue
    out[date] = {
      msgs: safeNumber(data.msgs, 0),
      cmds: safeNumber(data.cmds, 0)
    }
  }

  return out
}

function collectChatUsersInfo(chats) {
  const info = {}

  for (const [chatId, chat] of Object.entries(chats || {})) {
    if (!isObject(chat?.users)) continue

    for (const [jid, user] of Object.entries(chat.users)) {
      if (!isObject(user)) continue

      info[jid] ||= {
        coins: 0,
        bank: 0,
        groups: 0,
        firstName: undefined,
        chatIds: []
      }

      info[jid].coins += safeNumber(user.coins, 0)
      info[jid].bank += safeNumber(user.bank, 0)
      info[jid].groups++
      if (!info[jid].firstName && typeof user.name !== 'undefined') info[jid].firstName = user.name
      info[jid].chatIds.push(chatId)
    }
  }

  return info
}

function normalizeUsers(originalUsers, chatUsersInfo) {
  const users = {}
  const rawUsers = isObject(originalUsers) ? originalUsers : {}
  const allUserJids = new Set([
    ...Object.keys(rawUsers),
    ...Object.keys(chatUsersInfo || {})
  ])

  for (const jid of allUserJids) {
    if (isChatJid(jid)) continue

    const raw = rawUsers[jid]
    const base = globalUserDefaults(jid)
    const merged = deepMergeDefaults(base, isObject(raw) ? raw : {})
    const local = chatUsersInfo[jid] || { coins: 0, bank: 0, groups: 0, firstName: undefined }

    merged.id = merged.id || jid
    merged.name = typeof merged.name !== 'undefined' ? merged.name : (local.firstName ?? 'Usuario')
    if (merged.name === null && local.firstName) merged.name = local.firstName

    merged.mainJid = merged.mainJid || jid
    merged.jidAliases = Array.isArray(merged.jidAliases) && merged.jidAliases.length
      ? [...new Set([jid, ...merged.jidAliases])]
      : [jid]

    merged.exp = safeNumber(merged.exp, 0)
    merged.level = safeNumber(merged.level, 0)
    merged.usedcommands = safeNumber(merged.usedcommands, 0)
    merged.usedcmds = safeNumber(merged.usedcmds, 0)
    merged.minxp = safeNumber(merged.minxp, 0)
    merged.maxxp = safeNumber(merged.maxxp, 0)

    const originalGlobalCoins = safeNumber(merged.coins, 0)
    const originalGlobalBank = safeNumber(merged.bank, 0)
    const localCoinsTotal = safeNumber(local.coins, 0)
    const localBankTotal = safeNumber(local.bank, 0)

    if (ECONOMY_MODE === 'both' || ECONOMY_MODE === 'global') {
      merged.coins = originalGlobalCoins + localCoinsTotal
      merged.bank = originalGlobalBank + localBankTotal
      merged.economy = {
        mode: ECONOMY_MODE,
        globalCoins: merged.coins,
        globalBank: merged.bank,
        localCoinsTotal,
        localBankTotal,
        localGroups: safeNumber(local.groups, 0)
      }
    } else {
      merged.coins = originalGlobalCoins
      merged.bank = originalGlobalBank
      merged.economy = {
        mode: ECONOMY_MODE,
        globalCoins: merged.coins,
        globalBank: merged.bank,
        localCoinsTotal,
        localBankTotal,
        localGroups: safeNumber(local.groups, 0)
      }
    }

    users[jid] = merged
  }

  return users
}

function normalizeChats(originalChats, globalUsers) {
  const chats = {}
  const stats = {}
  const logs = {}
  const rawChats = isObject(originalChats) ? originalChats : {}

  for (const [chatId, rawChat] of Object.entries(rawChats)) {
    const chat = deepMergeDefaults(chatDefaults(), isObject(rawChat) ? rawChat : {})
    const rawChatUsers = isObject(rawChat?.users) ? rawChat.users : {}
    chat.users = {}

    for (const [jid, rawUser] of Object.entries(rawChatUsers)) {
      const globalName = globalUsers[jid]?.name || rawUser?.name || 'Usuario'
      const cleanUser = deepMergeDefaults(chatUserDefaults(jid, globalName), isObject(rawUser) ? rawUser : {})

      cleanUser.id = cleanUser.id || jid
      cleanUser.name = cleanUser.name ?? globalName
      cleanUser.coins = safeNumber(cleanUser.coins, 0)
      cleanUser.bank = safeNumber(cleanUser.bank, 0)
      cleanUser.warns = safeNumber(cleanUser.warns, 0)
      cleanUser.warnings = safeNumber(cleanUser.warnings, 0)
      cleanUser.characters = Array.isArray(cleanUser.characters) ? cleanUser.characters : []

      const userStats = normalizeStats(cleanUser.stats)
      if (Object.keys(userStats).length) {
        stats[chatId] ||= {}
        stats[chatId][jid] = userStats
      }

      delete cleanUser.stats

      if (ECONOMY_MODE === 'global') {
        cleanUser.localCoinsBeforeGlobalMigration = cleanUser.coins
        cleanUser.localBankBeforeGlobalMigration = cleanUser.bank
        cleanUser.coins = 0
        cleanUser.bank = 0
      }

      chat.users[jid] = cleanUser
    }

    if (!KEEP_CHAT_LOGS) {
      const history = Array.isArray(chat.commandHistory) ? chat.commandHistory : []
      const botLogs = Array.isArray(chat.botLogs) ? chat.botLogs : []

      if (history.length || botLogs.length) {
        logs[chatId] = {
          commandHistory: history,
          botLogs
        }
      }

      delete chat.commandHistory
      delete chat.botLogs
    }

    chats[chatId] = chat
  }

  return { chats, stats, logs }
}

function normalizeSettings(originalSettings) {
  const settings = {}
  const removed = []
  const rawSettings = isObject(originalSettings) ? originalSettings : {}

  for (const [botJid, raw] of Object.entries(rawSettings)) {
    const rawMarker = [
      botJid,
      raw?.namebot,
      raw?.botname,
      raw?.nameid,
      raw?.currency,
      raw?.owner,
      raw?.link,
      raw?.banner,
      raw?.icon
    ].join(' ')

    const rawLooksYuki = containsYuki(rawMarker)
    const rawLooksRuby = String(rawMarker || '').toLowerCase().includes('rubyjx')

    if (!KEEP_YUKI_SETTINGS && rawLooksYuki && !rawLooksRuby) {
      removed.push(botJid)
      continue
    }

    const data = sanitizeRubyBrand(deepClone(raw))

    if (containsYuki(data.namebot)) data.namebot = BRAND.botName
    if (containsYuki(data.botname)) data.botname = BRAND.fullName
    if (containsYuki(data.nameid)) data.nameid = BRAND.fullName

    settings[botJid] = data
  }

  return { settings, removed }
}

function normalizeStickers(originalStickers) {
  const stickers = deepClone(originalStickers)

  for (const owner of Object.values(stickers || {})) {
    if (!isObject(owner) || !Array.isArray(owner.packs)) continue

    for (const pack of owner.packs) {
      if (!isObject(pack)) continue
      if (containsYuki(pack.author)) pack.author = BRAND.stickerAuthor
      if (containsYuki(pack.desc)) pack.desc = sanitizeRubyBrand(pack.desc)
    }
  }

  return stickers
}

function countStats(stats) {
  let users = 0
  let days = 0

  for (const chatStats of Object.values(stats || {})) {
    if (!isObject(chatStats)) continue
    for (const userStats of Object.values(chatStats)) {
      if (!isObject(userStats)) continue
      users++
      days += Object.keys(userStats).length
    }
  }

  return { users, days }
}

function countEconomy(users, chats) {
  let globalCoins = 0
  let globalBank = 0
  let localCoins = 0
  let localBank = 0
  let usersWithGlobalMoney = 0
  let usersWithLocalMoney = 0

  for (const user of Object.values(users || {})) {
    if (!isObject(user)) continue
    const c = safeNumber(user.coins, 0)
    const b = safeNumber(user.bank, 0)
    globalCoins += c
    globalBank += b
    if (c || b) usersWithGlobalMoney++
  }

  for (const chat of Object.values(chats || {})) {
    if (!isObject(chat?.users)) continue
    for (const user of Object.values(chat.users)) {
      if (!isObject(user)) continue
      const c = safeNumber(user.coins, 0)
      const b = safeNumber(user.bank, 0)
      localCoins += c
      localBank += b
      if (c || b) usersWithLocalMoney++
    }
  }

  return {
    globalCoins,
    globalBank,
    localCoins,
    localBank,
    usersWithGlobalMoney,
    usersWithLocalMoney
  }
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`\n[ERROR] No existe el archivo de entrada:\n${INPUT_FILE}\n`)
    process.exit(1)
  }

  console.log('\n╭──────────────────────────────────────╮')
  console.log('│ RubyJX Database Splitter Profesional │')
  console.log('╰──────────────────────────────────────╯')
  console.log(`[INPUT]  ${INPUT_FILE}`)
  console.log(`[OUTPUT] ${OUTPUT_DIR}`)
  console.log(`[ECONOMY] ${ECONOMY_MODE}`)

  const rawText = fs.readFileSync(INPUT_FILE, 'utf8')
  let db

  try {
    db = JSON.parse(rawText)
  } catch (err) {
    console.error('\n[ERROR] Tu database.json no es JSON válido.')
    console.error(err.message)
    process.exit(1)
  }

  const originalUsers = isObject(db.users) ? db.users : {}
  const originalChats = isObject(db.chats) ? db.chats : {}
  const originalSettings = isObject(db.settings) ? db.settings : {}
  const originalCharacters = isObject(db.characters) ? db.characters : {}
  const originalStickers = isObject(db.stickerspack) ? db.stickerspack : {}

  const chatUsersInfo = collectChatUsersInfo(originalChats)
  const users = normalizeUsers(originalUsers, chatUsersInfo)
  const { chats, stats, logs } = normalizeChats(originalChats, users)
  const { settings, removed: removedYukiSettings } = normalizeSettings(originalSettings)
  const characters = deepClone(originalCharacters)
  const stickerspack = normalizeStickers(originalStickers)

  const statsCount = countStats(stats)
  const economyCount = countEconomy(users, chats)
  const backupDir = path.join(OUTPUT_DIR, 'backups')
  const backupFile = path.join(backupDir, `database-original-${timestamp()}.json`)

  const report = [
    'RUBYJX DATABASE SPLIT REPORT',
    '============================',
    `Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}`,
    `Entrada: ${INPUT_FILE}`,
    `Salida: ${OUTPUT_DIR}`,
    '',
    'ARCHIVOS GENERADOS',
    '-----------------',
    `users.json: ${Object.keys(users).length} usuarios globales`,
    `chats.json: ${Object.keys(chats).length} chats/grupos`,
    `stats.json: ${Object.keys(stats).length} chats con stats, ${statsCount.users} usuarios con stats, ${statsCount.days} registros por fecha`,
    `settings.json: ${Object.keys(settings).length} configuraciones`,
    `characters.json: ${Object.keys(characters).length} personajes`,
    `stickerspack.json: ${Object.keys(stickerspack).length} dueños/registros`,
    `logs.json: ${Object.keys(logs).length} chats con historial/logs movidos`,
    '',
    'ECONOMÍA',
    '--------',
    `Modo: ${ECONOMY_MODE}`,
    'both  = users.json tiene economía global SUMADA y chats.json conserva economía local por grupo.',
    'global = users.json tiene economía global SUMADA y chats.json queda en 0, guardando copia local previa.',
    'local = users.json conserva solo lo global existente y chats.json conserva economía local por grupo.',
    `Total global users.coins: ${economyCount.globalCoins}`,
    `Total global users.bank: ${economyCount.globalBank}`,
    `Total local chats.users.coins: ${economyCount.localCoins}`,
    `Total local chats.users.bank: ${economyCount.localBank}`,
    `Usuarios con dinero global: ${economyCount.usersWithGlobalMoney}`,
    `Registros locales con dinero en grupos: ${economyCount.usersWithLocalMoney}`,
    '',
    'MODO Y LIMPIEZA',
    '--------------',
    `Historial commandHistory/botLogs conservado dentro de chats: ${KEEP_CHAT_LOGS ? 'SÍ' : 'NO'}`,
    `Settings Yuki conservados: ${KEEP_YUKI_SETTINGS ? 'SÍ' : 'NO'}`,
    `Settings Yuki eliminados: ${removedYukiSettings.length ? removedYukiSettings.join(', ') : 'ninguno'}`,
    '',
    'IMPORTANTE',
    '----------',
    'Este script NO modifica tu database original.',
    'Crea una copia backup y genera JSON separados para RubyJX.',
    'stats se mueve fuera de chats.users[*].stats hacia stats.json.',
    'En modo both, tu economía funciona GLOBAL y también POR GRUPO.',
    ''
  ].join('\n')

  if (!DRY_RUN) {
    ensureDir(OUTPUT_DIR)
    ensureDir(backupDir)
    fs.copyFileSync(INPUT_FILE, backupFile)

    writeJson(path.join(OUTPUT_DIR, 'users.json'), users)
    writeJson(path.join(OUTPUT_DIR, 'chats.json'), chats)
    writeJson(path.join(OUTPUT_DIR, 'stats.json'), stats)
    writeJson(path.join(OUTPUT_DIR, 'settings.json'), settings)
    writeJson(path.join(OUTPUT_DIR, 'characters.json'), characters)
    writeJson(path.join(OUTPUT_DIR, 'stickerspack.json'), stickerspack)
    writeJson(path.join(OUTPUT_DIR, 'logs.json'), logs)
    writeText(path.join(OUTPUT_DIR, 'README_REPORTE.txt'), report)
  }

  console.log('\n[OK] Separación terminada correctamente.')
  console.log(report)

  if (!DRY_RUN) {
    console.log(`[BACKUP] ${backupFile}`)
  } else {
    console.log('[DRY-RUN] No se escribió ningún archivo.')
  }
}

main()