import fs from 'fs'
import path from 'path'
import GraphemeSplitter from 'grapheme-splitter'

const DB_PATH = './cmds/reacts/database/reactions.json'
const splitter = new GraphemeSplitter()

function defaultDB() {
  return {
    config: {
      waitBeforeReact: 2000,
      internalCooldown: 2000,
      ignoreCommands: true
    },
    shop: {},
    users: {}
  }
}

function ensureDB() {
  const dir = path.dirname(DB_PATH)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB(), null, 2))
  }

  let db

  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  } catch {
    db = defaultDB()
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  }

  db.config ||= defaultDB().config
  db.shop ||= {}
  db.users ||= {}

  return db
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function formatNumber(num = 0) {
  const n = Number(num || 0)
  return n.toLocaleString('en-US')
}

function isOwnerUser(jid = '') {
  const number = String(jid)
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')

  return Array.isArray(global.owner) && global.owner.includes(number)
}

function formatMoney(amount = 0, jid = '') {
  if (isOwnerUser(jid)) return '∞'
  return formatNumber(amount)
}

function getEmoji(text = '') {
  return splitter.splitGraphemes(String(text || '').trim())[0] || ''
}

function getWalletBalance(user = {}) {
  return Number(user.coins || 0)
}

function getBankBalance(user = {}) {
  return Number(user.bank || 0)
}

function getTotalBalance(user = {}) {
  return getWalletBalance(user) + getBankBalance(user)
}

function setWalletBalance(user, amount) {
  user.coins = Math.max(0, Number(amount || 0))
}

function rarityLabel(rarity = 'comun') {
  const map = {
    comun: '🟢 Común',
    rara: '🔵 Rara',
    epica: '🟣 Épica',
    legendaria: '🟡 Legendaria',
    mitica: '🟠 Mítica',
    exclusiva: '🔴 Exclusiva',
    vip: '💎 VIP',
    vip_exclusiva: '💎 VIP Exclusiva'
  }

  return map[rarity] || `🏷️ ${rarity}`
}

function getReactUser(db, sender) {
  db.users[sender] ||= {
    owned: [],
    active: null,
    vip: false,
    lastReact: 0
  }

  if (!Array.isArray(db.users[sender].owned)) db.users[sender].owned = []
  if (!('active' in db.users[sender])) db.users[sender].active = null
  if (!('vip' in db.users[sender])) db.users[sender].vip = false
  if (!('lastReact' in db.users[sender])) db.users[sender].lastReact = 0

  return db.users[sender]
}

function getEconomyData(client, m) {
  const data = global.db.data
  const chatData = data.chats?.[m.chat]

  if (!chatData) {
    return {
      ok: false,
      reason: 'chat_not_found'
    }
  }

  chatData.users ||= {}
  chatData.users[m.sender] ||= {}

  const user = chatData.users[m.sender]

  user.coins ??= 0
  user.bank ??= 0

  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
  const settings = data.settings?.[botId] || {}
  const currency = settings.currency || 'Coins'

  return {
    ok: true,
    chatData,
    user,
    currency
  }
}

function economyDisabledMessage(usedPrefix = '.') {
  return `⌬ Los comandos de *Economía* están desactivados en este grupo.

Un *administrador* puede activarlos con el comando:
» *${usedPrefix}economy on*`
}

function menuPrincipal() {
  return `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🎯 *REACCIONES* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ ✨ Sistema de reacciones personalizadas.
│ Compra, equipa y usa tu reacción favorita.
│
│ 🤖 El bot reaccionará automáticamente
│ a tus mensajes con el emoji activo.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

╭───〔 📋 *COMANDOS* 〕
│
│ 🏪 *.react list*
│ └ Ver tienda de reacciones.
│
│ 💰 *.react buy <emoji>*
│ └ Comprar una reacción.
│
│ 🎨 *.react select <emoji>*
│ └ Equipar una reacción comprada.
│
│ 📦 *.react my*
│ └ Ver tu colección.
│
│ ❌ *.react unequip*
│ └ Quitar tu reacción activa.
│
╰──────────────

╭───〔 💡 *EJEMPLOS* 〕
│
│ • .react buy 👀
│ • .react select 🔥
│ • .react my
│ • .react unequip
│
╰──────────────

> 🔰 Solo puedes tener una reacción equipada.
> 💡 Las compras usan monedas de la *cartera*, no del banco.`
}

