import { resolveLidToRealJid } from "../../core/utils.js"

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

function cleanJid(jid = '') {
  return String(jid).split(':')[0].trim()
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function isOwnerUser(jid = '') {
  const raw = cleanJid(jid)
  const number = onlyNumber(jid)

  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ]

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

function getAmount(args = []) {
  for (const arg of args) {
    const clean = String(arg).replace(/[^\d]/g, '')
    const num = parseInt(clean)
    if (!isNaN(num) && num > 0) return num
  }

  return 0
}

export default {
  command: ['takecoins', 'quitcoins', 'removecoins'],
  category: 'owner',
  group: true,

  run: async (client, m, args, usedPrefix, command) => {
    const senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
    const senderIsOwner = isOwnerUser(m.sender) || isOwnerUser(senderReal)

    if (!senderIsOwner) return m.reply(`👑 ᴏᴡɴᴇʀ ✦ Este comando es exclusivo del owner.`)

    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId] || {}
    const monedas = botSettings.currency || 'coins'

    const mentioned = m.mentionedJid || []
    const who2 = mentioned[0] || (m.quoted ? m.quoted.sender : '') || ''

    if (!who2) return m.reply(`💸 ᴛᴀᴋᴇᴄᴏɪɴs ✦ Menciona al usuario. Ejemplo: *${usedPrefix + command} @usuario 50000*`)

    const cantidad = getAmount(args)

    if (!cantidad || cantidad <= 0) return m.reply(`✎ ᴜsᴏ ✦ Ingresa una cantidad válida. Ejemplo: *${usedPrefix + command} @usuario 50000*`)

    const who = await resolveLidToRealJid(who2, client, m.chat)
    const user = chatData.users[who] || chatData.users[who2]

    if (!user) return m.reply(`👤 ᴜsᴜᴀʀɪᴏ ✦ El usuario mencionado no está registrado en el bot.`)

    if (typeof user.coins !== 'number') user.coins = 0
    if (typeof user.bank !== 'number') user.bank = 0

    const totalActual = user.coins + user.bank

    if (totalActual <= 0) return m.reply(`💸 ᴛᴀᴋᴇᴄᴏɪɴs ✦ Ese usuario no tiene *${monedas}* para quitar.`)

    const cantidadFinal = Math.min(cantidad, totalActual)
    let restante = cantidadFinal

    const quitarCartera = Math.min(user.coins, restante)
    user.coins -= quitarCartera
    restante -= quitarCartera

    if (restante > 0) {
      const quitarBanco = Math.min(user.bank, restante)
      user.bank -= quitarBanco
      restante -= quitarBanco
    }

    const name = db.users?.[who]?.name || db.users?.[who2]?.name || who.split('@')[0]
    const totalNuevo = user.coins + user.bank

    await client.sendMessage(chatId, {
      text: `💸 ᴛᴀᴋᴇᴄᴏɪɴs ✦ Se quitaron *S/${cantidadFinal.toLocaleString()} ${monedas}* a *${name}* ✦ 🪙 Cartera: *S/${user.coins.toLocaleString()}* ✦ 🏦 Banco: *S/${user.bank.toLocaleString()}* ✦ 💎 Total: *S/${totalNuevo.toLocaleString()}*`,
      mentions: [who]
    }, { quoted: m })
  }
}