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

const PRETTY_DATABASE = false
const SAVE_INTERVAL_MS = 15000
const WRITE_RETRY_DELAYS_MS = [50, 100, 250, 500, 1000, 1500]
const RETRYABLE_WRITE_ERRORS = new Set(['EPERM', 'EBUSY', 'EACCES'])

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

function waitSync(ms) {
  if (!ms) return
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function shouldRetryWrite(err = {}) {
  return RETRYABLE_WRITE_ERRORS.has(err.code)
}

function normalizeNumber(value = '') {
  return String(value || '')
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')
}

function cleanJid(value = '') {
  const text = String(value || '').trim()
  if (!text) return ''

  if (text.includes('@')) {
    const [left, server] = text.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = normalizeNumber(text)
  return number ? `${number}@s.whatsapp.net` : ''
}

function sanitizeBotEconomy(data = {}) {
  const botCandidates = Object.keys(data.settings || {})
    .filter(key => key.endsWith('@s.whatsapp.net'))

  const botNumbers = new Set(
    botCandidates
      .map(value => normalizeNumber(value))
      .filter(Boolean)
  )

  const botJids = new Set(
    botCandidates
      .map(value => cleanJid(value))
      .filter(Boolean)
  )

  if (!botNumbers.size && !botJids.size) return 0

  const isKnownBot = (jid = '') => {
    const clean = cleanJid(jid)
    const number = normalizeNumber(jid)
    return botJids.has(clean) || botNumbers.has(number)
  }

  const resetMoney = (user = {}) => {
    let touched = false

    if (Number(user.coins || 0) !== 0) {
      user.coins = 0
      touched = true
    }

    if (Number(user.bank || 0) !== 0) {
      user.bank = 0
      touched = true
    }

    if (user.economy && typeof user.economy === 'object') {
      for (const key of ['globalCoins', 'globalBank', 'localCoinsTotal', 'localBankTotal']) {
        if (Number(user.economy[key] || 0) !== 0) {
          user.economy[key] = 0
          touched = true
        }
      }
    }

    return touched
  }

  let cleaned = 0

  for (const [jid, user] of Object.entries(data.users || {})) {
    if (!isKnownBot(jid)) continue
    if (resetMoney(user)) cleaned += 1
  }

  for (const chat of Object.values(data.chats || {})) {
    if (!chat?.users) continue

    for (const [jid, user] of Object.entries(chat.users || {})) {
      if (!isKnownBot(jid)) continue
      if (resetMoney(user)) cleaned += 1
    }
  }

  return cleaned
}

function makeTempPath(filePath) {
  const suffix = `${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}`
  return `${filePath}.${suffix}.tmp`
}

function writeJsonAtomic(fileName, data) {
  ensureDir(DB_DIR)

  const filePath = path.join(DB_DIR, fileName)
  const tempPath = makeTempPath(filePath)
  let tempWritten = false

  try {
    fs.writeFileSync(tempPath, stringify(data), 'utf8')
    tempWritten = true

    for (let attempt = 0; attempt <= WRITE_RETRY_DELAYS_MS.length; attempt++) {
      try {
        fs.renameSync(tempPath, filePath)
        return true
      } catch (err) {
        const canRetry = shouldRetryWrite(err) && attempt < WRITE_RETRY_DELAYS_MS.length
        if (!canRetry) throw err

        waitSync(WRITE_RETRY_DELAYS_MS[attempt])
      }
    }

    return false
  } catch (err) {
    console.error(`[DATABASE] Error guardando ${fileName}:`, err.message)

    try {
      if (!tempWritten && fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true })
    } catch {}

    if (tempWritten && fs.existsSync(tempPath)) {
      console.error(`[DATABASE] Se conservó el temporal para reintento/revisión: ${path.basename(tempPath)}`)
    }

    return false
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

  const sanitizedBotUsers = sanitizeBotEconomy(global.db.data)

  global.db.chain = _.chain(global.db.data)
  global.db.READ = false
  global.db._snapshot = serializeAllData()

  if (sanitizedBotUsers && typeof global.saveDatabase === 'function') {
    global.saveDatabase(true)
  }

  return global.db.data
}

global.saveDatabase = function saveDatabase(force = false) {
  if (!global.db?.data) return

  const currentSnapshot = serializeAllData()

  if (!force && global.db._snapshot === currentSnapshot) {
    return
  }

  const data = global.db.data

  const saved = [
    writeJsonAtomic(FILES.users, data.users || {}),
    writeJsonAtomic(FILES.chats, data.chats || {}),
    writeJsonAtomic(FILES.stats, data.stats || {}),
    writeJsonAtomic(FILES.settings, data.settings || {}),
    writeJsonAtomic(FILES.characters, data.characters || {}),
    writeJsonAtomic(FILES.stickerspack, data.stickerspack || {}),
    writeJsonAtomic(FILES.logs, data.logs || {})
  ].every(Boolean)

  if (saved) {
    global.db._snapshot = currentSnapshot
  } else {
    console.error('[DATABASE] Guardado incompleto. Se reintentará en el próximo autosave.')
  }
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
