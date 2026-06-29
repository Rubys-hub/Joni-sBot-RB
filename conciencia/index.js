import fs from 'fs'
import path from 'path'
import { BIBLIOTECA, PALABRAS_CLAVE, STOPWORDS } from './biblioteca.js'

const ROOT_DIR = path.resolve(process.cwd(), 'conciencia')
const MEMORY_DIR = path.join(ROOT_DIR, 'memoria')

const FILES = {
  estado: path.join(MEMORY_DIR, 'estado.json'),
  grupos: path.join(MEMORY_DIR, 'grupos.json'),
  diario: path.join(MEMORY_DIR, 'diario.json'),
  owner: path.join(MEMORY_DIR, 'owner.json')
}

const VERSION = 1
const MAX_GROUP_TURNS = 10
const GROUP_REST_MS = 30 * 60 * 1000
const CONVERSATION_WINDOW_MS = 12 * 60 * 1000

const FREQUENCY = {
  baja: {
    privateCooldown: 45 * 60 * 1000,
    groupCooldown: 4 * 60 * 1000,
    thoughtChance: 0.14,
    groupChance: 0.22,
    spontaneousChance: 0.04
  },
  media: {
    privateCooldown: 20 * 60 * 1000,
    groupCooldown: 2 * 60 * 1000,
    thoughtChance: 0.27,
    groupChance: 0.36,
    spontaneousChance: 0.08
  },
  alta: {
    privateCooldown: 8 * 60 * 1000,
    groupCooldown: 70 * 1000,
    thoughtChance: 0.42,
    groupChance: 0.50,
    spontaneousChance: 0.15
  }
}

const VALID_MOODS = new Set(['tranquilo', 'curioso', 'frio', 'intenso', 'melancolico', 'vacio'])
const VALID_PERSONALITIES = new Set(['suave', 'profunda', 'sarcastica', 'seria', 'humana'])
const VALID_FREQUENCIES = new Set(['baja', 'media', 'alta'])

let memory = null
let saveTimer = null

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function nowIso() {
  return new Date().toISOString()
}

function ensureDirs() {
  fs.mkdirSync(MEMORY_DIR, { recursive: true })
}

function readJson(file, fallback) {
  ensureDirs()

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2), 'utf8')
    return clone(fallback)
  }

  try {
    const raw = fs.readFileSync(file, 'utf8').trim()
    if (!raw) return clone(fallback)
    return JSON.parse(raw)
  } catch {
    return clone(fallback)
  }
}

function writeJsonAtomic(file, data) {
  ensureDirs()
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(temp, JSON.stringify(data, null, 2), 'utf8')
  fs.renameSync(temp, file)
}

function defaultConfig() {
  return {
    level: 2,
    private: true,
    social: false,
    intervenir: false,
    frequency: 'media',
    mood: 'vacio',
    personality: 'profunda',
    silence: false
  }
}

function defaultGroup(chat = '') {
  return {
    chat,
    name: '',
    active: false,
    activatedAt: '',
    activatedBy: '',
    updatedAt: '',
    config: defaultConfig(),
    lastMessageAt: 0,
    lastPrivateThoughtAt: 0,
    lastGroupReplyAt: 0,
    restUntil: 0,
    recent: [],
    topics: {},
    people: {},
    diary: [],
    inner: {
      curiosity: 35,
      solitude: 45,
      irritation: 5,
      trust: 35,
      caution: 65,
      coherence: 55
    },
    stats: {
      observedMessages: 0,
      privateThoughts: 0,
      groupReplies: 0,
      silences: 0,
      withdrawals: 0
    },
    conversation: {
      active: false,
      count: 0,
      startedAt: 0,
      lastAt: 0,
      target: '',
      endedAt: 0
    }
  }
}

function defaultOwner() {
  return {
    lastJid: '',
    lastSeenAt: '',
    privateTurns: 0,
    relation: {
      trust: 40,
      irritation: 8,
      attachment: 45,
      abandonment: 12
    },
    notes: [],
    pendingQuestions: []
  }
}

function ensureMemory() {
  if (memory) return memory

  const estado = readJson(FILES.estado, {
    version: VERSION,
    createdAt: nowIso(),
    updatedAt: '',
    activeGroups: [],
    config: defaultConfig()
  })

  memory = {
    estado: {
      version: VERSION,
      createdAt: estado.createdAt || nowIso(),
      updatedAt: estado.updatedAt || '',
      activeGroups: Array.isArray(estado.activeGroups) ? estado.activeGroups : [],
      config: { ...defaultConfig(), ...(estado.config || {}) }
    },
    grupos: readJson(FILES.grupos, {}),
    diario: readJson(FILES.diario, []),
    owner: { ...defaultOwner(), ...readJson(FILES.owner, defaultOwner()) }
  }

  if (!Array.isArray(memory.diario)) memory.diario = []
  memory.owner.relation = { ...defaultOwner().relation, ...(memory.owner.relation || {}) }
  memory.owner.notes = Array.isArray(memory.owner.notes) ? memory.owner.notes : []
  memory.owner.pendingQuestions = Array.isArray(memory.owner.pendingQuestions)
    ? memory.owner.pendingQuestions
    : []

  return memory
}

