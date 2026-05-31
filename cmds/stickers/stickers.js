import fs from 'fs'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import exif from '../../core/exif.js'

const { writeExif } = exif

const TMP_DIR = './tmp'

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

function isUrl(text = '') {
  return /https?:\/\/[^\s]+/i.test(String(text || ''))
}

function cleanText(text = '') {
  return String(text || '').trim().toLowerCase()
}

function isAnimatedWebp(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 32) return false
  return buffer.includes(Buffer.from('ANIM')) || buffer.includes(Buffer.from('ANMF'))
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

function parseStickerMode(args = []) {
  const first = cleanText(args[0] || '')

  const map = {
    cir: { type: 'shape', value: 'circle' },
    circular: { type: 'shape', value: 'circle' },
    circulo: { type: 'shape', value: 'circle' },
    círculo: { type: 'shape', value: 'circle' },

    tri: { type: 'shape', value: 'triangle' },
    triangular: { type: 'shape', value: 'triangle' },
    triangulo: { type: 'shape', value: 'triangle' },
    triángulo: { type: 'shape', value: 'triangle' },

    dia: { type: 'shape', value: 'diamond' },
    diamante: { type: 'shape', value: 'diamond' },

    cor: { type: 'shape', value: 'heart' },
    corazón: { type: 'shape', value: 'heart' },
    corazon: { type: 'shape', value: 'heart' },

    e: { type: 'effect', value: 'vflip' },
    alreves: { type: 'effect', value: 'vflip' },
    'al-reves': { type: 'effect', value: 'vflip' },
    'alrevés': { type: 'effect', value: 'vflip' },

    i: { type: 'effect', value: 'hflip' },
    espejo: { type: 'effect', value: 'hflip' },
    reflejado: { type: 'effect', value: 'hflip' },

    n: { type: 'effect', value: 'negative' },
    negativo: { type: 'effect', value: 'negative' },
    negative: { type: 'effect', value: 'negative' },

    b: { type: 'effect', value: 'blur' },
    borroso: { type: 'effect', value: 'blur' },
    blur: { type: 'effect', value: 'blur' },

    r: { type: 'effect', value: 'red' },
    rojo: { type: 'effect', value: 'red' },
    red: { type: 'effect', value: 'red' },

    g: { type: 'effect', value: 'gray' },
    gris: { type: 'effect', value: 'gray' },
    gray: { type: 'effect', value: 'gray' },
    grayscale: { type: 'effect', value: 'gray' }
  }

  return map[first] || null
}

function getPackAuthor(m) {
  const db = global.db?.data || {}
  const user = db.users?.[m.sender] || {}
  const name = user.name || m.pushName || 'Usuario'

  const meta1 = user.metadatos ? String(user.metadatos).trim() : ''
  const meta2 = user.metadatos2 ? String(user.metadatos2).trim() : ''

  return {
    pack: meta1 || 'RubyJX Bot',
    author: meta2 || `@${name}`
  }
}

function buildFilter({ square = false, mode = null }) {
  const W = 512
  const H = 512
  const filters = []

  if (square) {
    filters.push(`scale=${W}:${H}`)
  } else {
    filters.push(`scale=${W}:${H}:force_original_aspect_ratio=decrease`)
    filters.push(`pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x00000000`)
  }

  filters.push('format=rgba')

  if (mode?.type === 'effect') {
    switch (mode.value) {
      case 'vflip':
        filters.push('vflip')
        break

      case 'hflip':
        filters.push('hflip')
        break

      case 'negative':
        filters.push('negate')
        break

      case 'blur':
        filters.push('gblur=sigma=5')
        break

      case 'red':
        filters.push('colorchannelmixer=1:0:0:0:0:0.35:0:0:0:0:0.35')
        break

      case 'gray':
        filters.push('hue=s=0')
        break
    }
  }

  if (mode?.type === 'shape') {
    const cx = W / 2
    const cy = H / 2
    const r = Math.min(W, H) / 2

    let alphaExpr = ''

    switch (mode.value) {
      case 'circle':
        alphaExpr = `if(lte((X-${cx})*(X-${cx})+(Y-${cy})*(Y-${cy}),${r * r}),255,0)`
        break

      case 'triangle':
        alphaExpr = `if(gte(Y,${H * 0.08})*lte(Y,${H * 0.92})*lte(abs(X-${cx}),((${H * 0.92}-Y)*0.65)),255,0)`
        break

      case 'diamond':
        alphaExpr = `if(lte(abs(X-${cx})+abs(Y-${cy}),${r}),255,0)`
        break

      case 'heart':
        alphaExpr = `if(lte(pow((X-${cx})/(${W * 0.30})*(X-${cx})/(${W * 0.30})+(Y-${cy})/(${H * 0.30})*(Y-${cy})/(${H * 0.30})-1,3)-((X-${cx})/(${W * 0.30})*(X-${cx})/(${W * 0.30}))*pow((Y-${cy})/(${H * 0.30}),3),0),255,0)`
        break
    }

    if (alphaExpr) {
      filters.push(`geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='${alphaExpr}'`)
    }
  }

  filters.push('format=yuva420p')

  return filters.join(',')
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
      reject(new Error(stderr || `FFmpeg falló con código ${code}`))
    })
  })
}

