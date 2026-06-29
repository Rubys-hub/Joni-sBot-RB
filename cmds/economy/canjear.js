import fs from 'fs'
import path from 'path'

import {
  loadEventoDB,
  saveEventoDB,
  addEventoTickets,
  addEventoFragments,
  pushEventoLog
} from '../adminabuse/eventoDB.js'

const DB_PATH = './cmds/economy/database/codes.json'
const HOUR = 60 * 60 * 1000
const PERMANENT_UNTIL = 4102444800000

function ensureDB() {
  const dir = path.dirname(DB_PATH)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ codes: {} }, null, 2))
  }

  try {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    db.codes ||= {}
    return db
  } catch {
    const db = { codes: {} }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
    return db
  }
}

function saveDB(db = {}) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function formatMoney(num = 0) {
  return `S/${formatNumber(Math.floor(Number(num || 0)))}`
}

function normalizeCode(code = '') {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
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

function findUserKey(users = {}, jid = '') {
  const target = cleanJid(jid)
  if (users[target]) return target

  const found = Object.keys(users).find(key => sameUser(key, target))
  return found || target
}

function saveMainDB() {
  if (typeof global.saveDatabase === 'function') {
    global.saveDatabase()
  }
}

function formatTime(ms = 0) {
  const n = Math.max(0, Number(ms || 0))

  if (n <= 0) return 'finalizado'

  const h = Math.floor(n / HOUR)
  const m = Math.floor((n % HOUR) / (60 * 1000))
  const s = Math.floor((n % (60 * 1000)) / 1000)

  const parts = []
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  if (!h && !m && s) parts.push(`${s}s`)

  return parts.length ? parts.join(' ') : 'menos de 1s'
}

function eventRewardTip(type = '', usedPrefix = '.') {
  if (type === 'fragments') {
    return `\n> 🎟️ *Fragmentos VIP:* se guardan para canjear VIP temporal.\n> Usa: *${usedPrefix}vipcraft* o *${usedPrefix}evento canjear 1d*`
  }

  if (type === 'tickets') {
    return `\n> 🎫 *Boletos:* sirven para el sorteo final del evento activo.\n> Mientras más boletos tengas, más chances tienes.`
  }

  if (type === 'viptrial') {
    return `\n> 💎 *VIP temporal:* activa beneficios por tiempo limitado.\n> Si ya tienes VIP activo, se convierte en fragmentos.`
  }

  if (type === 'soles') {
    return `\n> 💰 *SOLES:* se agregaron a tu cartera local de este grupo.`
  }

  return ''
}

function getGlobalUser(jid = '') {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.users ||= {}

  const data = global.db.data
  const key = findUserKey(data.users, jid)

  data.users[key] ||= {}
  data.users[key].vip ||= {}

  return {
    key,
    user: data.users[key]
  }
}

function ensureVip(user = {}) {
  user.vip ||= {}

  if (typeof user.vip.active !== 'boolean') user.vip.active = false
  if (typeof user.vip.type !== 'string') user.vip.type = ''
  if (typeof user.vip.since !== 'number') user.vip.since = 0
  if (typeof user.vip.until !== 'number') user.vip.until = 0
  if (typeof user.vip.title !== 'string') user.vip.title = ''
  if (typeof user.vip.permanent !== 'boolean') user.vip.permanent = false

  return user.vip
}

function isPermanentVip(vip = {}) {
  return !!vip.permanent || Number(vip.until || 0) >= PERMANENT_UNTIL
}

function isVipActive(user = {}) {
  const vip = ensureVip(user)
  const type = String(vip.type || '').toLowerCase()

  if (!vip.active || !['basico', 'plus', 'ultra'].includes(type)) return false

  if (isPermanentVip(vip)) {
    vip.active = true
    return true
  }

  if (Number(vip.until || 0) <= Date.now()) {
    vip.active = false
    return false
  }

  return true
}

function grantVipTrial(user = {}, ms = HOUR, givenBy = '', reason = 'evento-codigo') {
  const vip = ensureVip(user)
  const now = Date.now()

  if (isVipActive(user)) {
    return {
      ok: false,
      reason: 'already_vip'
    }
  }

  vip.active = true
  vip.type = 'basico'
  vip.since = now
  vip.until = now + Math.max(HOUR, Number(ms || HOUR))
  vip.permanent = false
  vip.givenBy = givenBy
  vip.reason = reason

  return {
    ok: true,
    until: vip.until
  }
}

function applyEventoSoles(chatId = '', jid = '', amount = 0, { skipBalance = false } = {}) {
  global.db ||= {}
  global.db.data ||= {}
  global.db.data.chats ||= {}

  const data = global.db.data

  data.chats[chatId] ||= {}
  data.chats[chatId].users ||= {}

  const key = findUserKey(data.chats[chatId].users, jid)

  data.chats[chatId].users[key] ||= {}

  const user = data.chats[chatId].users[key]

  if (typeof user.coins !== 'number') user.coins = 0
  if (typeof user.bank !== 'number') user.bank = 0

  if (!skipBalance) user.coins += Math.floor(Number(amount || 0))

  saveMainDB()

  return user.coins
}

function applyEventoVipOrConvert(eventDb = {}, jid = '', ms = HOUR, givenBy = '') {
  const { user } = getGlobalUser(jid)

  if (isVipActive(user)) {
    const fragments = Math.max(10, Math.floor(Number(ms || HOUR) / HOUR) * 3)
    const total = addEventoFragments(eventDb, jid, fragments)

    return {
      type: 'converted',
      fragments,
      total
    }
  }

  const result = grantVipTrial(user, ms, givenBy, 'evento-codigo')
  saveMainDB()

  if (!result.ok) {
    const total = addEventoFragments(eventDb, jid, 15)
    return {
      type: 'converted',
      fragments: 15,
      total
    }
  }

  eventDb.active ||= {}
  eventDb.active.rewardsGiven ||= {}
  eventDb.active.rewardsGiven.vipTrials = Number(eventDb.active.rewardsGiven.vipTrials || 0) + 1

  return {
    type: 'vip',
    until: result.until
  }
}

function normalizeDropStock(drop = {}) {
  drop.redeemed ||= {}

  if (!Number.isFinite(Number(drop.initialStock))) {
    drop.initialStock = Number.isFinite(Number(drop.stock)) ? Number(drop.stock) : 1
  }

  if (!Number.isFinite(Number(drop.stock))) {
    if (drop.claimedBy) {
      drop.stock = 0
      drop.redeemed[cleanJid(drop.claimedBy)] = Number(drop.claimedAt || Date.now())
    } else {
      drop.stock = Number(drop.initialStock || 1)
    }
  }

  drop.stock = Math.max(0, Math.floor(Number(drop.stock || 0)))
  drop.initialStock = Math.max(1, Math.floor(Number(drop.initialStock || 1)))

  return drop
}

function buildSorteosRedeemNotice({ groupName = '', user = '', code = '', drop = {}, stockLeft = 0 } = {}) {
  let prize = 'premio especial'

  if (drop.type === 'soles') prize = `${formatMoney(drop.amount)}`
  if (drop.type === 'fragments') prize = `${formatNumber(drop.amount)} fragmentos VIP`
  if (drop.type === 'tickets') prize = `${formatNumber(drop.amount)} boletos`
  if (drop.type === 'viptrial') prize = `VIP Básico ${formatTime(drop.amount)}`

  return (
    `> *[ ⌬ ] ✅ CÓDIGO CANJEADO*\n\n` +
    `${user ? `👤 *Usuario:* @${onlyNumber(user)}\n` : ''}` +
    `🔐 *Código:* ${code}\n` +
    `🎁 *Premio:* ${prize}\n` +
    `📦 *Stock restante:* ${formatNumber(stockLeft)}\n\n` +
    `_Canje registrado en el grupo de sorteos._`
  )
}

async function notifySorteos(client, eventDb = {}, originChat = '', text = '') {
  const sorteos = String(eventDb.settings?.sorteosGroup || '')
  if (!sorteos || sorteos === originChat) return false

  try {
    await client.sendMessage(sorteos, { text })
    return true
  } catch (error) {
    console.log('[CANJEAR EVENTO AVISO ERROR]', error?.message || error)
    return false
  }
}

async function tryRedeemEventoCode(client, m, codeText = '', usedPrefix = '.') {
  const eventDb = await loadEventoDB().catch(() => null)

  if (!eventDb?.active?.drops?.[codeText]) {
    return {
      handled: false
    }
  }

  eventDb.active ||= {}
  eventDb.active.rewardsGiven ||= {}

  const drop = normalizeDropStock(eventDb.active.drops[codeText])
  const sender = cleanJid(m.sender)

  if (!eventDb.active.enabled || Number(eventDb.active.endsAt || 0) <= Date.now()) {
    return {
      handled: true,
      text:
        `> *[ ⌬ ] 🔐 CÓDIGO DEL EVENTO*\n\n` +
        `🚫 El evento ya no está activo.\n\n` +
        `_Este código pertenecía a un evento temporal._`
    }
  }

  if (!String(m.chat || '').endsWith('@g.us')) {
    return {
      handled: true,
      text:
        `> *[ ⌬ ] 🔐 CÓDIGO DEL EVENTO*\n\n` +
        `🚫 Este código solo se puede canjear en grupos.`
    }
  }

  if (drop.chat !== m.chat) {
    return {
      handled: true,
      text:
        `> *[ ⌬ ] 🔒 CÓDIGO DE OTRO GRUPO*\n\n` +
        `🚫 Este código cayó en otro grupo.\n\n` +
        `_Cada premio automático se reclama solo donde apareció._`
    }
  }

  if (Number(drop.expiresAt || 0) <= Date.now()) {
    delete eventDb.active.drops[codeText]
    await saveEventoDB(eventDb)

    return {
      handled: true,
      text:
        `> *[ ⌬ ] ⌛ CÓDIGO EXPIRADO*\n\n` +
        `🚫 El código ya venció.\n\n` +
        `_Los códigos del evento duran poco para evitar abuso._`
    }
  }

  if (drop.redeemed[sender]) {
    return {
      handled: true,
      text:
        `> *[ ⌬ ] ⚠️ YA CANJEADO*\n\n` +
        `🚫 Ya reclamaste este código.\n\n` +
        `_Cada usuario solo puede reclamarlo una vez._`
    }
  }

  if (Number(drop.stock || 0) <= 0) {
    return {
      handled: true,
      text:
        `> *[ ⌬ ] 📦 STOCK AGOTADO*\n\n` +
        `🚫 Este código ya no tiene canjes disponibles.\n\n` +
        `_Llegaste tarde esta vez._`
    }
  }

  let resultText = ''

  if (drop.type === 'soles') {
    applyEventoSoles(m.chat, sender, drop.amount, { skipBalance: m.isOwner })
    eventDb.active.rewardsGiven.soles = Number(eventDb.active.rewardsGiven.soles || 0) + Number(drop.amount || 0)

    resultText =
      `💰 *Ganaste:* ${formatMoney(drop.amount)}` +
      eventRewardTip('soles', usedPrefix)
  }

  if (drop.type === 'fragments') {
    const total = addEventoFragments(eventDb, sender, drop.amount)
    eventDb.active.rewardsGiven.fragments = Number(eventDb.active.rewardsGiven.fragments || 0) + Number(drop.amount || 0)

    resultText =
      `🎟️ *Ganaste:* ${formatNumber(drop.amount)} fragmentos VIP\n` +
      `📌 *Total:* ${formatNumber(total)}` +
      eventRewardTip('fragments', usedPrefix)
  }

  if (drop.type === 'tickets') {
    const total = addEventoTickets(eventDb, sender, drop.amount)
    eventDb.active.rewardsGiven.tickets = Number(eventDb.active.rewardsGiven.tickets || 0) + Number(drop.amount || 0)

    resultText =
      `🎫 *Ganaste:* ${formatNumber(drop.amount)} boletos\n` +
      `🏆 *Tus boletos:* ${formatNumber(total)}` +
      eventRewardTip('tickets', usedPrefix)
  }

  if (drop.type === 'viptrial') {
    const applied = applyEventoVipOrConvert(eventDb, sender, drop.amount, eventDb.active.startedBy)

    if (applied.type === 'vip') {
      resultText =
        `💎 *Ganaste:* VIP Básico ${formatTime(drop.amount)}` +
        eventRewardTip('viptrial', usedPrefix)
    } else {
      resultText =
        `🎟️ *Premio convertido:* ${formatNumber(applied.fragments)} fragmentos VIP\n` +
        `📌 *Total:* ${formatNumber(applied.total)}\n` +
        `_Ya tenías VIP activo._` +
        eventRewardTip('fragments', usedPrefix)
    }
  }

  drop.stock = Math.max(0, Number(drop.stock || 0) - 1)
  drop.redeemed[sender] = Date.now()
  drop.claimedBy = sender
  drop.claimedAt = Date.now()

  pushEventoLog(eventDb, {
    action: 'DROP_CLAIM_CANJEAR',
    chat: m.chat,
    jid: sender,
    amount: drop.amount,
    reward: drop.type,
    detail: codeText
  })

  await saveEventoDB(eventDb)

  await notifySorteos(
    client,
    eventDb,
    m.chat,
    buildSorteosRedeemNotice({
      groupName: eventDb.sharedGroupsCache?.groups?.[m.chat]?.name || m.subject || m.name || 'Grupo',
      user: sender,
      code: codeText,
      drop,
      stockLeft: drop.stock
    })
  )

  return {
    handled: true,
    text:
      `> *[ ⌬ ] ✅ CÓDIGO DEL EVENTO CANJEADO*\n\n` +
      `👤 *Usuario:* @${onlyNumber(sender)}\n` +
      `🔐 *Código:* ${codeText}\n` +
      `📦 *Stock restante:* ${formatNumber(drop.stock)}\n` +
      `${resultText}`
  }
}

export default {
  command: ['canjear'],
  category: 'rpg',
  group: true,

  run: async (client, m, args, usedPrefix = '.', command = 'canjear') => {
    try {
      global.db ||= {}
      global.db.data ||= {}
      global.db.data.chats ||= {}
      global.db.data.settings ||= {}

      const data = global.db.data
      data.chats[m.chat] ||= {}
      data.chats[m.chat].users ||= {}

      const chatData = data.chats[m.chat]
      const codeText = normalizeCode(args[0])

      if (!codeText) {
        return m.reply(
          `> *[ ⌬ ] 🎟️ FALTA CÓDIGO*\n\n` +
          `Debes ingresar el código que quieres canjear.\n\n` +
          `💡 *Ejemplo:* ${usedPrefix}canjear RJX-ABCD-1234`
        )
      }

      const eventoRedeem = await tryRedeemEventoCode(client, m, codeText, usedPrefix)

      if (eventoRedeem.handled) {
        return m.reply(eventoRedeem.text)
      }

      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const settings = data.settings[botId] || {}
      const monedas = settings.currency || 'Coins'

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(
          `⌬ Los comandos de *Economía* están desactivados en este grupo.\n\n` +
          `Un *administrador* puede activarlos con el comando:\n` +
          `» *${usedPrefix}economy on*`
        )
      }

      const db = ensureDB()
      const item = db.codes[codeText]

      if (!item) {
        return m.reply(
          `> *[ ⌬ ] ❌ CÓDIGO INVÁLIDO*\n\n` +
          `_El código ingresado no existe o fue escrito incorrectamente._\n\n` +
          `🔎 Verifica el código e intenta nuevamente.`
        )
      }

      if (!item.enabled) {
        return m.reply(
          `> *[ ⌬ ] 🔴 CÓDIGO PAUSADO*\n\n` +
          `_Este código está temporalmente desactivado por el owner._`
        )
      }

      if (Number(item.stock || 0) <= 0) {
        return m.reply(
          `> *[ ⌬ ] 📦 STOCK AGOTADO*\n\n` +
          `_Este código ya no tiene usos disponibles._`
        )
      }

      item.redeemed ||= {}

      if (item.redeemed[m.sender]) {
        return m.reply(
          `> *[ ⌬ ] ⚠️ YA CANJEADO*\n\n` +
          `🎟️ *Código:* ${item.code}\n\n` +
          `_Ya reclamaste este código antes._`
        )
      }

      chatData.users[m.sender] ||= {}

      const user = chatData.users[m.sender]

      if (typeof user.coins !== 'number') user.coins = 0

      const reward = Number(item.coins || 0)

      if (!Number.isFinite(reward) || reward <= 0) {
        return m.reply(
          `> *[ ⌬ ] ❌ CÓDIGO DAÑADO*\n\n` +
          `_Este código tiene una recompensa inválida._\n\n` +
          `⚠️ Contacta al owner.`
        )
      }

      if (!m.isOwner) user.coins += reward
      item.stock = Number(item.stock || 0) - 1
      item.redeemed[m.sender] = Date.now()

      saveDB(db)
      saveMainDB()

      return m.reply(
        `> *[ ⌬ ] 🎁 CÓDIGO CANJEADO*\n\n` +
        `🎟️ *Código:* ${item.code}\n` +
        `💰 *Recibiste:* S/${formatNumber(reward)} ${monedas}\n` +
        `📦 *Stock restante:* ${formatNumber(item.stock)} usos\n\n` +
        `✅ _Recompensa agregada correctamente a tu cuenta._`
      )
    } catch (e) {
      console.error(e)
      return m.reply(`❌ Error: ${e.message}`)
    }
  }
}
