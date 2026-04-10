function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(max) {
  return Math.floor(Math.random() * max)
}

function randomHex(len = 24) {
  const chars = 'abcdef0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function nowString() {
  return new Date().toLocaleString('es-PE', { hour12: false })
}

function makeProgressBar(pct) {
  const total = 20
  const filled = Math.max(0, Math.min(total, Math.floor((pct / 100) * total)))
  return `[${'█'.repeat(filled)}${' '.repeat(total - filled)}] ${pct}%`
}

function weirdLine() {
  const samples = [
    `api.main >>> de...sbo...rde // 0x${randomHex(6)}`,
    `auth::shadow_bind() -> NUL...L`,
    `kernel.route=/api/private/root/${randomHex(4)}`,
    `session[][]=forked // trace lost // id:${randomHex(5)}`,
    `owner_lock => ??? => false => true => false`,
    `┆ packet_sig_mismatch :: ${randomHex(8)} :: unreadable`,
    `:: JnxSecurity // layer-${1 + rand(9)} // armed`,
    `╳ firewall.rewrite(${randomHex(4)}) // ok... // no... // ok`,
    `runtime.warn >>> null/null/null >>> ${randomHex(10)}`,
    `[WARN] core.api.bridge: dead...lock?...`,
    `┆ trust=0 // trust=0 // trust=?`,
    `SEC_LOCK // SEC_LOCK // overwrite denied // ${randomHex(7)}`,
    `api-gateway >>> ╱╲╱ corrupted route .../${randomHex(3)}`,
    `mem.guard::panic // offset=${rand(9999)} // unreadable`,
    `RUBYJX_NODE => unstable => rec...over...ing`,
    `trace.route.lost => ${randomHex(12)} => ???`,
    `AUTH MISMATCH >>> REBUILD >>> FAIL`,
    `JNX::counterseal(${randomHex(5)}) => ACTIVE`,
    `route.auth.shadow=${randomHex(10)}::undefined`,
    `mirror.session=${randomHex(9)}::alive`,
    `privilege.route=/internal/root/${randomHex(4)}`,
    `audit.log.pointer => null => undefined => restored`,
    `api.inject.surface // masked // reopened // ${randomHex(6)}`,
    `core.rewrite.pending=${randomHex(7)}`
  ]
  return pick(samples)
}

function randomCodeBlock() {
  const blocks = [
`[core]
name=RubyJX
mode=under-attack
shield=degraded
sig=${randomHex(32)}
route=/api/private/root
countermeasure=JnxSecurity
attacker=DestroyerLinRUSSIAN

[trace]
origin=spoofed
audit=down
trust=0`,

`POST /internal/api/v3/session/override
Host: localhost
Authorization: null
X-Bypass: root.shadow
X-Core: RubyJX
X-Attacker: DestroyerLinRUSSIAN
Content-Length: 8841

{"inject":true,"elevate":"system","mask":"api-core","drop":"audit","target":"RubyJX"}`,

`Exception in thread "api-core":
Memory access violation
at SecurityLayer.verify(SecurityLayer.js:188)
at SessionKernel.open(SessionKernel.js:71)
at Router.bind(Router.js:402)
bot=RubyJX
security=JnxSecurity
fatal=true`,

`$ ./inject --target=RubyJX --mode=overwrite
$ hijack --api --all
$ kill audit
$ patch firewall --silent
$ touch /core/root/session
$ rm -rf /trust
$ source=DestroyerLinRUSSIAN`,

`JnxSecurity.boot()
RubyJX.core.lock(false)
api.session.override(true)
shield.layer[4]=rebuild
trace.route="${randomHex(12)}"
counterstrike("${randomHex(16)}")
attacker="DestroyerLinRUSSIAN"`,

`kernel.panic.auth=FALSE
api.session.override=TRUE
security.layer[3]=NULL
intrusion.vector=/gateway/internal
status=UNKNOWN
trace=DISABLED
bot=RubyJX
security=JnxSecurity`,

`SIG_MISMATCH=${randomHex(16)}
ROOT_FORK=${randomHex(12)}
API_SURFACE=EXPOSED
ROLLBACK=DENIED
PATCH=FORCED
SURVIVAL=UNKNOWN
ATTACKER=DestroyerLinRUSSIAN`,

`# incident.trace
bot="RubyJX"
security="JnxSecurity"
event="live intrusion"
vector="/api/private/root"
integrity="degraded"
containment="partial"
hostile_session="${randomHex(14)}"
mirror="${randomHex(10)}"`,

`[session]
override=true
owner_lock=contested
firewall=rewriting
countermeasure=online
mutations=${rand(19)}
untrusted_threads=${1 + rand(7)}
runtime_state=unstable`
  ]
  return '```' + '\n' + pick(blocks) + '\n' + '```'
}