function buildShopMenu(db, sender, economyUser, currency) {
  const reactUser = getReactUser(db, sender)
  const items = Object.entries(db.shop || {}).filter(([, item]) => item.enabled !== false)

  const wallet = getWalletBalance(economyUser)
  const bank = getBankBalance(economyUser)
  const total = getTotalBalance(economyUser)

  let txt = `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🏪 *TIENDA DE REACCIONES* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ ⛀ *Cartera:* S/${formatMoney(wallet, sender)} ${currency}
│ ⚿ *Banco:* S/${formatMoney(bank, sender)} ${currency}
│ ⛁ *Total:* S/${formatMoney(total, sender)} ${currency}
│ 🎨 *Activa:* ${reactUser.active || 'Ninguna'}
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

`

  if (!items.length) {
    txt += `❌ No hay reacciones disponibles en la tienda.\n\n`
  }

  for (const [emoji, item] of items) {
    const owned = reactUser.owned.includes(emoji)
    const active = reactUser.active === emoji
    const agotada = Number(item.stock || 0) <= 0

    let status = ''

    if (active) status = ' | 🎨 Equipada'
    else if (owned) status = ' | ✅ Ya la tienes'
    else if (agotada) status = ' | ❌ Agotada'

    txt += `${emoji} *${item.name || 'Reacción'}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
└ 💰 S/${formatNumber(item.price)} ${currency} | 📦 Stock: ${formatNumber(item.stock)}${status}

`
  }

  txt += `━━━━━━━━━━━━━━━━━━━━━━━
📌 *Comprar:* .react buy <emoji>
📦 *Colección:* .react my
🎨 *Equipar:* .react select <emoji>

> 💡 Para comprar, las monedas deben estar en la *cartera*.`

  return txt
}

function buildMyMenu(db, sender, economyUser, currency) {
  const reactUser = getReactUser(db, sender)
  const owned = reactUser.owned || []

  const wallet = getWalletBalance(economyUser)
  const bank = getBankBalance(economyUser)
  const total = getTotalBalance(economyUser)

  let txt = `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴📦 *MI COLECCIÓN* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ 👤 *Usuario:* @${sender.split('@')[0]}
│ ⛀ *Cartera:* S/${formatNumber(wallet)} ${currency}
│ ⚿ *Banco:* S/${formatNumber(bank)} ${currency}
│ ⛁ *Total:* S/${formatNumber(total)} ${currency}
│ 🎨 *Activa:* ${reactUser.active || 'Ninguna'}
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

`

  if (!owned.length) {
    txt += `❌ Todavía no tienes reacciones compradas.\n\n`
  } else {
    for (const emoji of owned) {
      const item = db.shop?.[emoji]
      if (!item) continue

      const status = reactUser.active === emoji ? '🎨 Equipada' : 'Disponible'

      txt += `${emoji} *${item.name || 'Reacción'}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
└ Estado: ${status}

`
    }
  }

  txt += `━━━━━━━━━━━━━━━━━━━━━━━
🎨 *Equipar:* .react select <emoji>
❌ *Quitar:* .react unequip`

  return txt
}

