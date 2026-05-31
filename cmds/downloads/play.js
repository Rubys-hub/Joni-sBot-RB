import yts from 'yt-search'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getBuffer } from '../../core/message.js'


const TMP_DIR = './tmp'
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


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


function convertToVoiceNote(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.mp3$/i, '.ogg')

    const cmd = `ffmpeg -y -i "${inputPath}" -vn -ac 1 -ar 48000 -c:a libopus -b:a 64k "${outputPath}"`

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log('FFMPEG STDERR:', stderr)
        return reject(new Error(stderr || error.message))
      }

      if (!fs.existsSync(outputPath)) {
        return reject(new Error('No se generó la nota de voz'))
      }

      resolve(outputPath)
    })
  })
}


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
    let filePath = null
    let voicePath = null

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

      
      const videoInfo = await getVideoInfo(query, videoMatch)

      if (!videoInfo || !videoInfo.url) {
        return m.reply('❌ No se encontró un video válido')
      }

      
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

      filePath = await downloadAudioYTDLP(url)
      voicePath = await convertToVoiceNote(filePath)

      
      await client.sendPresenceUpdate('recording', m.chat).catch(() => {})
      await sleep(2500)
      await client.sendPresenceUpdate('paused', m.chat).catch(() => {})

      
      await client.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync(voicePath),
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true
        },
        { quoted: m }
      )

      await client.sendMessage(m.chat, {
        react: {
          text: '🎶',
          key: m.key
        }
      })
    } catch (e) {
      console.error(e)
      await m.reply(`❌ Error: ${e.message}`)
    } finally {
      if (voicePath && fs.existsSync(voicePath)) fs.unlinkSync(voicePath)
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  }
}