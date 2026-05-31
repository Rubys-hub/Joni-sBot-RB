import { resolveLidToRealJid } from "../../core/utils.js"

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

function cleanJid(jid = '') {
  jid = String(jid || '').trim()
  if (!jid) return ''

  if (!jid.includes('@')) return jid.split(':')[0]

  const [left, server] = jid.split('@')
  const cleanLeft = left.split(':')[0]

  return `${cleanLeft}@${server}`
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function sameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (!rawA || !rawB) return false
  if (rawA === rawB) return true

  const numA = onlyNumber(rawA)
  const numB = onlyNumber(rawB)

  return !!numA && !!numB && numA === numB
}

function isOwnerUser(jid = '') {
  const raw = cleanJid(jid)
  const number = onlyNumber(jid)

  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].filter(Boolean)

  return owners.some(owner => {
    const ownerRaw = cleanJid(owner)
    const ownerNumber = onlyNumber(owner)

    return (
      ownerRaw === raw ||
      ownerNumber === number ||
      ownerRaw === `${number}@s.whatsapp.net` ||
      ownerRaw === `${number}@lid`
    )
  })
}

function formatNumber(amount = 0) {
  const number = Number(amount || 0)
  if (!Number.isFinite(number)) return '0'
  return Math.floor(number).toLocaleString('en-US')
}

function formatMoney(amount = 0, currency = 'Soles') {
  return `S/${formatNumber(amount)} ${currency}`
}

function parseAmount(input = '') {
  let text = String(input || '').toLowerCase().trim()

  if (!text) return null

  if (['all', 'todo', 'todos'].includes(text)) {
    return 'all'
  }

  /*
    Evita el bug:
    Si el token es una mención o JID, NO se convierte en cantidad.
    Antes @usuario podía terminar convertido en su número telefónico.
  */
  if (
    text.startsWith('@') ||
    text.includes('@s.whatsapp.net') ||
    text.includes('@lid') ||
    text.includes('@g.us')
  ) {
    return null
  }

  text = text
    .replace(/\s+/g, '')
    .replace(/s\/|soles?|coins?|monedas?/g, '')

  if (!text) return null

  let multiplier = 1

  if (/millones?$/.test(text)) {
    multiplier = 1000000
    text = text.replace(/millones?$/, '')
  } else if (/mil$/.test(text)) {
    multiplier = 1000
    text = text.replace(/mil$/, '')
  } else if (/k$/.test(text)) {
    multiplier = 1000
    text = text.replace(/k$/, '')
  } else if (/m$/.test(text)) {
    multiplier = 1000000
    text = text.replace(/m$/, '')
  } else if (/b$/.test(text)) {
    multiplier = 1000000000
    text = text.replace(/b$/, '')
  }

  if (!text) return null

  if (/^\d{1,3}([.,]\d{3})+$/.test(text)) {
    text = text.replace(/[.,]/g, '')
  } else {
    text = text.replace(',', '.')
  }

  if (!/^\d+(\.\d+)?$/.test(text)) return null

  const number = Number(text) * multiplier

  if (!Number.isFinite(number)) return null

  return Math.floor(number)
}

function formatUserName(db = {}, userKey = '') {
  return (
    db.users?.[userKey]?.name ||
    db.users?.[cleanJid(userKey)]?.name ||
    cleanJid(userKey).split('@')[0] ||
    'usuario'
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

    const foundKey = Object.keys(chatData.users).find(key => {
      return onlyNumber(key) === number || cleanJid(key) === clean
    })

    if (foundKey) {
      return {
        key: foundKey,
        data: chatData.users[foundKey]
      }
    }
  }

  return null
}

function getContextInfo(m = {}) {
  return (
    m?.message?.extendedTextMessage?.contextInfo ||
    m?.msg?.contextInfo ||
    m?.message?.imageMessage?.contextInfo ||
    m?.message?.videoMessage?.contextInfo ||
    {}
  )
}

function getMentionedJids(m = {}) {
  const contextInfo = getContextInfo(m)

  return [
    ...(Array.isArray(m.mentionedJid) ? m.mentionedJid : []),
    ...(Array.isArray(contextInfo.mentionedJid) ? contextInfo.mentionedJid : [])
  ].filter(Boolean)
}

function getQuotedSender(m = {}) {
  const contextInfo = getContextInfo(m)

  return (
    m?.quoted?.sender ||
    m?.quoted?.participant ||
    contextInfo?.participant ||
    ''
  )
}

function getTargetAndAmount(m = {}, args = []) {
  const mentioned = getMentionedJids(m)
  const quotedSender = getQuotedSender(m)

  const tokens = args.map((value, index) => ({
    raw: String(value || '').trim(),
    index,
    number: onlyNumber(value)
  }))

  let targetJid = mentioned[0] || quotedSender || ''
  const targetIndexes = new Set()

  if (targetJid) {
    for (const token of tokens) {
      if (
        token.raw.startsWith('@') ||
        token.raw.includes('@') ||
        sameUser(token.raw, targetJid)
      ) {
        targetIndexes.add(token.index)
      }
    }
  } else {
    const targetToken =
      tokens.find(token => token.raw.includes('@') && token.number.length >= 5) ||
      tokens.find(token => token.number.length >= 8)

    if (targetToken) {
      targetJid = `${targetToken.number}@s.whatsapp.net`
      targetIndexes.add(targetToken.index)
    }
  }

  let amountInput = null

  for (const token of tokens) {
    if (targetIndexes.has(token.index)) continue

    const parsed = parseAmount(token.raw)

    if (parsed !== null) {
      amountInput = parsed
      break
    }
  }

  return {
    targetJid,
    amountInput
  }
}

