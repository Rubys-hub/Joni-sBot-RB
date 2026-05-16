import fs from 'fs'

const DB_PATH = './core/database.json'
const BACKUP_DIR = './backups'
const EXPORT_DIR = './exports'

const now = new Date().toISOString().replace(/[:.]/g, '-')

const BACKUP_PATH = `./backups/database-before-archive-logs-${now}.json`
const ARCHIVE_PATH = `./exports/database-archived-heavy-logs-${now}.json`
const TEST_PATH = './core/database.no-logs-test.json'

const HEAVY_KEYS = [
  'userMessageLog',
  'messageLog'
]

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function sizeOf(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value ?? null), 'utf8')
  } catch {
    return 0
  }
}

function countChatUsers(db) {
  let total = 0

  for (const chat of Object.values(db.chats || {})) {
    total += chat?.users ? Object.keys(chat.users).length : 0
  }

  return total
}

function countMoneyUsers(db) {
  let withCoins = 0
  let withBank = 0

  for (const user of Object.values(db.users || {})) {
    if (user?.coins !== undefined) withCoins++
    if (user?.bank !== undefined) withBank++
  }

  for (const chat of Object.values(db.chats || {})) {
    for (const user of Object.values(chat?.users || {})) {
      if (user?.coins !== undefined) withCoins++
      if (user?.bank !== undefined) withBank++
    }
  }

  return { withCoins, withBank }
}

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true })

console.log('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮')
console.log('┃ ARCHIVADOR SEGURO DE LOGS')
console.log('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯')
console.log('')
console.log('Este script NO reemplaza tu database original.')
console.log('Solo crea una copia de prueba más liviana.')
console.log('')

if (!fs.existsSync(DB_PATH)) {
  console.log('❌ No existe:', DB_PATH)
  process.exit(1)
}

console.log('📖 Leyendo database...')
const raw = fs.readFileSync(DB_PATH, 'utf8')
const db = JSON.parse(raw)

const originalSize = Buffer.byteLength(raw, 'utf8')

console.log('📦 Tamaño original:', mb(originalSize))

console.log('💾 Creando backup exacto...')
fs.writeFileSync(BACKUP_PATH, raw)

const beforeStats = {
  usersGlobales: db.users ? Object.keys(db.users).length : 0,
  chats: db.chats ? Object.keys(db.chats).length : 0,
  chatUsers: countChatUsers(db),
  settings: db.settings ? Object.keys(db.settings).length : 0,
  characters: db.characters ? Object.keys(db.characters).length : 0,
  money: countMoneyUsers(db)
}

const archive = {
  createdAt: new Date().toISOString(),
  note: 'Logs pesados archivados desde core/database.json. No contiene limpieza de usuarios, coins, bank, exp ni perfiles.',
  removedKeys: HEAVY_KEYS,
  chats: {}
}

let removedBytes = 0
let chatsTouched = 0
let keysRemoved = 0

console.log('🧹 Archivando logs pesados en copia...')

for (const [chatId, chat] of Object.entries(db.chats || {})) {
  let touched = false

  for (const key of HEAVY_KEYS) {
    if (chat && chat[key] !== undefined) {
      archive.chats[chatId] ||= {}

      const fieldSize = sizeOf(chat[key])

      archive.chats[chatId][key] = chat[key]
      delete chat[key]

      removedBytes += fieldSize
      keysRemoved++
      touched = true
    }
  }

  if (touched) chatsTouched++
}

console.log('📦 Guardando archivo de logs archivados...')
fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive))

console.log('🧪 Guardando database de prueba sin logs pesados...')
fs.writeFileSync(TEST_PATH, JSON.stringify(db))

const testRaw = fs.readFileSync(TEST_PATH, 'utf8')
const testDb = JSON.parse(testRaw)
const testSize = Buffer.byteLength(testRaw, 'utf8')

const afterStats = {
  usersGlobales: testDb.users ? Object.keys(testDb.users).length : 0,
  chats: testDb.chats ? Object.keys(testDb.chats).length : 0,
  chatUsers: countChatUsers(testDb),
  settings: testDb.settings ? Object.keys(testDb.settings).length : 0,
  characters: testDb.characters ? Object.keys(testDb.characters).length : 0,
  money: countMoneyUsers(testDb)
}

console.log('')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('RESULTADO')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('✅ Backup exacto:', BACKUP_PATH)
console.log('✅ Logs archivados:', ARCHIVE_PATH)
console.log('✅ Database de prueba:', TEST_PATH)
console.log('')
console.log('📊 Tamaño original:', mb(originalSize))
console.log('📊 Tamaño prueba:', mb(testSize))
console.log('📉 Reducción aproximada:', mb(originalSize - testSize))
console.log('📦 Bytes archivados aprox:', mb(removedBytes))
console.log('')
console.log('🏠 Chats tocados:', chatsTouched)
console.log('🧩 Campos archivados:', keysRemoved)
console.log('')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('VERIFICACIÓN DE DATOS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Users globales antes:', beforeStats.usersGlobales)
console.log('Users globales después:', afterStats.usersGlobales)
console.log('Chats antes:', beforeStats.chats)
console.log('Chats después:', afterStats.chats)
console.log('Usuarios dentro de chats antes:', beforeStats.chatUsers)
console.log('Usuarios dentro de chats después:', afterStats.chatUsers)
console.log('Settings antes:', beforeStats.settings)
console.log('Settings después:', afterStats.settings)
console.log('Characters antes:', beforeStats.characters)
console.log('Characters después:', afterStats.characters)
console.log('Usuarios con coins antes:', beforeStats.money.withCoins)
console.log('Usuarios con coins después:', afterStats.money.withCoins)
console.log('Usuarios con bank antes:', beforeStats.money.withBank)
console.log('Usuarios con bank después:', afterStats.money.withBank)
console.log('')

if (
  beforeStats.usersGlobales !== afterStats.usersGlobales ||
  beforeStats.chats !== afterStats.chats ||
  beforeStats.chatUsers !== afterStats.chatUsers ||
  beforeStats.money.withCoins !== afterStats.money.withCoins ||
  beforeStats.money.withBank !== afterStats.money.withBank
) {
  console.log('⚠️ ADVERTENCIA: algo no coincide. NO reemplaces la database todavía.')
} else {
  console.log('✅ Verificación correcta: no se perdieron usuarios, chats, coins ni bank.')
  console.log('✅ Puedes revisar y luego reemplazar manualmente si todo está bien.')
}

console.log('')
console.log('IMPORTANTE:')
console.log('Aún NO se reemplazó core/database.json.')
console.log('Primero revisa el resultado.')