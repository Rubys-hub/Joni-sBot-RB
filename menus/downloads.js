export default {
  command: ['downloads', 'download'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *descargas*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│           ⟐ *D O W N L O A D S* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: DOWNLOAD SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 ⬇️ DOWNLOAD SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 12 comandos
│ ⎔ *MODO ::* Videos, música y redes sociales
╰──────────────────────────────────────────────╯

╭────────〔 🎵 PLAY / MÚSICA 〕────────╮
│ ✦ *Comando:* ${currentPrefix}play
│
│ 📌 Descarga música desde YouTube
│
│ 🧾 Uso:
│ ${currentPrefix}play nombre
╰──────────────────────────────────────╯

╭────────〔 🎥 PLAY2 / VIDEO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}play2
│
│ 📌 Descarga video de YouTube
│
│ 🧾 Uso:
│ ${currentPrefix}play2 nombre
╰──────────────────────────────────────╯

╭────────〔 📺 YTMP3 〕────────╮
│ ✦ *Comando:* ${currentPrefix}ytmp3
│
│ 📌 Convierte YouTube a audio
│
│ 🧾 Uso:
│ ${currentPrefix}ytmp3 link
╰──────────────────────────────╯

╭────────〔 🎬 YTMP4 〕────────╮
│ ✦ *Comando:* ${currentPrefix}ytmp4
│
│ 📌 Descarga video de YouTube
│
│ 🧾 Uso:
│ ${currentPrefix}ytmp4 link
╰──────────────────────────────╯

╭────────〔 🎧 SPOTIFY 〕────────╮
│ ✦ *Comando:* ${currentPrefix}spotify
│
│ 📌 Descarga música de Spotify
│
│ 🧾 Uso:
│ ${currentPrefix}spotify link
╰──────────────────────────────╯

╭────────〔 📱 TIKTOK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}tiktok
│
│ 📌 Descarga videos de TikTok
│
│ 🧾 Uso:
│ ${currentPrefix}tiktok link
╰──────────────────────────────╯

╭────────〔 📘 FACEBOOK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}facebook
│
│ 📌 Descarga videos de Facebook
│
│ 🧾 Uso:
│ ${currentPrefix}facebook link
╰──────────────────────────────╯

╭────────〔 📸 INSTAGRAM 〕────────╮
│ ✦ *Comando:* ${currentPrefix}instagram
│
│ 📌 Descarga contenido de Instagram
│
│ 🧾 Uso:
│ ${currentPrefix}instagram link
╰──────────────────────────────╯

╭────────〔 🐦 TWITTER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}twitter
│
│ 📌 Descarga videos de Twitter
│
│ 🧾 Uso:
│ ${currentPrefix}twitter link
╰──────────────────────────────╯

╭────────〔 🌐 MEDIAFIRE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}mediafire
│
│ 📌 Descarga archivos de Mediafire
│
│ 🧾 Uso:
│ ${currentPrefix}mediafire link
╰──────────────────────────────╯

╭────────〔 🔊 AUDIO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}audio
│
│ 📌 Convierte video a audio
│
│ 🧾 Uso:
│ ${currentPrefix}audio link
╰──────────────────────────────╯

╭────────〔 🎥 VIDEO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}video
│
│ 📌 Convierte link a video
│
│ 🧾 Uso:
│ ${currentPrefix}video link
╰──────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}