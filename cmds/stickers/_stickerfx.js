import { downloadContentFromMessage } from 'baileys'
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { spawn } from 'child_process'

const WORK_DIR = join(process.cwd(), 'tmp', 'stickerfx_work')
const DEBUG_DIR = join(process.cwd(), 'tmp', 'stickerfx_debug')

const TRANSPARENT = {
  r: 0,
  g: 0,
  b: 0,
  alpha: 0
}

function ensureDirs() {
  mkdirSync(WORK_DIR, { recursive: true })
  mkdirSync(DEBUG_DIR, { recursive: true })
}

async function getDeps() {
  let sharp

  try {
    sharp = (await import('sharp')).default
  } catch {
    throw new Error('Falta instalar sharp. Usa: npm i sharp --legacy-peer-deps')
  }

  return { sharp }
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

function getQuotedNode(m = {}) {
  const quoted = m.quoted
  if (!quoted) return null

  if (quoted.message) {
    const type = Object.keys(quoted.message || {})[0]
    const node = quoted.message?.[type]

    if (type && node) return { type, node }
  }

  if (quoted.mtype && quoted.msg) {
    return {
      type: quoted.mtype,
      node: quoted.msg
    }
  }

  return null
}

function extFromMime(mime = '', fileName = '') {
  const lowerMime = String(mime || '').toLowerCase()
  const lowerName = String(fileName || '').toLowerCase()
  const fromName = extname(lowerName).replace('.', '')

  if (fromName) return fromName
  if (lowerMime.includes('png')) return 'png'
  if (lowerMime.includes('jpeg') || lowerMime.includes('jpg')) return 'jpg'
  if (lowerMime.includes('webp')) return 'webp'
  if (lowerMime.includes('gif')) return 'gif'
  if (lowerMime.includes('mp4')) return 'mp4'
  if (lowerMime.includes('webm')) return 'webm'

  return 'bin'
}

function resolveMediaNode(type = '', node = {}) {
  const mime = String(node?.mimetype || '').toLowerCase()
  const fileName = String(node?.fileName || '').toLowerCase()

  if (type === 'imageMessage') {
    return {
      node,
      streamType: 'image',
      kind: 'image',
      ext: extFromMime(mime, fileName) || 'jpg'
    }
  }

  if (type === 'videoMessage') {
    return {
      node,
      streamType: 'video',
      kind: 'animated',
      ext: 'mp4'
    }
  }

  if (type === 'stickerMessage') {
    return {
      node,
      streamType: 'sticker',
      kind: 'sticker',
      ext: 'webp'
    }
  }

  if (type === 'documentMessage') {
    if (mime.startsWith('image/')) {
      return {
        node,
        streamType: 'document',
        kind: lowerIsWebp(mime, fileName) ? 'sticker' : 'image',
        ext: extFromMime(mime, fileName)
      }
    }

    if (mime.startsWith('video/') || mime.includes('gif')) {
      return {
        node,
        streamType: 'document',
        kind: 'animated',
        ext: extFromMime(mime, fileName)
      }
    }
  }

  throw new Error(`Tipo no soportado: ${type}`)
}

function lowerIsWebp(mime = '', fileName = '') {
  const m = String(mime || '').toLowerCase()
  const f = String(fileName || '').toLowerCase()
  return m.includes('webp') || f.endsWith('.webp')
}

async function downloadMediaBuffer(type = '', node = {}) {
  const media = resolveMediaNode(type, node)
  const stream = await downloadContentFromMessage(media.node, media.streamType)
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return {
    buffer: Buffer.concat(chunks),
    media
  }
}

function runFfmpeg(args = []) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args, {
      windowsHide: true
    })

    let stderr = ''

    ff.stderr.on('data', chunk => {
      stderr += chunk.toString()
      if (stderr.length > 9000) stderr = stderr.slice(-9000)
    })

    ff.on('error', error => {
      reject(new Error(`FFmpeg no inició: ${error.message}`))
    })

    ff.on('close', code => {
      if (code === 0) return resolve()
      reject(new Error(`FFmpeg falló con código ${code}: ${stderr || 'sin detalle'}`))
    })
  })
}

