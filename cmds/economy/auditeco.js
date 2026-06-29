import { isSocketOwner, onlyNumber, normalizeJid } from '../../core/utils.js'

const AUDIT_KEY = '__economyAudit'
const REQUEST_TIMEOUT_MS = 25_000

const ECONOMY_COMMANDS = new Set([
  'balance', 'bal', 'coins', 'bank',
  'daily', 'diario', 'weekly', 'semanal', 'monthly', 'mensual',
  'work', 'w', 'chambear', 'chamba', 'trabajar',
  'cofre', 'coffer', 'chest', 'tesoro', 'caja',
  'deposit', 'dep', 'depositar', 'd',
  'withdraw', 'with', 'retirar',
  'givecoins', 'pay', 'coinsgive', 'takecoins', 'quitcoins', 'removecoins',
  'crime', 'crimen', 'slut', 'prostituirse',
  'slot', 'apostar', 'casino', 'coinflip', 'cf', 'flip',
  'hunt', 'cazar', 'fish', 'pescar', 'mine', 'minar',
  'adventure', 'aventura', 'dungeon', 'mazmorra', 'heal', 'curar',
  'ritual', 'invoke', 'invocar', 'steal', 'rob', 'robar',
  'farm', 'buyfarm', 'harvest', 'harvestall', 'upgradefarm', 'farminfo', 'repairfarm',
  'codigo', 'codigos', 'canjear',
  'economyboard', 'eboard', 'baltop', 'eboardglobal', 'economyboardglobal', 'baltopglobal'
])

function safeNumber(value = 0) {
  const number = Number(value || 0)
  return Number.isFinite(number) ? number : 0
}

function money(value = 0) {
  return Math.floor(safeNumber(value)).toLocaleString('en-US')
}

function signed(value = 0) {
  const number = Math.floor(safeNumber(value))
  const sign = number > 0 ? '+' : ''
  return `${sign}${money(number)}`
}

function percent(value = 0) {
  if (!Number.isFinite(value)) return '0.00%'
  return `${value.toFixed(2)}%`
}

function cleanText(value = '') {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getBotJid(client = {}) {
  return normalizeJid(client?.user?.id || client?.user?.jid || client?.user?.lid || '')
}

function getCurrency(db = {}, client = {}) {
  const botJid = getBotJid(client)
  return db.settings?.[botJid]?.currency || 'Soles'
}

function getBotIdentitySets(db = {}, client = {}) {
  const candidates = [
    client?.user?.id,
    client?.user?.jid,
    client?.user?.lid,
    client?.user?.phoneNumber,
    ...Object.keys(db.settings || {}).filter(key => key.endsWith('@s.whatsapp.net'))
  ].filter(Boolean)

  const jids = new Set(candidates.map(value => normalizeJid(value)).filter(Boolean))
  const numbers = new Set(candidates.map(value => onlyNumber(value)).filter(Boolean))

  return { jids, numbers }
}

function getOwnerNumbers() {
  return new Set([
    '901931862',
    '51901931862',
    '269015712845891',
    ...(String(JSON.stringify(global.owner || [])).match(/\d{5,}/g) || [])
  ].filter(Boolean))
}

function isKnownIdentity(jid = '', sets = {}) {
  const clean = normalizeJid(jid)
  const number = onlyNumber(jid)
  return sets.jids?.has(clean) || sets.numbers?.has(number)
}

function getGroupName(groupId = '', groupData = {}) {
  return (
    groupData.name ||
    groupData.subject ||
    groupData.title ||
    groupData.groupName ||
    groupData.metadata?.subject ||
    groupId
  )
}

function getUserName(db = {}, jid = '', data = {}) {
  return (
    db.users?.[jid]?.name ||
    data.name ||
    data.pushname ||
    data.username ||
    data.nick ||
    onlyNumber(jid) ||
    'Usuario'
  )
}

function addToMap(map, key, amount = 0) {
  map.set(key, safeNumber(map.get(key)) + safeNumber(amount))
}

function median(numbers = []) {
  if (!numbers.length) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2) return sorted[middle]
  return (sorted[middle - 1] + sorted[middle]) / 2
}

function topList(items = [], limit = 5) {
  return [...items]
    .sort((a, b) => safeNumber(b.total) - safeNumber(a.total))
    .slice(0, limit)
}

