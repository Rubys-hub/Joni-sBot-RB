/*
  ╭──────────────────────────────────────────────╮
  │ RubyJX Bot - Comando .hablar                 │
  │ Texto a voz estilo nota de voz real           │
  │ Google Translate TTS + FFmpeg OGG OPUS        │
  │ Autor: J_Drsx / RubyJX                        │
  ╰──────────────────────────────────────────────╯

  Uso:
    .hablar hola mi gente
    .hablar es hola mi gente
    .hablar en hello everyone
    .hablar ja こんにちは
    .hablar --lang es texto largo

  Importante:
    - Google devuelve MP3.
    - WhatsApp nota de voz usa mejor OGG OPUS.
    - Por eso este comando convierte MP3 → OGG OPUS con FFmpeg.
    - No reenvía audios, los genera nuevos.
*/

import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'

const COMMAND_NAME = 'hablar'

const DEFAULT_LANGUAGE = 'es'
const MAX_TEXT_TOTAL = 1200
const MAX_CHUNK_LENGTH = 180
const DELAY_BETWEEN_AUDIOS_MS = 900

const GOOGLE_TTS_BASE = 'https://translate.google.com/translate_tts'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const ACCEPT_LANGUAGE = 'es-ES,es;q=0.9,en;q=0.8'

const SUPPORTED_LANGUAGES = {
  af: 'Afrikáans',
  ar: 'Árabe',
  bn: 'Bengalí',
  ca: 'Catalán',
  cs: 'Checo',
  da: 'Danés',
  de: 'Alemán',
  el: 'Griego',
  en: 'Inglés',
  es: 'Español',
  fi: 'Finlandés',
  fr: 'Francés',
  hi: 'Hindi',
  id: 'Indonesio',
  it: 'Italiano',
  ja: 'Japonés',
  ko: 'Coreano',
  nl: 'Neerlandés',
  no: 'Noruego',
  pl: 'Polaco',
  pt: 'Portugués',
  ru: 'Ruso',
  sv: 'Sueco',
  th: 'Tailandés',
  tr: 'Turco',
  uk: 'Ucraniano',
  vi: 'Vietnamita',
  zh: 'Chino'
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function cleanText(text = '') {
  return String(text || '')
    .replace(/\u200e/g, '')
    .replace(/\u200f/g, '')
    .replace(/\u202a/g, '')
    .replace(/\u202b/g, '')
    .replace(/\u202c/g, '')
    .replace(/\u202d/g, '')
    .replace(/\u202e/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeLang(lang = '') {
  const clean = String(lang || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-záéíóúñ-]/gi, '')

  if (!clean) return DEFAULT_LANGUAGE

  const map = {
    spa: 'es',
    spanish: 'es',
    español: 'es',
    espanol: 'es',

    english: 'en',
    ingles: 'en',
    inglés: 'en',

    portugues: 'pt',
    portugués: 'pt',
    portuguese: 'pt',

    japones: 'ja',
    japonés: 'ja',
    japanese: 'ja',

    coreano: 'ko',
    korean: 'ko',

    chino: 'zh',
    chinese: 'zh',

    frances: 'fr',
    francés: 'fr',
    french: 'fr',

    aleman: 'de',
    alemán: 'de',
    german: 'de',

    italiano: 'it',
    italian: 'it'
  }

  if (map[clean]) return map[clean]

  const short = clean.split('-')[0]
  return SUPPORTED_LANGUAGES[short] ? short : DEFAULT_LANGUAGE
}

function isLanguageCode(value = '') {
  const clean = String(value || '').toLowerCase().trim()
  if (!clean) return false
  if (SUPPORTED_LANGUAGES[clean]) return true

  const normalized = normalizeLang(clean)
  return normalized !== DEFAULT_LANGUAGE || clean === DEFAULT_LANGUAGE
}

function parseInput(args = []) {
  const original = Array.isArray(args) ? args.join(' ') : String(args || '')
  let text = cleanText(original)
  let lang = DEFAULT_LANGUAGE

  if (!text) {
    return { lang, text: '', raw: original }
  }

  const parts = text.split(' ').filter(Boolean)

  const langFlagIndex = parts.findIndex(part =>
    part === '--lang' ||
    part === '-l' ||
    part === '--idioma' ||
    part === '-i'
  )

  if (langFlagIndex !== -1) {
    const possibleLang = parts[langFlagIndex + 1]

    if (possibleLang) {
      lang = normalizeLang(possibleLang)
      parts.splice(langFlagIndex, 2)
      text = cleanText(parts.join(' '))
    }
  } else {
    const first = parts[0]

    if (parts.length >= 2 && isLanguageCode(first)) {
      lang = normalizeLang(first)
      parts.shift()
      text = cleanText(parts.join(' '))
    }
  }

  return { lang, text, raw: original }
}

function splitTextIntoChunks(text = '', maxLength = MAX_CHUNK_LENGTH) {
  const clean = cleanText(text)
  if (!clean) return []
  if (clean.length <= maxLength) return [clean]

  const sentences = clean
    .replace(/([.!?¿¡])\s+/g, '$1|')
    .split('|')
    .map(part => cleanText(part))
    .filter(Boolean)

  const chunks = []

  for (const sentence of sentences) {
    if (sentence.length <= maxLength) {
      const last = chunks[chunks.length - 1]

      if (last && `${last} ${sentence}`.length <= maxLength) {
        chunks[chunks.length - 1] = `${last} ${sentence}`
      } else {
        chunks.push(sentence)
      }

      continue
    }

    const words = sentence.split(' ').filter(Boolean)
    let current = ''

    for (const word of words) {
      if (!current) {
        current = word
        continue
      }

      if (`${current} ${word}`.length <= maxLength) {
        current += ` ${word}`
      } else {
        chunks.push(current)
        current = word
      }
    }

    if (current) chunks.push(current)
  }

  return chunks.filter(Boolean)
}

function buildGoogleTtsUrl(text, lang) {
  const url = new URL(GOOGLE_TTS_BASE)

  url.searchParams.set('ie', 'UTF-8')
  url.searchParams.set('q', text)
  url.searchParams.set('tl', lang)
  url.searchParams.set('client', 'tw-ob')
  url.searchParams.set('total', '1')
  url.searchParams.set('idx', '0')
  url.searchParams.set('textlen', String(text.length))

  return url.toString()
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    })

    return res
  } finally {
    clearTimeout(timeout)
  }
}

