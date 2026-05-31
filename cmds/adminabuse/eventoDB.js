import fs from 'node:fs/promises'
import path from 'node:path'

const EVENT_DB_PATH = path.join(process.cwd(), 'cmds', 'adminabuse', 'database.json')

const DEFAULT_EVENT_DB = {
  version: 1,

  settings: {
    sorteosGroup: '',
    maxClaimsGlobal: 30,
    claimPerUser: 1,

    maxVipTrials: 2,
    maxJackpotWins: 1,

    baseJackpot: 1000000,
    jackpotAddPerClaim: 50000,
jackpotChanceNormal: 0.6,
jackpotChanceSorteos: 1.2,

minGroupParticipants: 50,

maxBroadcastGroups: 30,
broadcastDelayMs: 30000,
globalNoticeCooldownMs: 30000,
lastGlobalNoticeAt: 0,

autoDropsEnabled: true,
autoDropCooldownMs: 30000,

byeMessage: 'Fue una pequeña prueba del sistema. Gracias por participar, pronto se viene algo más grande.',
byeNoticeBeforeMs: 60000
  },

  active: {
    enabled: false,
    id: '',
    mode: 'global',

    startedBy: '',
    startedAt: 0,
    endsAt: 0,

announcedGroups: [],
claims: {},
tickets: {},
drops: {},
lastAutoDropAt: 0,
byeNoticeSent: false,

    jackpot: {
      base: 1000000,
      current: 1000000,
      won: false,
      winner: '',
      wonAt: 0
    },

    rewardsGiven: {
      soles: 0,
      fragments: 0,
      boxes: 0,
      tickets: 0,
      vipTrials: 0,
      jackpotWins: 0
    },

    multipliers: {
      global: null,
      groups: {}
    }
  },

  groups: {},

  users: {},

  sharedGroupsCache: {
    updatedAt: 0,
    groups: {}
  },

  logs: []
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function mergeDefaults(target, defaults) {
  for (const [key, value] of Object.entries(defaults)) {
    if (target[key] === undefined) {
      target[key] = clone(value)
      continue
    }

    if (isPlainObject(value) && isPlainObject(target[key])) {
      mergeDefaults(target[key], value)
    }
  }

  return target
}

export function createEventoId() {
  const time = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `EV-${time}-${random}`
}

export async function loadEventoDB() {
  await fs.mkdir(path.dirname(EVENT_DB_PATH), { recursive: true })

  try {
    const raw = await fs.readFile(EVENT_DB_PATH, 'utf8')
    const data = JSON.parse(raw || '{}')

    return mergeDefaults(data, clone(DEFAULT_EVENT_DB))
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      const backupPath = EVENT_DB_PATH.replace(
        /\.json$/i,
        `.BROKEN.${Date.now()}.json`
      )

      try {
        await fs.rename(EVENT_DB_PATH, backupPath)
      } catch {}
    }

    const fresh = clone(DEFAULT_EVENT_DB)
    await saveEventoDB(fresh)

    return fresh
  }
}

export async function saveEventoDB(db = {}) {
  await fs.mkdir(path.dirname(EVENT_DB_PATH), { recursive: true })

  const safeDB = mergeDefaults(db, clone(DEFAULT_EVENT_DB))
  const tempPath = `${EVENT_DB_PATH}.tmp`

  await fs.writeFile(tempPath, JSON.stringify(safeDB, null, 2), 'utf8')
  await fs.rename(tempPath, EVENT_DB_PATH)

  return safeDB
}

export async function updateEventoDB(mutator) {
  const db = await loadEventoDB()
  const result = await mutator(db)

  await saveEventoDB(db)

  return result ?? db
}

export function resetActiveEvento(db = {}) {
  db.active = clone(DEFAULT_EVENT_DB.active)
  return db.active
}

export function ensureEventoUser(db = {}, jid = '') {
  const key = String(jid || '').trim()

  if (!key) return null

  db.users ||= {}

  db.users[key] ||= {
    fragments: 0,
    totalTickets: 0,
    totalClaims: 0,
    lastClaim: 0,
    wonFinals: 0,
    vipTrialsWon: 0
  }

  return db.users[key]
}

export function ensureEventoGroup(db = {}, chatId = '') {
  const key = String(chatId || '').trim()

  if (!key) return null

  db.groups ||= {}

  db.groups[key] ||= {
    name: '',
    enabled: true,
    totalClaims: 0,
    totalBoxes: 0,
    lastEventAt: 0,
    lastRainAt: 0,
    lastMultiplierAt: 0
  }

  return db.groups[key]
}

export function addEventoTickets(db = {}, jid = '', amount = 0) {
  const key = String(jid || '').trim()
  const count = Math.max(0, Math.floor(Number(amount || 0)))

  if (!key || count <= 0) return 0

  db.active ||= clone(DEFAULT_EVENT_DB.active)
  db.active.tickets ||= {}

  const user = ensureEventoUser(db, key)

  db.active.tickets[key] = Number(db.active.tickets[key] || 0) + count
  user.totalTickets = Number(user.totalTickets || 0) + count

  return db.active.tickets[key]
}

export function addEventoFragments(db = {}, jid = '', amount = 0) {
  const key = String(jid || '').trim()
  const count = Math.max(0, Math.floor(Number(amount || 0)))

  if (!key || count <= 0) return 0

  const user = ensureEventoUser(db, key)

  user.fragments = Number(user.fragments || 0) + count

  return user.fragments
}

export function pushEventoLog(db = {}, {
  action = '',
  chat = '',
  jid = '',
  amount = 0,
  reward = '',
  detail = '',
  by = ''
} = {}) {
  db.logs ||= []

  db.logs.unshift({
    time: Date.now(),
    action,
    chat: String(chat || ''),
    jid: String(jid || ''),
    amount: Number(amount || 0),
    reward: String(reward || ''),
    detail: String(detail || ''),
    by: String(by || '')
  })

  db.logs = db.logs.slice(0, 500)

  return db.logs[0]
}

export function getEventoDBPath() {
  return EVENT_DB_PATH
}