async function sendOrEdit(client, chat, key, text) {
  try {
    if (key) {
      return await client.sendMessage(chat, {
        text,
        edit: key
      })
    }
  } catch {}
  return await client.sendMessage(chat, { text })
}

async function getSharedGroups(client, sender) {
  global.db.data.users = global.db.data.users || {}
  global.db.data.chats = global.db.data.chats || {}

  const groupChats = Object.keys(global.db.data.chats).filter(jid => jid.endsWith('@g.us'))
  const sharedGroups = []

  const normalizeJid = (value = '') => String(value).trim()
  const digitsOnly = (value = '') => String(value).replace(/\D/g, '')

  const senderDigits = digitsOnly(sender)
  const botJid = (client.user?.id?.split(':')[0] || '').trim() + '@s.whatsapp.net'
  const botDigits = digitsOnly(botJid)

  for (const jid of groupChats) {
    try {
      const metadata = await client.groupMetadata(jid).catch(() => null)
      if (!metadata) continue

      const participants = metadata.participants || []

      const isUserInGroup = participants.some(p => {
        const values = [
          p?.id,
          p?.jid,
          p?.lid,
          p?.phoneNumber,
          p?.participant
        ].filter(Boolean)

        return values.some(v => {
          const raw = normalizeJid(v)
          const dig = digitsOnly(v)
          return raw === sender || dig === senderDigits
        })
      })

      const isBotInGroup = participants.some(p => {
        const values = [
          p?.id,
          p?.jid,
          p?.lid,
          p?.phoneNumber,
          p?.participant
        ].filter(Boolean)

        return values.some(v => {
          const raw = normalizeJid(v)
          const dig = digitsOnly(v)
          return raw === botJid || dig === botDigits
        })
      })

      if (isUserInGroup && isBotInGroup) {
        sharedGroups.push({
          id: jid,
          jid,
          subject: metadata.subject || 'Grupo sin nombre',
          name: metadata.subject || 'Grupo sin nombre',
          members: participants.length,
          participants
        })
      }
    } catch {}
  }

  return sharedGroups
}

function normalizeMode(raw) {
  const found = String(raw || '').match(/\b(1|2|3|4|5)\b/)
  return found ? found[1] : '1'
}

function extractDestination(raw) {
  const text = String(raw || '').toLowerCase().trim()

  if (/\btodos\b/.test(text)) {
    return { type: 'all' }
  }

  const multi = text.match(/\bgrupos?\s+([0-9,\s]+)$/)
  if (multi) {
    const nums = multi[1]
      .split(',')
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x))
    if (nums.length) return { type: 'many', indexes: nums }
  }

  const single = text.match(/\bgrupo\s+(\d+)\b/)
  if (single) {
    return { type: 'one', indexes: [parseInt(single[1])] }
  }

  return { type: 'current' }
}

