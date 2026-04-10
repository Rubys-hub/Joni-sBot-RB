import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = ['51901931862']
global.mods = []
global.botNumber = ''

global.sessionName = 'Sessions/Owner'
global.version = '^2.0 - Latest'
global.dev = "© ⍴᥆ᥕᥱrᥱძ ᑲᥡ ⫷𝐉_𝐃𝐫𝐬𝐱 - 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞⫸"
global.links = {
api: 'https://api.stellarwa.xyz',
channel: "https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F",
gmail: "rubyjx09@gmail.com"
}
global.my = {
ch: '120363424461852442@newsletter',
name: 'RubyJX Channel',
}

global.mess = {
  socket: '⌬ [ ᴀᴄᴄᴇsᴏ ᴅᴇɴᴇɢᴀᴅᴏ ] _ᴇsᴛᴇ ᴘʀᴏᴛᴏᴄᴏʟᴏ sᴏʟᴏ ᴘᴜᴇᴅᴇ sᴇʀ ᴇᴊᴇᴄᴜᴛᴀᴅᴏ ᴘᴏʀ ᴜɴ sᴏᴄᴋᴇᴛ._',
  admin: '⌬ [ ᴀʟᴇʀᴛᴀ ᴅᴇ ʀᴀɴɢᴏ ] _ᴇsᴛᴇ ᴘʀᴏᴛᴏᴄᴏʟᴏ sᴏʟᴏ ᴘᴜᴇᴅᴇ sᴇʀ ᴇᴊᴇᴄᴜᴛᴀᴅᴏ ᴘᴏʀ ʟᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴅᴇʟ ɢʀᴜᴘᴏ._',
  botAdmin: '⌬ [ ᴇʀʀᴏʀ ᴅᴇ sɪsᴛᴇᴍᴀ ] _ᴇsᴛᴇ ᴘʀᴏᴛᴏᴄᴏʟᴏ sᴏʟᴏ ᴘᴜᴇᴅᴇ sᴇʀ ᴇᴊᴇᴄᴜᴛᴀᴅᴏ sɪ ᴇʟ sᴏᴄᴋᴇᴛ ᴇs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴇʟ ɢʀᴜᴘᴏ._'
}

global.APIs = {
  axi: { url: "https://apiaxi.i11.eu", key: null },
  adonix: { url: "https://api-adonix.ultraplus.click", key: null },
  vreden: { url: "https://api.vreden.web.id", key: null },
  nekolabs: { url: "https://api.nekolabs.web.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
  stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot" },
  apifaa: { url: "https://api-faa.my.id", key: null },
  xyro: { url: "https://api.xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null }
}


global.API_ALIASES = {
  Adonix: 'adonix',
  adonix: 'adonix',
  Axi: 'axi',
  axi: 'axi',
  Vreden: 'vreden',
  vreden: 'vreden',
  Nekolabs: 'nekolabs',
  nekolabs: 'nekolabs',
  Ootaizumi: 'ootaizumi',
  ootaizumi: 'ootaizumi',
  Stellar: 'stellar',
  stellar: 'stellar',
  Delirius: 'delirius',
  delirius: 'delirius',
  Siputzx: 'siputzx',
  siputzx: 'siputzx',
  Xyro: 'xyro',
  xyro: 'xyro',
  Yupra: 'yupra',
  yupra: 'yupra',
  ApiFaa: 'apifaa',
  apifaa: 'apifaa'
}

global.PLAY_API_PRIORITY = [
  'adonix',
  'stellar',
  'delirius',
  'axi',
  'siputzx',
  'xyro',
  'yupra',
  'apifaa',
  'vreden',
  'ootaizumi'
]

global.PLAY_API_BLOCKLIST = [
  'nekolabs'
]

global.resolveApiConfig = function(name = '') {
  const raw = String(name || '').trim()
  const key = global.API_ALIASES?.[raw] || raw.toLowerCase()
  return global.APIs?.[key] ? { name: key, ...global.APIs[key] } : null
}

global.buildApiUrl = function(name, endpoint = '', params = {}) {
  const api = global.resolveApiConfig(name)
  if (!api?.url) return null

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = new URL(api.url + cleanEndpoint)

  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v))
    }
  }

  if (api.key && !url.searchParams.has('apikey')) {
    url.searchParams.set('apikey', api.key)
  }

  return url.toString()
}

global.fetchJsonSafe = async function(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      accept: 'application/json',
      ...(options.headers || {})
    }
  })

  const text = await res.text()

  let data = null
  try {
    data = JSON.parse(text)
  } catch {
    return {
      ok: false,
      status: res.status,
      isJson: false,
      text,
      data: null
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    isJson: true,
    text,
    data
  }
}


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})