export default {
  command: ['react', 'reacciones'],
  category: 'reacts',

    async all(m, { client }) {
    try {
      if (!m?.key) return false

      const db = ensureDB()
      const config = db.config || {}

      const chat = m.chat || m.key?.remoteJid || ''
      if (!chat) return false

      const text =
        m.text ||
        m.body ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        ''

      const cleanText = String(text || '').trim()

      if (config.ignoreCommands !== false) {
        if (
          cleanText.startsWith('.') ||
          cleanText.startsWith('/') ||
          cleanText.startsWith('#') ||
          cleanText.startsWith('!')
        ) {
          return false
        }
      }

      const rawSenders = [
        m.sender,
        m.key?.participant,
        m.participant,
        m.key?.remoteJid
      ].filter(Boolean)

      const possibleSenders = []

      for (const raw of rawSenders) {
        const jid = String(raw)

        possibleSenders.push(jid)

        const number = jid
          .split('@')[0]
          .split(':')[0]
          .replace(/\D/g, '')

        if (number) {
          possibleSenders.push(`${number}@s.whatsapp.net`)
          possibleSenders.push(number)
        }
      }

      const uniqueSenders = [...new Set(possibleSenders)]

      let reactUser = null
      let reactJid = null

      for (const jid of uniqueSenders) {
        if (db.users?.[jid]) {
          reactUser = db.users[jid]
          reactJid = jid
          break
        }
      }

      if (!reactUser) {
        for (const savedJid of Object.keys(db.users || {})) {
          const savedNumber = savedJid
            .split('@')[0]
            .split(':')[0]
            .replace(/\D/g, '')

          const found = uniqueSenders.some(jid => {
            const n = String(jid)
              .split('@')[0]
              .split(':')[0]
              .replace(/\D/g, '')

            return n && savedNumber && n === savedNumber
          })

          if (found) {
            reactUser = db.users[savedJid]
            reactJid = savedJid
            break
          }
        }
      }

      if (!reactUser) return false

      const active = reactUser.active
      if (!active) return false

      const item = db.shop?.[active]
      if (!item || item.enabled === false) return false

      const now = Date.now()
      const last = Number(reactUser.lastReact || 0)
      const internalCooldown = Number(config.internalCooldown || 2000)

      if (now - last < internalCooldown) return false

      reactUser.lastReact = now
      saveDB(db)

      const waitBeforeReact = Number(config.waitBeforeReact || 2000)

      await new Promise(resolve => setTimeout(resolve, waitBeforeReact))

      await client.sendMessage(chat, {
        react: {
          text: active,
          key: m.key
        }
      })

      return false
    } catch (e) {
      console.error('AUTO REACT ERROR:', e)
      return false
    }
  },

  run: async (client, m, args, usedPrefix = '.') => {
    try {
      const db = ensureDB()
      const economy = getEconomyData(client, m)

      if (!economy.ok) {
        return m.reply('❌ No se pudo leer la economía de este chat.')
      }

      const { chatData, user, currency } = economy

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyDisabledMessage(usedPrefix))
      }

const ownerUnlimited = isOwnerUser(m.sender)

const walletBalance = ownerUnlimited ? Number.MAX_SAFE_INTEGER : getWalletBalance(user)
const bankBalance = ownerUnlimited ? Number.MAX_SAFE_INTEGER : getBankBalance(user)
const totalBalance = ownerUnlimited ? Number.MAX_SAFE_INTEGER : getTotalBalance(user)

      const sub = String(args[0] || '').toLowerCase()

      if (!sub || sub === 'help' || sub === 'menu') {
        return m.reply(menuPrincipal())
      }

      if (sub === 'list' || sub === 'shop' || sub === 'tienda') {
        return m.reply(buildShopMenu(db, m.sender, user, currency))
      }

      if (sub === 'my' || sub === 'coleccion' || sub === 'collection') {
        return m.reply(buildMyMenu(db, m.sender, user, currency))
      }

      if (sub === 'buy' || sub === 'comprar') {
        const emoji = getEmoji(args.slice(1).join(' '))

        if (!emoji) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *FALTA EMOJI* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Ingresa el emoji que quieres comprar.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

💡 *Ejemplo:*
.react buy 👀`)
        }

        const item = db.shop?.[emoji]

        if (!item || item.enabled === false) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *NO DISPONIBLE* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Esa reacción no existe en la tienda.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ`)
        }

        const reactUser = getReactUser(db, m.sender)

        if (reactUser.owned.includes(emoji)) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✅ *YA LA TIENES* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Esta reacción ya está en tu colección.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${item.name}*

