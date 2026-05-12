import fs from 'fs'
import { spawn } from 'child_process'
import exif from '../../core/exif.js'

const { writeExif } = exif
const PRICE = 10000
const TMP_DIR = './tmp'

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
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
  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
  return global.db.data.settings?.[botId]?.currency || 'Soles'
}

function isOwnerUser(jid = '') {
  const number = String(jid)
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')

  return Array.isArray(global.owner) && global.owner.includes(number)
}

function buildFilter(square = false) {
  const W = 512
  const H = 512

  if (square) {
    return `scale=${W}:${H},format=rgba,format=yuva420p`
  }

  return `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p`
}

async function ffmpegToWebp(inputPath, outputPath, { isVideo = false, square = false }) {
  const vf = buildFilter(square)

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

async function sendStickerWithName(client, m, webpBuffer, packName) {
  const media = {
    mimetype: 'webp',
    data: webpBuffer
  }

  const stickerPath = await writeExif(media, {
    packname: packName,
    author: '',
    categories: ['']
  })

  await client.sendMessage(
    m.chat,
    {
      sticker: { url: stickerPath }
    },
    {
      quoted: m
    }
  )

  try {
    fs.unlinkSync(stickerPath)
  } catch {}
}

async function processMedia(client, m, buffer, { ext, isVideo = false, square = false, packName }) {
  const id = `${Date.now()}-${Math.floor(Math.random() * 99999)}`
  const inputPath = `${TMP_DIR}/sn-in-${id}.${ext}`
  const outputPath = `${TMP_DIR}/sn-out-${id}.webp`

  fs.writeFileSync(inputPath, buffer)

  try {
    await ffmpegToWebp(inputPath, outputPath, { isVideo, square })
    const webp = fs.readFileSync(outputPath)
    await sendStickerWithName(client, m, webp, packName)
  } finally {
    try {
      fs.unlinkSync(inputPath)
    } catch {}

    try {
      fs.unlinkSync(outputPath)
    } catch {}
  }
}

export default {
  command: ['stickername', 'sname', 'sn', 'sn1'],
  category: 'stickers',
  group: true,

  run: async (client, m, args, usedPrefix = '.', command = 'sn') => {
    try {
      const db = global.db.data
      const chatData = db.chats[m.chat]
      const currency = getCurrency(client)

      if (!chatData) {
        return m.reply('❌ No se pudo leer la base de datos del grupo.')
      }

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(`⌬ Los comandos de *Economía* están desactivados en este grupo.

Un *administrador* puede activarlos con el comando:
» *${usedPrefix}economy on*`)
      }

      chatData.users ||= {}
      chatData.users[m.sender] ||= {}

      const user = chatData.users[m.sender]

      if (typeof user.coins !== 'number') user.coins = 0


      const ownerUnlimited = isOwnerUser(m.sender)


      const packName = cleanName(args.join(' '))
      const square = command === 'sn1'

      if (!packName) {
        return m.reply(`╭━━━〔 🏷️ *FALTA NOMBRE* 〕━━━╮
┃
┃ Envía o responde a una imagen/video
┃ y escribe el nombre del sticker.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 *Ejemplos:*
*.sn Global Vxntas*
*.sn1 Global Vxntas*

💰 *Costo:* _S/${formatNumber(PRICE)} ${currency}_`)
      }

      const source = m.quoted ? m.quoted : m
      const msg = source.msg || source
      const mime = msg.mimetype || source.mime || ''

      if (!/image|video|webp/i.test(mime)) {
        return m.reply(`╭━━━〔 ❌ *MEDIA FALTANTE* 〕━━━╮
┃
┃ Debes enviar una imagen/video
┃ con el comando en el texto
┃ o responder a una imagen/video.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 *Ejemplo con imagen enviada:*
_Envía una imagen con el texto:_
*.sn ${packName}*

💡 *Ejemplo respondiendo imagen:*
_Responde a la imagen con:_
*.sn1 ${packName}*`)
      }

      if (/video/i.test(mime)) {
        const seconds = msg.seconds || 0

        if (seconds > 6) {
          return m.reply('❌ El video no puede durar más de 6 segundos.')
        }
      }

if (!ownerUnlimited && user.coins < PRICE) {
  return m.reply(`╭━━━〔 💸 *MONEDAS INSUFICIENTES* 〕━━━╮
┃
┃ Necesitas _S/${formatNumber(PRICE)} ${currency}_
┃ para crear este sticker.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

⛀ *Tu cartera:* _S/${formatNumber(user.coins)} ${currency}_`)
}

      const media = await source.download()

      if (!media) {
        return m.reply('❌ No se pudo descargar la imagen o video.')
      }

      let ext = 'jpg'
      let isVideo = false

      if (/video/i.test(mime)) {
        ext = 'mp4'
        isVideo = true
      } else if (/webp/i.test(mime)) {
        ext = 'webp'
      } else if (/png/i.test(mime)) {
        ext = 'png'
      } else {
        ext = 'jpg'
      }

      await processMedia(client, m, media, {
        ext,
        isVideo,
        square,
        packName
      })

      if (!ownerUnlimited) {
  user.coins -= PRICE
}

const walletText = ownerUnlimited ? '∞' : formatNumber(user.coins)

return m.reply(`╭━━━〔 ✅ *STICKER CREADO* 〕━━━╮
┃ 🏷️ *Nombre:* _${packName}_
┃ 💰 *Costo:* _S/${formatNumber(PRICE)} ${currency}_
┃ ⛀ *Cartera:* _S/${walletText} ${currency}_
╰━━━━━━━━━━━━━━━━━━━━━━╯

✨ _Sticker creado sin marca de RubyJX._`)
    } catch (e) {
      console.error(e)
      return m.reply(`❌ Error al crear sticker:

${e.message}`)
    }
  }
}