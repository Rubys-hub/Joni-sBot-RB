import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const TMP_DIR = path.resolve('./tmp/addaudio')
const PENDING_TTL_MS = 5 * 60 * 1000
const MAX_INPUT_MB = 80
const MAX_OUTPUT_MB = 70
const MAX_VOLUME = 500
const DEFAULT_VOLUME = 100
const MAX_REPEATS = 3
const MAX_IMAGE_SECONDS = 180
const MAX_VIDEO_SECONDS = 300

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
  ]
}

const toolCache = new Map()
const pendingJobs = globalThis.__rubyjxAddAudioPending || new Map()
globalThis.__rubyjxAddAudioPending = pendingJobs

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

function makeId() {
  return `${Date.now()}-${Math.floor(Math.random() * 999999)}`
}

function clamp(value, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return min
  return Math.min(max, Math.max(min, number))
}

function cleanText(text = '') {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeExt(ext = '') {
  const clean = String(ext || '').toLowerCase().replace(/^\./, '').trim()
  if (!clean) return 'bin'
  if (clean === 'jpeg') return 'jpg'
  if (clean === 'quicktime') return 'mov'
  if (clean === 'mpeg') return 'mp3'
  if (clean === 'x-m4a') return 'm4a'
  if (clean === 'x-wav' || clean === 'wave') return 'wav'
  return clean.replace(/[^a-z0-9]/g, '') || 'bin'
}

function extFromMime(mime = '', kind = 'bin') {
  const value = String(mime || '').toLowerCase()

  if (value.includes('jpeg') || value.includes('jpg')) return 'jpg'
  if (value.includes('png')) return 'png'
  if (value.includes('webp')) return 'webp'
  if (value.includes('gif')) return 'gif'
  if (value.includes('quicktime')) return 'mov'
  if (value.includes('matroska')) return 'mkv'
  if (value.includes('webm')) return 'webm'
  if (value.includes('mp4')) return kind === 'audio' ? 'm4a' : 'mp4'
  if (value.includes('mpeg') || value.includes('mp3')) return 'mp3'
  if (value.includes('ogg') || value.includes('opus')) return 'ogg'
  if (value.includes('wav') || value.includes('wave')) return 'wav'
  if (value.includes('aac')) return 'aac'
  if (value.includes('flac')) return 'flac'
  if (value.includes('amr')) return 'amr'
  if (value.includes('3gpp') || value.includes('3gp')) return '3gp'

  if (kind === 'image') return 'jpg'
  if (kind === 'video') return 'mp4'
  if (kind === 'audio') return 'ogg'
  return 'bin'
}

function extFromFileName(fileName = '') {
  return normalizeExt(path.extname(String(fileName || '')).replace('.', ''))
}

function toCandidateObject(candidate) {
  if (!candidate) return null
  if (typeof candidate === 'string') {
    return { cmd: candidate, baseArgs: [], label: candidate }
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

    const timeoutMs = Number(options.timeoutMs || 180000)
    const child = spawn(tool.cmd, [...tool.baseArgs, ...args], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: options.cwd || process.cwd()
    })

    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => {
      try {
        child.kill('SIGKILL')
      } catch {}
      reject(new Error('ffmpeg tardo demasiado y fue detenido.'))
    }, timeoutMs)

    child.stdout?.on('data', (data) => {
      stdout = trimOutput(stdout + data.toString())
    })

    child.stderr?.on('data', (data) => {
      stderr = trimOutput(stderr + data.toString())
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      reject(new Error(`${tool.label} no inicio: ${err.message}`))
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) {
        resolve({ stdout, stderr, code, tool })
        return
      }
      reject(new Error(trimOutput(stderr || stdout || `${tool.label} fallo con codigo ${code}`)))
    })
  })
}

async function resolveTool(toolName = '') {
  if (toolCache.has(toolName)) return toolCache.get(toolName)

  const candidates = (TOOL_CANDIDATES[toolName] || [])
    .map(toCandidateObject)
    .filter(Boolean)

  const tried = []

  for (const candidate of candidates) {
    if (!candidateExists(candidate)) continue
    try {
      await runProcess(candidate, ['-version'], { timeoutMs: 15000 })
      toolCache.set(toolName, candidate)
      return candidate
    } catch (err) {
      tried.push(`${candidate.label}: ${err.message}`)
    }
  }

  throw new Error(
    `No encontre ffmpeg. Instala ffmpeg o define FFMPEG_BIN con la ruta al ejecutable.${
      tried.length ? `\nDetalle: ${tried[0]}` : ''
    }`
  )
}

