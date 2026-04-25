export default {
  command: ['downloads', 'menudownloads'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *downloads*

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
│ ⎔ *MODO ::* Descarga de contenido multimedia
╰───────────────────────────────────────────────╯

╭────────〔 🎵 YOUTUBE 〕────────╮
│ ✦ ${currentPrefix}play — buscar y descargar
│ ✦ ${currentPrefix}play2 — segunda opción
│ ✦ ${currentPrefix}ytmp3 — descargar audio
│ ✦ ${currentPrefix}ytmp4 — descargar video
╰──────────────────────────────╯

╭────────〔 🎶 MÚSICA 〕────────╮
│ ✦ ${currentPrefix}spotify — descargar spotify
│ ✦ ${currentPrefix}audio — convertir a mp3
│ ✦ ${currentPrefix}video — convertir a mp4
╰──────────────────────────────╯

╭────────〔 📱 REDES 〕────────╮
│ ✦ ${currentPrefix}tiktok — descargar tiktok
│ ✦ ${currentPrefix}facebook — descargar facebook
│ ✦ ${currentPrefix}instagram — descargar instagram
│ ✦ ${currentPrefix}twitter — descargar twitter
╰──────────────────────────────╯

╭────────〔 📦 ARCHIVOS 〕────────╮
│ ✦ ${currentPrefix}mediafire — descargar archivos
╰──────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, {
      text: textMenu,
      contextInfo: {
        externalAdReply: {
          title: settings.nameid || 'RubyJX Bot',
          body: 'Ver canal oficial',
          thumbnailUrl: settings.icon || settings.banner || undefined,
          sourceUrl: settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  }
}