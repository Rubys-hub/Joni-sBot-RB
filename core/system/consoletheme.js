import chalk from 'chalk'
import gradient from 'gradient-string'

const FRAMES = [
  'ᕕ( ⌐■_■ )ᕗ',
  'ᕗ( ⌐■_■ )ᕕ',
  'ᕕ( •ω• )ᕗ',
  'ᕗ( •ω• )ᕕ',
  'ᕕ( ᐛ )ᕗ',
  'ᕗ( ᐛ )ᕕ'
]

let frameIndex = 0
let started = false

const THEMES = {
  info: {
    border: ['#6D28D9', '#C77DFF'],
    label: chalk.hex('#D8B4FE').bold,
    value: chalk.hex('#F5F3FF')
  },
  success: {
    border: ['#6D28D9', '#4ADE80'],
    label: chalk.hex('#86EFAC').bold,
    value: chalk.hex('#F0FDF4')
  },
  warn: {
    border: ['#7E22CE', '#F59E0B'],
    label: chalk.hex('#FCD34D').bold,
    value: chalk.hex('#FFFBEB')
  },
  error: {
    border: ['#7E22CE', '#FB7185'],
    label: chalk.hex('#FDA4AF').bold,
    value: chalk.hex('#FFF1F2')
  },
  command: {
    border: ['#7C3AED', '#D946EF'],
    label: chalk.hex('#E9C6FF').bold,
    value: chalk.hex('#FFFFFF')
  },
  system: {
    border: ['#6D28D9', '#60A5FA'],
    label: chalk.hex('#BFDBFE').bold,
    value: chalk.hex('#EFF6FF')
  }
}

const WIDTH = 96
const BRAND = '[ ⌬ ]'

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

function onlyNumber(value = '') {
  return String(value || '').split('@')[0].replace(/\D/g, '') || 'null'
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
  }, 280)

  if (typeof timer.unref === 'function') timer.unref()
}

function topBorder(title, themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  const grad = gradient(theme.border[0], theme.border[1])
  const mascot = getMascot()
  const content = ` ${BRAND} ${mascot}  ${title} `
  const fill = '─'.repeat(Math.max(10, WIDTH - stripAnsi(content).length))
  return grad(`╭${content}${fill}╮`)
}

function bottomBorder(themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  const grad = gradient(theme.border[0], theme.border[1])
  return grad(`╰${'─'.repeat(WIDTH + 2)}╯`)
}

function line(text = '', themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  const clean = truncate(text, WIDTH)
  return `${chalk.hex('#8B5CF6')('│')} ${chalk.hex('#D8B4FE').bold(BRAND)} ${theme.value(clean)}`
}

function pair(label, value, themeKey = 'system') {
  const theme = THEMES[themeKey] || THEMES.system
  const left = theme.label(`${BRAND} ${label}:`)
  const right = theme.value(truncate(nullText(value), WIDTH - stripAnsi(label).length - BRAND.length - 5))
  return `${chalk.hex('#8B5CF6')('│')} ${left} ${right}`
}

export function panelLog(title = 'RUBYJX', rows = [], themeKey = 'system') {
  console.log('')
  console.log(topBorder(title, themeKey))

  for (const row of rows) {
    if (typeof row === 'string') {
      console.log(line(row, themeKey))
    } else {
      console.log(pair(row.label || 'INFO', row.value ?? 'null', themeKey))
    }
  }

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