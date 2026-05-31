import fs from 'fs'
import { spawn } from 'child_process'
import exif from '../../core/exif.js'

const { writeExif } = exif

const PRICE = 10000
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

  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].filter(Boolean)

  return owners.some(owner => onlyNumber(owner) === number)
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function cleanName(text = '') {
  return String(text || '')
    .replace(/[^\p{L}\p{N}\s._-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
}

function getCurrency(client) {
  const botNumber = onlyNumber(client?.user?.id || client?.user?.jid || '')
  const botId = botNumber ? `${botNumber}@s.whatsapp.net` : cleanJid(client?.user?.id || '')
  return global.db.data.settings?.[botId]?.currency || 'Soles'
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

async function sendStickerWithName(client, m, webpBuffer, packName) {
  const media = {
    mimetype: 'image/webp',
    data: webpBuffer
  }

  const stickerPath = await writeExif(media, {
    packname: packName,
    author: '',
    categories: ['']
  })

  try {
    await client.sendMessage(
      m.chat,
      { sticker: { url: stickerPath } },
      { quoted: m }
    )
  } finally {
    try { fs.unlinkSync(stickerPath) } catch {}
  }
}

async function processMediaToNamedSticker(client, m, buffer, { ext, isVideo = false, square = false, packName }) {
  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const inputPath = `${TMP_DIR}/sn-in-${id}.${ext}`
  const outputPath = `${TMP_DIR}/sn-out-${id}.webp`

  fs.writeFileSync(inputPath, buffer)

  try {
    await ffmpegToWebp(inputPath, outputPath, { isVideo, square })
    const webp = fs.readFileSync(outputPath)
    return await sendStickerWithName(client, m, webp, packName)
  } finally {
    try { fs.unlinkSync(inputPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}
  }
}

function getMediaInfo(source = {}) {
  const msg = source.msg || source.message || source
  const mime = msg?.mimetype || source?.mimetype || source?.mime || ''

  return { msg, mime }
}

export default {
  command: ['stickername', 'sname', 'sn', 'sn1'],
  category: 'stickers',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'sn') => {
    try {
      const db = global.db.data

      db.chats ||= {}
      db.users ||= {}
      db.settings ||= {}

      const chatData = db.chats[m.chat]
      const currency = getCurrency(client)

      if (!chatData) {
        return m.reply(
          `[ ⌬ ] *Base de datos no encontrada*\n\n` +
          `> No pude leer la economía de este grupo.`
        )
      }

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(
          `[ ⌬ ] *Economía desactivada*\n\n` +
          `> Un *administrador* puede activarla con:\n` +
          `> *${usedPrefix}economy on*`
        )
      }

      chatData.users ||= {}
      chatData.users[m.sender] ||= {}

      const user = chatData.users[m.sender]
      if (typeof user.coins !== 'number') user.coins = 0

      const ownerUnlimited = isOwnerUser(m.sender)
      const packName = cleanName(args.join(' '))
      const square = command === 'sn1'

      if (!packName) {
        return m.reply(
          `[ ⌬ ] *Falta el nombre del sticker*\n\n` +
          `> Responde a una imagen, video o sticker y escribe el nombre.\n\n` +
          `✨ *Ejemplos:*\n` +
          `> *${usedPrefix}sn Global Vxntas*\n` +
          `> *${usedPrefix}sn1 Global Vxntas*\n\n` +
          `💰 *Costo:* _S/${formatNumber(PRICE)} ${currency}_`
        )
      }

      const source = m.quoted ? m.quoted : m
      const { msg, mime } = getMediaInfo(source)

      if (!/image|video|webp/i.test(mime)) {
        return m.reply(
          `[ ⌬ ] *Media faltante*\n\n` +
          `> Debes enviar o responder a una *imagen*, *video* o *sticker*.\n\n` +
          `✨ *Ejemplo:*\n` +
          `> *${usedPrefix}sn ${packName}*`
        )
      }

      if (/video/i.test(mime)) {
        const seconds = Number(msg?.seconds || source?.seconds || 0)

        if (seconds > 6) {
          return m.reply(
            `[ ⌬ ] *Video muy largo*\n\n` +
            `> El video no puede durar más de *6 segundos*.`
          )
        }
      }

      if (!ownerUnlimited && user.coins < PRICE) {
        return m.reply(
          `[ ⌬ ] *Monedas insuficientes*\n\n` +
          `> Necesitas _S/${formatNumber(PRICE)} ${currency}_ para crear este sticker.\n` +
          `> Tu cartera: _S/${formatNumber(user.coins)} ${currency}_`
        )
      }

      const media = await source.download()

      if (!media) {
        return m.reply(
          `[ ⌬ ] *No pude descargar el archivo*\n\n` +
          `> Intenta responder otra vez al sticker, imagen o video.`
        )
      }

      /*
        Si ya es sticker WebP, NO usamos FFmpeg.
        Solo se escribe el nombre/pack con EXIF.
        Esto arregla el error gigante de .sn y .sn1 sobre stickers ya creados.
      */
      if (/webp/i.test(mime)) {
        await sendStickerWithName(client, m, media, packName)
      } else {
        let ext = 'jpg'
        let isVideo = false

        if (/video/i.test(mime)) {
          ext = 'mp4'
          isVideo = true
        } else if (/png/i.test(mime)) {
          ext = 'png'
        } else if (/jpeg|jpg/i.test(mime)) {
          ext = 'jpg'
        }

        await processMediaToNamedSticker(client, m, media, {
          ext,
          isVideo,
          square,
          packName
        })
      }

      if (!ownerUnlimited) {
        user.coins -= PRICE
      }

      const walletText = ownerUnlimited ? '∞' : formatNumber(user.coins)

      return m.reply(
        `[ ⌬ ] *Sticker creado*\n\n` +
        `> 🏷️ *Nombre:* _${packName}_\n` +
        `> 💰 *Costo:* _S/${formatNumber(PRICE)} ${currency}_\n` +
        `> ⛀ *Cartera:* _S/${walletText} ${currency}_\n\n` +
        `✨ _Sticker creado sin marca de RubyJX._`
      )
    } catch (e) {
      console.error('[SN ERROR COMPLETO]', e)

      return m.reply(
        `[ ⌬ ] *Error creando sticker*\n\n` +
        `> No pude procesar ese archivo.\n` +
        `> El error completo está en la consola.\n\n` +
        `⚠️ _${String(e?.message || e).slice(0, 180)}_`
      )
    }
  }
}