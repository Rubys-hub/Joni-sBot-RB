import moment from 'moment-timezone'
import {
  normalizeJid,
  onlyNumber,
  sameUserIdentity,
  resolveLidToRealJid
} from '../../core/utils.js'

const TIMEZONE = 'America/Lima'
const MIN_ACTIVE_DAYS = 3
const MILESTONE_BONUS = {
  3: 2500,
  7: 8000,
  15: 20000,
  30: 60000,
  100: 250000
}

function ensureNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function todayKey() {
  return moment().tz(TIMEZONE).format('YYYY-MM-DD')
}

function yesterdayKey() {
  return moment().tz(TIMEZONE).subtract(1, 'day').format('YYYY-MM-DD')
}

function formatDay(day = '') {
  if (!day) return 'Sin registrar'
  return moment.tz(day, 'YYYY-MM-DD', TIMEZONE).format('DD/MM/YYYY')
}

function formatNumber(amount = 0) {
  return Math.floor(Number(amount || 0)).toLocaleString('en-US')
}

function formatMoney(amount = 0, currency = 'Soles') {
  return `S/${formatNumber(amount)} ${currency}`
}

function ensureRacha(user = {}) {
  if (!user.racha || typeof user.racha !== 'object' || Array.isArray(user.racha)) {
    user.racha = {}
  }

  user.racha.current = ensureNumber(user.racha.current, 0)
  user.racha.best = ensureNumber(user.racha.best, 0)
  user.racha.lastDay ||= ''
  user.racha.totalDays = ensureNumber(user.racha.totalDays, 0)
  user.racha.totalRewards = ensureNumber(user.racha.totalRewards, 0)
  user.racha.lastReward = ensureNumber(user.racha.lastReward, 0)
  user.racha.activeSince ||= ''

  return user.racha
}

function getBotJid(client = {}) {
  return normalizeJid(client?.user?.id || client?.user?.jid || client?.user?.lid || '')
}

function getCurrency(client = {}) {
  const db = global.db?.data || {}
  const botJid = getBotJid(client)
  return db.settings?.[botJid]?.currency || 'Soles'
}

