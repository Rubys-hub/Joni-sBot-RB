import fetch from 'node-fetch'

export default {
  command: ['tiktok', 'tt', 'tiktoksearch', 'ttsearch', 'tts'],
  category: 'downloader',

  run: async (client, m, args, usedPrefix, command) => {
    if (!args.length) {
      return m.reply(`╭━━━〔 🎶 *TIKTOK* 〕━━━╮
┃
┃ Ingresa un enlace o búsqueda.
┃
┃ 📌 *Ejemplos:*
┃ ➤ *${usedPrefix + command} https://vm.tiktok.com/...*
┃ ➤ *${usedPrefix + command} gatitos graciosos*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    const text = args.join(' ').trim()
    const isUrl = /(?:https?:\/\/)?(?:www\.)?(?:vm|vt|t)?\.?tiktok\.com\/([^\s&]+)/i.test(text)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings?.[botId] || {}
    const brandName = botSettings.namebot || botSettings.botname || 'RubyJX'

    try {
      await m.react?.('🕒')

      const json = await getTikTokDataSafe(text, isUrl)

      if (!json) {
        await m.react?.('❌')
        return m.reply('《✧》 No se pudo obtener contenido de TikTok. Intenta nuevamente.')
      }

      if (isUrl) {
        const data = json.data || json.result || {}

        const title = data.title || 'Sin título'
        const duration = data.duration || 'N/A'
        const author = data.author || {}
        const stats = data.stats || {}
        const created_at = data.created_at || data.date || 'N/A'
        const type = data.type || 'video'

        const caption = `> 𖧧 *${brandName}* 🎶
> TikTok descargado correctamente ✨

╭━━━〔 🎬 *TIKTOK DOWNLOAD* 〕━━━╮
┃ 🎵 *Título:* ${title}
┃ 👤 *Autor:* ${author?.nickname || author?.unique_id || author?.name || 'Desconocido'}
┃ ⏱️ *Duración:* ${duration}
┃ ❤️ *Likes:* ${(stats?.likes || stats?.digg_count || 0).toLocaleString()}
┃ 👁️ *Vistas:* ${(stats?.views || stats?.plays || stats?.play_count || 0).toLocaleString()}
╰━━━━━━━━━━━━━━━━━━━━━━╯

⚡ *Powered by ${brandName}*`.trim()

        if (type === 'image') {
          const imageUrls = normalizeImageUrls(data)

          if (!imageUrls.length) {
            await m.react?.('❌')
            return m.reply('《✧》 No se encontraron imágenes válidas.')
          }

          const medias = imageUrls.map(url => ({
            type: 'image',
            data: { url },
            caption
          }))

          await client.sendAlbumMessage(m.chat, medias, { quoted: m })
          await m.react?.('✅')
          return
        }

        const videoCandidates = getVideoCandidates(data)

        if (!videoCandidates.length) {
          await m.react?.('❌')
          return m.reply('《✧》 Enlace inválido o sin video descargable.')
        }

        const video = await getFirstValidVideoBuffer(videoCandidates)

        if (!video?.buffer) {
          await m.react?.('❌')
          return m.reply(`╭━━━〔 ❌ *VIDEO NO DISPONIBLE* 〕━━━╮
┃
┃ La API devolvió enlaces, pero ninguno
┃ pudo descargarse como video válido.
┃
┃ 📌 Intenta nuevamente o usa otro enlace.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
        }

        await client.sendMessage(
          m.chat,
          {
            video: video.buffer,
            caption,
            mimetype: 'video/mp4',
            fileName: 'tiktok.mp4'
          },
          { quoted: m }
        )

        await m.react?.('✅')
        return
      }

      const list = json.data || json.result || json.results || []

      const validResults = list
        .map(v => ({
          raw: v,
          url: pickSearchVideoUrl(v)
        }))
        .filter(v => typeof v.url === 'string' && v.url.startsWith('http'))

      if (!validResults.length) {
        await m.react?.('❌')
        return m.reply('《✧》 No se encontraron resultados válidos.')
      }

      const first = validResults[0]
      const v = first.raw

      const caption = `> 𖧧 *${brandName}* 🔎
> Resultado encontrado en TikTok ✨

╭━━━〔 🎬 *TIKTOK SEARCH* 〕━━━╮
┃ 🎵 *Título:* ${v.title || 'Sin título'}
┃ 👤 *Autor:* ${v.author?.nickname || 'Desconocido'} ${v.author?.unique_id ? `@${v.author.unique_id}` : ''}
┃ ⏱️ *Duración:* ${v.duration || 'N/A'}
┃ ❤️ *Likes:* ${(v.stats?.likes || 0).toLocaleString()}
┃ 👁️ *Vistas:* ${(v.stats?.views || 0).toLocaleString()}
╰━━━━━━━━━━━━━━━━━━━━━━╯

⚡ *Powered by ${brandName}*`.trim()

      const video = await getFirstValidVideoBuffer([first.url])

      if (!video?.buffer) {
        await m.react?.('❌')
        return m.reply('《✧》 Encontré resultados, pero el video no pudo descargarse correctamente.')
      }

      await client.sendMessage(
        m.chat,
        {
          video: video.buffer,
          caption,
          mimetype: 'video/mp4',
          fileName: 'tiktok.mp4'
        },
        { quoted: m }
      )

      await m.react?.('✅')

    } catch (e) {
      await m.react?.('❌')
      await m.reply(
        `> Error en *${usedPrefix + command}*\n` +
        `> [${e.message}]`
      )
    }
  }
}

