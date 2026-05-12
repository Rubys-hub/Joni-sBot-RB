import fs from 'fs'
import path from 'path'
import GraphemeSplitter from 'grapheme-splitter'

const DB_PATH = './cmds/reacts/database/reactions.json'
const splitter = new GraphemeSplitter()

function ensureDB() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ shop: {}, users: {} }, null, 2))
  }

  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function getEmoji(text = '') {
  return splitter.splitGraphemes(String(text || '').trim())[0] || ''
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function getBankBalance(user = {}) {
  return Number(user.bank || 0) // o "balance" según tu sistema
}

function getWalletBalance(user = {}) {
  return Number(user.coins || 0) // o "money" según tu sistema
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

function getReactUser(db, jid) {
  db.users[jid] ||= {
    owned: [],
    active: null,
    vip: false,
    lastReact: 0,
    bank: 0,
    coins: 0
  }

  if (!Array.isArray(db.users[jid].owned)) db.users[jid].owned = []
  if (!('active' in db.users[jid])) db.users[jid].active = null
  if (!('vip' in db.users[jid])) db.users[jid].vip = false
  if (!('lastReact' in db.users[jid])) db.users[jid].lastReact = 0

  return db.users[jid]
}

function getMentionedJid(m) {
  const mentioned =
    m.mentionedJid ||
    m.mentions ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    []

  if (Array.isArray(mentioned) && mentioned[0]) return mentioned[0]
  if (m.quoted?.sender) return m.quoted.sender

  return null
}

function ownerMenu(db) {
  const items = Object.entries(db.shop || {})

  let txt = `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴👑 *REACT OWNER* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Panel privado de administración.
│ Controla tienda, stock, precios y rarezas.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

`

  if (!items.length) {
    txt += `❌ No hay reacciones creadas.\n\n`
  } else {
    for (const [emoji, item] of items) {
      txt += `${emoji} *${item.name || 'Reacción'}*
🏷️ Rareza: ${rarityLabel(item.rarity)}
💰 Precio: ${formatNumber(item.price)}
📦 Stock: ${formatNumber(item.stock)}
💎 VIP: ${item.vip ? 'Sí' : 'No'}
🧩 Estado: ${item.enabled === false ? 'Oculta' : 'Visible'}

`
    }
  }

  txt += `━━━━━━━━━━━━━━━━━━━━━━━
➕ *.reactowner create <emoji> <precio> <stock> <rareza>*
📦 *.reactowner stock <emoji> <cantidad>*
💸 *.reactowner price <emoji> <precio>*
🏷️ *.reactowner rarity <emoji> <rareza>*
💎 *.reactowner vip <emoji> on/off*
📝 *.reactowner name <emoji> <nombre>*
🙈 *.reactowner hide <emoji>*
👁️ *.reactowner show <emoji>*
🗑️ *.reactowner delete <emoji>*

━━━━━━━━━━━━━━━━━━━━━━━
👤 *.reactowner give @user <emoji>*
❌ *.reactowner remove @user <emoji>*
🔄 *.reactowner reset @user*
💎 *.reactowner vipuser @user on/off*
📦 *.reactowner user @user*

━━━━━━━━━━━━━━━━━━━━━━━
💡 *Ejemplos:*
.reactowner create 🦋 900000000 5 epica
.reactowner stock 👀 10
.reactowner price 👀 150000000
.reactowner name 👀 Mirada Sospechosa
.reactowner vip 🥵 on
.reactowner give @user 🔥`

  return txt
}

export default {
  command: ['reactowner'],
  category: 'reacts',

  run: async (client, m, args) => {
    try {
      if (!m.isOwner) {
        return m.reply(`ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴄᴏᴍᴀɴᴅᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ
ᴇʟ ᴄᴏᴍᴀɴᴅᴏ *reactowner* ɴᴏ ᴇxɪsᴛᴇ.
ᴜsᴀ *.help* ᴘᴀʀᴀ ᴠᴇʀ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.`)
      }

      const db = ensureDB()
      const sub = String(args[0] || '').toLowerCase()

      if (!sub || sub === 'menu' || sub === 'help') {
        return m.reply(ownerMenu(db))
      }

    if (sub === 'create') {
  const emoji = getEmoji(args[1])
  const raw = args.slice(2).join(' ').trim()

  const validRarities = [
    'comun',
    'rara',
    'epica',
    'legendaria',
    'mitica',
    'exclusiva',
    'vip',
    'vip_exclusiva'
  ]

  function getValue(keys) {
    const pattern = new RegExp(
      `(?:^|\\s)(?:${keys.join('|')})\\s*(?:[:=]|\\s)\\s*([^\\s]+)`,
      'i'
    )

    const match = raw.match(pattern)
    return match ? match[1] : null
  }

  function parseAmount(value) {
    if (value === null || value === undefined) return NaN

    let text = String(value).trim().toLowerCase()

    if (['gratis', 'free'].includes(text)) return 0

    let multiplier = 1

    if (text.endsWith('k')) {
      multiplier = 1000
      text = text.slice(0, -1)
    }

    if (text.endsWith('m')) {
      multiplier = 1000000
      text = text.slice(0, -1)
    }

    const clean = text.replace(/[^\d-]/g, '')
    const number = Number(clean)

    if (!Number.isFinite(number)) return NaN

    return number * multiplier
  }

  const priceRaw = getValue(['precio', 'price', 'valor'])
  const stockRaw = getValue(['stock', 'cantidad'])
  const rarityRaw = getValue(['rareza', 'rarity', 'tipo'])

  const price = parseAmount(priceRaw)
  const stock = Math.max(0, Math.floor(parseAmount(stockRaw)))
  const rarity = String(rarityRaw || '').toLowerCase()

  if (!emoji || !Number.isFinite(price) || !Number.isFinite(stock) || !validRarities.includes(rarity)) {
    return m.reply(`❌ *Uso correcto del comando:*

.reactowner create <emoji> precio:<precio> stock:<stock> rareza:<rareza>

💡 *Ejemplos:*
.reactowner create 🐶 precio:20000 stock:10 rareza:epica
.reactowner create 💠 precio:gratis stock:20 rareza:exclusiva
.reactowner create 🔥 precio=50000 stock=5 rareza=legendaria
.reactowner create 🌙 precio 10000 stock 15 rareza rara

🏷️ *Rarezas disponibles:*
comun, rara, epica, legendaria, mitica, exclusiva, vip, vip_exclusiva`)
  }

  db.shop[emoji] = {
    name: `Reacción ${emoji}`,
    price,
    stock,
    rarity,
    vip: rarity.includes('vip'),
    enabled: true
  }

  saveDB(db)

  const priceText = price <= 0 ? 'Gratis' : formatNumber(price)

  return m.reply(`╭─〔 ➕ *REACCIÓN CREADA* 〕─╮
│
│ 🎨 Reacción: ${emoji}
│ 💰 Precio: ${priceText}
│ 📦 Stock: ${formatNumber(stock)}
│ 🏷️ Rareza: ${rarityLabel(rarity)}
│ 💎 VIP: ${rarity.includes('vip') ? 'Sí' : 'No'}
│ 🧩 Estado: Visible
│
╰────────────────╯

✅ La reacción fue creada correctamente.

🏪 Los usuarios podrán obtenerla con:
*.react buy ${emoji}*`)
}
      if (sub === 'stock') {
        const emoji = getEmoji(args[1])
        const amount = Number(args[2])

        if (!emoji || !Number.isFinite(amount)) {
          return m.reply(`❌ Uso correcto:
.reactowner stock <emoji> <cantidad>

💡 Ejemplo:
.reactowner stock 👀 10`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        const old = Number(db.shop[emoji].stock || 0)
        db.shop[emoji].stock = old + amount

        if (db.shop[emoji].stock < 0) db.shop[emoji].stock = 0

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴📦 *STOCK ACTUALIZADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Stock modificado correctamente.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${db.shop[emoji].name}*
📦 Stock anterior: ${formatNumber(old)}
➕ Cambio: ${formatNumber(amount)}
📦 Nuevo stock: ${formatNumber(db.shop[emoji].stock)}`)
      }

      if (sub === 'price') {
        const emoji = getEmoji(args[1])
        const price = Number(args[2])

        if (!emoji || !Number.isFinite(price)) {
          return m.reply(`❌ Uso correcto:
.reactowner price <emoji> <precio>

💡 Ejemplo:
.reactowner price 👀 150000000`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        db.shop[emoji].price = price
        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴💸 *PRECIO ACTUALIZADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Precio modificado correctamente.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${db.shop[emoji].name}*
💰 Nuevo precio: ${formatNumber(price)}`)
      }

      if (sub === 'rarity') {
        const emoji = getEmoji(args[1])
        const rarity = String(args[2] || '').toLowerCase()

        if (!emoji || !rarity) {
          return m.reply(`❌ Uso correcto:
.reactowner rarity <emoji> <rareza>

Rarezas:
comun, rara, epica, legendaria, mitica, exclusiva, vip, vip_exclusiva`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        db.shop[emoji].rarity = rarity
        if (rarity.includes('vip')) db.shop[emoji].vip = true

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🏷️ *RAREZA ACTUALIZADA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Rareza modificada correctamente.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${db.shop[emoji].name}*
🏷️ Nueva rareza: ${rarityLabel(rarity)}`)
      }

      if (sub === 'vip') {
        const emoji = getEmoji(args[1])
        const mode = String(args[2] || '').toLowerCase()

        if (!emoji || !['on', 'off'].includes(mode)) {
          return m.reply(`❌ Uso correcto:
.reactowner vip <emoji> on/off`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        db.shop[emoji].vip = mode === 'on'
        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴💎 *VIP ACTUALIZADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Requisito VIP modificado.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${db.shop[emoji].name}*
💎 VIP: ${db.shop[emoji].vip ? 'Sí' : 'No'}`)
      }

      if (sub === 'name') {
        const emoji = getEmoji(args[1])
        const name = args.slice(2).join(' ').trim()

        if (!emoji || !name) {
          return m.reply(`❌ Uso correcto:
.reactowner name <emoji> <nombre>

💡 Ejemplo:
.reactowner name 👀 Mirada Sospechosa`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        db.shop[emoji].name = name
        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴📝 *NOMBRE ACTUALIZADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Nombre modificado correctamente.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${name}*`)
      }

      if (sub === 'hide' || sub === 'show') {
        const emoji = getEmoji(args[1])

        if (!emoji) {
          return m.reply(`❌ Uso correcto:
.reactowner ${sub} <emoji>`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        db.shop[emoji].enabled = sub === 'show'
        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴${sub === 'show' ? '👁️ *VISIBLE*' : '🙈 *OCULTA*'} ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Estado actualizado correctamente.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${db.shop[emoji].name}*
🧩 Estado: ${db.shop[emoji].enabled ? 'Visible' : 'Oculta'}`)
      }

      if (sub === 'delete') {
        const emoji = getEmoji(args[1])

        if (!emoji) {
          return m.reply(`❌ Uso correcto:
.reactowner delete <emoji>`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        const name = db.shop[emoji].name
        delete db.shop[emoji]

        for (const jid of Object.keys(db.users || {})) {
          db.users[jid].owned = (db.users[jid].owned || []).filter(e => e !== emoji)
          if (db.users[jid].active === emoji) db.users[jid].active = null
        }

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🗑️ *REACCIÓN ELIMINADA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Fue eliminada de la tienda y colecciones.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${emoji} *${name}*`)
      }

      if (sub === 'give') {
        const target = getMentionedJid(m)
        const emoji = getEmoji(args.slice(2).join(' '))

        if (!target || !emoji) {
          return m.reply(`❌ Uso correcto:
.reactowner give @user <emoji>

También puedes responder a un mensaje:
.reactowner give <emoji>`)
        }

        if (!db.shop[emoji]) return m.reply('❌ Esa reacción no existe.')

        const reactUser = getReactUser(db, target)

        if (!reactUser.owned.includes(emoji)) {
          reactUser.owned.push(emoji)
        }

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🎁 *REACCIÓN ENTREGADA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Reacción añadida a la colección.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

👤 Usuario: @${target.split('@')[0]}
${emoji} *${db.shop[emoji].name}*`)
      }

      if (sub === 'remove') {
        const target = getMentionedJid(m)
        const emoji = getEmoji(args.slice(2).join(' '))

        if (!target || !emoji) {
          return m.reply(`❌ Uso correcto:
.reactowner remove @user <emoji>

También puedes responder a un mensaje:
.reactowner remove <emoji>`)
        }

        const reactUser = getReactUser(db, target)

        reactUser.owned = reactUser.owned.filter(e => e !== emoji)
        if (reactUser.active === emoji) reactUser.active = null

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴❌ *REACCIÓN REMOVIDA* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Reacción quitada de la colección.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

👤 Usuario: @${target.split('@')[0]}
🎨 Reacción: ${emoji}`)
      }

      if (sub === 'reset') {
        const target = getMentionedJid(m)

        if (!target) {
          return m.reply(`❌ Uso correcto:
.reactowner reset @user

También puedes responder a un mensaje:
.reactowner reset`)
        }

        db.users[target] = {
          owned: [],
          active: null,
          vip: false,
          lastReact: 0
        }

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🔄 *USUARIO REINICIADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Colección reiniciada correctamente.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

👤 Usuario: @${target.split('@')[0]}`)
      }

      if (sub === 'vipuser') {
        const target = getMentionedJid(m)
        const mode = String(args[2] || '').toLowerCase()

        if (!target || !['on', 'off'].includes(mode)) {
          return m.reply(`❌ Uso correcto:
.reactowner vipuser @user on/off`)
        }

        const reactUser = getReactUser(db, target)
        reactUser.vip = mode === 'on'

        saveDB(db)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴💎 *VIP USER* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Estado VIP actualizado.
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

👤 Usuario: @${target.split('@')[0]}
💎 VIP: ${reactUser.vip ? 'Sí' : 'No'}`)
      }

      if (sub === 'user') {
        const target = getMentionedJid(m)

        if (!target) {
          return m.reply(`❌ Uso correcto:
.reactowner user @user

También puedes responder a un mensaje:
.reactowner user`)
        }

        const reactUser = getReactUser(db, target)

        let txt = `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴📦 *REACT USER* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ 👤 Usuario: @${target.split('@')[0]}
│ 🎨 Activa: ${reactUser.active || 'Ninguna'}
│ 💎 VIP: ${reactUser.vip ? 'Sí' : 'No'}
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

`

        if (!reactUser.owned.length) {
          txt += '❌ No tiene reacciones compradas.\n'
        } else {
          for (const emoji of reactUser.owned) {
            const item = db.shop?.[emoji]
            txt += `${emoji} *${item?.name || 'Reacción'}* ${reactUser.active === emoji ? '🎨' : ''}\n`
          }
        }

        return m.reply(txt)
      }

      return m.reply(ownerMenu(db))
    } catch (e) {
      console.error(e)
      return m.reply(`❌ Error: ${e.message}`)
    }
  }
}