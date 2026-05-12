import fs from 'fs'
import path from 'path'

const DB_PATH = './cmds/economy/database/codes.json'

function isOwnerUser(jid = '') {
  const number = String(jid)
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')

  return Array.isArray(global.owner) && global.owner.includes(number)
}

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

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function getCurrency(client) {
  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
  return global.db.data.settings?.[botId]?.currency || 'Soles'
}

function normalizeCode(code = '') {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
}

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let part1 = ''
  let part2 = ''

  for (let i = 0; i < 4; i++) {
    part1 += chars[Math.floor(Math.random() * chars.length)]
    part2 += chars[Math.floor(Math.random() * chars.length)]
  }

  return `LEI-${part1}-${part2}`
}

function parseAmount(value) {
  if (value === null || value === undefined) return NaN

  let text = String(value).trim().toLowerCase()
  let multiplier = 1

  if (text.endsWith('k')) {
    multiplier = 1000
    text = text.slice(0, -1)
  }

  if (text.endsWith('m')) {
    multiplier = 1000000
    text = text.slice(0, -1)
  }

  const clean = text.replace(/[^\d]/g, '')
  const number = Number(clean)

  if (!Number.isFinite(number)) return NaN

  return number * multiplier
}

function getValue(raw, keys) {
  const pattern = new RegExp(
    `(?:^|\\s)(?:${keys.join('|')})\\s*(?:[:=]|\\s)\\s*([^\\s]+)`,
    'i'
  )

  const match = raw.match(pattern)
  return match ? match[1] : null
}

function ownerMenu() {
  return `╭━━━〔 🎟️ *CÓDIGOS DE REGALO* 〕━━━╮
┃
┃ _Sistema privado para regalar Coins_
┃ _mediante códigos canjeables._
┃
┃ 👑 *Acceso:* _Owner_
┃ 🎁 *Premio:* _Coins_
┃ 📦 *Stock:* _Limitado_
┃ 🔐 *Lista pública:* _No disponible_
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 ⚙️ *COMANDOS OWNER* 〕━━╮
┃ ➕ *.code create coins:<cantidad> stock:<usos>*
┃ _Crear código aleatorio._
┃ ✍️ *.code create <código> coins:<cantidad> stock:<usos>*
┃ _Crear código personalizado._
┃ 📋 *.code list*
┃ _Ver códigos creados._
┃ 🔎 *.code info <código>*
┃ _Ver información del código._
┃ 📦 *.code stock <código> <cantidad>*
┃ _Cambiar stock disponible._
┃ 🔴 *.code disable <código>*
┃ _Pausar código._
┃ 🟢 *.code enable <código>*
┃ _Reactivar código._
┃ 🗑️ *.code delete <código>*
┃ _Eliminar código._
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 🎁 *CANJEAR* 〕━━╮
┃ *.canjear <código>*
╰━━━━━━━━━━━━━━━━━━━━━━╯`
}

function usageCreate() {
  return `╭━━━〔 ❌ *USO INCORRECTO* 〕━━━╮
┃
┃ Para crear un código aleatorio usa:
┃ *.code create coins:<cantidad> stock:<usos>*
┃
┃ Para crear un código personalizado usa:
┃ *.code create <código> coins:<cantidad> stock:<usos>*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 *Ejemplos:*
*.code create coins:50000 stock:20*
*.code create LEIBLE2026 coins:50000 stock:20*

> ✦ _El premio solo puede ser en Coins._
> ✦ _El stock indica cuántas veces puede canjearse._`
}

