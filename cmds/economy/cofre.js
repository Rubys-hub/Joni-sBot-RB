const COFRE_CONFIG = {
  cooldown: 1000 * 60 * 60 * 3, // 3 horas
  maxLoss: 50000,
  minBombLoss: 5000,
  maxBombLoss: 50000,
  timezone: 'America/Lima'
}

function isNumber(x) {
  return typeof x === 'number' && !isNaN(x)
}

function pickRandom(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatMoney(number = 0) {
  return Number(number || 0).toLocaleString('es-PE')
}

function msToTime(ms = 0) {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []

  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
}

function getBotSettings(client) {
  const botRaw = client.user?.id || ''
  const botId = botRaw.split(':')[0] + '@s.whatsapp.net'
  return global.db.data.settings?.[botId] || {}
}

function ensureGlobalUser(db, jid, pushname = 'Usuario') {
  db.users ||= {}

  db.users[jid] ||= {}
  const user = db.users[jid]

  user.id ??= jid
  user.name ??= pushname
  user.coins = isNumber(user.coins) ? user.coins : 0
  user.bank = isNumber(user.bank) ? user.bank : 0
  user.lastCofreGlobal = isNumber(user.lastCofreGlobal) ? user.lastCofreGlobal : 0

  return user
}

function ensureLocalUser(db, chatId, jid, pushname = 'Usuario') {
  db.chats ||= {}
  db.chats[chatId] ||= {}
  db.chats[chatId].users ||= {}

  db.chats[chatId].users[jid] ||= {}
  const user = db.chats[chatId].users[jid]

  user.id ??= jid
  user.name ??= pushname
  user.coins = isNumber(user.coins) ? user.coins : 0
  user.bank = isNumber(user.bank) ? user.bank : 0
  user.lastCofre = isNumber(user.lastCofre) ? user.lastCofre : 0

  return user
}

function takeMoney(user, amount) {
  const lossLimit = Math.min(amount, COFRE_CONFIG.maxLoss)
  let remaining = lossLimit

  const fromWallet = Math.min(user.coins || 0, remaining)
  user.coins -= fromWallet
  remaining -= fromWallet

  const fromBank = Math.min(user.bank || 0, remaining)
  user.bank -= fromBank
  remaining -= fromBank

  return {
    requested: lossLimit,
    lost: fromWallet + fromBank,
    fromWallet,
    fromBank
  }
}

function getCofreResult() {
  /*
    Probabilidades:
    💎 Divino: 0.10%
    👑 Legendario: 0.40%
    ✨ Épico: 1.50%
    🟨 Bueno: 8%
    📦 Normal: 33%
    🕸️ Vacío: 50%
    💣 Bomba: 7%
  */

  const roll = pickRandom(1, 100000)

  if (roll <= 100) {
    return {
      type: 'jackpot',
      title: '💎 ᴄᴏғʀᴇ ᴅɪᴠɪɴᴏ',
      amount: pickRandom(300000, 500000),
      message: 'La suerte máxima cayó sobre ti. Este cofre estaba bendecido.'
    }
  }

  if (roll <= 500) {
    return {
      type: 'legendary',
      title: '👑 ᴄᴏғʀᴇ ʟᴇɢᴇɴᴅᴀʀɪᴏ',
      amount: pickRandom(150000, 300000),
      message: 'Encontraste un tesoro legendario escondido entre polvo y oro.'
    }
  }

  if (roll <= 2000) {
    return {
      type: 'epic',
      title: '✨ ᴄᴏғʀᴇ éᴘɪᴄᴏ',
      amount: pickRandom(50000, 150000),
      message: 'El cofre brilló con fuerza y soltó una gran recompensa.'
    }
  }

  if (roll <= 10000) {
    return {
      type: 'good',
      title: '🟨 ᴄᴏғʀᴇ ʙᴜᴇɴᴏ',
      amount: pickRandom(10000, 50000),
      message: 'No estuvo nada mal. El cofre traía una buena cantidad.'
    }
  }

   if (roll <= 68000) {
    return {
      type: 'normal',
      title: '📦 ᴄᴏғʀᴇ ɴᴏʀᴍᴀʟ',
      amount: pickRandom(500, 10000),
      message: 'Abriste un cofre común y encontraste algunas monedas.'
    }
  }

  if (roll <= 93000) {
    return {
      type: 'bad',
      title: '🕸️ ᴄᴏғʀᴇ ᴠᴀᴄíᴏ',
      amount: 0,
      message: 'El cofre estaba casi vacío. Esta vez la suerte no quiso aparecer.'
    }
  }

  return {
    type: 'bomb',
    title: '💣 ʙᴏᴍʙᴀ ᴇɴ ᴇʟ ᴄᴏғʀᴇ',
    amount: pickRandom(COFRE_CONFIG.minBombLoss, COFRE_CONFIG.maxBombLoss),
    message: 'Abriste el cofre equivocado y explotó. La mala suerte hizo de las suyas.'
  }
}

function getRareText(type) {
  if (type === 'jackpot') {
    return '\n💎 *Rareza:* imposible casi imposible\n🔥 *Probabilidad:* extremadamente baja'
  }

  if (type === 'legendary') {
    return '\n👑 *Rareza:* legendaria\n✨ *Probabilidad:* muy baja'
  }

  if (type === 'epic') {
    return '\n✨ *Rareza:* épica\n🍀 *Probabilidad:* baja'
  }

  if (type === 'good') {
    return '\n🟨 *Rareza:* buena\n🍀 *Probabilidad:* moderada'
  }

  if (type === 'normal') {
    return '\n📦 *Rareza:* normal'
  }

  if (type === 'bad') {
    return '\n🕸️ *Rareza:* mala suerte leve'
  }

  if (type === 'bomb') {
    return '\n💣 *Rareza:* mala suerte explosiva\n⚠️ *Probabilidad:* 7%'
  }

  return ''
}

function buildCooldownText({ wait, isGlobal }) {
  return (
    `⏳ 𓆩 ᴄᴏғʀᴇ ᴇɴ ᴇsᴘᴇʀᴀ 𓆪\n\n` +
    `Ya abriste un cofre hace poco.\n\n` +
    `🕒 *Vuelve en:* ${msToTime(wait)}\n` +
    `🌐 *Modo:* ${isGlobal ? 'Global' : 'Grupo'}\n\n` +
    `ᴛᴇɴ ᴘᴀᴄɪᴇɴᴄɪᴀ, ʟᴀ sᴜᴇʀᴛᴇ ᴛᴀᴍʙɪéɴ ᴅᴇsᴄᴀɴsᴀ.`
  )
}

function buildWinText({ result, user, beforeCoins, beforeBank, currency, isGlobal }) {
  const rareText = getRareText(result.type)

  return (
    `𓆩 ${result.title} 𓆪\n\n` +
    `${result.message}\n\n` +
    `💰 *Ganaste:* ${formatMoney(result.amount)} ${currency}\n` +
    `${rareText}\n\n` +
    `🪙 *Cartera antes:* ${formatMoney(beforeCoins)} ${currency}\n` +
    `💵 *Cartera ahora:* ${formatMoney(user.coins)} ${currency}\n` +
    `🏦 *Banco:* ${formatMoney(beforeBank)} ${currency}\n` +
    `🌐 *Modo:* ${isGlobal ? 'Global' : 'Grupo'}\n\n` +
    `⟡ ᴇʟ ᴄᴏғʀᴇ sᴇ ᴀʙʀɪó ʏ ʟᴀ sᴜᴇʀᴛᴇ ᴛᴇ sᴏɴʀɪó.`
  )
}

function buildEmptyText({ result, user, currency, isGlobal }) {
  const rareText = getRareText(result.type)

  return (
    `𓆩 ${result.title} 𓆪\n\n` +
    `${result.message}\n\n` +
    `💰 *Ganancia:* 0 ${currency}\n` +
    `${rareText}\n\n` +
    `🪙 *Cartera actual:* ${formatMoney(user.coins)} ${currency}\n` +
    `🏦 *Banco actual:* ${formatMoney(user.bank)} ${currency}\n` +
    `🌐 *Modo:* ${isGlobal ? 'Global' : 'Grupo'}\n\n` +
    `⟡ ɴᴏ ᴛᴏᴅᴏs ʟᴏs ᴄᴏғʀᴇs ᴛʀᴀᴇɴ ᴛᴇsᴏʀᴏ.`
  )
}

function buildBombText({ result, user, loss, currency, isGlobal }) {
  const rareText = getRareText(result.type)

  return (
    `𓆩 ${result.title} 𓆪\n\n` +
    `${result.message}\n\n` +
    `💸 *Pérdida calculada:* ${formatMoney(loss.requested)} ${currency}\n` +
    `🪙 *Perdido de cartera:* ${formatMoney(loss.fromWallet)} ${currency}\n` +
    `🏦 *Perdido del banco:* ${formatMoney(loss.fromBank)} ${currency}\n` +
    `📉 *Pérdida real:* ${formatMoney(loss.lost)} ${currency}\n` +
    `${rareText}\n\n` +
    `🪙 *Cartera actual:* ${formatMoney(user.coins)} ${currency}\n` +
    `🏦 *Banco actual:* ${formatMoney(user.bank)} ${currency}\n` +
    `🌐 *Modo:* ${isGlobal ? 'Global' : 'Grupo'}\n\n` +
    `⟡ ᴇʟ ᴄᴏғʀᴇ ᴇxᴘʟᴏᴛó, ᴘᴇʀᴏ ᴀʟ ᴍᴇɴᴏs sᴏʙʀᴇᴠɪᴠɪsᴛᴇ.`
  )
}

export default {
  command: ['cofre', 'coffer', 'chest', 'tesoro', 'caja'],
  category: 'economy',
  description: 'Abre un cofre con recompensas o mala suerte.',
  usage: '.cofre',
  group: true,

  run: async (client, m, args, usedPrefix = '.', command = 'cofre') => {
    try {
      const db = global.db.data
      const settings = getBotSettings(client)
      const currency = settings.currency || 'Coins'

      const mode = String(args[0] || '').toLowerCase()
      const isGlobal = ['global', 'g', 'mundo'].includes(mode)

      const user = isGlobal
        ? ensureGlobalUser(db, m.sender, m.pushName || 'Usuario')
        : ensureLocalUser(db, m.chat, m.sender, m.pushName || 'Usuario')

      const now = Date.now()
      const cooldownKey = isGlobal ? 'lastCofreGlobal' : 'lastCofre'
      const lastUsed = user[cooldownKey] || 0
      const wait = COFRE_CONFIG.cooldown - (now - lastUsed)

      if (wait > 0) {
        return m.reply(buildCooldownText({ wait, isGlobal }))
      }

      user[cooldownKey] = now

      const result = getCofreResult()
      const beforeCoins = user.coins || 0
      const beforeBank = user.bank || 0

      if (result.type === 'bomb') {
        const loss = takeMoney(user, result.amount)

        if (typeof global.saveDatabase === 'function') {
          global.saveDatabase()
        }

        return m.reply(
          buildBombText({
            result,
            user,
            loss,
            currency,
            isGlobal
          })
        )
      }

      if (result.amount > 0) {
        user.coins += result.amount
      }

      if (typeof global.saveDatabase === 'function') {
        global.saveDatabase()
      }

      if (result.type === 'bad') {
        return m.reply(
          buildEmptyText({
            result,
            user,
            currency,
            isGlobal
          })
        )
      }

      return m.reply(
        buildWinText({
          result,
          user,
          beforeCoins,
          beforeBank,
          currency,
          isGlobal
        })
      )
    } catch (error) {
      console.error('[COFRE] Error:', error)

      return m.reply(
        `❌ 𓆩 ᴇʀʀᴏʀ ᴄᴏғʀᴇ 𓆪\n\n` +
        `No pude abrir el cofre.\n\n` +
        `⚠️ *Motivo:* ${error?.message || 'Error desconocido'}`
      )
    }
  }
}