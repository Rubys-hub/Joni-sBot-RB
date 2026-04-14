import fs from 'fs'
import { spawn } from 'child_process'
import exif from '../../core/exif.js'

const { writeExif } = exif

async function ffmpegToWebp(inputPath, outputPath, { isVideo = false, square = false }) {
  const vf = square
    ? 'fps=12,scale=512:512,format=rgba,format=yuva420p'
    : 'fps=12,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p'

  const args = isVideo
    ? [
        '-y',
        '-i', inputPath,
        '-t', '6',
        '-an',
        '-vf', vf,
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
        '-vf', square
          ? 'scale=512:512,format=rgba,format=yuva420p'
          : 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p',
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

    p.stderr.on('data', d => err += d.toString())
    p.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(err || 'ffmpeg failed'))
    })
  })
}

async function sendSticker(client, m, buffer) {
  await client.sendMessage(m.chat, {
    sticker: buffer
  }, { quoted: m })
}

async function process(client, m, buffer, { ext, isVideo = false, square = false }) {
  const inFile = `./tmp/sf-in-${Date.now()}.${ext}`
  const outFile = `./tmp/sf-out-${Date.now()}.webp`

  fs.writeFileSync(inFile, buffer)

  try {
    await ffmpegToWebp(inFile, outFile, { isVideo, square })
    const webp = fs.readFileSync(outFile)
    await sendSticker(client, m, webp)
  } finally {
    try { fs.unlinkSync(inFile) } catch {}
    try { fs.unlinkSync(outFile) } catch {}
  }
}

export default {
  command: ['sf', 'stickfree', 'sf1'],
  category: 'stickers',
  isOwner: true,

  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (m.sender !== '51901931862@s.whatsapp.net') return

      const q = m.quoted ? m.quoted : m
      const mime = q?.msg?.mimetype || q?.mimetype || ''
      const square = command === 'sf1'

      if (/image/.test(mime)) {
        const media = await q.download()
        return await process(client, m, media, {
          ext: /png/i.test(mime) ? 'png' : 'jpg',
          isVideo: false,
          square
        })
      }

      if (/video/.test(mime)) {
        const seconds = (q.msg || q).seconds || 0
        if (seconds > 6) return m.reply('El video no puede durar más de 6 segundos.')

        const media = await q.download()
        return await process(client, m, media, {
          ext: 'mp4',
          isVideo: true,
          square
        })
      }

      return m.reply(
        `Responde a una imagen o video.\n\n` +
        `• ${usedPrefix}sf = sticker simple\n` +
        `• ${usedPrefix}sf1 = sticker cuadrado 1:1`
      )
    } catch (e) {
      return m.reply(`Error: ${e.message}`)
    }
  }
}