import { resolveLidToRealJid } from "../../core/utils.js"

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const BAN_CONFIG = {
  warnEvery: 10,
  defaultReason: 'No especificado',
  timezone: 'America/Lima'
}

const PANEL_CONFIG = {
  defaultMode: 'list'
}

function cleanJid(jid = '') {
  return String(jid || '').split(':')[0].trim()
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function normalizeJid(jid = '') {
  const raw = cleanJid(jid)
  if (!raw) return ''
  if (raw.includes('@')) return raw
  return `${raw.replace(/\D/g, '')}@s.whatsapp.net`
}

function getOwnerList() {
  const ownersFromGlobal = Array.isArray(global.owner)
    ? global.owner.flat(Infinity)
    : []

  return [
    ...FORCE_OWNER,
    ...ownersFromGlobal
  ].filter(Boolean).map(String)
}

function isSameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (rawA && rawB && rawA === rawB) return true

  const numA = onlyNumber(rawA)
  const numB = onlyNumber(rawB)

  return Boolean(numA && numB && numA === numB)
}

function isOwnerUser(jid = '') {
  const raw = cleanJid(jid)
  const number = onlyNumber(jid)

  if (!raw && !number) return false

  const owners = getOwnerList()

  return owners.some(owner => {
    const ownerRaw = cleanJid(owner)
    const ownerNumber = onlyNumber(owner)

    return (
      ownerRaw === raw ||
      ownerNumber === number ||
      ownerRaw === `${number}@s.whatsapp.net` ||
      ownerRaw === `${number}@lid`
    )
  })
}

function limaDate() {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: BAN_CONFIG.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date())
}

function ensureGlobalUser(db, jid) {
  if (!db.users) db.users = {}

  const id = cleanJid(jid)
  if (!id) return null

  if (!db.users[id]) db.users[id] = {}

  return db.users[id]
}

function ensureChat(db, chatId) {
  if (!db.chats) db.chats = {}
  if (!db.chats[chatId]) db.chats[chatId] = {}
  if (!db.chats[chatId].users) db.chats[chatId].users = {}

  return db.chats[chatId]
}

function ensureChatUser(db, chatId, jid) {
  const chat = ensureChat(db, chatId)

  const id = cleanJid(jid)
  if (!id) return null

  if (!chat.users[id]) chat.users[id] = {}

  return chat.users[id]
}

function ensureBanPanel(chat) {
  chat.banAdminPanel ||= {}

  const panel = chat.banAdminPanel

  panel.enabled ??= false
  panel.mode ??= PANEL_CONFIG.defaultMode
  panel.allowed = Array.isArray(panel.allowed) ? panel.allowed : []
  panel.updatedAt ??= ''
  panel.updatedBy ??= ''

  if (!['list', 'all'].includes(panel.mode)) {
    panel.mode = PANEL_CONFIG.defaultMode
  }

  return panel
}

function getUserName(db, jid, fallback = 'Usuario') {
  const id = cleanJid(jid)
  const number = onlyNumber(id)

  return (
    db.users?.[id]?.name ||
    db.users?.[`${number}@s.whatsapp.net`]?.name ||
    db.users?.[`${number}@lid`]?.name ||
    number ||
    fallback
  )
}

function participantIds(p = {}) {
  const phoneNumber = p.phoneNumber ? onlyNumber(p.phoneNumber) : ''

  return [
    p.id,
    p.jid,
    p.lid,
    p.phoneNumber,
    phoneNumber ? `${phoneNumber}@s.whatsapp.net` : '',
    phoneNumber ? `${phoneNumber}@lid` : ''
  ].filter(Boolean)
}

