import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const TMP_DIR = path.resolve('./tmp/mp3_downloads')
const MAX_MB = 25
const MAX_FETCH_MB = 80
const FETCH_TIMEOUT_MS = 90_000

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

const userProfile = process.env.USERPROFILE || process.env.HOME || ''

const TOOL_CANDIDATES = {
  ffmpeg: [
    process.env.FFMPEG_BIN,
    path.resolve('./ffmpeg.exe'),
    path.resolve('./bin/ffmpeg.exe'),
    path.resolve('./tools/ffmpeg.exe'),
    path.resolve('./tools/bin/ffmpeg.exe'),
    userProfile ? path.join(userProfile, 'scoop', 'shims', 'ffmpeg.exe') : '',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe',
    'ffmpeg'
  ],
  ffprobe: [
    process.env.FFPROBE_BIN,
    path.resolve('./ffprobe.exe'),
    path.resolve('./bin/ffprobe.exe'),
    path.resolve('./tools/ffprobe.exe'),
    path.resolve('./tools/bin/ffprobe.exe'),
    userProfile ? path.join(userProfile, 'scoop', 'shims', 'ffprobe.exe') : '',
    'C:\\ffmpeg\\bin\\ffprobe.exe',
    'C:\\ProgramData\\chocolatey\\bin\\ffprobe.exe',
    'ffprobe'
  ],
  ytdlp: [
    process.env.YTDLP_BIN,
    process.env.YT_DLP_BIN,
    path.resolve('./yt-dlp.exe'),
    path.resolve('./bin/yt-dlp.exe'),
    path.resolve('./tools/yt-dlp.exe'),
    userProfile ? path.join(userProfile, 'scoop', 'shims', 'yt-dlp.exe') : '',
    'C:\\ProgramData\\chocolatey\\bin\\yt-dlp.exe',
    'yt-dlp',
    { cmd: 'python', baseArgs: ['-m', 'yt_dlp'], label: 'python -m yt_dlp' },
    { cmd: 'py', baseArgs: ['-m', 'yt_dlp'], label: 'py -m yt_dlp' }
  ]
}

const toolCache = new Map()

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

function makeId() {
  return `${Date.now()}-${Math.floor(Math.random() * 99999)}`
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

  if (!m) return 'bin'
  if (m.includes('audio/mpeg') || m.includes('mp3') || m.includes('mpga')) return 'mp3'
  if (m.includes('audio/wav') || m.includes('audio/x-wav') || m.includes('wave')) return 'wav'
  if (m.includes('audio/ogg') || m.includes('audio/opus') || m.includes('opus')) return 'ogg'
  if (m.includes('audio/webm')) return 'webm'
  if (m.includes('audio/mp4') || m.includes('audio/x-m4a') || m.includes('m4a')) return 'm4a'
  if (m.includes('audio/aac')) return 'aac'
  if (m.includes('audio/flac')) return 'flac'
  if (m.includes('audio/amr')) return 'amr'
  if (m.includes('audio/3gpp') || m.includes('video/3gpp') || m.includes('3gp')) return '3gp'
  if (m.includes('audio/x-ms-wma') || m.includes('audio/wma') || m.includes('wma')) return 'wma'
  if (m.includes('audio/x-caf') || m.includes('audio/caf')) return 'caf'
  if (m.includes('audio/aiff') || m.includes('audio/x-aiff') || m.includes('aiff')) return 'aiff'
  if (m.includes('video/mp4')) return 'mp4'
  if (m.includes('video/webm')) return 'webm'
  if (m.includes('video/quicktime')) return 'mov'
  if (m.includes('matroska') || m.includes('video/x-matroska')) return 'mkv'

  return 'bin'
}

function isSupportedMime(mime = '') {
  const m = String(mime || '').toLowerCase()

  return /audio|video|ogg|opus|mpeg|mp3|mp4|webm|wav|wave|m4a|aac|flac|amr|3gpp|wma|caf|aiff|quicktime|matroska/.test(m)
}

