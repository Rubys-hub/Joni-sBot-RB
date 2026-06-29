import axios from 'axios'
import fetch from 'node-fetch'

const API_BASE = 'https://www.tikwm.com/api'
const NORMAL_USER_PRICE = 1_000_000

const OWNER_COOLDOWN_PER_UNIT_MS = 30 * 1000
const USER_COOLDOWN_PER_UNIT_MS = 60 * 1000

const PREVIEW_EXPIRE_MS = 10 * 60 * 1000
const MAX_POSTS_PREVIEW = 120
const MAX_SEND_PER_RUN = 80

function nowTag() {
  return new Date().toISOString().replace('T', ' ').split('.')[0]
}

function logInfo(...args) {
  console.log(`[${nowTag()}] [INFO]`, ...args)
}

function logWarn(...args) {
  console.warn(`[${nowTag()}] [WARN]`, ...args)
}

function logError(...args) {
  console.error(`[${nowTag()}] [ERROR]`, ...args)
}

function logHttp(...args) {
  console.log(`[${nowTag()}] [HTTP]`, ...args)
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('es-PE')
}

function bytesToSize(bytes, decimals = 2) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function msToHuman(ms = 0) {
  const sec = Math.ceil(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m <= 0) return `${s}s`
  return `${m}m ${s}s`
}

function isTikTokUrl(text = '') {
  return /(?:https?:\/\/)?(?:www\.)?(?:vm|vt|t)?\.?tiktok\.com\/([^\s&]+)/i.test(String(text).trim())
}

