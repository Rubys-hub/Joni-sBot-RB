import fs from 'fs'
import { spawn } from 'child_process'

const TMP_DIR = './tmp'

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

function cleanJid(jid = '') {
  jid = String(jid || '').trim()
  if (!jid) return ''

  if (!jid.includes('@')) return jid.split(':')[0]

  const [left, server] = jid.split('@')
  return `${left.split(':')[0]}@${server}`
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function isOwnerUser(jid = '') {
  const number = onlyNumber(jid)

  return FORCE_OWNER.some(owner => onlyNumber(owner) === number)
}

function buildFilter(square = false, isVideo = false) {
  if (square) {
    return isVideo
      ? 'fps=12,scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba,format=yuva420p'
      : 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba,format=yuva420p'
  }

  return isVideo
    ? 'fps=12,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p'
    : 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p'
}

async function ffmpegToWebp(inputPath, outputPath, { isVideo = false, square = false }) {
  const vf = buildFilter(square, isVideo)

  const args = isVideo
    ? [
        '-y',
        '-hide_banner',
        '-loglevel', 'error',
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
        '-hide_banner',
        '-loglevel', 'error',
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

    p.on('error', reject)

    p.on('close', code => {
      if (code === 0) return resolve()
      reject(new Error(err || 'ffmpeg failed'))
    })
  })
}

async function sendSticker(client, m, buffer) {
  return client.sendMessage(
    m.chat,
    { sticker: buffer },
    { quoted: m }
  )
}

async function processMedia(client, m, buffer, { ext, isVideo = false, square = false }) {
  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const inputPath = `${TMP_DIR}/sf-in-${id}.${ext}`
  const outputPath = `${TMP_DIR}/sf-out-${id}.webp`

  fs.writeFileSync(inputPath, buffer)

  try {
    await ffmpegToWebp(inputPath, outputPath, { isVideo, square })
    const webp = fs.readFileSync(outputPath)
    return await sendSticker(client, m, webp)
  } finally {
    try { fs.unlinkSync(inputPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}
  }
}

function getMediaInfo(q = {}) {
  const msg = q.msg || q.message || q
  const mime = msg?.mimetype || q?.mimetype || q?.mime || ''

  return { msg, mime }
}

export default {
  command: ['sf', 'stickfree', 'sf1'],
  category: 'stickers',
  isOwner: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'sf') => {
    try {
      if (!isOwnerUser(m.sender)) return

      const q = m.quoted ? m.quoted : m
      const { msg, mime } = getMediaInfo(q)
      const square = command === 'sf1'

      if (!mime) {
        return m.reply(
          `[ ⌬ ] *Media no detectada*\n\n` +
          `> Responde a una imagen, video o sticker.\n\n` +
          `✨ *Uso:*\n` +
          `> *${usedPrefix}sf* = sticker normal\n` +
          `> *${usedPrefix}sf1* = sticker cuadrado`
        )
      }

      const media = await q.download()

      if (!media) {
        return m.reply(
          `[ ⌬ ] *No pude descargar el archivo*\n\n` +
          `> Intenta responder otra vez al sticker, imagen o video.`
        )
      }

      /*
        Si ya es sticker WebP, NO se manda a FFmpeg.
        WhatsApp stickers ya vienen en WebP y normalmente ya son 512x512.
        Esto arregla el error gigante con .sf1 en stickers ya creados.
      */
      if (/webp/i.test(mime)) {
        return await sendSticker(client, m, media)
      }

      if (/image/i.test(mime)) {
        let ext = 'jpg'
        if (/png/i.test(mime)) ext = 'png'
        if (/jpeg|jpg/i.test(mime)) ext = 'jpg'

        return await processMedia(client, m, media, {
          ext,
          isVideo: false,
          square
        })
      }

      if (/video/i.test(mime)) {
        const seconds = Number(msg?.seconds || q?.seconds || 0)

        if (seconds > 6) {
          return m.reply(
            `[ ⌬ ] *Video muy largo*\n\n` +
            `> El video no puede durar más de *6 segundos*.`
          )
        }

        return await processMedia(client, m, media, {
          ext: 'mp4',
          isVideo: true,
          square
        })
      }

      return m.reply(
        `[ ⌬ ] *Formato no compatible*\n\n` +
        `> Responde a una imagen, video o sticker.`
      )
    } catch (e) {
      console.error('[SF ERROR COMPLETO]', e)

      return m.reply(
        `[ ⌬ ] *Error creando sticker*\n\n` +
        `> No pude procesar ese archivo.\n` +
        `> Revisa la consola para ver el error completo.\n\n` +
        `⚠️ _${String(e?.message || e).slice(0, 180)}_`
      )
    }
  }
}