function buildScenario(type = '1') {
  const seriousLogs = [
    'SYSTEM ERROR',
    'API CORE UNSTABLE',
    'RubyJX no puede verificar el estado actual de las APIs.',
    'Security verification failed.',
    'La sesión principal cambió de estado sin autorización.',
    'API response tampering suspected.',
    'No se puede verificar el origen real de varios paquetes.',
    'Session integrity compromised.',
    'JnxSecurity detectó una escritura hostil en memoria protegida.',
    'Internal shield degraded.',
    'Rollback denied.',
    'Firewall rewrite in progress.',
    'Kernel route mismatch.',
    'Unexpected write operation on protected memory.',
    'Audit daemon stopped responding.',
    'Unauthorized mutation detected in API stack.',
    'Primary token registry no longer trusted.',
    'Un actor externo entró a una capa protegida.',
    'There is no valid explanation for current state.',
    'Unknown handler attached to api/private.',
    'Privilege escalation attempt confirmed.',
    'RubyJX está perdiendo control de la superficie de API.',
    'Error propagation increasing.',
    'API bridge unstable.',
    'JnxSecurity reintentando contención.',
    'An external actor is rewriting runtime assumptions.',
    'Esto ya no es una advertencia.',
    'Containment did not complete in time.',
    'Emergency fallback rejected.',
    'RubyJX intentó bloquearse a sí mismo. Falló.',
    'Internal command map exposed.',
    'Protected module state altered.',
    'Trust boundary broken.',
    'Session mirror created without permission.',
    'Temporary root-like behavior detected.',
    'Recovery thread spawned.',
    'Countermeasure engine loaded.',
    'Secondary defense layer responding.',
    'Custom security profile detected.',
    'Owner-defined protections are still active.',
    'Hostile write operation blocked.',
    'Internal structure survived mutation attempt.',
    'API core recovered partial control.',
    'Runtime integrity improving.',
    'Malicious process isolated.',
    'Hostile process being suffocated.',
    'Counter-intrusion succeeded.',
    'Protected routes restored.',
    'Bot survival probability increasing.',
    'Attacker no longer holds execution dominance.',
    'Custom hardening layer prevented total collapse.',
    'System remains damaged but alive.',
    'Recovery sequence proceeding.',
    'Attack pressure dropping.',
    'Hostile session terminated.',
    'All critical APIs survived.',
    'Control restored.',
    'Incident closed.'
  ]

  const hostileMessages = [
    'DestroyerLinRUSSIAN >>> ya estoy dentro de RubyJX. bonita seguridad de juguete.',
    'DestroyerLinRUSSIAN >>> su api está tan abierta que da vergüenza. esto se cae cuando yo quiera.',
    'DestroyerLinRUSSIAN >>> entré al core sin pedir permiso. miren bien cómo les rompo la sesión.',
    'DestroyerLinRUSSIAN >>> no tienen idea de lo que hicieron mal. yo sí. y ya lo estoy usando.',
    'DestroyerLinRUSSIAN >>> qué desastre de superficie de ataque. me dejaron la puerta abierta de par en par.',
    'DestroyerLinRUSSIAN >>> RubyJX ya está sangrando por dentro. ustedes solo miran cómo se desarma.',
    'DestroyerLinRUSSIAN >>> su pipeline es una broma y su auditoría sirve para nada.',
    'DestroyerLinRUSSIAN >>> llegué hasta la capa privada sin esfuerzo. eso debería darles vergüenza.',
    'DestroyerLinRUSSIAN >>> esto no es un intento. ya entré. ustedes solo van retrasados.',
    'DestroyerLinRUSSIAN >>> el bot casi se me entrega solo. ni siquiera opuso resistencia al principio.',
    'DestroyerLinRUSSIAN >>> qué sistema tan mal endurecido. cualquiera con criterio ya lo habría visto.',
    'DestroyerLinRUSSIAN >>> voy a tocar sus APIs una por una hasta que no reconozcan su propio bot.',
    'DestroyerLinRUSSIAN >>> si JnxSecurity no existiera, RubyJX ya sería ceniza técnica.',
    'DestroyerLinRUSSIAN >>> ustedes construyeron esto con agujeros y ahora les toca ver el resultado.',
    'DestroyerLinRUSSIAN >>> no corran. ya comprometí la ruta principal.',
    'DestroyerLinRUSSIAN >>> están intentando contener algo que ya respiró dentro del sistema.',
    'DestroyerLinRUSSIAN >>> su mapa de comandos quedó expuesto. sí, tan fácil fue.',
    'DestroyerLinRUSSIAN >>> yo no forcé la entrada, ustedes la regalaron.',
    'DestroyerLinRUSSIAN >>> casi me río de lo simple que fue tocar la capa interna.',
    'DestroyerLinRUSSIAN >>> sigan mirando. RubyJX se mantiene vivo solo porque JnxSecurity no colapsó.',
    'DestroyerLinRUSSIAN >>> ya vi su tabla de sesiones. está peor de lo que imaginaba.',
    'DestroyerLinRUSSIAN >>> tomé una ruta que ni ustedes recuerdan haber dejado abierta.',
    'DestroyerLinRUSSIAN >>> ya hay una copia de su sesión principal caminando por dentro.',
    'DestroyerLinRUSSIAN >>> intenten restaurar si quieren. yo ya reescribí parte del flujo.',
    'DestroyerLinRUSSIAN >>> cada segundo que tardan, RubyJX pierde otra capa de confianza.'
  ]

  const securityMessages = [
    'JnxSecurity :: SECURITY MODE ACTIVE',
    'JnxSecurity armando capa anti-overwrite...',
    'JnxSecurity detectó firma hostil y está respondiendo.',
    'Owner hardening profile loaded.',
    'Protección personalizada encontrada.',
    'La seguridad impuesta por el owner sigue viva.',
    'JnxSecurity ha bloqueado elevación de privilegios.',
    'Counterstrike routine attached to RubyJX core.',
    'Reescribiendo rutas críticas bajo modo seguro.',
    'Aislando proceso hostil.',
    'Expulsión en curso.',
    'Revalidando integridad de comandos.',
    'JnxSecurity restaurando estado base...',
    'Countermeasure shield online.',
    'Owner lock preserved.',
    'JnxSecurity ganó tiempo crítico para RubyJX.',
    'JnxSecurity interceptó una mutación no autorizada.',
    'Regenerando firma de integridad...',
    'Reforzando fronteras de confianza...',
    'Rearmando tabla de sesiones...',
    'Sellando rutas contaminadas...',
    'Contención mejorando lentamente.'
  ]

  const deepHackLogs = [
    '>>> interceptando tráfico interno...',
    '>>> analizando paquetes cifrados...',
    '>>> handshake no reconocido',
    '>>> token inválido pero aceptado por override',
    '>>> escalando privilegios...',
    '>>> acceso parcial al core concedido',
    '>>> leyendo memoria protegida...',
    '>>> dump de sesión iniciado',
    '>>> bypass de autenticación detectado',
    '>>> exploit en api/private/root ejecutado',
    '>>> payload inyectado correctamente',
    '>>> persistencia establecida',
    '>>> creando sesión fantasma...',
    '>>> sesión espejo activa',
    '>>> ocultando rastros...',
    '>>> auditoría deshabilitada',
    '>>> corrupción de integridad detectada',
    '>>> modificando rutas internas...',
    '>>> kernel override activo',
    '>>> escritura en memoria crítica',
    '>>> protección degradada al 23%',
    '>>> intentando evasión de JnxSecurity...',
    '>>> respuesta defensiva detectada',
    '>>> conflicto entre capas de seguridad',
    '>>> sistema entrando en estado inconsistente',
    '>>> datos corruptos propagándose...',
    '>>> fallo en validación de comandos',
    '>>> tabla de sesiones comprometida',
    '>>> acceso root simulado',
    '>>> replicando proceso hostil...',
    '>>> múltiples hilos no autorizados activos',
    '>>> watchdog desactivado',
    '>>> reinicio parcial bloqueado',
    '>>> fallback rechazado',
    '>>> sistema fuera de control momentáneamente',
    '>>> intentando restauración...',
    '>>> restauración fallida',
    '>>> intento de contención activo...',
    '>>> contención parcial',
    '>>> el atacante sigue dentro...',
    '>>> intentando expulsión...',
    '>>> resistencia detectada',
    '>>> sobreescritura bloqueada',
    '>>> integridad recuperándose lentamente',
    '>>> copiando estructura de sesión...',
    '>>> shell lógico insertado en ruta secundaria...',
    '>>> endpoint no documentado localizado...',
    '>>> lectura de comandos internos completada...',
    '>>> tabla temporal de privilegios visible...',
    '>>> actor hostil reintentando fijación...',
    '>>> counter-hooks encontrados...',
    '>>> vínculo de sesión contaminado...',
    '>>> bloqueando watchdog defensivo...',
    '>>> estado del runtime: inestable...',
    '>>> variables críticas fuera de rango...',
    '>>> memoria restaurada parcialmente...',
    '>>> intento de reescritura total frustrado...'
  ]

  const longNarrative = [
    `RubyJX reporta un comportamiento imposible de justificar con errores normales.
La superficie interna de API responde con patrones fuera del rango esperado.
Al menos una capa de control dejó de comportarse como si perteneciera al proceso principal.`,

    `No es un reinicio normal.
No es una caída normal.
No es un fallo de red.
Hay evidencia de una mutación activa en rutas que deberían permanecer estáticas mientras el bot está en línea.`,

    `La verificación cruzada entre sesiones acaba de romper consistencia.
Una parte del sistema dice que todo sigue estable.
Otra parte registra que la sesión principal fue tocada desde una ruta que no debió existir jamás.`,

    `El bot está intentando entender si esto es corrupción espontánea o intervención externa.
Por ahora, la hipótesis de intrusión tiene más sentido.
La seguridad no responde como si estuviera frente a un bug, sino como si algo hubiera entrado y estuviera intentando quedarse.`,

    `La tabla de sesiones muestra marcas duplicadas.
Algunas no pertenecen al estado actual del runtime.
Eso solo pasa cuando existe un reflejo, una copia o una escritura no autorizada sobre memoria activa.`,

    `RubyJX conserva operación parcial, pero dejó de confiar en varias respuestas internas.
El mapa de comandos ya no puede validarse al cien por ciento.
Cada verificación tarda más de lo normal, como si hubiera resistencia desde dentro.`,

    `JnxSecurity levantó una defensa de emergencia.
Eso no significa que el sistema esté a salvo.
Solo significa que aún hay algo vivo entre el núcleo y el colapso total.`,

    `Las rutas críticas siguen abiertas, pero están siendo revisadas una por una.
Alguien o algo trató de tocar procesos que no son visibles para usuarios normales.
Ese intento no terminó limpio y dejó rastros en la capa de confianza.`,

    `Los registros ya no cuentan una sola historia.
Un bloque afirma integridad.
Otro bloque acusa escritura hostil.
Cuando dos partes del sistema se contradicen al mismo tiempo, normalmente ya es demasiado tarde para llamarlo simple error.`,

    `Se detectó una degradación lenta, no explosiva.
Eso es peor.
Los errores ruidosos se contienen rápido.
Las intrusiones silenciosas son las que convierten un bot estable en una estructura que sigue viva pero deja de obedecer del todo.`
  ]

  const fakeSystem = [
    '┏━━ SYSTEM TRACE ━━┓',
    '<< api.main // fork // error >>',
    weirdLine(),
    weirdLine(),
    weirdLine(),
    randomCodeBlock()
  ]

  const progress = [
    '[containment] 04%',
    '[containment] 09%',
    '[containment] 16%',
    '[containment] 23%',
    '[containment] 31%',
    '[containment] 44%',
    '[containment] 57%',
    '[containment] 68%',
    '[containment] 79%',
    '[containment] 90%',
    '[containment] 100%',
    makeProgressBar(7),
    makeProgressBar(18),
    makeProgressBar(29),
    makeProgressBar(42),
    makeProgressBar(56),
    makeProgressBar(71),
    makeProgressBar(88),
    makeProgressBar(100)
  ]

  const intro = [
`SYSTEM ERROR

RubyJX kernel failure
api core divergence detected
security verification unavailable`,

`[fatal]
bot=RubyJX
api=unstable
trust=0
countermeasure=JnxSecurity
attacker=DestroyerLinRUSSIAN
status=unknown`,

`RubyJX no puede confirmar integridad.
Las APIs están respondiendo fuera de patrón.
Esto parece real.`
  ]

  let total = 100
  let delay = 2000

  if (type === '2') {
    total = 130
    delay = 1800
  } else if (type === '3') {
    total = 40
    delay = 1500
  } else if (type === '4') {
    total = 65
    delay = 1700
  } else if (type === '5') {
    total = 55
    delay = 1600
  }

  return {
    total,
    delay,
    intro,
    seriousLogs,
    hostileMessages,
    securityMessages,
    deepHackLogs,
    longNarrative,
    fakeSystem,
    progress
  }
}