function isSupportedExtension(ext = '') {
  return SUPPORTED_EXTENSIONS.has(String(ext || '').toLowerCase())
}

function isMp3Like(ext = '', mime = '') {
  const cleanExt = normalizeExt(ext)
  const cleanMime = String(mime || '').toLowerCase()

  return cleanExt === 'mp3' || cleanMime.includes('audio/mpeg') || cleanMime.includes('audio/mp3')
}

function getFirstUrl(args = []) {
  return args.find((x) => isUrl(x)) || ''
}

function toCandidateObject(candidate) {
  if (!candidate) return null

  if (typeof candidate === 'string') {
    return {
      cmd: candidate,
      baseArgs: [],
      label: candidate
    }
  }

  if (typeof candidate === 'object' && candidate.cmd) {
    return {
      cmd: candidate.cmd,
      baseArgs: Array.isArray(candidate.baseArgs) ? candidate.baseArgs : [],
      label: candidate.label || [candidate.cmd, ...(candidate.baseArgs || [])].join(' ')
    }
  }

  return null
}

function isFileLikeCommand(command = '') {
  return /[\\/]/.test(command) || /\.exe$/i.test(command)
}

function candidateExists(candidate) {
  if (!candidate) return false
  if (!isFileLikeCommand(candidate.cmd)) return true
  return fs.existsSync(candidate.cmd)
}

function trimOutput(text = '', maxLength = 12000) {
  const value = String(text || '')
  return value.length > maxLength ? value.slice(-maxLength) : value
}

function runProcess(candidate, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const tool = toCandidateObject(candidate)

    if (!tool) {
      reject(new Error('herramienta invalida'))
      return
    }

    if (!candidateExists(tool)) {
      reject(new Error(`${tool.label} no existe en esa ruta`))
      return
    }

    const p = spawn(tool.cmd, [...tool.baseArgs, ...args], {
      windowsHide: true,
      ...options
    })

    let stdout = ''
    let stderr = ''

    p.stdout?.on('data', (d) => {
      stdout = trimOutput(stdout + d.toString())
    })

    p.stderr?.on('data', (d) => {
      stderr = trimOutput(stderr + d.toString())
    })

    p.on('error', (err) => {
      reject(new Error(`${tool.label} no inicio: ${err.message}`))
    })

    p.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code, tool })
      } else {
        reject(new Error(trimOutput(stderr || stdout || `${tool.label} fallo con codigo ${code}`)))
      }
    })
  })
}

async function resolveTool(toolName = '') {
  if (toolCache.has(toolName)) return toolCache.get(toolName)

  const rawCandidates = TOOL_CANDIDATES[toolName] || []
  const candidates = rawCandidates
    .map(toCandidateObject)
    .filter(Boolean)

  const tried = []

  for (const candidate of candidates) {
    if (!candidateExists(candidate)) continue

    try {
      const probeArgs = toolName === 'ytdlp' ? ['--version'] : ['-version']
      await runProcess(candidate, probeArgs)
      toolCache.set(toolName, candidate)
      return candidate
    } catch (err) {
      tried.push(`${candidate.label}: ${err.message}`)
    }
  }

  const friendly = {
    ffmpeg: 'No encontre ffmpeg. Instala ffmpeg o define FFMPEG_BIN con la ruta al ejecutable.',
    ffprobe: 'No encontre ffprobe. Instala ffmpeg completo o define FFPROBE_BIN.',
    ytdlp: 'No encontre yt-dlp. Instala yt-dlp o define YTDLP_BIN con la ruta al ejecutable.'
  }

  throw new Error(
    `${friendly[toolName] || `No encontre ${toolName}.`}${
      tried.length ? `\nDetalle: ${tried[0]}` : ''
    }`
  )
}

