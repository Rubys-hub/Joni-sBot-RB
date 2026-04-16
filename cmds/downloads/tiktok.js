import fetch from 'node-fetch'

export default {
  command: ['tiktok', 'tt', 'tiktoksearch', 'ttsearch', 'tts'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args.length) {
      return m.reply('《✧》 Por favor, ingresa un término de búsqueda o enlace de TikTok.')
    }

    const text = args.join(' ').trim()
    const isUrl = /(?:https?:\/\/)?(?:www\.)?(?:vm|vt|t)?\.?tiktok\.com\/([^\s&]+)/i.test(text)

    try {
      const json = await getTikTokDataSafe(text, isUrl)

      if (!json) {
        return m.reply('《✧》 No se pudo obtener contenido de TikTok. La API puede estar limitada temporalmente.')
      }

      if (isUrl) {
        const data = json.data || json.result || {}
        const dl = data.dl || data.url || data.play || data.hdplay || data.download
        const title = data.title || 'Sin título'
        const duration = data.duration || 'N/A'
        const author = data.author || {}
        const stats = data.stats || {}
        const created_at = data.created_at || data.date || 'N/A'
        const type = data.type || 'video'

        if (!dl || (Array.isArray(dl) && dl.length === 0)) {
          return m.reply('《✧》 Enlace inválido o sin contenido descargable.')
        }

        const caption = `ㅤ۟∩　ׅ　★ ໌　ׅ　🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload　ׄᰙ

𖣣ֶㅤ֯⌗ ✎  ׄ ⬭ *Título:* ${title}
𖣣ֶㅤ֯⌗ ⌬  ׄ ⬭ *Autor:* ${author?.nickname || author?.unique_id || 'Desconocido'}
𖣣ֶㅤ֯⌗ ⴵ  ׄ ⬭ *Duración:* ${duration}
𖣣ֶㅤ֯⌗ ❖  ׄ ⬭ *Likes:* ${(stats?.likes || stats?.digg_count || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ❀  ׄ ⬭ *Comentarios:* ${(stats?.comments || stats?.comment_count || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ✿  ׄ ⬭ *Vistas:* ${(stats?.views || stats?.plays || stats?.play_count || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Compartidos:* ${(stats?.shares || stats?.share_count || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ☁︎  ׄ ⬭ *Fecha:* ${created_at}`.trim()

        if (type === 'image' && Array.isArray(dl)) {
          const medias = dl
            .filter(url => typeof url === 'string' && url.startsWith('http'))
            .map(url => ({ type: 'image', data: { url }, caption }))

          if (!medias.length) return m.reply('《✧》 No se encontraron imágenes válidas.')

          await client.sendAlbumMessage(m.chat, medias, { quoted: m })
          return
        }

        const videoUrl = Array.isArray(dl) ? dl[0] : dl
        await client.sendMessage(
          m.chat,
          { video: { url: videoUrl }, caption, mimetype: 'video/mp4', fileName: 'tiktok.mp4' },
          { quoted: m }
        )
        return
      }

      const list = json.data || json.result || json.results || []
      const validResults = list.filter(v => {
        const url =
          v?.dl ||
          v?.url ||
          v?.play ||
          v?.video ||
          v?.media

        return typeof url === 'string' && url.startsWith('http')
      })

      if (!validResults.length) {
        return m.reply('《✧》 No se encontraron resultados válidos.')
      }

      const medias = validResults.slice(0, 10).map(v => {
        const mediaUrl =
          v?.dl ||
          v?.url ||
          v?.play ||
          v?.video ||
          v?.media

        const caption = `ㅤ۟∩　ׅ　★ ໌　ׅ　🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload　ׄᰙ

𖣣ֶㅤ֯⌗ ✎  ׄ ⬭ *Título:* ${v.title || 'Sin título'}
𖣣ֶㅤ֯⌗ ⌬  ׄ ⬭ *Autor:* ${v.author?.nickname || 'Desconocido'} ${v.author?.unique_id ? `@${v.author.unique_id}` : ''}
𖣣ֶㅤ֯⌗ ⴵ  ׄ ⬭ *Duración:* ${v.duration || 'N/A'}
𖣣ֶㅤ֯⌗ ❖  ׄ ⬭ *Likes:* ${(v.stats?.likes || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ❀  ׄ ⬭ *Comentarios:* ${(v.stats?.comments || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ✿  ׄ ⬭ *Vistas:* ${(v.stats?.views || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ☆  ׄ ⬭ *Compartidos:* ${(v.stats?.shares || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ ❒  ׄ ⬭ *Audio:* ${v.music?.title || `[${v.author?.nickname || 'No disponible'}] original sound - ${v.author?.unique_id || 'unknown'}`}`.trim()

        return {
          type: 'video',
          data: { url: mediaUrl },
          caption
        }
      }).filter(x => typeof x?.data?.url === 'string' && x.data.url.startsWith('http'))

      if (!medias.length) {
        return m.reply('《✧》 La API respondió, pero sin videos válidos.')
      }

      if (medias.length === 1) {
        await client.sendMessage(
          m.chat,
          {
            video: { url: medias[0].data.url },
            caption: medias[0].caption,
            mimetype: 'video/mp4',
            fileName: 'tiktok.mp4'
          },
          { quoted: m }
        )
        return
      }

      await client.sendAlbumMessage(m.chat, medias, { quoted: m })

    } catch (e) {
      await m.reply(
        `> Error en *${usedPrefix + command}*\n` +
        `> [${e.message}]`
      )
    }
  }
}

async function getTikTokDataSafe(text, isUrl) {
  const endpoints = isUrl
    ? [
        `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`,
        `${global.APIs.stellar.url}/dl/tiktok?url=${encodeURIComponent(text)}&key=${global.APIs.stellar.key}`
      ]
    : [
        `https://delirius-apiofc.vercel.app/search/tiktok?query=${encodeURIComponent(text)}`,
        `${global.APIs.stellar.url}/search/tiktok?query=${encodeURIComponent(text)}&key=${global.APIs.stellar.key}`
      ]

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
          if (json?.data?.play || json?.data?.hdplay) {
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
                type: 'video',
                dl: json.data.hdplay || json.data.play
              }
            }
          }
        } else if (json?.status && json?.data) {
          return json
        }
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