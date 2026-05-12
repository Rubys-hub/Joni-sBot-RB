import yts from 'yt-search'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getBuffer } from '../../core/message.js'

// 📁 asegúrate de que exista ./tmp
const TMP_DIR = './tmp'
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR)

// ⏳ util
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


// 🎧 descargar con yt-dlp
function downloadAudioYTDLP(url) {
  return new Promise((resolve, reject) => {
    const fileName = `audio_${Date.now()}.mp3`
    const filePath = path.join(TMP_DIR, fileName)

const cmd = `yt-dlp --cookies cookies.txt --no-playlist --remote-components ejs:github --js-runtimes node --force-ipv4 --no-cache-dir --user-agent "Mozilla/5.0" -f "bestaudio[ext=m4a]/bestaudio/best" -x --audio-format mp3 --audio-quality 0 -o "${filePath}" "${url}"`
exec(cmd, (error, stdout, stderr) => {
    if (error) {
  console.log('YT-DLP STDERR:', stderr)
  return reject(new Error(stderr || error.message))
}

      if (!fs.existsSync(filePath)) {
        return reject(new Error('No se generó el archivo de audio'))
      }

      resolve(filePath)
    })
  })
}

// 🔎 info del video
async function getVideoInfo(query, videoMatch) {
  const search = await yts(query)
  if (!search.all.length) return null

  const videoInfo = videoMatch
    ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0]
    : search.all[0]

  return videoInfo || null
}

export default {
  command: ['play', 'mp3', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloader',

  run: async (client, m, args) => {
  try {

  
  
  
await client.sendMessage(m.chat, {
  react: {
    text: '⏳',
    key: m.key
  }
})

    if (!args[0]) {
      return m.reply('《✧》Ingresa nombre o link del video')
    }

    const text = args.join(' ')
    const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/)
    const query = videoMatch ? 'https://youtu.be/' + videoMatch[1] : text

    let url = null
    let title = 'audio'
    let thumbBuffer = null

    // 🔎 obtener info SIEMPRE
    const videoInfo = await getVideoInfo(query, videoMatch)

    if (!videoInfo || !videoInfo.url) {
      return m.reply('❌ No se encontró un video válido')
    }

    // 🔥 AQUÍ SE DEFINE BIEN
    url = videoInfo.url
    title = videoInfo.title || 'audio'

    thumbBuffer = await getBuffer(videoInfo.image).catch(() => null)

    const info = `➩ Descargando › ${title}

> ❖ Canal › ${videoInfo.author?.name || 'Desconocido'}
> ⴵ Duración › ${videoInfo.timestamp || 'Desconocido'}
> ❀ Vistas › ${(videoInfo.views || 0).toLocaleString()}
> ❒ Enlace › ${url}`

    if (thumbBuffer) {
      await client.sendMessage(
        m.chat,
        { image: thumbBuffer, caption: info },
        { quoted: m }
      )
    } else {
      await m.reply(info)
    }

    console.log('URL FINAL:', url)

    await m.reply('⏳ Descargando audio...')

    const filePath = await downloadAudioYTDLP(url)

    const buffer = fs.readFileSync(filePath)

    await client.sendMessage(
      m.chat,
      {
        audio: buffer,
        fileName: `${title}.mp3`,
        mimetype: 'audio/mpeg'
      },
      { quoted: m }
    )

    await client.sendMessage(m.chat, {
  react: {
    text: '🎶',
    key: m.key
  }
})


    fs.unlinkSync(filePath)

  } catch (e) {
    console.error(e)
    await m.reply(`❌ Error: ${e.message}`)
  }
}
}