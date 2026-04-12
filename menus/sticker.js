export default {
command: ['stickers', 'stickermenu', 'menusticker'],  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *stickers*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│           ⟐ *S T I C K E R S* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: STICKER SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 🎨 STICKER SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 10 comandos
│ ⎔ *MODO ::* Crear, editar y convertir stickers
╰──────────────────────────────────────────────╯

╭────────〔 🖼️ STICKER / S 〕────────╮
│ ✦ *Comando:* ${currentPrefix}sticker
│ ✦ *Alias:* ${currentPrefix}s
│
│ 📌 Convierte imagen/video en sticker
│
│ 🧾 Uso:
│ ${currentPrefix}s (responder imagen/video)
╰──────────────────────────────────────╯

╭────────〔 🎭 ATTACH 〕────────╮
│ ✦ *Comando:* ${currentPrefix}attp
│
│ 📌 Genera sticker con texto
│
│ 🧾 Uso:
│ ${currentPrefix}attp texto
╰──────────────────────────────────────╯

╭────────〔 ✏️ STICKER TEXT 〕────────╮
│ ✦ *Comando:* ${currentPrefix}ttp
│
│ 📌 Sticker con texto simple
│
│ 🧾 Uso:
│ ${currentPrefix}ttp hola
╰──────────────────────────────────────╯

╭────────〔 🎨 STICKER COLOR 〕────────╮
│ ✦ *Comando:* ${currentPrefix}ttp2
│
│ 📌 Sticker con texto y estilo
│
│ 🧾 Uso:
│ ${currentPrefix}ttp2 hola
╰──────────────────────────────────────╯

╭────────〔 🔄 TOIMG 〕────────╮
│ ✦ *Comando:* ${currentPrefix}toimg
│
│ 📌 Convierte sticker a imagen
│
│ 🧾 Uso:
│ ${currentPrefix}toimg (responder sticker)
╰──────────────────────────────────────╯

╭────────〔 🎞️ TOVID 〕────────╮
│ ✦ *Comando:* ${currentPrefix}tovid
│
│ 📌 Convierte sticker a video
│
│ 🧾 Uso:
│ ${currentPrefix}tovid (responder sticker)
╰──────────────────────────────────────╯

╭────────〔 🎧 TOAUDIO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}toaudio
│
│ 📌 Convierte video a audio
│
│ 🧾 Uso:
│ ${currentPrefix}toaudio (responder video)
╰──────────────────────────────────────╯

╭────────〔 🔊 TOVOICE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}tovn
│
│ 📌 Convierte audio a nota de voz
│
│ 🧾 Uso:
│ ${currentPrefix}tovn (responder audio)
╰──────────────────────────────────────╯

╭────────〔 📦 STICKER PACK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}pack
│
│ 📌 Muestra packs de stickers
│
│ 🧾 Uso:
│ ${currentPrefix}pack
╰──────────────────────────────────────╯

╭────────〔 ❌ DELSTICKER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}delsticker
│
│ 📌 Elimina sticker guardado
│
│ 🧾 Uso:
│ ${currentPrefix}delsticker
╰──────────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}