async function safeResolve(jid, client, chat) {
  try {
    return await resolveLidToRealJid(jid, client, chat)
  } catch {
    return jid
  }
}

export default {
  command: ['givecoins', 'pay', 'coinsgive'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'givecoins') => {
    const db = global.db.data
    const chatId = m.chat

    db.chats ||= {}
    db.users ||= {}
    db.settings ||= {}

    db.chats[chatId] ||= {}
    db.chats[chatId].users ||= {}

    const botNumber = onlyNumber(client?.user?.id || client?.user?.jid || '')
    const botId = botNumber ? `${botNumber}@s.whatsapp.net` : cleanJid(client?.user?.id || '')

    const botSettings = db.settings[botId] || {}
    const monedas = botSettings.currency || 'Soles'
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(
        `▣ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ\n` +
        `▪ La economía está desactivada.\n` +
        `▪ Actívala con: ${usedPrefix}economy on`
      )
    }

    const { targetJid, amountInput } = getTargetAndAmount(m, args)

    if (!targetJid) {
      return m.reply(
        `▣ ᴘᴀʏ\n` +
        `▪ Menciona a quién enviar.\n\n` +
        `Ejemplos:\n` +
        `▪ ${usedPrefix + command} @usuario 25000\n` +
        `▪ ${usedPrefix + command} 25000 @usuario\n` +
        `▪ Responde un mensaje: ${usedPrefix + command} 25000`
      )
    }

    if (amountInput === null) {
      return m.reply(
        `▣ ᴘᴀʏ\n` +
        `▪ Ingresa una cantidad válida.\n\n` +
        `Ejemplos:\n` +
        `▪ ${usedPrefix + command} @usuario 20\n` +
        `▪ ${usedPrefix + command} 20 @usuario\n` +
        `▪ ${usedPrefix + command} @usuario 25k`
      )
    }

    let targetReal = targetJid
    let senderReal = m.sender

    targetReal = await safeResolve(targetJid, client, m.chat)
    senderReal = await safeResolve(m.sender, client, m.chat)

    const senderInfo = findUser(chatData, senderReal, m.sender)
    const targetInfo = findUser(chatData, targetReal, targetJid)

    const senderIsOwner =
      isOwnerUser(m.sender) ||
      isOwnerUser(senderReal)

    if (!senderInfo && !senderIsOwner) {
      return m.reply(
        `▣ ᴘᴀʏ\n` +
        `▪ No estás registrado en la economía.\n` +
        `▪ Usa ${usedPrefix}daily para empezar.`
      )
    }

    if (!targetInfo) {
      return m.reply(
        `▣ ᴘᴀʏ\n` +
        `▪ El usuario mencionado no está registrado.\n` +
        `▪ Debe usar ${usedPrefix}daily para iniciar.`
      )
    }

    if (sameUser(senderInfo?.key || senderReal, targetInfo.key)) {
      return m.reply(
        `▣ ᴘᴀʏ\n` +
        `▪ No puedes enviarte dinero a ti mismo.`
      )
    }

    const senderData = senderInfo?.data
    const targetData = targetInfo.data

    let cantidad

    if (amountInput === 'all') {
      if (senderIsOwner) {
        return m.reply(
          `▣ ᴏᴡɴᴇʀ\n` +
          `▪ Usa una cantidad exacta.\n` +
          `▪ Ejemplo: ${usedPrefix + command} @usuario 50000`
        )
      }

      cantidad = Number(senderData.bank || 0)
    } else {
      cantidad = Number(amountInput)
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return m.reply(
        `▣ ᴘᴀʏ\n` +
        `▪ Ingresa una cantidad válida.\n` +
        `▪ Ejemplo: ${usedPrefix + command} @usuario 25000`
      )
    }

    cantidad = Math.floor(cantidad)

    if (!senderIsOwner) {
      senderData.bank = Number(senderData.bank || 0)

      if (senderData.bank < cantidad) {
        return m.reply(
          `▣ sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ\n` +
          `▪ Banco actual: ${formatMoney(senderData.bank, monedas)}\n` +
          `▪ Intentaste enviar: ${formatMoney(cantidad, monedas)}`
        )
      }

      senderData.bank -= cantidad
    }

    targetData.bank = Number(targetData.bank || 0) + cantidad

    const name = formatUserName(db, targetInfo.key)
    const senderBalanceText = senderIsOwner
      ? `∞ ${monedas}`
      : formatMoney(senderData.bank, monedas)

    return client.sendMessage(chatId, {
      text:
        `▣ ᴛʀᴀɴsғᴇʀᴇɴᴄɪᴀ ᴇxɪᴛᴏsᴀ\n` +
        `▪ Destino: @${onlyNumber(targetInfo.key)}\n` +
        `▪ Usuario: ${name}\n` +
        `▪ Enviado: ${formatMoney(cantidad, monedas)}\n` +
        `▪ Tu banco: ${senderBalanceText}`,
      mentions: [targetInfo.key, targetJid, targetReal].filter(Boolean)
    }, { quoted: m })
  }
}