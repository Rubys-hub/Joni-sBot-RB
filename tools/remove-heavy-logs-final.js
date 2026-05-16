import fs from 'fs'

const DB_PATH = './core/database.json'
const BACKUP_PATH = `./backups/database-before-remove-heavy-logs-final-${Date.now()}.json`

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

if (!fs.existsSync('./backups')) fs.mkdirSync('./backups', { recursive: true })

console.log('Leyendo database...')
const raw = fs.readFileSync(DB_PATH, 'utf8')
const db = JSON.parse(raw)

fs.writeFileSync(BACKUP_PATH, raw)

let chatsTouched = 0
let removedBytes = 0
let removedFields = 0

for (const [chatId, chat] of Object.entries(db.chats || {})) {
  let touched = false

  if (chat.messageLog !== undefined) {
    removedBytes += sizeOf(chat.messageLog)
    delete chat.messageLog
    removedFields++
    touched = true
  }

  if (chat.userMessageLog !== undefined) {
    removedBytes += sizeOf(chat.userMessageLog)
    delete chat.userMessageLog
    removedFields++
    touched = true
  }

  if (touched) chatsTouched++
}

fs.writeFileSync(DB_PATH, JSON.stringify(db))

console.log('✅ Limpieza final terminada.')
console.log('Backup:', BACKUP_PATH)
console.log('Chats tocados:', chatsTouched)
console.log('Campos eliminados:', removedFields)
console.log('Peso eliminado aprox:', mb(removedBytes))
console.log('Tamaño nuevo:', mb(Buffer.byteLength(fs.readFileSync(DB_PATH, 'utf8'), 'utf8')))
console.log('No se tocaron coins, bank, exp, users ni settings.')