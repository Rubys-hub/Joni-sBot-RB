import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import { printCommandLog } from './core/system/consoleTheme.js';
 
import initDB from './core/system/initDB.js';
import antilink from './cmds/antilink.js';
import level from './cmds/level.js';
import automod from './cmds/automod.js';
 //import messageLogger from './cmds/messageLogger.js';
import { getGroupAdmins } from './core/message.js';



const groupMetadataCache = new Map()
const GROUP_METADATA_TTL = 30_000

async function getCachedGroupMetadata(client, jid) {
  const now = Date.now()
  const cached = groupMetadataCache.get(jid)

  if (cached && now - cached.time < GROUP_METADATA_TTL) {
    return cached.data
  }

  const data = await client.groupMetadata(jid).catch(() => null)

  if (data) {
    groupMetadataCache.set(jid, {
      time: now,
      data
    })
  }

  return data
}



export default async (client, m) => {
  const sender = m.sender;
  let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.message.templateButtonReplyMessage?.selectedId || '';

  m.text = body

  // if ((m.id.startsWith("3EB0") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20))) return
initDB(m, client)

// messageLogger desactivado para evitar que database vuelva a crecer con messageLog y userMessageLog
/*
Promise.resolve(messageLogger.all(m, { client })).catch(err => {
  console.error('messageLogger error:', err?.message || err)
})
*/

Promise.resolve(antilink(client, m)).catch(err => {
  console.error('antilink error:', err?.message || err)
})

Promise.resolve(automod(client, m)).catch(err => {
  console.error('automod error:', err?.message || err)
})

const from = m.key.remoteJid
const safeJid = (value = '') => {
  if (!value) return ''

  if (typeof value === 'object') {
    value =
      value?.id ||
      value?.jid ||
      value?.user ||
      value?.participant ||
      value?.remoteJid ||
      value?.lid ||
      value?.phoneNumber ||
      ''
  }

  value = String(value).trim()
  if (!value) return ''

  if (value.includes('@')) {
    const [left, server] = value.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = value.replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : ''
}

const botJid = safeJid(client?.user?.id || client?.user?.lid)

global.db.data.chats ||= {}
global.db.data.chats[m.chat] ||= {}
global.db.data.chats[m.chat].users ||= {}

global.db.data.settings ||= {}
global.db.data.settings[botJid] ||= {}

global.db.data.users ||= {}
global.db.data.users[sender] ||= {}

const chat = global.db.data.chats[m.chat]
const settings = global.db.data.settings[botJid]
const user = global.db.data.users[sender]
const users = chat.users[sender] ||= {}

const pushname = m.pushName || 'Sin nombre'
  
let groupMetadata = null
let groupAdmins = []
let groupName = ''

if (m.isGroup) {
  groupMetadata = await getCachedGroupMetadata(client, m.chat)
  groupName = groupMetadata?.subject || ''
  groupAdmins = groupMetadata?.participants?.filter(p => p.admin === 'admin' || p.admin === 'superadmin') || []
}
const cleanId = (value = '') => {
  return String(value)
    .replace(/:\d+@/g, '@')
    .trim()
}

const digitsOnly = (value = '') => {
  return cleanId(value)
    .split('@')[0]
    .replace(/\D/g, '')
}

const sameUser = (a = '', b = '') => {
  const rawA = cleanId(a)
  const rawB = cleanId(b)

  if (rawA && rawB && rawA === rawB) return true

  const digA = digitsOnly(rawA)
  const digB = digitsOnly(rawB)

  return !!digA && !!digB && digA === digB
}

const participantIds = (p = {}) => {
  return [
    p.id,
    p.jid,
    p.lid,
    p.phoneNumber,
    p.phoneNumber ? `${digitsOnly(p.phoneNumber)}@s.whatsapp.net` : ''
  ].filter(Boolean)
}

const senderCandidates = [
  sender,
  m.sender,
  m.key?.participant,
  m.participant
].filter(Boolean)

const botCandidates = [
  botJid,
  client.user?.id,
  client.user?.lid
].filter(Boolean)

const isBotAdmins = m.isGroup
  ? groupAdmins.some(p =>
      participantIds(p).some(id =>
        botCandidates.some(bot => sameUser(id, bot))
      )
    )
  : false

const isAdmins = m.isGroup
  ? groupAdmins.some(p =>
      participantIds(p).some(id =>
        senderCandidates.some(user => sameUser(id, user))
      )
    )
  : false

const ownerCandidates = [
  botJid,
  settings.owner,
  ...(Array.isArray(global.owner)
    ? global.owner.map(num => `${String(num).replace(/\D/g, '')}@s.whatsapp.net`)
    : [])
].filter(Boolean)

const isOwners = ownerCandidates.some(owner => sameUser(owner, sender))

m.isAdmin = isAdmins
m.isBotAdmin = isBotAdmins
m.isOwner = isOwners

for (const name in global.plugins) {
  const plugin = global.plugins[name]

  if (plugin && typeof plugin.all === "function") {
    Promise.resolve(plugin.all.call(client, m, { client })).catch(err => {
      console.error(`Error en plugin.all -> ${name}:`, err?.message || err)
    })
  }
}

const today = new Date()
  .toLocaleDateString('es-CO', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  .split('/')
  .reverse()
  .join('-')

global.db.data.stats ||= {}
global.db.data.stats[m.chat] ||= {}
global.db.data.stats[m.chat][sender] ||= {}
global.db.data.stats[m.chat][sender][today] ||= { msgs: 0, cmds: 0 }

global.db.data.stats[m.chat][sender][today].msgs++
  
const rawBotname = settings.namebot || 'RubyJX'; // Cambiado Yuki -> RubyJX
  const tipo = settings.type || 'Main'; 
  const cleanBotname = rawBotname.replace(/[^a-zA-Z0-9\s]/g, '')
  const namebot = cleanBotname || 'RubyJX'; // Cambiado Yuki -> RubyJX
  const shortForms = [namebot.charAt(0), namebot.split(" ")[0], tipo.split(" ")[0], namebot.split(" ")[0].slice(0, 2), namebot.split(" ")[0].slice(0, 3)];
  const prefixes = shortForms.map(name => `${name}`);
  prefixes.unshift(namebot);
  let prefix;
  if (Array.isArray(settings.prefix) || typeof settings.prefix === 'string') {
    const prefixArray = Array.isArray(settings.prefix) ? settings.prefix : [settings.prefix];
    prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + prefixArray.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'i');
  } else if (settings.prefix === true) {
    prefix = new RegExp('^', 'i');
  } else {
    prefix = new RegExp('^(' + prefixes.join('|') + ')?', 'i');
  }
  const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  let pluginPrefix = client.prefix ? client.prefix : prefix;
let matchs = pluginPrefix instanceof RegExp ? [[pluginPrefix.exec(body), pluginPrefix]] : Array.isArray(pluginPrefix) ? pluginPrefix.map(p => {
  let regex = p instanceof RegExp ? p : new RegExp(strRegex(p));
  return [regex.exec(body), regex];
}) : typeof pluginPrefix === 'string' ? [[new RegExp(strRegex(pluginPrefix)).exec(body), new RegExp(strRegex(pluginPrefix))]] : [[null, null]];
  let match = matchs.find(p => p[0]);

  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin) continue;
    if (plugin.disabled) continue;
    if (typeof plugin.before === "function") {
      try {
        if (await plugin.before.call(client, m, { client })) {
          continue;
        }
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err);
      }
    }
  }

  if (!match) return;
  let usedPrefix = (match[0] || [])[0] || '';
  let args = body.slice(usedPrefix.length).trim().split(" ");
  let command = (args.shift() || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let text = args.join(' ');
  if (!command) return;
  
  if (!global.commandsReady) {
  return m.reply('⏳ El bot todavía está cargando comandos, intenta otra vez en unos segundos.');
}

  const chatData = global.db.data.chats[from] || {};
  const consolePrimary = chatData.primaryBot;
  if (m.message || !consolePrimary || consolePrimary === botJid) {
    printCommandLog({
      bot: botJid,
      botNumber: digitsOnly(botJid),
      user: pushname,
      userNumber: digitsOnly(sender),
      sender,
      groupName: groupName || 'null',
      groupId: m.isGroup ? from : 'null',
      chatId: m.isGroup ? from : 'Chat Privado',
      groupTotal: m.isGroup ? String(groupMetadata?.participants?.length || 0) : 'null',
      command: command || 'null',
      prefix: usedPrefix || 'null',
      message: body || 'null',
      args: text || 'null',
      isGroup: m.isGroup
    })
  }
  
  const hasPrefix = settings.prefix === true ? true : (Array.isArray(settings.prefix) ? settings.prefix : typeof settings.prefix === 'string' ? [settings.prefix] : []).some(p => body?.startsWith(p));
  function getAllSessionBots() {
    const sessionDirs = ['./Sessions/Subs']
    let bots = []
    for (const dir of sessionDirs) {
      try {
        const subDirs = fs.readdirSync(path.resolve(dir))
        for (const sub of subDirs) {
          const credsPath = path.resolve(dir, sub, 'creds.json')
          if (fs.existsSync(credsPath)) {
            bots.push(sub + '@s.whatsapp.net')
          }
        }
      } catch {}
    }
    try {
      const ownerCreds = path.resolve('./Sessions/Owner/creds.json')
      if (fs.existsSync(ownerCreds)) {
        const ownerId = global.client.user.id.split(':')[0] + '@s.whatsapp.net'
        bots.push(ownerId)
      }
    } catch {}
    return bots;
  }
  const botprimaryId = chat?.primaryBot
  if (botprimaryId && botprimaryId !== botJid) {
    if (hasPrefix) {
      const participants = m.isGroup ? (await client.groupMetadata(m.chat).catch(() => ({ participants: [] }))).participants : []
      const primaryInGroup = participants.some(p => (p.phoneNumber || p.id) === botprimaryId)
      const isPrimarySelf = botprimaryId === botJid
      const primaryInSessions = getAllSessionBots().includes(botprimaryId)
      if (!primaryInSessions || !primaryInGroup) {
        return
      }
      if ((primaryInSessions && primaryInGroup) || isPrimarySelf) {
        return;
      }
    }
  }
  
  if (!isOwners && settings.self) return;  
  if (m.chat && !m.chat.endsWith('g.us')) {
    const allowedInPrivateForUsers = ['allmenu', 'help', 'menu', 'infobot', 'botinfo', 'invite', 'invitar', 'ping', 'speed', 'p', 'status', 'estado', 'report', 'reporte', 'sug', 'suggest', 'token', 'join', 'unir', 'logout', 'reload', 'self', 'setbanner', 'setbotbanner', 'setchannel', 'setbotchannel', 'setbotcurrency', 'setcurrency', 'seticon', 'setboticon', 'setlink', 'setbotlink', 'setbotname', 'setname', 'setbotowner', 'setowner', 'setimage', 'setpfp', 'setprefix', 'setbotprefix', 'setstatus', 'setusername', 'code', 'qr']
    if (!global.owner.map(num => num + '@s.whatsapp.net').includes(sender) && !allowedInPrivateForUsers.includes(command)) return;
  }
  if (chat?.isBanned && !(command === 'botruby' && text === 'on') && !(global.mods || []).map(num => num + '@s.whatsapp.net').includes(sender)) {
await m.reply(`ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴇsᴛᴀᴅᴏ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ\nᴇʟ ʙᴏᴛ *${settings.botname}* ᴇsᴛᴀ́ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ ᴇɴ ᴇsᴛᴇ ɢʀᴜᴘᴏ.\n\n✎ ᴜɴ *ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ* ᴘᴜᴇᴅᴇ ᴀᴄᴛɪᴠᴀʀʟᴏ ᴄᴏɴ:\n${usedPrefix}bot on`);
    return;
  }  
  if (chat?.isMute && !(command === 'mute') && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) return;
  if (m.text && user.banned && !(global.mods || []).map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴜsᴜᴀʀɪᴏ ʙʟᴏǫᴜᴇᴀᴅᴏ\nᴇsᴛᴀ́s ${user.genre === 'Mujer' ? 'ʙᴀɴᴇᴀᴅᴀ' : user.genre === 'Hombre' ? 'ʙᴀɴᴇᴀᴅᴏ' : 'ʙᴀɴᴇᴀᴅᴏ/ᴀ'}, ɴᴏ ᴘᴜᴇᴅᴇs ᴜsᴀʀ ᴄᴏᴍᴀɴᴅᴏs.\n\nʀᴀᴢᴏ́ɴ: ${user.bannedReason || 'Sin especificar'}\n\nsɪ ᴄʀᴇᴇs ǫᴜᴇ ᴇs ᴜɴ ᴇʀʀᴏʀ, ᴘᴜᴇᴅᴇs ʀᴇᴘᴏʀᴛᴀʀʟᴏ ᴀ ᴜɴ ᴍᴏᴅᴇʀᴀᴅᴏʀ.`);
    return;
  }


  if (chat.adminonly && !isAdmins) return;
  const cmdData = global.comandos.get(command);
  if (!cmdData) {
    if (settings.prefix === true) return;
    await client.readMessages([m.key]);
return m.reply(`ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴄᴏᴍᴀɴᴅᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ\nᴇʟ ᴄᴏᴍᴀɴᴅᴏ *${command}* ɴᴏ ᴇxɪsᴛᴇ.\nᴜsᴀ *${usedPrefix}help* ᴘᴀʀᴀ ᴠᴇʀ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.`);
  }
  if (cmdData.isOwner && !m.isOwner) {
    if (settings.prefix === true) return;
    return m.reply(`ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴄᴏᴍᴀɴᴅᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ\nᴇʟ ᴄᴏᴍᴀɴᴅᴏ *${command}* ɴᴏ ᴇxɪsᴛᴇ.\nᴜsᴀ *${usedPrefix}help* ᴘᴀʀᴀ ᴠᴇʀ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.`);
  }
  if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat, mess.admin, m);
  if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat, mess.botAdmin, m);
  try {
  await client.readMessages([m.key]);
  user.usedcmds = (user.usedcmds || 0) + 1;
  settings.cmdsejecut = (settings.cmdsejecut || 0) + 1;
  users.usedTime = new Date();
  users.lastCmd = Date.now();
  user.exp = (user.exp || 0) + Math.floor(Math.random() * 100);
  user.name = m.pushName;
  global.db.data.stats[m.chat] ||= {}
global.db.data.stats[m.chat][sender] ||= {}
global.db.data.stats[m.chat][sender][today] ||= { msgs: 0, cmds: 0 }

global.db.data.stats[m.chat][sender][today].cmds++

if (m.isGroup) {
  const chatLog = global.db.data.chats[m.chat] ||= {}

  chatLog.commandStats ||= {}
  chatLog.commandStats[command] = (chatLog.commandStats[command] || 0) + 1
}

  await cmdData.run(client, m, args, usedPrefix, command, text);
}

 catch (error) {
    await client.sendMessage(m.chat, { text: `ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴇʀʀᴏʀ ᴀʟ ᴇᴊᴇᴄᴜᴛᴀʀ\n${error}` }, { quoted: m });
  }
  level(m);
};