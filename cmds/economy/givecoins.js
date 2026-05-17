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

export default {
  command: ['givecoins', 'pay', 'coinsgive'],
  category: 'rpg',
  group: true,
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency || 'coins'
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const mentioned = m.mentionedJid || []
    const who2 = m.quoted ? m.quoted.sender : mentioned[0] || (args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '')

    if (!who2) return m.reply(`💸 ᴘᴀʏ ✦ Menciona a quién enviar. Ejemplo: *${usedPrefix + command} 25000 @usuario*`)

    const who = await resolveLidToRealJid(who2, client, m.chat)
    const senderReal = await resolveLidToRealJid(m.sender, client, m.chat)

    const senderData = chatData.users[m.sender] || chatData.users[senderReal]
    const targetData = chatData.users[who]
    const senderIsOwner = isOwnerUser(m.sender) || isOwnerUser(senderReal)

    if (!senderData && !senderIsOwner) return m.reply(`👤 ᴜsᴜᴀʀɪᴏ ✦ No estás registrado en el bot.`)
    if (!targetData) return m.reply(`👤 ᴜsᴜᴀʀɪᴏ ✦ El usuario mencionado no está registrado en el bot.`)

    const cantidadInput = args[0]?.toLowerCase()
    let cantidad

    if (cantidadInput === 'all') {
      if (senderIsOwner) return m.reply(`👑 ᴏᴡɴᴇʀ ✦ Usa una cantidad exacta: *${usedPrefix + command} 50000 @usuario*`)
      cantidad = senderData.bank
    } else {
      cantidad = parseInt(cantidadInput)
    }

    if (!cantidadInput || isNaN(cantidad) || cantidad <= 0) return m.reply(`✎ ᴜsᴏ ✦ Ingresa una cantidad válida de *${monedas}* para transferir.`)

    if (typeof senderData.bank !== 'number') senderData.bank = 0

    if (!senderIsOwner && senderData.bank < cantidad) {
      return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ No tienes suficientes *${monedas}* en el banco. ✦ Banco actual: *S/${senderData.bank.toLocaleString()} ${monedas}*`)
    }

    if (!senderIsOwner) senderData.bank -= cantidad

    if (typeof targetData.bank !== 'number') targetData.bank = 0
    targetData.bank += cantidad

    if (isNaN(senderData.bank)) senderData.bank = 0

    const name = global.db.data.users[who]?.name || who.split('@')[0]
    const senderBalanceText = senderIsOwner ? '∞' : senderData.bank.toLocaleString()

    await client.sendMessage(chatId, {
      text: `💸 ᴛʀᴀɴsғᴇʀᴇɴᴄɪᴀ ✦ Enviaste *S/${cantidad.toLocaleString()} ${monedas}* a *${name}* ✦ Banco: *S/${senderBalanceText} ${monedas}*`,
      mentions: [who]
    }, { quoted: m })
  }
}