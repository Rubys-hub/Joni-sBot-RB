import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { menuObject } from '../../core/commands.js'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const outFile = path.join(root, 'rubyjx-bot-web', 'assets', 'commands-data.js')
const cmdsDir = path.join(root, 'cmds')

const categoryMeta = {
  main: {
    title: 'Principal',
    icon: '✦',
    color: '#72f7ff',
    intro: 'Comandos base para abrir menús, consultar información del bot, medir respuesta y enviar reportes.'
  },
  economia: {
    title: 'Economía',
    icon: '💰',
    color: '#9dff7a',
    intro: 'Sistema de dinero, banco, recompensas, apuestas, granjas y movimiento económico dentro del grupo.'
  },
  gacha: {
    title: 'Gacha',
    icon: '🎴',
    color: '#ff74d4',
    intro: 'Colección de personajes, tienda, favoritos, rankings, intercambios y acciones de waifus.'
  },
  downloads: {
    title: 'Descargas',
    icon: '📥',
    color: '#48d7ff',
    intro: 'Búsquedas y descargas desde YouTube, TikTok, Instagram, Facebook, X, MediaFire, Drive y más.'
  },
  profile: {
    title: 'Perfil',
    icon: '👤',
    color: '#ffd166',
    intro: 'Perfil social del usuario: nivel, experiencia, cumpleaños, descripción, género, hobbies y pareja.'
  },
  sockets: {
    title: 'Sockets',
    icon: '🔐',
    color: '#a78bfa',
    intro: 'Funciones para subbots, sesiones, conexión, identidad visual y configuración de sockets.'
  },
  stickers: {
    title: 'Stickers',
    icon: '🎨',
    color: '#ff9f43',
    intro: 'Creación de stickers, efectos, packs, metadata, nombres, autores y administración de colecciones.'
  },
  utils: {
    title: 'Utilidades',
    icon: '🛠️',
    color: '#66e3ff',
    intro: 'Herramientas de IA, texto, traducción, enlaces, multimedia, sistema, logs y productividad.'
  },
  grupo: {
    title: 'Grupo',
    icon: '👥',
    color: '#b7ff5c',
    intro: 'Moderación, seguridad, configuración del grupo, advertencias, rachas, menciones e inactividad.'
  },
  nsfw: {
    title: 'NSFW',
    icon: '🔞',
    color: '#ff5c8a',
    intro: 'Comandos para grupos con contenido adulto activado. Se documentan con descripción moderada.'
  },
  anime: {
    title: 'Anime',
    icon: '🌌',
    color: '#c084fc',
    intro: 'Imágenes anime, parejas de perfil y extras visuales relacionados con el estilo anime.'
  },
  interacciones: {
    title: 'Interacciones',
    icon: '💞',
    color: '#ff7ad9',
    intro: 'Acciones sociales, emociones, gestos, convivencia, roleplay suave y respuestas visuales.'
  },
  reactions: {
    title: 'Reacciones',
    icon: '🎯',
    color: '#60a5fa',
    intro: 'Sistema de reacciones comprables, equipables y coleccionables para personalizar el bot.'
  },
  vip: {
    title: 'VIP',
    icon: '💎',
    color: '#67e8f9',
    intro: 'Funciones especiales para usuarios VIP cuando el sistema está disponible.'
  },
  eventos: {
    title: 'Eventos',
    icon: '⚡',
    color: '#f0abfc',
    intro: 'Eventos y paneles especiales del bot que no pertenecen a una categoría tradicional.'
  }
}

const categoryMap = {
  rpg: 'economia',
  economy: 'economia',
  download: 'downloads',
  downloader: 'downloads',
  search: 'downloads',
  tools: 'utils',
  info: 'main',
  fun: 'profile',
  group: 'grupo',
  grupo: 'grupo',
  socket: 'sockets',
  sockets: 'sockets',
  internet: 'downloads',
  ai: 'utils',
  github: 'utils',
  react: 'reactions',
  reacts: 'reactions',
  anime: 'anime',
  nsfw: 'nsfw',
  main: 'main',
  gacha: 'gacha',
  profile: 'profile',
  stickers: 'stickers',
  sticker: 'stickers',
  vip: 'vip',
  eventos: 'eventos'
}

const excludePaths = [
  /cmds[\\/]owner[\\/]/i,
  /owner-messagger\.js$/i,
  /promocion\.js$/i,
  /reactowner\.js$/i,
  /auditeco\.js$/i,
  /farmowner\.js$/i,
  /takecoins\.js$/i,
  /ebglobalowner\.js$/i,
  /cmds[\\/]anime[\\/]inter\.js$/i,
  /cmds[\\/]nsfw[\\/]inter\.js$/i
]

const menuEntries = parseMenuObject(menuObject)
const moduleEntries = await readModuleEntries()
const merged = mergeEntries(menuEntries, moduleEntries)