async function runTool(toolName = '', args = [], options = {}) {
  const candidate = await resolveTool(toolName)
  return runProcess(candidate, args, options)
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
    throw new Error('No pude descargar el archivo respondido.')
  }

  const fallbackTitle =
    info.fileName
      ? path.parse(info.fileName).name
      : info.mime.startsWith('video/')
        ? 'video'
        : 'audio'

  return {
    buffer,
    ext: info.ext || 'bin',
    mime: info.mime,
    title: cleanName(fallbackTitle)
  }
}

async function probeHasAudio(inputPath = '') {
  try {
    const result = await runTool('ffprobe', [
      '-v', 'error',
      '-select_streams', 'a:0',
      '-show_entries', 'stream=codec_type',
      '-of', 'default=nokey=1:noprint_wrappers=1',
      inputPath
    ])

    return /audio/i.test(result.stdout)
  } catch {
    return null
  }
}

function getFriendlyFfmpegError(message = '') {
  const text = String(message || '').toLowerCase()

  if (text.includes('output file #0 does not contain any stream') || text.includes('stream map') || text.includes('matches no streams')) {
    return 'Ese video no trae una pista de audio utilizable.'
  }

  if (text.includes('invalid data found')) {
    return 'El archivo respondido parece estar dañado o en un formato que ffmpeg no pudo leer.'
  }

  if (text.includes('permission denied')) {
    return 'ffmpeg no pudo acceder al archivo temporal. Revisa permisos o antivirus.'
  }

  return ''
}

async function convertLocalToMp3(inputBuffer, ext = 'bin', title = 'audio', mime = '') {
  if (isMp3Like(ext, mime)) {
    return {
      buffer: inputBuffer,
      title: cleanName(title || 'audio')
    }
  }

  await resolveTool('ffmpeg')

  const id = makeId()
  const inputPath = path.join(TMP_DIR, `input-${id}.${normalizeExt(ext)}`)
  const outputPath = path.join(TMP_DIR, `audio-${id}.mp3`)

  fs.writeFileSync(inputPath, inputBuffer)

  try {
    const hasAudio = await probeHasAudio(inputPath)

    if (hasAudio === false) {
      throw new Error('Ese video o archivo no tiene audio para convertir.')
    }

    try {
      await runTool('ffmpeg', [
        '-y',
        '-hide_banner',
        '-loglevel', 'error',
        '-i', inputPath,
        '-map', '0:a:0?',
        '-vn',
        '-acodec', 'libmp3lame',
        '-b:a', '192k',
        '-ar', '44100',
        '-ac', '2',
        outputPath
      ])
    } catch (err) {
      const friendly = getFriendlyFfmpegError(err.message)
      throw new Error(friendly || err.message)
    }

    if (!fs.existsSync(outputPath)) {
      throw new Error('ffmpeg no genero el mp3.')
    }

    const buffer = fs.readFileSync(outputPath)

    if (!buffer.length) {
      throw new Error('El mp3 generado quedo vacio.')
    }

    return {
      buffer,
      title: cleanName(title || 'audio')
    }
  } finally {
    try { fs.unlinkSync(inputPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}
  }
}

function getUrlFileName(url = '') {
  try {
    const pathname = new URL(url).pathname
    const base = path.basename(pathname)
    const name = path.parse(base).name
    return cleanName(name || 'audio')
  } catch {
    return 'audio'
  }
}

function getUrlExtension(url = '') {
  try {
    const pathname = new URL(url).pathname
    return getExtFromFileName(pathname)
  } catch {
    return 'bin'
  }
}

function isDirectMediaUrl(url = '') {
  return isSupportedExtension(getUrlExtension(url))
}

async function downloadDirectMedia(url = '') {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0',
        accept: '*/*'
      }
    })

    if (!res.ok) {
      throw new Error(`La descarga directa respondio con estado ${res.status}.`)
    }

    const contentLength = Number(res.headers.get('content-length') || 0)
    if (contentLength > MAX_FETCH_MB * 1024 * 1024) {
      throw new Error(`El archivo remoto pesa mas de ${MAX_FETCH_MB} MB y no lo descargare directo.`)
    }

    const mime = String(res.headers.get('content-type') || '').toLowerCase()
    const extFromMime = getExtFromMime(mime)
    const extFromUrl = getUrlExtension(url)
    const ext = extFromMime !== 'bin' ? extFromMime : extFromUrl

    if (!isSupportedMime(mime) && !isSupportedExtension(ext)) {
      throw new Error('Ese enlace no parece apuntar a un audio o video directo compatible.')
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!buffer.length) {
      throw new Error('La descarga directa llego vacia.')
    }

    return {
      buffer,
      ext: ext || 'bin',
      mime,
      title: getUrlFileName(url)
    }
  } finally {
    clearTimeout(timer)
  }
}

