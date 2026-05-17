import "./settings.js"
import main from './main.js'
import events from './cmds/events.js'
import { groupParticipantsUpdate } from './cmds/events.js'
import {
  Browsers,
  makeWASocket,
  useMultiFileAuthState,
  jidDecode,
  DisconnectReason
} from "baileys";
import cfonts from 'cfonts';
import pino from "pino";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import readline from "readline";
import os from "os";
import { smsg } from "./core/message.js";
import db from "./core/system/database.js";
import { startSubBot } from './core/subs.js';
import seecmds from "./core/system/commandLoader.js";
import { exec, execSync } from "child_process";
import {
  bootConsoleTheme,
  consoleLogInfo,
  consoleLogSuccess,
  consoleLogWarn,
  consoleLogError,
  consoleLogSystem
} from "./core/system/consoleTheme.js";


const log = {
  info: (msg) => consoleLogInfo(msg),
  success: (msg) => consoleLogSuccess(msg),
  warn: (msg) => consoleLogWarn(msg),
  warning: (msg) => consoleLogWarn(msg),
  error: (msg) => consoleLogError(msg)
};

  let phoneNumber = global.botNumber || ""
  let phoneInput = ""
  const methodCodeQR = process.argv.includes("--qr")
  const methodCode = process.argv.includes("--code")
  const DIGITS = (s = "") => String(s).replace(/\D/g, "");

  function normalizePhoneForPairing(input) {
    let s = DIGITS(input);
    if (!s) return "";
    if (s.startsWith("0")) s = s.replace(/^0+/, "");
    if (s.length === 10 && s.startsWith("3")) {
      s = "57" + s;
    }
    if (s.startsWith("52") && !s.startsWith("521") && s.length >= 12) {
      s = "521" + s.slice(2);
    }
    if (s.startsWith("54") && !s.startsWith("549") && s.length >= 11) {
      s = "549" + s.slice(2);
    }
    return s;
  }
  
const { say } = cfonts

console.clear()
bootConsoleTheme('RUBYJX BOT')

consoleLogSystem('RUBYJX • ARRANQUE', [
  { label: 'ESTADO', value: '⌬ Iniciando sistema principal...' },
  { label: 'MODO', value: methodCodeQR ? 'QR' : methodCode ? 'Código' : 'Normal' },
  { label: 'PLATAFORMA', value: `${os.platform()} ${os.release()}` }
])

say('RUBYJX BOT', {
  align: 'center',
  font: 'block',
  gradient: ['#7C3AED', '#D946EF']
})

say('Powered by J_Drsx', {
  font: 'console',
  align: 'center',
  gradient: ['#A78BFA', '#F0ABFC']
})

const BOT_TYPES = [
  { name: 'SubBot', folder: './Sessions/Subs', starter: startSubBot }
]

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true });
global.conns = global.conns || []
const reconnecting = new Set()


const messageStore = global.baileysMessageStore ||= new Map()

function getMessageKey(key = {}) {
  return `${key.remoteJid || ''}:${key.id || ''}`
}

async function getMessageFromStore(key) {
  const msg = messageStore.get(getMessageKey(key))
  return msg?.message || undefined
}


async function loadBots() {
  for (const { name, folder, starter } of BOT_TYPES) {
    if (!fs.existsSync(folder)) continue
    const botIds = fs.readdirSync(folder)
    for (const userId of botIds) {
      const sessionPath = path.join(folder, userId)
      const credsPath = path.join(sessionPath, 'creds.json')
      if (!fs.existsSync(credsPath)) continue
      if (global.conns.some((conn) => conn.userId === userId)) continue
      if (reconnecting.has(userId)) continue
      try {
        reconnecting.add(userId)
        await starter(null, null, 'Auto reconexión', false, userId, sessionPath)
      } catch (e) {
        reconnecting.delete(userId)
      }
      await new Promise((res) => setTimeout(res, 2500))
    }
  }
  setTimeout(loadBots, 60 * 1000)
}

(async () => {
  await loadBots()
})()

function cleanTmp() {
  try {
    const files = fs.readdirSync('./tmp');
    for (const file of files) {
      try { fs.rmSync('./tmp/' + file, { recursive: true, force: true }); } catch {}
    }
    if (files.length > 0) log.info(`[ ⌬ ] Limpiados ${files.length} archivos temporales de tmp`);

} catch {}
}
setInterval(cleanTmp, 1 * 60 * 60 * 1000);