const categories = Object.values(
  merged.reduce((acc, command) => {
    if (!acc[command.category]) {
      const meta = categoryMeta[command.category] || {
        title: titleCase(command.category),
        icon: '✧',
        color: '#a5f3fc',
        intro: 'Comandos públicos detectados desde los archivos del bot.'
      }
      acc[command.category] = {
        id: command.category,
        ...meta,
        commands: []
      }
    }
    acc[command.category].commands.push(command)
    return acc
  }, {})
).sort((a, b) => orderOf(a.id) - orderOf(b.id))

for (const category of categories) {
  category.commands.sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

const data = {
  generatedAt: new Date().toISOString(),
  bot: {
    name: 'RubyJX Bot',
    version: '^3.0 - Latest',
    stack: 'WhatsApp Bot Multi Device · Baileys · Node.js',
    author: 'J_Drsx',
    publicCommands: categories.reduce((total, category) => total + category.commands.length, 0),
    categories: categories.length
  },
  categories
}

fs.writeFileSync(outFile, `window.RUBYJX_COMMAND_DATA = ${JSON.stringify(data, null, 2)};\n`, 'utf8')
console.log(`Generated ${data.bot.publicCommands} public commands in ${categories.length} categories`)
console.log(outFile)

function parseMenuObject(obj) {
  const entries = []
  for (const [rawCategory, block] of Object.entries(obj)) {
    const category = normalizeCategory(rawCategory)
    if (category === 'owner') continue
    const text = String(block || '')
    const pattern = /\*\s*([^*\n]*\$prefix[^*\n]*)\s*\*\s*\n>\s*([^\n]+)/g
    let match
    while ((match = pattern.exec(text))) {
      const aliases = extractAliases(match[1])
      if (!aliases.length) continue
      const name = normalizeCommandName(aliases[0])
      if (!name || isOwnerish(name)) continue
      entries.push({
        name,
        aliases: unique(aliases.map(normalizeCommandName).filter(Boolean)).filter(alias => !isOwnerish(alias)),
        category,
        short: cleanDescription(match[2]),
        source: 'menu'
      })
    }
  }
  return entries
}

async function readModuleEntries() {
  const files = walk(cmdsDir).filter(file => file.endsWith('.js'))
  const entries = []

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/')
    if (excludePaths.some(rx => rx.test(rel))) continue
    const source = fs.readFileSync(file, 'utf8')
    if (!/\bcommand\s*:/.test(source)) continue

    const categoryRaw = extractCategory(source)
    if (/\bisOwner\s*:\s*true\b/.test(source) || normalizeCategory(categoryRaw) === 'owner') continue

    const commands = extractCommands(source)
    if (!commands.length) continue
    const aliases = unique(commands.map(normalizeCommandName).filter(Boolean)).filter(alias => !isOwnerish(alias))
    if (!aliases.length) continue

    const category = normalizeCategory(inferCategoryFromPath(rel) || categoryRaw)
    if (category === 'owner') continue

    entries.push({
      name: aliases[0],
      aliases,
      category,
      short: '',
      source: rel
    })
  }

  return entries
}

function extractCategory(source) {
  return source.match(/\bcategory\s*:\s*['"]([^'"]+)['"]/)?.[1] || ''
}