const EFFECTS = {
  shake: {
    fps: 15,
    totalLoops: 3,
    pattern: [
      { scale: 1.00, angle: -4, x: -34, y: 10 },
      { scale: 1.00, angle:  3, x:  28, y: -8 },
      { scale: 1.00, angle: -2, x: -20, y: 12 },
      { scale: 1.00, angle:  4, x:  36, y: -10 },
      { scale: 1.00, angle: -3, x: -30, y:  8 },
      { scale: 1.00, angle:  2, x:  22, y: -6 }
    ]
  },

  zoom: {
    fps: 15,
    totalLoops: 3,
    pattern: [
      { scale: 0.72, angle: 0, x: 0, y: 0 },
      { scale: 0.84, angle: 0, x: 0, y: 0 },
      { scale: 0.96, angle: 0, x: 0, y: 0 },
      { scale: 1.08, angle: 0, x: 0, y: 0 },
      { scale: 1.20, angle: 0, x: 0, y: 0 },
      { scale: 1.10, angle: 0, x: 0, y: 0 },
      { scale: 0.96, angle: 0, x: 0, y: 0 },
      { scale: 0.84, angle: 0, x: 0, y: 0 }
    ]
  },

  spin: {
    fps: 15,
    totalLoops: 3,
    pattern: [
      { scale: 0.92, angle:   0, x: 0, y: 0 },
      { scale: 0.92, angle:  45, x: 0, y: 0 },
      { scale: 0.92, angle:  90, x: 0, y: 0 },
      { scale: 0.92, angle: 135, x: 0, y: 0 },
      { scale: 0.92, angle: 180, x: 0, y: 0 },
      { scale: 0.92, angle: 225, x: 0, y: 0 },
      { scale: 0.92, angle: 270, x: 0, y: 0 },
      { scale: 0.92, angle: 315, x: 0, y: 0 }
    ]
  },

  bounce: {
    fps: 15,
    totalLoops: 3,
    pattern: [
      { scale: 0.92, angle: 0, x: 0, y:  60 },
      { scale: 0.96, angle: 0, x: 0, y:  28 },
      { scale: 1.00, angle: 0, x: 0, y:   0 },
      { scale: 1.04, angle: 0, x: 0, y: -40 },
      { scale: 1.00, angle: 0, x: 0, y: -10 },
      { scale: 0.96, angle: 0, x: 0, y:  24 },
      { scale: 0.92, angle: 0, x: 0, y:  54 }
    ]
  },

  rage: {
    fps: 18,
    totalLoops: 3,
    pattern: [
      { scale: 0.66, angle: -18, x: -76, y:  8 },
      { scale: 1.22, angle:  20, x:  82, y: 28 },
      { scale: 0.88, angle:  -8, x: -26, y: -58 },
      { scale: 1.12, angle:  12, x:  48, y: 18 },
      { scale: 0.62, angle: -16, x: -62, y: 38 },
      { scale: 1.16, angle:  18, x:  58, y: -36 },
      { scale: 0.74, angle: -12, x: -44, y:  20 },
      { scale: 1.26, angle:  14, x:  70, y: -12 }
    ]
  },

  pulse: {
    fps: 15,
    totalLoops: 4,
    pattern: [
      { scale: 0.92, angle: 0, x: 0, y: 0 },
      { scale: 0.98, angle: 0, x: 0, y: 0 },
      { scale: 1.04, angle: 0, x: 0, y: 0 },
      { scale: 1.12, angle: 0, x: 0, y: 0 },
      { scale: 1.02, angle: 0, x: 0, y: 0 },
      { scale: 0.96, angle: 0, x: 0, y: 0 }
    ]
  }
}

async function createSquareFrame(sharp, inputBuffer, framePath, size = 512) {
  const frame = await sharp(inputBuffer, {
    animated: false,
    limitInputPixels: false
  })
    .rotate()
    .resize(size, size, {
      fit: 'contain',
      position: 'center',
      background: TRANSPARENT
    })
    .ensureAlpha()
    .png()
    .toBuffer()

  writeFileSync(framePath, frame)
}