function createSnapshot(audit = {}) {
  return {
    at: audit.at,
    coins: audit.circulating.coins,
    bank: audit.circulating.bank,
    total: audit.circulating.total,
    users: audit.userTotals,
    groups: audit.groupTotals,
    commands: audit.commandTotals
  }
}

function compareSnapshots(current = {}, previous = null) {
  if (!previous?.at) {
    return {
      hasPrevious: false,
      elapsedMs: 0,
      netCoins: 0,
      netBank: 0,
      netTotal: 0,
      userPositive: 0,
      userNegative: 0,
      userGross: 0,
      usersUp: 0,
      usersDown: 0,
      usersNew: 0,
      usersRemoved: 0,
      commandDelta: [],
      groupDelta: []
    }
  }

  const currentUsers = current.users || {}
  const previousUsers = previous.users || {}
  const userKeys = new Set([...Object.keys(currentUsers), ...Object.keys(previousUsers)])

  let userPositive = 0
  let userNegative = 0
  let usersUp = 0
  let usersDown = 0
  let usersNew = 0
  let usersRemoved = 0

  for (const key of userKeys) {
    const before = safeNumber(previousUsers[key])
    const after = safeNumber(currentUsers[key])
    const delta = after - before

    if (before <= 0 && after > 0) usersNew += 1
    if (before > 0 && after <= 0) usersRemoved += 1
    if (delta > 0) {
      usersUp += 1
      userPositive += delta
    } else if (delta < 0) {
      usersDown += 1
      userNegative += Math.abs(delta)
    }
  }

  const commandKeys = new Set([
    ...Object.keys(current.commands || {}),
    ...Object.keys(previous.commands || {})
  ])

  const commandDelta = [...commandKeys]
    .map(command => ({
      command,
      count: safeNumber(current.commands?.[command]) - safeNumber(previous.commands?.[command])
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const groupKeys = new Set([
    ...Object.keys(current.groups || {}),
    ...Object.keys(previous.groups || {})
  ])

  const groupDelta = [...groupKeys]
    .map(groupId => ({
      groupId,
      total: safeNumber(current.groups?.[groupId]) - safeNumber(previous.groups?.[groupId])
    }))
    .filter(item => item.total !== 0)
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    .slice(0, 5)

  return {
    hasPrevious: true,
    elapsedMs: Math.max(0, safeNumber(current.at) - safeNumber(previous.at)),
    netCoins: safeNumber(current.coins) - safeNumber(previous.coins),
    netBank: safeNumber(current.bank) - safeNumber(previous.bank),
    netTotal: safeNumber(current.total) - safeNumber(previous.total),
    userPositive,
    userNegative,
    userGross: userPositive + userNegative,
    usersUp,
    usersDown,
    usersNew,
    usersRemoved,
    commandDelta,
    groupDelta
  }
}

function formatDuration(ms = 0) {
  const seconds = Math.floor(ms / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes || !parts.length) parts.push(`${minutes}m`)
  return parts.join(' ')
}

function buildAudit(db = {}, client = {}) {
  const botSets = getBotIdentitySets(db, client)
  const ownerNumbers = getOwnerNumbers()
  const users = new Map()
  const groupRows = []
  const commandTotals = {}
  const userTotals = {}
  const groupTotals = {}
  const negativeBalances = []
  const systemMoney = []

  const metrics = {
    at: Date.now(),
    chatsTotal: 0,
    groupsTotal: 0,
    groupsWithEconomyOn: 0,
    groupsWithEconomyOff: 0,
    localEntries: 0,
    localEntriesWithMoney: 0,
    usersWithMoney: 0,
    ownersWithMoney: 0,
    ownerEntriesIgnored: 0,
    botsWithMoney: 0,
    circulating: { coins: 0, bank: 0, total: 0 },
    owners: { coins: 0, bank: 0, total: 0 },
    system: { coins: 0, bank: 0, total: 0 },
    globalDb: { users: 0, usersWithMoney: 0, coins: 0, bank: 0, total: 0 },
    commandsTotal: 0
  }

  for (const [jid, data] of Object.entries(db.users || {})) {
    const coins = safeNumber(data.coins)
    const bank = safeNumber(data.bank)
    const total = coins + bank

    metrics.globalDb.users += 1
    metrics.globalDb.coins += coins
    metrics.globalDb.bank += bank
    metrics.globalDb.total += total
    if (total > 0) metrics.globalDb.usersWithMoney += 1
  }

  for (const [groupId, groupData] of Object.entries(db.chats || {})) {
    metrics.chatsTotal += 1
    if (groupId.endsWith('@g.us')) metrics.groupsTotal += 1
    if (groupData?.economy === true) metrics.groupsWithEconomyOn += 1
    else metrics.groupsWithEconomyOff += 1

    for (const [command, value] of Object.entries(groupData?.commandStats || {})) {
      const count = safeNumber(value)
      if (!count) continue
      metrics.commandsTotal += count

      if (ECONOMY_COMMANDS.has(cleanText(command))) {
        commandTotals[cleanText(command)] = safeNumber(commandTotals[cleanText(command)]) + count
      }
    }

    const group = {
      groupId,
      name: getGroupName(groupId, groupData),
      users: 0,
      moneyUsers: 0,
      coins: 0,
      bank: 0,
      total: 0
    }

    for (const [jid, data] of Object.entries(groupData?.users || {})) {
      const coins = safeNumber(data.coins)
      const bank = safeNumber(data.bank)
      const total = coins + bank
      const number = onlyNumber(jid)
      const isBot = isKnownIdentity(jid, botSets)
      const isOwner = ownerNumbers.has(number)

      metrics.localEntries += 1
      group.users += 1

      if (!isOwner && (coins < 0 || bank < 0)) {
        negativeBalances.push({
          jid,
          name: getUserName(db, jid, data),
          groupId,
          coins,
          bank,
          total
        })
      }

      if (!isBot && !isOwner && total > 0) {
        metrics.localEntriesWithMoney += 1
        group.moneyUsers += 1
      }

      if (isBot) {
        metrics.system.coins += coins
        metrics.system.bank += bank
        metrics.system.total += total
        if (total > 0) {
          metrics.botsWithMoney += 1
          systemMoney.push({ jid, name: getUserName(db, jid, data), groupId, total, coins, bank })
        }
        continue
      }

      if (isOwner) {
        metrics.owners.coins += coins
        metrics.owners.bank += bank
        metrics.owners.total += total
        metrics.ownerEntriesIgnored += 1
        if (total > 0) metrics.ownersWithMoney += 1
        continue
      }

      if (!users.has(jid)) {
        users.set(jid, {
          jid,
          name: getUserName(db, jid, data),
          coins: 0,
          bank: 0,
          total: 0,
          groups: 0,
          isOwner
        })
      }

      const user = users.get(jid)
      user.coins += coins
      user.bank += bank
      user.total += total
      user.groups += 1

      metrics.circulating.coins += coins
      metrics.circulating.bank += bank
      metrics.circulating.total += total

      group.coins += coins
      group.bank += bank
      group.total += total
    }

    groupTotals[groupId] = group.total
    groupRows.push(group)
  }

  const userRows = [...users.values()].filter(user => user.total > 0)
  const totals = userRows.map(user => user.total)
  const topUsers = topList(userRows, 10)
  const topGroups = topList(groupRows.filter(group => group.total > 0), 8)
  const totalCirculating = Math.max(1, metrics.circulating.total)
  const top10Total = topUsers.reduce((sum, user) => sum + user.total, 0)

  for (const user of userRows) {
    userTotals[user.jid] = user.total
  }

  metrics.usersWithMoney = userRows.length
  metrics.averagePerUser = userRows.length ? metrics.circulating.total / userRows.length : 0
  metrics.medianPerUser = median(totals)
  metrics.top10Concentration = top10Total / totalCirculating * 100
  metrics.bankRatio = metrics.circulating.bank / totalCirculating * 100
  metrics.walletRatio = metrics.circulating.coins / totalCirculating * 100
  metrics.commandTotals = commandTotals
  metrics.userTotals = userTotals
  metrics.groupTotals = groupTotals
  metrics.topUsers = topUsers
  metrics.topGroups = topGroups
  metrics.systemMoney = topList(systemMoney, 5)
  metrics.negativeBalances = negativeBalances.slice(0, 8)

  return metrics
}

function compactForAI(audit = {}, comparison = {}, currency = 'Soles') {
  return {
    moneda: currency,
    fecha: new Date(audit.at).toISOString(),
    circulante: audit.circulating,
    grupos: {
      totalChats: audit.chatsTotal,
      grupos: audit.groupsTotal,
      economiaActiva: audit.groupsWithEconomyOn,
      economiaApagada: audit.groupsWithEconomyOff
    },
    usuarios: {
      conDinero: audit.usersWithMoney,
      entradasLocales: audit.localEntries,
      entradasConDinero: audit.localEntriesWithMoney,
      promedio: Math.round(audit.averagePerUser || 0),
      mediana: Math.round(audit.medianPerUser || 0)
    },
    ratios: {
      banco: Number((audit.bankRatio || 0).toFixed(2)),
      cartera: Number((audit.walletRatio || 0).toFixed(2)),
      concentracionTop10: Number((audit.top10Concentration || 0).toFixed(2))
    },
    movimiento: {
      hayHistorial: comparison.hasPrevious,
      intervalo: formatDuration(comparison.elapsedMs || 0),
      netoTotal: comparison.netTotal,
      netoCartera: comparison.netCoins,
      netoBanco: comparison.netBank,
      brutoUsuarios: comparison.userGross,
      usuariosSuben: comparison.usersUp,
      usuariosBajan: comparison.usersDown,
      usuariosNuevos: comparison.usersNew,
      usuariosSalen: comparison.usersRemoved
    },
    topUsuarios: audit.topUsers.slice(0, 5).map(user => ({
      nombre: user.name,
      jid: user.jid,
      total: user.total,
      grupos: user.groups
    })),
    topGrupos: audit.topGroups.slice(0, 5).map(group => ({
      nombre: group.name,
      total: group.total,
      usuarios: group.moneyUsers
    })),
    alertas: {
      botsConDinero: audit.botsWithMoney,
      dineroSistema: audit.system.total,
      negativos: audit.negativeBalances.length
    },
    comandosEconomia: comparison.commandDelta.slice(0, 6)
  }
}

function extractAIText(data = {}) {
  const candidates = [
    data?.result?.text,
    data?.result?.response,
    data?.result?.message,
    data?.result,
    data?.results,
    data?.answer,
    data?.response,
    data?.message,
    data?.data?.text,
    data?.data?.result
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
  }

  return null
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      accept: 'application/json',
      ...(options.headers || {})
    }
  })

  const data = await response.json().catch(() => null)
  return response.ok ? data : null
}

