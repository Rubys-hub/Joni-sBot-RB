import yts from 'yt-search'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getBuffer } from '../../core/message.js'

const TMP_DIR = './tmp'

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

function cleanFileName(name = 'video') {
  return String(name)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'video'
}

function getYouTubeId(text = '') {
  const match = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

async function getVideoInfo(query, videoId) {
  const search = await yts(query)

  if (!search?.videos?.length && !search?.all?.length) return null

  if (videoId) {
    const exact = search.videos?.find(v => v.videoId === videoId)
    if (exact) return exact
  }

  return search.videos?.[0] || search.all?.[0] || null
}

function runCommand(cmd, timeout = 10 * 60 * 1000) {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      {
        maxBuffer: 1024 * 1024 * 50,
        timeout
      },
      (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr || error.message))
        }

        resolve({ stdout, stderr })
      }
    )
  })
}

async function downloadVideoYTDLP(url, title = 'video') {
  const safeTitle = cleanFileName(title)
  const baseName = `video_${Date.now()}_${safeTitle}`
  const rawPath = path.join(TMP_DIR, `${baseName}_raw.mp4`)
  const finalPath = path.join(TMP_DIR, `${baseName}_wa.mp4`)

  const cookies = fs.existsSync('./cookies.txt') ? '--cookies cookies.txt' : ''

  const cmdDownload = `yt-dlp ${cookies} --no-playlist --remote-components ejs:github --js-runtimes node --force-ipv4 --no-cache-dir --user-agent "Mozilla/5.0" -f "bestvideo[vcodec^=avc1][ext=mp4][height<=720]+bestaudio[acodec^=mp4a][ext=m4a]/best[vcodec^=avc1][acodec^=mp4a][ext=mp4][height<=720]/best[ext=mp4][height<=720]/best" --merge-output-format mp4 -o "${rawPath}" "${url}"`

  await runCommand(cmdDownload)

  if (!fs.existsSync(rawPath)) {
    throw new Error('No se generó el archivo de video')
  }

  const cmdConvert = `ffmpeg -y -i "${rawPath}" -map 0:v:0 -map 0:a:0? -c:v libx264 -preset veryfast -profile:v baseline -level 3.1 -pix_fmt yuv420p -vf "scale='min(720,iw)':-2" -c:a aac -b:a 128k -ar 44100 -movflags +faststart "${finalPath}"`

  await runCommand(cmdConvert)

  if (!fs.existsSync(finalPath)) {
    throw new Error('No se pudo convertir el video para WhatsApp')
  }

  try {
    if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath)
  } catch {}

  return finalPath
}

export default {
  command: ['play2', 'mp4', 'ytmp4', 'ytvideo', 'playvideo'],
  category: 'downloader',

  run: async (client, m, args, usedPrefix, command) => {
    let filePath = null

    try {
      await client.sendMessage(m.chat, {
        react: {
          text: '⏳',
          key: m.key
        }
      })

      if (!args[0]) {
        return m.reply(`《✧》Ingresa el nombre o link del video

Ejemplo:
${usedPrefix + command} bad bunny monaco

O también:
${usedPrefix + command} https://youtu.be/xxxxxxx`)
      }

      const text = args.join(' ')
      const videoId = getYouTubeId(text)
      const query = videoId ? `https://youtu.be/${videoId}` : text

      const videoInfo = await getVideoInfo(query, videoId)

      if (!videoInfo || !videoInfo.url) {
        return m.reply('❌ No se encontró un video válido.')
      }

      const url = videoInfo.url
      const title = videoInfo.title || 'video'
      const thumbBuffer = await getBuffer(videoInfo.image).catch(() => null)

      const info = `➩ Descargando video › *${title}*

> ❖ Canal › *${videoInfo.author?.name || 'Desconocido'}*
> ⴵ Duración › *${videoInfo.timestamp || 'Desconocido'}*
> ❀ Vistas › *${(videoInfo.views || 0).toLocaleString()}*
> ✩ Publicado › *${videoInfo.ago || 'Desconocido'}*
> ❒ Enlace › *${url}*`

      if (thumbBuffer) {
        await client.sendMessage(
          m.chat,
          {
            image: thumbBuffer,
            caption: info
          },
          {
            quoted: m
          }
        )
      } else {
        await m.reply(info)
      }

      await m.reply('⏳ Descargando y convirtiendo video para WhatsApp móvil...')

      filePath = await downloadVideoYTDLP(url, title)

      const stats = fs.statSync(filePath)
      const sizeMB = stats.size / 1024 / 1024

      if (sizeMB > 95) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

        await client.sendMessage(m.chat, {
          react: {
            text: '⚠️',
            key: m.key
          }
        })

        return m.reply(`⚠️ El video pesa demasiado para enviarlo por WhatsApp.

Peso aproximado: *${sizeMB.toFixed(2)} MB*

Prueba con un video más corto o usa otro enlace.`)
      }

      const buffer = fs.readFileSync(filePath)

      await client.sendMessage(
        m.chat,
        {
          video: buffer,
          fileName: `${cleanFileName(title)}.mp4`,
          mimetype: 'video/mp4',
          caption: `✅ Video descargado correctamente\n\n*${title}*`
        },
        {
          quoted: m
        }
      )

      await client.sendMessage(m.chat, {
        react: {
          text: '🎬',
          key: m.key
        }
      })

    } catch (e) {
      console.error(e)

      await client.sendMessage(m.chat, {
        react: {
          text: '❌',
          key: m.key
        }
      }).catch(() => {})

      await m.reply(`❌ Error al descargar el video:

${e.message}`)
    } finally {
      try {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch {}
    }
  }
}