function extractCommands(source) {
  const commandMatch = source.match(/\bcommand\s*:\s*(\[[\s\S]*?\]|[A-Z_$][A-Z0-9_$]*)\s*[,}]/i)
  if (!commandMatch) return []

  let raw = commandMatch[1]
  if (!raw.startsWith('[')) {
    const varName = raw.replace(/[^\w$]/g, '')
    const varMatch = source.match(new RegExp(`(?:const|let|var)\\s+${escapeRegex(varName)}\\s*=\\s*(\\[[\\s\\S]*?\\])`, 'm'))
    raw = varMatch?.[1] || ''
  }
  if (!raw) return []

  return [...raw.matchAll(/['"`]([^'"`]+)['"`]/g)]
    .map(match => match[1])
    .filter(value => !/[{}[\]\n]/.test(value))
}

function mergeEntries(menuEntries, moduleEntries) {
  const byName = new Map()
  const aliasIndex = new Map()

  for (const entry of [...menuEntries, ...moduleEntries]) {
    const canonicalAlias = entry.aliases.find(alias => aliasIndex.has(alias))
    const key = canonicalAlias ? aliasIndex.get(canonicalAlias) : entry.name
    const existing = byName.get(key)
    if (!existing) {
      const decorated = decorateCommand(entry)
      byName.set(key, decorated)
      for (const alias of decorated.aliases) aliasIndex.set(alias, key)
      continue
    }
    existing.aliases = unique([...existing.aliases, ...entry.aliases])
    for (const alias of existing.aliases) aliasIndex.set(alias, key)
    if (!existing.short && entry.short) existing.short = entry.short
    if (existing.source !== 'menu' && entry.source === 'menu') existing.source = 'menu'
    if (entry.source === 'menu') existing.source = existing.source === 'menu' ? existing.source : `${existing.source} + menu`
  }

  return [...byName.values()]
    .filter(command => command.name && command.category !== 'owner')
    .map(decorateCommand)
}

function decorateCommand(entry) {
  const category = normalizeCategory(entry.category)
  const short = entry.short || fallbackShort(entry.name, category)
  return {
    name: entry.name,
    aliases: unique(entry.aliases || [entry.name]),
    category,
    short,
    detail: buildDetail(entry.name, category, short),
    usage: buildUsage(entry.name, category),
    tip: buildTip(entry.name, category),
    source: entry.source || 'module'
  }
}

function buildDetail(name, category, short) {
  const base = short.replace(/\.$/, '')
  const context = {
    economia: 'Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat.',
    gacha: 'Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus.',
    downloads: 'Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas.',
    profile: 'Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles.',
    sockets: 'Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples.',
    stickers: 'Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda.',
    utils: 'Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema.',
    grupo: 'Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo.',
    nsfw: 'Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad.',
    anime: 'Entrega contenido visual anime o extras de estilo, ideal para grupos que disfrutan estética, parejas de perfil y contenido ligero.',
    interacciones: 'Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido.',
    reactions: 'Permite que cada usuario compre, equipe o administre reacciones para darle personalidad a sus respuestas.',
    vip: 'Agrupa beneficios especiales cuando el sistema VIP está activo.'
  }[category] || 'Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso.'

  return `${base}. ${context} En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.`
}

function buildUsage(name, category) {
  const examples = {
    economia: `.${name} [cantidad / usuario / opción]`,
    gacha: `.${name} [personaje / opción / usuario]`,
    downloads: `.${name} [búsqueda o enlace]`,
    profile: `.${name} [usuario o dato]`,
    sockets: `.${name} [opción de conexión]`,
    stickers: `.${name} respondiendo a una imagen, video o sticker`,
    utils: `.${name} [texto, enlace o archivo respondido]`,
    grupo: `.${name} [usuario, opción o configuración]`,
    nsfw: `.${name} [usuario o búsqueda]`,
    anime: `.${name} [opcional: usuario o búsqueda]`,
    interacciones: `.${name} @usuario`,
    reactions: `.${name} [list | buy | select | my | unequip]`,
    vip: `.${name} [opción VIP]`
  }
  return examples[category] || `.${name}`
}

function buildTip(name, category) {
  const tips = {
    economia: 'Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.',
    gacha: 'Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.',
    downloads: 'Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.',
    profile: 'Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.',
    sockets: 'Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.',
    stickers: 'Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.',
    utils: 'Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.',
    grupo: 'La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.',
    nsfw: 'Debe usarse solo en grupos adecuados y con la función NSFW activada.',
    anime: 'Ideal para dinamizar el chat con contenido visual ligero.',
    interacciones: 'Menciona a alguien para que la acción salga más natural y personalizada.',
    reactions: 'Compra primero, luego equipa tu reacción favorita para usarla cuando quieras.',
    vip: 'Depende de que el sistema VIP esté activo para el usuario.'
  }
  return tips[category] || 'Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.'
}

function fallbackShort(name, category) {
  if (category === 'interacciones') return `Ejecuta la interacción social “${name}” dentro del chat`
  if (category === 'nsfw') return `Ejecuta una acción o búsqueda NSFW relacionada con “${name}”`
  return `Ejecuta el comando público “${name}” dentro de la categoría ${categoryMeta[category]?.title || category}`
}

function extractAliases(line) {
  return unique([...String(line).matchAll(/\$prefix([^\s*»]+)/g)].map(match => match[1]))
}

function cleanDescription(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[╰╭┃│]/g, '')
    .trim()
}

function normalizeCommandName(value) {
  return String(value || '')
    .replace(/^\./, '')
    .replace(/^\$prefix/, '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()
}

function normalizeCategory(value) {
  const raw = String(value || '').trim().toLowerCase()
  return categoryMap[raw] || raw || 'main'
}

function inferCategoryFromPath(rel) {
  const parts = rel.split('/')
  const folder = String(parts[1] || '').toLowerCase()
  const map = {
    main: 'main',
    economy: 'economia',
    gacha: 'gacha',
    downloads: 'downloads',
    profile: 'profile',
    group: 'grupo',
    stickers: 'stickers',
    utils: 'utils',
    socket: 'sockets',
    anime: 'anime',
    nsfw: 'nsfw',
    reacts: 'reactions',
    vip: 'vip',
    adminabuse: 'eventos'
  }
  return map[folder] || ''
}

function isOwnerish(name) {
  return /owner|auditeco|farmowner|takecoins|quitcoins|removecoins|addcoin|addxp|restart|exec|^ex$|^e$/.test(String(name || '').toLowerCase())
}

function walk(dir) {
  const out = []
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

function unique(items) {
  return [...new Set(items.filter(Boolean))]
}

function titleCase(value) {
  return String(value || '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function orderOf(id) {
  const order = ['main', 'economia', 'gacha', 'downloads', 'profile', 'grupo', 'stickers', 'utils', 'sockets', 'anime', 'interacciones', 'reactions', 'vip', 'eventos', 'nsfw']
  const index = order.indexOf(id)
  return index === -1 ? 99 : index
}
