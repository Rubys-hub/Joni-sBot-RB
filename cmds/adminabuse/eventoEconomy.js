import { loadEventoDB } from './eventoDB.js'

const HOUR = 60 * 60 * 1000

function formatNumber(num = 0) {
  return Number(num || 0).toLocaleString('en-US')
}

function formatMoney(num = 0, currency = 'Soles') {
  return `S/${formatNumber(Math.floor(Number(num || 0)))} ${currency}`
}

function formatTime(ms = 0) {
  const n = Math.max(0, Number(ms || 0))

  if (n <= 0) return 'finalizado'

  const h = Math.floor(n / HOUR)
  const m = Math.floor((n % HOUR) / (60 * 1000))
  const s = Math.floor((n % (60 * 1000)) / 1000)

  const parts = []

  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  if (!h && !m && s) parts.push(`${s}s`)

  return parts.length ? parts.join(' ') : 'menos de 1s'
}

function getActiveMultiplier(eventDb = {}, chatId = '') {
  const now = Date.now()

  if (!eventDb?.active?.enabled) {
    return {
      active: false,
      value: 1,
      label: '',
      remaining: 0
    }
  }

  if (Number(eventDb.active.endsAt || 0) <= now) {
    return {
      active: false,
      value: 1,
      label: '',
      remaining: 0
    }
  }

  const global = eventDb.active?.multipliers?.global
  const group = eventDb.active?.multipliers?.groups?.[chatId]

  let selected = null
  let label = ''

  if (global && Number(global.until || 0) > now && Number(global.value || 1) > 1) {
    selected = global
    label = `x${Number(global.value || 1)} global`
  }

  if (group && Number(group.until || 0) > now && Number(group.value || 1) > Number(selected?.value || 1)) {
    selected = group
    label = `x${Number(group.value || 1)} del grupo`
  }

  if (!selected) {
    return {
      active: false,
      value: 1,
      label: '',
      remaining: 0
    }
  }

  const value = Math.max(1, Math.min(Number(selected.value || 1), 5))

  return {
    active: true,
    value,
    label,
    remaining: Math.max(0, Number(selected.until || 0) - now)
  }
}

export async function applyEventoEconomyMultiplier(chatId = '', amount = 0, {
  currency = 'Soles',
  allowPrivate = true
} = {}) {
  const base = Math.max(0, Math.floor(Number(amount || 0)))

  if (base <= 0) {
    return {
      active: false,
      base,
      amount: base,
      bonus: 0,
      multiplier: 1,
      label: '',
      text: ''
    }
  }

  const eventDb = await loadEventoDB()
  const multiplier = getActiveMultiplier(eventDb, chatId)

  if (!multiplier.active) {
    return {
      active: false,
      base,
      amount: base,
      bonus: 0,
      multiplier: 1,
      label: '',
      text: ''
    }
  }

  const isPrivate = !String(chatId || '').endsWith('@g.us')

  if (isPrivate && !allowPrivate) {
    return {
      active: false,
      base,
      amount: base,
      bonus: 0,
      multiplier: 1,
      label: '',
      text: ''
    }
  }

  const finalAmount = Math.floor(base * multiplier.value)
  const bonus = Math.max(0, finalAmount - base)

  return {
    active: true,
    base,
    amount: finalAmount,
    bonus,
    multiplier: multiplier.value,
    label: multiplier.label,
    remaining: multiplier.remaining,
    text:
      `\n🔥 *Evento:* multiplicador ${multiplier.label}\n` +
      `💰 *Base:* ${formatMoney(base, currency)}\n` +
      `✨ *Bonus:* +${formatMoney(bonus, currency)}\n` +
      `⏳ *Restante:* ${formatTime(multiplier.remaining)}`
  }
}

export async function getEventoEconomyMultiplierInfo(chatId = '') {
  const eventDb = await loadEventoDB()
  return getActiveMultiplier(eventDb, chatId)
}