async function askAI(audit = {}, comparison = {}, currency = 'Soles') {
  const facts = compactForAI(audit, comparison, currency)
  const text = `Analiza estos datos exactos de la economia de mi bot WhatsApp. No inventes numeros. Datos JSON: ${JSON.stringify(facts)}`
  const prompt = [
    'Actua como contador, ingeniero de datos, CFO y secretario ejecutivo.',
    'Responde en espanol, estilo informe empresarial para owner.',
    'Usa solo los numeros del JSON. Si no hay historial, dilo claramente.',
    'Incluye diagnostico, riesgos, lectura de movimiento y 3 acciones recomendadas.',
    'Maximo 1500 caracteres.'
  ].join(' ')

  const stellar = global.APIs?.stellar
  const providers = []

  if (stellar?.url) {
    providers.push(async () => {
      const url = new URL('/ai/gptprompt', stellar.url)
      url.searchParams.set('text', text)
      url.searchParams.set('prompt', prompt)
      if (stellar.key) {
        url.searchParams.set('key', stellar.key)
        url.searchParams.set('apikey', stellar.key)
      }
      return extractAIText(await fetchJson(url.toString()))
    })
  }

  providers.push(async () => {
    const data = await fetchJson('https://ai.siputzx.my.id', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        content: text,
        user: 'owner',
        prompt,
        webSearchMode: false
      })
    })

    return extractAIText(data)
  })

  for (const provider of providers) {
    try {
      const response = await provider()
      if (response) return response
    } catch {}
  }

  return null
}

