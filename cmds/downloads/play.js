import yts from 'yt-search'
import fetch from 'node-fetch'
import chalk from 'chalk'
import gradient from 'gradient-string'
import { getBuffer } from '../../core/message.js'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function logPlay(type, msg) {
  const tag =
    type === 'ok' ? chalk.bgGreen.black(' PLAY ') :
    type === 'warn' ? chalk.bgYellow.black(' PLAY ') :
    type === 'err' ? chalk.bgRed.white(' PLAY ') :
    chalk.bgBlue.white(' PLAY ')

  const colored =
    type === 'ok' ? gradient('green', 'cyan')(msg) :
    type === 'warn' ? gradient('yellow', 'orange')(msg) :
    type === 'err' ? gradient('red', 'magenta')(msg) :
    gradient('cyan', 'blue')(msg)

  console.log(tag, colored)
}

async function safeFetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, { signal: controller.signal })
    const raw = await res.text()

    try {
      return JSON.parse(raw)
    } catch {
      throw new Error(`Respuesta no JSON: ${raw.slice(0, 120)}`)
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function getVideoInfo(query, videoMatch) {
  const search = await yts(query)
  if (!search.all.length) return null
  const videoInfo = videoMatch
    ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0]
    : search.all[0]
  return videoInfo || null
}

function buildPrimaryApi(url) {
  return {
    api: 'Ootaizumi v2',
    endpoint: `${global.APIs.ootaizumi.url}/downloader/youtube?url=${encodeURIComponent(url)}&format=mp3`,
    extractor: res => res?.result?.download
  }
}

