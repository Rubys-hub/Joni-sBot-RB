import {
  getEconomyContext,
  economyOffText,
  applyGainBonus,
  formatMoney,
  saveDB,
  vipBenefitLine,
  vipReminder
} from '../../core/vipNormalBonus.js'
import { applyEventoEconomyMultiplier } from '../adminabuse/eventoEconomy.js'

const HOUR = 1000 * 60 * 60
const FARM_CONFIG_KEY = '__farmConfig'
const UPGRADE_COST_HOURS = 10
const BROKEN_REWARD_HOURS = 24
const BROKEN_REWARD_WARNING_HOURS = 1
const HARD_MAX_ACCUMULATED_HOURS = 6
const DEFAULT_MAX_COLLECT_PAYOUT = 2000000
const FARM_PAUSED_BLOCKED_SUBCOMMANDS = new Set(['buyfarm', 'harvest', 'harvestall', 'upgradefarm'])
const FARM_TAX_BRACKETS = [
  { min: 25000000, rate: 0.35 },
  { min: 10000000, rate: 0.28 },
  { min: 5000000, rate: 0.22 },
  { min: 1000000, rate: 0.15 },
  { min: 500000, rate: 0.10 }
]

const DEFAULT_FARM_CONFIG = {
  version: 1,
  pricePerFarm: 5000,
  upgradeMultiplier: 5000,
  repairMultiplier: 2000,
  damageProbability: 0.025,
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
  const explicitPrice = Number(farmType?.price)
  if (Number.isFinite(explicitPrice) && explicitPrice > 0) return Math.floor(explicitPrice)

  const defaults = DEFAULT_FARM_CONFIG.types[type]
  const legacyPrice = Number(config?.pricePerFarm)
  const production = Math.max(0, Number(farmType?.production ?? defaults?.production ?? 0))

  return Math.max(
    1,
    Math.floor(
      Math.max(
        defaults?.price || DEFAULT_FARM_CONFIG.pricePerFarm,
        legacyPrice > 0 ? legacyPrice : 0,
        production * 5
      )
    )
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

function getFarmType(config, type) {
  return config.types[normalizeTypeId(type)] || null
}

function getFarmPrice(config, type) {
  const farmType = getFarmType(config, type)
  return Math.max(1, Math.floor(Number(farmType?.price || DEFAULT_FARM_CONFIG.pricePerFarm)))
}

function getEnabledFarmEntries(config) {
  return Object.entries(config.types || {})
    .filter(([, data]) => data?.enabled !== false)
    .sort(([a], [b]) => a.localeCompare(b))
}

function formatPercent(value = 0) {
  return `${Math.round(Number(value || 0) * 10000) / 100}%`
}

function calculateTax(amount = 0, brackets = []) {
  const grossAmount = Math.max(0, Math.floor(Number(amount || 0)))
  const bracket = brackets.find(item => grossAmount >= item.min)
  const taxRate = bracket?.rate || 0
  const taxAmount = Math.floor(grossAmount * taxRate)

  return {
    grossAmount,
    taxRate,
    taxAmount,
    netAmount: Math.max(0, grossAmount - taxAmount)
  }
}

function calculateFarmTax(amount = 0) {
  return calculateTax(amount, FARM_TAX_BRACKETS)
}

function applyFarmPayoutCap(amount = 0, config) {
  const netAmount = Math.max(0, Math.floor(Number(amount || 0)))
  const payoutLimit = Math.max(0, Math.floor(Number(config?.maxCollectPayout || 0)))

  if (!payoutLimit || netAmount <= payoutLimit) {
    return {
      amount: netAmount,
      capped: false,
      withheld: 0,
      limit: payoutLimit
    }
  }

  return {
    amount: payoutLimit,
    capped: true,
    withheld: netAmount - payoutLimit,
    limit: payoutLimit
  }
}

function formatFarmTaxLine(tax, currency, label = 'Impuesto agricola') {
  if (!tax || tax.taxAmount <= 0) return ''
  return `🏛️ ${label}: ${formatMoney(tax.taxAmount, currency)} (${formatPercent(tax.taxRate)})\n`
}

function formatPayoutCapLine(settlement, currency, label = 'Tope de cobro aplicado') {
  if (!settlement?.payoutCapped || settlement.payoutWithheld <= 0) return ''
  return `${label}: ${formatMoney(settlement.payoutWithheld, currency)} no acreditados (maximo ${formatMoney(settlement.payoutLimit, currency)})\n`
}

function buildFarmMaintenanceText(usedPrefix = '.') {
  return (
    `🚧 SISTEMA DE GRANJAS EN MANTENIMIENTO\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Las cosechas, compras y mejoras estan pausadas temporalmente.\n\n` +
    `Tus granjas no se borraron y tus niveles siguen intactos.\n` +
    `Cuando el mantenimiento termine, la produccion volvera a contar normal.\n\n` +
    `Puedes revisar tus granjas con ${usedPrefix}farminfo.`
  )
}

function formatTypeList(config, currency) {
  const entries = getEnabledFarmEntries(config)

  if (!entries.length) {
    return '┃ ❌ No hay tipos de granja activos actualmente.\n'
  }

  return entries.map(([type, data]) => {
    return (
      `┃ ${data.emoji} *${type}* — ${data.name}\n` +
      `┃ Precio: ${formatMoney(data.price, currency)}\n` +
      `┃ Produce: ${formatMoney(data.production, currency)} por hora y nivel`
    )
  }).join('\n┃\n')
}

function buildFarmMenu(config, usedPrefix, currency) {
  return `╭━━━〔 🌾 GRANJAS DEL BOT 〕━━━╮

┃ Este sistema sirve para comprar granjas,
┃ mejorarlas y cosechar ganancias con el tiempo.

┃ Moneda actual: ${currency}

┣━━〔 1. COMPRAR GRANJAS 〕━━┫
┃ Comando:
┃ ${usedPrefix}farm buyfarm

┃ Ejemplo:
┃ ${usedPrefix}farm buyfarm crop 1

┃ Alias rápido:
┃ ${usedPrefix}buyfarm crop 1

┣━━〔 2. COSECHAR GANANCIAS 〕━━┫
┃ Comando:
┃ ${usedPrefix}farm harvest

┃ Ejemplo:
┃ ${usedPrefix}farm harvest crop

┃ Alias rápido:
┃ ${usedPrefix}harvest crop

┃ Cobrar todas tus granjas:
┃ ${usedPrefix}farm harvestall
┃ Alias rapido:
┃ ${usedPrefix}harvestall

┣━━〔 3. MEJORAR GRANJAS 〕━━┫
┃ Comando:
┃ ${usedPrefix}farm upgradefarm

┃ Ejemplo:
┃ ${usedPrefix}farm upgradefarm mine

┃ Costo:
┃ Producción actual por hora × ${UPGRADE_COST_HOURS}

┣━━〔 4. REPARAR GRANJAS 〕━━┫
┃ Comando:
┃ ${usedPrefix}farm repairfarm

┃ Ejemplo:
┃ ${usedPrefix}farm repairfarm hunt

┃ Costo:
│ Reparación: costo variable según estado de la granja

┣━━〔 5. VER MIS GRANJAS 〕━━┫
┃ Comando:
┃ ${usedPrefix}farm farminfo

┃ Alias rápido:
┃ ${usedPrefix}farminfo

┣━━〔 GRANJAS DISPONIBLES 〕━━┫
${formatTypeList(config, currency)}

┣━━〔 REGLAS IMPORTANTES 〕━━┫
┃ Debes esperar al menos 1 hora para cosechar.
┃ Máximo acumulable: ${config.maxAccumulatedHours} horas.
┃ Tope por cobro/granja: ${formatMoney(config.maxCollectPayout, currency)}.
┃ La produccion offline sigue contando si apagas el bot.
┃ Al volver, usa harvest o harvestall para cobrarla.
┃ Probabilidad de daño: ${formatPercent(config.damageProbability)}.
┃ Si una granja se daña, no produce hasta repararla.
┃ El VIP y los eventos de economía aplican al cosechar.

╰━━━━━━━━━━━━━━━━━━━━━━╯`
}

function ensureFarmStorage(user) {
  if (!user.farms || typeof user.farms !== 'object' || Array.isArray(user.farms)) {
    user.farms = {}
  }

  return user.farms
}

function hasFarm(user, type) {
  const farms = ensureFarmStorage(user)
  return Number(farms?.[type]?.level || 0) > 0
}

function ensureBrokenRewardStorage(farm) {
  farm.brokenReward ||= {
    active: false,
    amount: 0,
    createdAt: 0,
    warningAt: 0,
    expiresAt: 0,
    warnedOneHour: false,
    chatId: '',
    userJid: ''
  }

  const reward = farm.brokenReward

  reward.active = Boolean(reward.active)
  reward.amount = Math.max(0, Math.floor(Number(reward.amount || 0)))
  reward.createdAt = Math.max(0, Number(reward.createdAt || 0))
  reward.warningAt = Math.max(0, Number(reward.warningAt || 0))
  reward.expiresAt = Math.max(0, Number(reward.expiresAt || 0))
  reward.warnedOneHour = Boolean(reward.warnedOneHour)
  reward.chatId = String(reward.chatId || '')
  reward.userJid = String(reward.userJid || '')

  return reward
}

function ensureFarm(user, type) {
  const farms = ensureFarmStorage(user)

  farms[type] ||= {
    level: 0,
    lastHarvest: 0,
    damaged: false,
    brokenReward: {
      active: false,
      amount: 0,
      createdAt: 0,
      warningAt: 0,
      expiresAt: 0,
      warnedOneHour: false,
      chatId: '',
      userJid: ''
    }
  }

  farms[type].level = Math.max(0, Math.floor(Number(farms[type].level || 0)))
  farms[type].lastHarvest = Math.max(0, Number(farms[type].lastHarvest || 0))
  farms[type].damaged = Boolean(farms[type].damaged)

  ensureBrokenRewardStorage(farms[type])

  return farms[type]
}

function clearBrokenReward(farm) {
  farm.brokenReward = {
    active: false,
    amount: 0,
    createdAt: 0,
    warningAt: 0,
    expiresAt: 0,
    warnedOneHour: false,
    chatId: '',
    userJid: ''
  }

  return farm.brokenReward
}

function hasBrokenReward(farm) {
  const reward = ensureBrokenRewardStorage(farm)
  return reward.active && reward.amount > 0
}

function createBrokenReward(farm, { amount, chatId, userJid, now = Date.now() }) {
  const reward = ensureBrokenRewardStorage(farm)

  reward.active = Number(amount || 0) > 0
  reward.amount = Math.max(0, Math.floor(Number(amount || 0)))
  reward.createdAt = now
  reward.warningAt = now + HOUR * (BROKEN_REWARD_HOURS - BROKEN_REWARD_WARNING_HOURS)
  reward.expiresAt = now + HOUR * BROKEN_REWARD_HOURS
  reward.warnedOneHour = false
  reward.chatId = String(chatId || reward.chatId || '')
  reward.userJid = String(userJid || reward.userJid || '')

  return reward
}

function getBrokenRewardTimeLeft(farm, now = Date.now()) {
  const reward = ensureBrokenRewardStorage(farm)

  if (!reward.active || reward.amount <= 0) {
    return {
      active: false,
      ms: 0,
      hours: 0
    }
  }

  const ms = Math.max(0, reward.expiresAt - now)

  return {
    active: true,
    ms,
    hours: Math.max(1, Math.ceil(ms / HOUR))
  }
}

function claimBrokenReward(user, farm, { discardPayout = false } = {}) {
  const reward = ensureBrokenRewardStorage(farm)

  if (!reward.active || reward.amount <= 0) {
    return {
      claimed: false,
      amount: 0
    }
  }

  const amount = reward.amount
  if (!discardPayout) {
    user.coins = Number(user.coins || 0) + amount
  }
  clearBrokenReward(farm)

  return {
    claimed: true,
    amount
  }
}

function buildMentionTag(jid = '') {
  const id = String(jid || '').split('@')[0]
  return id ? `@${id}` : '@usuario'
}

async function sendBrokenRewardNotice(client, chatId, userJid, text) {
  if (!client || !chatId || !userJid) return false

  try {
    await client.sendMessage(chatId, {
      text,
      mentions: [userJid]
    })
    return true
  } catch {
    return false
  }
}

async function processSingleBrokenReward(client, { farm, type, farmType }) {
  const reward = ensureBrokenRewardStorage(farm)

  if (!reward.active || reward.amount <= 0) {
    if (
      reward.active ||
      reward.amount ||
      reward.createdAt ||
      reward.warningAt ||
      reward.expiresAt ||
      reward.warnedOneHour ||
      reward.chatId ||
      reward.userJid
    ) {
      clearBrokenReward(farm)
      return { changed: true, warned: false, expired: false, lostAmount: 0 }
    }

    return { changed: false, warned: false, expired: false, lostAmount: 0 }
  }

  const now = Date.now()

  if (!reward.warnedOneHour && now >= reward.warningAt) {
    reward.warnedOneHour = true
    reward.warningAt = now
    reward.expiresAt = now + HOUR * BROKEN_REWARD_WARNING_HOURS

    const mention = buildMentionTag(reward.userJid)

    await sendBrokenRewardNotice(
      client,
      reward.chatId,
      reward.userJid,
      `${mention} recoge el dinero guardado de tu granja ${farmType.emoji} ${type}. Te queda 1 hora.`
    )

    return { changed: true, warned: true, expired: false, lostAmount: 0 }
  }

  if (reward.warnedOneHour && now >= reward.expiresAt) {
    const lostAmount = reward.amount
    const mention = buildMentionTag(reward.userJid)

    clearBrokenReward(farm)

    await sendBrokenRewardNotice(
      client,
      reward.chatId,
      reward.userJid,
      `${mention} perdiste el dinero guardado de tu granja ${farmType.emoji} ${type}.`
    )

    return { changed: true, warned: false, expired: true, lostAmount }
  }

  return { changed: false, warned: false, expired: false, lostAmount: 0 }
}

async function processUserBrokenRewards(client, user, config, { chatId = '', userJid = '' } = {}) {
  const farms = ensureFarmStorage(user)
  let changed = false

  for (const [type] of Object.entries(farms)) {
    const farm = ensureFarm(user, type)
    const reward = ensureBrokenRewardStorage(farm)

    if (chatId && !reward.chatId) {
      reward.chatId = String(chatId)
      changed = true
    }

    if (userJid && !reward.userJid) {
      reward.userJid = String(userJid)
      changed = true
    }

    const farmType = getFarmType(config, type) || {
      emoji: '🏠',
      name: type,
      production: 0,
      enabled: false
    }

    const result = await processSingleBrokenReward(client, {
      farm,
      type,
      farmType
    })

    if (result.changed) changed = true
  }

  if (changed) saveDB()

  return { changed }
}

export async function processAllBrokenFarmRewards(client) {
  global.db.data.users ||= {}

  const config = ensureFarmConfig()
  let changed = false

  for (const [userJid, user] of Object.entries(global.db.data.users)) {
    if (!user || typeof user !== 'object') continue

    const farms = ensureFarmStorage(user)

    for (const [type] of Object.entries(farms)) {
      const farm = ensureFarm(user, type)
      const reward = ensureBrokenRewardStorage(farm)

      if (!reward.userJid) {
        reward.userJid = userJid
        changed = true
      }

      const farmType = getFarmType(config, type) || {
        emoji: '🏠',
        name: type,
        production: 0,
        enabled: false
      }

      const result = await processSingleBrokenReward(client, {
        farm,
        type,
        farmType
      })

      if (result.changed) changed = true
    }
  }

  if (changed) saveDB()
}

function compactText(text = '') {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function getHourlyProduction(config, type, level) {
  const farmType = getFarmType(config, type) || {
    production: 0
  }

  return Math.max(0, Math.floor(Number(farmType.production || 0) * Math.max(0, Number(level || 0))))
}

function getUpgradeCost(config, type, farm) {
  return Math.max(0, Math.floor(getHourlyProduction(config, type, farm.level) * UPGRADE_COST_HOURS))
}

function getAccumulatedHours(config, farm, now = Date.now()) {
  const elapsed = Math.max(0, now - Number(farm?.lastHarvest || 0))
  const rawHours = Math.floor(elapsed / HOUR)
  const hours = Math.min(config.maxAccumulatedHours, rawHours)

  return {
    rawHours,
    hours,
    capped: rawHours > hours
  }
}

function getPendingProductionPreview(config, type, farm, vipBonus, now = Date.now()) {
  if (!farm || farm.level <= 0 || farm.damaged || farm.lastHarvest <= 0 || farm.lastHarvest > now) {
    return {
      amount: 0,
      rawHours: 0,
      hours: 0,
      capped: false
    }
  }

  const accumulated = getAccumulatedHours(config, farm, now)
  const baseAmount = getHourlyProduction(config, type, farm.level) * accumulated.hours
  const vipReward = applyGainBonus(baseAmount, vipBonus)
  const farmTax = calculateFarmTax(vipReward.total)
  const payout = applyFarmPayoutCap(farmTax.netAmount, config)

  return {
    amount: payout.amount,
    grossAmount: farmTax.grossAmount,
    taxAmount: farmTax.taxAmount,
    taxRate: farmTax.taxRate,
    payoutCapped: payout.capped,
    payoutWithheld: payout.withheld,
    payoutLimit: payout.limit,
    rawHours: accumulated.rawHours,
    hours: accumulated.hours,
    capped: accumulated.capped
  }
}

async function collectProduction({
  config,
  chatId,
  userJid = '',
  user,
  farm,
  type,
  currency,
  vipBonus,
  allowDamage = true,
  discardPayout = false
}) {
  const now = Date.now()

  if (!farm || farm.level <= 0) {
    return {
      kind: 'missing',
      amount: 0,
      hours: 0,
      rawHours: 0,
      capped: false,
      damagedNow: false,
      eventText: ''
    }
  }

  if (farm.damaged) {
    return {
      kind: 'damaged',
      amount: 0,
      hours: 0,
      rawHours: 0,
      capped: false,
      damagedNow: false,
      eventText: ''
    }
  }

  if (farm.lastHarvest <= 0 || farm.lastHarvest > now) {
    farm.lastHarvest = now

    return {
      kind: 'synced',
      amount: 0,
      hours: 0,
      rawHours: 0,
      capped: false,
      damagedNow: false,
      eventText: ''
    }
  }

  const accumulated = getAccumulatedHours(config, farm, now)

  if (accumulated.hours <= 0) {
    return {
      kind: 'cooldown',
      amount: 0,
      hours: 0,
      rawHours: accumulated.rawHours,
      capped: false,
      damagedNow: false,
      eventText: ''
    }
  }

  const farmType = getFarmType(config, type) || {
    emoji: '🏠',
    name: type,
    production: 0,
    enabled: false
  }

  const baseAmount = getHourlyProduction(config, type, farm.level) * accumulated.hours
  const vipReward = applyGainBonus(baseAmount, vipBonus)
  const eventMult = await applyEventoEconomyMultiplier(chatId, vipReward.total, {
    currency
  })
  const grossAmount = Math.max(0, Math.floor(Number(eventMult.amount || 0)))
  const farmTax = calculateFarmTax(grossAmount)
  const payout = applyFarmPayoutCap(farmTax.netAmount, config)
  const finalAmount = payout.amount

  const brokeNow = allowDamage && Math.random() < getDynamicFarmDamageProbability(config, farm, farmType)

  if (brokeNow) {
    farm.damaged = true
    if (!discardPayout) {
      user.coins = Number(user.coins || 0) + finalAmount
    }
    farm.lastHarvest = now
    clearBrokenReward(farm)

    return {
      kind: 'just_broken',
      amount: finalAmount,
      storedAmount: 0,
      hours: accumulated.hours,
      rawHours: accumulated.rawHours,
      capped: accumulated.capped,
      baseAmount,
      grossAmount: farmTax.grossAmount,
      taxAmount: farmTax.taxAmount,
      taxRate: farmTax.taxRate,
      payoutCapped: payout.capped,
      payoutWithheld: payout.withheld,
      payoutLimit: payout.limit,
      vipReward,
      damagedNow: true,
      repairCost: getFarmRepairCost(farm, farmType),
      eventText: eventMult.text || ''
    }
  }

  if (!discardPayout) {
    user.coins = Number(user.coins || 0) + finalAmount
  }
  farm.lastHarvest = now

  return {
    kind: 'collected',
    amount: finalAmount,
    hours: accumulated.hours,
    rawHours: accumulated.rawHours,
    capped: accumulated.capped,
    baseAmount,
    grossAmount: farmTax.grossAmount,
    taxAmount: farmTax.taxAmount,
    taxRate: farmTax.taxRate,
    payoutCapped: payout.capped,
    payoutWithheld: payout.withheld,
    payoutLimit: payout.limit,
    vipReward,
    damagedNow: false,
    eventText: eventMult.text || ''
  }
}

function buildSettlementText(config, settlement, currency, vipBonus) {
  if (!settlement || settlement.kind !== 'collected') return ''

  return (
    `\n\n🌾 PRODUCCIÓN PENDIENTE LIQUIDADA\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `⏳ Horas liquidadas: ${settlement.hours}${settlement.capped ? ` / ${settlement.rawHours} acumuladas` : ''}\n` +
    `${settlement.capped ? `⚠️ Límite aplicado: máximo ${config.maxAccumulatedHours} horas acumulables.\n` : ''}` +
    `${vipBonus.active ? vipBenefitLine(vipBonus, settlement.vipReward, currency) : ''}` +
    `${settlement.taxAmount > 0 ? `💵 Produccion bruta: ${formatMoney(settlement.grossAmount, currency)}\n` : ''}` +
    formatFarmTaxLine(settlement, currency) +
    formatPayoutCapLine(settlement, currency) +
    `💰 Recibiste: ${formatMoney(settlement.amount, currency)}\n` +
    `${settlement.eventText || ''}` +
    `${settlement.damagedNow ? `\n💥 La granja se dañó durante esta liquidación. Repárala para que vuelva a producir.` : ''}`
  )
}

function getFarmHourlyIncome(farm, farmType) {
  return Math.max(
    0,
    Math.floor(Number(farm?.level || 0) * Number(farmType?.production || 0))
  )
}

function getDynamicFarmDamageProbability(config, farm, farmType) {
  const baseProbability = Math.max(0, Number(config?.damageProbability ?? 0))
  const level = Math.max(0, Math.floor(Number(farm?.level ?? 0)))
  const hourlyIncome = getFarmHourlyIncome(farm, farmType)
  const levelBonus = level * 0.005
  const incomeBonus = Math.floor(hourlyIncome / 10000) * 0.01
  return Math.min(0.50, baseProbability + levelBonus + incomeBonus)
}

function getFarmRepairCost(farm, farmType) {
  const hourlyIncome = getFarmHourlyIncome(farm, farmType)
  return Math.max(0, Math.floor(hourlyIncome * 2))
}

export default {
  command: ['farm', 'buyfarm', 'harvest', 'harvestall', 'upgradefarm', 'farminfo', 'repairfarm'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'farm') => {
    try {
      const {
        chatId,
        chatData,
        user,
        currency,
        vipBonus
      } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      const config = ensureFarmConfig()

      user.coins = Number(user.coins || 0)
      ensureFarmStorage(user)

      await processUserBrokenRewards(client, user, config, {
        chatId,
        userJid: m.sender
      })

      const aliasToSubcommand = {
        buyfarm: 'buyfarm',
        harvest: 'harvest',
        harvestall: 'harvestall',
        upgradefarm: 'upgradefarm',
        farminfo: 'farminfo',
        repairfarm: 'repairfarm'
      }

      const normalizedCommand = String(command || 'farm').toLowerCase()
      const subCommand =
        normalizedCommand === 'farm'
          ? String(args[0] || '').toLowerCase()
          : aliasToSubcommand[normalizedCommand] || ''

      const subArgs = normalizedCommand === 'farm' ? args.slice(1) : args

      if (config.harvestPaused && (!subCommand || subCommand === 'menu' || FARM_PAUSED_BLOCKED_SUBCOMMANDS.has(subCommand))) {
        return m.reply(buildFarmMaintenanceText(usedPrefix))
      }

      if (!subCommand || subCommand === 'menu') {
        return m.reply(buildFarmMenu(config, usedPrefix, currency))
      }

      if (subCommand === 'buyfarm') {
        const type = normalizeTypeId(subArgs[0])
        const qty = Number(subArgs[1] || 1)
        const farmType = getFarmType(config, type)

        if (!farmType || farmType.enabled === false) {
          return m.reply(`❌ Tipo de granja inválido o desactivado.\nUsa: ${getEnabledFarmEntries(config).map(([id]) => id).join(', ') || 'ninguno disponible'}.`)
        }

        if (!Number.isInteger(qty) || qty < 1) {
          return m.reply(`❌ La cantidad debe ser un número entero mayor que 0.\nEjemplo: ${usedPrefix}farm buyfarm fish 2`)
        }

        const unitPrice = getFarmPrice(config, type)
        const totalPrice = unitPrice * qty

        if (!m.isOwner && user.coins < totalPrice) {
          return m.reply(
            `⚠️ No tienes suficientes ${currency}.\n` +
            `Necesitas: ${formatMoney(totalPrice, currency)}\n` +
            `Disponible: ${formatMoney(user.coins, currency)}`
          )
        }

        const sentMsg = await m.reply(`🛠 Comprando granja(s) ${type}...`)
        await sleep(1200)

        const farm = ensureFarm(user, type)
        const settlement = await collectProduction({
          config,
          chatId,
          userJid: m.sender,
          user,
          farm,
          type,
          currency,
          vipBonus,
          allowDamage: false,
          discardPayout: m.isOwner
        })

        const now = Date.now()
        const wasNewFarm = farm.level <= 0

        if (!m.isOwner) user.coins -= totalPrice
        farm.level += qty

        if (wasNewFarm || farm.lastHarvest <= 0 || farm.lastHarvest > now) {
          farm.lastHarvest = now
        }

        saveDB()

        return client.sendMessage(
          chatId,
          {
            text:
              `✅ GRANJA COMPRADA\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `${farmType.emoji} Tipo: ${type} (${farmType.name})\n` +
              `🎉 Cantidad comprada: ${qty}\n` +
              `🏷️ Precio unitario: ${formatMoney(unitPrice, currency)}\n` +
              `⭐ Nivel actual: ${farm.level}\n` +
              `💸 Costo total: ${formatMoney(totalPrice, currency)}\n` +
              `💰 ${currency} restantes: ${formatMoney(user.coins, currency)}\n` +
              `📈 Producción por hora: ${formatMoney(getHourlyProduction(config, type, farm.level), currency)}\n\n` +
              `Tu granja empezará a producir desde ahora.\n` +
              `Aunque apagues el bot, la hora queda guardada y se cobrará al cosechar.\n` +
              `Usa ${usedPrefix}harvest ${type} o ${usedPrefix}harvestall para recolectar después.` +
              buildSettlementText(config, settlement, currency, vipBonus)
          },
          { quoted: sentMsg }
        )
      }

      if (subCommand === 'harvest') {
        const type = normalizeTypeId(subArgs[0])
        const farmType = getFarmType(config, type)

        if (!farmType) {
          return m.reply(`❌ Indica un tipo válido.\nEjemplo: ${usedPrefix}farm harvest mine`)
        }

        if (!hasFarm(user, type)) {
          return m.reply('❌ No tienes esa granja.')
        }

        const farm = ensureFarm(user, type)

        const brokenRewardClaim = claimBrokenReward(user, farm, { discardPayout: m.isOwner })
        const claimedText = brokenRewardClaim.claimed
          ? `📦 Dinero recuperado: ${formatMoney(brokenRewardClaim.amount, currency)}\n`
          : ''

        if (brokenRewardClaim.claimed && farm.damaged) {
          saveDB()

          return m.reply(
            `💰 DINERO RECUPERADO\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `${farmType.emoji} Granja: ${type} (${farmType.name})\n` +
            `${claimedText}` +
            `🩺 Estado: Dañada ❌\n` +
            `💼 ${currency} actuales: ${formatMoney(user.coins, currency)}\n\n` +
            `Usa ${usedPrefix}repairfarm ${type} para repararla.`
          )
        }

        const settlement = await collectProduction({
          config,
          chatId,
          userJid: m.sender,
          user,
          farm,
          type,
          currency,
          vipBonus,
          discardPayout: m.isOwner
        })

        if (settlement.kind === 'damaged') {
          if (brokenRewardClaim.claimed) saveDB()

          return m.reply(
            `${claimedText}` +
            `⚠️ Tu granja ${type} está dañada y no produce ${currency}.\n` +
            `Usa ${usedPrefix}repairfarm ${type} para repararla.`
          )
        }

        if (settlement.kind === 'just_broken') {
          saveDB()

          return m.reply(
            `╭━━━〔 💥 UPS! 〕━━━╮\n` +
            `│ Tu granja ${farmType.emoji} ${type} — ${farmType.name} se rompió al cobrar.\n` +
            `${settlement.taxAmount > 0 ? `│ Produccion bruta: ${formatMoney(settlement.grossAmount, currency)}.\n` : ''}` +
            `${settlement.taxAmount > 0 ? `│ Impuesto agricola: ${formatMoney(settlement.taxAmount, currency)} (${formatPercent(settlement.taxRate)}).\n` : ''}` +
            `${settlement.payoutCapped ? `│ Tope de cobro aplicado: ${formatMoney(settlement.payoutWithheld, currency)} no acreditados (maximo ${formatMoney(settlement.payoutLimit, currency)}).\n` : ''}` +
            `│ Dinero acreditado: ${formatMoney(settlement.amount, currency)}.\n` +
            `│ Estado: Dañada ❌\n` +
            `│ Repararla costará ${formatMoney(settlement.repairCost, currency)}.\n` +
            `│ Usa ${usedPrefix}repairfarm ${type} para repararla.\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`
          )
        }

        if (settlement.kind === 'synced') {
          saveDB()

          return m.reply(
            `${claimedText}` +
            `⏳ Tu granja ${type} quedó sincronizada desde este momento.\n` +
            `Vuelve más tarde para recolectar producción real.`
          )
        }

        if (settlement.kind === 'cooldown') {
          if (brokenRewardClaim.claimed) saveDB()

          if (brokenRewardClaim.claimed) {
            return m.reply(
              `💰 DINERO RECUPERADO\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `${farmType.emoji} Granja: ${type} (${farmType.name})\n` +
              `${claimedText}` +
              `💼 ${currency} actuales: ${formatMoney(user.coins, currency)}\n\n` +
              `⏳ Producción en proceso. Espera al menos 1 hora para recolectar.`
            )
          }

          return m.reply('⏳ Producción en proceso. Espera al menos 1 hora para recolectar.')
        }

        if (settlement.kind !== 'collected') {
          if (brokenRewardClaim.claimed) saveDB()
          return m.reply('❌ No se pudo calcular la producción de esta granja.')
        }

        saveDB()

        const text =
          `💎 RECOLECCIÓN REALIZADA\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `${farmType.emoji} Granja: ${type} (${farmType.name})\n` +
          `⭐ Nivel: ${farm.level}\n` +
          `${claimedText}` +
          `⏳ Horas acumuladas: ${settlement.hours}${settlement.capped ? ` / ${settlement.rawHours} acumuladas` : ''}\n` +
          `${settlement.capped ? `⚠️ Límite aplicado: máximo ${config.maxAccumulatedHours} horas acumulables.\n` : ''}` +
          `${vipBonus.active ? vipBenefitLine(vipBonus, settlement.vipReward, currency) : ''}` +
          `${settlement.taxAmount > 0 ? `💵 Produccion bruta: ${formatMoney(settlement.grossAmount, currency)}\n` : ''}` +
          formatFarmTaxLine(settlement, currency) +
          formatPayoutCapLine(settlement, currency) +
          `💰 Producción obtenida: ${formatMoney(settlement.amount, currency)}\n` +
          `${settlement.eventText || ''}` +
          `💼 ${currency} actuales: ${formatMoney(user.coins, currency)}\n` +
          `📈 Producción por hora: ${formatMoney(getHourlyProduction(config, type, farm.level), currency)}` +
          `${settlement.damagedNow
            ? `\n\n💥⚠️ Tu granja ${type} se dañó durante la cosecha.\nUsa ${usedPrefix}repairfarm ${type} para repararla.`
            : ''}` +
          vipReminder(vipBonus, usedPrefix)

        return m.reply(text)
      }

      if (subCommand === 'harvestall') {
        const farms = ensureFarmStorage(user)
        const keys = Object.keys(farms).filter((type) => Number(farms[type]?.level || 0) > 0)

        if (!keys.length) {
          return m.reply('No tienes granjas todavia.')
        }

        const lines = []
        let totalAmount = 0
        let totalGross = 0
        let totalTax = 0
        let totalWithheld = 0
        let totalHours = 0
        let totalRawHours = 0
        let collectedCount = 0
        let changed = false

        for (const type of keys) {
          const farm = ensureFarm(user, type)
          const farmType = getFarmType(config, type) || {
            emoji: '',
            name: type,
            production: 0,
            enabled: false
          }

          const label = `${farmType.emoji ? `${farmType.emoji} ` : ''}${type} (${farmType.name})`
          const settlement = await collectProduction({
            config,
            chatId,
            userJid: m.sender,
            user,
            farm,
            type,
            currency,
            vipBonus,
            discardPayout: m.isOwner
          })

          if (settlement.kind === 'collected') {
            collectedCount += 1
            changed = true
            totalAmount += settlement.amount
            totalGross += settlement.grossAmount || settlement.amount
            totalTax += settlement.taxAmount || 0
            totalWithheld += settlement.payoutWithheld || 0
            totalHours += settlement.hours
            totalRawHours += settlement.rawHours

            const notes = [
              settlement.capped ? `limite ${config.maxAccumulatedHours}h` : '',
              settlement.taxAmount > 0 ? `impuesto ${formatPercent(settlement.taxRate)}: ${formatMoney(settlement.taxAmount, currency)}` : '',
              settlement.payoutCapped ? `tope de cobro: ${formatMoney(settlement.payoutWithheld, currency)} no acreditados` : '',
              compactText(settlement.eventText),
              settlement.damagedNow ? 'se dano al final' : ''
            ].filter(Boolean).join(' | ')

            lines.push(
              `- ${label}: ${formatMoney(settlement.amount, currency)} por ${settlement.hours}h${notes ? ` (${notes})` : ''}`
            )
            continue
          }

          if (settlement.kind === 'just_broken') {
            collectedCount += 1
            changed = true
            totalAmount += settlement.amount
            totalGross += settlement.grossAmount || settlement.amount
            totalTax += settlement.taxAmount || 0
            totalWithheld += settlement.payoutWithheld || 0
            totalHours += settlement.hours
            totalRawHours += settlement.rawHours

            const notes = [
              settlement.capped ? `limite ${config.maxAccumulatedHours}h` : '',
              settlement.taxAmount > 0 ? `impuesto ${formatPercent(settlement.taxRate)}: ${formatMoney(settlement.taxAmount, currency)}` : '',
              settlement.payoutCapped ? `tope de cobro: ${formatMoney(settlement.payoutWithheld, currency)} no acreditados` : '',
              compactText(settlement.eventText),
              'se dañó al cobrar'
            ].filter(Boolean).join(' | ')

            lines.push(
              `- ${label}: ${formatMoney(settlement.amount, currency)} por ${settlement.hours}h (${notes}). ` +
              `Reparación: ${formatMoney(settlement.repairCost, currency)}.`
            )
            continue
          }

          if (settlement.kind === 'synced') {
            changed = true
            lines.push(`- ${label}: sincronizada desde ahora.`)
            continue
          }

          if (settlement.kind === 'damaged') {
            lines.push(`- ${label}: esta danada, no produce hasta repararla.`)
            continue
          }

          if (settlement.kind === 'cooldown') {
            lines.push(`- ${label}: aun no llega a 1 hora acumulada.`)
            continue
          }

          lines.push(`- ${label}: no se pudo calcular.`)
        }

        if (changed) saveDB()

        if (!collectedCount) {
          return m.reply(
            `COSECHA GLOBAL\n` +
            `--------------------\n` +
            `No habia produccion lista para cobrar.\n\n` +
            lines.join('\n')
          )
        }

        return m.reply(
          `COSECHA GLOBAL REALIZADA\n` +
          `--------------------\n` +
          `Granjas cobradas: ${collectedCount}/${keys.length}\n` +
          `Horas cobradas: ${totalHours}${totalRawHours > totalHours ? ` / ${totalRawHours} acumuladas` : ''}\n` +
          `${totalTax > 0 ? `Total bruto: ${formatMoney(totalGross, currency)}\n` : ''}` +
          `${totalTax > 0 ? `Impuesto agricola: ${formatMoney(totalTax, currency)}\n` : ''}` +
          `${totalWithheld > 0 ? `Tope de cobro aplicado: ${formatMoney(totalWithheld, currency)} no acreditados\n` : ''}` +
          `Total recibido: ${formatMoney(totalAmount, currency)}\n` +
          `${vipBonus.active ? 'Bonus VIP aplicado en cada granja cobrada.\n' : ''}` +
          `${totalRawHours > totalHours ? `Limite aplicado: maximo ${config.maxAccumulatedHours} horas por granja.\n` : ''}` +
          `${currency} actuales: ${formatMoney(user.coins, currency)}\n\n` +
          lines.join('\n') +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      if (subCommand === 'repairfarm') {
        const type = normalizeTypeId(subArgs[0])
        const farmType = getFarmType(config, type)

        if (!farmType) {
          return m.reply(`❌ Indica un tipo válido.\nEjemplo: ${usedPrefix}farm repairfarm mine`)
        }

        if (!hasFarm(user, type)) {
          return m.reply('❌ No tienes esa granja.')
        }

        const farm = ensureFarm(user, type)

        if (!farm.damaged) {
          return m.reply('✅ Tu granja no está dañada.')
        }

        const repairCost = getFarmRepairCost(farm, farmType)

        if (!m.isOwner && user.coins < repairCost) {
          return m.reply(
            `💸 No tienes suficientes ${currency} para reparar la granja.\n` +
            `Costo: ${formatMoney(repairCost, currency)}\n` +
            `Disponible: ${formatMoney(user.coins, currency)}`
          )
        }

        const sentMsg = await m.reply(`🛠 Reparando granja ${type}...`)
        await sleep(1200)

        if (!m.isOwner) user.coins -= repairCost
        farm.damaged = false
        farm.lastHarvest = Date.now()

        saveDB()

        return client.sendMessage(
          chatId,
          {
            text:
              `✅ GRANJA REPARADA CON ÉXITO\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `${farmType.emoji} Tipo: ${type} (${farmType.name})\n` +
              `⭐ Nivel: ${farm.level}\n` +
              `💸 Costo de reparación: ${formatMoney(repairCost, currency)}\n` +
              `💰 ${currency} restantes: ${formatMoney(user.coins, currency)}\n\n` +
              `Tu granja ya puede volver a producir.\n` +
              `La producción empezará a contar desde este momento, incluso si apagas el bot.`
          },
          { quoted: sentMsg }
        )
      }

      if (subCommand === 'upgradefarm') {
        const type = normalizeTypeId(subArgs[0])
        const farmType = getFarmType(config, type)

        if (!farmType) {
          return m.reply(`❌ Indica un tipo válido.\nEjemplo: ${usedPrefix}farm upgradefarm hunt`)
        }

        if (!hasFarm(user, type)) {
          return m.reply('❌ No tienes esa granja.')
        }

        const farm = ensureFarm(user, type)
        const oldLevel = farm.level
        const currentHourlyProduction = getHourlyProduction(config, type, oldLevel)
        const nextHourlyProduction = getHourlyProduction(config, type, oldLevel + 1)
        const upgradeCost = getUpgradeCost(config, type, farm)

        if (upgradeCost <= 0) {
          return m.reply('❌ No se pudo calcular el costo de mejora.')
        }

        if (!m.isOwner && user.coins < upgradeCost) {
          return m.reply(
            `💸 No tienes suficientes ${currency} para mejorar la granja.\n` +
            `Costo: ${formatMoney(upgradeCost, currency)}\n` +
            `Disponible: ${formatMoney(user.coins, currency)}`
          )
        }

        const settlement = await collectProduction({
          config,
          chatId,
          userJid: m.sender,
          user,
          farm,
          type,
          currency,
          vipBonus,
          allowDamage: false,
          discardPayout: m.isOwner
        })

        if (!m.isOwner) user.coins -= upgradeCost
        farm.level += 1

        if (farm.lastHarvest <= 0 || farm.lastHarvest > Date.now()) {
          farm.lastHarvest = Date.now()
        }

        saveDB()

        return m.reply(
          `⚡ MEJORA COMPLETADA\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `${farmType.emoji} Granja: ${type} (${farmType.name})\n` +
          `⭐ Nuevo nivel: ${farm.level}\n` +
          `💸 Costo de mejora: ${formatMoney(upgradeCost, currency)}\n` +
          `📈 Producción anterior: ${formatMoney(currentHourlyProduction, currency)} por hora\n` +
          `🚀 Nueva producción: ${formatMoney(nextHourlyProduction, currency)} por hora\n` +
          `💰 ${currency} restantes: ${formatMoney(user.coins, currency)}` +
          `${farm.damaged ? `\n\n⚠️ Esta granja sigue dañada. Repárala para que pueda producir.` : ''}` +
          buildSettlementText(config, settlement, currency, vipBonus)
        )
      }

      if (subCommand === 'farminfo') {
        const farms = ensureFarmStorage(user)
        const keys = Object.keys(farms).filter((type) => Number(farms[type]?.level || 0) > 0)

        if (!keys.length) {
          return m.reply('📭 No tienes granjas todavía.')
        }

        const now = Date.now()

        let text =
          `🏡 INFORMACIÓN DE TUS GRANJAS\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `💰 Moneda: ${currency}\n` +
          `📦 Máximo acumulable por granja: ${config.maxAccumulatedHours} horas\n`

        for (const type of keys) {
          const farm = ensureFarm(user, type)
          const farmType = getFarmType(config, type) || {
            emoji: '🏠',
            name: type,
            production: 0,
            enabled: false
          }

          const pending = getPendingProductionPreview(config, type, farm, vipBonus, now)
          const accumulated = pending
          const brokenReward = ensureBrokenRewardStorage(farm)
          const brokenRewardLeft = getBrokenRewardTimeLeft(farm, now)

          text +=
            `\n${farmType.emoji} ${String(type).toUpperCase()} (${farmType.name})\n` +
            `⭐ Nivel: ${farm.level}\n` +
            `🏷️ Precio base: ${formatMoney(getFarmPrice(config, type), currency)}\n` +
            `💰 Producción por hora: ${formatMoney(getHourlyProduction(config, type, farm.level), currency)}\n` +
            `⏳ Horas acumuladas: ${accumulated.hours}${accumulated.capped ? ` / ${accumulated.rawHours} acumuladas` : ''}\n` +
            `${accumulated.capped ? `⚠️ Límite aplicado: máximo ${config.maxAccumulatedHours} horas.\n` : ''}` +
            `${pending.taxAmount > 0 ? `💵 Produccion bruta estimada: ${formatMoney(pending.grossAmount, currency)}\n` : ''}` +
            `${pending.taxAmount > 0 ? `🏛️ Impuesto estimado: ${formatMoney(pending.taxAmount, currency)} (${formatPercent(pending.taxRate)})\n` : ''}` +
            `${pending.payoutCapped ? `Tope de cobro estimado: ${formatMoney(pending.payoutWithheld, currency)} no acreditados (maximo ${formatMoney(pending.payoutLimit, currency)})\n` : ''}` +
            `📦 Produccion offline pendiente: ${formatMoney(pending.amount, currency)}\n` +
            `${brokenReward.active ? `💼 Dinero guardado: ${formatMoney(brokenReward.amount, currency)}\n` : ''}` +
            `${brokenReward.active ? `⏰ Tiempo restante: ${brokenRewardLeft.hours} hora(s)\n` : ''}` +
            `🧩 Estado del tipo: ${farmType.enabled === false ? 'Desactivado' : 'Activo'}\n` +
            `🩺 Estado: ${farm.damaged ? 'Dañada ❌' : 'Activa ✅'}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n`
        }

        text +=
          `\nUsa ${usedPrefix}harvest para recolectar una granja.\n` +
          `Usa ${usedPrefix}harvestall para cobrar todas las granjas acumuladas.\n` +
          `Usa ${usedPrefix}repairfarm si alguna granja está dañada.` +
          vipReminder(vipBonus, usedPrefix)

        return m.reply(text)
      }

      return m.reply(`❌ Subcomando inválido.\nUsa ${usedPrefix}farm para ver el menú.`)
    } catch (error) {
      return m.reply(`Error en farm: ${error?.message || String(error)}`)
    }
  }
}