function formatTopUsers(users = [], currency = 'Soles') {
  if (!users.length) return '┃ Sin usuarios con dinero.\n'

  return users.slice(0, 5).map((user, index) => {
    return `┃ ${index + 1}. ${user.name} — *S/${money(user.total)} ${currency}* (${user.groups} grupos)`
  }).join('\n') + '\n'
}

function formatTopGroups(groups = [], currency = 'Soles') {
  if (!groups.length) return '┃ Sin grupos con dinero.\n'

  return groups.slice(0, 5).map((group, index) => {
    return `┃ ${index + 1}. ${group.name} — *S/${money(group.total)} ${currency}* (${group.moneyUsers} usuarios)`
  }).join('\n') + '\n'
}

function formatCommandDelta(commands = []) {
  if (!commands.length) return '┃ Sin nuevos comandos económicos desde la auditoría anterior.\n'

  return commands.slice(0, 6).map(item => {
    return `┃ ${item.command}: *+${money(item.count)} usos*`
  }).join('\n') + '\n'
}

function formatGroupDelta(groups = [], audit = {}, currency = 'Soles') {
  if (!groups.length) return '┃ Sin variaciones fuertes por grupo.\n'

  return groups.map(item => {
    const group = audit.topGroups.find(row => row.groupId === item.groupId) || {}
    return `┃ ${group.name || item.groupId}: *${signed(item.total)} ${currency}*`
  }).join('\n') + '\n'
}