async function createTransformedFrame(sharp, inputBuffer, framePath, state, size = 512) {
  const pad = 1800
  const innerSize = Math.max(64, Math.round(size * Number(state.scale || 1)))

  const rendered = await sharp(inputBuffer, {
    animated: false,
    limitInputPixels: false
  })
    .rotate()
    .resize(innerSize, innerSize, {
      fit: 'contain',
      position: 'center',
      background: TRANSPARENT
    })
    .rotate(Number(state.angle || 0), {
      background: TRANSPARENT
    })
    .ensureAlpha()
    .png()
    .toBuffer()

  const paddedResult = await sharp(rendered, {
    limitInputPixels: false
  })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: TRANSPARENT
    })
    .png()
    .toBuffer({
      resolveWithObject: true
    })

  const paddedBuffer = paddedResult.data
  const paddedW = Number(paddedResult.info?.width || 0)
  const paddedH = Number(paddedResult.info?.height || 0)

  if (paddedW < size || paddedH < size) {
    await createSquareFrame(sharp, inputBuffer, framePath, size)
    return
  }

  let cropLeft = Math.round((paddedW - size) / 2 - Number(state.x || 0))
  let cropTop = Math.round((paddedH - size) / 2 - Number(state.y || 0))

  const maxLeft = paddedW - size
  const maxTop = paddedH - size

  cropLeft = Math.max(0, Math.min(cropLeft, maxLeft))
  cropTop = Math.max(0, Math.min(cropTop, maxTop))

  const frame = await sharp(paddedBuffer, {
    limitInputPixels: false
  })
    .extract({
      left: cropLeft,
      top: cropTop,
      width: size,
      height: size
    })
    .png()
    .toBuffer()

  writeFileSync(framePath, frame)
}

async function createFramesFromStaticImage(sharp, imageBuffer, framesDir, effectName = 'shake') {
  const effect = EFFECTS[effectName] || EFFECTS.shake
  const pattern = effect.pattern
  const loops = Number(effect.totalLoops || 3)
  const totalFrames = Math.max(1, pattern.length * loops)

  mkdirSync(framesDir, { recursive: true })

  for (let i = 0; i < totalFrames; i++) {
    const framePath = join(framesDir, `frame_${String(i).padStart(3, '0')}.png`)
    const state = pattern[i % pattern.length]

    try {
      await createTransformedFrame(sharp, imageBuffer, framePath, state)
    } catch {
      await createSquareFrame(sharp, imageBuffer, framePath)
    }
  }
}

async function extractFramesFromAnimated(inputPath, framesDir) {
  mkdirSync(framesDir, { recursive: true })

  const srcPattern = join(framesDir, 'src_%03d.png')

  await runFfmpeg([
    '-y',
    '-t', '5',
    '-i', inputPath,
    '-vf',
    'fps=15,scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
    srcPattern
  ])

  const frames = readdirSync(framesDir)
    .filter(file => file.toLowerCase().startsWith('src_') && file.toLowerCase().endsWith('.png'))
    .sort()
    .map(file => join(framesDir, file))

  if (!frames.length) {
    throw new Error('FFmpeg no pudo extraer frames del sticker animado')
  }

  return frames
}

async function applyEffectToAnimatedFrames(sharp, srcFrames, outFramesDir, effectName = 'shake') {
  const effect = EFFECTS[effectName] || EFFECTS.shake
  const pattern = effect.pattern

  mkdirSync(outFramesDir, { recursive: true })

  for (let i = 0; i < srcFrames.length; i++) {
    const inputBuffer = readFileSync(srcFrames[i])
    const framePath = join(outFramesDir, `frame_${String(i).padStart(3, '0')}.png`)
    const state = pattern[i % pattern.length]

    try {
      await createTransformedFrame(sharp, inputBuffer, framePath, state)
    } catch {
      await createSquareFrame(sharp, inputBuffer, framePath)
    }
  }
}

async function encodeFramesToWebp(framesDir, outputPath, fps = 15, quality = 70) {
  await runFfmpeg([
    '-y',
    '-framerate', String(fps),
    '-i', join(framesDir, 'frame_%03d.png'),
    '-loop', '0',
    '-c:v', 'libwebp',
    '-lossless', '0',
    '-q:v', String(quality),
    '-preset', 'default',
    '-an',
    '-vsync', '0',
    '-s', '512:512',
    outputPath
  ])
}