async function getGoogleVoiceMp3Buffer(text, lang = DEFAULT_LANGUAGE) {
  const clean = cleanText(text)

  if (!clean) {
    throw new Error('Texto vacío.')
  }

  const url = buildGoogleTtsUrl(clean, lang)

  const res = await fetchWithTimeout(url, {
    method: 'GET',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: '*/*',
      'Accept-Language': ACCEPT_LANGUAGE,
      Referer: 'https://translate.google.com/',
      Origin: 'https://translate.google.com'
    }
  })

  if (!res.ok) {
    throw new Error(`Google TTS respondió con estado ${res.status}.`)
  }

  const contentType = String(res.headers.get('content-type') || '').toLowerCase()

  if (!contentType.includes('audio') && !contentType.includes('mpeg')) {
    const preview = await res.text().catch(() => '')
    throw new Error(
      `Respuesta inválida de Google TTS. Content-Type: ${contentType || 'desconocido'} ${preview ? `| ${preview.slice(0, 80)}` : ''}`
    )
  }

  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (!buffer.length) {
    throw new Error('Google TTS devolvió un audio vacío.')
  }

  return buffer
}

function makeTempDir() {
  const base = path.join(os.tmpdir(), 'rubyjx-hablar-')
  return fs.mkdtempSync(base)
}

function removeTempDir(dir) {
  try {
    if (dir && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  } catch {}
}

function runFfmpeg(args = [], timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args, {
      windowsHide: true
    })

    let stderr = ''

    const timeout = setTimeout(() => {
      try {
        ffmpeg.kill('SIGKILL')
      } catch {}

      reject(new Error('FFmpeg tardó demasiado y fue cancelado.'))
    }, timeoutMs)

    ffmpeg.stderr.on('data', chunk => {
      stderr += chunk.toString()
    })

    ffmpeg.on('error', err => {
      clearTimeout(timeout)

      if (err?.code === 'ENOENT') {
        reject(
          new Error(
            'FFmpeg no está instalado o no está agregado al PATH. Ejecuta: ffmpeg -version'
          )
        )
        return
      }

      reject(err)
    })

    ffmpeg.on('close', code => {
      clearTimeout(timeout)

      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `FFmpeg falló convirtiendo el audio. Código: ${code}. ${stderr.slice(0, 300)}`
        )
      )
    })
  })
}

async function convertMp3ToOggOpus(mp3Buffer) {
  if (!Buffer.isBuffer(mp3Buffer) || !mp3Buffer.length) {
    throw new Error('Buffer MP3 inválido.')
  }

  const tempDir = makeTempDir()
  const inputFile = path.join(tempDir, 'input.mp3')
  const outputFile = path.join(tempDir, 'output.ogg')

  try {
    fs.writeFileSync(inputFile, mp3Buffer)

    await runFfmpeg([
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',

      '-i',
      inputFile,

      '-vn',

      '-acodec',
      'libopus',

      '-b:a',
      '48k',

      '-vbr',
      'on',

      '-compression_level',
      '10',

      '-application',
      'voip',

      '-ac',
      '1',

      '-ar',
      '48000',

      outputFile
    ])

    if (!fs.existsSync(outputFile)) {
      throw new Error('FFmpeg no generó el archivo OGG.')
    }

    const oggBuffer = fs.readFileSync(outputFile)

    if (!oggBuffer.length) {
      throw new Error('El archivo OGG generado está vacío.')
    }

    return oggBuffer
  } finally {
    removeTempDir(tempDir)
  }
}