function buildExactReport(audit = {}, comparison = {}, currency = 'Soles', usedPrefix = '.') {
  const historyLine = comparison.hasPrevious
    ? `┃ Intervalo medido: *${formatDuration(comparison.elapsedMs)}*\n`
    : `┃ Intervalo medido: *sin historial previo*\n`

  const velocity = comparison.hasPrevious && comparison.elapsedMs > 0
    ? comparison.netTotal / (comparison.elapsedMs / 3600000)
    : 0

  const warningLines = []
  if (audit.botsWithMoney) warningLines.push(`┃ ⚠️ Bots/sistema con dinero: *${audit.botsWithMoney} entradas* / S/${money(audit.system.total)} ${currency}`)
  if (audit.negativeBalances.length) warningLines.push(`┃ ⚠️ Balances negativos detectados: *${audit.negativeBalances.length}*`)
  if (audit.top10Concentration >= 70) warningLines.push(`┃ ⚠️ Concentración alta: Top 10 controla *${percent(audit.top10Concentration)}*`)
  if (!warningLines.length) warningLines.push('┃ ✅ Sin alertas críticas visibles en la foto actual.')

  return (
    `╭━━〔 📊 AUDITORÍA ECONÓMICA GLOBAL 〕━━⬣\n` +
    `┃ Moneda: *${currency}*\n` +
    `┃ Fecha: *${new Date(audit.at).toLocaleString('es-PE')}*\n` +
    historyLine +
    `┣━━〔 💵 MASA MONETARIA 〕━━⬣\n` +
    `┃ Circulante total: *S/${money(audit.circulating.total)} ${currency}*\n` +
    `┃ Carteras: *S/${money(audit.circulating.coins)}* (${percent(audit.walletRatio)})\n` +
    `┃ Bancos: *S/${money(audit.circulating.bank)}* (${percent(audit.bankRatio)})\n` +
    `┃ Promedio por usuario: *S/${money(audit.averagePerUser)}*\n` +
    `┃ Mediana por usuario: *S/${money(audit.medianPerUser)}*\n` +
    `┃ Concentración Top 10: *${percent(audit.top10Concentration)}*\n` +
    `┣━━〔 🔁 MOVIMIENTO DESDE ÚLTIMA AUDITORÍA 〕━━⬣\n` +
    `┃ Neto total: *${signed(comparison.netTotal)} ${currency}*\n` +
    `┃ Neto cartera: *${signed(comparison.netCoins)}*\n` +
    `┃ Neto banco: *${signed(comparison.netBank)}*\n` +
    `┃ Movimiento bruto usuario: *S/${money(comparison.userGross)} ${currency}*\n` +
    `┃ Velocidad neta: *${signed(velocity)} ${currency}/h*\n` +
    `┃ Usuarios suben/bajan: *${comparison.usersUp}/${comparison.usersDown}*\n` +
    `┃ Nuevos/salieron de saldo: *${comparison.usersNew}/${comparison.usersRemoved}*\n` +
    `┣━━〔 🏢 COBERTURA 〕━━⬣\n` +
    `┃ Chats registrados: *${audit.chatsTotal}*\n` +
    `┃ Grupos: *${audit.groupsTotal}*\n` +
    `┃ Economía ON/OFF: *${audit.groupsWithEconomyOn}/${audit.groupsWithEconomyOff}*\n` +
    `┃ Entradas locales: *${audit.localEntries}*\n` +
    `┃ Entradas con dinero: *${audit.localEntriesWithMoney}*\n` +
    `┃ Usuarios únicos con dinero: *${audit.usersWithMoney}*\n` +
    `┣━━〔 🏆 TOP USUARIOS 〕━━⬣\n` +
    formatTopUsers(audit.topUsers, currency) +
    `┣━━〔 🌐 TOP GRUPOS 〕━━⬣\n` +
    formatTopGroups(audit.topGroups, currency) +
    `┣━━〔 ⚙️ ACTIVIDAD ECONÓMICA 〕━━⬣\n` +
    formatCommandDelta(comparison.commandDelta) +
    `┣━━〔 📈 VARIACIÓN POR GRUPO 〕━━⬣\n` +
    formatGroupDelta(comparison.groupDelta, audit, currency) +
    `┣━━〔 🚨 ALERTAS 〕━━⬣\n` +
    warningLines.join('\n') + '\n' +
    `╰━━〔 ${usedPrefix}auditeco reset = nueva línea base 〕━━⬣`
  )
}