function buildFallbackApis(url) {
  return [
    { api: 'Ootaizumi', endpoint: `${global.APIs.ootaizumi.url}/downloader/youtube/play?query=${encodeURIComponent(url)}`, extractor: res => res?.result?.download },
    { api: 'Vreden', endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=256`, extractor: res => res?.result?.download?.url },
    { api: 'Vreden v2', endpoint: `${global.APIs.vreden.url}/api/v1/download/play/audio?query=${encodeURIComponent(url)}`, extractor: res => res?.result?.download?.url },
    { api: 'Axi', endpoint: `${global.APIs.axi.url}/down/ytaudio?url=${encodeURIComponent(url)}`, extractor: res => res?.resultado?.url_dl },
    { api: 'Stellar', endpoint: `${global.APIs.stellar.url}/dl/ytdl?url=${encodeURIComponent(url)}&format=mp3&key=${global.APIs.stellar.key}`, extractor: res => res?.result?.download },
    { api: 'Nekolabs', endpoint: `${global.APIs.nekolabs.url}/downloader/youtube/v1?url=${encodeURIComponent(url)}&format=mp3`, extractor: res => res?.result?.downloadUrl },
    { api: 'Nekolabs v2', endpoint: `${global.APIs.nekolabs.url}/downloader/youtube/play/v1?q=${encodeURIComponent(url)}`, extractor: res => res?.result?.downloadUrl }
  ]
}

async function getAudioLinkFocused(url, state) {
  const primary = buildPrimaryApi(url)

  while (true) {
    state.logs++
    if (state.logs >= state.maxLogs) {
      throw new Error(`Se canceló por exceso de intentos en consola (${state.logs} logs)`)
    }

    const elapsed = Date.now() - state.startedAt
    if (elapsed >= state.maxMs) {
      throw new Error(`Se canceló por tardar demasiado (${Math.floor(elapsed / 1000)}s)`)
    }

    try {
      logPlay('info', `Probando API principal: ${primary.api} | log ${state.logs}/${state.maxLogs}`)
      const res = await safeFetchJson(primary.endpoint, 12000)
      const link = primary.extractor(res)

      if (link) {
        logPlay('ok', `API principal válida encontrada: ${primary.api}`)
        return { url: link, api: primary.api }
      }

      logPlay('warn', `${primary.api} respondió sin enlace útil`)
    } catch (e) {
      logPlay('warn', `Falló ${primary.api}: ${e.message}`)
    }

    state.primaryRetries++

    // Cada 25 intentos fallidos, prueba fallback una sola ronda
    if (state.allowFallback && state.primaryRetries % 25 === 0) {
      logPlay('warn', `La API principal falló ${state.primaryRetries} veces. Probando fallback de emergencia...`)
      const fallbacks = buildFallbackApis(url)

      for (const { api, endpoint, extractor } of fallbacks) {
        state.logs++
        if (state.logs >= state.maxLogs) {
          throw new Error(`Se canceló por exceso de intentos en consola (${state.logs} logs)`)
        }

        const elapsed2 = Date.now() - state.startedAt
        if (elapsed2 >= state.maxMs) {
          throw new Error(`Se canceló por tardar demasiado (${Math.floor(elapsed2 / 1000)}s)`)
        }

        try {
          logPlay('info', `Probando fallback: ${api} | log ${state.logs}/${state.maxLogs}`)
          const res = await safeFetchJson(endpoint, 12000)
          const link = extractor(res)

          if (link) {
            logPlay('ok', `Fallback válido encontrado: ${api}`)
            return { url: link, api }
          }

          logPlay('warn', `Fallback ${api} respondió sin enlace útil`)
        } catch (e) {
          logPlay('warn', `Falló fallback ${api}: ${e.message}`)
        }

        await sleep(900)
      }
    }

    await sleep(1800)
  }
}

async function getAudioBufferPersistent(url, state) {
  let localTry = 0

  while (true) {
    localTry++
    state.logs++

    if (state.logs >= state.maxLogs) {
      throw new Error(`Se canceló por exceso de intentos en consola (${state.logs} logs)`)
    }

    const elapsed = Date.now() - state.startedAt
    if (elapsed >= state.maxMs) {
      throw new Error(`Se canceló por tardar demasiado (${Math.floor(elapsed / 1000)}s)`)
    }

    try {
      logPlay('info', `Descargando audio buffer... intento ${localTry}`)
      const buffer = await getBuffer(url)

      if (buffer && Buffer.isBuffer(buffer) && buffer.length > 1024) {
        logPlay('ok', `Buffer de audio obtenido correctamente en intento ${localTry}`)
        return buffer
      }

      throw new Error('Buffer vacío o inválido')
    } catch (e) {
      logPlay('warn', `No se pudo obtener el buffer en intento ${localTry}: ${e.message}`)
      await sleep(Math.min(2000 + localTry * 400, 8000))
    }
  }
}

async function sendAudioPersistent(client, chatId, audioBuffer, title, quoted, state) {
  let sendTry = 0

  while (true) {
    sendTry++
    state.logs++

    if (state.logs >= state.maxLogs) {
      throw new Error(`Se canceló por exceso de intentos en consola (${state.logs} logs)`)
    }

    const elapsed = Date.now() - state.startedAt
    if (elapsed >= state.maxMs) {
      throw new Error(`Se canceló por tardar demasiado (${Math.floor(elapsed / 1000)}s)`)
    }

    try {
      logPlay('info', `Enviando audio... intento ${sendTry}`)

      await client.sendMessage(
        chatId,
        {
          audio: audioBuffer,
          fileName: `${title || 'audio'}.mp3`,
          mimetype: 'audio/mpeg',
          ptt: false
        },
        { quoted }
      )

      logPlay('ok', `Audio enviado correctamente en intento ${sendTry}`)
      return true
    } catch (e) {
      logPlay('warn', `Fallo enviando audio en intento ${sendTry}: ${e.message}`)
      await sleep(Math.min(2500 + sendTry * 500, 10000))
    }
  }
}

export default {
  command: ['play', 'mp3', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloader',

  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0]) {
        return m.reply('《✧》Por favor, menciona el nombre o URL del video que deseas descargar')
      }

      const text = args.join(' ')
      const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
      const query = videoMatch ? 'https://youtu.be/' + videoMatch[1] : text

      let url = query
      let title = 'audio'
      let thumbBuffer = null

      const state = {
        logs: 0,
        startedAt: Date.now(),
        maxLogs: 500,
        maxMs: 1000 * 60 * 20,
        primaryRetries: 0,
        allowFallback: true // cambia a false si quieres SOLO Ootaizumi v2 sin emergencia
      }

      try {
        const videoInfo = await getVideoInfo(query, videoMatch)
        if (videoInfo) {
          url = videoInfo.url
          title = videoInfo.title || 'audio'
          thumbBuffer = await getBuffer(videoInfo.image).catch(() => null)

          const vistas = (videoInfo.views || 0).toLocaleString()
          const canal = videoInfo.author?.name || 'Desconocido'

          const infoMessage = `➩ Descargando › ${title}

> ❖ Canal › *${canal}*
> ⴵ Duración › *${videoInfo.timestamp || 'Desconocido'}*
> ❀ Vistas › *${vistas}*
> ✩ Publicado › *${videoInfo.ago || 'Desconocido'}*
> ❒ Enlace › *${url}*`

          if (thumbBuffer) {
            await client.sendMessage(m.chat, { image: thumbBuffer, caption: infoMessage }, { quoted: m })
          } else {
            await m.reply(infoMessage)
          }
        }
      } catch (err) {
        logPlay('warn', `No se pudo obtener info previa del video: ${err.message}`)
      }

      const audio = await getAudioLinkFocused(url, state)
      logPlay('ok', `Fuente final de audio: ${audio.api}`)

      const audioBuffer = await getAudioBufferPersistent(audio.url, state)
      await sendAudioPersistent(client, m.chat, audioBuffer, title, m, state)

      const totalSec = Math.floor((Date.now() - state.startedAt) / 1000)
      logPlay('ok', `Proceso completado. Logs usados: ${state.logs}. Tiempo total: ${totalSec}s`)
    } catch (e) {
      logPlay('err', `Error final en play: ${e.message}`)
      await m.reply(
        `No pude enviar el audio después de muchísimos intentos.\n\n` +
        `Motivo final: ${e.message}`
      )
    }
  }
}