function getFfmpegLocationArg(ffmpegCandidate) {
  if (!ffmpegCandidate?.cmd) return null
  if (isFileLikeCommand(ffmpegCandidate.cmd) && fs.existsSync(ffmpegCandidate.cmd)) {
    return ffmpegCandidate.cmd
  }
  return ffmpegCandidate.cmd
}

async function downloadLinkToMp3(url = '') {
  const ffmpegCandidate = await resolveTool('ffmpeg')
  await resolveTool('ytdlp')

  const id = makeId()
  const outTemplate = path.join(TMP_DIR, `${id}.%(ext)s`)
  const ffmpegLocation = getFfmpegLocationArg(ffmpegCandidate)

  const args = [
    '--no-playlist',
    '--no-warnings',
    '--windows-filenames',
    '--restrict-filenames',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '-o', outTemplate
  ]

  if (ffmpegLocation) {
    args.push('--ffmpeg-location', ffmpegLocation)
  }

  args.push(url)

  await runTool('ytdlp', args)

  const files = fs.readdirSync(TMP_DIR)
    .filter((file) => file.startsWith(id) && file.toLowerCase().endsWith('.mp3'))
    .map((file) => path.join(TMP_DIR, file))

  if (!files.length) {
    throw new Error('yt-dlp no genero el mp3.')
  }

  const outputPath = files[0]
  const buffer = fs.readFileSync(outputPath)

  let title = getUrlFileName(url)

  try {
    const info = await runTool('ytdlp', [
      '--no-playlist',
      '--print', 'title',
      url
    ])

    title = cleanName(info.stdout.split('\n')[0] || title)
  } catch {}

  try { fs.unlinkSync(outputPath) } catch {}

  return {
    buffer,
    title
  }
}

async function getLinkAsMp3(url = '') {
  if (isDirectMediaUrl(url)) {
    const direct = await downloadDirectMedia(url)
    return convertLocalToMp3(direct.buffer, direct.ext, direct.title, direct.mime)
  }

  return downloadLinkToMp3(url)
}

function usage(usedPrefix = '.') {
  return (
    `MP3 DOWNLOADER\n\n` +
    `Convierte enlaces, videos o audios a MP3 para WhatsApp.\n\n` +
    `Puedes usar:\n` +
    `${usedPrefix}mp3 https://youtube.com/...\n` +
    `${usedPrefix}mp3 https://vm.tiktok.com/...\n` +
    `${usedPrefix}mp3 https://instagram.com/reel/...\n\n` +
    `O responder a un audio, video o documento compatible con:\n` +
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
        result = await getLinkAsMp3(url)
      } else {
        const quoted = await getQuotedMedia(m)

        if (!quoted) {
          await setReact(client, m, '❌')
          return m.reply(usage(usedPrefix))
        }

        result = await convertLocalToMp3(quoted.buffer, quoted.ext, quoted.title, quoted.mime)
      }

      if (!result?.buffer?.length) {
        throw new Error('El MP3 quedo vacio.')
      }

      const sizeMB = result.buffer.length / 1024 / 1024

      if (sizeMB > MAX_MB) {
        throw new Error(`El audio pesa ${sizeMB.toFixed(2)} MB y supera el limite de ${MAX_MB} MB.`)
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
