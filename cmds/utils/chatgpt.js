import fetch from 'node-fetch'
import axios from 'axios'

const COOLDOWN_MS = 3 * 60 * 1000
const REQUEST_TIMEOUT_MS = 20_000

function formatCooldown(ms = 0) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes <= 0) return `${seconds}s`
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function cleanResponse(text = '') {
  const value = String(text || '').trim()
  if (!value) return null
  if (/^(no response|null|undefined)$/i.test(value)) return null
  return value
}

function extractResponse(data) {
  const candidates = [
    data?.result?.text,
    data?.result?.response,
    data?.result?.message,
    data?.result,
    data?.results,
    data?.answer,
    data?.response,
    data?.message,
    data?.data?.text,
    data?.data?.result,
    data?.data?.response
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const clean = cleanResponse(candidate)
      if (clean) return clean
    }

    if (Array.isArray(candidate)) {
      const clean = cleanResponse(candidate.find(item => typeof item === 'string'))
      if (clean) return clean
    }
  }

  return null
}

async function fetchJson(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { accept: 'application/json' }
  })

  const data = await response.json()
  return response.ok ? data : null
}

function buildStellarUrl(text = '', prompt = '') {
  const api = global.APIs?.stellar
  if (!api?.url) return null

  const url = new URL('/ai/gptprompt', api.url)
  url.searchParams.set('text', text)
  url.searchParams.set('prompt', prompt)

  if (api.key) {
    url.searchParams.set('key', api.key)
    url.searchParams.set('apikey', api.key)
  }

  return url.toString()
}

async function askStellar(text = '', prompt = '') {
  const url = buildStellarUrl(text, prompt)
  if (!url) return null

  const data = await fetchJson(url)
  return extractResponse(data)
}

async function askLuminsesi(text = '', username = 'usuario', prompt = '') {
  const res = await axios.post(
    'https://ai.siputzx.my.id',
    {
      content: text,
      user: username,
      prompt,
      webSearchMode: false
    },
    { timeout: REQUEST_TIMEOUT_MS }
  )

  return extractResponse(res.data)
}

export default {
  command: ['ia', 'chatgpt'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const officialBotId = global.client?.user?.id
      ? `${global.client.user.id.split(':')[0]}@s.whatsapp.net`
      : botId

    const isOficialBot = botId === officialBotId
    const isPremiumBot = global.db.data.settings[botId]?.botprem === true
    const isModBot = global.db.data.settings[botId]?.botmod === true

    if (!isOficialBot && !isPremiumBot && !isModBot) {
      return client.reply(m.chat, `《✧》El comando *${command}* no está disponible en *Sub-Bots.*`, m)
    }

    const text = args.join(' ').trim()
    if (!text) {
      return m.reply(`《✧》 Escriba una *petición* para que *ChatGPT* le responda.`)
    }

    const db = global.db.data
    db.users ||= {}
    db.users[m.sender] ||= {}

    const user = db.users[m.sender]
    const now = Date.now()
    const lastChatgpt = Number(user.lastChatgpt || 0)
    const cooldownLeft = Math.max(0, COOLDOWN_MS - (now - lastChatgpt))

    if (cooldownLeft > 0) {
      return m.reply(
        `╭━━〔 ⏳ CHATGPT EN COOLDOWN 〕━━⬣\n` +
        `┃ Espera *${formatCooldown(cooldownLeft)}* antes de usarlo otra vez.\n` +
        `┃ Así evitamos el error de *no response* por usar la IA seguido.\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    const botname = db.settings[botId]?.botname || 'Bot'
    const username = db.users[m.sender]?.name || m.pushName || 'usuario'
    const basePrompt = `Tu nombre es ${botname}. Tu version actual es ${global.version || 'actual'}. Responde en Espanol para WhatsApp, con texto limpio, amigable y decorado con emojis simples. Llama al usuario por su nombre: ${username}.`

    try {
      const { key } = await client.sendMessage(m.chat, { text: `⌬ *ChatGPT* está procesando tu respuesta...` }, { quoted: m })

      try {
        await m.react('🕒')
      } catch {}

      const prompt = `${basePrompt}\n\nUsuario: ${text}`
      let responseText = null

      const providers = [
        () => askLuminsesi(text, username, prompt),
        () => askStellar(text, basePrompt)
      ]

      for (const provider of providers) {
        try {
          responseText = await provider()
          if (responseText) break
        } catch {}
      }

      if (!responseText) {
        try {
          await m.react('✖️')
        } catch {}

        return client.reply(
          m.chat,
          `╭━━〔 ⚠️ CHATGPT SIN RESPUESTA 〕━━⬣\n` +
          `┃ La IA no devolvió una respuesta válida.\n` +
          `┃ Intenta otra vez en unos minutos.\n` +
          `╰━━━━━━━━━━━━━━━━━━━━⬣`,
          m
        )
      }

      user.lastChatgpt = Date.now()
      await client.sendMessage(m.chat, { text: responseText.trim(), edit: key })

      try {
        await m.react('✔️')
      } catch {}
    } catch (e) {
      try {
        await m.react('✖️')
      } catch {}

      await m.reply(
        `> Ocurrió un error al ejecutar *${usedPrefix + command}*.\n` +
        `> [Error: *${e.message}*]`
      )
    }
  }
}
