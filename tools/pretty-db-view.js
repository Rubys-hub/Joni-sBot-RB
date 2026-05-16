import fs from 'fs'

const DB_PATH = './core/database.json'
const OUT_PATH = './exports/database-readable.json'

if (!fs.existsSync('./exports')) {
  fs.mkdirSync('./exports', { recursive: true })
}

function sortObject(value) {
  if (Array.isArray(value)) {
    return value.map(sortObject)
  }

  if (value && typeof value === 'object') {
    const sorted = {}

    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortObject(value[key])
    }

    return sorted
  }

  return value
}

console.log('📖 Leyendo database...')
const raw = fs.readFileSync(DB_PATH, 'utf8')
const db = JSON.parse(raw)

console.log('🧹 Ordenando keys...')
const ordered = sortObject(db)

console.log('📄 Creando copia legible...')
fs.writeFileSync(OUT_PATH, JSON.stringify(ordered, null, 2), 'utf8')

console.log('✅ Listo.')
console.log('📌 Database activa NO fue modificada.')
console.log('📄 Copia legible creada en:', OUT_PATH)