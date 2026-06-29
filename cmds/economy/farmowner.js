import { saveDB } from '../../core/vipNormalBonus.js'
import { resolveLidToRealJid, sameUserIdentity, onlyNumber } from '../../core/utils.js'

const FARM_CONFIG_KEY = '__farmConfig'
const HARD_MAX_ACCUMULATED_HOURS = 6
const DEFAULT_MAX_COLLECT_PAYOUT = 2000000

const DEFAULT_FARM_CONFIG = {
  version: 1,
  pricePerFarm: 5000,
  upgradeMultiplier: 5000,
  repairMultiplier: 2000,
  damageProbability: 0.05,
  maxAccumulatedHours: 6,
  maxCollectPayout: DEFAULT_MAX_COLLECT_PAYOUT,
  harvestPaused: false,
  harvestPausedAt: 0,
  harvestPausedBy: '',
  lastSyncAllAt: 0,
  types: {
    fish: {
      emoji: '🐟',
      name: 'Pesca',
      price: 5000,
      production: 500,
      enabled: true
    },
    hunt: {
      emoji: '🦌',
      name: 'Caza',
      price: 7000,
      production: 700,
      enabled: true
    },
    mine: {
      emoji: '⛏️',
      name: 'Minería',
      price: 10000,
      production: 1000,
      enabled: true
    },
    crop: {
      emoji: '🌾',
      name: 'Cultivo',
      price: 3500,
      production: 300,
      enabled: true
    }
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeTypeId(type = '') {
  return String(type || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
}

function resolveFarmPrice(type, farmType, config) {
  const explicitPrice = Number(farmType.price)
  if (Number.isFinite(explicitPrice) && explicitPrice > 0) return Math.floor(explicitPrice)

  const defaults = DEFAULT_FARM_CONFIG.types[type]
  const legacyPrice = Number(config.pricePerFarm)
  const production = Math.max(0, Number(farmType.production ?? defaults?.production ?? 0))

  return Math.max(
    1,
    Math.floor(Math.max(
      defaults?.price || DEFAULT_FARM_CONFIG.pricePerFarm,
      legacyPrice > 0 ? legacyPrice : 0,
      production * 9
    ))
  )
}

function ensureFarmConfig() {
  global.db.data.settings ||= {}

  const config = global.db.data.settings[FARM_CONFIG_KEY] ||= clone(DEFAULT_FARM_CONFIG)

  config.version = 1
  config.pricePerFarm = Math.max(0, Math.floor(Number(config.pricePerFarm ?? DEFAULT_FARM_CONFIG.pricePerFarm)))
  config.upgradeMultiplier = Math.max(0, Math.floor(Number(config.upgradeMultiplier ?? DEFAULT_FARM_CONFIG.upgradeMultiplier)))
  config.repairMultiplier = Math.max(0, Math.floor(Number(config.repairMultiplier ?? DEFAULT_FARM_CONFIG.repairMultiplier)))
  config.damageProbability = Math.min(1, Math.max(0, Number(config.damageProbability ?? DEFAULT_FARM_CONFIG.damageProbability)))
  config.maxAccumulatedHours = Math.min(
    HARD_MAX_ACCUMULATED_HOURS,
    Math.max(1, Math.floor(Number(config.maxAccumulatedHours ?? DEFAULT_FARM_CONFIG.maxAccumulatedHours)))
  )
  config.maxCollectPayout = Math.max(0, Math.floor(Number(config.maxCollectPayout ?? DEFAULT_FARM_CONFIG.maxCollectPayout)))
  config.harvestPaused = Boolean(config.harvestPaused)
  config.harvestPausedAt = Math.max(0, Number(config.harvestPausedAt || 0))
  config.harvestPausedBy = String(config.harvestPausedBy || '')
  config.lastSyncAllAt = Math.max(0, Number(config.lastSyncAllAt || 0))
  config.types ||= {}

  for (const [type, defaults] of Object.entries(DEFAULT_FARM_CONFIG.types)) {
    config.types[type] ||= clone(defaults)
  }

  for (const [type, farmType] of Object.entries(config.types)) {
    farmType.emoji = String(farmType.emoji || DEFAULT_FARM_CONFIG.types[type]?.emoji || '🏠')
    farmType.name = String(farmType.name || DEFAULT_FARM_CONFIG.types[type]?.name || type)
    farmType.production = Math.max(0, Math.floor(Number(farmType.production || 0)))
    farmType.price = resolveFarmPrice(type, farmType, config)
    farmType.enabled = farmType.enabled !== false
  }

  return config
}

function parseAmount(value) {
  if (value === null || value === undefined) return NaN

  let text = String(value).trim().toLowerCase()
  let multiplier = 1

  if (text.endsWith('k')) {
    multiplier = 1000
    text = text.slice(0, -1)
  } else if (text.endsWith('m')) {
    multiplier = 1000000
    text = text.slice(0, -1)
  } else if (text.endsWith('b')) {
    multiplier = 1000000000
    text = text.slice(0, -1)
  }

  const clean = text.replace(/[^\d.-]/g, '')
  const number = Number(clean)

  if (!Number.isFinite(number)) return NaN
  return Math.floor(number * multiplier)
}

function parsePercent(value) {
  if (value === null || value === undefined) return NaN

  const text = String(value).trim()

  if (text.endsWith('%')) {
    const raw = Number(text.replace('%', '').trim())
    return Number.isFinite(raw) ? raw / 100 : NaN
  }

  const number = Number(text)
  if (!Number.isFinite(number)) return NaN

  return number > 1 ? number / 100 : number
}

function getValue(raw, keys) {
  const pattern = new RegExp(
    `(?:^|\\s)(?:${keys.join('|')})\\s*(?:[:=]|\\s)\\s*([^\\n]+?)(?=\\s+(?:emoji|name|nombre|price|precio|valor|prod|production|produccion|enabled|estado)\\s*(?:[:=]|\\s)|$)`,
    'i'
  )

  const match = raw.match(pattern)
  return match ? match[1].trim() : null
}

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function formatMoney(amount = 0, currency = 'Soles') {
  return `S/${formatNumber(Math.floor(Number(amount || 0)))} ${currency}`
}

function formatPercent(value = 0) {
  return `${Math.round(Number(value || 0) * 10000) / 100}%`
}

function formatDate(timestamp = 0) {
  const value = Number(timestamp || 0)
  if (!value) return 'Nunca'

  return new Date(value).toLocaleString('es-PE')
}

function getCurrency(client) {
  const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net'
  return global.db.data.settings?.[botId]?.currency || 'Soles'
}

function listFarmTypes(config, currency = 'Soles') {
  const entries = Object.entries(config.types || {})
    .sort(([a], [b]) => a.localeCompare(b))

  if (!entries.length) {
    return '│ ❌ No hay granjas creadas.\n'
  }

  return entries.map(([type, data]) => {
    return (
      `│ ${data.emoji} *${type}* — ${data.name}\n` +
      `│  Precio: ${formatMoney(data.price, currency)}\n` +
      `│  Producción: ${formatMoney(data.production, currency)} por hora/nivel\n` +
      `│  Estado: ${data.enabled === false ? 'Oculta/Desactivada' : 'Visible/Activa'}`
    )
  }).join('\n│\n')
}

function ownerMenu(config, usedPrefix = '.', currency = 'Soles') {
  return `╭━━━〔 👑 FARMOWNER 〕━━━╮
│
│ Panel privado del owner para controlar
│ precios, producción, daño y granjas.
│
│ Moneda actual: ${currency}
│
├━━〔 1. GRANJAS ACTUALES 〕━━┫
${listFarmTypes(config, currency)}
│
├━━〔 2. CAMBIAR PRECIO DE UNA GRANJA 〕━━┫
│ Cada granja tiene su propio precio.
│
│ Comando:
│ ${usedPrefix}farmowner price <granja> <precio>
│
│ Ejemplos:
│ ${usedPrefix}farmowner price crop 20000
│ ${usedPrefix}farmowner price mine 75000
│
├━━〔 3. CAMBIAR PRODUCCIÓN 〕━━┫
│ La producción es por hora y por nivel.
│
│ Comando:
│ ${usedPrefix}farmowner prod <granja> <producción>
│
│ Ejemplos:
│ ${usedPrefix}farmowner prod crop 10000
│ ${usedPrefix}farmowner prod fish 1500
│
├━━〔 4. CREAR NUEVA GRANJA 〕━━┫
│ Comando:
│ ${usedPrefix}farmowner create <id> emoji:<emoji> name:<nombre> price:<precio> prod:<producción>
│
│ Ejemplo:
│ ${usedPrefix}farmowner create dragon emoji:🐉 name:Dragones price:100000 prod:2500
│
├━━〔 5. EDITAR GRANJA 〕━━┫
│ ${usedPrefix}farmowner emoji <granja> <emoji>
│ ${usedPrefix}farmowner name <granja> <nombre>
│ ${usedPrefix}farmowner show <granja>
│ ${usedPrefix}farmowner hide <granja>
│ ${usedPrefix}farmowner delete <granja>
│
├━━〔 6. AJUSTES GENERALES 〕━━┫
│ Mejora: nivel actual × ${formatMoney(config.upgradeMultiplier, currency)}
│ Reparación: nivel actual × ${formatMoney(config.repairMultiplier, currency)}
│ Máximo acumulable: ${config.maxAccumulatedHours} horas
│ Tope por cobro/granja: ${formatMoney(config.maxCollectPayout, currency)}
│ Probabilidad de daño: ${formatPercent(config.damageProbability)}
│
│ ${usedPrefix}farmowner upgrade <precio_por_nivel>
│ ${usedPrefix}farmowner repair <precio_por_nivel>
│ ${usedPrefix}farmowner maxhours <horas>
│ ${usedPrefix}maxhours <horas>
│ ${usedPrefix}farmowner payoutcap <monto>
│ ${usedPrefix}farmowner damage <porcentaje>
│ ${usedPrefix}farmowner resetconfig
│
├━━〔 7. CONTROL DE USUARIOS 〕━━┫
│ ${usedPrefix}farmowner give @user <granja> <niveles>
│ ${usedPrefix}farmowner take @user <granja> <niveles>
│ ${usedPrefix}farmowner setlevel @user <granja> <nivel>
│ ${usedPrefix}farmowner damageuser @user <granja>
│ ${usedPrefix}farmowner repairuser @user <granja>
│ ${usedPrefix}farmowner resetuser @user
│ ${usedPrefix}farmowner user @user
│
╰━━━━━━━━━━━━━━━━━━━━━━╯`
}

function ensureFarmStorage(user) {
  if (!user.farms || typeof user.farms !== 'object' || Array.isArray(user.farms)) {
    user.farms = {}
  }

  return user.farms
}

function ensureFarm(user, type) {
  const farms = ensureFarmStorage(user)

  farms[type] ||= {
    level: 0,
    lastHarvest: 0,
    damaged: false
  }

  farms[type].level = Math.max(0, Math.floor(Number(farms[type].level || 0)))
  farms[type].lastHarvest = Math.max(0, Number(farms[type].lastHarvest || 0))
  farms[type].damaged = Boolean(farms[type].damaged)

  return farms[type]
}

function getMentionList(m) {
  const mentioned =
    m.mentionedJid ||
    m.mentions ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    []

  return Array.isArray(mentioned) ? mentioned : []
}

function hasExplicitMention(m) {
  return getMentionList(m).length > 0
}

function getMentionedJid(m) {
  const mentioned = getMentionList(m)

  if (Array.isArray(mentioned) && mentioned[0]) return mentioned[0]
  if (m.quoted?.sender) return m.quoted.sender

  return null
}

async function getTargetUser(client, m) {
  if (!m.isGroup) return null

  const rawTarget = getMentionedJid(m)
  if (!rawTarget) return null

  const realTarget = await resolveLidToRealJid(rawTarget, client, m.chat).catch(() => rawTarget)

  global.db.data.chats ||= {}
  global.db.data.chats[m.chat] ||= {}
  global.db.data.chats[m.chat].users ||= {}

  const users = global.db.data.chats[m.chat].users
  const key = Object.keys(users).find((jid) => sameUserIdentity(jid, realTarget)) || realTarget

  users[key] ||= {
    id: key,
    name: `Usuario ${onlyNumber(key) || key}`,
    coins: 0,
    bank: 0
  }

  return {
    jid: key,
    user: users[key]
  }
}

function requireFarmType(config, type) {
  const id = normalizeTypeId(type)
  return {
    id,
    data: config.types[id] || null
  }
}

function userFarmInfo(user, config, targetJid, currency) {
  const farms = ensureFarmStorage(user)
  const entries = Object.entries(farms)
    .filter(([, farm]) => Number(farm?.level || 0) > 0)
    .sort(([a], [b]) => a.localeCompare(b))

  let text = `╭━━━〔 👤🌾 FARM USER 〕━━━╮
│
│ Usuario: @${targetJid.split('@')[0]}
│
`

  if (!entries.length) {
    text += `│ ❌ Este usuario no tiene granjas.\n`
  } else {
    for (const [type, farm] of entries) {
      const farmType = config.types[type] || {
        emoji: '🏠',
        name: type,
        production: 0,
        enabled: false
      }

      text +=
        `│ ${farmType.emoji} *${type}* — ${farmType.name}\n` +
        `│  Nivel: ${formatNumber(farm.level)}\n` +
        `│  Precio base: ${formatMoney(farmType.price, currency)}\n` +
        `│  Producción/hora: ${formatMoney(Number(farm.level || 0) * Number(farmType.production || 0), currency)}\n` +
        `│  Estado: ${farm.damaged ? 'Dañada ❌' : 'Activa ✅'}\n` +
        `│\n`
    }
  }

  text += `╰━━━━━━━━━━━━━━━━━━━━━━╯`
  return text
}


function getGroupName(chatId) {
  const chatData = global.db?.data?.chats?.[chatId] || {}
  return (
    chatData.subject ||
    chatData.name ||
    chatData.metadata?.subject ||
    `Grupo ${chatId.split('@')[0]}`
  )
}

function getFarmOwnersInChat(chatId, farmTypeId) {
  global.db.data.chats ||= {}
  const chatData = global.db.data.chats[chatId] || {}
  const users = chatData.users || {}

  const results = []

  for (const [jid, user] of Object.entries(users)) {
    const farms = user?.farms
    const farm = farms?.[farmTypeId]

    if (!farm) continue

    const level = Math.max(0, Math.floor(Number(farm.level || 0)))
    if (level <= 0) continue

    results.push({
      chatId,
      jid,
      name: user?.name || `Usuario ${onlyNumber(jid) || jid}`,
      level,
      damaged: Boolean(farm.damaged),
      lastHarvest: Math.max(0, Number(farm.lastHarvest || 0))
    })
  }

  results.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level
    return a.jid.localeCompare(b.jid)
  })

  return results
}

function syncUserFarms(user, now) {
  const farms = user?.farms
  const result = {
    farms: 0,
    updated: 0
  }

  if (!farms || typeof farms !== 'object' || Array.isArray(farms)) {
    return result
  }

  for (const farm of Object.values(farms)) {
    if (!farm || typeof farm !== 'object' || Array.isArray(farm)) continue

    const level = Math.max(0, Math.floor(Number(farm.level || 0)))
    if (level <= 0) continue

    result.farms += 1
    if (Number(farm.lastHarvest || 0) !== now) result.updated += 1
    farm.lastHarvest = now
  }

  return result
}

function syncAllFarmHarvests(now = Date.now()) {
  global.db.data.chats ||= {}

  const stats = {
    chats: 0,
    users: 0,
    farms: 0,
    updated: 0,
    now
  }

  for (const chatData of Object.values(global.db.data.chats)) {
    const users = chatData?.users
    if (!users || typeof users !== 'object' || Array.isArray(users)) continue

    let chatHasFarms = false

    for (const user of Object.values(users)) {
      const result = syncUserFarms(user, now)
      if (!result.farms) continue

      chatHasFarms = true
      stats.users += 1
      stats.farms += result.farms
      stats.updated += result.updated
    }

    if (chatHasFarms) stats.chats += 1
  }

  return stats
}

function formatFarmOwnersReport({
  config,
  type,
  farmType,
  currency,
  usedPrefix,
  scopeLabel,
  rows
}) {
  let text =
    `╭━━━〔 👥🌾 FARMOWNERS: ${scopeLabel} 〕━━━╮\n\n` +
    `│ Granja: ${farmType.emoji} ${type} — ${farmType.name}\n` +
    `│ Precio base: ${formatMoney(farmType.price, currency)}\n` +
    `│ Producción base: ${formatMoney(farmType.production, currency)} por hora/nivel\n` +
    `│ Estado global: ${farmType.enabled ? 'Visible/Activa' : 'Oculta/Desactivada'}\n\n`

  if (!rows.length) {
    text +=
      `│ ❌ No se encontraron usuarios con esta granja.\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    return text
  }

  let totalLevels = 0

  for (const row of rows) {
    totalLevels += row.level

    if (row.chatId) {
      text += `│ Grupo: ${getGroupName(row.chatId)}\n`
    }

    text +=
      `│ Usuario: @${row.jid.split('@')[0]}\n` +
      `│ Nombre: ${row.name}\n` +
      `│ Nivel: ${formatNumber(row.level)}\n` +
      `│ Producción/hora: ${formatMoney(row.level * Number(farmType.production || 0), currency)}\n` +
      `│ Estado: ${row.damaged ? 'Dañada ❌' : 'Activa ✅'}\n` +
      `│\n`
  }

  text +=
    `│ Total usuarios: ${formatNumber(rows.length)}\n` +
    `│ Total niveles: ${formatNumber(totalLevels)}\n` +
    `│\n` +
    `│ Comandos:\n` +
    `│ ${usedPrefix}farmowner show ${type}\n` +
    `│ ${usedPrefix}farmowner show ${type} all\n` +
    `│ ${usedPrefix}farmowner hide ${type}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`

  return text
}


export default {
  command: ['farmowner', 'farmadmin', 'farmcontrol', 'granjasowner', 'maxhours'],
  category: 'owner',
  isOwner: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'farmowner') => {
    try {
      if (!m.isOwner) {
        return m.reply(`RubyJX Bot • comando restringido\nEl comando *${command}* solo puede ser usado por el owner.`)
      }

      const config = ensureFarmConfig()
      const currency = getCurrency(client)
      const normalizedCommand = String(command || 'farmowner').toLowerCase()
      const sub = normalizedCommand === 'maxhours' ? 'maxhours' : String(args[0] || '').toLowerCase()

      if (!sub || ['menu', 'help', 'panel', 'status'].includes(sub)) {
        return m.reply(ownerMenu(config, usedPrefix, currency))
      }

      if (sub === 'pause') {
        if (config.harvestPaused) {
          return m.reply(
            `🚧 GRANJAS YA ESTAN EN MANTENIMIENTO\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `Las cosechas, compras y mejoras publicas ya estan pausadas.\n` +
            `Pausado desde: ${formatDate(config.harvestPausedAt)}\n\n` +
            `Siguiente paso recomendado:\n` +
            `${usedPrefix}farmowner syncall`
          )
        }

        config.harvestPaused = true
        config.harvestPausedAt = Date.now()
        config.harvestPausedBy = m.sender || ''
        saveDB()

        return m.reply(
          `🚧 GRANJAS EN MANTENIMIENTO\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `Se pausaron cosechas, compras y mejoras publicas.\n\n` +
          `Los usuarios no podran cobrar produccion pendiente mientras esto este activo.\n` +
          `Ahora usa:\n` +
          `${usedPrefix}farmowner syncall`
        )
      }

      if (sub === 'syncall') {
        const stats = syncAllFarmHarvests(Date.now())

        config.lastSyncAllAt = stats.now
        config.lastSyncAllFarms = stats.farms
        config.lastSyncAllUsers = stats.users
        saveDB()

        return m.reply(
          `⏱️ SYNCALL DE GRANJAS COMPLETADO\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `Relojes reiniciados a: ${formatDate(stats.now)}\n\n` +
          `Grupos con granjas: ${formatNumber(stats.chats)}\n` +
          `Usuarios con granjas: ${formatNumber(stats.users)}\n` +
          `Granjas encontradas: ${formatNumber(stats.farms)}\n` +
          `Granjas sincronizadas: ${formatNumber(stats.updated)}\n\n` +
          `La produccion pendiente sin cobrar quedo en 0.\n` +
          `Niveles, tipos de granja, estado de dano y coins ya cobradas no fueron borradas.\n\n` +
          `Cuando quieras reactivar usa:\n` +
          `${usedPrefix}farmowner resume`
        )
      }

      if (sub === 'resume') {
        if (!config.harvestPaused) {
          return m.reply(
            `✅ GRANJAS YA ESTAN ACTIVAS\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `El sistema no estaba en mantenimiento.\n` +
            `Ultimo syncall: ${formatDate(config.lastSyncAllAt)}`
          )
        }

        config.harvestPaused = false
        config.harvestResumedAt = Date.now()
        saveDB()

        return m.reply(
          `✅ GRANJAS REACTIVADAS\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `Las cosechas, compras y mejoras publicas vuelven a funcionar.\n` +
          `Ultimo syncall: ${formatDate(config.lastSyncAllAt)}\n\n` +
          `La produccion nueva empieza a contar normalmente desde el ultimo reloj sincronizado.`
        )
      }

      if (sub === 'price') {
        const { id, data } = requireFarmType(config, args[1])
        const price = parseAmount(args[2])

        if (!data || !Number.isFinite(price) || price < 1) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner price <granja> <precio>\n\nEjemplos:\n${usedPrefix}farmowner price crop 20000\n${usedPrefix}farmowner price mine 75000`)
        }

        const old = data.price
        data.price = price
        saveDB()

        return m.reply(
          `╭━━━〔 🛒 PRECIO DE GRANJA ACTUALIZADO 〕━━━╮\n` +
          `│ Granja: ${data.emoji} ${id} — ${data.name}\n` +
          `│ Precio anterior: ${formatMoney(old, currency)}\n` +
          `│ Nuevo precio: ${formatMoney(data.price, currency)}\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'upgrade') {
        const price = parseAmount(args[1])
        if (!Number.isFinite(price) || price < 0) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner upgrade <precio_por_nivel>\n\nEjemplo:\n${usedPrefix}farmowner upgrade 12000`)
        }

        const old = config.upgradeMultiplier
        config.upgradeMultiplier = price
        saveDB()

        return m.reply(
          `╭━━━〔 ⬆️ MEJORA ACTUALIZADA 〕━━━╮\n` +
          `│ Valor anterior: ${formatMoney(old, currency)} por nivel\n` +
          `│ Nuevo valor: ${formatMoney(config.upgradeMultiplier, currency)} por nivel\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'repair') {
        const price = parseAmount(args[1])
        if (!Number.isFinite(price) || price < 0) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner repair <precio_por_nivel>\n\nEjemplo:\n${usedPrefix}farmowner repair 5000`)
        }

        const old = config.repairMultiplier
        config.repairMultiplier = price
        saveDB()

        return m.reply(
          `╭━━━〔 🛠️ REPARACIÓN ACTUALIZADA 〕━━━╮\n` +
          `│ Valor anterior: ${formatMoney(old, currency)} por nivel\n` +
          `│ Nuevo valor: ${formatMoney(config.repairMultiplier, currency)} por nivel\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'maxhours') {
        const hours = parseAmount(normalizedCommand === 'maxhours' ? args[0] : args[1])
        if (!Number.isFinite(hours) || hours < 1) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner maxhours <horas>\n${usedPrefix}maxhours <horas>\n\nEjemplo:\n${usedPrefix}maxhours 6`)
        }

        const old = config.maxAccumulatedHours
        const requested = Math.floor(hours)
        config.maxAccumulatedHours = Math.min(HARD_MAX_ACCUMULATED_HOURS, requested)
        saveDB()

        return m.reply(
          `╭━━━〔 📦 HORAS ACTUALIZADAS 〕━━━╮\n` +
          `│ Límite anterior: ${old} horas\n` +
          `│ Nuevo límite: ${config.maxAccumulatedHours} horas\n` +
          `${requested > HARD_MAX_ACCUMULATED_HOURS ? `│ Seguridad: el máximo duro es ${HARD_MAX_ACCUMULATED_HOURS} horas.\n` : ''}` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'payoutcap' || sub === 'capcobro' || sub === 'topcobro') {
        const amount = parseAmount(args[1])
        if (!Number.isFinite(amount) || amount < 0) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner payoutcap <monto>\n\nEjemplos:\n${usedPrefix}farmowner payoutcap 2000000\n${usedPrefix}farmowner payoutcap 0`)
        }

        const old = config.maxCollectPayout
        config.maxCollectPayout = Math.floor(amount)
        saveDB()

        return m.reply(
          `╭━━━〔 🧯 TOPE DE COBRO 〕━━━╮\n` +
          `│ Tope anterior: ${formatMoney(old, currency)}\n` +
          `│ Nuevo tope: ${config.maxCollectPayout > 0 ? formatMoney(config.maxCollectPayout, currency) : 'Desactivado'}\n` +
          `│ Aplica por granja cobrada.\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'damage') {
        const probability = parsePercent(args[1])
        if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner damage <porcentaje>\n\nEjemplos:\n${usedPrefix}farmowner damage 7%\n${usedPrefix}farmowner damage 0.07`)
        }

        const old = config.damageProbability
        config.damageProbability = probability
        saveDB()

        return m.reply(
          `╭━━━〔 💥 DAÑO ACTUALIZADO 〕━━━╮\n` +
          `│ Probabilidad anterior: ${formatPercent(old)}\n` +
          `│ Nueva probabilidad: ${formatPercent(config.damageProbability)}\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'create' || sub === 'add') {
        const id = normalizeTypeId(args[1])
        const raw = args.slice(2).join(' ').trim()
        const emoji = getValue(raw, ['emoji']) || args[2]
        const name = getValue(raw, ['name', 'nombre']) || id
        const priceRaw = getValue(raw, ['price', 'precio', 'valor']) || args[4]
        const productionRaw = getValue(raw, ['prod', 'production', 'produccion']) || args[3]
        const price = parseAmount(priceRaw)
        const production = parseAmount(productionRaw)

        if (!id || !emoji || !Number.isFinite(price) || price < 1 || !Number.isFinite(production) || production < 0) {
          return m.reply(
            `❌ Uso correcto:\n` +
            `${usedPrefix}farmowner create <id> emoji:<emoji> name:<nombre> price:<precio> prod:<producción>\n\n` +
            `Ejemplo:\n` +
            `${usedPrefix}farmowner create dragon emoji:🐉 name:Dragones price:100000 prod:2500`
          )
        }

        const existed = !!config.types[id]
        config.types[id] = {
          emoji: String(emoji).trim(),
          name: String(name).trim(),
          price,
          production,
          enabled: true
        }
        saveDB()

        return m.reply(
          `╭━━━〔 ${existed ? '✏️ GRANJA ACTUALIZADA' : '➕ GRANJA CREADA'} 〕━━━╮\n` +
          `│ ID: ${id}\n` +
          `│ Emoji: ${config.types[id].emoji}\n` +
          `│ Nombre: ${config.types[id].name}\n` +
          `│ Precio: ${formatMoney(config.types[id].price, currency)}\n` +
          `│ Producción: ${formatMoney(config.types[id].production, currency)} por hora/nivel\n` +
          `│ Estado: Visible/Activa\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'prod' || sub === 'production') {
        const { id, data } = requireFarmType(config, args[1])
        const production = parseAmount(args[2])

        if (!data || !Number.isFinite(production) || production < 0) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner prod <id> <producción>\n\nEjemplo:\n${usedPrefix}farmowner prod mine 4000`)
        }

        const old = data.production
        data.production = production
        saveDB()

        return m.reply(
          `╭━━━〔 📈 PRODUCCIÓN ACTUALIZADA 〕━━━╮\n` +
          `│ Granja: ${data.emoji} ${id} — ${data.name}\n` +
          `│ Producción anterior: ${formatMoney(old, currency)} por hora/nivel\n` +
          `│ Nueva producción: ${formatMoney(data.production, currency)} por hora/nivel\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'emoji') {
        const { id, data } = requireFarmType(config, args[1])
        const emoji = String(args[2] || '').trim()

        if (!data || !emoji) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner emoji <id> <emoji>\n\nEjemplo:\n${usedPrefix}farmowner emoji mine 💎`)
        }

        const old = data.emoji
        data.emoji = emoji
        saveDB()

        return m.reply(
          `╭━━━〔 🎨 EMOJI ACTUALIZADO 〕━━━╮\n` +
          `│ Granja: ${id} — ${data.name}\n` +
          `│ Emoji anterior: ${old}\n` +
          `│ Nuevo emoji: ${data.emoji}\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'name') {
        const { id, data } = requireFarmType(config, args[1])
        const name = args.slice(2).join(' ').trim()

        if (!data || !name) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner name <id> <nombre>\n\nEjemplo:\n${usedPrefix}farmowner name mine Mina de Cristal`)
        }

        const old = data.name
        data.name = name
        saveDB()

        return m.reply(
          `╭━━━〔 📝 NOMBRE ACTUALIZADO 〕━━━╮\n` +
          `│ ID: ${id}\n` +
          `│ Nombre anterior: ${old}\n` +
          `│ Nuevo nombre: ${data.name}\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

if (sub === 'hide' || sub === 'show') {
  const { id: type, data: farmType } = requireFarmType(config, args[1])

  if (!farmType) {
    return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner ${sub} <granja>\n${usedPrefix}farmowner show <granja> all`)
  }

  if (sub === 'hide') {
    farmType.enabled = false
    saveDB()

    return m.reply(
      `╭━━━〔 🙈 GRANJA OCULTA 〕━━━╮\n` +
      `│ Granja: ${farmType.emoji} ${type} — ${farmType.name}\n` +
      `│ Estado: Oculta/Desactivada para compras\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  const mode = String(args[2] || '').trim().toLowerCase()

  if (sub === 'show' && mode === 'all') {
    global.db.data.chats ||= {}

    const rows = Object.keys(global.db.data.chats)
      .filter((chatId) => chatId.endsWith('@g.us'))
      .flatMap((chatId) => getFarmOwnersInChat(chatId, type))

    const mentions = [...new Set(rows.map((row) => row.jid))]

    return client.reply(
      m.chat,
      formatFarmOwnersReport({
        config,
        type,
        farmType,
        currency,
        usedPrefix,
        scopeLabel: 'TODOS LOS GRUPOS',
        rows
      }),
      m,
      { mentions }
    )
  }

  if (sub === 'show') {
    if (!m.isGroup) {
      return m.reply(`❌ Este comando sin "all" debe usarse dentro de un grupo.\n\nUsa:\n${usedPrefix}farmowner show ${type} all`)
    }

    const rows = getFarmOwnersInChat(m.chat, type)
    const mentions = [...new Set(rows.map((row) => row.jid))]

    return client.reply(
      m.chat,
      formatFarmOwnersReport({
        config,
        type,
        farmType,
        currency,
        usedPrefix,
        scopeLabel: 'ESTE GRUPO',
        rows
      }),
      m,
      { mentions }
    )
  }
}

      if (sub === 'delete' || sub === 'removefarm') {
        const { id, data } = requireFarmType(config, args[1])

        if (!data) {
          return m.reply(`❌ Uso correcto:\n${usedPrefix}farmowner delete <id>`)
        }

        delete config.types[id]
        saveDB()

        return m.reply(
          `╭━━━〔 🗑️ GRANJA ELIMINADA 〕━━━╮\n` +
          `│ ID: ${id}\n` +
          `│ Nombre: ${data.name}\n` +
          `│ Nota: las granjas antiguas de usuarios quedarán como tipo desconocido si existían.\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (sub === 'resetconfig') {
        global.db.data.settings[FARM_CONFIG_KEY] = clone(DEFAULT_FARM_CONFIG)
        saveDB()

        return m.reply(
          `╭━━━〔 🔄 CONFIGURACIÓN REINICIADA 〕━━━╮\n` +
          `│ El sistema de granjas volvió a sus valores base.\n` +
          `│ Fish: ${formatMoney(DEFAULT_FARM_CONFIG.types.fish.price, currency)}\n` +
          `│ Hunt: ${formatMoney(DEFAULT_FARM_CONFIG.types.hunt.price, currency)}\n` +
          `│ Mine: ${formatMoney(DEFAULT_FARM_CONFIG.types.mine.price, currency)}\n` +
          `│ Crop: ${formatMoney(DEFAULT_FARM_CONFIG.types.crop.price, currency)}\n` +
          `│ Mejora: ${formatMoney(DEFAULT_FARM_CONFIG.upgradeMultiplier, currency)} por nivel\n` +
          `│ Reparación: ${formatMoney(DEFAULT_FARM_CONFIG.repairMultiplier, currency)} por nivel\n` +
          `│ Horas máximas: ${DEFAULT_FARM_CONFIG.maxAccumulatedHours}\n` +
          `│ Tope por cobro/granja: ${formatMoney(DEFAULT_FARM_CONFIG.maxCollectPayout, currency)}\n` +
          `│ Daño: ${formatPercent(DEFAULT_FARM_CONFIG.damageProbability)}\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        )
      }

      if (['give', 'take', 'setlevel', 'damageuser', 'repairuser', 'resetuser', 'user'].includes(sub)) {
        const target = await getTargetUser(client, m)

        if (!target) {
          return m.reply(
            `❌ Este subcomando necesita un usuario dentro de un grupo.\n\n` +
            `Ejemplos:\n` +
            `${usedPrefix}farmowner give @user fish 3\n` +
            `${usedPrefix}farmowner user @user`
          )
        }

        if (sub === 'user') {
          return client.reply(m.chat, userFarmInfo(target.user, config, target.jid, currency), m, {
            mentions: [target.jid]
          })
        }

        if (sub === 'resetuser') {
          target.user.farms = {}
          saveDB()

          return client.reply(
            m.chat,
            `╭━━━〔 🔄 GRANJAS REINICIADAS 〕━━━╮\n` +
            `│ Usuario: @${target.jid.split('@')[0]}\n` +
            `│ Todas sus granjas fueron eliminadas.\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            m,
            { mentions: [target.jid] }
          )
        }

        const typeIndex = hasExplicitMention(m) ? 2 : 1
        const type = normalizeTypeId(args[typeIndex])
        const farmType = config.types[type]

        if (!farmType) {
          return m.reply(`❌ Tipo de granja inválido.\nTipos disponibles: ${Object.keys(config.types).join(', ')}`)
        }

        const farm = ensureFarm(target.user, type)

        if (sub === 'damageuser') {
          farm.damaged = true
          saveDB()

          return client.reply(
            m.chat,
            `╭━━━〔 💥 GRANJA DAÑADA 〕━━━╮\n` +
            `│ Usuario: @${target.jid.split('@')[0]}\n` +
            `│ Granja: ${farmType.emoji} ${type} — ${farmType.name}\n` +
            `│ Estado: Dañada ❌\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            m,
            { mentions: [target.jid] }
          )
        }

        if (sub === 'repairuser') {
          farm.damaged = false
          farm.lastHarvest = Date.now()
          saveDB()

          return client.reply(
            m.chat,
            `╭━━━〔 🛠️ GRANJA REPARADA 〕━━━╮\n` +
            `│ Usuario: @${target.jid.split('@')[0]}\n` +
            `│ Granja: ${farmType.emoji} ${type} — ${farmType.name}\n` +
            `│ Estado: Activa ✅\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            m,
            { mentions: [target.jid] }
          )
        }

        const amount = parseAmount(args[typeIndex + 1])

        if (!Number.isFinite(amount) || amount < 0) {
          return m.reply(
            `❌ Uso correcto:\n` +
            `${usedPrefix}farmowner ${sub} @user <id> <cantidad>\n\n` +
            `Ejemplo:\n` +
            `${usedPrefix}farmowner give @user fish 3`
          )
        }

        const oldLevel = farm.level

        if (sub === 'give') {
          farm.level += amount
          if (farm.lastHarvest <= 0) farm.lastHarvest = Date.now()
        }

        if (sub === 'take') {
          farm.level = Math.max(0, farm.level - amount)
        }

        if (sub === 'setlevel') {
          farm.level = Math.max(0, Math.floor(amount))
          if (farm.level > 0 && farm.lastHarvest <= 0) farm.lastHarvest = Date.now()
        }

        saveDB()

        return client.reply(
          m.chat,
          `╭━━━〔 👤 GRANJA DE USUARIO ACTUALIZADA 〕━━━╮\n` +
          `│ Usuario: @${target.jid.split('@')[0]}\n` +
          `│ Granja: ${farmType.emoji} ${type} — ${farmType.name}\n` +
          `│ Nivel anterior: ${formatNumber(oldLevel)}\n` +
          `│ Nivel actual: ${formatNumber(farm.level)}\n` +
          `│ Estado: ${farm.damaged ? 'Dañada ❌' : 'Activa ✅'}\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`,
          m,
          { mentions: [target.jid] }
        )
      }

      return m.reply(ownerMenu(config, usedPrefix, currency))
    } catch (error) {
      console.error(error)
      return m.reply(`❌ Error en farmowner: ${error?.message || String(error)}`)
    }
  }
}
