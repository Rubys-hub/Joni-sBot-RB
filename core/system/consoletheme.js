import chalk from 'chalk'
import gradient from 'gradient-string'

const FRAMES = [
  'ᕕ( ⌐■_■ )ᕗ',
  'ᕗ( ⌐■_■ )ᕕ',
  'ᕕ( •ω• )ᕗ',
  'ᕗ( •ω• )ᕕ',
  'ᕕ( ᐛ )ᕗ',
  'ᕗ( ᐛ )ᕕ',
  '♪┏(・o･)┛',
  '┗(･o･)┓♪'
]

let frameIndex = 0
let started = false

const WIDTH = 96
const BRAND = '[ ⌬ ]'

const THEMES = {
  info: {
    border: ['#7C3AED', '#38BDF8'],
    brand: '#C084FC',
    value: '#E0F2FE'
  },
  success: {
    border: ['#7C3AED', '#22C55E'],
    brand: '#C084FC',
    value: '#DCFCE7'
  },
  warn: {
    border: ['#7C3AED', '#F59E0B'],
    brand: '#F0ABFC',
    value: '#FEF3C7'
  },
  error: {
    border: ['#7C3AED', '#FB7185'],
    brand: '#FDA4AF',
    value: '#FFE4E6'
  },
  command: {
    border: ['#7C3AED', '#D946EF'],
    brand: '#D8B4FE',
    value: '#F8FAFC'
  },
  system: {
    border: ['#7C3AED', '#60A5FA'],
    brand: '#C4B5FD',
    value: '#EFF6FF'
  }
}

const LABEL_COLORS = {
  BOT: '#67E8F9',
  'BOT NUMERO': '#93C5FD',
  FECHA: '#FDE68A',
  USUARIO: '#F9A8D4',
  NUMERO: '#C4B5FD',
  REMITENTE: '#A7F3D0',
  GRUPO: '#86EFAC',
  PRIVADO: '#86EFAC',
  'GRUPO ID': '#A5B4FC',
  'CHAT ID': '#93C5FD',
  MIEMBROS: '#FDA4AF',
  PREFIJO: '#F0ABFC',
  COMANDO: '#FDE047',
  MENSAJE: '#FDBA74',
  ARGS: '#CBD5E1',
  DETALLE: '#DDD6FE',
  ESTADO: '#86EFAC',
  MODO: '#F0ABFC',
  PLATAFORMA: '#93C5FD',
  INFO: '#DDD6FE'
}

const VALUE_COLORS = {
  BOT: '#E0F2FE',
  'BOT NUMERO': '#DBEAFE',
  FECHA: '#FEF9C3',
  USUARIO: '#FCE7F3',
  NUMERO: '#EDE9FE',
  REMITENTE: '#D1FAE5',
  GRUPO: '#DCFCE7',
  PRIVADO: '#DCFCE7',
  'GRUPO ID': '#E0E7FF',
  'CHAT ID': '#DBEAFE',
  MIEMBROS: '#FFE4E6',
  PREFIJO: '#FAE8FF',
  COMANDO: '#FEF9C3',
  MENSAJE: '#FFEDD5',
  ARGS: '#E2E8F0',
  DETALLE: '#F5F3FF',
  ESTADO: '#DCFCE7',
  MODO: '#FAE8FF',
  PLATAFORMA: '#DBEAFE',
  INFO: '#F5F3FF'
}

function stripAnsi(text = '') {
  return String(text).replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
}

function normalizeText(text = '') {
  return String(text ?? '')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(text = '', max = WIDTH) {
  const clean = stripAnsi(normalizeText(text))
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean
}

function nullText(value = '') {
  const text = normalizeText(value)
  return text ? text : 'null'
}

function onlyNumber(value = '') {
  return String(value || '').split('@')[0].replace(/\D/g, '') || 'null'
}

function currentDateTime() {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date())
}

function borderText(text = '', themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  return gradient(theme.border[0], theme.border[1])(text)
}

function brandText(themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  return chalk.hex(theme.brand).bold(BRAND)
}

function pipeText(themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  return chalk.hex(theme.brand)('│')
}

function labelColor(label = '') {
  const clean = normalizeText(label || 'INFO').toUpperCase()
  return LABEL_COLORS[clean] || '#DDD6FE'
}

function valueColor(label = '', themeKey = 'system') {
  const clean = normalizeText(label || 'INFO').toUpperCase()
  const theme = THEMES[themeKey] || THEMES.system
  return VALUE_COLORS[clean] || theme.value || '#F8FAFC'
}

export function getMascot() {
  return FRAMES[frameIndex] || FRAMES[0]
}