async function isGroupAdmin(client, m, jidRaw = '', jidReal = '') {
  if (!m.isGroup) return false

  if (
    m.isAdmin &&
    (
      isSameUser(m.sender, jidRaw) ||
      isSameUser(m.sender, jidReal)
    )
  ) {
    return true
  }

  const metadata = await client.groupMetadata(m.chat).catch(() => null)
  const participants = metadata?.participants || []

  const aliases = buildAliases(jidRaw, jidReal)

  return participants.some(p => {
    const isAdmin = p.admin === 'admin' || p.admin === 'superadmin'
    if (!isAdmin) return false

    return participantIds(p).some(id =>
      aliases.some(alias => isSameUser(id, alias))
    )
  })
}

function extractTarget(m, args = []) {
  const mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid : []

  if (mentioned.length > 0) return mentioned[0]
  if (m.quoted?.sender) return m.quoted.sender

  const possibleNumber = args.find(arg => /@?\d{5,}/.test(arg))

  if (possibleNumber) {
    const number = String(possibleNumber).replace(/\D/g, '')
    if (number) return `${number}@s.whatsapp.net`
  }

  return ''
}

function extractReason(args = []) {
  const cleanArgs = args
    .filter(arg => !/@?\d{5,}/.test(arg))
    .map(arg => String(arg).trim())
    .filter(Boolean)

  const reason = cleanArgs.join(' ').trim()

  return reason || BAN_CONFIG.defaultReason
}

function makeBanData({ targetJid, targetRealJid, ownerJid, ownerRealJid, chatId, reason }) {
  const date = limaDate()

  return {
    banned: true,
    ban: true,
    isBanned: true,

    banReason: reason,
    banDate: date,
    banChat: chatId,
    bannedBy: ownerRealJid || ownerJid,
    bannedByNumber: onlyNumber(ownerRealJid || ownerJid),

    banWarnCount: 0,
    banFirstWarned: false,
    banLastWarn: '',
    banWarnEvery: BAN_CONFIG.warnEvery,

    banInfo: {
      active: true,
      targetJid,
      targetRealJid,
      reason,
      date,
      chat: chatId,
      by: ownerRealJid || ownerJid,
      byNumber: onlyNumber(ownerRealJid || ownerJid),
      warnEvery: BAN_CONFIG.warnEvery,
      attempts: 0
    }
  }
}

function applyBanToRecord(record, banData) {
  if (!record) return

  record.banned = true
  record.ban = true
  record.isBanned = true

  record.banReason = banData.banReason
  record.banDate = banData.banDate
  record.banChat = banData.banChat
  record.bannedBy = banData.bannedBy
  record.bannedByNumber = banData.bannedByNumber

  record.banWarnCount = 0
  record.banFirstWarned = false
  record.banLastWarn = ''
  record.banWarnEvery = BAN_CONFIG.warnEvery

  record.banInfo = { ...banData.banInfo }
}

function removeBanFromRecord(record, ownerJid = '') {
  if (!record) return

  record.banned = false
  record.ban = false
  record.isBanned = false

  record.banWarnCount = 0
  record.banFirstWarned = false
  record.banLastWarn = ''

  if (!record.banInfo) record.banInfo = {}

  record.banInfo.active = false
  record.banInfo.unbannedAt = limaDate()
  record.banInfo.unbannedBy = ownerJid
  record.banInfo.attempts = 0

  record.unbanDate = limaDate()
  record.unbannedBy = ownerJid
}

function getBanStatus(record) {
  return Boolean(
    record?.banned === true ||
    record?.ban === true ||
    record?.isBanned === true ||
    record?.banInfo?.active === true
  )
}

function buildAliases(jid1 = '', jid2 = '') {
  const aliases = new Set()

  for (const jid of [jid1, jid2]) {
    const raw = cleanJid(jid)
    const number = onlyNumber(raw)

    if (raw) aliases.add(raw)

    if (number) {
      aliases.add(number)
      aliases.add(`${number}@s.whatsapp.net`)
      aliases.add(`${number}@lid`)
    }
  }

  return [...aliases].filter(Boolean)
}

function isAllowedInPanel(panel, senderRaw = '', senderReal = '') {
  const aliases = buildAliases(senderRaw, senderReal)

  return panel.allowed.some(saved =>
    aliases.some(alias => isSameUser(saved, alias))
  )
}