async function runTool(toolName = '', args = [], options = {}) {
  const candidate = await resolveTool(toolName)
  return runProcess(candidate, args, options)
}

function getMessageNode(source) {
  return source?.msg || source?.message || source || {}
}

function getMime(source) {
  const node = getMessageNode(source)
  const message = source?.message || {}

  return String(
    source?.mimetype ||
    source?.mime ||
    node?.mimetype ||
    message?.imageMessage?.mimetype ||
    message?.videoMessage?.mimetype ||
    message?.audioMessage?.mimetype ||
    ''
  ).toLowerCase()
}

function getFileName(source) {
  const node = getMessageNode(source)
  return String(source?.fileName || source?.filename || node?.fileName || node?.filename || '')
}

function getMediaKind(source) {
  if (!source) return null

  const node = getMessageNode(source)
  const message = source?.message || {}
  const mtype = String(source?.mtype || source?.type || source?.mediaType || '').toLowerCase()
  const mime = getMime(source)

  if (message.imageMessage || node.imageMessage || mtype === 'imagemessage' || mtype === 'image' || mime.startsWith('image/')) {
    return 'image'
  }
  if (message.videoMessage || node.videoMessage || mtype === 'videomessage' || mtype === 'video' || mime.startsWith('video/')) {
    return 'video'
  }
  if (message.audioMessage || node.audioMessage || mtype === 'audiomessage' || mtype === 'audio' || mime.startsWith('audio/')) {
    return 'audio'
  }

  return null
}

function describeSource(source) {
  const kind = getMediaKind(source)
  if (!kind) return null

  const mime = getMime(source)
  const fileName = getFileName(source)
  const extByName = extFromFileName(fileName)
  const ext = extByName !== 'bin' ? extByName : extFromMime(mime, kind)

  return {
    source,
    kind,
    mime,
    fileName,
    ext
  }
}

function getSources(m) {
  return [m, m?.quoted].filter(Boolean)
}

function findVisualSource(m) {
  for (const source of getSources(m)) {
    const info = describeSource(source)
    if (info && (info.kind === 'image' || info.kind === 'video')) return info
  }
  return null
}

function findAudioSource(m) {
  for (const source of getSources(m)) {
    const info = describeSource(source)
    if (info && info.kind === 'audio') return info
  }
  return null
}

async function downloadMedia(info, label = 'archivo') {
  if (!info?.source?.download) {
    throw new Error(`No pude descargar el ${label}.`)
  }

  const buffer = await info.source.download()
  const media = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer || [])

  if (!media.length) {
    throw new Error(`El ${label} llego vacio.`)
  }

  const mb = media.length / 1024 / 1024
  if (mb > MAX_INPUT_MB) {
    throw new Error(`El ${label} pesa ${mb.toFixed(1)} MB. Maximo permitido: ${MAX_INPUT_MB} MB.`)
  }

  return {
    ...info,
    buffer: media
  }
}

function parseOptionToken(token = '') {
  const clean = String(token || '').trim().replace(/^--?/, '')
  const match = clean.match(/^([^:=]+)[:=](.+)$/)
  if (!match) return null
  return {
    key: match[1].toLowerCase(),
    value: match[2]
  }
}

function normalizeFit(value = '') {
  const clean = String(value || '').toLowerCase().trim()
  if (['contain', 'encajar', 'pad', 'completa', 'completo'].includes(clean)) return 'contain'
  if (['cover', 'rellenar', 'recortar', 'crop', 'lleno'].includes(clean)) return 'cover'
  return null
}

function normalizeQuality(value = '') {
  const clean = String(value || '').toLowerCase().trim()
  if (['baja', 'low', 'ligera', 'rapida'].includes(clean)) return 'low'
  if (['alta', 'high', 'hd', 'buena'].includes(clean)) return 'high'
  if (['max', 'ultra', 'premium'].includes(clean)) return 'max'
  if (['media', 'mid', 'normal'].includes(clean)) return 'mid'
  return null
}

