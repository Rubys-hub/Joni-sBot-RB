import { resolveLidToRealJid } from "../../core/utils.js"

global.math = global.math || {}
global.mathNormalCooldowns = global.mathNormalCooldowns || {}
global.mathExtremePending = global.mathExtremePending || {}
global.mathExtremeCooldowns = global.mathExtremeCooldowns || {}

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const NORMAL_COOLDOWN = 15 * 60 * 1000
const EXTREME_CONFIRM_TIME = 30 * 1000
const EXTREME_TIME = 75 * 1000
const EXTREME_COOLDOWN = 60 * 60 * 1000
const EXTREME_REWARD = [76000, 160000]

const CONFIG = {
  facil: {
    name: 'Fácil',
    emoji: '🟢',
    time: 60000,
    attempts: 3,
    reward: [800, 1500]
  },
  medio: {
    name: 'Medio',
    emoji: '🟡',
    time: 70000,
    attempts: 3,
    reward: [1500, 3000]
  },
  dificil: {
    name: 'Difícil',
    emoji: '🟠',
    time: 80000,
    attempts: 3,
    reward: [3000, 5500]
  },
  imposible: {
    name: 'Imposible',
    emoji: '🔴',
    time: 90000,
    attempts: 3,
    reward: [6000, 9000]
  },
  imposible2: {
    name: 'Imposible 2',
    emoji: '💀',
    time: 100000,
    attempts: 3,
    reward: [9000, 15000]
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(list = []) {
  return list[Math.floor(Math.random() * list.length)]
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString()
}

function formatMoney(amount = 0, currency = 'Soles') {
  return `S/${formatNumber(amount)} ${currency}`
}

function formatTime(ms = 0) {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes <= 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}

function cleanJid(jid = '') {
  if (!jid) return ''

  if (typeof jid === 'object') {
    jid =
      jid?.id ||
      jid?.jid ||
      jid?.user ||
      jid?.participant ||
      jid?.remoteJid ||
      jid?.lid ||
      jid?.phoneNumber ||
      jid?.phone ||
      ''
  }

  jid = String(jid).trim()
  if (!jid) return ''

  if (jid.includes('@')) {
    const [left, server] = jid.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = jid.replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : ''
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function sameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (rawA && rawB && rawA === rawB) return true

  const numA = onlyNumber(rawA)
  const numB = onlyNumber(rawB)

  return !!numA && !!numB && numA === numB
}

function isOwnerUser(jid = '') {
  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].filter(Boolean)

  return owners.some(owner => sameUser(owner, jid))
}

function getBody(m = {}) {
  return String(
    m.text ||
    m.body ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ''
  ).trim()
}

function normalizeText(text = '') {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function parseAnswer(input = '') {
  const text = String(input || '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '')
    .trim()

  if (!text) return NaN
  return Number(text)
}

function getParticipantJids(participant = {}) {
  return [
    participant?.id,
    participant?.jid,
    participant?.lid,
    participant?.phoneNumber,
    participant?.phone,
    participant?.participant
  ].map(cleanJid).filter(Boolean)
}

function findParticipant(participants = [], candidates = []) {
  for (const p of participants) {
    const ids = getParticipantJids(p)

    const found = ids.some(id =>
      candidates.some(candidate => sameUser(id, candidate))
    )

    if (found) return p
  }

  return null
}

function isAdminParticipant(participant = null) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin'
}

function isProtectedUser(jid = '', participant = null) {
  if (isOwnerUser(jid)) return true
  if (isAdminParticipant(participant)) return true

  const number = onlyNumber(jid)
  if (!number) return false

  const ownerNumbers = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].map(owner => onlyNumber(owner)).filter(Boolean)

  return ownerNumbers.includes(number)
}

function getRemovalJid(participant = {}, fallback = '') {
  const values = [
    participant?.id,
    participant?.jid,
    participant?.phoneNumber,
    participant?.phoneNumber ? `${onlyNumber(participant.phoneNumber)}@s.whatsapp.net` : '',
    participant?.lid,
    fallback
  ].map(cleanJid).filter(Boolean)

  return (
    values.find(jid => jid.endsWith('@s.whatsapp.net')) ||
    values.find(jid => jid.endsWith('@lid')) ||
    values[0] ||
    cleanJid(fallback)
  )
}

function findUser(chatData = {}, ...jids) {
  chatData.users ||= {}

  for (const jid of jids) {
    const clean = cleanJid(jid)

    if (clean && chatData.users[clean]) {
      return {
        key: clean,
        data: chatData.users[clean]
      }
    }

    const number = onlyNumber(clean)
    if (!number) continue

    const foundKey = Object.keys(chatData.users).find(key => onlyNumber(key) === number)

    if (foundKey) {
      return {
        key: foundKey,
        data: chatData.users[foundKey]
      }
    }
  }

  return null
}

function createLocalUser(chatData = {}, jid = '') {
  chatData.users ||= {}

  const key = cleanJid(jid)

  chatData.users[key] ||= {
    coins: 0,
    bank: 0,
    exp: 0,
    level: 0,
    banned: false
  }

  if (typeof chatData.users[key].coins !== 'number') chatData.users[key].coins = 0
  if (typeof chatData.users[key].bank !== 'number') chatData.users[key].bank = 0

  return {
    key,
    data: chatData.users[key]
  }
}

function getReward(difficulty = 'facil') {
  const range = CONFIG[difficulty]?.reward || CONFIG.facil.reward
  return rand(range[0], range[1])
}

function getExtremeReward() {
  return rand(EXTREME_REWARD[0], EXTREME_REWARD[1])
}

function getNormalCooldownKey(chatId = '', jid = '') {
  return `${chatId}:${onlyNumber(jid) || cleanJid(jid)}`
}

function getNormalCooldownLeft(chatId = '', jid = '') {
  const key = getNormalCooldownKey(chatId, jid)
  const until = Number(global.mathNormalCooldowns[key] || 0)
  return Math.max(0, until - Date.now())
}

function setNormalCooldown(chatId = '', jid = '') {
  const key = getNormalCooldownKey(chatId, jid)
  global.mathNormalCooldowns[key] = Date.now() + NORMAL_COOLDOWN
}

function getExtremeCooldownKey(chatId = '', jid = '') {
  return `${chatId}:${onlyNumber(jid) || cleanJid(jid)}`
}

function getExtremeCooldownLeft(chatId = '', jid = '') {
  const key = getExtremeCooldownKey(chatId, jid)
  const until = Number(global.mathExtremeCooldowns[key] || 0)
  return Math.max(0, until - Date.now())
}

function setExtremeCooldown(chatId = '', jid = '') {
  const key = getExtremeCooldownKey(chatId, jid)
  global.mathExtremeCooldowns[key] = Date.now() + EXTREME_COOLDOWN
}

async function getSenderReal(m, client) {
  try {
    return await resolveLidToRealJid(m.sender, client, m.chat)
  } catch {
    return m.sender
  }
}

async function getGroupInfo(client, chatId, userJid = '') {
  const metadata = await client.groupMetadata(chatId).catch(() => null)

  if (!metadata) {
    return {
      ok: false,
      reason: 'no pude leer la información del grupo'
    }
  }

  const participants = metadata.participants || []
  const botId = cleanJid(client?.user?.id || client?.user?.jid || client?.user?.lid)
  const botNumber = onlyNumber(botId)

  const botCandidates = [
    botId,
    client?.user?.id,
    client?.user?.jid,
    client?.user?.lid,
    `${botNumber}@s.whatsapp.net`,
    `${botNumber}@lid`
  ].filter(Boolean)

  const userCandidates = [
    userJid,
    `${onlyNumber(userJid)}@s.whatsapp.net`,
    `${onlyNumber(userJid)}@lid`
  ].filter(Boolean)

  const botParticipant = findParticipant(participants, botCandidates)
  const userParticipant = findParticipant(participants, userCandidates)

  return {
    ok: true,
    metadata,
    participants,
    botParticipant,
    userParticipant,
    botIsAdmin: isAdminParticipant(botParticipant),
    userIsAdmin: isAdminParticipant(userParticipant),
    userProtected: isProtectedUser(userJid, userParticipant)
  }
}

async function kickExtremeLoser(client, chatId, userJid) {
  const info = await getGroupInfo(client, chatId, userJid)

  if (!info.ok) {
    return {
      ok: false,
      reason: info.reason
    }
  }

  if (isProtectedUser(userJid, info.userParticipant)) {
    return {
      ok: false,
      protected: true,
      reason: 'usuario protegido: owner o administrador'
    }
  }

  if (!info.botParticipant) {
    return {
      ok: false,
      reason: 'el bot no aparece como participante del grupo'
    }
  }

  if (!info.botIsAdmin) {
    return {
      ok: false,
      reason: 'el bot no es administrador'
    }
  }

  if (!info.userParticipant) {
    return {
      ok: false,
      reason: 'no encontré al usuario dentro del grupo'
    }
  }

  const target = getRemovalJid(info.userParticipant, userJid)

  try {
    await client.groupParticipantsUpdate(chatId, [target], 'remove')
    return {
      ok: true,
      reason: 'usuario expulsado'
    }
  } catch (error) {
    return {
      ok: false,
      reason: error?.message || String(error)
    }
  }
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MATH NORMAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function normalProblem(difficulty = 'facil') {
  if (difficulty === 'facil') {
    const type = pick(['sum', 'sub'])

    if (type === 'sum') {
      const a = rand(5, 40)
      const b = rand(5, 40)
      const problem = `${a} + ${b}`

      return {
        problem,
        cleanProblem: problem,
        answer: a + b
      }
    }

    const a = rand(20, 80)
    const b = rand(1, a)
    const problem = `${a} - ${b}`

    return {
      problem,
      cleanProblem: problem,
      answer: a - b
    }
  }

  if (difficulty === 'medio') {
    const type = pick(['sum', 'sub', 'mul', 'div'])

    if (type === 'sum') {
      const a = rand(30, 150)
      const b = rand(30, 150)
      const problem = `${a} + ${b}`

      return {
        problem,
        cleanProblem: problem,
        answer: a + b
      }
    }

    if (type === 'sub') {
      const a = rand(80, 250)
      const b = rand(20, a)
      const problem = `${a} - ${b}`

      return {
        problem,
        cleanProblem: problem,
        answer: a - b
      }
    }

    if (type === 'mul') {
      const a = rand(6, 18)
      const b = rand(3, 15)
      const problem = `${a} x ${b}`

      return {
        problem,
        cleanProblem: problem,
        answer: a * b
      }
    }

    const divisor = rand(2, 12)
    const result = rand(2, 20)
    const dividend = divisor * result
    const problem = `${dividend} / ${divisor}`

    return {
      problem,
      cleanProblem: problem,
      answer: result
    }
  }

  if (difficulty === 'dificil') {
    const type = pick(['mix1', 'mix2', 'mix3', 'mix4'])

    if (type === 'mix1') {
      const a = rand(8, 25)
      const b = rand(4, 15)
      const c = rand(20, 90)
      const problem = `${a} x ${b} + ${c}`

      return {
        problem,
        cleanProblem: problem,
        answer: a * b + c
      }
    }

    if (type === 'mix2') {
      const a = rand(20, 90)
      const b = rand(10, 80)
      const c = rand(2, 9)
      const problem = `(${a} + ${b}) x ${c}`

      return {
        problem,
        cleanProblem: problem,
        answer: (a + b) * c
      }
    }

    if (type === 'mix3') {
      const divisor = rand(2, 12)
      const result = rand(10, 40)
      const dividend = divisor * result
      const c = rand(15, 90)
      const problem = `${dividend} / ${divisor} + ${c}`

      return {
        problem,
        cleanProblem: problem,
        answer: result + c
      }
    }

    const a = rand(12, 30)
    const b = rand(8, 20)
    const c = rand(10, 80)
    const problem = `${a} x ${b} - ${c}`

    return {
      problem,
      cleanProblem: problem,
      answer: a * b - c
    }
  }

  if (difficulty === 'imposible') {
    const type = pick(['mix1', 'mix2', 'mix3'])

    if (type === 'mix1') {
      const a = rand(40, 120)
      const b = rand(30, 100)
      const c = rand(3, 12)
      const d = rand(20, 150)
      const problem = `(${a} + ${b}) x ${c} - ${d}`

      return {
        problem,
        cleanProblem: problem,
        answer: (a + b) * c - d
      }
    }

    if (type === 'mix2') {
      const a = rand(12, 35)
      const b = rand(10, 30)
      const c = rand(8, 25)
      const d = rand(6, 20)
      const problem = `${a} x ${b} + ${c} x ${d}`

      return {
        problem,
        cleanProblem: problem,
        answer: a * b + c * d
      }
    }

    const divisor = rand(3, 15)
    const result = rand(20, 80)
    const dividend = divisor * result
    const c = rand(4, 12)
    const d = rand(30, 120)
    const problem = `(${dividend} / ${divisor}) x ${c} + ${d}`

    return {
      problem,
      cleanProblem: problem,
      answer: result * c + d
    }
  }

  if (difficulty === 'imposible2') {
    const type = pick(['mix1', 'mix2', 'mix3'])

    if (type === 'mix1') {
      const a = rand(80, 180)
      const b = rand(40, 160)
      const c = rand(4, 14)
      const d = rand(20, 80)
      const e = rand(5, 20)
      const problem = `(${a} + ${b}) x ${c} + ${d} x ${e}`

      return {
        problem,
        cleanProblem: problem,
        answer: (a + b) * c + d * e
      }
    }

    if (type === 'mix2') {
      const a = rand(20, 60)
      const b = rand(10, 30)
      const c = rand(20, 200)
      const d = rand(10, 40)
      const e = rand(5, 25)
      const problem = `${a} x ${b} - ${c} + ${d} x ${e}`

      return {
        problem,
        cleanProblem: problem,
        answer: a * b - c + d * e
      }
    }

    const divisor = rand(4, 16)
    const result = rand(30, 120)
    const dividend = divisor * result
    const c = rand(10, 40)
    const d = rand(5, 20)
    const e = rand(10, 100)
    const problem = `(${dividend} / ${divisor}) + ${c} x ${d} - ${e}`

    return {
      problem,
      cleanProblem: problem,
      answer: result + c * d - e
    }
  }

  return normalProblem('facil')
}

function mathHelp(usedPrefix = '.') {
  return (
    `🧮 ▣ ᴍᴀᴛʜ\n` +
    `🎯 Elige una dificultad:\n` +
    `🟢 ${usedPrefix}math facil\n` +
    `🟡 ${usedPrefix}math medio\n` +
    `🟠 ${usedPrefix}math dificil\n` +
    `🔴 ${usedPrefix}math imposible\n` +
    `💀 ${usedPrefix}math imposible2\n` +
    `☠️ ${usedPrefix}math extremo\n` +
    `\n` +
    `⏳ Cooldown math normal: 15 minutos`
  )
}

async function startNormalGame(client, m, usedPrefix, difficulty, currency, senderReal, chatData) {
  const chatId = m.chat
  const challenge = normalProblem(difficulty)
  const config = CONFIG[difficulty]
  const reward = config.reward

  const text =
    `🧮 ▣ ʀᴇᴛᴏ ᴍᴀᴛʜ\n` +
    `${config.emoji} Dificultad: ${config.name}\n` +
    `🧩 Operación: ${challenge.problem}\n` +
    `💰 Premio: ${formatMoney(reward[0], currency)} - ${formatMoney(reward[1], currency)}\n` +
    `⏱️ Tiempo: ${Math.floor(config.time / 1000)}s\n` +
    `✍️ Responde: ${usedPrefix}resp resultado`

  await client.sendMessage(chatId, { text }, { quoted: m })

  const timer = setTimeout(async () => {
    const current = global.math[chatId]

    if (current?.active && current.mode === 'normal') {
      delete global.math[chatId]

      await client.sendMessage(chatId, {
        text:
          `⌛ ▣ ᴍᴀᴛʜ ᴛɪᴇᴍᴘᴏ\n` +
          `⏱️ Se acabó el reto.\n` +
          `🧩 Operación: ${challenge.cleanProblem}\n` +
          `✅ Respuesta: ${formatNumber(challenge.answer)}`
      })
    }
  }, config.time)

  if (typeof timer.unref === 'function') timer.unref()

  global.math[chatId] = {
    active: true,
    mode: 'normal',
    problem: challenge.problem,
    cleanProblem: challenge.cleanProblem,
    answer: challenge.answer,
    difficulty,
    attempts: 0,
    startedBy: m.sender,
    startedByReal: senderReal,
    endsAt: Date.now() + config.time,
    timer
  }

  setNormalCooldown(chatId, senderReal)
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MATH EXTREMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function extremeProblem() {
  const type = pick(['hell1', 'hell2', 'hell3', 'hell4', 'hell5'])

  if (type === 'hell1') {
    const a = rand(420, 980)
    const b = rand(37, 96)
    const c = rand(300, 850)
    const d = rand(25, 88)
    const divisor = rand(8, 24)
    const result = rand(300, 900)
    const dividend = divisor * result
    const e = rand(5000, 25000)

    const problem = `(${a} x ${b}) + (${c} x ${d}) - (${dividend} / ${divisor}) + ${e}`

    return {
      problem,
      cleanProblem: problem,
      answer: (a * b) + (c * d) - result + e
    }
  }

  if (type === 'hell2') {
    const a = rand(600, 1400)
    const b = rand(500, 1300)
    const c = rand(15, 45)
    const d = rand(300, 900)
    const e = rand(25, 75)
    const f = rand(10000, 60000)

    const problem = `((${a} + ${b}) x ${c}) - (${d} x ${e}) + ${f}`

    return {
      problem,
      cleanProblem: problem,
      answer: ((a + b) * c) - (d * e) + f
    }
  }

  if (type === 'hell3') {
    const a = rand(80, 190)
    const b = rand(40, 95)
    const c = rand(12, 38)
    const d = rand(700, 1800)
    const e = rand(300, 900)
    const divisor = rand(12, 30)
    const result = rand(500, 1400)
    const dividend = divisor * result

    const problem = `(${a} x ${b} x ${c}) + (${d} - ${e}) + (${dividend} / ${divisor})`

    return {
      problem,
      cleanProblem: problem,
      answer: (a * b * c) + (d - e) + result
    }
  }

  if (type === 'hell4') {
    const a = rand(2000, 7000)
    const b = rand(1200, 5000)
    const c = rand(18, 55)
    const d = rand(900, 2400)
    const e = rand(40, 99)
    const f = rand(25000, 90000)

    const problem = `(${a} + ${b}) x ${c} - ${d} x ${e} + ${f}`

    return {
      problem,
      cleanProblem: problem,
      answer: (a + b) * c - d * e + f
    }
  }

  const a = rand(300, 999)
  const b = rand(300, 999)
  const c = rand(20, 80)
  const divisor = rand(10, 40)
  const result = rand(1000, 3000)
  const dividend = divisor * result
  const d = rand(20000, 80000)

  const problem = `(${a} x ${b}) - (${dividend} / ${divisor}) + (${c} x ${c}) + ${d}`

  return {
    problem,
    cleanProblem: problem,
    answer: (a * b) - result + (c * c) + d
  }
}

function extremeWarningText(usedPrefix = '.', seconds = 30) {
  return (
    `☠️ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ\n` +
    `🔥 Has invocado el modo más cruel de RubyJX.\n` +
    `▪️ Operaciones enormes y pesadas.\n` +
    `▪️ Premio superior a S/75,000.\n` +
    `▪️ Tiempo menor a 80 segundos.\n` +
    `▪️ Si eres miembro normal y fallas, puedes ser expulsado.\n` +
    `▪️ Si eres owner o admin, el reto inicia, pero no te expulsa.\n` +
    `▪️ Cooldown extremo: 1 hora.\n` +
    `\n` +
    `📌 Tutorial rápido:\n` +
    `▪️ Responde si para aceptar.\n` +
    `▪️ Responde no para cancelar.\n` +
    `▪️ No uses prefijo para confirmar.\n` +
    `▪️ Luego usa ${usedPrefix}resp resultado.\n` +
    `\n` +
    `⚠️ Solo quien pidió el reto puede responder si o no.\n` +
    `⏱️ Tienes ${seconds}s para decidir.\n` +
    `\n` +
    `☠️ ¿Aceptas entrar al castigo matemático?`
  )
}

async function startExtremeGame(client, m, pending) {
  const db = global.db.data
  const chatId = m.chat
  const chatData = db.chats[chatId]
  const currency = pending.currency || 'Soles'
  const usedPrefix = pending.usedPrefix || '.'
  const player = pending.user
  const playerRaw = pending.rawUser
  const playerName = pending.name || 'Jugador'

  const cooldownLeft = getExtremeCooldownLeft(chatId, player)

  if (cooldownLeft > 0) {
    return m.reply(
      `⏳ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ\n` +
      `▪️ Todavía estás en cooldown.\n` +
      `▪️ Vuelve en: ${formatTime(cooldownLeft)}`
    )
  }

  const info = await getGroupInfo(client, chatId, player)
  const protectedPlayer =
    isOwnerUser(player) ||
    isOwnerUser(playerRaw) ||
    (info.ok && isProtectedUser(player, info.userParticipant))

  if (!info.ok && !protectedPlayer) {
    return m.reply(
      `⚠️ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ\n` +
      `▪️ No pude revisar permisos del grupo.\n` +
      `▪️ No iniciaré un reto con castigo si no puedo verificar seguridad.`
    )
  }

  if (!protectedPlayer) {
    if (!info.botIsAdmin) {
      return m.reply(
        `⚠️ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ ʙʟᴏǫᴜᴇᴀᴅᴏ\n` +
        `▪️ RubyJX necesita ser administrador.\n` +
        `▪️ Sin admin no puede expulsar.\n` +
        `▪️ Sin expulsión no hay modo extremo para miembros normales.`
      )
    }

    if (!info.userParticipant) {
      return m.reply(
        `⚠️ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ\n` +
        `▪️ No pude confirmar al jugador dentro del grupo.`
      )
    }
  }

  if (global.math[chatId]?.active) {
    return m.reply(
      `☠️ ▣ ᴍᴀᴛʜ ᴀᴄᴛɪᴠᴏ\n` +
      `▪️ Ya hay un reto en curso.\n` +
      `▪️ Espera a que termine.`
    )
  }

  const challenge = extremeProblem()
  const reward = getExtremeReward()

  await m.reply(
    `☠️ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ ᴀᴄᴇᴘᴛᴀᴅᴏ\n` +
    `🔥 Perfecto. Acabas de firmar tu sentencia matemática.\n` +
    `▪️ No hay segunda oportunidad.\n` +
    `▪️ Si eres miembro normal y fallas, RubyJX intentará expulsarte.\n` +
    `▪️ Si eres owner o admin, juegas protegido.\n` +
    `\n` +
    `Preparando operación extrema...`
  )

  await sleep(1200)

  const text =
    `🔥 ▣ ʀᴇᴛᴏ ᴅɪᴀʙóʟɪᴄᴏ\n` +
    `👤 Jugador: ${playerName}\n` +
    `🧠 Operación: ${challenge.problem}\n` +
    `💰 Premio: ${formatMoney(reward, currency)}\n` +
    `⏱️ Tiempo: ${Math.floor(EXTREME_TIME / 1000)}s\n` +
    `✍️ Responde: ${usedPrefix}resp resultado\n` +
    `☠️ Miembro normal: un error y el grupo te despide.\n` +
    `👑 Owner/Admin: protegido contra expulsión.`

  await client.sendMessage(chatId, { text }, { quoted: m })

  const timer = setTimeout(async () => {
    const current = global.math[chatId]

    if (current?.active && current.mode === 'extreme') {
      await punishExtreme(client, chatId, player, current, 'timeout')
    }
  }, EXTREME_TIME)

  if (typeof timer.unref === 'function') timer.unref()

  global.math[chatId] = {
    active: true,
    mode: 'extreme',
    problem: challenge.problem,
    cleanProblem: challenge.cleanProblem,
    answer: challenge.answer,
    reward,
    currency,
    player,
    playerRaw,
    playerName,
    protectedPlayer,
    attempts: 0,
    startedAt: Date.now(),
    endsAt: Date.now() + EXTREME_TIME,
    timer
  }

  setExtremeCooldown(chatId, player)
}

async function punishExtreme(client, chatId, userJid, game, reason = 'wrong') {
  let protectedNow = !!game.protectedPlayer

  const protectionInfo = await getGroupInfo(client, chatId, userJid)

  if (
    isOwnerUser(userJid) ||
    isOwnerUser(game.playerRaw) ||
    (protectionInfo?.ok && isProtectedUser(userJid, protectionInfo.userParticipant))
  ) {
    protectedNow = true
  }

  clearTimeout(game.timer)
  delete global.math[chatId]

  if (protectedNow) {
    await client.sendMessage(chatId, {
      text:
        `👑 ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ ғᴀʟʟɪᴅᴏ\n` +
        `▪️ El jugador falló, pero está protegido.\n` +
        `▪️ RubyJX no expulsa owners ni administradores.\n` +
        `🧠 Operación: ${game.cleanProblem}\n` +
        `✅ Respuesta correcta: ${formatNumber(game.answer)}`
    })

    return
  }

  const reasonText = reason === 'timeout'
    ? `⌛ Se acabó el tiempo.\nNi respuesta. Ni gloria.`
    : `💀 Respuesta incorrecta.\nLa operación te destruyó.`

  await client.sendMessage(chatId, {
    text:
      `☠️ ▣ sᴇɴᴛᴇɴᴄɪᴀ ᴇxᴛʀᴇᴍᴀ\n` +
      `${reasonText}\n` +
      `🧠 Operación: ${game.cleanProblem}\n` +
      `✅ Respuesta correcta: ${formatNumber(game.answer)}\n` +
      `⚰️ Castigo: expulsión inmediata.`
  })

  await sleep(1500)

  const kick = await kickExtremeLoser(client, chatId, userJid)

  if (!kick.ok) {
    const extra = kick.protected
      ? 'El usuario resultó ser owner o administrador.'
      : kick.reason

    await client.sendMessage(chatId, {
      text:
        `⚠️ ▣ ᴄᴀsᴛɪɢᴏ ɴᴏ ᴇᴊᴇᴄᴜᴛᴀᴅᴏ\n` +
        `▪️ Motivo: ${extra}\n` +
        `▪️ No pude expulsar al jugador.`
    })
  }
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  EXPORT DEL COMANDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

export default {
  command: ['math', 'mates', 'resp', 'mathextremo', 'mathextreme'],
  category: 'rpg',

  before: async function (m, { client }) {
    const chatId = m.chat
    const pending = global.mathExtremePending?.[chatId]

    if (!pending) return false

    const body = normalizeText(getBody(m))
    if (body !== 'si' && body !== 'no') return false

    let senderReal = m.sender

    try {
      senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
    } catch {}

    const isRequester =
      sameUser(senderReal, pending.user) ||
      sameUser(m.sender, pending.user) ||
      sameUser(m.sender, pending.rawUser)

    if (!isRequester) {
      await m.reply(
        `☠️ ▣ ɴᴏ ᴇs ᴛᴜ ʀᴇᴛᴏ\n` +
        `▪️ Este Math Extremo no te pertenece.\n` +
        `▪️ Solo ${pending.name} puede aceptar o cancelar.\n` +
        `▪️ Tu si/no no cuenta.`
      )

      return true
    }

    clearTimeout(pending.timer)
    delete global.mathExtremePending[chatId]

    if (body === 'no') {
      await m.reply(
        `🕯️ ▣ ʀᴇᴛᴏ ᴄᴀɴᴄᴇʟᴀᴅᴏ\n` +
        `▪️ Decidiste cancelar Math Extremo.\n` +
        `▪️ No hay castigo.\n` +
        `▪️ No hay premio.`
      )

      return true
    }

    if (body === 'si') {
      await startExtremeGame(client, m, pending)
      return true
    }

    return false
  },

  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const currentCommand = String(command || '').toLowerCase()

    db.chats[chatId] ||= {}
    db.chats[chatId].users ||= {}
    db.users ||= {}
    db.settings ||= {}

    const chatData = db.chats[chatId]

    const botRaw = client?.user?.id || client?.user?.jid || client?.user?.lid || ''
    const botId = cleanJid(botRaw)
    const botSettings = db.settings[botId] || {}
    const currency = botSettings.currency || 'Soles'

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(
        `🚫 ▣ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ\n` +
        `▪️ La economía está desactivada.\n` +
        `▪️ Actívala con: ${usedPrefix}economy on`
      )
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      RESPUESTAS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (currentCommand === 'resp') {
      const game = global.math[chatId]

      if (!game?.active) {
        return m.reply(
          `🧮 ▣ ᴍᴀᴛʜ\n` +
          `▪️ No hay ningún reto activo.\n` +
          `▪️ Crea uno con: ${usedPrefix}math facil`
        )
      }

      if (game.mode === 'extreme') {
        let senderReal = m.sender

        try {
          senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
        } catch {}

        const isPlayer =
          sameUser(senderReal, game.player) ||
          sameUser(m.sender, game.player) ||
          sameUser(m.sender, game.playerRaw)

        if (!isPlayer) {
          return m.reply(
            `☠️ ▣ ɴᴏ ᴛᴇ ᴍᴇᴛᴀs\n` +
            `▪️ Este reto pertenece a ${game.playerName}.\n` +
            `▪️ Tu respuesta no cuenta.`
          )
        }

        if (!args[0]) {
          await punishExtreme(client, chatId, game.player, game, 'wrong')
          return
        }

        const userAnswer = parseAnswer(args[0])
        const correctAnswer = Number(game.answer)

        if (isNaN(userAnswer)) {
          await punishExtreme(client, chatId, game.player, game, 'wrong')
          return
        }

        if (userAnswer === correctAnswer) {
          let userInfo = findUser(chatData, senderReal, m.sender)

          if (!userInfo) {
            userInfo = createLocalUser(chatData, senderReal || m.sender)
          }

          const user = userInfo.data
          if (!m.isOwner) user.coins = Number(user.coins || 0) + game.reward

          db.users[userInfo.key] ||= {}
          db.users[userInfo.key].name ||= m.pushName || m.pushname || userInfo.key.split('@')[0]

          clearTimeout(game.timer)
          delete global.math[chatId]

          return m.reply(
            `👑 ▣ ᴠɪᴄᴛᴏʀɪᴀ ᴇxᴛʀᴇᴍᴀ\n` +
            `🔥 Sobreviviste al Math Extremo.\n` +
            `✅ Respuesta: ${formatNumber(correctAnswer)}\n` +
            `💰 Premio: ${formatMoney(game.reward, game.currency)}\n` +
            `👛 Cartera: ${formatMoney(user.coins, game.currency)}`
          )
        }

        await punishExtreme(client, chatId, game.player, game, 'wrong')
        return
      }

      if (game.mode === 'normal') {
        if (!args[0]) {
          return m.reply(
            `✍️ ▣ ʀᴇsᴘᴜᴇsᴛᴀ\n` +
            `▪️ Escribe tu respuesta.\n` +
            `▪️ Ejemplo: ${usedPrefix}resp ${game.answer}`
          )
        }

        const userAnswer = parseAnswer(args[0])
        const correctAnswer = Number(game.answer)

        if (isNaN(userAnswer)) {
          return m.reply(
            `🔢 ▣ ʀᴇsᴘᴜᴇsᴛᴀ ɪɴᴠáʟɪᴅᴀ\n` +
            `▪️ Responde solo con número.\n` +
            `▪️ Ejemplo: ${usedPrefix}resp ${correctAnswer}`
          )
        }

        if (userAnswer === correctAnswer) {
          let senderReal = m.sender

          try {
            senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
          } catch {}

          let userInfo = findUser(chatData, senderReal, m.sender)

          if (!userInfo) {
            userInfo = createLocalUser(chatData, senderReal || m.sender)
          }

          const user = userInfo.data
          const reward = getReward(game.difficulty)

          if (!m.isOwner) user.coins = Number(user.coins || 0) + reward

          db.users[userInfo.key] ||= {}
          db.users[userInfo.key].name ||= m.pushName || m.pushname || userInfo.key.split('@')[0]

          clearTimeout(game.timer)
          delete global.math[chatId]

          return m.reply(
            `🎉 ▣ ᴍᴀᴛʜ ᴄᴏʀʀᴇᴄᴛᴏ\n` +
            `✅ Respuesta: ${formatNumber(correctAnswer)}\n` +
            `💰 Premio: ${formatMoney(reward, currency)}\n` +
            `👛 Cartera: ${formatMoney(user.coins, currency)}`
          )
        }

        game.attempts += 1

        const maxAttempts = CONFIG[game.difficulty]?.attempts || 3
        const remaining = maxAttempts - game.attempts

        if (remaining <= 0) {
          clearTimeout(game.timer)
          delete global.math[chatId]

          return m.reply(
            `💥 ▣ ᴍᴀᴛʜ ғᴀʟʟɪᴅᴏ\n` +
            `❌ Te quedaste sin intentos.\n` +
            `🧮 Operación: ${game.cleanProblem}\n` +
            `✅ Respuesta correcta: ${formatNumber(correctAnswer)}`
          )
        }

        return m.reply(
          `❌ ▣ ʀᴇsᴘᴜᴇsᴛᴀ ɪɴᴄᴏʀʀᴇᴄᴛᴀ\n` +
          `🔁 Intentos restantes: ${remaining}\n` +
          `✍️ Responde con: ${usedPrefix}resp número`
        )
      }
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      INICIAR MATH / MATH EXTREMO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (
      currentCommand === 'math' ||
      currentCommand === 'mates' ||
      currentCommand === 'mathextremo' ||
      currentCommand === 'mathextreme'
    ) {
      const requestedExtreme =
        currentCommand === 'mathextremo' ||
        currentCommand === 'mathextreme' ||
        normalizeText(args[0]) === 'extremo' ||
        normalizeText(args[0]) === 'extreme'

      if (requestedExtreme) {
        if (!m.isGroup) {
          return m.reply(
            `☠️ ▣ ᴍᴀᴛʜ ᴇxᴛʀᴇᴍᴏ\n` +
            `▪️ Este modo solo funciona en grupos.`
          )
        }

        if (global.math[chatId]?.active) {
          return m.reply(
            `☠️ ▣ ᴍᴀᴛʜ ᴀᴄᴛɪᴠᴏ\n` +
            `▪️ Ya hay un reto en curso.\n` +
            `▪️ Espera a que termine.`
          )
        }

        if (global.mathExtremePending[chatId]) {
          return m.reply(
            `☠️ ▣ ᴄᴏɴғɪʀᴍᴀᴄɪóɴ ᴘᴇɴᴅɪᴇɴᴛᴇ\n` +
            `▪️ Ya hay alguien decidiendo si entra al Math Extremo.\n` +
            `▪️ Espera unos segundos.`
          )
        }

        const senderReal = await getSenderReal(m, client)
        const cooldownLeft = getExtremeCooldownLeft(chatId, senderReal)

        if (cooldownLeft > 0) {
          return m.reply(
            `⏳ ▣ ᴄᴏᴏʟᴅᴏᴡɴ ᴇxᴛʀᴇᴍᴏ\n` +
            `▪️ Ya usaste Math Extremo recientemente.\n` +
            `▪️ Vuelve en: ${formatTime(cooldownLeft)}`
          )
        }

        const playerName = m.pushName || m.pushname || onlyNumber(senderReal) || 'Jugador'

        const timer = setTimeout(async () => {
          const current = global.mathExtremePending[chatId]

          if (current?.active) {
            delete global.mathExtremePending[chatId]

            await client.sendMessage(chatId, {
              text:
                `⌛ ▣ ᴅᴇᴄɪsɪóɴ ᴘᴇʀᴅɪᴅᴀ\n` +
                `▪️ El tiempo para aceptar terminó.\n` +
                `▪️ Reto cancelado.`
            })
          }
        }, EXTREME_CONFIRM_TIME)

        if (typeof timer.unref === 'function') timer.unref()

        global.mathExtremePending[chatId] = {
          active: true,
          user: senderReal,
          rawUser: m.sender,
          name: playerName,
          currency,
          usedPrefix,
          createdAt: Date.now(),
          expiresAt: Date.now() + EXTREME_CONFIRM_TIME,
          timer
        }

        return m.reply(extremeWarningText(usedPrefix, Math.floor(EXTREME_CONFIRM_TIME / 1000)))
      }

      const activeGame = global.math[chatId]

      if (activeGame?.active) {
        const secondsLeft = Math.max(1, Math.ceil((activeGame.endsAt - Date.now()) / 1000))

        return m.reply(
          `⏳ ▣ ᴍᴀᴛʜ ᴀᴄᴛɪᴠᴏ\n` +
          `🧩 Operación: ${activeGame.problem}\n` +
          `⏱️ Tiempo restante: ${secondsLeft}s\n` +
          `✍️ Responde con: ${usedPrefix}resp respuesta`
        )
      }

      const senderReal = await getSenderReal(m, client)
      const normalCooldownLeft = getNormalCooldownLeft(chatId, senderReal)

      if (normalCooldownLeft > 0) {
        return m.reply(
          `⏳ ▣ ᴄᴏᴏʟᴅᴏᴡɴ ᴍᴀᴛʜ\n` +
          `▪️ Ya usaste math recientemente.\n` +
          `▪️ Vuelve en: ${formatTime(normalCooldownLeft)}`
        )
      }

      const difficulty = normalizeText(args[0])

      if (!CONFIG[difficulty]) {
        return m.reply(mathHelp(usedPrefix))
      }

      await startNormalGame(client, m, usedPrefix, difficulty, currency, senderReal, chatData)
      return
    }
  }
}
