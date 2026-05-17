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

function formatMoney(amount = 0, jid = '') {
  if (isOwnerUser(jid)) return '∞'
  return Number(amount || 0).toLocaleString()
}

export default {
  command: ['balance', 'bal', 'coins', 'bank'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency

    if (chatData.adminonly || !chatData.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    const mentioned = m.mentionedJid || []
    const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat)

    if (!(who in db.chats[m.chat].users)) {
      return m.reply(`👤 ᴜsᴜᴀʀɪᴏ ✦ No está registrado en el bot.`)
    }

    const user = chatData.users[who]
    const total = (user.coins || 0) + (user.bank || 0)

    const walletText = formatMoney(user.coins, who)
    const bankText = formatMoney(user.bank, who)
    const totalText = formatMoney(total, who)
    const name = global.db.data.users[who]?.name || who.split('@')[0]

    const bal = `💰 ʙᴀʟᴀɴᴄᴇ ✦ Usuario: *${name}* ✦ 🪙 Cartera: *S/${walletText} ${monedas}* ✦ 🏦 Banco: *S/${bankText} ${monedas}* ✦ 💎 Total: *S/${totalText} ${monedas}*`

    await client.sendMessage(chatId, { text: bal }, { quoted: m })
  }
}