function setParsedOption(result, key = '', value = '') {
  const cleanKey = String(key || '').toLowerCase().trim()
  const cleanValue = String(value || '').trim()
  const optionKey = {
    v: 'volume',
    vol: 'volume',
    volume: 'volume',
    volumen: 'volume',
    ganancia: 'volume',
    r: 'repeats',
    rep: 'repeats',
    reps: 'repeats',
    repeat: 'repeats',
    repeats: 'repeats',
    repetir: 'repeats',
    loop: 'repeats',
    loops: 'repeats',
    fit: 'fit',
    ajuste: 'fit',
    modo: 'fit',
    q: 'quality',
    quality: 'quality',
    calidad: 'quality',
    dur: 'duration',
    duration: 'duration',
    duracion: 'duration',
    segundos: 'duration',
    seg: 'duration',
    s: 'duration'
  }[cleanKey]

  if (!optionKey || !cleanValue) return false

  if (optionKey === 'volume') {
    result.options.volume = Math.round(clamp(Number(cleanValue), 0, MAX_VOLUME))
    result.provided.volume = true
    return true
  }

  if (optionKey === 'repeats') {
    result.options.repeats = Math.round(clamp(Number(cleanValue), 1, MAX_REPEATS))
    result.provided.repeats = true
    return true
  }

  if (optionKey === 'duration') {
    result.options.duration = Math.round(clamp(Number(cleanValue), 1, MAX_VIDEO_SECONDS))
    result.provided.duration = true
    return true
  }

  if (optionKey === 'fit') {
    const fit = normalizeFit(cleanValue)
    if (!fit) return false
    result.options.fit = fit
    result.provided.fit = true
    return true
  }

  if (optionKey === 'quality') {
    const quality = normalizeQuality(cleanValue)
    if (!quality) return false
    result.options.quality = quality
    result.provided.quality = true
    return true
  }

  return false
}

function parseOptions(args = []) {
  const result = {
    options: {
      volume: DEFAULT_VOLUME,
      repeats: 1,
      fit: 'contain',
      quality: 'mid',
      duration: null
    },
    provided: {}
  }

  const raw = Array.isArray(args) ? args.join(' ') : String(args || '')
  const tokens = cleanText(raw).split(' ').filter(Boolean)

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const pair = parseOptionToken(token)

    if (pair) {
      setParsedOption(result, pair.key, pair.value)
      continue
    }

    const key = token.toLowerCase().replace(/^--?/, '')
    const next = tokens[i + 1]
    if (next && !parseOptionToken(next) && setParsedOption(result, key, next)) {
      i++
      continue
    }

    if (/^\d+(\.\d+)?$/.test(token)) {
      const number = Number(token)
      if (!result.provided.volume && number > MAX_REPEATS) {
        result.options.volume = Math.round(clamp(number, 0, MAX_VOLUME))
        result.provided.volume = true
      } else if (!result.provided.repeats && number <= MAX_REPEATS) {
        result.options.repeats = Math.round(clamp(number, 1, MAX_REPEATS))
        result.provided.repeats = true
      }
    }
  }

  return result
}

function mergeOptions(savedOptions, parsedNow) {
  const merged = {
    volume: DEFAULT_VOLUME,
    repeats: 1,
    fit: 'contain',
    quality: 'mid',
    duration: null,
    ...(savedOptions || {})
  }

  for (const key of Object.keys(parsedNow.provided || {})) {
    merged[key] = parsedNow.options[key]
  }

  return merged
}

function getCrf(quality = 'mid') {
  if (quality === 'low') return '32'
  if (quality === 'high') return '23'
  if (quality === 'max') return '20'
  return '27'
}

function buildAudioFilter(volume = DEFAULT_VOLUME) {
  const factor = clamp(volume, 0, MAX_VOLUME) / 100
  return `volume=${factor.toFixed(2)},alimiter=limit=0.98`
}

function buildImageFilter(fit = 'contain') {
  if (fit === 'contain') {
    return 'scale=1280:1280:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1,format=yuv420p'
  }

  return 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,format=yuv420p'
}

function buildVideoFilter() {
  return 'scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1,format=yuv420p'
}

