import fs from 'fs'
import path from 'path'

const DB_PATH = './core/database.json'
const EXPORT_DIR = './exports'

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true })
}

const now = new Date()
  .toISOString()
  .replace(/[:.]/g, '-')

const REPORT_TXT = path.join(EXPORT_DIR, `deep-database-report-${now}.txt`)
const REPORT_JSON = path.join(EXPORT_DIR, `deep-database-report-${now}.json`)

const lines = []

function log(text = '') {
  console.log(text)
  lines.push(String(text))
}

function bytesOf(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value ?? null), 'utf8')
  } catch {
    return 0
  }
}

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`
}

function percent(part, total) {
  if (!total) return '0.00%'
  return `${((part / total) * 100).toFixed(2)}%`
}

function safeKeys(obj) {
  if (!obj || typeof obj !== 'object') return []
  return Object.keys(obj)
}

function safeNumber(value) {
  const n = Number(value || 0)
  if (!Number.isFinite(n)) return 0
  return n
}

function normalizeJid(jid = '') {
  return String(jid || '')
}

function normalizeNumber(jid = '') {
  return String(jid || '')
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')
}

function getChatName(chat = {}) {
  return (
    chat.name ||
    chat.subject ||
    chat.title ||
    chat.groupName ||
    chat.metadata?.subject ||
    ''
  )
}

function getUserName(user = {}, jid = '') {
  return (
    user.name ||
    user.pushname ||
    user.username ||
    user.nick ||
    user.nombre ||
    normalizeNumber(jid) ||
    jid
  )
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function getValueType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function scanObjectFields(obj = {}, prefix = '', map = new Map(), depth = 0, maxDepth = 4) {
  if (!obj || typeof obj !== 'object') return map
  if (depth > maxDepth) return map

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const size = bytesOf(value)
    const type = getValueType(value)

    if (!map.has(fullKey)) {
      map.set(fullKey, {
        key: fullKey,
        count: 0,
        totalSize: 0,
        maxSize: 0,
        types: {}
      })
    }

    const info = map.get(fullKey)
    info.count++
    info.totalSize += size
    info.maxSize = Math.max(info.maxSize, size)
    info.types[type] = (info.types[type] || 0) + 1

    if (isObject(value) || Array.isArray(value)) {
      scanObjectFields(value, fullKey, map, depth + 1, maxDepth)
    }
  }

  return map
}

function mapToSortedArray(map, limit = 50) {
  return [...map.values()]
    .sort((a, b) => b.totalSize - a.totalSize)
    .slice(0, limit)
}

function sortBySizeDesc(rows = []) {
  return rows.sort((a, b) => b.sizeBytes - a.sizeBytes)
}

function printTable(title, rows, formatter, limit = 20) {
  log('')
  log(title)
  log(''.padEnd(title.length, '─'))

  if (!rows.length) {
    log('Sin datos.')
    return
  }

  rows.slice(0, limit).forEach((row, index) => {
    log(formatter(row, index))
  })
}

function analyzeUser(user = {}, jid = '', chatId = '', chatName = '') {
  const sizeBytes = bytesOf(user)
  const keys = safeKeys(user)

  const coins = safeNumber(user.coins)
  const bank = safeNumber(user.bank)
  const exp = safeNumber(user.exp ?? user.xp)
  const level = safeNumber(user.level ?? user.lvl)

  const hasPasatiempo =
    user.pasatiempo !== undefined ||
    user.hobby !== undefined ||
    user.hobbies !== undefined

  const hasDescription =
    user.description !== undefined ||
    user.desc !== undefined ||
    user.descripcion !== undefined ||
    user.bio !== undefined

  const hasGenre =
    user.genre !== undefined ||
    user.genero !== undefined ||
    user.gender !== undefined

  const hasBirth =
    user.birth !== undefined ||
    user.birthday !== undefined ||
    user.cumple !== undefined ||
    user.cumpleanos !== undefined

  const hasPremium =
    Boolean(user.premium) ||
    Boolean(user.premiumTime) ||
    Boolean(user.premiumDate)

  const hasVip =
    Boolean(user.vip) ||
    Boolean(user.vipTime) ||
    Boolean(user.vipDate)

  const hasWarns =
    user.warn !== undefined ||
    user.warns !== undefined ||
    user.warning !== undefined

  const fieldSizes = keys
    .map(key => ({
      key,
      sizeBytes: bytesOf(user[key]),
      type: getValueType(user[key])
    }))
    .sort((a, b) => b.sizeBytes - a.sizeBytes)

  return {
    jid,
    number: normalizeNumber(jid),
    name: getUserName(user, jid),
    chatId,
    chatName,
    sizeBytes,
    sizeText: kb(sizeBytes),
    keysCount: keys.length,
    keys,
    coins,
    bank,
    totalMoney: coins + bank,
    exp,
    level,
    hasPasatiempo,
    hasDescription,
    hasGenre,
    hasBirth,
    hasPremium,
    hasVip,
    hasWarns,
    topFields: fieldSizes.slice(0, 15)
  }
}

function analyzeChat(chat = {}, chatId = '') {
  const sizeBytes = bytesOf(chat)
  const keys = safeKeys(chat)
  const users = chat.users || {}

  const chatName = getChatName(chat)
  const userRows = []

  let totalCoins = 0
  let totalBank = 0
  let totalExp = 0

  let usersWithCoins = 0
  let usersWithBank = 0
  let usersWithExp = 0
  let usersWithLevel = 0
  let usersWithPasatiempo = 0
  let usersWithDescription = 0
  let usersWithGenre = 0
  let usersWithBirth = 0
  let usersWithPremium = 0
  let usersWithVip = 0
  let usersWithWarns = 0

  const userFieldMap = new Map()

  for (const [jid, user] of Object.entries(users || {})) {
    const row = analyzeUser(user, jid, chatId, chatName)
    userRows.push(row)

    totalCoins += row.coins
    totalBank += row.bank
    totalExp += row.exp

    if (row.coins) usersWithCoins++
    if (row.bank) usersWithBank++
    if (row.exp) usersWithExp++
    if (row.level) usersWithLevel++
    if (row.hasPasatiempo) usersWithPasatiempo++
    if (row.hasDescription) usersWithDescription++
    if (row.hasGenre) usersWithGenre++
    if (row.hasBirth) usersWithBirth++
    if (row.hasPremium) usersWithPremium++
    if (row.hasVip) usersWithVip++
    if (row.hasWarns) usersWithWarns++

    scanObjectFields(user, '', userFieldMap, 0, 3)
  }

  const keySizes = keys
    .map(key => ({
      key,
      sizeBytes: bytesOf(chat[key]),
      type: getValueType(chat[key])
    }))
    .sort((a, b) => b.sizeBytes - a.sizeBytes)

  const heavyUsers = sortBySizeDesc(userRows).slice(0, 30)

  return {
    chatId,
    chatName,
    sizeBytes,
    sizeText: mb(sizeBytes),
    keysCount: keys.length,
    keys,
    usersCount: Object.keys(users || {}).length,
    totalCoins,
    totalBank,
    totalMoney: totalCoins + totalBank,
    totalExp,
    usersWithCoins,
    usersWithBank,
    usersWithExp,
    usersWithLevel,
    usersWithPasatiempo,
    usersWithDescription,
    usersWithGenre,
    usersWithBirth,
    usersWithPremium,
    usersWithVip,
    usersWithWarns,
    topKeysBySize: keySizes.slice(0, 25),
    topUsersBySize: heavyUsers,
    topUserFieldsByTotalSize: mapToSortedArray(userFieldMap, 40)
  }
}

function countDuplicateNumbers(userRows = []) {
  const byNumber = new Map()

  for (const user of userRows) {
    if (!user.number) continue

    if (!byNumber.has(user.number)) {
      byNumber.set(user.number, [])
    }

    byNumber.get(user.number).push({
      jid: user.jid,
      chatId: user.chatId,
      chatName: user.chatName,
      sizeBytes: user.sizeBytes,
      coins: user.coins,
      bank: user.bank,
      exp: user.exp,
      level: user.level
    })
  }

  return [...byNumber.entries()]
    .filter(([, rows]) => rows.length > 1)
    .map(([number, rows]) => ({
      number,
      count: rows.length,
      totalSizeBytes: rows.reduce((acc, row) => acc + row.sizeBytes, 0),
      totalCoins: rows.reduce((acc, row) => acc + safeNumber(row.coins), 0),
      totalBank: rows.reduce((acc, row) => acc + safeNumber(row.bank), 0),
      rows
    }))
    .sort((a, b) => b.totalSizeBytes - a.totalSizeBytes)
}

function formatFieldRow(row, index) {
  const typeText = Object.entries(row.types || {})
    .map(([type, count]) => `${type}:${count}`)
    .join(', ')

  return `${index + 1}. ${row.key} | total:${kb(row.totalSize)} | max:${kb(row.maxSize)} | count:${row.count} | types:${typeText}`
}

function main() {
  if (!fs.existsSync(DB_PATH)) {
    log(`❌ No existe: ${DB_PATH}`)
    process.exit(1)
  }

  log('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮')
  log('┃ ANALISIS PROFUNDO DE DATABASE RUBYJX')
  log('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯')
  log('')
  log('⚠️ MODO SEGURO: este script NO borra, NO edita y NO reemplaza nada.')
  log('')

  log(`📖 Leyendo: ${DB_PATH}`)
  const raw = fs.readFileSync(DB_PATH, 'utf8')
  const totalBytes = Buffer.byteLength(raw, 'utf8')

  log(`📦 Tamaño total: ${mb(totalBytes)}`)
  log('🔍 Parseando JSON...')
  const db = JSON.parse(raw)

  const report = {
    createdAt: new Date().toISOString(),
    dbPath: DB_PATH,
    totalBytes,
    totalText: mb(totalBytes),
    topLevel: [],
    chats: [],
    globalUsers: [],
    allChatUsers: [],
    duplicatesByNumber: [],
    globalUserFieldSizes: [],
    allChatUserFieldSizes: []
  }

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('1) SECCIONES PRINCIPALES')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  report.topLevel = safeKeys(db)
    .map(key => ({
      key,
      sizeBytes: bytesOf(db[key]),
      sizeText: mb(bytesOf(db[key])),
      percent: percent(bytesOf(db[key]), totalBytes),
      type: getValueType(db[key]),
      keysCount: isObject(db[key]) ? safeKeys(db[key]).length : 0
    }))
    .sort((a, b) => b.sizeBytes - a.sizeBytes)

  for (const row of report.topLevel) {
    log(`- ${row.key}: ${row.sizeText} | ${row.percent} | type:${row.type} | keys:${row.keysCount}`)
  }

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('2) CONTEOS GENERALES')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const usersCount = db.users ? safeKeys(db.users).length : 0
  const chatsCount = db.chats ? safeKeys(db.chats).length : 0
  const settingsCount = db.settings ? safeKeys(db.settings).length : 0
  const charactersCount = db.characters ? safeKeys(db.characters).length : 0
  const stickerPacksCount = db.stickerspack ? safeKeys(db.stickerspack).length : 0

  log(`users globales: ${usersCount}`)
  log(`chats: ${chatsCount}`)
  log(`settings: ${settingsCount}`)
  log(`characters: ${charactersCount}`)
  log(`stickerspack: ${stickerPacksCount}`)

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('3) ANALIZANDO USERS GLOBALES')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const globalUserFieldMap = new Map()

  for (const [jid, user] of Object.entries(db.users || {})) {
    const row = analyzeUser(user, jid, 'GLOBAL', 'GLOBAL')
    report.globalUsers.push(row)
    scanObjectFields(user, '', globalUserFieldMap, 0, 3)
  }

  report.globalUsers.sort((a, b) => b.sizeBytes - a.sizeBytes)
  report.globalUserFieldSizes = mapToSortedArray(globalUserFieldMap, 60)

  const globalCoins = report.globalUsers.reduce((acc, u) => acc + u.coins, 0)
  const globalBank = report.globalUsers.reduce((acc, u) => acc + u.bank, 0)
  const globalExp = report.globalUsers.reduce((acc, u) => acc + u.exp, 0)

  log(`Total users globales: ${report.globalUsers.length}`)
  log(`Total coins globales: ${globalCoins.toLocaleString('en-US')}`)
  log(`Total bank global: ${globalBank.toLocaleString('en-US')}`)
  log(`Total exp global: ${globalExp.toLocaleString('en-US')}`)

  printTable(
    'TOP 20 USERS GLOBALES MAS PESADOS',
    report.globalUsers,
    (u, i) => `${i + 1}. ${kb(u.sizeBytes)} | ${u.jid} | ${u.name} | coins:${u.coins.toLocaleString('en-US')} | bank:${u.bank.toLocaleString('en-US')} | exp:${u.exp.toLocaleString('en-US')} | keys:${u.keysCount}`,
    20
  )

  printTable(
    'TOP CAMPOS MAS PESADOS EN USERS GLOBALES',
    report.globalUserFieldSizes,
    formatFieldRow,
    30
  )

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('4) ANALIZANDO CHATS')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const allChatUserFieldMap = new Map()

  for (const [chatId, chat] of Object.entries(db.chats || {})) {
    const chatReport = analyzeChat(chat, chatId)
    report.chats.push(chatReport)

    for (const user of Object.values(chat?.users || {})) {
      scanObjectFields(user, '', allChatUserFieldMap, 0, 3)
    }

    for (const userRow of chatReport.topUsersBySize) {
      report.allChatUsers.push(userRow)
    }
  }

  report.chats.sort((a, b) => b.sizeBytes - a.sizeBytes)
  report.allChatUsers.sort((a, b) => b.sizeBytes - a.sizeBytes)
  report.allChatUserFieldSizes = mapToSortedArray(allChatUserFieldMap, 80)

  const chatsBytes = bytesOf(db.chats || {})
  const chatsUsersTotal = report.chats.reduce((acc, chat) => acc + chat.usersCount, 0)
  const chatsCoinsTotal = report.chats.reduce((acc, chat) => acc + chat.totalCoins, 0)
  const chatsBankTotal = report.chats.reduce((acc, chat) => acc + chat.totalBank, 0)
  const chatsExpTotal = report.chats.reduce((acc, chat) => acc + chat.totalExp, 0)

  log(`Tamaño total de chats: ${mb(chatsBytes)} | ${percent(chatsBytes, totalBytes)}`)
  log(`Chats registrados: ${report.chats.length}`)
  log(`Usuarios dentro de chats sumados: ${chatsUsersTotal}`)
  log(`Total coins dentro de chats: ${chatsCoinsTotal.toLocaleString('en-US')}`)
  log(`Total bank dentro de chats: ${chatsBankTotal.toLocaleString('en-US')}`)
  log(`Total exp dentro de chats: ${chatsExpTotal.toLocaleString('en-US')}`)

  printTable(
    'TOP 30 CHATS MAS PESADOS',
    report.chats,
    (c, i) => `${i + 1}. ${mb(c.sizeBytes)} | ${percent(c.sizeBytes, chatsBytes)} de chats | users:${c.usersCount} | ${c.chatId} | ${c.chatName}`,
    30
  )

  printTable(
    'TOP 30 CHATS CON MAS USUARIOS',
    [...report.chats].sort((a, b) => b.usersCount - a.usersCount),
    (c, i) => `${i + 1}. users:${c.usersCount} | ${mb(c.sizeBytes)} | ${c.chatId} | ${c.chatName}`,
    30
  )

  printTable(
    'TOP 30 CHATS CON MAS COINS + BANK',
    [...report.chats].sort((a, b) => b.totalMoney - a.totalMoney),
    (c, i) => `${i + 1}. total:${c.totalMoney.toLocaleString('en-US')} | coins:${c.totalCoins.toLocaleString('en-US')} | bank:${c.totalBank.toLocaleString('en-US')} | users:${c.usersCount} | ${c.chatId} | ${c.chatName}`,
    30
  )

  printTable(
    'TOP 30 CHATS CON MAS EXP',
    [...report.chats].sort((a, b) => b.totalExp - a.totalExp),
    (c, i) => `${i + 1}. exp:${c.totalExp.toLocaleString('en-US')} | users:${c.usersCount} | ${mb(c.sizeBytes)} | ${c.chatId} | ${c.chatName}`,
    30
  )

  printTable(
    'TOP CAMPOS MAS PESADOS EN USUARIOS DE CHATS',
    report.allChatUserFieldSizes,
    formatFieldRow,
    50
  )

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('5) DETALLE DE LOS 10 CHATS MAS PESADOS')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  for (const [index, chat] of report.chats.slice(0, 10).entries()) {
    log('')
    log(`CHAT #${index + 1}`)
    log(`ID: ${chat.chatId}`)
    log(`Nombre: ${chat.chatName}`)
    log(`Tamaño: ${mb(chat.sizeBytes)}`)
    log(`Usuarios: ${chat.usersCount}`)
    log(`Coins: ${chat.totalCoins.toLocaleString('en-US')}`)
    log(`Bank: ${chat.totalBank.toLocaleString('en-US')}`)
    log(`EXP: ${chat.totalExp.toLocaleString('en-US')}`)
    log(`Con pasatiempos: ${chat.usersWithPasatiempo}`)
    log(`Con descripción: ${chat.usersWithDescription}`)
    log(`Con género: ${chat.usersWithGenre}`)
    log(`Con cumpleaños: ${chat.usersWithBirth}`)
    log(`Premium: ${chat.usersWithPremium}`)
    log(`VIP: ${chat.usersWithVip}`)
    log(`Warns: ${chat.usersWithWarns}`)

    log('')
    log('Campos principales del chat por tamaño:')
    for (const field of chat.topKeysBySize.slice(0, 15)) {
      log(`- ${field.key}: ${kb(field.sizeBytes)} | type:${field.type}`)
    }

    log('')
    log('Campos de usuarios más pesados en este chat:')
    for (const field of chat.topUserFieldsByTotalSize.slice(0, 20)) {
      log(formatFieldRow(field, chat.topUserFieldsByTotalSize.indexOf(field)))
    }

    log('')
    log('Usuarios más pesados de este chat:')
    for (const [uIndex, user] of chat.topUsersBySize.slice(0, 15).entries()) {
      log(`${uIndex + 1}. ${kb(user.sizeBytes)} | ${user.jid} | ${user.name} | coins:${user.coins.toLocaleString('en-US')} | bank:${user.bank.toLocaleString('en-US')} | exp:${user.exp.toLocaleString('en-US')} | level:${user.level} | keys:${user.keysCount}`)
      log(`   topFields: ${user.topFields.slice(0, 8).map(f => `${f.key}:${kb(f.sizeBytes)}`).join(' | ')}`)
    }
  }

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('6) DUPLICADOS POSIBLES POR NUMERO')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const allUsersForDuplicateScan = []

  for (const user of report.globalUsers) {
    allUsersForDuplicateScan.push(user)
  }

  for (const chat of report.chats) {
    for (const user of chat.topUsersBySize) {
      allUsersForDuplicateScan.push(user)
    }
  }

  report.duplicatesByNumber = countDuplicateNumbers(allUsersForDuplicateScan)

  log(`Posibles números duplicados detectados en muestra pesada: ${report.duplicatesByNumber.length}`)

  for (const dup of report.duplicatesByNumber.slice(0, 30)) {
    log(`- ${dup.number} | registros:${dup.count} | tamaño:${kb(dup.totalSizeBytes)} | coins:${dup.totalCoins.toLocaleString('en-US')} | bank:${dup.totalBank.toLocaleString('en-US')}`)

    for (const row of dup.rows.slice(0, 6)) {
      log(`  • ${row.jid} | chat:${row.chatId} | size:${kb(row.sizeBytes)} | coins:${row.coins} | bank:${row.bank}`)
    }
  }

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('7) CONCLUSION TECNICA')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const topSection = report.topLevel[0]
  const topChat = report.chats[0]

  log(`Sección más pesada: ${topSection?.key || 'N/A'} con ${topSection?.sizeText || 'N/A'}`)
  log(`Chat más pesado: ${topChat?.chatId || 'N/A'} con ${topChat ? mb(topChat.sizeBytes) : 'N/A'} y ${topChat?.usersCount || 0} usuarios`)
  log('')
  log('Recomendación segura:')
  log('1. NO borrar database.json manualmente.')
  log('2. NO abrir database.json en VS Code.')
  log('3. Primero revisar este reporte.')
  log('4. Luego crear un archivador que mueva datos pesados a exports, sin perderlos.')
  log('5. Recién después crear una database limpia conservando coins, bank, exp, perfiles, pasatiempos, configs y gacha.')
  log('')
  log('✅ Este análisis NO modificó la base.')

  fs.writeFileSync(REPORT_TXT, lines.join('\n'), 'utf8')
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report), 'utf8')

  log('')
  log(`📄 Reporte TXT creado: ${REPORT_TXT}`)
  log(`📄 Reporte JSON creado: ${REPORT_JSON}`)
}

try {
  main()
} catch (e) {
  console.error('')
  console.error('❌ ERROR EN ANALISIS PROFUNDO:')
  console.error(e)
  process.exit(1)
}