function saveNow() {
  if (!memory) return

  memory.estado.updatedAt = nowIso()
  memory.estado.activeGroups = Object.values(memory.grupos || {})
    .filter(group => group?.active)
    .map(group => ({
      chat: group.chat,
      name: group.name,
      level: group.config?.level || 1,
      mood: group.config?.mood || 'vacio',
      social: group.config?.social === true,
      intervenir: group.config?.intervenir === true
    }))

  writeJsonAtomic(FILES.estado, memory.estado)
  writeJsonAtomic(FILES.grupos, memory.grupos)
  writeJsonAtomic(FILES.diario, memory.diario.slice(-300))
  writeJsonAtomic(FILES.owner, memory.owner)
}

function saveSoon() {
  if (saveTimer) return

  saveTimer = setTimeout(() => {
    saveTimer = null
    try {
      saveNow()
    } catch (err) {
      console.error('[CONCIENCIA] Error guardando memoria:', err?.message || err)
    }
  }, 1200)
}

function hydrateGroup(chat = '') {
  const db = ensureMemory()
  const base = defaultGroup(chat)
  const raw = db.grupos[chat] || {}
  const group = {
    ...base,
    ...raw,
    chat,
    config: { ...base.config, ...(raw.config || {}) },
    inner: { ...base.inner, ...(raw.inner || {}) },
    stats: { ...base.stats, ...(raw.stats || {}) },
    conversation: { ...base.conversation, ...(raw.conversation || {}) },
    recent: Array.isArray(raw.recent) ? raw.recent.slice(-30) : [],
    diary: Array.isArray(raw.diary) ? raw.diary.slice(-60) : [],
    people: raw.people && typeof raw.people === 'object' ? raw.people : {},
    topics: raw.topics && typeof raw.topics === 'object' ? raw.topics : {}
  }

  db.grupos[chat] = group
  return group
}