let opcion;
if (methodCodeQR) {
  opcion = "1";
} else if (methodCode) {
  opcion = "2";
} else if (!fs.existsSync("./Sessions/Owner/creds.json")) {
  opcion = readlineSync.question(chalk.bold.white("\nSeleccione una opción:\n") + chalk.blueBright("1. Con código QR\n") + chalk.cyan("2. Con código de texto de 8 dígitos\n--> "));
  while (!/^[1-2]$/.test(opcion)) {
    log.warn('[ ⌬ ] No se permiten números que no sean 1 o 2, tampoco letras o símbolos especiales.');
    opcion = readlineSync.question("--> ");
  }
  if (opcion === "2") {
    console.log(chalk.bold.redBright(`\nPor favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright("Ejemplo: +57301******")}\n${chalk.bold.magentaBright('---> ')} `));
    phoneInput = readlineSync.question("");
    phoneNumber = normalizePhoneForPairing(phoneInput);
  }
}
const BOT_START_TIME = Math.floor(Date.now() / 1000)-5
async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState(global.sessionName)
const logger = pino({ level: "silent" })
  console.info = () => {}
  console.debug = () => {}
  const browser = typeof Browsers?.macOS === 'function' ? Browsers.macOS('Chrome') : (Browsers?.macOS ?? ['macOS', 'Chrome', '10.15.7'])
const clientt = makeWASocket({
  logger,
  printQRInTerminal: false,
  browser,
  auth: state,
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: false,
  getMessage: getMessageFromStore,
  keepAliveIntervalMs: 45000,
  maxIdleTimeMs: 60000,
})
  
global.client = clientt;
const client = clientt

client.decodeJid = (jid = '') => {
  if (!jid) return ''

  if (typeof jid === 'object') {
    jid =
      jid?.id ||
      jid?.jid ||
      jid?.user ||
      jid?.participant ||
      jid?.remoteJid ||
      jid?.lid ||
      jid?.phoneNumber ||
      ''
  }

  jid = String(jid).trim()
  if (!jid) return ''

  try {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {}
      return (decode.user && decode.server && `${decode.user}@${decode.server}`) || jid
    }
  } catch (e) {
    return jid
  }

  return jid
}

client.public = true
client.isInit = false
client.ev.on("creds.update", saveCreds)
  if (opcion === "2" && !fs.existsSync("./Sessions/Owner/creds.json")) {
  setTimeout(async () => {
    try {
       if (!state.creds.registered) {
        const pairing = await global.client.requestPairingCode(phoneNumber)
        const codeBot = pairing?.match(/.{1,4}/g)?.join("-") || pairing
        log.info(`[ ⌬ ] Código de emparejamiento: ${codeBot}`)
      }
    } catch (err) {
      log.error(`[ ⌬ ] Error al generar código: ${err?.message || err}`)
    }
  }, 3000)
}
client.ev.on('group-participants.update', async (update) => {
  await groupParticipantsUpdate(client, update)
})

  client.sendText = (jid, text, quoted = "", options) =>
  client.sendMessage(jid, { text: text, ...options }, { quoted })
  client.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications, } = update    
    if (qr != 0 && qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {

      log.info('[ ⌬ ] Escanea este código QR');

qrcode.generate(qr, { small: true });
    }}



    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode || 0;
      if (reason === DisconnectReason.connectionLost) {
        log.warning("Se perdió la conexión al servidor, intento reconectarme..")
        startBot()
      } else if (reason === DisconnectReason.connectionClosed) {
        log.warning("Conexión cerrada, intentando reconectarse...")
        startBot()
      } else if (reason === DisconnectReason.restartRequired) {
        log.warning("Es necesario reiniciar..")
        startBot();
      } else if (reason === DisconnectReason.timedOut) {
        log.warning("Tiempo de conexión agotado, intentando reconectarse...")
        startBot()
      } else if (reason === DisconnectReason.badSession) {
        log.warning("Eliminar sesión y escanear nuevamente...")
        startBot()
      } else if (reason === DisconnectReason.connectionReplaced) {
        log.warning("Primero cierre la sesión actual...")
      } else if (reason === DisconnectReason.loggedOut) {
        log.warning("Escanee nuevamente y ejecute...")
        exec("rm -rf ./Sessions/Owner/*")
        process.exit(1)
      } else if (reason === DisconnectReason.forbidden) {
        log.error("Error de conexión, escanee nuevamente y ejecute...")
        exec("rm -rf ./Sessions/Owner/*")
        process.exit(1);
      } else if (reason === DisconnectReason.multideviceMismatch) {
        log.warning("Inicia nuevamente")
        exec("rm -rf ./Sessions/Owner/*")
        process.exit(0)
      } else {
        client.end(`Motivo de desconexión desconocido : ${reason}|${connection}`)
      }
    }
    if (connection == "open") {
         const userName = client.user.name || "Desconocido"
log.success(`[ ⌬ ] Conectado a: ${userName}`)    }
    if (isNewLogin) {
      log.info("Nuevo dispositivo detectado")
    }
