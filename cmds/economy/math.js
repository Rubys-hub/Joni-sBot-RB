global.math = global.math || {}

const limits = { facil: 10, medio: 50, dificil: 90, imposible: 100, imposible2: 160 }
const rewardRanges = { facil: [500, 1000], medio: [1000, 2000], dificil: [2000, 3500], imposible: [3500, 4800], imposible2: [5000, 6500] }

const generateRandomNumber = (max) => Math.floor(Math.random() * max) + 1
const getOperation = () => ['+', '-', '*', '/'][Math.floor(Math.random() * 4)]

const generarProblema = (dificultad) => {
  const maxLimit = limits[dificultad] || 30
  const num1 = generateRandomNumber(maxLimit)
  const num2 = generateRandomNumber(maxLimit)
  const operador = getOperation()
  const resultado = eval(`${num1} ${operador} ${num2}`)
  const simbolo = operador === '*' ? '×' : operador === '/' ? '÷' : operador
  return { problema: `${num1} ${simbolo} ${num2}`, resultado }
}

export default {
  command: ['math', 'mates', 'resp'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const chatId = m.chat
    const chat = global.db.data.chats[chatId]
    const user = global.db.data.users[m.sender]
    const juego = global.math[chatId]

    if (chat.adminonly || !chat.economy) return m.reply(`⚠️ ᴇᴄᴏɴᴏᴍíᴀ ᴏғғ ✦ Un admin puede activarla con *${usedPrefix}economy on*`)

    if (command === 'resp') {
      if (!juego?.juegoActivo) return

      const quotedId = m.quoted?.key?.id || m.quoted?.id || m.quoted?.stanzaId
      if (quotedId !== juego.problemMessageId) return

      const respuestaUsuario = parseFloat(args[0])
      if (isNaN(respuestaUsuario)) return client.reply(chatId, `🧮 ᴍᴀᴛʜ ✦ Responde con número. Ejemplo: *${usedPrefix}resp 42*`, m)

      const respuestaCorrecta = parseFloat(juego.respuesta)
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat.primaryBot

      if (!primaryBotId || primaryBotId === botId) {
        if (respuestaUsuario === respuestaCorrecta) {
          const [min, max] = rewardRanges[juego.dificultad] || [500, 1000]
          const coinsAleatorio = Math.floor(Math.random() * (max - min + 1)) + min

          user.coins += coinsAleatorio
          clearTimeout(juego.tiempoLimite)
          delete global.math[chatId]

          return client.reply(chatId, `✅ ᴄᴏʀʀᴇᴄᴛᴏ ✦ Ganaste *S/${coinsAleatorio.toLocaleString()}*.`, m)
        }

        juego.intentos += 1

        if (juego.intentos >= 3) {
          clearTimeout(juego.tiempoLimite)
          delete global.math[chatId]
          return client.reply(chatId, `❌ ᴍᴀᴛʜ ✦ Te quedaste sin intentos.`, m)
        }

        const intentosRestantes = 3 - juego.intentos
        return client.reply(chatId, `❌ ɪɴᴄᴏʀʀᴇᴄᴛᴏ ✦ Te quedan *${intentosRestantes}* intentos.`, m)
      }

      return
    }

    if (['math', 'mates'].includes(command)) {
      if (juego?.juegoActivo) return client.reply(chatId, `⏳ ᴍᴀᴛʜ ✦ Ya hay un juego activo.`, m)

      const dificultad = args[0]?.toLowerCase()
      if (!limits[dificultad]) return client.reply(chatId, `🧮 ᴍᴀᴛʜ ✦ Dificultad: *facil, medio, dificil, imposible, imposible2*.`, m)

      const { problema, resultado } = generarProblema(dificultad)

      const problemMessage = await client.reply(chatId, `🧮 ʀᴇᴛᴏ ✦ Resuelve: *${problema}* ✦ Tienes 1 minuto ✦ Usa *${usedPrefix}resp respuesta*.`, m)

      global.math[chatId] = {
        juegoActivo: true,
        problema,
        respuesta: resultado.toString(),
        intentos: 0,
        dificultad,
        timeout: Date.now() + 60000,
        problemMessageId: problemMessage.key?.id,
        tiempoLimite: setTimeout(() => {
          if (global.math[chatId]?.juegoActivo) {
            delete global.math[chatId]
            client.reply(chatId, `⌛ ᴛɪᴇᴍᴘᴏ ✦ Se acabó el reto.`, m)
          }
        }, 60000)
      }
    }
  }
}