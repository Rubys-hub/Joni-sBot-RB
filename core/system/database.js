import fs from 'fs'
import path from 'path'
import _ from 'lodash'

const DB_DIR = path.join(process.cwd(), 'core', 'database')

const FILES = {
  users: 'users.json',
  chats: 'chats.json',
  stats: 'stats.json',
  settings: 'settings.json',
  characters: 'characters.json',
  stickerspack: 'stickerspack.json',
  logs: 'logs.json'
}

const DEFAULT_DATA = {
  users: {},
  chats: {},
  stats: {},
  settings: {},
  characters: {},
  stickerspack: {},
  logs: {}
}

const PRETTY_DATABASE = true
const SAVE_INTERVAL_MS = 15000

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function ensureFile(filePath) {
  ensureDir(path.dirname(filePath))

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}', 'utf8')
  }
}

function readJson(fileName) {
  const filePath = path.join(DB_DIR, fileName)
  ensureFile(filePath)

  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim()
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (err) {
    console.error(`[DATABASE] Error leyendo ${fileName}:`, err.message)
    return {}
  }
}

function stringify(data) {
  return PRETTY_DATABASE
    ? JSON.stringify(data || {}, null, 2)
    : JSON.stringify(data || {})
}

function writeJsonAtomic(fileName, data) {
  ensureDir(DB_DIR)

  const filePath = path.join(DB_DIR, fileName)
  const tempPath = `${filePath}.tmp`

  try {
    fs.writeFileSync(tempPath, stringify(data), 'utf8')
    fs.renameSync(tempPath, filePath)
  } catch (err) {
    console.error(`[DATABASE] Error guardando ${fileName}:`, err.message)

    try {
      if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true })
    } catch {}
  }
}

function serializeAllData() {
  try {
    return JSON.stringify(global.db.data || {})
  } catch {
    return '{}'
  }
}

global.db ||= {
  data: structuredClone(DEFAULT_DATA),
  chain: null,
  READ: false,
  _snapshot: '{}'
}

global.db.data ||= structuredClone(DEFAULT_DATA)

for (const key of Object.keys(DEFAULT_DATA)) {
  global.db.data[key] ||= {}
}

global.DATABASE = global.db

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return global.db.data

  global.db.READ = true
  ensureDir(DB_DIR)

  global.db.data = {
    users: readJson(FILES.users),
    chats: readJson(FILES.chats),
    stats: readJson(FILES.stats),
    settings: readJson(FILES.settings),
    characters: readJson(FILES.characters),
    stickerspack: readJson(FILES.stickerspack),
    logs: readJson(FILES.logs)
  }

  global.db.chain = _.chain(global.db.data)
  global.db.READ = false
  global.db._snapshot = serializeAllData()

  return global.db.data
}

global.saveDatabase = function saveDatabase(force = false) {
  if (!global.db?.data) return

  const currentSnapshot = serializeAllData()

  if (!force && global.db._snapshot === currentSnapshot) {
    return
  }

  const data = global.db.data

  writeJsonAtomic(FILES.users, data.users || {})
  writeJsonAtomic(FILES.chats, data.chats || {})
  writeJsonAtomic(FILES.stats, data.stats || {})
  writeJsonAtomic(FILES.settings, data.settings || {})
  writeJsonAtomic(FILES.characters, data.characters || {})
  writeJsonAtomic(FILES.stickerspack, data.stickerspack || {})
  writeJsonAtomic(FILES.logs, data.logs || {})

  global.db._snapshot = currentSnapshot
}

global.writeDatabase = global.saveDatabase

global.db.read = global.loadDatabase
global.db.load = global.loadDatabase
global.db.write = global.saveDatabase
global.db.save = global.saveDatabase

if (!global.__rubyjxSplitDatabaseAutosave) {
  global.__rubyjxSplitDatabaseAutosave = setInterval(() => {
    try {
      global.saveDatabase()
    } catch (err) {
      console.error('[DATABASE] Error en autosave:', err.message)
    }
  }, SAVE_INTERVAL_MS)
}

if (!global.__rubyjxSplitDatabaseExitSave) {
  global.__rubyjxSplitDatabaseExitSave = true

  process.once('beforeExit', () => {
    try {
      global.saveDatabase(true)
    } catch {}
  })

  process.once('SIGINT', () => {
    try {
      console.log('\n[DATABASE] Guardando database separada...')
      global.saveDatabase(true)
    } catch {}

    process.exit(0)
  })

  process.once('SIGTERM', () => {
    try {
      global.saveDatabase(true)
    } catch {}

    process.exit(0)
  })
}

export default global.db