export default {
  command: ['auditeco', 'contadoreco', 'finanzasbot', 'economiaaudit', 'economiaempresa'],
  category: 'owner',
  isOwner: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'auditeco') => {
    const db = global.db.data
    const botJid = getBotJid(client)
    const botSettings = db.settings?.[botJid] || {}

    if (!(await isSocketOwner(client, m, botSettings))) {
      return m.reply(`╭━━〔 🔒 OWNER ONLY 〕━━⬣\n┃ Este comando es exclusivo del owner.\n╰━━━━━━━━━━━━━━⬣`)
    }

    db.stats ||= {}
    db.stats[AUDIT_KEY] ||= {}

    const sub = cleanText(args[0] || '')
    const currency = getCurrency(db, client)
    const audit = buildAudit(db, client)
    const previous = db.stats[AUDIT_KEY].last || null
    const snapshot = createSnapshot(audit)

    if (['reset', 'baseline', 'base', 'reiniciar'].includes(sub)) {
      db.stats[AUDIT_KEY].last = snapshot
      db.stats[AUDIT_KEY].updatedAt = Date.now()
      return m.reply(
        `╭━━〔 🧾 AUDITORÍA REINICIADA 〕━━⬣\n` +
        `┃ Nueva línea base guardada.\n` +
        `┃ Circulante actual: *S/${money(audit.circulating.total)} ${currency}*\n` +
        `┃ Próxima lectura medirá cambios desde ahora.\n` +
        `╰━━━━━━━━━━━━━━━━━━━━⬣`
      )
    }

    const comparison = compareSnapshots(snapshot, previous)
    const exactReport = buildExactReport(audit, comparison, currency, usedPrefix)

    await client.sendMessage(m.chat, { text: exactReport }, { quoted: m })

    db.stats[AUDIT_KEY].last = snapshot
    db.stats[AUDIT_KEY].updatedAt = Date.now()

    const wantsRaw = ['raw', 'sinia', 'noia', 'exacto'].includes(sub)
    if (wantsRaw) return

    const aiText = await askAI(audit, comparison, currency)
    const finalAIText = aiText
      ? `╭━━〔 🤖 LECTURA EJECUTIVA IA 〕━━⬣\n${aiText}\n╰━━━━━━━━━━━━━━━━━━━━⬣`
      : `╭━━〔 🤖 IA NO DISPONIBLE 〕━━⬣\n┃ El informe exacto ya fue generado.\n┃ La API de IA no respondió a tiempo.\n╰━━━━━━━━━━━━━━━━━━━━⬣`

    await client.sendMessage(m.chat, { text: finalAIText }, { quoted: m })
  }
}
