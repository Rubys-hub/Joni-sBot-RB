import fs from 'fs'
import path from 'path'

const DB_PATH = './cmds/economy/database/codes.json'

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

function normalizeCode(code = '') {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
}

export default {
  command: ['canjear'],
  category: 'rpg',
  group: true,

  run: async (client, m, args, usedPrefix = '.', command = 'canjear') => {
    try {
      const data = global.db.data
      const chatData = data.chats[m.chat]

      if (!chatData) {
        return m.reply('❌ No se pudo leer la economía de este chat.')
      }

      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const settings = data.settings[botId] || {}
      const monedas = settings.currency || 'Coins'

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(`⌬ Los comandos de *Economía* están desactivados en este grupo.

Un *administrador* puede activarlos con el comando:
» *${usedPrefix}economy on*`)
      }

      const codeText = normalizeCode(args[0])

      if (!codeText) {
        return m.reply(`╭━━━〔 🎟️ *FALTA CÓDIGO* 〕━━━╮
┃
┃ Debes ingresar el código
┃ que quieres canjear.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 *Ejemplo:*
*.canjear LEIBLE2026*`)
      }

      const db = ensureDB()
      const item = db.codes[codeText]

      if (!item) {
        return m.reply(`╭━━━〔 ❌ *CÓDIGO INVÁLIDO* 〕━━━╮
┃
┃ _El código ingresado no existe_
┃ _o fue escrito incorrectamente._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

🔎 *Verifica el código e intenta nuevamente.*`)
      }

      if (!item.enabled) {
        return m.reply(`╭━━━〔 🔴 *CÓDIGO PAUSADO* 〕━━━╮
┃
┃ _Este código está temporalmente_
┃ _desactivado por el owner._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❌ *No puede ser canjeado por ahora.*`)
      }

      if (Number(item.stock || 0) <= 0) {
        return m.reply(`╭━━━〔 📦 *STOCK AGOTADO* 〕━━━╮
┃
┃ _Este código ya no tiene usos_
┃ _disponibles para canjear._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❌ *El stock llegó a cero.*`)
      }

      item.redeemed ||= {}

      if (item.redeemed[m.sender]) {
        return m.reply(`╭━━━〔 ⚠️ *YA CANJEADO* 〕━━━╮
┃
┃ 🎟️ *Código:* _${item.code}_
┃
┃ _Ya reclamaste este código antes._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❌ *Solo se puede canjear una vez por usuario.*`)
      }

      chatData.users ||= {}
      chatData.users[m.sender] ||= {}

      const user = chatData.users[m.sender]

      if (typeof user.coins !== 'number') user.coins = 0

      const reward = Number(item.coins || 0)

      if (!Number.isFinite(reward) || reward <= 0) {
        return m.reply(`╭━━━〔 ❌ *CÓDIGO DAÑADO* 〕━━━╮
┃
┃ _Este código tiene una recompensa inválida._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

⚠️ *Contacta al owner.*`)
      }

      user.coins += reward
      item.stock = Number(item.stock || 0) - 1
      item.redeemed[m.sender] = Date.now()

      saveDB(db)

      return m.reply(`╭━━━〔 🎁 *CÓDIGO CANJEADO* 〕━━━╮
┃ 🎟️ *Código:* _${item.code}_
┃ 💰 *Recibiste:* _S/${formatNumber(reward)} ${monedas}_
┃ 📦 *Stock restante:* _${formatNumber(item.stock)} usos_
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ _Recompensa agregada correctamente a tu cuenta._`)
    } catch (e) {
      console.error(e)
      return m.reply(`❌ Error: ${e.message}`)
    }
  }
}