export function bootConsoleTheme(title = 'RUBYJX BOT') {
  if (started) return
  started = true

  global.__rubyConsoleMascot = getMascot()

  const timer = setInterval(() => {
    frameIndex = (frameIndex + 1) % FRAMES.length
    global.__rubyConsoleMascot = getMascot()

    try {
      process.stdout.write(`\x1b]0;${BRAND} ${global.__rubyConsoleMascot}  ${title}  •  ${currentDateTime()}\x07`)
    } catch {}
  }, 300)

  if (typeof timer.unref === 'function') timer.unref()
}

function topBorder(title, themeKey = 'system') {
  const mascot = getMascot()
  const contentRaw = ` ${BRAND} ${mascot}  ${title} `
  const fill = '─'.repeat(Math.max(10, WIDTH - stripAnsi(contentRaw).length))

  const theme = THEMES[themeKey] || THEMES.system
  const brand = chalk.hex(theme.brand).bold(BRAND)
  const mascotText = chalk.hex('#F0ABFC').bold(mascot)
  const titleText = chalk.hex('#E9D5FF').bold(title)

  const content = ` ${brand} ${mascotText}  ${titleText} `

  return `${borderText('╭', themeKey)}${content}${borderText(fill + '╮', themeKey)}`
}

function bottomBorder(themeKey = 'system') {
  return borderText(`╰${'─'.repeat(WIDTH + 2)}╯`, themeKey)
}

function line(text = '', themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  const clean = truncate(text, WIDTH)
  return `${pipeText(themeKey)} ${brandText(themeKey)} ${chalk.hex(theme.value)(clean)}`
}

function pair(label, value, themeKey = 'system') {
  const cleanLabel = normalizeText(label || 'INFO').toUpperCase()
  const cleanValue = truncate(nullText(value), WIDTH - cleanLabel.length - BRAND.length - 5)

  const labelStyled = chalk.hex(labelColor(cleanLabel)).bold(`${cleanLabel}:`)
  const valueStyled = chalk.hex(valueColor(cleanLabel, themeKey))(cleanValue)

  return `${pipeText(themeKey)} ${brandText(themeKey)} ${labelStyled} ${valueStyled}`
}

export function panelLog(title = 'RUBYJX', rows = [], themeKey = 'system') {
  console.log('')
  console.log(topBorder(title, themeKey))

  rows.forEach((row) => {
    if (typeof row === 'string') {
      console.log(line(row, themeKey))
    } else {
      console.log(pair(row.label || 'INFO', row.value ?? 'null', themeKey))
    }
  })

  console.log(bottomBorder(themeKey))
}

export function printCommandLog({
  bot = '',
  botNumber = '',
  user = '',
  userNumber = '',
  sender = '',
  groupName = '',
  groupId = '',
  chatId = '',
  groupTotal = '',
  command = '',
  prefix = '',
  message = '',
  args = '',
  isGroup = false
}) {
  panelLog('RUBYJX • LOG SYSTEM', [
    { label: 'BOT', value: bot },
    { label: 'BOT NUMERO', value: botNumber || onlyNumber(bot) },
    { label: 'FECHA', value: currentDateTime() },
    { label: 'USUARIO', value: user },
    { label: 'NUMERO', value: userNumber || onlyNumber(sender) },
    { label: 'REMITENTE', value: sender },
    { label: isGroup ? 'GRUPO' : 'PRIVADO', value: isGroup ? groupName : 'Chat privado' },
    { label: 'GRUPO ID', value: isGroup ? groupId : 'null' },
    { label: 'CHAT ID', value: chatId },
    { label: 'MIEMBROS', value: isGroup ? groupTotal : 'null' },
    { label: 'PREFIJO', value: prefix || 'null' },
    { label: 'COMANDO', value: command || 'null' },
    { label: 'MENSAJE', value: message || 'null' },
    { label: 'ARGS', value: args || 'null' }
  ], 'command')
}

export function consoleLogInfo(msg) {
  panelLog('RUBYJX • INFO', [
    { label: 'DETALLE', value: msg }
  ], 'info')
}

export function consoleLogSuccess(msg) {
  panelLog('RUBYJX • SUCCESS', [
    { label: 'DETALLE', value: msg }
  ], 'success')
}

export function consoleLogWarn(msg) {
  panelLog('RUBYJX • AVISO', [
    { label: 'DETALLE', value: msg }
  ], 'warn')
}

export function consoleLogError(msg) {
  panelLog('RUBYJX • ERROR', [
    { label: 'DETALLE', value: msg }
  ], 'error')
}

export function consoleLogSystem(title, rows = []) {
  panelLog(title, rows, 'system')
}