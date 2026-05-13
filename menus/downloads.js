export default {
  command: ['downloads', 'menudownloads'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const userTag = `@${m.sender.split('@')[0]}`

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const botName = settings.botname || settings.namebot || 'RubyJX Bot'
    const channelName = settings.nameid || global.my?.name || 'RubyJX Channel'
    const channelJid = settings.id || global.my?.ch || '120363424461852442@newsletter'
    const channelLink = settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
    const thumbnail = settings.icon || settings.banner || undefined

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Accediste al sistema de *downloads* 📥✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│             ⟐ *D O W N L O A D S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: DOWNLOAD SYSTEM 📥
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 📥 *DOWNLOAD SYSTEM* 📥 𓆪
        ✨ *Total disponible:* 13 comandos
        ⚡ *Modo:* descargas, búsquedas y recursos



ꕥ 🎵 *YOUTUBE*

🎧 *${currentPrefix}play* _nombre o enlace_:
Busca música en YouTube y descarga el resultado en audio. También funciona con *${currentPrefix}mp3*, *${currentPrefix}ytmp3*, *${currentPrefix}ytaudio* o *${currentPrefix}playaudio*.

🎬 *${currentPrefix}play2* _nombre o enlace_:
Busca o descarga videos de YouTube en formato MP4. También funciona con *${currentPrefix}mp4*, *${currentPrefix}ytmp4*, *${currentPrefix}ytvideo* o *${currentPrefix}playvideo*.

🔎 *${currentPrefix}ytsearch* _texto_:
Busca videos en YouTube y muestra resultados relacionados. También puedes usar el alias *${currentPrefix}search*.



ꕥ 📱 *REDES SOCIALES*

🎶 *${currentPrefix}tiktok* _enlace_:
Descarga videos de TikTok usando un enlace válido. También puedes usar el alias *${currentPrefix}tt*.

🔍 *${currentPrefix}tiktoksearch* _texto_:
Busca videos de TikTok por palabra clave. También funciona como *${currentPrefix}ttsearch* o *${currentPrefix}tts*.

📸 *${currentPrefix}instagram* _enlace_:
Descarga contenido de Instagram mediante enlace. También puedes usar el alias *${currentPrefix}ig*.

📘 *${currentPrefix}facebook* _enlace_:
Descarga videos de Facebook usando un enlace válido. También funciona con el alias *${currentPrefix}fb*.

🐦 *${currentPrefix}twitter* _enlace_:
Descarga contenido de Twitter o X mediante enlace. También puedes usar *${currentPrefix}x* o *${currentPrefix}xdl*.



ꕥ 🖼️ *IMÁGENES Y BÚSQUEDAS*

🌄 *${currentPrefix}imagen* _texto_:
Busca imágenes relacionadas con el texto que escribas. También funciona con *${currentPrefix}img* o *${currentPrefix}image*.

📌 *${currentPrefix}pinterest* _texto_:
Busca imágenes o referencias desde Pinterest. También puedes usar el alias *${currentPrefix}pin*.



ꕥ 📦 *ARCHIVOS Y APPS*

📁 *${currentPrefix}mediafire* _enlace_:
Descarga archivos desde enlaces de MediaFire. También funciona con el alias *${currentPrefix}mf*.

☁️ *${currentPrefix}drive* _enlace_:
Descarga archivos desde Google Drive. También puedes usar el alias *${currentPrefix}gdrive*.

📲 *${currentPrefix}apk* _nombre de app_:
Busca y descarga aplicaciones en formato APK. También funciona con *${currentPrefix}aptoide* o *${currentPrefix}apkdl*.



ꕥ 🌐 *EXTRA*

👥 *${currentPrefix}wpgrupos* _texto_:
Busca grupos de WhatsApp relacionados con el texto indicado. También funciona con *${currentPrefix}gruposwa* o *${currentPrefix}wagrupos*.



        𓆩 🔙 *RETURN* 🔙 𓆪

🏠 *${currentPrefix}menu*:
Regresa al menú principal del bot.

📋 *${currentPrefix}menutotal*:
Abre el menú completo con todas las categorías.`

  await client.sendMessage(
  m.chat,
  {
    text: textMenu,
    mentions: [m.sender],
  },
  { quoted: m }
)
  }
}