function addAllowedAdmin(panel, jid = '') {
  const clean = cleanJid(jid)
  if (!clean) return false

  const exists = panel.allowed.some(saved => isSameUser(saved, clean))

  if (exists) return false

  panel.allowed.push(clean)
  return true
}

function removeAllowedAdmin(panel, jidRaw = '', jidReal = '') {
  const aliases = buildAliases(jidRaw, jidReal)
  const before = panel.allowed.length

  panel.allowed = panel.allowed.filter(saved =>
    !aliases.some(alias => isSameUser(saved, alias))
  )

  return panel.allowed.length !== before
}

async function getBanPermission({ client, m, db, chatId, senderReal }) {
  const senderIsOwner =
    isOwnerUser(m.sender) ||
    isOwnerUser(senderReal)

  if (senderIsOwner) {
    return {
      allowed: true,
      role: 'Owner',
      isOwner: true,
      reason: ''
    }
  }

  const chat = ensureChat(db, chatId)
  const panel = ensureBanPanel(chat)

  if (!panel.enabled) {
    return {
      allowed: false,
      role: 'Usuario',
      isOwner: false,
      reason: 'El panel de permisos para admins está apagado.'
    }
  }

  const senderIsAdmin = await isGroupAdmin(client, m, m.sender, senderReal)

  if (!senderIsAdmin) {
    return {
      allowed: false,
      role: 'Usuario',
      isOwner: false,
      reason: 'Solo admins del grupo autorizados pueden usar este comando.'
    }
  }

  if (panel.mode === 'all') {
    return {
      allowed: true,
      role: 'Admin autorizado',
      isOwner: false,
      reason: ''
    }
  }

  if (isAllowedInPanel(panel, m.sender, senderReal)) {
    return {
      allowed: true,
      role: 'Admin autorizado',
      isOwner: false,
      reason: ''
    }
  }

  return {
    allowed: false,
    role: 'Admin sin permiso',
    isOwner: false,
    reason: 'Eres admin, pero el owner no te dio permiso para usar ban/unban.'
  }
}

function panelStatusText(panel) {
  const estado = panel.enabled ? 'ACTIVADO' : 'DESACTIVADO'
  const modo = panel.mode === 'all'
    ? 'Todos los admins del grupo'
    : 'Solo admins agregados por el owner'

  return (
    `╭─〔 🛡️ PANEL BAN/UNBAN 〕─╮\n` +
    `│ Estado: ${estado}\n` +
    `│ Modo: ${modo}\n` +
    `│ Admins autorizados: ${panel.allowed.length}\n` +
    `│ Última edición: ${panel.updatedAt || 'Sin registro'}\n` +
    `╰──────────────────────╯`
  )
}