function normalizeTikwmUrl(url = '') {
  if (!url || typeof url !== 'string') return null

  const clean = url.trim()

  if (!clean) return null
  if (clean.startsWith('//')) return `https:${clean}`
  if (clean.startsWith('/')) return `https://www.tikwm.com${clean}`
  if (clean.startsWith('http')) return clean

  return null
}

function getVideoCandidates(data = {}) {
  const raw = [
    data.hdplay,
    data.play,
    data.wmplay,
    data.download,
    data.dl,
    data.url,
    data.video,
    data.media,
    data.nowm,
    data.no_watermark,
    data.noWatermark,
    data.withoutWatermark
  ]

  if (Array.isArray(data.dl)) raw.push(...data.dl)
  if (Array.isArray(data.url)) raw.push(...data.url)
  if (Array.isArray(data.video)) raw.push(...data.video)

  return raw
    .map(normalizeTikwmUrl)
    .filter(Boolean)
    .filter((url, index, arr) => arr.indexOf(url) === index)
}

function normalizeImageUrls(data = {}) {
  const raw = []

  if (Array.isArray(data.images)) raw.push(...data.images)
  if (Array.isArray(data.image)) raw.push(...data.image)
  if (Array.isArray(data.dl)) raw.push(...data.dl)
  if (Array.isArray(data.url)) raw.push(...data.url)

  return raw
    .map(normalizeTikwmUrl)
    .filter(Boolean)
    .filter((url, index, arr) => arr.indexOf(url) === index)
}

function pickSearchVideoUrl(v = {}) {
  return normalizeTikwmUrl(
    v.dl ||
    v.url ||
    v.play ||
    v.video ||
    v.media ||
    v.nowm ||
    v.no_watermark ||
    v.noWatermark ||
    v.withoutWatermark
  )
}

async function getFirstValidVideoBuffer(urls = []) {
  for (const url of urls) {
    try {
      const media = await fetchVideoBuffer(url)

      if (media?.buffer && media.buffer.length > 50 * 1024) {
        return media
      }
    } catch (e) {
      console.log('TIKTOK VIDEO SKIP:', url, e.message)
    }
  }

  return null
}

async function fetchVideoBuffer(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'accept': 'video/mp4,video/*,*/*',
      'referer': 'https://www.tiktok.com/'
    }
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const contentType = res.headers.get('content-type') || ''
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (!buffer || buffer.length < 50 * 1024) {
    throw new Error('Video vacío o demasiado pequeño')
  }

  const looksLikeMp4 =
    buffer.slice(4, 8).toString() === 'ftyp' ||
    contentType.includes('video') ||
    contentType.includes('octet-stream')

  if (!looksLikeMp4) {
    throw new Error(`Respuesta no parece video: ${contentType || 'sin content-type'}`)
  }

  return {
    buffer,
    contentType
  }
}

function getStellarTikTokDlEndpoint(text) {
  const url = global.APIs?.stellar?.url
  const key = global.APIs?.stellar?.key

  if (!url || !key) return null

  return `${url}/dl/tiktok?url=${encodeURIComponent(text)}&key=${key}`
}

function getStellarTikTokSearchEndpoint(text) {
  const url = global.APIs?.stellar?.url
  const key = global.APIs?.stellar?.key

  if (!url || !key) return null

  return `${url}/search/tiktok?query=${encodeURIComponent(text)}&key=${key}`
}

async function getTikTokDataSafe(text, isUrl) {
  const endpoints = isUrl
    ? [
        `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`,
        getStellarTikTokDlEndpoint(text)
      ].filter(Boolean)
    : [
        `https://delirius-apiofc.vercel.app/search/tiktok?query=${encodeURIComponent(text)}`,
        getStellarTikTokSearchEndpoint(text)
      ].filter(Boolean)

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          'user-agent': 'Mozilla/5.0',
          'accept': 'application/json,text/plain,*/*'
        }
      })

      if (res.status === 429) continue
      if (!res.ok) continue

      const json = await res.json()
      console.log('TIKTOK API OK:', endpoint, JSON.stringify(json).slice(0, 500))

      if (isUrl) {
        if (endpoint.includes('tikwm')) {
          const imageList =
            json?.data?.images ||
            json?.data?.image ||
            []

          const hasImages = Array.isArray(imageList) && imageList.length
          const hasVideo = json?.data?.play || json?.data?.hdplay || json?.data?.wmplay

          if (hasVideo || hasImages) {
            return {
              data: {
                title: json.data.title || 'Sin título',
                duration: json.data.duration || 'N/A',
                author: json.data.author || {},
                stats: {
                  likes: json.data.digg_count || 0,
                  comments: json.data.comment_count || 0,
                  shares: json.data.share_count || 0,
                  views: json.data.play_count || 0
                },
                created_at: json.data.create_time || 'N/A',
                type: hasImages ? 'image' : 'video',
                hdplay: normalizeTikwmUrl(json.data.hdplay),
                play: normalizeTikwmUrl(json.data.play),
                wmplay: normalizeTikwmUrl(json.data.wmplay),
                images: hasImages
                  ? imageList.map(normalizeTikwmUrl).filter(Boolean)
                  : []
              }
            }
          }
        }

        if (json?.status && json?.data) return json
        if (json?.data || json?.result) return json
      } else {
        if (Array.isArray(json?.data) && json.data.length) return json
        if (Array.isArray(json?.result) && json.result.length) return json
        if (Array.isArray(json?.results) && json.results.length) return json
      }
    } catch (e) {
      console.log('TIKTOK API ERROR:', endpoint, e.message)
    }
  }

  console.log('TIKTOK API FAIL: ninguna API devolvió datos válidos')
  return null
}