const floodCache = new Map()

function defaultConfig() {
  return {
    enabled: false,
    maxMessages: 5,
    intervalMs: 5000,
    action: 'delete',
    warnLimit: 3,
    muteMs: 60000,
    notifyCooldownMs: 5000,
    resetViolationsMs: 10 * 60 * 1000,
    deleteRecent: true,
    deleteLimit: 5,
    ignoreAdmins: true,
    ignoreOwner: true,
    countCommands: true,
    whitelist: []
  }
}

function normalizeJid(jid = '') {
  if (!jid) return ''
  const raw = String(jid).trim()

  if (raw.endsWith('@s.whatsapp.net')) {
    const number = raw.split('@')[0].split(':')[0].replace(/\D/g, '')
    return number ? `${number}@s.whatsapp.net` : raw
  }

  if (raw.endsWith('@lid')) return raw
  if (raw.endsWith('@g.us')) return raw

  const number = raw.split('@')[0].split(':')[0].replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : raw
}

function getNumber(jid = '') {
  return String(jid)
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')
}

function isCommandText(text = '') {
  const clean = String(text || '').trim()
  return (
    clean.startsWith('.') ||
    clean.startsWith('/') ||
    clean.startsWith('#') ||
    clean.startsWith('!')
  )
}

function getMessageText(m) {
  return (
    m.text ||
    m.body ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ''
  )
}