async function makeVoiceNoteBuffer(text, lang) {
  const mp3 = await getGoogleVoiceMp3Buffer(text, lang)
  const ogg = await convertMp3ToOggOpus(mp3)
  return ogg
}

function buildHelp(usedPrefix = '.') {
  return [
    '╭─「 ʀᴜʙʏᴊx ᴠᴏᴢ 」',
    `│ Uso: ${usedPrefix}${COMMAND_NAME} <texto>`,
    `│ Ejemplo: ${usedPrefix}${COMMAND_NAME} hola mi gente`,
    `│ Ejemplo: ${usedPrefix}${COMMAND_NAME} en hello everyone`,
    `│ Ejemplo: ${usedPrefix}${COMMAND_NAME} ja こんにちは`,
    `│ Ejemplo: ${usedPrefix}${COMMAND_NAME} --lang es texto`,
    '│',
    '│ Idiomas útiles:',
    '│ es = español',
    '│ en = inglés',
    '│ pt = portugués',
    '│ ja = japonés',
    '│ ko = coreano',
    '│ fr = francés',
    '│ de = alemán',
    '│ it = italiano',
    '╰──────────────'
  ].join('\n')
}

function buildTooLongMessage(usedPrefix = '.', currentLength = 0) {
  return [
    '╭─「 ᴛᴇxᴛᴏ ᴅᴇᴍᴀsɪᴀᴅᴏ ʟᴀʀɢᴏ 」',
    `│ Tu texto tiene: ${currentLength} caracteres`,
    `│ Máximo permitido: ${MAX_TEXT_TOTAL} caracteres`,
    '│',
    '│ Solución:',
    '│ Usa textos más cortos o divídelo.',
    `│ Ejemplo: ${usedPrefix}${COMMAND_NAME} hola mi gente`,
    '╰──────────────'
  ].join('\n')
}

async function sendVoiceNote(client, m, oggBuffer, options = {}) {
  const quoted = options.quoted ?? m

  return client.sendMessage(
    m.chat,
    {
      audio: oggBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true,
      fileName: 'rubyjx-voz.ogg'
    },
    {
      quoted
    }
  )
}

export default {
  command: ['hablar', 'voz', 'tts', 'decir'],
  category: 'tools',
  description: 'Convierte texto a nota de voz usando Google Translate.',
  usage: '.hablar <texto>',
  group: false,
  private: false,

  run: async (client, m, args, usedPrefix = '.') => {
    try {
      const { lang, text } = parseInput(args)

      if (!text) {
        return m.reply(buildHelp(usedPrefix))
      }

      if (text.length > MAX_TEXT_TOTAL) {
        return m.reply(buildTooLongMessage(usedPrefix, text.length))
      }

      const chunks = splitTextIntoChunks(text, MAX_CHUNK_LENGTH)

      if (!chunks.length) {
        return m.reply(buildHelp(usedPrefix))
      }

      const languageName = SUPPORTED_LANGUAGES[lang] || lang

      if (chunks.length === 1) {
        const oggVoice = await makeVoiceNoteBuffer(chunks[0], lang)

        await sendVoiceNote(client, m, oggVoice, {
          quoted: m
        })

        return
      }

      await m.reply(
        [
          '╭─「 ʀᴜʙʏᴊx ᴠᴏᴢ 」',
          '│ Texto largo detectado.',
          `│ Idioma: ${languageName} (${lang})`,
          `│ Audios: ${chunks.length}`,
          '│ Enviando como notas de voz...',
          '╰──────────────'
        ].join('\n')
      )

      for (let i = 0; i < chunks.length; i++) {
        const part = chunks[i]
        const oggVoice = await makeVoiceNoteBuffer(part, lang)

        await sendVoiceNote(client, m, oggVoice, {
          quoted: i === 0 ? m : undefined
        })

        if (i < chunks.length - 1) {
          await sleep(DELAY_BETWEEN_AUDIOS_MS)
        }
      }
    } catch (error) {
      console.error(`[${COMMAND_NAME}] Error:`, error)

      return m.reply(
        [
          '╭─「 ᴇʀʀᴏʀ ᴅᴇ ᴠᴏᴢ 」',
          '│ No pude generar la nota de voz.',
          '│',
          `│ Motivo: ${error?.message || 'Error desconocido'}`,
          '│',
          '│ Revisa que FFmpeg esté instalado:',
          '│ ffmpeg -version',
          '╰──────────────'
        ].join('\n')
      )
    }
  }
}