export default {
  command: ['codigo', 'codigos'],
  category: 'owner',

  run: async (client, m, args, usedPrefix = '.', command = 'code') => {
    try {
      if (!isOwnerUser(m.sender)) {
        return m.reply(`╭━━━〔 ⛔ *ACCESO DENEGADO* 〕━━━╮
┃
┃ _Este sistema solo puede ser usado_
┃ _por el owner del bot._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❌ *No tienes permiso para administrar códigos.*`)
      }

      const db = ensureDB()
      const sub = String(args[0] || '').toLowerCase()

      if (!sub || sub === 'menu' || sub === 'help') {
        return m.reply(ownerMenu())
      }

      if (sub === 'create' || sub === 'crear') {
        const raw = args.slice(1).join(' ').trim()

        if (!raw) return m.reply(usageCreate())

        const first = String(args[1] || '').trim()
        const firstLower = first.toLowerCase()

        let customCode = null

        if (
          first &&
          !firstLower.startsWith('coins:') &&
          !firstLower.startsWith('coins=') &&
          !firstLower.startsWith('stock:') &&
          !firstLower.startsWith('stock=')
        ) {
          customCode = normalizeCode(first)
        }

        const dataRaw = customCode ? args.slice(2).join(' ') : raw

        const coins = Math.floor(parseAmount(getValue(dataRaw, ['coins', 'coin', 'monedas', 'money'])))
        const stock = Math.floor(parseAmount(getValue(dataRaw, ['stock', 'usos', 'uses'])))

        if (!Number.isFinite(coins) || coins <= 0 || !Number.isFinite(stock) || stock <= 0) {
          return m.reply(usageCreate())
        }

        let code = customCode || randomCode()

        while (db.codes[code]) {
          if (customCode) {
            return m.reply(`╭━━━〔 ⚠️ *CÓDIGO EXISTENTE* 〕━━━╮
┃
┃ 🎟️ *Código:* _${code}_
┃
┃ _Ese código ya existe._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❌ *Usa otro nombre de código.*`)
          }

          code = randomCode()
        }

        db.codes[code] = {
          code,
          coins,
          stock,
          initialStock: stock,
          enabled: true,
          createdBy: m.sender,
          createdAt: Date.now(),
          redeemed: {}
        }

        saveDB(db)

        const currency = getCurrency(client)

return m.reply(`╭━━━〔 🎟️ *CÓDIGO CREADO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${code}_
┃ 💰 *Premio:* _S/${formatNumber(coins)} ${currency}_
┃ 📦 *Stock:* _${formatNumber(stock)} usos_
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

📌 *¿Como canjeo el codigo?:*
*.canjear ${code}*`)
      }

      if (sub === 'list' || sub === 'lista') {
        const codes = Object.values(db.codes || {})

        if (!codes.length) {
          return m.reply(`╭━━━〔 📋 *CÓDIGOS CREADOS* 〕━━━╮
┃
┃ _No hay códigos creados todavía._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        let txt = `╭━━━〔 📋 *CÓDIGOS CREADOS* 〕━━━╮
┃
`

        for (const item of codes) {
          const redeemedCount = Object.keys(item.redeemed || {}).length
          const status = item.enabled ? '🟢 *Activo*' : '🔴 *Pausado*'

          txt += `┃ 🎟️ _${item.code}_
┃ 💰 *S/${formatNumber(item.coins)} Coins*
┃ 📦 *${formatNumber(item.stock)}/${formatNumber(item.initialStock)} usos*
┃ 👥 *${formatNumber(redeemedCount)} canjes*
┃ ${status}
┃
`
        }

        txt += `╰━━━━━━━━━━━━━━━━━━━━━━╯

👑 _Lista visible solo para owner._`

        return m.reply(txt)
      }

      if (sub === 'info') {
        const code = normalizeCode(args[1])
        const item = db.codes[code]

        if (!code || !item) {
          return m.reply(`╭━━━〔 ❌ *CÓDIGO INVÁLIDO* 〕━━━╮
┃
┃ _Ese código no existe._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        const redeemed = Object.keys(item.redeemed || {})
        const status = item.enabled ? '🟢 _Activo_' : '🔴 _Pausado_'

        let txt = `╭━━━〔 🎟️ *INFO DEL CÓDIGO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${item.code}_
┃ 💰 *Premio:* _S/${formatNumber(item.coins)} Coins_
┃ 📦 *Stock restante:* _${formatNumber(item.stock)}_
┃ 📌 *Stock inicial:* _${formatNumber(item.initialStock)}_
┃ 👥 *Canjeados:* _${formatNumber(redeemed.length)}_
┃ ⚙️ *Estado:* ${status}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`

        if (redeemed.length) {
          txt += `

👥 *Usuarios que lo canjearon:*`

          for (const jid of redeemed.slice(0, 20)) {
            txt += `
┃ • @${jid.split('@')[0]}`
          }

          if (redeemed.length > 20) {
            txt += `
┃ • _y ${redeemed.length - 20} más..._`
          }
        }

        return client.sendMessage(
          m.chat,
          {
            text: txt,
            mentions: redeemed.slice(0, 20)
          },
          { quoted: m }
        )
      }

      if (sub === 'stock') {
        const code = normalizeCode(args[1])
        const amount = Math.floor(parseAmount(args[2]))
        const item = db.codes[code]

        if (!code || !item) {
          return m.reply(`╭━━━〔 ❌ *CÓDIGO INVÁLIDO* 〕━━━╮
┃
┃ _Ese código no existe._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        if (!Number.isFinite(amount) || amount < 0) {
          return m.reply(`╭━━━〔 ❌ *STOCK INVÁLIDO* 〕━━━╮
┃
┃ Usa:
┃ *.code stock <código> <cantidad>*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 *Ejemplo:*
*.code stock ${code} 10*`)
        }

        const redeemedCount = Object.keys(item.redeemed || {}).length

        item.stock = amount
        item.initialStock = redeemedCount + amount

        saveDB(db)

        return m.reply(`╭━━━〔 📦 *STOCK ACTUALIZADO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${code}_
┃ 📦 *Stock disponible:* _${formatNumber(amount)} usos_
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Stock actualizado correctamente.*`)
      }

      if (sub === 'disable' || sub === 'pausar') {
        const code = normalizeCode(args[1])
        const item = db.codes[code]

        if (!code || !item) {
          return m.reply(`╭━━━〔 ❌ *CÓDIGO INVÁLIDO* 〕━━━╮
┃
┃ _Ese código no existe._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        item.enabled = false
        saveDB(db)

        return m.reply(`╭━━━〔 🔴 *CÓDIGO PAUSADO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${code}_
┃ ⚙️ *Estado:* _Pausado_
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ *El código ya no puede ser canjeado.*`)
      }

      if (sub === 'enable' || sub === 'activar') {
        const code = normalizeCode(args[1])
        const item = db.codes[code]

        if (!code || !item) {
          return m.reply(`╭━━━〔 ❌ *CÓDIGO INVÁLIDO* 〕━━━╮
┃
┃ _Ese código no existe._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        item.enabled = true
        saveDB(db)

        return m.reply(`╭━━━〔 🟢 *CÓDIGO ACTIVADO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${code}_
┃ ⚙️ *Estado:* _Activo_
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ *El código ya puede ser canjeado.*`)
      }

      if (sub === 'delete' || sub === 'del' || sub === 'eliminar') {
        const code = normalizeCode(args[1])

        if (!code || !db.codes[code]) {
          return m.reply(`╭━━━〔 ❌ *CÓDIGO INVÁLIDO* 〕━━━╮
┃
┃ _Ese código no existe._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        delete db.codes[code]
        saveDB(db)

        return m.reply(`╭━━━〔 🗑️ *CÓDIGO ELIMINADO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${code}_
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Código eliminado correctamente.*`)
      }

      return m.reply(ownerMenu())
    } catch (e) {
      console.error(e)
      return m.reply(`❌ Error: ${e.message}`)
    }
  }
}