async function handlePanelCommand({ client, m, args, usedPrefix, command, db, chatId, senderReal, senderIsOwner }) {
  const chat = ensureChat(db, chatId)
  const panel = ensureBanPanel(chat)

  if (!senderIsOwner) {
    return m.reply(
      `╭─〔 ⛔ ACCESO DENEGADO 〕─╮\n` +
      `│ Solo el owner puede configurar\n` +
      `│ el panel de ban/unban.\n` +
      `╰──────────────────────╯`
    )
  }

  const action = String(args[0] || 'status').toLowerCase()

  if (['help', 'ayuda'].includes(action)) {
    return m.reply(
      `╭─〔 🛡️ PANEL BAN/UNBAN 〕─╮\n` +
      `│ ${usedPrefix}${command} on\n` +
      `│ ${usedPrefix}${command} off\n` +
      `│ ${usedPrefix}${command} all\n` +
      `│ ${usedPrefix}${command} listmode\n` +
      `│ ${usedPrefix}${command} add @admin\n` +
      `│ ${usedPrefix}${command} del @admin\n` +
      `│ ${usedPrefix}${command} list\n` +
      `│ ${usedPrefix}${command} status\n` +
      `╰──────────────────────╯`
    )
  }

  if (['status', 'estado'].includes(action)) {
    return m.reply(panelStatusText(panel))
  }

  if (['on', 'activar', 'enable'].includes(action)) {
    panel.enabled = true
    panel.updatedAt = limaDate()
    panel.updatedBy = senderReal

    return m.reply(
      `╭─〔 ✅ PANEL ACTIVADO 〕─╮\n` +
      `│ Los admins autorizados ya podrán\n` +
      `│ usar ban/unban en este grupo.\n` +
      `│\n` +
      `│ Modo actual: ${panel.mode === 'all' ? 'Todos los admins' : 'Lista autorizada'}\n` +
      `╰────────────────────╯`
    )
  }

  if (['off', 'desactivar', 'disable'].includes(action)) {
    panel.enabled = false
    panel.updatedAt = limaDate()
    panel.updatedBy = senderReal

    return m.reply(
      `╭─〔 📴 PANEL DESACTIVADO 〕─╮\n` +
      `│ Desde ahora solo el owner podrá\n` +
      `│ usar ban/unban en este grupo.\n` +
      `╰──────────────────────╯`
    )
  }

  if (['all', 'todos', 'admins'].includes(action)) {
    panel.enabled = true
    panel.mode = 'all'
    panel.updatedAt = limaDate()
    panel.updatedBy = senderReal

    return m.reply(
      `╭─〔 ✅ MODO TODOS LOS ADMINS 〕─╮\n` +
      `│ Todos los admins del grupo podrán\n` +
      `│ usar ban/unban, excepto contra owners.\n` +
      `╰────────────────────────╯`
    )
  }

  if (['listmode', 'lista', 'privado', 'manual'].includes(action)) {
    panel.enabled = true
    panel.mode = 'list'
    panel.updatedAt = limaDate()
    panel.updatedBy = senderReal

    return m.reply(
      `╭─〔 ✅ MODO LISTA AUTORIZADA 〕─╮\n` +
      `│ Solo los admins agregados por el owner\n` +
      `│ podrán usar ban/unban.\n` +
      `│\n` +
      `│ Usa: ${usedPrefix}${command} add @admin\n` +
      `╰────────────────────────╯`
    )
  }

  if (['add', 'agregar', 'dar', 'permitir'].includes(action)) {
    const targetRaw = extractTarget(m, args.slice(1))

    if (!targetRaw) {
      return m.reply(
        `╭─〔 ⚠️ FALTA USUARIO 〕─╮\n` +
        `│ Debes mencionar a un admin.\n` +
        `│ Ejemplo:\n` +
        `│ ${usedPrefix}${command} add @admin\n` +
        `╰────────────────────╯`
      )
    }

    const targetReal = await resolveLidToRealJid(targetRaw, client, m.chat)

    const targetIsOwner =
      isOwnerUser(targetRaw) ||
      isOwnerUser(targetReal)

    if (targetIsOwner) {
      return m.reply(
        `╭─〔 ℹ️ OWNER DETECTADO 〕─╮\n` +
        `│ El owner ya tiene permisos completos.\n` +
        `│ No necesita agregarse al panel.\n` +
        `╰──────────────────────╯`
      )
    }

    const targetIsAdmin = await isGroupAdmin(client, m, targetRaw, targetReal)

    if (!targetIsAdmin) {
      return client.sendMessage(m.chat, {
        text:
          `╭─〔 ⚠️ NO ES ADMIN 〕─╮\n` +
          `│ Usuario: @${onlyNumber(targetReal)}\n` +
          `│ Solo puedes autorizar admins\n` +
          `│ reales del grupo.\n` +
          `╰──────────────────╯`,
        mentions: [targetReal]
      }, { quoted: m })
    }

    const added = addAllowedAdmin(panel, targetReal)

    panel.enabled = true
    panel.mode = 'list'
    panel.updatedAt = limaDate()
    panel.updatedBy = senderReal

    return client.sendMessage(m.chat, {
      text:
        `╭─〔 ✅ ADMIN AUTORIZADO 〕─╮\n` +
        `│ Usuario: @${onlyNumber(targetReal)}\n` +
        `│ Permiso: ban/unban\n` +
        `│ Estado: ${added ? 'Agregado' : 'Ya estaba agregado'}\n` +
        `│\n` +
        `│ Este permiso solo aplica en este grupo.\n` +
        `╰──────────────────────╯`,
      mentions: [targetReal]
    }, { quoted: m })
  }

  if (['del', 'remove', 'quitar', 'remover'].includes(action)) {
    const targetRaw = extractTarget(m, args.slice(1))

    if (!targetRaw) {
      return m.reply(
        `╭─〔 ⚠️ FALTA USUARIO 〕─╮\n` +
        `│ Debes mencionar al admin.\n` +
        `│ Ejemplo:\n` +
        `│ ${usedPrefix}${command} del @admin\n` +
        `╰────────────────────╯`
      )
    }

    const targetReal = await resolveLidToRealJid(targetRaw, client, m.chat)
    const removed = removeAllowedAdmin(panel, targetRaw, targetReal)

    panel.updatedAt = limaDate()
    panel.updatedBy = senderReal

    return client.sendMessage(m.chat, {
      text:
        `╭─〔 ✅ PERMISO RETIRADO 〕─╮\n` +
        `│ Usuario: @${onlyNumber(targetReal)}\n` +
        `│ Estado: ${removed ? 'Retirado' : 'No estaba en la lista'}\n` +
        `╰──────────────────────╯`,
      mentions: [targetReal]
    }, { quoted: m })
  }

  if (['list', 'lista'].includes(action)) {
    if (!panel.allowed.length) {
      return m.reply(
        `╭─〔 🛡️ ADMINS AUTORIZADOS 〕─╮\n` +
        `│ No hay admins agregados manualmente.\n` +
        `│\n` +
        `│ Usa:\n` +
        `│ ${usedPrefix}${command} add @admin\n` +
        `╰────────────────────────╯`
      )
    }

    const text = panel.allowed.map((jid, index) => {
      return `${index + 1}. wa.me/${onlyNumber(jid)}`
    }).join('\n')

    return m.reply(
      `╭─〔 🛡️ ADMINS AUTORIZADOS 〕─╮\n` +
      `│ Total: ${panel.allowed.length}\n` +
      `╰────────────────────────╯\n\n` +
      text
    )
  }

  return m.reply(
    `╭─〔 ⚠️ OPCIÓN NO VÁLIDA 〕─╮\n` +
    `│ Usa:\n` +
    `│ ${usedPrefix}${command} help\n` +
    `╰────────────────────╯`
  )
}