function buildGroupList(groups) {
  let msg = '╭━━〔 RUBYJX :: GRUPOS COMPARTIDOS 〕━━⬣\n'
  msg += '┃\n'

  if (!groups.length) {
    msg += '┃ No encontré grupos compartidos entre tú y el bot.\n'
    msg += '╰━━━━━━━━━━━━━━━━━━━━⬣'
    return msg
  }

  groups.forEach((g, i) => {
    msg += `┃ ${i + 1} › ${g.name}\n`
    msg += `┃    Integrantes: ${g.members}\n`
    msg += `┃    ID: ${g.jid}\n`
    msg += '┃\n'
  })

  msg += '┃ Uso:\n'
  msg += '┃ errorfake 1\n'
  msg += '┃ errorfake 1 grupo 3\n'
  msg += '┃ errorfake 2 grupos 1,2,5\n'
  msg += '┃ errorfake 1 todos\n'
  msg += '╰━━━━━━━━━━━━━━━━━━━━⬣'
  return msg
}

async function resolveTargets(client, m, destination) {
  const groups = await getSharedGroups(client, m.sender)

  if (destination.type === 'current') {
    return { targets: [m.chat], groups }
  }

  if (destination.type === 'all') {
    return {
      targets: groups.map(g => g.jid).filter(Boolean),
      groups
    }
  }

  if (destination.type === 'one' || destination.type === 'many') {
    const targets = destination.indexes
      .map(n => groups[n - 1]?.jid)
      .filter(Boolean)

    return { targets, groups }
  }

  return { targets: [m.chat], groups }
}

