import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const TMP_DIR = './tmp/mp3_downloads'
const MAX_MB = 25

const SUPPORTED_EXTENSIONS = new Set([
  'mp3',
  'mpeg',
  'mpga',
  'wav',
  'wave',
  'ogg',
  'oga',
  'oogg',
  'opus',
  'webm',
  'm4a',
  'aac',
  'flac',
  'amr',
  '3gp',
  '3gpp',
  'mp4',
  'mkv',
  'mov',
  'wma',
  'caf',
  'aiff',
  'aif'
])

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

function isUrl(text = '') {
  return /^https?:\/\/\S+/i.test(String(text || '').trim())
}

function cleanName(text = 'audio') {
  return String(text || 'audio')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'audio'
}

function run(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      windowsHide: true,
      ...options
    })

    let stdout = ''
    let stderr = ''

    p.stdout?.on('data', d => {
      stdout += d.toString()
      if (stdout.length > 8000) stdout = stdout.slice(-8000)
    })

    p.stderr?.on('data', d => {
      stderr += d.toString()
      if (stderr.length > 8000) stderr = stderr.slice(-8000)
    })

    p.on('error', err => {
      reject(new Error(`${cmd} no inició: ${err.message}`))
    })

    p.on('close', code => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(stderr || `${cmd} falló con código ${code}`))
      }
    })
  })
}

async function setReact(client, m, text = '') {
  try {
    await client.sendMessage(m.chat, {
      react: {
        text,
        key: m.key
      }
    })
  } catch {}
}

function getFirstUrl(args = []) {
  return args.find(x => isUrl(x)) || ''
}

function normalizeExt(ext = '') {
  const e = String(ext || '')
    .toLowerCase()
    .replace(/^\./, '')
    .trim()

  if (!e) return 'bin'
  if (['wave', 'x-wav'].includes(e)) return 'wav'
  if (['oga', 'opus', 'oogg'].includes(e)) return 'ogg'
  if (['mpeg', 'mpga'].includes(e)) return 'mp3'
  if (['3gpp'].includes(e)) return '3gp'
  if (['aiff', 'aif'].includes(e)) return 'aiff'

  return e
}

function getExtFromFileName(fileName = '') {
  const ext = path.extname(String(fileName || '')).replace('.', '')
  return normalizeExt(ext)
}

function getExtFromMime(mime = '') {
  const m = String(mime || '').toLowerCase()

  if (m.includes('mpeg') || m.includes('mp3')) return 'mp3'
  if (m.includes('wav') || m.includes('wave')) return 'wav'
  if (m.includes('ogg') || m.includes('opus')) return 'ogg'
  if (m.includes('webm')) return 'webm'
  if (m.includes('m4a') || m.includes('mp4')) return 'm4a'
  if (m.includes('aac')) return 'aac'
  if (m.includes('flac')) return 'flac'
  if (m.includes('amr')) return 'amr'
  if (m.includes('3gpp') || m.includes('3gp')) return '3gp'
  if (m.includes('wma')) return 'wma'
  if (m.includes('caf')) return 'caf'
  if (m.includes('aiff') || m.includes('aif')) return 'aiff'

  return 'bin'
}

function isSupportedMime(mime = '') {
  const m = String(mime || '').toLowerCase()

  return /audio|video|ogg|opus|mpeg|mp3|mp4|webm|wav|wave|m4a|aac|flac|amr|3gpp|wma|caf|aiff|aif/.test(m)
}

function isSupportedExtension(ext = '') {
  return SUPPORTED_EXTENSIONS.has(String(ext || '').toLowerCase())
}

function getQuotedFileInfo(q) {
  const msg = q?.msg || q || {}
  const mime = String(msg.mimetype || q?.mime || '').toLowerCase()
  const fileName = String(msg.fileName || msg.filename || q?.fileName || q?.filename || '')

  const extFromName = getExtFromFileName(fileName)
  const extFromMime = getExtFromMime(mime)
  const ext = extFromName !== 'bin' ? extFromName : extFromMime

  return {
    mime,
    fileName,
    ext: normalizeExt(ext)
  }
}

async function getQuotedMedia(m) {
  const q = m.quoted
  if (!q) return null

  const info = getQuotedFileInfo(q)
  const supportedByMime = isSupportedMime(info.mime)
  const supportedByExt = isSupportedExtension(info.ext)

  if (!supportedByMime && !supportedByExt) {
    return null
  }

  const buffer = await q.download()

  if (!buffer?.length) {
    throw new Error('no pude descargar el archivo respondido')
  }

  return {
    buffer,
    ext: info.ext || 'bin',
    mime: info.mime,
    title: cleanName(info.fileName ? path.parse(info.fileName).name : 'audio')
  }
}

