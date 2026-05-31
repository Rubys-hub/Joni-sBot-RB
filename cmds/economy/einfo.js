import { resolveLidToRealJid } from '../../core/utils.js'
import {
  getEconomyContext,
  economyOffText,
  applyCooldown
} from '../../core/vipNormalBonus.js'

const COFRE_BASE_COOLDOWN = 3 * 60 * 60 * 1000

export default {
  command: ['infoeconomy', 'cooldowns', 'economyinfo', 'einfo'],
  category: 'rpg',

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const db = global.db.data
      const chatId = m.chat

      db.chats[chatId] ||= {}
      db.chats[chatId].users ||= {}
      db.users ||= {}

      let senderReal = m.sender

      try {
        senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
      } catch {}

      const context = await getEconomyContext(client, m, usedPrefix)
      const chatData = context.chatData
      const vipBonus = context.vipBonus || {}

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      let userInfo = findUser(chatData, senderReal, m.sender)

      if (!userInfo) {
        userInfo = createLocalUser(chatData, senderReal || m.sender)
      }

      const user = userInfo.data
      const userKey = userInfo.key

      const now = Date.now()

      const cofreCooldown = safeCooldownApply(COFRE_BASE_COOLDOWN, vipBonus)
      const lastCofre = Number(user.lastCofre || user.lastcofre || 0)
      const cofreLeft = lastCofre > 0
        ? Math.max(0, cofreCooldown - (now - lastCofre))
        : 0

      const cooldowns = {
        work: getUntilLeft(user.lastwork, now),
        slut: getUntilLeft(user.lastslut, now),
        crime: getUntilLeft(user.lastcrime, now),
        mine: getUntilLeft(user.lastmine, now),
        ritual: getUntilLeft(user.lastinvoke, now),
        steal: getUntilLeft(user.laststeal, now),
        daily: getUntilLeft(user.lastdaily, now),
        weekly: getUntilLeft(user.lastweekly, now),
        monthly: getUntilLeft(user.lastmonthly, now),
        cofre: cofreLeft,
        math: getMathCooldownLeft(global.mathNormalCooldowns, chatId, senderReal, m.sender),
        mathextremo: getMathCooldownLeft(global.mathExtremeCooldowns, chatId, senderReal, m.sender)
      }

      const coins = Number(user.coins || 0)
      const bank = Number(user.bank || 0)
      const total = coins + bank

      const name =
        user.name ||
        db.users[userKey]?.name ||
        db.users[senderReal]?.name ||
        db.users[m.sender]?.name ||
        m.pushName ||
        m.pushname ||
        onlyNumber(userKey) ||
        'Usuario'

      const mensaje =
        `📊 *[ ⌬ ] ᴇᴄᴏɴᴏᴍʏ ɪɴғᴏ*\n` +
        `> Información económica del usuario\n\n` +

        `👤 *Usuario:* ${name}\n` +
        `🆔 *ID:* wa.me/${onlyNumber(userKey)}\n\n` +

        `💰 *⌬ Balance*\n` +
        `▪️ Cartera: *S/${formatNumber(coins)} Soles*\n` +
        `▪️ Banco: *S/${formatNumber(bank)} Soles*\n` +
        `▪️ Total: *S/${formatNumber(total)} Soles*\n\n` +

        `⏳ *⌬ Cooldowns*\n` +
        `▪️ Work: *${formatTime(cooldowns.work)}*\n` +
        `▪️ Slut: *${formatTime(cooldowns.slut)}*\n` +
        `▪️ Crime: *${formatTime(cooldowns.crime)}*\n` +
        `▪️ Mine: *${formatTime(cooldowns.mine)}*\n` +
        `▪️ Ritual: *${formatTime(cooldowns.ritual)}*\n` +
        `▪️ Steal: *${formatTime(cooldowns.steal)}*\n` +
        `▪️ Daily: *${formatTime(cooldowns.daily)}*\n` +
        `▪️ Weekly: *${formatTime(cooldowns.weekly)}*\n` +
        `▪️ Monthly: *${formatTime(cooldowns.monthly)}*\n` +
        `▪️ Cofre: *${formatTime(cooldowns.cofre)}*\n` +
        `▪️ Math: *${formatTime(cooldowns.math)}*\n` +
        `▪️ Math Extremo: *${formatTime(cooldowns.mathextremo)}*`

      await client.sendMessage(chatId, { text: mensaje }, { quoted: m })
    } catch (error) {
      return m.reply(
        `⚠️ *[ ⌬ ] ᴇɪɴғᴏ ᴇʀʀᴏʀ*\n` +
        `> ${error?.message || String(error)}`
      )
    }
  }
}

function getUntilLeft(value = 0, now = Date.now()) {
  return Math.max(0, Number(value || 0) - now)
}

function safeCooldownApply(baseCooldown = 0, vipBonus = {}) {
  try {
    return applyCooldown(baseCooldown, vipBonus)
  } catch {
    return baseCooldown
  }
}

function getMathCooldownLeft(store = {}, chatId = '', ...jids) {
  const now = Date.now()
  const keys = new Set()

  for (const jid of jids) {
    const clean = cleanJid(jid)
    const number = onlyNumber(clean)

    if (number) keys.add(`${chatId}:${number}`)
    if (clean) keys.add(`${chatId}:${clean}`)
  }

  let left = 0

  for (const key of keys) {
    const until = Number(store?.[key] || 0)
    left = Math.max(left, until - now)
  }

  return Math.max(0, left)
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

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString()
}

function formatTime(ms = 0) {
  ms = Number(ms || 0)

  if (ms <= 0) return 'Disponible'

  const totalSeconds = Math.ceil(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 && days <= 0) parts.push(`${seconds}s`)

  return parts.length ? parts.join(' ') : 'Disponible'
}