🎨 Para equiparla usa:
.react select ${emoji}`)
        }

        if (item.vip && !reactUser.vip) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴💎 *REACCIÓN VIP* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Esta reacción solo está disponible
│ para usuarios VIP.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${item.name}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
💰 Precio: S/${formatNumber(item.price)} ${currency}`)
        }

        if (Number(item.stock || 0) <= 0) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴📦 *SIN STOCK* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Esta reacción no tiene stock disponible.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${item.name}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
📦 Stock: 0`)
        }

        const price = Number(item.price || 0)

         if (!ownerUnlimited && walletBalance < price) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *COMPRA FALLIDA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ No tienes suficientes monedas en tu cartera.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${item.name}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
💰 Precio: S/${formatNumber(price)} ${currency}

━━━━━━━━━━━━━━━━━━━━━━━
⛀ *Cartera:* S/${formatNumber(walletBalance)} ${currency}
⚿ *Banco:* S/${formatNumber(bankBalance)} ${currency}
⛁ *Total:* S/${formatNumber(totalBalance)} ${currency}

💡 *Tip:* Las monedas para comprar deben estar en la *cartera*.
Usa *${usedPrefix}withdraw* para retirar monedas del banco.`)
        }

        if (!ownerUnlimited) {
  setWalletBalance(user, walletBalance - price)
}

        item.stock = Number(item.stock || 0) - 1
        reactUser.owned.push(emoji)

        saveDB(db)

        const newWallet = getWalletBalance(user)
        const newBank = getBankBalance(user)
        const newTotal = getTotalBalance(user)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴✅ *COMPRA EXITOSA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Nueva reacción desbloqueada.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${item.name}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
💰 Precio: S/${formatNumber(price)} ${currency}
📦 Stock restante: ${formatNumber(item.stock)}

━━━━━━━━━━━━━━━━━━━━━━━
⛀ *Cartera:* S/${formatMoney(newWallet, m.sender)} ${currency}
⚿ *Banco:* S/${formatMoney(newBank, m.sender)} ${currency}
⛁ *Total:* S/${formatMoney(newTotal, m.sender)} ${currency}

🎨 Para equiparla usa:
.react select ${emoji}`)
      }

      if (sub === 'select' || sub === 'equipar') {
        const emoji = getEmoji(args.slice(1).join(' '))

        if (!emoji) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *FALTA EMOJI* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Ingresa el emoji que quieres equipar.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

💡 *Ejemplo:*
.react select 🔥`)
        }

        const item = db.shop?.[emoji]
        const reactUser = getReactUser(db, m.sender)

        if (!item) {
          return m.reply('❌ Esa reacción no existe.')
        }

        if (!reactUser.owned.includes(emoji)) {
          return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *NO LA TIENES* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Esa reacción aún no está en tu colección.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

🏪 Puedes comprarla con:
.react buy ${emoji}`)
        }

        reactUser.active = emoji
        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🎨 *REACCIÓN EQUIPADA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Tu reacción activa fue actualizada.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${item.name}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
🤖 Modo: Automático

━━━━━━━━━━━━━━━━━━━━━━━
> Desde ahora el bot reaccionará a tus mensajes con ${emoji}`)
      }

      if (sub === 'unequip' || sub === 'quitar') {
        const reactUser = getReactUser(db, m.sender)
        reactUser.active = null
        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *REACCIÓN DESEQUIPADA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Ya no tienes una reacción activa.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ`)
      }

      return m.reply(menuPrincipal())
    } catch (e) {
      console.error(e)
      return m.reply(`❌ Error: ${e.message}`)
    }
  }
}