async function ffmpegToWebp(inputPath, outputPath, {
  animated = false,
  square = false,
  mode = null
} = {}) {
  const vf = buildFilter({ square, mode })

  const args = animated
    ? [
        '-y',
        '-i', inputPath,
        '-t', '6',
        '-an',
        '-vf', `fps=12,${vf}`,
        '-vcodec', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-q:v', '55',
        '-loop', '0',
        '-preset', 'default',
        '-vsync', '0',
        outputPath
      ]
    : [
        '-y',
        '-i', inputPath,
        '-vf', vf,
        '-vcodec', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-q:v', '75',
        '-preset', 'picture',
        outputPath
      ]

  await runFfmpeg(args)
}

async function sendStickerFromBuffer(client, m, webpBuffer, pack, author) {
  const media = {
    mimetype: 'image/webp',
    data: webpBuffer
  }

  const stickerPath = await writeExif(media, {
    packname: pack,
    author,
    categories: ['']
  })

  await client.sendMessage(
    m.chat,
    {
      sticker: {
        url: stickerPath
      }
    },
    {
      quoted: m
    }
  )

  try {
    fs.unlinkSync(stickerPath)
  } catch {}
}

async function processMedia(client, m, buffer, {
  ext = 'jpg',
  animated = false,
  square = false,
  mode = null,
  pack = 'RubyJX Bot',
  author = ''
} = {}) {
  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const inputPath = `${TMP_DIR}/stk-in-${id}.${ext}`
  const outputPath = `${TMP_DIR}/stk-out-${id}.webp`

  fs.writeFileSync(inputPath, buffer)

  try {
    await ffmpegToWebp(inputPath, outputPath, {
      animated,
      square,
      mode
    })

    const webp = fs.readFileSync(outputPath)

    if (!webp?.length) {
      throw new Error('el sticker final quedó vacío')
    }

    await sendStickerFromBuffer(client, m, webp, pack, author)
  } finally {
    try {
      fs.unlinkSync(inputPath)
    } catch {}

    try {
      fs.unlinkSync(outputPath)
    } catch {}
  }
}

async function downloadFromUrl(url) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('no pude descargar ese archivo desde la URL')
  }

  return Buffer.from(await res.arrayBuffer())
}

function getUrlExt(url = '') {
  const clean = String(url || '').split('?')[0].toLowerCase()

  if (clean.endsWith('.png')) return 'png'
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'jpg'
  if (clean.endsWith('.webp')) return 'webp'
  if (clean.endsWith('.gif')) return 'gif'
  if (clean.endsWith('.mp4')) return 'mp4'
  if (clean.endsWith('.webm')) return 'webm'
  if (clean.endsWith('.mov')) return 'mp4'

  return 'jpg'
}

function isVideoUrl(url = '') {
  return /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(String(url || ''))
}

function isImageUrl(url = '') {
  return /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(String(url || ''))
}

export default {
  command: ['sticker', 's', 's1'],
  category: 'stickers',

  run: async (client, m, args = [], usedPrefix = '.', command = 's') => {
    await setReact(client, m, '🕒')

    try {
      const { pack, author } = getPackAuthor(m)
      const square = command === 's1'
      const mode = square ? null : parseStickerMode(args)

      let urlArg = null

      for (const arg of args) {
        if (isUrl(arg)) {
          urlArg = arg
          break
        }
      }

      const source = m.quoted ? m.quoted : m
      const msg = source.msg || source
      const mime = String(msg.mimetype || source.mime || '').toLowerCase()

      if (/image/.test(mime) || /webp/.test(mime)) {
        const media = await source.download()

        if (!media?.length) {
          throw new Error('no pude descargar la imagen o sticker')
        }

        const ext = /webp/.test(mime)
          ? 'webp'
          : /png/.test(mime)
            ? 'png'
            : 'jpg'

        const animated = /webp/.test(mime) && isAnimatedWebp(media)

        await processMedia(client, m, media, {
          ext,
          animated,
          square,
          mode,
          pack,
          author
        })

        await setReact(client, m, '✅')
        return
      }

      if (/video/.test(mime) || /gif/.test(mime)) {
        const seconds = Number(msg.seconds || 0)

        if (seconds > 8) {
          throw new Error('el video no puede durar más de 8 segundos')
        }

        const media = await source.download()

        if (!media?.length) {
          throw new Error('no pude descargar el video o GIF')
        }

        await processMedia(client, m, media, {
          ext: /webm/.test(mime) ? 'webm' : 'mp4',
          animated: true,
          square,
          mode,
          pack,
          author
        })

        await setReact(client, m, '✅')
        return
      }

      if (urlArg) {
        if (!isImageUrl(urlArg) && !isVideoUrl(urlArg)) {
          throw new Error('la URL debe ser imagen, GIF, WebP o video')
        }

        const buffer = await downloadFromUrl(urlArg)
        const ext = getUrlExt(urlArg)

        await processMedia(client, m, buffer, {
          ext,
          animated: isVideoUrl(urlArg) || ext === 'gif' || ext === 'webp',
          square,
          mode,
          pack,
          author
        })

        await setReact(client, m, '✅')
        return
      }

      throw new Error(
        `responde a una imagen, video, GIF o sticker. Usa ${usedPrefix}msticker para ver el menú`
      )
    } catch (error) {
      await setReact(client, m, '❌')
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}