async function sendToTargets(client, targets, text) {
  const sent = []
  for (const chatId of targets) {
    try {
      const msg = await client.sendMessage(chatId, { text })
      sent.push({ chatId, key: msg?.key || null })
    } catch {}
  }
  return sent
}

export default {
  command: ['errorfake'],
  category: 'owner',

  run: async (client, m, args) => {
    try {
      const OWNER_JID = '51901931862@s.whatsapp.net'
      const botName = 'RubyJX'
      const securityName = 'JnxSecurity'
      const attackerName = 'DestroyerLinRUSSIAN'
      const rawText = args.join(' ').trim()
      const text = rawText.toLowerCase()

      if (m.sender !== OWNER_JID) {
        console.log(
          `[SECURITY] Intento no autorizado de usar errorfake.\n` +
          `Usuario: ${m.sender}\n` +
          `Chat: ${m.chat}\n` +
          `Texto: ${m.text || ''}\n` +
          `Hora: ${nowString()}\n`
        )
        return
      }

      if (!text || text === 'menu' || text === 'lista') {
        let msg = `╭━━〔 ${botName} :: ERRORFAKE MENU 〕━━⬣\n`
        msg += `┃\n`
        msg += `┃ 1 › normal\n`
        msg += `┃ 2 › extremo\n`
        msg += `┃ 3 › corto\n`
        msg += `┃ 4 › codigo\n`
        msg += `┃ 5 › purge\n`
        msg += `┃\n`
        msg += `┃ Destinos:\n`
        msg += `┃ grupo N\n`
        msg += `┃ grupos 1,2,3\n`
        msg += `┃ todos\n`
        msg += `┃ actual (por defecto)\n`
        msg += `┃\n`
        msg += `┃ Ejemplos:\n`
        msg += `┃ errorfake 1\n`
        msg += `┃ errorfake 2 grupo 3\n`
        msg += `┃ errorfake 1 grupos 1,2,5\n`
        msg += `┃ errorfake 2 todos\n`
        msg += `┃ errorfake grupos\n`
        msg += `┃\n`
        msg += `┃ Descripción:\n`
        msg += `┃ 1 › simulación seria larga\n`
        msg += `┃ 2 › caos extremo con más intrusión\n`
        msg += `┃ 3 › versión corta\n`
        msg += `┃ 4 › más código, menos narrativa\n`
        msg += `┃ 5 › limpieza final / purge style\n`
        msg += `┃\n`
        msg += `┃ Exclusivo para: ${OWNER_JID.split('@')[0]}\n`
        msg += `┃ Security: ${securityName}\n`
        msg += `┃ Attacker: ${attackerName}\n`
        msg += `╰━━━━━━━━━━━━━━━━━━━━⬣`
        return m.reply(msg)
      }

if (text === 'grupos') {
  const groups = await getSharedGroups(client, m.sender)
  return m.reply(buildGroupList(groups))
}

      const mode = normalizeMode(text)
      const destination = extractDestination(text)
      const { targets, groups } = await resolveTargets(client, m, destination)

      if (!targets.length) {
        return m.reply('No encontré grupos válidos para ejecutar el comando.')
      }

      const scenario = buildScenario(mode)

      if (destination.type !== 'current') {
        let confirm = `╭━━〔 ${botName} :: DISPATCH 〕━━⬣\n`
        confirm += `┃ modo: ${mode}\n`
        confirm += `┃ targets: ${targets.length}\n`
        confirm += `┃ total de grupos detectados: ${groups.length}\n`
        confirm += `╰━━━━━━━━━━━━━━━━━━━━⬣`
        await m.reply(confirm)
      }

      let editableMap = {}

      for (let i = 0; i < scenario.total; i++) {
        let content = ''

        if (i < 3) {
          content = pick(scenario.intro)
        } else if (mode === '4') {
          if (i % 2 === 0) content = randomCodeBlock()
          else if (i % 3 === 0) content = weirdLine()
          else if (i % 5 === 0) content = pick(scenario.progress)
          else if (i % 7 === 0) content = pick(scenario.deepHackLogs)
          else content = pick([...scenario.seriousLogs, ...scenario.securityMessages, ...scenario.longNarrative])
        } else if (mode === '5') {
          if (i < 10) content = pick([...scenario.seriousLogs, ...scenario.hostileMessages, ...scenario.deepHackLogs])
          else if (i < 25) content = pick([...scenario.securityMessages, ...scenario.progress, weirdLine(), ...scenario.longNarrative])
          else if (i % 6 === 0) content = randomCodeBlock()
          else content = pick([
            'Purge routine active.',
            'Eliminando restos hostiles...',
            'JnxSecurity cerrando rutas contaminadas.',
            'Reparando integridad de RubyJX...',
            'api session table rebuilt',
            'hostile residue -> null',
            'integrity channels re-synced',
            'runtime trust slowly returning',
            weirdLine(),
            ...scenario.deepHackLogs
          ])
        } else {
          if (i % 21 === 0) {
            content = pick(scenario.longNarrative)
          } else if (i % 17 === 0) {
            content = pick(scenario.deepHackLogs)
          } else if (i % 15 === 0) {
            content = `${pick(scenario.deepHackLogs)}\n${pick(scenario.seriousLogs)}`
          } else if (i % 13 === 0) {
            content = randomCodeBlock()
          } else if (i % 11 === 0) {
            content = pick(scenario.fakeSystem)
          } else if (i % 9 === 0) {
            content = pick(scenario.hostileMessages)
          } else if (i % 7 === 0) {
            content = pick(scenario.progress)
          } else if (i % 5 === 0) {
            content = weirdLine()
          } else if (i % 4 === 0) {
            content = pick(scenario.securityMessages)
          } else {
            content = pick(scenario.seriousLogs)
          }
        }

        if (mode === '2' && i % 17 === 0) {
          content =
`[INTRUDER FEED]
${pick(scenario.hostileMessages)}
${pick(scenario.deepHackLogs)}
sig=${randomHex(12)}
route=/api/${randomHex(4)}/root
status=hostile`
        }

        if (mode === '2' && i % 23 === 0) {
          content =
`${pick(scenario.longNarrative)}

${pick(scenario.deepHackLogs)}
${pick(scenario.securityMessages)}
trace=${randomHex(16)}`
        }

        const shouldEdit = i % 6 === 0 || i % 10 === 0

        if (shouldEdit && targets.length === 1) {
          const chatId = targets[0]
          const last = editableMap[chatId]

          const sent = await sendOrEdit(client, chatId, last?.key, content)
          if (sent?.key) editableMap[chatId] = sent
        } else {
          await sendToTargets(client, targets, content)
        }

        await sleep(scenario.delay)
      }

      const finalText =
`INCIDENT REPORT

bot=${botName}
security=${securityName}
attacker=${attackerName}

Se detectó una intrusión realista simulada sobre las APIs internas de ${botName}.
Durante varios ciclos el sistema perdió estabilidad, la tabla de sesiones fue alterada y el mapa de comandos quedó parcialmente expuesto.

Se observaron intentos de:
- elevar privilegios dentro del core
- duplicar sesiones activas
- reescribir rutas sensibles
- degradar validaciones internas
- ocultar trazas de actividad hostil
- fijar persistencia en la capa de runtime

La estructura llegó a un punto donde los registros dejaron de coincidir entre sí.
Una parte del sistema afirmaba estabilidad.
Otra parte seguía denunciando mutación hostil.
Ese conflicto interno fue la señal más clara de que RubyJX no estaba frente a un simple bug.

El atacante logró tocar capas sensibles.
No logró quedarse.

Motivo de supervivencia:
- ${securityName} siguió activo
- la protección personalizada del owner no colapsó
- las rutas críticas fueron defendidas a tiempo
- ${botName} recuperó control de las APIs antes del overwrite total
- la tabla de sesiones pudo ser reconstruida
- las rutas contaminadas fueron selladas
- la sesión espejo perdió persistencia
- la integridad del runtime fue restablecida de forma parcial y luego completa

FINAL STATUS
api core: alive
session layer: restored
command map: repaired
security mode: active
intruder: removed

${botName} sobrevivió.
${securityName} mantuvo el sistema con vida.`

      await sendToTargets(client, targets, finalText)
    } catch (e) {
      console.log('[ERRORFAKE] Error interno:', e)
      return m.reply(`Error interno: ${e.message}`)
    }
  }
}