function cleanUsername(input = '') {
  return String(input || '')
    .trim()
    .replace(/^[@\s]+/, '')
    .replace(/^([./#!]\w+)\s+/i, '')
    .replace(/^tiktok\s+/i, '')
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@/i, '')
    .replace(/\/.*$/, '')
    .trim()
}

function extractInput(text = '', usedPrefix = '.', command = 'ttad') {
  let raw = String(text || '').trim()
  if (!raw) return ''

  const escapedPrefix = String(usedPrefix || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedCommand = String(command || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  raw = raw.replace(new RegExp(`^${escapedPrefix}${escapedCommand}\\s*`, 'i'), '').trim()
  raw = raw.replace(new RegExp(`^${escapedCommand}\\s+`, 'i'), '').trim()

  return raw
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

function resolveMessageTarget(m, client) {
  return (
    m?.chat ||
    m?.key?.remoteJid ||
    m?.msg?.contextInfo?.remoteJid ||
    m?.sender ||
    m?.key?.participant ||
    client?.lastChatId ||
    ''
  )
}

async function safeLoadingReply(m, client, text = 'Procesando...') {
  try {
    const target = resolveMessageTarget(m, client)

    if (typeof m?.reply === 'function' && (m?.chat || m?.key?.remoteJid || m?.sender)) {
      logInfo('safeLoadingReply via m.reply')
      return await m.reply(text)
    }

    if (target && typeof client?.sendMessage === 'function') {
      logInfo('safeLoadingReply via client.sendMessage', target)
      return await client.sendMessage(target, { text: String(text || '') }, { quoted: m })
    }

    logWarn('safeLoadingReply sin destino disponible')
    return null
  } catch (e) {
    logError('safeLoadingReply error', e?.message || e)
    return null
  }
}

async function safeReply(m, client, text) {
  try {
    const target = resolveMessageTarget(m, client)

    if (typeof m?.reply === 'function' && (m?.chat || m?.key?.remoteJid || m?.sender)) {
      logInfo('safeReply via m.reply:', String(text || '').slice(0, 80))
      return await m.reply(text)
    }

    if (target && typeof client?.sendMessage === 'function') {
      logInfo('safeReply via client.sendMessage:', String(text || '').slice(0, 80), target)
      return await client.sendMessage(target, { text: String(text || '') }, { quoted: m })
    }

    logWarn('safeReply sin destino disponible', text)
    return null
  } catch (e) {
    logError('safeReply error', e?.message || e)
    return null
  }
}

async function apiGet(url, params = {}) {
  const start = Date.now()
  try {
    logHttp('GET', url, params)
    const { data } = await axios.get(url, {
      params,
      timeout: 30000,
      headers: {
        'user-agent': 'Mozilla/5.0',
        'accept': 'application/json, text/plain, */*',
        'referer': 'https://www.tikwm.com/'
      }
    })
    logHttp('GET DONE', url, `${Date.now() - start}ms`)
    return data
  } catch (e) {
    logError('HTTP GET ERROR', url, e?.message || e, `${Date.now() - start}ms`)
    throw e
  }
}

async function getContentLength(url) {
  try {
    const res = await axios.head(url, {
      timeout: 20000,
      headers: {
        'user-agent': 'Mozilla/5.0',
        'referer': 'https://www.tikwm.com/'
      },
      maxRedirects: 5,
      validateStatus: () => true
    })

    const len = Number(res.headers?.['content-length'] || 0)
    return Number.isFinite(len) ? len : 0
  } catch (e) {
    logWarn('HEAD fail', url, e?.message || e)
    return 0
  }
}

function getVideoCandidates(data = {}) {
  const raw = [
    data.hdplay,
    data.play,
    data.wmplay,
    data.play_addr,
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
    .filter((url, i, arr) => arr.indexOf(url) === i)
}

function getImageUrls(data = {}) {
  const raw = []

  if (Array.isArray(data.images)) raw.push(...data.images)
  if (Array.isArray(data.image)) raw.push(...data.image)
  if (Array.isArray(data.dl)) raw.push(...data.dl)
  if (Array.isArray(data.url)) raw.push(...data.url)

  return raw
    .map(v => {
      if (typeof v === 'string') return normalizeTikwmUrl(v)
      return normalizeTikwmUrl(
        v?.url_list?.[0] ||
        v?.urlList?.[0] ||
        v?.display_image?.url_list?.[0] ||
        v?.displayImage?.urlList?.[0] ||
        v?.imageURL ||
        v?.url
      )
    })
    .filter(Boolean)
    .filter((url, index, arr) => arr.indexOf(url) === index)
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

  return { buffer, contentType }
}

async function getFirstValidVideoBuffer(urls = []) {
  for (const url of urls) {
    try {
      const media = await fetchVideoBuffer(url)
      if (media?.buffer && media.buffer.length > 50 * 1024) {
        return media
      }
    } catch (e) {
      logWarn('TIKTOK VIDEO SKIP', url, e?.message || e)
    }
  }
  return null
}

async function getTikTokDataByUrl(url) {
  const endpoint = `${API_BASE}/?url=${encodeURIComponent(url)}&hd=1`
  const data = await apiGet(endpoint)

  if (!data?.data) {
    throw new Error(data?.msg || 'TikWM no devolvió data.')
  }

  const imageList = data?.data?.images || data?.data?.image || []
  const hasImages = Array.isArray(imageList) && imageList.length > 0
  const hasVideo = data?.data?.play || data?.data?.hdplay || data?.data?.wmplay

  if (!hasImages && !hasVideo) {
    throw new Error('La URL no devolvió video ni imágenes.')
  }

  return {
    title: data.data.title || 'Sin título',
    duration: data.data.duration || 'N/A',
    author: data.data.author || {},
    stats: {
      likes: data.data.digg_count || 0,
      comments: data.data.comment_count || 0,
      shares: data.data.share_count || 0,
      views: data.data.play_count || 0
    },
    created_at: data.data.create_time || 'N/A',
    type: hasImages ? 'image' : 'video',
    hdplay: normalizeTikwmUrl(data.data.hdplay),
    play: normalizeTikwmUrl(data.data.play),
    wmplay: normalizeTikwmUrl(data.data.wmplay),
    images: hasImages ? imageList.map(normalizeTikwmUrl).filter(Boolean) : []
  }
}

async function getUserPosts(uniqueId, wantedLimit = MAX_POSTS_PREVIEW) {
  let cursor = 0
  let hasMore = true
  const posts = []

  const cleanId = cleanUsername(uniqueId)
  if (!cleanId) throw new Error('Usuario inválido.')

  logInfo('getUserPosts start for', cleanId, 'limit', wantedLimit)

  while (hasMore && posts.length < wantedLimit) {
    const data = await apiGet(`${API_BASE}/user/posts`, {
      unique_id: cleanId,
      count: 35,
      cursor
    }).catch(e => {
      logError('apiGet user/posts failed', e?.message || e)
      return null
    })

    if (!data) {
      throw new Error('Sin respuesta válida de TikWM.')
    }

    if (data.code !== 0 || !data.data) {
      const apiMsg = String(data?.msg || 'Respuesta inválida de TikWM')
      logWarn('No data or error from API for', cleanId, 'raw:', JSON.stringify(data || {}).slice(0, 500))

      if (/unique_id is invalid/i.test(apiMsg)) {
        throw new Error(`TikWM rechazó el usuario @${cleanId}. Prueba con una URL individual del video o con otro username público.`)
      }

      throw new Error(apiMsg)
    }

    const batch = Array.isArray(data.data.videos) ? data.data.videos : []
    posts.push(...batch)

    logInfo('Fetched batch', batch.length, 'total', posts.length)

    hasMore = Boolean(data.data.hasMore)
    cursor = Number(data.data.cursor || 0)

    if (hasMore && posts.length < wantedLimit) {
      await sleep(1200)
    }
  }

  logInfo('getUserPosts finished', posts.length)
  return posts.slice(0, wantedLimit)
}

async function analyzePosts(posts = []) {
  let normalVideos = 0
  let slidePosts = 0
  let totalImages = 0
  let totalBytes = 0

  logInfo('analyzePosts start', posts.length)

  for (const post of posts) {
    const images = getImageUrls(post)

    if (images.length > 0) {
      slidePosts++
      totalImages += images.length

      for (const img of images) {
        totalBytes += await getContentLength(img)
        await sleep(250)
      }
      continue
    }

    const candidates = getVideoCandidates(post)
    if (candidates.length > 0) {
      normalVideos++
      totalBytes += await getContentLength(candidates[0])
      await sleep(250)
    }
  }

  const result = {
    totalPosts: posts.length,
    normalVideos,
    slidePosts,
    totalImages,
    totalBytes
  }

  logInfo('analyzePosts result', result)
  return result
}

function buildPreviewMessage({ username, info, isOwner, price, cooldownPerUnit, expireMs }) {
  return [
    '╭━━━〔 🎵 *TTAD ANALYSIS* 〕━━━╮',
    `┃ 👤 *Cuenta:* @${username}`,
    `┃ 📦 *Publicaciones detectadas:* ${formatNumber(info.totalPosts)}`,
    `┃ 🎬 *Videos normales:* ${formatNumber(info.normalVideos)}`,
    `┃ 🖼️ *Posts con fotos:* ${formatNumber(info.slidePosts)}`,
    `┃ 📸 *Total de fotos:* ${formatNumber(info.totalImages)}`,
    `┃ 💾 *Peso total estimado:* ${bytesToSize(info.totalBytes || 0)}`,
    `┃ ⏱️ *Cooldown por unidad:* ${msToHuman(cooldownPerUnit)}`,
    `┃ 💰 *Costo:* ${isOwner ? 'Gratis (owner)' : `${formatNumber(price)} monedas`}`,
    `┃ 🕒 *Confirmación expira en:* ${msToHuman(expireMs)}`,
    '╰━━━━━━━━━━━━━━━━━━━━━━╯',
    '',
    'Responde *si* sin prefijo para empezar la descarga.',
    'Responde *no* para cancelar.'
  ].join('\n')
}

function buildSingleUrlCaption(username, data, botName = 'RubyJX') {
  return [
    `> 𖧧 *${botName}* 🎶`,
    '> TikTok descargado correctamente ✨',
    '',
    '╭━━━〔 🎬 *TIKTOK DOWNLOAD* 〕━━━╮',
    `┃ 🎵 *Título:* ${data.title || 'Sin título'}`,
    `┃ 👤 *Autor:* ${data.author?.nickname || data.author?.unique_id || username || 'Desconocido'}`,
    `┃ ⏱️ *Duración:* ${data.duration || 'N/A'}`,
    `┃ ❤️ *Likes:* ${formatNumber(data.stats?.likes || 0)}`,
    `┃ 👁️ *Vistas:* ${formatNumber(data.stats?.views || 0)}`,
    '╰━━━━━━━━━━━━━━━━━━━━━━╯'
  ].join('\n')
}

async function sendSlideImages(client, chatId, images = [], caption = '', quoted = null) {
  let first = true

  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i]
    logInfo(`sendSlideImages ${i + 1}/${images.length}`, imageUrl)

    await client.sendMessage(
      chatId,
      {
        image: { url: imageUrl },
        caption: first ? caption : ''
      },
      { quoted }
    )

    first = false
    await sleep(300)
  }
}

async function sendVideoPost(client, chatId, post, caption = '', quoted = null) {
  const candidates = getVideoCandidates(post)
  let lastError = null

  logInfo('sendVideoPost candidates', candidates.length)

  const media = await getFirstValidVideoBuffer(candidates)
  if (!media?.buffer) {
    throw new Error('No se pudo obtener un video válido.')
  }

  await client.sendMessage(
    chatId,
    {
      video: media.buffer,
      mimetype: 'video/mp4',
      fileName: 'tiktok.mp4',
      caption
    },
    { quoted }
  )

  return true
}

function ensureUser(user = {}) {
  user.coins = Number(user.coins || 0)
  user.bank = Number(user.bank || 0)
  user.ttad = user.ttad && typeof user.ttad === 'object' ? user.ttad : {}
  return user
}

function getAvailableCoins(user = {}) {
  return Number(user.coins || 0)
}

function setPending(chatId, sender, payload) {
  global.db.data.chats ||= {}
  global.db.data.chats[chatId] ||= {}
  global.db.data.chats[chatId].ttadPending ||= {}
  global.db.data.chats[chatId].ttadPending[sender] = payload
  logInfo('Pending saved', chatId, sender)
}

function getPending(chatId, sender) {
  return global.db.data.chats?.[chatId]?.ttadPending?.[sender] || null
}

function clearPending(chatId, sender) {
  if (global.db.data.chats?.[chatId]?.ttadPending?.[sender]) {
    delete global.db.data.chats[chatId].ttadPending[sender]
    logInfo('Pending cleared', chatId, sender)
  }
}

function getBotBrandName(client) {
  const botId = client?.user?.id?.split(':')?.[0] + '@s.whatsapp.net'
  const botSettings = global.db.data.settings?.[botId] || {}
  return botSettings.namebot || botSettings.botname || 'RubyJX'
}

export async function before(m, { client }) {
  try {
    if (m?.chat) client.lastChatId = m.chat
    else if (m?.key?.remoteJid) client.lastChatId = m.key.remoteJid

    const raw = String(m?.text || m?.body || '').trim().toLowerCase()
    const chatId = m?.chat
    const senderId = m?.sender

    logInfo('before start', { raw, chatId, senderId })

    if (!raw || raw.startsWith('.') || raw.startsWith('#') || raw.startsWith('/') || raw.startsWith('!')) {
      return false
    }

    const pending = getPending(chatId, senderId)
    if (!pending) return false

    if (Date.now() > pending.expiresAt) {
      clearPending(chatId, senderId)
      await safeReply(m, client, '⌛ La confirmación de .ttad expiró. Vuelve a usar el comando.')
      return true
    }

    if (raw === 'no' || raw === 'cancelar') {
      clearPending(chatId, senderId)
      await safeReply(m, client, '❌ Descarga cancelada.')
      return true
    }

    if (raw !== 'si' && raw !== 'sí' && raw !== 's') {
      return false
    }

    await safeLoadingReply(m, client, '🕒 Iniciando descarga...')

    global.db.data.users ||= {}
    global.db.data.users[senderId] ||= {}
    const user = ensureUser(global.db.data.users[senderId])

    const totalUnits = Number(pending.totalUnits || 0)
    const cooldownMs = Number(pending.cooldownMs || 0)
    const requiredWait = totalUnits * cooldownMs
    const lastAt = Number(user.ttad?.lastAt || 0)
    const remain = requiredWait - (Date.now() - lastAt)

    if (remain > 0 && !m.isOwner) {
      clearPending(chatId, senderId)
      await safeReply(m, client, `⏳ Debes esperar *${msToHuman(remain)}* antes de volver a usar .ttad.`)
      return true
    }

    if (!m.isOwner) {
      const price = Number(pending.price || 0)
      const coins = getAvailableCoins(user)

      if (coins < price) {
        clearPending(chatId, senderId)
        await safeReply(
          m,
          client,
          [
            '❌ No tienes suficientes monedas.',
            `💰 Precio: *${formatNumber(price)}*`,
            `👛 Tus monedas: *${formatNumber(coins)}*`
          ].join('\n')
        )
        return true
      }

      user.coins -= price
    }

    user.ttad.lastAt = Date.now()
    clearPending(chatId, senderId)

    const posts = Array.isArray(pending.posts) ? pending.posts.slice(0, MAX_SEND_PER_RUN) : []
    const username = pending.username || 'usuario'

    await safeReply(
      m,
      client,
      [
        `🚀 Iniciando descarga de *@${username}*`,
        `📦 Publicaciones a enviar: *${formatNumber(posts.length)}*`,
        `⏱️ Cooldown aplicado: *${msToHuman(requiredWait)}*`,
        !m.isOwner
          ? `💸 Costo descontado: *${formatNumber(pending.price || 0)}* monedas`
          : '👑 Modo owner: gratis'
      ].join('\n')
    )

    let sentVideos = 0
    let sentSlides = 0
    let sentImages = 0
    let failed = 0

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const images = getImageUrls(post)

      const caption = [
        `🎵 TikTok de @${username}`,
        `📦 Publicación ${i + 1}/${posts.length}`,
        post?.title ? `📝 ${String(post.title).slice(0, 700)}` : ''
      ].filter(Boolean).join('\n')

      try {
        if (images.length > 0) {
          await sendSlideImages(client, m.chat, images, caption, m)
          sentSlides++
          sentImages += images.length
        } else {
          await sendVideoPost(client, m.chat, post, caption, m)
          sentVideos++
        }
      } catch (e) {
        failed++
        logError('post failed', i + 1, e?.message || e)
        await safeReply(m, client, `⚠️ Falló la publicación ${i + 1}/${posts.length}: ${e?.message || e}`)
      }

      await sleep(1500)
    }

    await safeReply(
      m,
      client,
      [
        '✅ *Descarga terminada*',
        `👤 Cuenta: @${username}`,
        `🎬 Videos enviados: *${formatNumber(sentVideos)}*`,
        `🖼️ Posts de fotos enviados: *${formatNumber(sentSlides)}*`,
        `📸 Fotos enviadas: *${formatNumber(sentImages)}*`,
        `❌ Fallos: *${formatNumber(failed)}*`
      ].join('\n')
    )

    logInfo('download process finished')
    return true
  } catch (err) {
    logError('before crashed', err?.message || err)
    return true
  }
}

export default {
  command: ['ttad'],
  category: 'downloads',
  group: false,
  isOwner: false,
  isAdmin: false,
  botAdmin: false,

  async run(client, m, args, usedPrefix, command, text) {
    try {
      if (m?.chat) client.lastChatId = m.chat
      else if (m?.key?.remoteJid) client.lastChatId = m.key.remoteJid

      global.db.data.users ||= {}
      global.db.data.chats ||= {}

      const safeChat = m?.chat || 'ttad-private'
      const safeSender = m?.sender || 'ttad-user'

      global.db.data.users[safeSender] ||= {}
      global.db.data.chats[safeChat] ||= {}

      const user = ensureUser(global.db.data.users[safeSender])
      const rawText = typeof text === 'string' ? text : (Array.isArray(args) ? args.join(' ') : '')
      const input = extractInput(rawText, usedPrefix, command)

      logInfo('Run command start', {
        rawTextParam: rawText,
        usedPrefix,
        command,
        parsedInput: input,
        hasReply: typeof m?.reply === 'function',
        chat: m?.chat,
        sender: m?.sender
      })

      logInfo('resolved target', resolveMessageTarget(m, client))

      if (!input) {
        return await safeReply(
          m,
          client,
          [
            `╭━━━〔 🎵 *${usedPrefix + command}* 〕━━━╮`,
            '┃ Envía un usuario o una URL de TikTok.',
            '┃',
            '┃ 📌 *Ejemplos:*',
            `┃ ➤ *${usedPrefix + command} @usuario*`,
            `┃ ➤ *${usedPrefix + command} https://www.tiktok.com/@user/video/...*`,
            '╰━━━━━━━━━━━━━━━━━━━━━━╯'
          ].join('\n')
        )
      }

      await safeLoadingReply(m, client, '🕒 Analizando TikTok...')

      if (isTikTokUrl(input)) {
        const brandName = getBotBrandName(client)

        let data
        try {
          data = await getTikTokDataByUrl(input)
        } catch (e) {
          return await safeReply(m, client, `❌ No pude obtener ese TikTok por URL.\n[${e?.message || e}]`)
        }

        const caption = buildSingleUrlCaption(data.author?.unique_id, data, brandName)

        if (data.type === 'image') {
          const images = getImageUrls(data)
          if (!images.length) {
            return await safeReply(m, client, '❌ No se encontraron imágenes válidas en ese TikTok.')
          }

          await safeReply(
            m,
            client,
            [
              '✅ *TikTok detectado*',
              `🖼️ Tipo: *slideshow*`,
              `📸 Imágenes: *${formatNumber(images.length)}*`
            ].join('\n')
          )

          await sendSlideImages(client, m.chat, images, caption, m)
          return
        }

        const video = await getFirstValidVideoBuffer(getVideoCandidates(data))
        if (!video?.buffer) {
          return await safeReply(m, client, '❌ No pude descargar un video válido desde esa URL.')
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

        return
      }

      const username = cleanUsername(input)

      await safeReply(m, client, `🔎 Analizando la cuenta *@${username}*... esto puede tardar un poco.`)

      let posts = []
      try {
        posts = await getUserPosts(username, MAX_POSTS_PREVIEW)
      } catch (e) {
        return await safeReply(
          m,
          client,
          `❌ No pude consultar la cuenta *@${username}*.\n[${e?.message || e}]`
        )
      }

      if (!posts.length) {
        return await safeReply(m, client, `❌ No encontré publicaciones para *@${username}*.`)
      }

      const info = await analyzePosts(posts)
      const cooldownPerUnit = m.isOwner ? OWNER_COOLDOWN_PER_UNIT_MS : USER_COOLDOWN_PER_UNIT_MS
      const totalUnits = info.normalVideos + info.totalImages
      const totalCooldown = totalUnits * cooldownPerUnit
      const price = m.isOwner ? 0 : NORMAL_USER_PRICE

      if (!m.isOwner && getAvailableCoins(user) < price) {
        return await safeReply(
          m,
          client,
          [
            '❌ No tienes suficientes monedas para usar este comando.',
            `💰 Precio requerido: *${formatNumber(price)}*`,
            `👛 Tus monedas: *${formatNumber(getAvailableCoins(user))}*`
          ].join('\n')
        )
      }

      setPending(safeChat, safeSender, {
        username,
        posts,
        info,
        price,
        totalUnits,
        cooldownMs: cooldownPerUnit,
        createdAt: Date.now(),
        expiresAt: Date.now() + PREVIEW_EXPIRE_MS
      })

      return await safeReply(
        m,
        client,
        buildPreviewMessage({
          username,
          info,
          isOwner: m.isOwner,
          price,
          cooldownPerUnit,
          expireMs: PREVIEW_EXPIRE_MS
        }) + `\n\n⏳ Cooldown total estimado para esta ejecución: *${msToHuman(totalCooldown)}*`
      )
    } catch (err) {
      logError('run crashed', err?.message || err)
      return await safeReply(m, client, `❌ Error interno en ${usedPrefix + command}\n[${err?.message || err}]`)
    }
  }
}