function buildFfmpegArgs(visualPath, audioPath, outputPath, visualKind, options) {
  const loopArgs = options.repeats > 1 ? ['-stream_loop', String(options.repeats - 1)] : []
  const crf = getCrf(options.quality)
  const durationLimit = options.duration || (visualKind === 'image' ? MAX_IMAGE_SECONDS : MAX_VIDEO_SECONDS)
  const commonOutput = [
    '-map', '0:v:0',
    '-map', '1:a:0',
    '-t', String(durationLimit),
    '-af', buildAudioFilter(options.volume),
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', crf,
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '44100',
    '-ac', '2',
    '-shortest',
    '-movflags', '+faststart',
    outputPath
  ]

  if (visualKind === 'image') {
    return [
      '-y',
      '-hide_banner',
      '-loglevel', 'error',
      '-loop', '1',
      '-framerate', '30',
      '-i', visualPath,
      ...loopArgs,
      '-i', audioPath,
      '-vf', buildImageFilter(options.fit),
      '-r', '30',
      '-tune', 'stillimage',
      ...commonOutput
    ]
  }

  return [
    '-y',
    '-hide_banner',
    '-loglevel', 'error',
    '-i', visualPath,
    ...loopArgs,
    '-i', audioPath,
    '-vf', buildVideoFilter(),
    ...commonOutput
  ]
}

function getFriendlyFfmpegError(message = '') {
  const text = String(message || '').toLowerCase()

  if (text.includes('stream map') || text.includes('matches no streams') || text.includes('does not contain any stream')) {
    return 'No pude encontrar video en la base o audio en la pista nueva. Revisa que respondas a una foto/video y luego a un audio real.'
  }

  if (text.includes('invalid data found')) {
    return 'Uno de los archivos parece danado o ffmpeg no pudo leer ese formato.'
  }

  if (text.includes('permission denied')) {
    return 'ffmpeg no pudo usar los archivos temporales. Revisa permisos o antivirus.'
  }

  if (text.includes('no encontre ffmpeg')) {
    return message
  }

  return ''
}

