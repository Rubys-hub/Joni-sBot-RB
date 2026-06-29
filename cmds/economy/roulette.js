export default {
command: ['rt', 'roulette', 'ruleta', 'suerte'],
category: 'rpg',
run: async (client, m, args, usedPrefix, command) => {
const db = global.db.data
const chatId = m.chat
const senderId = m.sender
const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
const botSettings = db.settings[botId] || (db.settings[botId] = {})
const chatData = db.chats[chatId]
const currency = botSettings.currency || 'Monedas'

if (!chatData.users) chatData.users = {}
if (!chatData.users[m.sender]) chatData.users[m.sender] = { coins: 0 }

const user = chatData.users[m.sender]

if (!botSettings.rouletteLuck) {
botSettings.rouletteLuck = {
enabled: false,
winRate: 0
}
}

const rouletteLuck = botSettings.rouletteLuck

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

const getColorByNumber = (number) => {
if (number === 0) return 'green'
if (redNumbers.includes(number)) return 'red'
return 'black'
}

const getRandomNumberFromColor = (color) => {
if (color === 'green') return 0
if (color === 'red') return redNumbers[Math.floor(Math.random() * redNumbers.length)]
return blackNumbers[Math.floor(Math.random() * blackNumbers.length)]
}

const getRandomLosingColor = (playerColor) => {
const available = ['red', 'black', 'green'].filter(c => c !== playerColor)
return available[Math.floor(Math.random() * available.length)]
}

const getWinMultiplierByColor = (color) => {
return color === 'green' ? 14 : 2
}

const getLossAmountByColor = (color, amount) => {
if (color === 'green') return amount * 14
return amount
}

if (command === 'suerte') {
if (!m.isOwner) {
return m.reply('⚠️ Este comando es solo para el owner.')
}

if (!args[0]) {
return m.reply(
`🎡 *CONFIGURACIÓN DE SUERTE - RULETA*\n\n` +
`Estado actual: *${rouletteLuck.enabled ? 'ACTIVADA' : 'DESACTIVADA'}*\n` +
`Porcentaje actual: *${rouletteLuck.winRate}%*\n\n` +
`Usos:\n` +
`*${usedPrefix}suerte ruleta on*\n` +
`*${usedPrefix}suerte ruleta off*\n` +
`*${usedPrefix}suerte ruleta 50*`
)
}

if (args[0].toLowerCase() !== 'ruleta') {
return m.reply(`⚠️ Usa: *${usedPrefix}suerte ruleta on*, *${usedPrefix}suerte ruleta off* o *${usedPrefix}suerte ruleta 50*`)
}

if (!args[1]) {
return m.reply(
`🎡 *CONFIGURACIÓN DE SUERTE - RULETA*\n\n` +
`Estado actual: *${rouletteLuck.enabled ? 'ACTIVADA' : 'DESACTIVADA'}*\n` +
`Porcentaje actual: *${rouletteLuck.winRate}%*\n\n` +
`Usos:\n` +
`*${usedPrefix}suerte ruleta on*\n` +
`*${usedPrefix}suerte ruleta off*\n` +
`*${usedPrefix}suerte ruleta 50*`
)
}

const option = args[1].toLowerCase()

if (option === 'on') {
rouletteLuck.enabled = true
return m.reply(`✅ La suerte global de la *ruleta* fue *activada*.\n🎯 Porcentaje actual: *${rouletteLuck.winRate}%*`)
}

if (option === 'off') {
rouletteLuck.enabled = false
return m.reply(`❌ La suerte global de la *ruleta* fue *desactivada*.\n🎯 Porcentaje actual guardado: *${rouletteLuck.winRate}%*`)
}

const percentage = parseInt(option)

if (isNaN(percentage) || percentage < 0 || percentage > 100) {
return m.reply(`⚠️ Ingresa un porcentaje válido entre *0* y *100*.\nEjemplo: *${usedPrefix}suerte ruleta 35*`)
}

rouletteLuck.winRate = percentage
rouletteLuck.enabled = true

return m.reply(`✅ Suerte global de la *ruleta* configurada en *${percentage}%*.\n🎯 Estado: *ACTIVADA*`)
}

if (chatData.adminonly || !chatData.economy) {
return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)
}

if (args.length < 2) {
return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Usa: *${usedPrefix}rt 2000 black* o *${usedPrefix}rt green 2000*`)
}

let amount, color

if (!isNaN(parseInt(args[0]))) {
amount = parseInt(args[0])
color = args[1].toLowerCase()
} else if (!isNaN(parseInt(args[1]))) {
color = args[0].toLowerCase()
amount = parseInt(args[1])
} else {
return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Formato inválido. Ejemplo: *${usedPrefix}rt 2000 black*`)
}

const validColors = ['red', 'black', 'green']

if (isNaN(amount) || amount < 200) {
return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Apuesta mínima: *200 ${currency}*.`)
}

if (!validColors.includes(color)) {
return m.reply(`🎡 ʀᴜʟᴇᴛᴀ ✦ Elige: *red*, *black* o *green*.`)
}

const possibleLoss = getLossAmountByColor(color, amount)

if (!m.isOwner && user.coins < possibleLoss) {
return m.reply(`💸 sᴀʟᴅᴏ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ✦ Necesitas *${possibleLoss.toLocaleString()} ${currency}* para hacer esa apuesta.`)
}

let rouletteNumber
let resultColor

if (rouletteLuck.enabled) {
const shouldWin = Math.random() * 100 < rouletteLuck.winRate

if (shouldWin) {
resultColor = color
rouletteNumber = getRandomNumberFromColor(color)
} else {
resultColor = getRandomLosingColor(color)
rouletteNumber = getRandomNumberFromColor(resultColor)
}
} else {
rouletteNumber = Math.floor(Math.random() * 37)
resultColor = getColorByNumber(rouletteNumber)
}

const reward = amount * getWinMultiplierByColor(color)
const loss = getLossAmountByColor(color, amount)

if (resultColor === color) {
if (!m.isOwner) user.coins += reward

await client.sendMessage(chatId, {
text: `🎡 ʀᴜʟᴇᴛᴀ ✦ Salió *${resultColor}* (${rouletteNumber}) ✦ Ganaste *${reward.toLocaleString()} ${currency}*.`,
mentions: [senderId]
}, { quoted: m })
} else {
if (!m.isOwner) user.coins -= loss

await client.sendMessage(chatId, {
text: `🎡 ʀᴜʟᴇᴛᴀ ✦ Salió *${resultColor}* (${rouletteNumber}) ✦ Perdiste *${loss.toLocaleString()} ${currency}*.`,
mentions: [senderId]
}, { quoted: m })
}
}
}