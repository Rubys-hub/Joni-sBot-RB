import fs from 'fs'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import exif from '../../core/exif.js'

const { writeExif } = exif

function isUrl(text) {
  return /https?:\/\/[^\s]+/i.test(text || '')
}

function buildFilter({ square = false, cover = false }) {
  const W = 512
  const H = 512

  if (square) {
    return `scale=${W}:${H},format=rgba,format=yuva420p`
  }

  if (cover) {
    return `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},format=rgba,format=yuva420p`
  }

  return `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p`
}

async function ffmpegToWebp(inputPath, outputPath, { isVideo = false, square = false, cover = false }) {
  const vf = buildFilter({ square, cover })

  const args = isVideo
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
        '-q:v', '70',
        '-preset', 'picture',
        outputPath
      ]

  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args)
    let err = ''

    p.stderr.on('data', d => {
      err += d.toString()
    })

    p.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(err || 'ffmpeg failed'))
    })
  })
}

async function sendStickerFromBuffer(client, m, webpBuffer, pack, author) {
  const media = { mimetype: 'image/webp', data: webpBuffer }
  const stickerPath = await writeExif(media, {
    packname: pack,
    author,
    categories: ['']
  })

  await client.sendMessage(m.chat, {
    sticker: { url: stickerPath }
  }, { quoted: m })

  try { fs.unlinkSync(stickerPath) } catch {}
}

async function processMedia(client, m, buffer, { ext, isVideo = false, square = false, pack, author }) {
  const inputPath = `./tmp/stk-in-${Date.now()}.${ext}`
  const outputPath = `./tmp/stk-out-${Date.now()}.webp`

  fs.writeFileSync(inputPath, buffer)

  try {
    await ffmpegToWebp(inputPath, outputPath, { isVideo, square })
    const webp = fs.readFileSync(outputPath)
    await sendStickerFromBuffer(client, m, webp, pack, author)
  } finally {
    try { fs.unlinkSync(inputPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}
  }
}

export default {
  command: ['sticker', 's', 's1'],
  category: 'stickers',

  run: async (client, m, args, usedPrefix, command) => {
    try {
      const quoted = m.quoted ? m.quoted : m
      const mime = (quoted.msg || quoted).mimetype || ''

      const db = global.db.data
      const user = db.users[m.sender] || {}
      const name = user.name || m.pushName || 'Usuario'

      const meta1 = user.metadatos ? String(user.metadatos).trim() : ''
      const meta2 = user.metadatos2 ? String(user.metadatos2).trim() : ''

      const pack = meta1 || 'RubyJX Bot'
      const author = meta2 || `@${name}`

      const square = command === 's1'

      let urlArg = null
      const cleanArgs = []

      for (const arg of args) {
        if (isUrl(arg)) urlArg = arg
        else cleanArgs.push(arg)
      }

      if (/image/.test(mime)) {
        const media = await quoted.download()
        return await processMedia(client, m, media, {
          ext: /png/i.test(mime) ? 'png' : 'jpg',
          isVideo: false,
          square,
          pack,
          author
        })
      }

      if (/video/.test(mime)) {
        const seconds = (quoted.msg || quoted).seconds || 0
        if (seconds > 6) {
          return m.reply('El video no puede durar más de 6 segundos.')
        }

        const media = await quoted.download()
        return await processMedia(client, m, media, {
          ext: 'mp4',
          isVideo: true,
          square,
          pack,
          author
        })
      }

      if (urlArg) {
        const res = await fetch(urlArg)
        if (!res.ok) return m.reply('No pude descargar ese archivo.')

        const buffer = Buffer.from(await res.arrayBuffer())

        if (/\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(urlArg)) {
          return await processMedia(client, m, buffer, {
            ext: 'mp4',
            isVideo: true,
            square,
            pack,
            author
          })
        }

        if (/\.(png|jpg|jpeg|webp)(\?.*)?$/i.test(urlArg)) {
          return await processMedia(client, m, buffer, {
            ext: 'jpg',
            isVideo: false,
            square,
            pack,
            author
          })
        }

        return m.reply('La URL debe ser de imagen o video.')
      }

      return m.reply(
        `Responde a una imagen o video.\n\n` +
        `• ${usedPrefix}s = sticker normal\n` +
        `• ${usedPrefix}s1 = sticker cuadrado 1:1`
      )
    } catch (e) {
      return m.reply(`Error: ${e.message}`)
    }
  }
}