async function encodeWithSizeControl(framesDir, outputPath, fps = 15) {
  await encodeFramesToWebp(framesDir, outputPath, fps, 70)
  let outBuffer = readFileSync(outputPath)

  if (outBuffer.length > 900 * 1024) {
    await encodeFramesToWebp(framesDir, outputPath, fps, 55)
    outBuffer = readFileSync(outputPath)
  }

  if (outBuffer.length > 1200 * 1024) {
    await encodeFramesToWebp(framesDir, outputPath, fps, 42)
    outBuffer = readFileSync(outputPath)
  }

  return outBuffer
}

async function imageToEffectWebp(sharp, imageBuffer, workPath, outputPath, effectName = 'shake') {
  const framesDir = join(workPath, 'frames')
  const effect = EFFECTS[effectName] || EFFECTS.shake

  await createFramesFromStaticImage(sharp, imageBuffer, framesDir, effectName)
  return await encodeWithSizeControl(framesDir, outputPath, effect.fps)
}

async function animatedFramesToEffectWebp(sharp, inputPath, workPath, outputPath, effectName = 'shake') {
  const srcFramesDir = join(workPath, 'src_frames')
  const outFramesDir = join(workPath, 'frames')
  const effect = EFFECTS[effectName] || EFFECTS.shake

  const srcFrames = await extractFramesFromAnimated(inputPath, srcFramesDir)

  if (srcFrames.length <= 1) {
    const firstFrame = readFileSync(srcFrames[0])
    await createFramesFromStaticImage(sharp, firstFrame, outFramesDir, effectName)
  } else {
    await applyEffectToAnimatedFrames(sharp, srcFrames, outFramesDir, effectName)
  }

  return await encodeWithSizeControl(outFramesDir, outputPath, effect.fps)
}

async function stickerToEffectWebp(sharp, inputBuffer, inputPath, workPath, outputPath, effectName = 'shake') {
  try {
    return await animatedFramesToEffectWebp(sharp, inputPath, workPath, outputPath, effectName)
  } catch {
    return await imageToEffectWebp(sharp, inputBuffer, workPath, outputPath, effectName)
  }
}

async function buildSticker({ inputBuffer, media, effect = 'shake' }) {
  const { sharp } = await getDeps()

  ensureDirs()

  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const workPath = join(WORK_DIR, id)
  const inputPath = join(workPath, `input.${media.ext || 'bin'}`)
  const outputPath = join(workPath, 'animated.webp')

  mkdirSync(workPath, { recursive: true })
  writeFileSync(inputPath, inputBuffer)

  try {
    let stickerBuffer

    if (media.kind === 'sticker') {
      stickerBuffer = await stickerToEffectWebp(sharp, inputBuffer, inputPath, workPath, outputPath, effect)
    } else if (media.kind === 'animated') {
      stickerBuffer = await animatedFramesToEffectWebp(sharp, inputPath, workPath, outputPath, effect)
    } else {
      stickerBuffer = await imageToEffectWebp(sharp, inputBuffer, workPath, outputPath, effect)
    }

    const debugPath = join(DEBUG_DIR, `${effect}-${Date.now()}.webp`)
    writeFileSync(debugPath, stickerBuffer)

    return {
      buffer: stickerBuffer,
      debugPath
    }
  } finally {
    if (existsSync(workPath)) {
      rmSync(workPath, {
        recursive: true,
        force: true
      })
    }
  }
}

export function makeStickerEffectCommand({
  names = [],
  effect = 'shake'
} = {}) {
  return {
    command: names,
    category: 'stickers',

    run: async (client, m) => {
      await setReact(client, m, '🕒')

      try {
        const quoted = getQuotedNode(m)

        if (!quoted) {
          await setReact(client, m, '❌')
          return m.reply('Error: responde a una imagen, video, GIF o sticker. Usa .msticker')
        }

        const downloaded = await downloadMediaBuffer(quoted.type, quoted.node)

        if (!downloaded.buffer?.length) {
          await setReact(client, m, '❌')
          return m.reply('Error: no pude descargar el archivo respondido')
        }

        const result = await buildSticker({
          inputBuffer: downloaded.buffer,
          media: downloaded.media,
          effect
        })

        await client.sendMessage(
          m.chat,
          {
            sticker: result.buffer
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
}