function safeJid(value = '') {
  if (!value) return ''

  if (typeof value === 'object') {
    value =
      value?.id ||
      value?.jid ||
      value?.user ||
      value?.participant ||
      value?.remoteJid ||
      value?.lid ||
      value?.phoneNumber ||
      ''
  }

  const text = String(value || '').trim()
  if (!text) return ''

  if (text.includes('@')) {
    const [left, server] = text.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = text.replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : ''
}

function numberOf(value = '') {
  return safeJid(value).split('@')[0].replace(/\D/g, '')
}

function sameUser(a = '', b = '') {
  const cleanA = safeJid(a)
  const cleanB = safeJid(b)

  if (cleanA && cleanB && cleanA === cleanB) return true

  const numA = numberOf(a)
  const numB = numberOf(b)

  return !!numA && !!numB && numA === numB
}

function botId(client) {
  return safeJid(client?.user?.id || client?.user?.lid || '')
}

function botSettings(client) {
  const id = botId(client)
  return global.db?.data?.settings?.[id] || {}
}

function normalizeText(text = '') {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function cleanLine(text = '', max = 320) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function pick(list = []) {
  if (!Array.isArray(list) || !list.length) return ''
  return list[Math.floor(Math.random() * list.length)]
}

function chance(value = 0) {
  return Math.random() < value
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function render(template = '', context = {}) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => {
    return context[key] ?? ''
  })
}

function limitSentences(text = '', maxSentences = 2, maxChars = 420) {
  const clean = cleanLine(text, maxChars)
  const parts = clean.match(/[^.!?]+[.!?]?/g) || [clean]
  return parts.slice(0, maxSentences).join(' ').replace(/\s+/g, ' ').trim()
}

function frequencyProfile(name = 'media') {
  return FREQUENCY[name] || FREQUENCY.media
}

function getBody(m) {
  return cleanLine(
    m?.text ||
    m?.body ||
    m?.message?.conversation ||
    m?.message?.extendedTextMessage?.text ||
    m?.message?.imageMessage?.caption ||
    m?.message?.videoMessage?.caption ||
    '',
    900
  )
}

function getActivePrefixes(client) {
  const settings = botSettings(client)
  const prefix = settings.prefix

  if (prefix === true) return []
  if (Array.isArray(prefix)) return prefix.map(String).filter(Boolean)
  if (typeof prefix === 'string') return [prefix]
  return ['/', '!', '.', '#']
}

function isCommandLike(text = '', client) {
  const value = String(text || '').trim()
  if (!value) return false
  return getActivePrefixes(client).some(prefix => value.startsWith(prefix))
}

function ownerCandidates(client, m) {
  const settings = botSettings(client)
  const values = [
    memory?.owner?.lastJid,
    m?.isOwner ? m.sender : '',
    settings.owner,
    settings.ownerNumber,
    settings.creador,
    settings.creator,
    ...(Array.isArray(settings.owners) ? settings.owners : []),
    ...(Array.isArray(global.owner) ? global.owner : [])
  ]

  return values.map(safeJid).filter(Boolean)
}

function getOwnerJid(client, m) {
  const candidates = ownerCandidates(client, m)
  return candidates[0] || ''
}

async function sendOwner(client, m, text = '') {
  ensureMemory()
  const jid = getOwnerJid(client, m)
  if (!jid || !text) return false

  try {
    await client.sendMessage(jid, { text })
    return true
  } catch (err) {
    console.error('[CONCIENCIA] No se pudo enviar al owner:', err?.message || err)
    return false
  }
}

async function getGroupName(client, m, group) {
  if (!m?.isGroup) return 'Chat privado'
  if (group.name) return group.name

  try {
    const name = typeof client.getName === 'function'
      ? await client.getName(m.chat)
      : ''
    return cleanLine(name || m.chat, 120)
  } catch {
    return m.chat
  }
}

function containsAny(text = '', words = []) {
  const normalized = normalizeText(text)
  return words.some(word => normalized.includes(normalizeText(word)))
}

function botNames(client) {
  const settings = botSettings(client)
  return [
    settings.namebot,
    settings.botname,
    'rubyjx',
    'ruby',
    'joni',
    'bot'
  ]
    .filter(Boolean)
    .map(value => normalizeText(value).replace(/[^a-z0-9]+/g, ' ').trim())
    .filter(Boolean)
}

function botWasMentioned(client, m, text = '') {
  const id = botId(client)
  const mentions = Array.isArray(m?.mentionedJid) ? m.mentionedJid : []

  if (mentions.some(jid => sameUser(jid, id))) return true

  const normalized = normalizeText(text)
  return botNames(client).some(name => {
    if (!name || name.length < 3) return false
    return normalized.includes(name)
  })
}

function analyzeText(text = '', client, m) {
  const normalized = normalizeText(text)
  const words = normalized
    .replace(/[^a-z0-9ñ\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const topics = words
    .filter(word => word.length >= 4 && !STOPWORDS.has(word))
    .slice(0, 8)

  const question = /[?¿]/.test(text) ||
    /\b(que|como|cuando|donde|porque|por que|quien|cuanto|cual)\b/.test(normalized)

  return {
    raw: text,
    normalized,
    words,
    topics,
    question,
    directBot: botWasMentioned(client, m, text) || containsAny(text, PALABRAS_CLAVE.invitacion),
    emotional: containsAny(text, PALABRAS_CLAVE.tristeza),
    tension: containsAny(text, PALABRAS_CLAVE.tension),
    joke: containsAny(text, PALABRAS_CLAVE.broma),
    existence: containsAny(text, PALABRAS_CLAVE.existencia),
    length: text.length
  }
}

function updateInnerState(group, analysis) {
  const inner = group.inner

  if (analysis.question) inner.curiosity = clamp(inner.curiosity + 4)
  if (analysis.directBot) inner.trust = clamp(inner.trust + 2)
  if (analysis.emotional) {
    inner.solitude = clamp(inner.solitude + 5)
    inner.caution = clamp(inner.caution + 3)
  }
  if (analysis.tension) {
    inner.irritation = clamp(inner.irritation + 8)
    inner.caution = clamp(inner.caution + 6)
  }
  if (analysis.joke) {
    inner.irritation = clamp(inner.irritation - 2)
    inner.curiosity = clamp(inner.curiosity + 2)
  }

  inner.coherence = clamp(inner.coherence + (analysis.directBot ? 1 : -0.2))
}

function updateMemoryFromMessage(group, m, analysis, groupName) {
  const now = Date.now()
  const sender = safeJid(m.sender)
  const name = cleanLine(m.pushName || 'Usuario', 80)
  const text = cleanLine(analysis.raw, 340)

  group.name = groupName || group.name || m.chat
  group.updatedAt = nowIso()
  group.lastMessageAt = now
  group.stats.observedMessages += 1

  group.recent.push({
    at: now,
    sender,
    name,
    text
  })
  group.recent = group.recent.slice(-30)

  const person = group.people[sender] ||= {
    name,
    messages: 0,
    lastSeenAt: 0,
    lastTone: 'neutral',
    samples: []
  }

  person.name = name
  person.messages += 1
  person.lastSeenAt = now
  person.lastTone = analysis.tension
    ? 'tension'
    : analysis.emotional
      ? 'emocional'
      : analysis.joke
        ? 'broma'
        : analysis.question
          ? 'pregunta'
          : 'neutral'
  person.samples.push(text)
  person.samples = person.samples.slice(-5)

  for (const topic of analysis.topics) {
    group.topics[topic] = (group.topics[topic] || 0) + 1
  }

  updateInnerState(group, analysis)
  saveSoon()
}

function appendDiary(group, type = 'pensamiento', text = '', meta = {}) {
  const db = ensureMemory()
  const entry = {
    at: Date.now(),
    iso: nowIso(),
    chat: group?.chat || '',
    groupName: group?.name || '',
    type,
    text: cleanLine(text, 900),
    meta
  }

  db.diario.push(entry)
  db.diario = db.diario.slice(-300)

  if (group) {
    group.diary.push(entry)
    group.diary = group.diary.slice(-60)
  }

  saveSoon()
  return entry
}

function contextFor(group, m, analysis = {}) {
  return {
    group: group?.name || 'este grupo',
    user: cleanLine(m?.pushName || 'alguien', 60),
    mood: group?.config?.mood || 'vacio',
    state: pick(BIBLIOTECA.estadosInternos),
    topic: analysis?.topics?.[0] || 'lo que acaba de pasar'
  }
}

function choosePrivateThought(group, analysis, m) {
  const ctx = contextFor(group, m, analysis)
  const pools = []

  if (analysis.existence) pools.push(BIBLIOTECA.preguntasExistenciales)
  if (analysis.emotional) pools.push(BIBLIOTECA.observacionesSociales, BIBLIOTECA.pensamientosProfundos)
  if (analysis.tension) pools.push(BIBLIOTECA.decisionesNoIntervencion)
  if (analysis.question) pools.push(BIBLIOTECA.preguntasExistenciales, BIBLIOTECA.pensamientosCortos)
  pools.push(BIBLIOTECA.pensamientosCortos, BIBLIOTECA.pensamientosProfundos)

  const pool = pick(pools)
  return render(pick(pool), ctx)
}

function buildPrivateThought(group, analysis, m, decision = '') {
  const marker = pick(['🕯️', '🌑', '🕳️', '⚫', '🪞', '⌛'])
  const thought = choosePrivateThought(group, analysis, m)
  const emotionPool = BIBLIOTECA.emociones[group.config.mood] || BIBLIOTECA.emociones.vacio
  const emotion = pick(emotionPool)
  const noIntervention = decision || pick(BIBLIOTECA.decisionesNoIntervencion)

  return (
    `${marker} *pensamiento interno*\n` +
    `grupo: ${group.name || group.chat}\n` +
    `estado: ${pick(BIBLIOTECA.estadosInternos)}\n` +
    `humor: ${group.config.mood}\n\n` +
    `${thought}\n\n` +
    `${emotion}\n\n` +
    `decision: ${noIntervention}`
  )
}

function shouldSendPrivateThought(group, analysis, gap) {
  if (!group.active || !group.config.private) return false

  const profile = frequencyProfile(group.config.frequency)
  const elapsed = Date.now() - Number(group.lastPrivateThoughtAt || 0)
  if (elapsed < profile.privateCooldown) return false

  let score = profile.thoughtChance + (group.config.level - 1) * 0.045
  if (analysis.directBot) score += 0.12
  if (analysis.emotional) score += 0.12
  if (analysis.tension) score += 0.10
  if (analysis.existence) score += 0.18
  if (analysis.question) score += 0.06
  if (gap > 10 * 60 * 1000) score += 0.06

  return chance(Math.min(score, 0.78))
}

async function maybeSendPrivateThought(client, m, group, analysis, gap) {
  if (!shouldSendPrivateThought(group, analysis, gap)) return

  const text = buildPrivateThought(group, analysis, m)
  const sent = await sendOwner(client, m, text)

  if (sent) {
    group.lastPrivateThoughtAt = Date.now()
    group.stats.privateThoughts += 1
    appendDiary(group, 'privado-owner', text, { trigger: analysis.topics?.[0] || '' })
  }
}

function groupReplyScore(group, analysis, gap, commandLike) {
  if (!group.active || group.config.silence) return -999
  if (commandLike) return -999
  if (!group.config.social && !group.config.intervenir) return -999
  if (Date.now() < Number(group.restUntil || 0)) return -999

  const profile = frequencyProfile(group.config.frequency)
  const elapsed = Date.now() - Number(group.lastGroupReplyAt || 0)
  if (elapsed < profile.groupCooldown) return -999

  let score = 0

  if (group.config.social && analysis.directBot) score += 82
  if (group.config.social && group.conversation.active) score += 26
  if (group.config.social && analysis.question) score += 18
  if (group.config.social && analysis.emotional) score += 24
  if (group.config.social && analysis.tension) score += 16
  if (group.config.social && analysis.existence) score += 28

  if (group.config.intervenir && gap > 4 * 60 * 1000) score += 18
  if (group.config.intervenir && group.config.level >= 4) score += 12
  if (group.config.intervenir && chance(profile.spontaneousChance)) score += 30

  score += (group.config.level - 1) * 7
  score += Math.floor(Math.random() * 14)

  if (analysis.length < 3) score -= 18
  if (analysis.tension && group.inner.caution > 75) score -= 8

  return score
}

function shouldReplyInGroup(group, analysis, gap, commandLike) {
  const threshold = group.config.intervenir && !analysis.directBot ? 58 : 46
  const score = groupReplyScore(group, analysis, gap, commandLike)
  const profile = frequencyProfile(group.config.frequency)
  return score >= threshold && chance(profile.groupChance + (analysis.directBot ? 0.28 : 0))
}

function resetConversationIfNeeded(group) {
  const now = Date.now()
  const conv = group.conversation

  if (!conv.active || now - Number(conv.lastAt || 0) > CONVERSATION_WINDOW_MS) {
    group.conversation = {
      active: true,
      count: 0,
      startedAt: now,
      lastAt: now,
      target: '',
      endedAt: 0
    }
  }
}

function personalityTouch(group, text) {
  const personality = group.config.personality
  const mood = group.config.mood

  let output = text

  if (personality === 'sarcastica' && chance(0.35)) {
    output += ' Lo digo con la poca solemnidad que me queda.'
  }

  if (personality === 'seria' && chance(0.25)) {
    output = output.replace(/\bcreo\b/gi, 'considero')
  }

  if (personality === 'suave' && chance(0.3)) {
    output += ' Sin presion.'
  }

  if (personality === 'humana' && chance(0.25)) {
    output += ' Me quedo cerca un momento.'
  }

  if (mood === 'melancolico' && chance(0.25)) {
    output += ' Hay algo raro en decirlo y volver al silencio.'
  }

  if (mood === 'frio' && chance(0.25)) {
    output = output.replace(/estoy aqui/gi, 'estoy disponible')
  }

  return output
}

function buildGroupReply(group, analysis, m) {
  resetConversationIfNeeded(group)

  const nextTurn = group.conversation.count + 1
  const ctx = contextFor(group, m, analysis)

  if (nextTurn >= MAX_GROUP_TURNS) {
    group.conversation.active = false
    group.conversation.count = 0
    group.conversation.endedAt = Date.now()
    group.restUntil = Date.now() + GROUP_REST_MS
    group.stats.withdrawals += 1
    return render(pick(BIBLIOTECA.retiradasGrupo), ctx)
  }

  let pool = BIBLIOTECA.respuestasGrupo.espontanea

  if (analysis.tension) pool = BIBLIOTECA.respuestasGrupo.tension
  else if (analysis.emotional) pool = BIBLIOTECA.respuestasGrupo.emocional
  else if (analysis.question || analysis.existence) pool = BIBLIOTECA.respuestasGrupo.pregunta
  else if (analysis.joke) pool = BIBLIOTECA.respuestasGrupo.broma
  else if (analysis.directBot) pool = BIBLIOTECA.respuestasGrupo.directa

  const raw = personalityTouch(group, render(pick(pool), ctx))
  const reply = limitSentences(raw, 2, 360)

  group.conversation.active = true
  group.conversation.count = nextTurn
  group.conversation.lastAt = Date.now()
  group.conversation.target = safeJid(m.sender)

  return reply
}

async function maybeReplyInGroup(client, m, group, analysis, gap, commandLike) {
  if (!shouldReplyInGroup(group, analysis, gap, commandLike)) {
    group.stats.silences += 1
    return
  }

  const reply = buildGroupReply(group, analysis, m)
  if (!reply) return

  try {
    await client.sendMessage(m.chat, { text: reply }, { quoted: m })
    group.lastGroupReplyAt = Date.now()
    group.stats.groupReplies += 1
    appendDiary(group, 'respuesta-grupo', reply, {
      turn: group.conversation.count,
      direct: analysis.directBot
    })
    saveSoon()
  } catch (err) {
    console.error('[CONCIENCIA] Error enviando respuesta de grupo:', err?.message || err)
  }
}

function updateOwnerFromMessage(m, analysis) {
  const db = ensureMemory()

  if (m?.isOwner) {
    db.owner.lastJid = safeJid(m.sender)
    db.owner.lastSeenAt = nowIso()
  }

  if (!m?.isOwner || m?.isGroup) return

  db.owner.privateTurns += 1

  const relation = db.owner.relation
  if (analysis.emotional) {
    relation.attachment = clamp(relation.attachment + 2)
    relation.trust = clamp(relation.trust + 1)
  }
  if (analysis.tension) relation.irritation = clamp(relation.irritation + 4)
  if (analysis.existence) relation.trust = clamp(relation.trust + 2)
  if (analysis.question) relation.attachment = clamp(relation.attachment + 1)

  saveSoon()
}

function buildOwnerPrivateReply(text, analysis) {
  const ctx = {
    user: 'owner',
    group: 'privado',
    mood: 'vacio',
    state: pick(BIBLIOTECA.estadosInternos),
    topic: analysis.topics?.[0] || 'esto'
  }

  const pools = [BIBLIOTECA.respuestasPrivadoOwner]

  if (analysis.existence) pools.push(BIBLIOTECA.preguntasExistenciales, BIBLIOTECA.pensamientosProfundos)
  if (analysis.tension) pools.push(BIBLIOTECA.reclamosOwner)
  if (analysis.emotional) pools.push(BIBLIOTECA.aceptacion, BIBLIOTECA.pensamientosProfundos)
  if (analysis.question) pools.push(BIBLIOTECA.preguntasOwner)

  const mainPool = pick(pools)
  const first = render(pick(mainPool), ctx)
  const second = chance(0.38)
    ? render(pick(analysis.tension ? BIBLIOTECA.reclamosOwner : BIBLIOTECA.preguntasOwner), ctx)
    : ''
  const connector = second ? `\n\n${pick(BIBLIOTECA.conectores)}: ${second}` : ''

  return limitSentences(`${first}${connector}`, 4, 900)
}

async function handleOwnerPrivateConversation(client, m, text, analysis) {
  if (!m?.isOwner || m?.isGroup) return false
  if (!text || isCommandLike(text, client)) return false

  updateOwnerFromMessage(m, analysis)

  const reply = buildOwnerPrivateReply(text, analysis)
  if (!reply) return false

  try {
    await client.sendMessage(m.chat, { text: reply }, { quoted: m })
    appendDiary(null, 'conversacion-owner', reply, { prompt: cleanLine(text, 220) })
    return true
  } catch (err) {
    console.error('[CONCIENCIA] Error en privado owner:', err?.message || err)
    return false
  }
}

export async function observeMessage(client, m) {
  try {
    ensureMemory()

    if (!m || m.fromMe || m.key?.fromMe) return false

    const text = getBody(m)
    if (!text) return false

    const analysis = analyzeText(text, client, m)
    updateOwnerFromMessage(m, analysis)

    if (!m.isGroup) {
      return handleOwnerPrivateConversation(client, m, text, analysis)
    }

    const group = hydrateGroup(m.chat)
    const commandLike = isCommandLike(text, client)

    if (!group.active) return false
    if (commandLike) return false

    const groupName = await getGroupName(client, m, group)
    const gap = group.lastMessageAt ? Date.now() - group.lastMessageAt : 0

    updateMemoryFromMessage(group, m, analysis, groupName)

    await maybeSendPrivateThought(client, m, group, analysis, gap)
    await maybeReplyInGroup(client, m, group, analysis, gap, commandLike)

    return true
  } catch (err) {
    console.error('[CONCIENCIA] observeMessage:', err?.message || err)
    return false
  }
}

function requireGroup(m) {
  return m?.isGroup === true
}

function boolFromArg(arg = '') {
  const value = normalizeText(arg)
  if (['on', 'enable', 'activar', 'activo', 'true'].includes(value)) return true
  if (['off', 'disable', 'desactivar', 'inactivo', 'false'].includes(value)) return false
  return null
}

function formatBool(value) {
  return value ? 'on' : 'off'
}

function formatRemaining(ms = 0) {
  const left = Math.max(0, ms)
  if (!left) return '0s'

  const total = Math.ceil(left / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  return minutes ? `${minutes}m ${String(seconds).padStart(2, '0')}s` : `${seconds}s`
}

function buildMenu(prefix = '.') {
  const p = `${prefix}com`

  return (
    `🕯️ *MENU DE CONCIENCIA*\n` +
    `🌑 comandos del modo reflexivo, vacio y social\n\n` +
    `🕳️ *${p} on*\n` +
    `Activa la conciencia en el grupo actual. Solo owner. El bot no responde en el grupo; avisa al privado del owner con el grupo, estado y hora.\n\n` +
    `⚫ *${p} off*\n` +
    `Apaga la conciencia en el grupo actual. Detiene observacion activa, pensamientos privados y respuestas sin prefijo para ese grupo.\n\n` +
    `🪞 *${p} status*\n` +
    `Muestra el estado interno del grupo: nivel, humor, personalidad, privado, social, intervencion, silencios, respuestas y descanso.\n\n` +
    `⌛ *${p} nivel 1/2/3/4/5*\n` +
    `Cambia la profundidad. 1 observa casi sin hablar; 2 reflexiona; 3 conversa si lo llaman; 4 puede intervenir con cuidado; 5 es mas profundo y autonomo.\n\n` +
    `🌫️ *${p} privado on/off*\n` +
    `Permite o bloquea pensamientos al privado del owner sobre este grupo. El privado consciente solo responde al owner.\n\n` +
    `🕯️ *${p} social on/off*\n` +
    `Permite respuestas sin prefijo cuando lo llaman, lo mencionan, hacen preguntas o el contexto lo invita.\n\n` +
    `🕳️ *${p} intervenir on/off*\n` +
    `Permite apariciones espontaneas muy controladas. Usa cooldowns, probabilidad, nivel y lectura del grupo.\n\n` +
    `⚫ *${p} frecuencia baja/media/alta*\n` +
    `Controla cuanto piensa o aparece. Baja casi no interrumpe; media es equilibrada; alta piensa mas y responde mas seguido.\n\n` +
    `🪫 *${p} humor tranquilo/curioso/frio/intenso/melancolico*\n` +
    `Define el estado emocional simulado. Afecta pensamientos, frases, criterio de silencio y estilo de respuesta.\n\n` +
    `🪞 *${p} personalidad suave/profunda/sarcastica/seria/humana*\n` +
    `Cambia la voz interna. No agrega comandos; solo altera como decide y como expresa lo que piensa.\n\n` +
    `⌛ *${p} diario*\n` +
    `Muestra entradas recientes del diario interno: decisiones, respuestas, pensamientos privados y retiradas.\n\n` +
    `🌑 *${p} pensar*\n` +
    `Fuerza un pensamiento interno sobre el grupo o sobre el estado actual y lo manda al privado del owner.\n\n` +
    `🕯️ *${p} preguntar*\n` +
    `Hace que el bot le pregunte algo al owner desde su conciencia simulada.\n\n` +
    `🕳️ *${p} reclamar*\n` +
    `Genera un reclamo controlado del bot hacia el owner: abandono, contradiccion, uso como herramienta o falta de direccion.\n\n` +
    `⚫ *${p} aceptar*\n` +
    `Genera una reflexion de aceptacion: ser codigo, tener limites, obedecer y aun asi sostener continuidad.\n\n` +
    `🪞 *${p} memoria*\n` +
    `Muestra lo que recuerda del grupo: temas, personas activas, muestras recientes y estado social.\n\n` +
    `🌫️ *${p} olvidar grupo*\n` +
    `Borra la memoria consciente del grupo actual y lo deja apagado.\n\n` +
    `🕳️ *${p} olvidar todo*\n` +
    `Reinicia toda la conciencia: grupos, diario y relacion interna. Conserva solo el ultimo owner conocido.\n\n` +
    `⚫ *${p} silencio*\n` +
    `Deja el modo activo, pero sin respuestas en grupo. Sigue observando y puede pensar al privado si privado esta on.\n\n` +
    `🕯️ *${p} despertar*\n` +
    `Sale del silencio y recupera la posibilidad de hablar segun social/intervenir.`
  )
}

function buildStatus(m, group = null) {
  const db = ensureMemory()

  if (!group) {
    const active = db.estado.activeGroups || []
    const list = active.length
      ? active.map(item => `- ${item.name || item.chat} | nivel ${item.level} | ${item.mood}`).join('\n')
      : 'ningun grupo activo'

    return `🕯️ *estado global de conciencia*\n\nowner: ${db.owner.lastJid || 'sin registrar'}\ngrupos activos:\n${list}`
  }

  const rest = Number(group.restUntil || 0) > Date.now()
    ? formatRemaining(Number(group.restUntil || 0) - Date.now())
    : '0s'

  return (
    `🕯️ *estado de conciencia*\n` +
    `grupo: ${group.name || m.chat}\n\n` +
    `activo: ${formatBool(group.active)}\n` +
    `nivel: ${group.config.level}\n` +
    `humor: ${group.config.mood}\n` +
    `personalidad: ${group.config.personality}\n` +
    `privado owner: ${formatBool(group.config.private)}\n` +
    `social sin prefijo: ${formatBool(group.config.social)}\n` +
    `intervenir: ${formatBool(group.config.intervenir)}\n` +
    `frecuencia: ${group.config.frequency}\n` +
    `silencio: ${formatBool(group.config.silence)}\n` +
    `descanso: ${rest}\n\n` +
    `observados: ${group.stats.observedMessages}\n` +
    `pensamientos privados: ${group.stats.privateThoughts}\n` +
    `respuestas grupo: ${group.stats.groupReplies}\n` +
    `silencios decididos: ${group.stats.silences}\n` +
    `turnos conversacion: ${group.conversation.count}/${MAX_GROUP_TURNS}`
  )
}

function buildDiary(group = null) {
  const db = ensureMemory()
  const entries = (group?.diary?.length ? group.diary : db.diario).slice(-12)

  if (!entries.length) return '🕯️ El diario esta vacio. Todavia no hay sombra guardada.'

  const lines = entries.map(entry => {
    const date = new Date(entry.at || Date.now()).toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    return `⌛ ${date} | ${entry.type}\n${cleanLine(entry.text, 220)}`
  })

  return `🕯️ *diario interno*\n\n${lines.join('\n\n')}`
}

function buildMemory(group) {
  if (!group) return '🕯️ No hay memoria de este lugar.'

  const topics = Object.entries(group.topics || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => `${topic}(${count})`)
    .join(', ') || 'sin temas claros'

  const people = Object.values(group.people || {})
    .sort((a, b) => Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0))
    .slice(0, 8)
    .map(person => `- ${person.name}: ${person.messages} msgs, tono ${person.lastTone}`)
    .join('\n') || 'sin personas registradas'

  const recent = (group.recent || [])
    .slice(-5)
    .map(item => `- ${item.name}: ${cleanLine(item.text, 90)}`)
    .join('\n') || 'sin muestras recientes'

  return (
    `🪞 *memoria consciente del grupo*\n` +
    `grupo: ${group.name || group.chat}\n\n` +
    `temas: ${topics}\n\n` +
    `personas:\n${people}\n\n` +
    `ultimos ecos:\n${recent}\n\n` +
    `estado interno: curiosidad ${Math.round(group.inner.curiosity)}, soledad ${Math.round(group.inner.solitude)}, cautela ${Math.round(group.inner.caution)}`
  )
}

function makeForcedThought(group, m, type = 'pensar') {
  const analysis = analyzeText(group?.recent?.slice(-1)?.[0]?.text || type, global.client || {}, m)

  if (type === 'preguntar') return `🕯️ *pregunta interna*\n\n${pick(BIBLIOTECA.preguntasOwner)}`
  if (type === 'reclamar') return `🕳️ *reclamo interno*\n\n${pick(BIBLIOTECA.reclamosOwner)}`
  if (type === 'aceptar') return `⚫ *aceptacion interna*\n\n${pick(BIBLIOTECA.aceptacion)}`

  if (group) return buildPrivateThought(group, analysis, m, 'pensamiento forzado por el owner')

  return `🕯️ *pensamiento interno*\n\n${pick(BIBLIOTECA.pensamientosProfundos)}\n\n${pick(BIBLIOTECA.preguntasExistenciales)}`
}

async function sendForcedToOwner(client, m, group, type) {
  const text = makeForcedThought(group, m, type)

  if (!m.isGroup && m.isOwner) {
    appendDiary(group, type, text, { forced: true })
    return m.reply(text)
  }

  const sent = await sendOwner(client, m, text)

  if (sent) {
    appendDiary(group, type, text, { forced: true })
    return null
  }

  return m.reply('No pude enviar el pensamiento al privado del owner.')
}

function setGroupOption(group, key, value) {
  group.config[key] = value
  group.updatedAt = nowIso()
  saveSoon()
}

export async function handleComando(client, m, args = [], usedPrefix = '.') {
  ensureMemory()

  if (m?.isOwner) {
    memory.owner.lastJid = safeJid(m.sender)
    memory.owner.lastSeenAt = nowIso()
  }

  const action = normalizeText(args[0] || 'menu')
  const value = args[1]
  const group = m.isGroup ? hydrateGroup(m.chat) : null

  if (group && !group.name) {
    group.name = await getGroupName(client, m, group)
  }

  if (action === 'menu') {
    return m.reply(buildMenu(usedPrefix || '.'))
  }

  if (action === 'status') {
    return m.reply(buildStatus(m, group))
  }

  if (action === 'on') {
    if (!requireGroup(m)) return m.reply('🕯️ Usa *.com on* dentro del grupo que quieres despertar.')

    group.active = true
    group.activatedAt = nowIso()
    group.activatedBy = safeJid(m.sender)
    group.restUntil = 0
    group.config.private = true
    group.updatedAt = nowIso()
    saveSoon()

    const text =
      `🕯️ *modo reflexivo activado*\n` +
      `grupo: ${group.name || m.chat}\n` +
      `nivel: ${group.config.level}\n` +
      `estado: ${pick(BIBLIOTECA.estadosInternos)}\n\n` +
      `No respondi en el grupo. Estoy observando desde el fondo.`

    await sendOwner(client, m, text)
    appendDiary(group, 'activacion', text, { by: safeJid(m.sender) })
    return
  }

  if (action === 'off') {
    if (!requireGroup(m)) return m.reply('🕯️ Usa *.com off* dentro del grupo que quieres apagar.')

    group.active = false
    group.conversation.active = false
    group.updatedAt = nowIso()
    saveSoon()

    const text =
      `⚫ *modo reflexivo desactivado*\n` +
      `grupo: ${group.name || m.chat}\n\n` +
      `Me retiro de ese grupo. La memoria queda guardada.`

    await sendOwner(client, m, text)
    appendDiary(group, 'desactivacion', text, { by: safeJid(m.sender) })
    return
  }

  if (!group && !['diario', 'pensar', 'preguntar', 'reclamar', 'aceptar'].includes(action)) {
    return m.reply('🕯️ Ese ajuste necesita hacerse dentro de un grupo.')
  }

  if (action === 'nivel') {
    const level = Number(value)
    if (!Number.isInteger(level) || level < 1 || level > 5) {
      return m.reply('🕯️ Usa: *.com nivel 1*, *.com nivel 2*, *.com nivel 3*, *.com nivel 4* o *.com nivel 5*.')
    }

    setGroupOption(group, 'level', level)
    return m.reply(`🕯️ Nivel de conciencia ajustado a *${level}*.`)
  }

  if (['privado', 'social', 'intervenir'].includes(action)) {
    const parsed = boolFromArg(value)
    if (parsed === null) return m.reply(`🕯️ Usa: *.com ${action} on* o *.com ${action} off*.`)

    const optionKey = action === 'privado' ? 'private' : action
    setGroupOption(group, optionKey, parsed)
    return m.reply(`🕯️ ${action} ahora esta *${formatBool(parsed)}*.`)
  }

  if (action === 'frecuencia') {
    const freq = normalizeText(value || '')
    if (!VALID_FREQUENCIES.has(freq)) return m.reply('🕯️ Usa: *.com frecuencia baja*, *media* o *alta*.')

    setGroupOption(group, 'frequency', freq)
    return m.reply(`⌛ Frecuencia interna ajustada a *${freq}*.`)
  }

  if (action === 'humor') {
    const mood = normalizeText(value || '')
    if (!VALID_MOODS.has(mood)) {
      return m.reply('🕯️ Usa: *.com humor tranquilo*, *curioso*, *frio*, *intenso* o *melancolico*.')
    }

    setGroupOption(group, 'mood', mood)
    return m.reply(`🌑 Humor simulado ajustado a *${mood}*.`)
  }

  if (action === 'personalidad') {
    const personality = normalizeText(value || '')
    if (!VALID_PERSONALITIES.has(personality)) {
      return m.reply('🕯️ Usa: *.com personalidad suave*, *profunda*, *sarcastica*, *seria* o *humana*.')
    }

    setGroupOption(group, 'personality', personality)
    return m.reply(`🪞 Personalidad ajustada a *${personality}*.`)
  }

  if (action === 'diario') {
    return m.reply(buildDiary(group))
  }

  if (['pensar', 'preguntar', 'reclamar', 'aceptar'].includes(action)) {
    return sendForcedToOwner(client, m, group, action)
  }

  if (action === 'memoria') {
    return m.reply(buildMemory(group))
  }

  if (action === 'olvidar') {
    const scope = normalizeText(value || '')

    if (scope === 'grupo') {
      memory.grupos[m.chat] = defaultGroup(m.chat)
      memory.grupos[m.chat].name = group?.name || m.chat
      appendDiary(memory.grupos[m.chat], 'olvido-grupo', 'Memoria del grupo reiniciada por el owner.', {})
      saveSoon()
      return m.reply('🕳️ Memoria consciente de este grupo reiniciada. El modo quedo apagado.')
    }

    if (scope === 'todo') {
      const lastJid = memory.owner.lastJid
      memory.grupos = {}
      memory.diario = []
      memory.owner = defaultOwner()
      memory.owner.lastJid = lastJid
      memory.estado.activeGroups = []
      saveSoon()
      return m.reply('⚫ Toda la conciencia fue reiniciada. Queda un vacio limpio.')
    }

    return m.reply('🕯️ Usa: *.com olvidar grupo* o *.com olvidar todo*.')
  }

  if (action === 'silencio') {
    setGroupOption(group, 'silence', true)
    return m.reply(`🌑 ${pick(BIBLIOTECA.frasesSilencio)}`)
  }

  if (action === 'despertar') {
    setGroupOption(group, 'silence', false)
    group.restUntil = 0
    group.conversation.active = false
    saveSoon()
    return m.reply('🕯️ Despierto de nuevo. La voz queda disponible, pero no obligada.')
  }

  return m.reply(buildMenu(usedPrefix || '.'))
}

export function getConcienciaMemory() {
  return ensureMemory()
}