if (receivedPendingNotifications == "true") {
  log.warn("Ignorando notificaciones pendientes al iniciar.")
}
  });

const liveQueue = []
let processingLive = false

function getMsgTimestampSeconds(message) {
  const ts = message?.messageTimestamp

  if (!ts) return 0
  if (typeof ts === 'number') return ts
  if (typeof ts === 'bigint') return Number(ts)
  if (typeof ts === 'string') return Number(ts) || 0

  if (typeof ts === 'object') {
    if (typeof ts.toNumber === 'function') return ts.toNumber()
    if ('low' in ts) return Number(ts.low) || 0
  }

  return 0
}

async function processOneMessage(client, rawMsg, allMessages) {
  try {
    let m = rawMsg

    if (!m?.message) return
    if (m.key?.remoteJid === 'status@broadcast') return

    const msgTime = getMsgTimestampSeconds(m)

    // NO LEER COMANDOS NI MENSAJES ANTIGUOS
    if (msgTime && msgTime < BOT_START_TIME) return

    m.message = Object.keys(m.message)[0] === 'ephemeralMessage'
      ? m.message.ephemeralMessage.message
      : m.message

    if (client.public === false && !m.key.fromMe) return

    m = await smsg(client, m, {
      contacts: {},
      loadMessage: async (jid, id) => {
        return messageStore.get(`${jid}:${id}`) || null
      }
    })

    await main(client, m, allMessages)
  } catch (err) {
    log.error(err?.message || err)
  }
}

async function processLiveQueue(client) {
  if (processingLive) return

  processingLive = true

  while (liveQueue.length) {
    const item = liveQueue.shift()
    await processOneMessage(client, item.message, item.allMessages)
  }

  processingLive = false
}

client.ev.on('messages.upsert', async ({ messages, type }) => {
  try {
    if (type !== 'notify') return
    if (!Array.isArray(messages) || !messages.length) return

    for (const msg of messages) {
      if (!msg?.message) continue
      if (msg.key?.remoteJid === 'status@broadcast') continue

      const msgTime = getMsgTimestampSeconds(msg)

      // Ignorar todo mensaje anterior al arranque del bot
      if (msgTime && msgTime < BOT_START_TIME) continue

      messageStore.set(getMessageKey(msg.key), msg)

      liveQueue.push({
        message: msg,
        allMessages: messages
      })
    }

    processLiveQueue(client)
  } catch (err) {
    log.error(err?.message || err)
  }
})

try {
  await events(client)
} catch (err) {
  log.error(`[ ⌬ BOT ] ${err?.message || err}`)
}

}

(async () => {
   await global.loadDatabase()
log.info('[ ⌬ ] Base de datos cargada correctamente.')


log.info('[ ⌬ ] Cargando comandos...')
await seecmds()
log.success('[ ⌬ ] Comandos cargados correctamente.')


await startBot()
})()

process.on('uncaughtException', (err) => {
  const msg = err?.message || '';
  if (msg.includes('rate-overlimit') || msg.includes('timed out') || msg.includes('Connection Closed')) return;
  console.error(chalk.red('[uncaughtException]'), msg.slice(0, 120));
});

process.on('unhandledRejection', (reason) => {
  const msg = String(reason?.message || reason || '');
  if (msg.includes('rate-overlimit') || msg.includes('timed out') || msg.includes('Connection Closed')) return;
  console.error(chalk.red('[unhandledRejection]'), msg.slice(0, 120));
});