function getMessageType(m) {
  return Object.keys(m.message || {})[0] || 'unknown'
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function formatDuration(ms = 0) {
  const seconds = Math.ceil(Number(ms || 0) / 1000)

  if (seconds < 60) return `${seconds} segundo${seconds === 1 ? '' : 's'}`

  const minutes = Math.floor(seconds / 60)
  const restSeconds = seconds % 60

  if (!restSeconds) return `${minutes} minuto${minutes === 1 ? '' : 's'}`

  return `${minutes} minuto${minutes === 1 ? '' : 's'} y ${restSeconds} segundo${restSeconds === 1 ? '' : 's'}`
}

function clamp(num, min, max) {
  const n = Number(num)
  if (!Number.isFinite(n)) return min
  return Math.max(min, Math.min(n, max))
}

function ensureChat(m) {
  global.db.data.chats[m.chat] ||= {}
  return global.db.data.chats[m.chat]
}

function ensureConfig(chat) {
  const base = defaultConfig()

  chat.antifloodConfig ||= {}

  const oldSettings = chat.floodSettings || {}

  const cfg = chat.antifloodConfig

  cfg.enabled ??= typeof chat.antiflood === 'boolean' ? chat.antiflood : base.enabled
  cfg.maxMessages ??= oldSettings.maxMessages || base.maxMessages
  cfg.intervalMs ??= oldSettings.intervalMs || base.intervalMs
  cfg.action ??= oldSettings.action || base.action
  cfg.warnLimit ??= base.warnLimit
  cfg.muteMs ??= base.muteMs
  cfg.notifyCooldownMs ??= base.notifyCooldownMs
  cfg.resetViolationsMs ??= base.resetViolationsMs
  cfg.deleteRecent ??= base.deleteRecent
  cfg.deleteLimit ??= base.deleteLimit
  cfg.ignoreAdmins ??= base.ignoreAdmins
  cfg.ignoreOwner ??= base.ignoreOwner
  cfg.countCommands ??= base.countCommands
  cfg.whitelist ??= base.whitelist

  if (!Array.isArray(cfg.whitelist)) cfg.whitelist = []

  cfg.maxMessages = clamp(cfg.maxMessages, 2, 30)
  cfg.intervalMs = clamp(cfg.intervalMs, 1000, 60000)
  cfg.warnLimit = clamp(cfg.warnLimit, 1, 10)
  cfg.muteMs = clamp(cfg.muteMs, 10000, 30 * 60 * 1000)
  cfg.notifyCooldownMs = clamp(cfg.notifyCooldownMs, 1000, 60000)
  cfg.resetViolationsMs = clamp(cfg.resetViolationsMs, 60000, 60 * 60 * 1000)
  cfg.deleteLimit = clamp(cfg.deleteLimit, 1, 20)

  if (!['warn', 'delete', 'mute', 'kick'].includes(cfg.action)) {
    cfg.action = base.action
  }

  syncLegacy(chat, cfg)

  return cfg
}

function syncLegacy(chat, cfg) {
  chat.antiflood = !!cfg.enabled
  chat.floodSettings = {
    maxMessages: cfg.maxMessages,
    intervalMs: cfg.intervalMs,
    action: cfg.action
  }
}

function ensureRuntimeData(chat, sender) {
  chat.antifloodUsers ||= {}

  const jid = normalizeJid(sender)

  chat.antifloodUsers[jid] ||= {
    violations: 0,
    lastViolation: 0,
    lastNotice: 0,
    mutedUntil: 0
  }

  return chat.antifloodUsers[jid]
}

function getMentionedJid(m) {
  const mentioned =
    m.mentionedJid ||
    m.mentions ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    []

  if (Array.isArray(mentioned) && mentioned[0]) return normalizeJid(mentioned[0])
  if (m.quoted?.sender) return normalizeJid(m.quoted.sender)

  return null
}

function getTargetJid(m, args = []) {
  const mentioned = getMentionedJid(m)
  if (mentioned) return mentioned

  const raw = args.find(arg => /\d{6,}/.test(String(arg || '')))
  if (!raw) return null

  const number = String(raw).replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : null
}

function isOwnerNumber(jid = '') {
  const number = getNumber(jid)
  return Array.isArray(global.owner) && global.owner.includes(number)
}

function isWhitelisted(cfg, jid = '') {
  const number = getNumber(jid)
  const normalized = normalizeJid(jid)

  return cfg.whitelist.some(saved => {
    const savedNormalized = normalizeJid(saved)
    const savedNumber = getNumber(saved)
    return savedNormalized === normalized || savedNumber === number
  })
}

async function sendMention(client, m, text, mentions = []) {
  try {
    return await client.sendMessage(
      m.chat,
      {
        text,
        mentions: mentions.filter(Boolean)
      },
      {
        quoted: m
      }
    )
  } catch {
    return m.reply(text)
  }
}

async function deleteOne(client, m, key) {
  try {
    if (!key) return false

    await client.sendMessage(m.chat, {
      delete: key
    })

    return true
  } catch {
    return false
  }
}

async function deleteRecentMessages(client, m, entries = [], limit = 5) {
  let deleted = 0
  const used = new Set()

  const recent = [...entries]
    .filter(entry => entry?.key?.id)
    .slice(-limit)
    .reverse()

  for (const entry of recent) {
    const id = entry.key.id
    if (used.has(id)) continue

    used.add(id)

    const ok = await deleteOne(client, m, entry.key)
    if (ok) deleted++
  }

  return deleted
}

function buildStatus(chat, cfg, usedPrefix = '.') {
  const whitelist = Array.isArray(cfg.whitelist) ? cfg.whitelist : []
  const usersData = chat.antifloodUsers || {}

  return `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴⚡ *ANTIFLOOD PRO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Estado: ${cfg.enabled ? '✅ Activado' : '❌ Desactivado'}
│ Límite: ${cfg.maxMessages} mensajes
│ Ventana: ${Math.floor(cfg.intervalMs / 1000)} segundos
│ Acción: ${actionLabel(cfg.action)}
│ Advertencias: ${cfg.warnLimit}
│ Silencio: ${formatDuration(cfg.muteMs)}
│ Borrar recientes: ${cfg.deleteRecent ? 'Sí' : 'No'}
│ Límite de borrado: ${cfg.deleteLimit}
│ Ignorar admins: ${cfg.ignoreAdmins ? 'Sí' : 'No'}
│ Ignorar owner: ${cfg.ignoreOwner ? 'Sí' : 'No'}
│ Contar comandos: ${cfg.countCommands ? 'Sí' : 'No'}
│ Lista blanca: ${whitelist.length} usuario(s)
│ Usuarios vigilados: ${Object.keys(usersData).length}
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

╭───〔 📌 *COMANDOS* 〕
│
│ ${usedPrefix}antiflood on
│ ${usedPrefix}antiflood off
│ ${usedPrefix}antiflood status
│
│ ${usedPrefix}antiflood set 5 5
│ ${usedPrefix}antiflood action warn
│ ${usedPrefix}antiflood action delete
│ ${usedPrefix}antiflood action mute
│ ${usedPrefix}antiflood action kick
│
│ ${usedPrefix}antiflood warnlimit 3
│ ${usedPrefix}antiflood mutetime 60
│ ${usedPrefix}antiflood cooldown 5
│
│ ${usedPrefix}antiflood delrecent on
│ ${usedPrefix}antiflood deletelimit 5
│
│ ${usedPrefix}antiflood admins on/off
│ ${usedPrefix}antiflood commands on/off
│
│ ${usedPrefix}antiflood whitelist add @user
│ ${usedPrefix}antiflood whitelist del @user
│ ${usedPrefix}antiflood whitelist list
│ ${usedPrefix}antiflood whitelist clear
│
│ ${usedPrefix}antiflood reset @user
│ ${usedPrefix}antiflood reset all
│
╰──────────────`
}

function actionLabel(action = 'delete') {
  const map = {
    warn: '⚠️ Advertir',
    delete: '🗑️ Borrar mensajes',
    mute: '🔇 Silencio temporal',
    kick: '🚪 Expulsar por reincidencia'
  }

  return map[action] || action
}

function boolText(value) {
  return value ? '✅ Activado' : '❌ Desactivado'
}

async function handleFlood(client, m, cfg, chat, sender, entries) {
  const now = Date.now()
  const userData = ensureRuntimeData(chat, sender)

  if (now - Number(userData.lastViolation || 0) > cfg.resetViolationsMs) {
    userData.violations = 0
  }

  userData.violations += 1
  userData.lastViolation = now

  const reachedWarnLimit = userData.violations >= cfg.warnLimit
  const canNotify = now - Number(userData.lastNotice || 0) >= cfg.notifyCooldownMs

  let deleted = 0
  let finalAction = 'warn'
  let extraLine = ''

  const shouldDelete =
    cfg.action === 'delete' ||
    cfg.action === 'mute' ||
    cfg.action === 'kick'

  if (shouldDelete && m.isBotAdmin) {
    if (cfg.deleteRecent) {
      deleted = await deleteRecentMessages(client, m, entries, cfg.deleteLimit)
    } else {
      const ok = await deleteOne(client, m, m.key)
      deleted = ok ? 1 : 0
    }
  }

  if (cfg.action === 'delete') {
    finalAction = 'delete'
    extraLine = m.isBotAdmin
      ? `🗑️ Mensajes eliminados: *${deleted}*`
      : `⚠️ No pude borrar mensajes porque no soy admin.`
  }

  if (cfg.action === 'mute') {
    if (reachedWarnLimit) {
      finalAction = 'mute'
      userData.mutedUntil = now + cfg.muteMs
      userData.violations = 0

      extraLine = `🔇 Usuario silenciado durante *${formatDuration(cfg.muteMs)}*.`
    } else {
      finalAction = 'warn'
      extraLine = `⚠️ Advertencia *${userData.violations}/${cfg.warnLimit}*.`
    }
  }

  if (cfg.action === 'kick') {
    if (reachedWarnLimit) {
      if (m.isBotAdmin && !m.isAdmin && !m.isOwner) {
        finalAction = 'kick'

        try {
          await client.groupParticipantsUpdate(m.chat, [sender], 'remove')
          userData.violations = 0
          extraLine = `🚪 Usuario expulsado por reincidencia.`
        } catch {
          finalAction = 'mute'
          userData.mutedUntil = now + cfg.muteMs
          userData.violations = 0
          extraLine = `⚠️ No pude expulsar al usuario, así que quedó silenciado por *${formatDuration(cfg.muteMs)}*.`
        }
      } else {
        finalAction = 'warn'
        extraLine = `⚠️ No puedo expulsar a este usuario. Advertencia aplicada.`
      }
    } else {
      finalAction = 'warn'
      extraLine = `⚠️ Advertencia *${userData.violations}/${cfg.warnLimit}*.`
    }
  }

  if (cfg.action === 'warn') {
    finalAction = 'warn'
    extraLine = `⚠️ Advertencia *${userData.violations}/${cfg.warnLimit}*.`
  }

  const cacheKey = `${m.chat}|${sender}`
  floodCache.set(cacheKey, [])

  if (!canNotify) return false

  userData.lastNotice = now

  const text = `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴⚡ *ANTIFLOOD DETECTADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ Usuario: @${getNumber(sender)}
│ Mensajes: *${entries.length}*
│ Ventana: *${Math.floor(cfg.intervalMs / 1000)} segundos*
│ Límite permitido: *${cfg.maxMessages}*
│ Acción configurada: *${actionLabel(cfg.action)}*
│ Acción aplicada: *${actionLabel(finalAction)}*
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

${extraLine}`

  await sendMention(client, m, text, [sender])

  return false
}

export default {
  command: ['antiflood', 'flood'],
  category: 'grupo',

  async all(m, { client }) {
    try {
      if (!m?.key) return false
      if (!m.isGroup) return false
      if (!m.chat || !m.sender) return false
      if (m.key?.fromMe) return false
      if (!m.message) return false

      const type = getMessageType(m)

      if (
        type === 'reactionMessage' ||
        type === 'protocolMessage' ||
        type === 'senderKeyDistributionMessage'
      ) {
        return false
      }

      const chat = ensureChat(m)
      const cfg = ensureConfig(chat)

      if (!cfg.enabled) return false

      const sender = normalizeJid(m.sender)
      const text = getMessageText(m)

      if (!cfg.countCommands && isCommandText(text)) return false

      if (cfg.ignoreOwner && (m.isOwner || isOwnerNumber(sender))) return false
      if (cfg.ignoreAdmins && m.isAdmin) return false
      if (isWhitelisted(cfg, sender)) return false

      const now = Date.now()
      const userData = ensureRuntimeData(chat, sender)

      if (Number(userData.mutedUntil || 0) > now) {
        if (m.isBotAdmin) {
          await deleteOne(client, m, m.key)
        }

        const canNotify = now - Number(userData.lastNotice || 0) >= cfg.notifyCooldownMs

        if (canNotify) {
          userData.lastNotice = now

          await sendMention(
            client,
            m,
            `🔇 @${getNumber(sender)} sigues en silencio temporal por *${formatDuration(userData.mutedUntil - now)}* debido a flood.`,
            [sender]
          )
        }

        return false
      }

      const cacheKey = `${m.chat}|${sender}`
      const current = floodCache.get(cacheKey) || []

      const clean = current.filter(entry => now - entry.time <= cfg.intervalMs)

      clean.push({
        time: now,
        key: m.key
      })

      floodCache.set(cacheKey, clean)

      if (clean.length <= cfg.maxMessages) return false

      await handleFlood(client, m, cfg, chat, sender, clean)

      return false
    } catch (e) {
      console.error('[ANTIFLOOD ERROR]', e)
      return false
    }
  },

  run: async (client, m, args, usedPrefix = '.') => {
    try {
      const OWNER_NUMBER = '51901931862'
      const senderNumber = getNumber(m.sender)
      const isOwnerBot = senderNumber === OWNER_NUMBER || m.isOwner

      if (!m.isGroup) {
        return m.reply('⚡ Este comando solo funciona en grupos.')
      }

      if (!isOwnerBot && !m.isAdmin) {
        return m.reply('⚡ Este comando es solo para administradores o el owner del bot.')
      }

      const chat = ensureChat(m)
      const cfg = ensureConfig(chat)

      const option = String(args[0] || '').toLowerCase()

      if (!option || ['menu', 'help', 'status', 'estado'].includes(option)) {
        return m.reply(buildStatus(chat, cfg, usedPrefix))
      }

      if (['on', 'enable', 'activar'].includes(option)) {
        cfg.enabled = true
        syncLegacy(chat, cfg)

        return m.reply(`╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴⚡ *ANTIFLOOD ACTIVADO* ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
│
│ El sistema AntiFlood quedó activo.
│ Límite: *${cfg.maxMessages} mensajes*
│ Ventana: *${Math.floor(cfg.intervalMs / 1000)} segundos*
│ Acción: *${actionLabel(cfg.action)}*
│
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ`)
      }

      if (['off', 'disable', 'desactivar'].includes(option)) {
        cfg.enabled = false
        syncLegacy(chat, cfg)

        return m.reply('⚡ AntiFlood desactivado correctamente.')
      }

      if (option === 'set' || option === 'config') {
        const maxMessages = Number(args[1])
        const seconds = Number(args[2])

        if (!Number.isFinite(maxMessages) || !Number.isFinite(seconds)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood set <mensajes> <segundos>

💡 Ejemplo:
${usedPrefix}antiflood set 5 5`)
        }

        cfg.maxMessages = clamp(Math.floor(maxMessages), 2, 30)
        cfg.intervalMs = clamp(Math.floor(seconds * 1000), 1000, 60000)

        syncLegacy(chat, cfg)

        return m.reply(`⚡ *AntiFlood configurado*

Límite: *${cfg.maxMessages} mensajes*
Ventana: *${Math.floor(cfg.intervalMs / 1000)} segundos*`)
      }

      if (option === 'action' || option === 'accion') {
        const action = String(args[1] || '').toLowerCase()
        const valid = ['warn', 'delete', 'mute', 'kick']

        if (!valid.includes(action)) {
          return m.reply(`❌ Acción inválida.

Acciones disponibles:
• warn
• delete
• mute
• kick

💡 Ejemplo:
${usedPrefix}antiflood action delete`)
        }

        cfg.action = action
        syncLegacy(chat, cfg)

        return m.reply(`⚡ Acción de AntiFlood actualizada: *${actionLabel(action)}*`)
      }

      if (option === 'warnlimit' || option === 'warns' || option === 'advertencias') {
        const amount = Number(args[1])

        if (!Number.isFinite(amount)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood warnlimit 3`)
        }

        cfg.warnLimit = clamp(Math.floor(amount), 1, 10)
        syncLegacy(chat, cfg)

        return m.reply(`⚡ Límite de advertencias actualizado: *${cfg.warnLimit}*`)
      }

      if (option === 'mutetime' || option === 'mute') {
        const seconds = Number(args[1])

        if (!Number.isFinite(seconds)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood mutetime 60`)
        }

        cfg.muteMs = clamp(Math.floor(seconds * 1000), 10000, 30 * 60 * 1000)
        syncLegacy(chat, cfg)

        return m.reply(`🔇 Tiempo de silencio actualizado: *${formatDuration(cfg.muteMs)}*`)
      }

      if (option === 'cooldown') {
        const seconds = Number(args[1])

        if (!Number.isFinite(seconds)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood cooldown 5`)
        }

        cfg.notifyCooldownMs = clamp(Math.floor(seconds * 1000), 1000, 60000)
        syncLegacy(chat, cfg)

        return m.reply(`⚡ Cooldown de avisos actualizado: *${formatDuration(cfg.notifyCooldownMs)}*`)
      }

      if (option === 'delrecent' || option === 'deleterecent') {
        const mode = String(args[1] || '').toLowerCase()

        if (!['on', 'off'].includes(mode)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood delrecent on
${usedPrefix}antiflood delrecent off`)
        }

        cfg.deleteRecent = mode === 'on'
        syncLegacy(chat, cfg)

        return m.reply(`🗑️ Borrado de mensajes recientes: *${boolText(cfg.deleteRecent)}*`)
      }

      if (option === 'deletelimit' || option === 'dellimit') {
        const amount = Number(args[1])

        if (!Number.isFinite(amount)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood deletelimit 5`)
        }

        cfg.deleteLimit = clamp(Math.floor(amount), 1, 20)
        syncLegacy(chat, cfg)

        return m.reply(`🗑️ Límite de mensajes a borrar: *${cfg.deleteLimit}*`)
      }

      if (option === 'admins') {
        const mode = String(args[1] || '').toLowerCase()

        if (!['on', 'off'].includes(mode)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood admins on
${usedPrefix}antiflood admins off

📌 on = los admins no serán sancionados.
📌 off = los admins también serán contados.`)
        }

        cfg.ignoreAdmins = mode === 'on'
        syncLegacy(chat, cfg)

        return m.reply(`🛡️ Ignorar administradores: *${boolText(cfg.ignoreAdmins)}*`)
      }

      if (option === 'owner') {
        const mode = String(args[1] || '').toLowerCase()

        if (!['on', 'off'].includes(mode)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood owner on
${usedPrefix}antiflood owner off`)
        }

        cfg.ignoreOwner = mode === 'on'
        syncLegacy(chat, cfg)

        return m.reply(`👑 Ignorar owner: *${boolText(cfg.ignoreOwner)}*`)
      }

      if (option === 'commands' || option === 'comandos') {
        const mode = String(args[1] || '').toLowerCase()

        if (!['on', 'off'].includes(mode)) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood commands on
${usedPrefix}antiflood commands off

📌 on = también contará comandos.
📌 off = ignorará mensajes que empiecen con prefijo.`)
        }

        cfg.countCommands = mode === 'on'
        syncLegacy(chat, cfg)

        return m.reply(`⌨️ Contar comandos como flood: *${boolText(cfg.countCommands)}*`)
      }

      if (option === 'whitelist' || option === 'wl') {
        const sub = String(args[1] || '').toLowerCase()

        if (!sub) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood whitelist add @user
${usedPrefix}antiflood whitelist del @user
${usedPrefix}antiflood whitelist list
${usedPrefix}antiflood whitelist clear`)
        }

        if (sub === 'list') {
          if (!cfg.whitelist.length) {
            return m.reply('⚡ La lista blanca de AntiFlood está vacía.')
          }

          const list = cfg.whitelist
            .map((jid, index) => `${index + 1}. @${getNumber(jid)}`)
            .join('\n')

          return await sendMention(
            client,
            m,
            `⚡ *Lista blanca AntiFlood*\n\n${list}`,
            cfg.whitelist
          )
        }

        if (sub === 'clear') {
          cfg.whitelist = []
          syncLegacy(chat, cfg)

          return m.reply('⚡ Lista blanca limpiada correctamente.')
        }

        if (['add', 'agregar'].includes(sub)) {
          const target = getTargetJid(m, args.slice(2))

          if (!target) {
            return m.reply(`❌ Menciona un usuario o responde a su mensaje.

Ejemplo:
${usedPrefix}antiflood whitelist add @user`)
          }

          if (!isWhitelisted(cfg, target)) {
            cfg.whitelist.push(normalizeJid(target))
          }

          syncLegacy(chat, cfg)

          return await sendMention(
            client,
            m,
            `⚡ @${getNumber(target)} fue añadido a la lista blanca de AntiFlood.`,
            [target]
          )
        }

        if (['del', 'remove', 'quitar'].includes(sub)) {
          const target = getTargetJid(m, args.slice(2))

          if (!target) {
            return m.reply(`❌ Menciona un usuario o responde a su mensaje.

Ejemplo:
${usedPrefix}antiflood whitelist del @user`)
          }

          const targetNumber = getNumber(target)

          cfg.whitelist = cfg.whitelist.filter(jid => getNumber(jid) !== targetNumber)

          syncLegacy(chat, cfg)

          return await sendMention(
            client,
            m,
            `⚡ @${targetNumber} fue eliminado de la lista blanca de AntiFlood.`,
            [target]
          )
        }

        return m.reply(`❌ Subcomando inválido.

Usa:
${usedPrefix}antiflood whitelist add @user
${usedPrefix}antiflood whitelist del @user
${usedPrefix}antiflood whitelist list
${usedPrefix}antiflood whitelist clear`)
      }

      if (option === 'reset') {
        const sub = String(args[1] || '').toLowerCase()

        chat.antifloodUsers ||= {}

        if (sub === 'all') {
          chat.antifloodUsers = {}
          floodCache.clear()

          return m.reply('⚡ Datos de AntiFlood reiniciados para todos los usuarios.')
        }

        const target = getTargetJid(m, args.slice(1))

        if (!target) {
          return m.reply(`❌ Uso correcto:

${usedPrefix}antiflood reset @user
${usedPrefix}antiflood reset all`)
        }

        delete chat.antifloodUsers[normalizeJid(target)]
        floodCache.delete(`${m.chat}|${normalizeJid(target)}`)

        return await sendMention(
          client,
          m,
          `⚡ Datos de AntiFlood reiniciados para @${getNumber(target)}.`,
          [target]
        )
      }

      return m.reply(buildStatus(chat, cfg, usedPrefix))
    } catch (e) {
      console.error('[ANTIFLOOD COMMAND ERROR]', e)
      return m.reply(`❌ Error en AntiFlood: ${e.message}`)
    }
  }
}