export default {
  command: [
    'ban',
    'unban',
    'baninfo',
    'banlist',
    'banpanel',
    'banadmin'
  ],
  category: 'owner',
  group: true,

  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const cmd = String(command || m.command || '').toLowerCase()

    const senderReal = await resolveLidToRealJid(m.sender, client, m.chat)

    const senderIsOwner =
      isOwnerUser(m.sender) ||
      isOwnerUser(senderReal)

    if (cmd === 'banpanel' || cmd === 'banadmin') {
      return handlePanelCommand({
        client,
        m,
        args,
        usedPrefix,
        command: cmd,
        db,
        chatId,
        senderReal,
        senderIsOwner
      })
    }

    const permission = await getBanPermission({
      client,
      m,
      db,
      chatId,
      senderReal
    })

    if (!permission.allowed) {
      return m.reply(
        `╭─〔 ⛔ ACCESO DENEGADO 〕─╮\n` +
        `│ Este comando solo puede usarlo:\n` +
        `│ • Owner\n` +
        `│ • Admin autorizado por el owner\n` +
        `│\n` +
        `│ Motivo:\n` +
        `│ ${permission.reason}\n` +
        `╰──────────────────────╯`
      )
    }

    if (cmd === 'banlist') {
      const users = db.users || {}
      const bannedUsers = []
      const seen = new Set()

      for (const [jid, data] of Object.entries(users)) {
        if (!getBanStatus(data)) continue

        const number = onlyNumber(jid)
        if (seen.has(number)) continue
        seen.add(number)

        bannedUsers.push({
          jid,
          number,
          reason: data.banReason || data.banInfo?.reason || BAN_CONFIG.defaultReason,
          date: data.banDate || data.banInfo?.date || 'Sin fecha',
          attempts: data.banWarnCount || data.banInfo?.attempts || 0
        })
      }

      if (bannedUsers.length === 0) {
        return m.reply(
          `╭─〔 🛡️ LISTA DE BANEADOS 〕─╮\n` +
          `│ No hay usuarios baneados actualmente.\n` +
          `╰────────────────────────╯`
        )
      }

      const text = bannedUsers.map((u, i) => {
        return (
          `╭─〔 ${i + 1}. USUARIO BANEADO 〕\n` +
          `│ Número: wa.me/${u.number}\n` +
          `│ Motivo: ${u.reason}\n` +
          `│ Fecha: ${u.date}\n` +
          `│ Intentos bloqueados: ${u.attempts}\n` +
          `╰────────────────────`
        )
      }).join('\n\n')

      return m.reply(
        `╭─〔 🛡️ LISTA DE BANEADOS 〕─╮\n` +
        `│ Total: ${bannedUsers.length}\n` +
        `│ Consultado por: ${permission.role}\n` +
        `╰────────────────────────╯\n\n` +
        text
      )
    }

    const targetRaw = extractTarget(m, args)

    if (!targetRaw) {
      return m.reply(
        `╭─〔 ⚠️ USO CORRECTO 〕─╮\n` +
        `│ Debes mencionar o responder a un usuario.\n` +
        `│\n` +
        `│ Ejemplos:\n` +
        `│ ${usedPrefix}ban @usuario spam\n` +
        `│ ${usedPrefix}unban @usuario\n` +
        `│ ${usedPrefix}baninfo @usuario\n` +
        `│ ${usedPrefix}banlist\n` +
        `│\n` +
        `│ Panel owner:\n` +
        `│ ${usedPrefix}banpanel help\n` +
        `╰────────────────────╯`
      )
    }

    const targetReal = await resolveLidToRealJid(targetRaw, client, m.chat)

    const targetIsOwner =
      isOwnerUser(targetRaw) ||
      isOwnerUser(targetReal)

    if (targetIsOwner) {
      return m.reply(
        `╭─〔 ⛔ OPERACIÓN CANCELADA 〕─╮\n` +
        `│ No puedes banear, revisar o modificar\n` +
        `│ el estado de restricción del owner.\n` +
        `╰──────────────────────────╯`
      )
    }

    const aliases = buildAliases(targetRaw, targetReal)
    const targetName = getUserName(db, targetReal, 'Usuario')
    const reason = extractReason(args)

    const globalRecords = aliases
      .map(jid => ensureGlobalUser(db, jid))
      .filter(Boolean)

    const chatRecords = aliases
      .map(jid => ensureChatUser(db, chatId, jid))
      .filter(Boolean)

    if (cmd === 'ban') {
      const alreadyBanned =
        globalRecords.some(getBanStatus) ||
        chatRecords.some(getBanStatus)

      if (alreadyBanned) {
        return client.sendMessage(m.chat, {
          text:
            `╭─〔 🛡️ USUARIO YA BANEADO 〕─╮\n` +
            `│ Usuario: @${onlyNumber(targetReal)}\n` +
            `│ Estado: BANEADO\n` +
            `│ Acción: No se realizaron cambios.\n` +
            `╰────────────────────────╯`,
          mentions: [targetReal]
        }, { quoted: m })
      }

      const banData = makeBanData({
        targetJid: targetRaw,
        targetRealJid: targetReal,
        ownerJid: m.sender,
        ownerRealJid: senderReal,
        chatId,
        reason
      })

      for (const record of globalRecords) applyBanToRecord(record, banData)
      for (const record of chatRecords) applyBanToRecord(record, banData)

      return client.sendMessage(m.chat, {
        text:
          `╭─〔 🛡️ SANCIÓN APLICADA 〕─╮\n` +
          `│ Usuario: @${onlyNumber(targetReal)}\n` +
          `│ Nombre: ${targetName}\n` +
          `│ Estado: BANEADO DEL BOT\n` +
          `│ Motivo: ${reason}\n` +
          `│ Fecha: ${banData.banDate}\n` +
          `│ Aplicado por: ${permission.role}\n` +
          `│\n` +
          `│ El usuario ya no podrá ejecutar\n` +
          `│ comandos del bot hasta ser desbaneado.\n` +
          `╰────────────────────────╯`,
        mentions: [targetReal]
      }, { quoted: m })
    }

    if (cmd === 'unban') {
      const wasBanned =
        globalRecords.some(getBanStatus) ||
        chatRecords.some(getBanStatus)

      if (!wasBanned) {
        return client.sendMessage(m.chat, {
          text:
            `╭─〔 ℹ️ USUARIO NO BANEADO 〕─╮\n` +
            `│ Usuario: @${onlyNumber(targetReal)}\n` +
            `│ Estado: ACTIVO\n` +
            `│ No tenía una restricción vigente.\n` +
            `╰────────────────────────╯`,
          mentions: [targetReal]
        }, { quoted: m })
      }

      for (const record of globalRecords) removeBanFromRecord(record, senderReal)
      for (const record of chatRecords) removeBanFromRecord(record, senderReal)

      return client.sendMessage(m.chat, {
        text:
          `╭─〔 ✅ SANCIÓN RETIRADA 〕─╮\n` +
          `│ Usuario: @${onlyNumber(targetReal)}\n` +
          `│ Nombre: ${targetName}\n` +
          `│ Estado: ACTIVO\n` +
          `│ Fecha: ${limaDate()}\n` +
          `│ Retirado por: ${permission.role}\n` +
          `│\n` +
          `│ El usuario ya puede volver a usar\n` +
          `│ los comandos del bot normalmente.\n` +
          `╰──────────────────────╯`,
        mentions: [targetReal]
      }, { quoted: m })
    }

    if (cmd === 'baninfo') {
      const record =
        globalRecords.find(getBanStatus) ||
        chatRecords.find(getBanStatus)

      if (!record) {
        return client.sendMessage(m.chat, {
          text:
            `╭─〔 🛡️ INFORMACIÓN DE BAN 〕─╮\n` +
            `│ Usuario: @${onlyNumber(targetReal)}\n` +
            `│ Estado: ACTIVO\n` +
            `│ Restricción: No registra ban vigente.\n` +
            `╰────────────────────────╯`,
          mentions: [targetReal]
        }, { quoted: m })
      }

      return client.sendMessage(m.chat, {
        text:
          `╭─〔 🛡️ INFORMACIÓN DE BAN 〕─╮\n` +
          `│ Usuario: @${onlyNumber(targetReal)}\n` +
          `│ Nombre: ${targetName}\n` +
          `│ Estado: BANEADO DEL BOT\n` +
          `│ Motivo: ${record.banReason || record.banInfo?.reason || BAN_CONFIG.defaultReason}\n` +
          `│ Fecha: ${record.banDate || record.banInfo?.date || 'Sin fecha'}\n` +
          `│ Aplicado por: ${record.bannedByNumber || record.banInfo?.byNumber || 'Owner'}\n` +
          `│ Intentos bloqueados: ${record.banWarnCount || 0}\n` +
          `│ Recordatorio cada: ${record.banWarnEvery || BAN_CONFIG.warnEvery} comandos\n` +
          `│ Consultado por: ${permission.role}\n` +
          `╰────────────────────────╯`,
        mentions: [targetReal]
      }, { quoted: m })
    }
  }
}