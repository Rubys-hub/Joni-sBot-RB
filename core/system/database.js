import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import yargs from 'yargs/yargs'

global.opts = Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbFile = path.join(process.cwd(), 'core', 'database.json')

global.db = {
  data: {
    users: {},
    chats: {},
    settings: {},
    characters: {},
    stickerspack: {}
  },
  chain: null,
  READ: false,
  _snapshot: '{}'
}
global.DATABASE = global.db
global.loadDatabase = function loadDatabase() {
  if (global.db.READ) return global.db.data
  global.db.READ = true
  
  if (fs.existsSync(dbFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(dbFile, 'utf8'))
      global.db.data = Object.assign(global.db.data, parsed)
    } catch {}
  }
  global.db.chain = _.chain(global.db.data)
  global.db.READ = false
  global.db._snapshot = JSON.stringify(global.db.data)
  return global.db.data
}

let pendingSerialized = null
let lastSave = Date.now()

function serializeDatabase() {
  try {
    return JSON.stringify(global.db.data)
  } catch {
    return null
  }
}

function hasPendingChanges() {
  const serialized = serializeDatabase()

  if (!serialized) return false

  if (global.db._snapshot !== serialized) {
    pendingSerialized = serialized
    return true
  }

  return false
}

global.saveDatabase = function saveDatabase() {
  const serialized = pendingSerialized || serializeDatabase()

  if (!serialized) return
  if (global.db._snapshot === serialized) return

  fs.writeFileSync(dbFile, serialized)
  global.db._snapshot = serialized
  pendingSerialized = null
  lastSave = Date.now()
}

setInterval(() => {
  const now = Date.now()

  if (now - lastSave < 15000) return

  if (hasPendingChanges()) {
    global.saveDatabase()
  }
}, 5000)

process.once('beforeExit', () => {
  try {
    if (hasPendingChanges()) global.saveDatabase()
  } catch {}
})

process.once('SIGINT', () => {
  try {
    if (hasPendingChanges()) global.saveDatabase()
  } catch {}

  process.exit(0)
})
export default global.db