async function convertLocalToMp3(inputBuffer, ext = 'bin', title = 'audio') {
  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const inputPath = path.join(TMP_DIR, `input-${id}.${normalizeExt(ext)}`)
  const outputPath = path.join(TMP_DIR, `audio-${id}.mp3`)

  fs.writeFileSync(inputPath, inputBuffer)

  try {
    await run('ffmpeg', [
      '-y',
      '-i', inputPath,
      '-map', '0:a:0',
      '-vn',
      '-acodec', 'libmp3lame',
      '-b:a', '192k',
      '-ar', '44100',
      '-ac', '2',
      outputPath
    ])

    if (!fs.existsSync(outputPath)) {
      throw new Error('ffmpeg no generó el mp3')
    }

    return {
      buffer: fs.readFileSync(outputPath),
      title: cleanName(title || 'audio')
    }
  } finally {
    try { fs.unlinkSync(inputPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}
  }
}

async function downloadLinkToMp3(url) {
  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const outTemplate = path.join(TMP_DIR, `${id}.%(ext)s`)

  await run('yt-dlp', [
    '--no-playlist',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '--ffmpeg-location', 'ffmpeg',
    '-o', outTemplate,
    url
  ])

  const files = fs.readdirSync(TMP_DIR)
    .filter(file => file.startsWith(id) && file.toLowerCase().endsWith('.mp3'))
    .map(file => path.join(TMP_DIR, file))

  if (!files.length) {
    throw new Error('yt-dlp no generó el mp3')
  }

  const outputPath = files[0]
  const buffer = fs.readFileSync(outputPath)

  let title = 'audio'

  try {
    const info = await run('yt-dlp', [
      '--no-playlist',
      '--print', 'title',
      url
    ])

    title = cleanName(info.stdout.split('\n')[0] || 'audio')
  } catch {}

  try { fs.unlinkSync(outputPath) } catch {}

  return {
    buffer,
    title
  }
}

function usage(usedPrefix = '.') {
  return (
    `🎵 MP3 DOWNLOADER\n\n` +
    `Convierte enlaces, videos o archivos de audio a MP3 enviable por WhatsApp.\n\n` +
    `Formatos soportados por respuesta: wav, ogg, opus, m4a, aac, flac, webm, mp4, amr, 3gp, wma y más.\n\n` +
    `Ejemplos:\n` +
    `${usedPrefix}mp3 https://youtube.com/...\n` +
    `${usedPrefix}mp3 https://vm.tiktok.com/...\n` +
    `${usedPrefix}mp3 https://instagram.com/reel/...\n\n` +
    `También puedes responder a un audio, video o documento de audio con:\n` +
    `${usedPrefix}mp3`
  )
}

export default {
  command: [
    'mp3',
    'audiomp3',
    'audio',
    'youtubemp3',
    'tiktokmp3',
    'igmp3',
    'linkmp3'
  ],
  category: 'downloader',

  run: async (client, m, args = [], usedPrefix = '.') => {
    await setReact(client, m, '🕒')

    try {
      const url = getFirstUrl(args)
      let result

      if (url) {
        result = await downloadLinkToMp3(url)
      } else {
        const quoted = await getQuotedMedia(m)

        if (!quoted) {
          await setReact(client, m, '❌')
          return m.reply(usage(usedPrefix))
        }

        result = await convertLocalToMp3(quoted.buffer, quoted.ext, quoted.title)
      }

      if (!result?.buffer?.length) {
        throw new Error('el mp3 quedó vacío')
      }

      const sizeMB = result.buffer.length / 1024 / 1024

      if (sizeMB > MAX_MB) {
        throw new Error(`el audio pesa ${sizeMB.toFixed(2)} MB y supera el límite de ${MAX_MB} MB`)
      }

      const fileName = `${cleanName(result.title)}.mp3`

      await client.sendMessage(
        m.chat,
        {
          audio: result.buffer,
          mimetype: 'audio/mpeg',
          fileName,
          ptt: false
        },
        {
          quoted: m
        }
      )

      await setReact(client, m, '✅')
    } catch (error) {
      await setReact(client, m, '❌')
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}