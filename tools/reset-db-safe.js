import fs from 'fs'

const DB_PATH = './core/database.json'
const REPORT_PATH = './exports/database-report.txt'

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function sizeOf(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value), 'utf8')
  } catch {
    return 0
  }
}

function safeKeys(obj) {
  return obj && typeof obj === 'object' ? Object.keys(obj) : []
}

const importantStats = {
  usersWithCoins: 0,
  totalCoins: 0,
  usersWithBank: 0,
  totalBank: 0,
  usersWithExp: 0,
  totalExp: 0,
  usersWithLevel: 0,
  usersWithPasatiempo: 0,
  usersWithDescription: 0,
  usersWithGenre: 0,
  usersWithBirth: 0,
  usersWithPremium: 0,
  usersWithVip: 0,
  usersWithWarns: 0
}

function scanUser(user = {}) {
  if (!user || typeof user !== 'object') return

  if (user.coins !== undefined) {
    importantStats.usersWithCoins++
    importantStats.totalCoins += Number(user.coins || 0)
  }

  if (user.bank !== undefined) {
    importantStats.usersWithBank++
    importantStats.totalBank += Number(user.bank || 0)
  }

  if (user.exp !== undefined) {
    importantStats.usersWithExp++
    importantStats.totalExp += Number(user.exp || 0)
  }

  if (user.level !== undefined) importantStats.usersWithLevel++
  if (user.pasatiempo !== undefined || user.hobby !== undefined) importantStats.usersWithPasatiempo++
  if (user.description !== undefined || user.desc !== undefined) importantStats.usersWithDescription++
  if (user.genre !== undefined || user.genero !== undefined) importantStats.usersWithGenre++
  if (user.birth !== undefined || user.birthday !== undefined) importantStats.usersWithBirth++
  if (user.premium || user.premiumTime) importantStats.usersWithPremium++
  if (user.vip || user.vipTime) importantStats.usersWithVip++
  if (user.warn || user.warns) importantStats.usersWithWarns++
}

if (!fs.existsSync(DB_PATH)) {
  console.log('❌ No existe:', DB_PATH)
  process.exit(1)
}

console.log('📖 Leyendo database sin modificar nada...')
const raw = fs.readFileSync(DB_PATH, 'utf8')
const db = JSON.parse(raw)

const lines = []

function log(text = '') {
  console.log(text)
  lines.push(text)
}

log('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮')
log('┃ REPORTE SEGURO DE DATABASE')
log('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯')
log('')
log(`📦 Tamaño total: ${mb(Buffer.byteLength(raw, 'utf8'))}`)
log(`🧩 Keys principales: ${safeKeys(db).join(', ')}`)
log('')

log('🔎 Tamaño por secciones principales:')
const topKeys = safeKeys(db)
  .map(key => ({
    key,
    size: sizeOf(db[key])
  }))
  .sort((a, b) => b.size - a.size)

for (const row of topKeys) {
  log(`- ${row.key}: ${mb(row.size)}`)
}

log('')
log('👥 Conteos generales:')
log(`- db.users: ${db.users ? safeKeys(db.users).length : 0}`)
log(`- db.chats: ${db.chats ? safeKeys(db.chats).length : 0}`)
log(`- db.settings: ${db.settings ? safeKeys(db.settings).length : 0}`)

log('')
log('🏠 Chats más pesados:')
const heavyChats = Object.entries(db.chats || {})
  .map(([jid, chat]) => ({
    jid,
    name: chat?.name || chat?.subject || '',
    size: sizeOf(chat),
    users: chat?.users ? safeKeys(chat.users).length : 0,
    keys: safeKeys(chat).join(', ')
  }))
  .sort((a, b) => b.size - a.size)
  .slice(0, 30)

for (const chat of heavyChats) {
  log(`- ${mb(chat.size)} | users:${chat.users} | ${chat.jid} | ${chat.name}`)
  log(`  keys: ${chat.keys}`)
}

log('')
log('🧍 Escaneando datos importantes de usuarios...')

for (const user of Object.values(db.users || {})) {
  scanUser(user)
}

for (const chat of Object.values(db.chats || {})) {
  for (const user of Object.values(chat?.users || {})) {
    scanUser(user)
  }
}

log('')
log('💾 Datos importantes detectados:')
log(`- Usuarios con coins: ${importantStats.usersWithCoins}`)
log(`- Total coins: ${importantStats.totalCoins.toLocaleString('en-US')}`)
log(`- Usuarios con bank: ${importantStats.usersWithBank}`)
log(`- Total bank: ${importantStats.totalBank.toLocaleString('en-US')}`)
log(`- Usuarios con exp: ${importantStats.usersWithExp}`)
log(`- Total exp: ${importantStats.totalExp.toLocaleString('en-US')}`)
log(`- Usuarios con level: ${importantStats.usersWithLevel}`)
log(`- Usuarios con pasatiempos: ${importantStats.usersWithPasatiempo}`)
log(`- Usuarios con descripción: ${importantStats.usersWithDescription}`)
log(`- Usuarios con género: ${importantStats.usersWithGenre}`)
log(`- Usuarios con cumpleaños: ${importantStats.usersWithBirth}`)
log(`- Usuarios premium: ${importantStats.usersWithPremium}`)
log(`- Usuarios VIP: ${importantStats.usersWithVip}`)
log(`- Usuarios con warns: ${importantStats.usersWithWarns}`)

log('')
log('✅ Este script NO borró nada.')
log('✅ Solo leyó la base y creó este reporte.')

fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8')

log('')
log(`📄 Reporte guardado en: ${REPORT_PATH}`)