async function mixMediaWithAudio(visual, audio, options) {
  await resolveTool('ffmpeg')

  const id = makeId()
  const visualPath = path.join(TMP_DIR, `visual-${id}.${normalizeExt(visual.ext)}`)
  const audioPath = path.join(TMP_DIR, `audio-${id}.${normalizeExt(audio.ext)}`)
  const outputPath = path.join(TMP_DIR, `addaudio-${id}.mp4`)

  fs.writeFileSync(visualPath, visual.buffer)
  fs.writeFileSync(audioPath, audio.buffer)

  try {
    const args = buildFfmpegArgs(visualPath, audioPath, outputPath, visual.kind, options)
    await runTool('ffmpeg', args, { timeoutMs: 240000 })

    if (!fs.existsSync(outputPath)) {
      throw new Error('ffmpeg no genero el video final.')
    }

    const output = fs.readFileSync(outputPath)
    if (!output.length) {
      throw new Error('El video final quedo vacio.')
    }

    const outputMb = output.length / 1024 / 1024
    if (outputMb > MAX_OUTPUT_MB) {
      throw new Error(`El video final pesa ${outputMb.toFixed(1)} MB. Baja la duracion, la calidad o las repeticiones.`)
    }

    return output
  } catch (err) {
    const friendly = getFriendlyFfmpegError(err.message)
    throw new Error(friendly || err.message)
  } finally {
    try { fs.unlinkSync(visualPath) } catch {}
    try { fs.unlinkSync(audioPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}
  }
}

function getSenderId(client, m) {
  const raw = m?.sender || m?.participant || m?.key?.participant || m?.key?.remoteJid || ''
  return client?.decodeJid ? client.decodeJid(raw) : raw
}

function pendingKey(client, m) {
  return `${m.chat}:${getSenderId(client, m)}`
}

function cleanupPending() {
  const now = Date.now()
  for (const [key, value] of pendingJobs.entries()) {
    if (!value?.expiresAt || value.expiresAt <= now) {
      pendingJobs.delete(key)
    }
  }
}

function savePending(key, visual, options) {
  pendingJobs.set(key, {
    visual,
    options,
    createdAt: Date.now(),
    expiresAt: Date.now() + PENDING_TTL_MS
  })
}

function getPending(key) {
  const pending = pendingJobs.get(key)
  if (!pending) return null
  if (pending.expiresAt <= Date.now()) {
    pendingJobs.delete(key)
    return null
  }
  return pending
}

function usage(prefix = '.', command = 'addaudio') {
  const cmd = `${prefix}${command}`
  return [
    '*RubyJX AddAudio*',
    '',
    `Uso rapido: ${cmd} vol=250 rep=2 fit=contain`,
    '',
    '*Como usarlo:*',
    `1. Responde a una foto o video con: ${cmd} vol=200 rep=1`,
    `2. Luego responde al audio con: ${cmd}`,
    '',
    '*Opciones:*',
    '- vol=0-500 | 100 es normal, 500 es x5 de ganancia.',
    '- rep=1-3 | cuantas veces se repite el audio.',
    '- fit=contain/cover | contain es el modo normal: no recorta la foto.',
    '- dur=segundos | maximo 300s en video y 180s por defecto en foto.',
    '- calidad=baja/media/alta/max.',
    '',
    `Ejemplo fuerte: ${cmd} vol=500 rep=3 calidad=alta`
  ].join('\n')
}

function pendingMessage(prefix = '.', command = 'addaudio', options) {
  return [
    '*Base guardada por 5 minutos.*',
    '',
    'Ahora responde al audio que quieres ponerle con:',
    `${prefix}${command}`,
    '',
    `Configuracion guardada: vol=${options.volume}, rep=${options.repeats}, fit=${options.fit}, calidad=${options.quality}${options.duration ? `, dur=${options.duration}s` : ''}`
  ].join('\n')
}

function resultCaption(visualKind, options) {
  return [
    '*AddAudio listo.*',
    '',
    `Base: ${visualKind === 'image' ? 'foto convertida en video' : 'video con audio reemplazado'}`,
    `Volumen: ${options.volume}%`,
    `Repeticiones: ${options.repeats}/${MAX_REPEATS}`,
    `Calidad: ${options.quality}`,
    visualKind === 'image' ? `Ajuste de foto: ${options.fit}` : 'Modo: audio original reemplazado'
  ].join('\n')
}

async function safeReply(m, text = '') {
  try {
    return await m.reply(text)
  } catch {}
}

export default {
  command: ['addaudio', 'addsound', 'addmusica', 'poneraudio'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    cleanupPending()

    const prefix = usedPrefix || '.'
    const parsed = parseOptions(args)
    const key = pendingKey(client, m)
    const pending = getPending(key)
    const visualInfo = findVisualSource(m)
    const audioInfo = findAudioSource(m)

    try {
      if (!visualInfo && !audioInfo && !pending) {
        return m.reply(usage(prefix, command))
      }

      if (visualInfo && !audioInfo) {
        const visual = await downloadMedia(visualInfo, visualInfo.kind === 'image' ? 'foto' : 'video')
        savePending(key, visual, parsed.options)
        return m.reply(pendingMessage(prefix, command, parsed.options))
      }

      if (!audioInfo && pending) {
        return m.reply(`Ya tengo una foto/video guardado.\n\nResponde al audio con:\n${prefix}${command}`)
      }

      if (audioInfo && !visualInfo && !pending) {
        return m.reply(`Tengo el audio, pero falta la foto o video base.\n\n${usage(prefix, command)}`)
      }

      const usingPending = Boolean(pending && !visualInfo)
      const visual = usingPending
        ? pending.visual
        : await downloadMedia(visualInfo, visualInfo.kind === 'image' ? 'foto' : 'video')
      const audio = await downloadMedia(audioInfo, 'audio')
      const options = usingPending ? mergeOptions(pending.options, parsed) : parsed.options

      await safeReply(m, `Procesando AddAudio...\nvol=${options.volume}, rep=${options.repeats}, calidad=${options.quality}`)

      const video = await mixMediaWithAudio(visual, audio, options)
      pendingJobs.delete(key)

      return client.sendMessage(
        m.chat,
        {
          video,
          mimetype: 'video/mp4',
          fileName: 'rubyjx-addaudio.mp4',
          caption: resultCaption(visual.kind, options)
        },
        { quoted: m }
      )
    } catch (err) {
      return m.reply(`No pude completar AddAudio.\n\nDetalle: ${err.message || String(err)}`)
    }
  }
}