function getMessageText(m = {}) {
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

function getPrefixList(settings = {}) {
  if (Array.isArray(settings.prefix)) return settings.prefix.filter(Boolean).map(String)
  if (typeof settings.prefix === 'string') return [settings.prefix]
  return ['/', '!', '.', '#']
}

function getBotNamePrefixes(settings = {}) {
  const rawBotname = settings.namebot || settings.botname || 'RubyJX'
  const cleanBotname = String(rawBotname).replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'RubyJX'
  const type = String(settings.type || 'Main').trim() || 'Main'
  const base = cleanBotname.split(/\s+/)[0] || cleanBotname

  return [
    cleanBotname,
    cleanBotname.charAt(0),
    base,
    type.split(/\s+/)[0],
    base.slice(0, 2),
    base.slice(0, 3)
  ].filter(Boolean)
}

function looksLikeCommand(text = '', settings = {}) {
  const clean = String(text || '').trim()
  if (!clean) return false

  const lower = clean.toLowerCase()

  if (settings.prefix === true) {
    const firstToken = lower
      .split(/\s+/)[0]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    return global.comandos?.has(firstToken)
  }

  const prefixes = getPrefixList(settings)
  const botNames = getBotNamePrefixes(settings).map(name => name.toLowerCase())

  return prefixes.some(prefix => {
    const lowerPrefix = String(prefix).toLowerCase()
    if (lower.startsWith(lowerPrefix)) return true

    return botNames.some(name => lower.startsWith(`${name}${lowerPrefix}`))
  })
}

function findUserKey(users = {}, ...jids) {
  for (const jid of jids) {
    const clean = normalizeJid(jid)
    if (clean && users[clean]) return clean

    const found = Object.keys(users).find(key => sameUserIdentity(key, clean || jid))
    if (found) return found
  }

  return null
}

async function safeResolve(jid = '', client, chatId = '') {
  try {
    return await resolveLidToRealJid(jid, client, chatId)
  } catch {
    return normalizeJid(jid)
  }
}

function getRewardInfo(streak = 0) {
  const current = Math.floor(Number(streak || 0))

  if (current < MIN_ACTIVE_DAYS) {
    return {
      base: 0,
      bonus: 0,
      total: 0
    }
  }

  const base = 1000 + current * 250
  const bonus = MILESTONE_BONUS[current] || 0

  return {
    base,
    bonus,
    total: base + bonus
  }
}

function shouldAnnounce(streak = 0) {
  return streak === MIN_ACTIVE_DAYS || !!MILESTONE_BONUS[streak]
}

function buildAutoText({ jid = '', name = 'Usuario', streak = 0, best = 0, reward, currency = 'Soles', balance = 0 }) {
  const title = streak === MIN_ACTIVE_DAYS
    ? '🔥 RACHA ACTIVADA'
    : '🏆 RACHA ESPECIAL'

  const bonusLine = reward.bonus > 0
    ? `┃ 🎁 Bono especial: *${formatMoney(reward.bonus, currency)}*\n`
    : ''

  return (
    `╭━━〔 ${title} 〕━━⬣\n` +
    `┃ 👤 Usuario: *@${onlyNumber(jid)}*\n` +
    `┃ ✨ Estado: *${name} ya lleva ${streak} días hablando*\n` +
    `┃ 🔥 Racha actual: *${streak} días*\n` +
    `┃ 🏅 Mejor racha: *${best} días*\n` +
    bonusLine +
    `┃ 🪙 Premio: *${formatMoney(reward.total, currency)}*\n` +
    `┃ 👛 Cartera: *${formatMoney(balance, currency)}*\n` +
    `╰━━〔 Usa .inforacha 〕━━⬣`
  )
}

async function updateMessageStreak(client, m) {
  if (!m?.isGroup || m?.key?.fromMe || m?.fromMe) return

  const db = global.db?.data
  if (!db) return

  const chat = db.chats?.[m.chat]
  if (!chat || chat.racha !== true) return
  if (chat.adminonly || !chat.economy || chat.isBanned || chat.isMute) return

  const botJid = getBotJid(client)
  if (chat.primaryBot && chat.primaryBot !== botJid) return

  const settings = db.settings?.[botJid] || {}
  const text = getMessageText(m)

  if (!text || looksLikeCommand(text, settings)) return

  chat.users ||= {}
  const userKey = findUserKey(chat.users, m.sender, m.senderReal) || m.sender
  chat.users[userKey] ||= {}

  const user = chat.users[userKey]
  user.id ||= userKey
  user.name = m.pushName || user.name || 'Usuario'
  user.coins = ensureNumber(user.coins, 0)

  const racha = ensureRacha(user)
  const today = todayKey()

  if (racha.lastDay === today) return

  const previous = racha.current
  const nextStreak = racha.lastDay === yesterdayKey()
    ? previous + 1
    : 1

  racha.current = nextStreak
  racha.lastDay = today
  racha.totalDays += 1
  racha.best = Math.max(racha.best, nextStreak)

  if (nextStreak >= MIN_ACTIVE_DAYS) {
    racha.activeSince ||= today
  } else {
    racha.activeSince = ''
  }

  const reward = getRewardInfo(nextStreak)
  racha.lastReward = reward.total

  if (!m.isOwner && reward.total > 0) {
    user.coins += reward.total
    racha.totalRewards += reward.total
  }

  if (!shouldAnnounce(nextStreak)) return

  const currency = getCurrency(client)

  return client.sendMessage(m.chat, {
    text: buildAutoText({
      jid: userKey,
      name: user.name,
      streak: nextStreak,
      best: racha.best,
      reward,
      currency,
      balance: user.coins
    }),
    mentions: [userKey]
  }, { quoted: m })
}

function getInfoStatus(racha = {}) {
  const today = todayKey()
  const yesterday = yesterdayKey()

  if (!racha.lastDay) {
    return {
      status: 'Sin iniciar',
      effectiveCurrent: 0,
      expired: false,
      alreadyToday: false
    }
  }

  const expired = racha.lastDay !== today && racha.lastDay !== yesterday
  const effectiveCurrent = expired ? 0 : racha.current

  if (expired) {
    return {
      status: 'Rota por inactividad',
      effectiveCurrent,
      expired,
      alreadyToday: false
    }
  }

  return {
    status: effectiveCurrent >= MIN_ACTIVE_DAYS ? 'Activa' : 'Preparando',
    effectiveCurrent,
    expired,
    alreadyToday: racha.lastDay === today
  }
}

function getNextStreakForInfo(racha = {}, info = {}) {
  if (!racha.lastDay || info.expired) return 1
  if (info.alreadyToday) return info.effectiveCurrent + 1
  if (racha.lastDay === yesterdayKey()) return info.effectiveCurrent + 1
  return 1
}

function buildInfoText({ chatEnabled = false, usedPrefix = '.', jid = '', name = 'Usuario', racha, user, currency = 'Soles' }) {
  if (!chatEnabled) {
    return (
      `╭━━〔 🔥 RACHAS OFF 〕━━⬣\n` +
      `┃ 📴 Las rachas están desactivadas en este grupo.\n` +
      `┃ 🔧 Un admin puede activarlas con: *${usedPrefix}setracha on*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━⬣`
    )
  }

  const info = getInfoStatus(racha)
  const nextStreak = getNextStreakForInfo(racha, info)
  const nextReward = getRewardInfo(nextStreak)
  const daysLeft = Math.max(0, MIN_ACTIVE_DAYS - info.effectiveCurrent)
  const activationText = info.effectiveCurrent >= MIN_ACTIVE_DAYS
    ? `┃ ✅ Activada desde: *${formatDay(racha.activeSince || racha.lastDay)}*\n`
    : `┃ ⏳ Faltan: *${daysLeft} día${daysLeft === 1 ? '' : 's'}* para activarla\n`

  const nextRewardText = nextReward.total > 0
    ? `┃ 🎁 Próximo premio: *${formatMoney(nextReward.total, currency)}* en día ${nextStreak}\n`
    : `┃ 🎁 Premio: *empieza al día ${MIN_ACTIVE_DAYS}*\n`

  return (
    `╭━━〔 🔥 INFO RACHA 〕━━⬣\n` +
    `┃ 👤 Usuario: *@${onlyNumber(jid)}*\n` +
    `┃ 🪪 Nombre: *${name}*\n` +
    `┃ 📌 Estado: *${info.status}*\n` +
    `┃\n` +
    `┃ 🔥 Racha actual: *${info.effectiveCurrent} días*\n` +
    `┃ 🏆 Mejor racha: *${racha.best} días*\n` +
    `┃ 📅 Último día: *${formatDay(racha.lastDay)}*\n` +
    activationText +
    `┃\n` +
    nextRewardText +
    `┃ 💰 Premios ganados: *${formatMoney(racha.totalRewards, currency)}*\n` +
    `┃ 👛 Cartera: *${formatMoney(user.coins || 0, currency)}*\n` +
    `╰━━〔 Habla cada día 〕━━⬣`
  )
}

function buildMenuText({ usedPrefix = '.', currency = 'Soles' }) {
  const rewards = [3, 7, 15, 30, 100]
    .map(day => `┃ 🎁 Día ${day}: *${formatMoney(getRewardInfo(day).total, currency)}*`)
    .join('\n')

  return (
    `╭━━〔 🔥 MENÚ DE RACHAS 〕━━⬣\n` +
    `┃ ✅ Estado: *activado en este grupo*\n` +
    `┃ 🗣️ Las rachas suben hablando 1 vez al día.\n` +
    `┃ ⚠️ Los comandos no cuentan como actividad.\n` +
    `┃ 🌎 Horario: *America/Lima*\n` +
    `┣━━〔 📌 COMANDOS 〕━━⬣\n` +
    `┃ 🔥 *${usedPrefix}racha*\n` +
    `┃    Abre este menú de ayuda.\n` +
    `┃ 📊 *${usedPrefix}inforacha*\n` +
    `┃    Muestra tu racha, mejor marca y premios.\n` +
    `┃ 👥 *${usedPrefix}inforacha @usuario*\n` +
    `┃    Revisa la racha de otra persona.\n` +
    `┃ 🔁 Aliases: *${usedPrefix}streakinfo* / *${usedPrefix}rachainfo*\n` +
    `┃ 🛠️ *${usedPrefix}setracha on*\n` +
    `┃    Activa las rachas del grupo. Solo admins/owner.\n` +
    `┃ 📴 *${usedPrefix}setracha off*\n` +
    `┃    Desactiva las rachas del grupo. Solo admins/owner.\n` +
    `┣━━〔 🎁 PREMIOS 〕━━⬣\n` +
    rewards + `\n` +
    `┣━━〔 ✨ REGLAS RÁPIDAS 〕━━⬣\n` +
    `┃ 🔥 La racha se anuncia desde el día *3*.\n` +
    `┃ 📅 Si pasas 1 día sin hablar, se reinicia.\n` +
    `┃ 💰 Los premios llegan automáticamente.\n` +
    `╰━━〔 Mantén el fuego vivo 〕━━⬣`
  )
}

export default {
  command: ['racha', 'inforacha', 'streakinfo', 'rachainfo'],
  category: 'grupo',
  group: true,

  all: async (m, { client }) => {
    try {
      await updateMessageStreak(client, m)
    } catch (error) {
      console.error('racha auto error:', error?.message || error)
    }
  },

  run: async (client, m, args = [], usedPrefix = '.', command = '') => {
    const db = global.db.data
    const chat = db.chats[m.chat]
    const currency = getCurrency(client)

    if (String(command || '').toLowerCase() === 'racha') {
      if (chat.racha !== true) {
        return m.reply(
          `╭━━〔 🔥 RACHAS OFF 〕━━⬣\n` +
          `┃ 📴 Las rachas están desactivadas en este grupo.\n` +
          `┃ 🛠️ Un admin puede activarlas con:\n` +
          `┃ ➜ *${usedPrefix}setracha on*\n` +
          `╰━━━━━━━━━━━━━━━━━━⬣`
        )
      }

      return m.reply(buildMenuText({ usedPrefix, currency }))
    }

    const mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
    const targetRaw = mentioned[0] || m.quoted?.sender || m.sender
    const targetReal = await safeResolve(targetRaw, client, m.chat)
    const userKey = findUserKey(chat.users || {}, targetReal, targetRaw, m.sender) || targetRaw
    const user = chat.users?.[userKey]

    if (!user) {
      return m.reply(
        `╭━━〔 👤 SIN REGISTRO 〕━━⬣\n` +
        `┃ Ese usuario aún no tiene actividad registrada.\n` +
        `┃ 🔥 Su racha empezará cuando hable en el grupo.\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    const racha = ensureRacha(user)
    const name = db.users?.[userKey]?.name || user.name || 'Usuario'

    return client.sendMessage(m.chat, {
      text: buildInfoText({
        chatEnabled: chat.racha === true,
        usedPrefix,
        jid: userKey,
        name,
        racha,
        user,
        currency
      }),
      mentions: [userKey]
    }, { quoted: m })
  }
}
