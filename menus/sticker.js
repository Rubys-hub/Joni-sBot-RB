export default {
  command: ['stickers', 'stickermenu', 'menusticker'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

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
│ ⟡ *TOTAL DISPONIBLE ::* 17 comandos
│ ⎔ *MODO ::* Crear, editar y gestionar stickers
╰──────────────────────────────────────────────╯

╭────────〔 🖼️ STICKER / S 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}sticker
│ ✦ *Alias:* ${currentPrefix}s
│
│ 📌 *¿Qué hace?*
│ Convierte imágenes o videos en stickers.
│
│ 🧾 *Uso:*
│ ${currentPrefix}s (responder imagen/video)
╰──────────────────────────────────────╯

╭────────〔 🎨 QC 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}qc
│
│ 📌 *¿Qué hace?*
│ Genera un sticker tipo quote con texto.
│
│ 🧾 *Uso:*
│ ${currentPrefix}qc hola mundo
╰──────────────────────────╯

╭────────〔 😎 EMOJIMIX 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}emojimix
│
│ 📌 *¿Qué hace?*
│ Combina dos emojis en un solo sticker.
│
│ 🧾 *Uso:*
│ ${currentPrefix}emojimix 😎+🔥
╰──────────────────────────────╯

╭────────〔 📦 PACK 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}pack
│
│ 📌 *¿Qué hace?*
│ Muestra tus packs de stickers disponibles.
│
│ 🧾 *Uso:*
│ ${currentPrefix}pack
╰──────────────────────────╯

╭────────〔 📦 NEWPACK 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}newpack
│
│ 📌 *¿Qué hace?*
│ Crea un nuevo pack de stickers.
│
│ 🧾 *Uso:*
│ ${currentPrefix}newpack nombre
╰─────────────────────────────╯

╭────────〔 ❌ DELPACK 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}delpack
│
│ 📌 *¿Qué hace?*
│ Elimina un pack de stickers.
│
│ 🧾 *Uso:*
│ ${currentPrefix}delpack
╰─────────────────────────────╯

╭────────〔 📜 PACKLIST 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}packlist
│
│ 📌 *¿Qué hace?*
│ Lista todos tus packs creados.
│
│ 🧾 *Uso:*
│ ${currentPrefix}packlist
╰──────────────────────────────╯

╭────────〔 ➕ ADDSTICKER 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}addsticker
│
│ 📌 *¿Qué hace?*
│ Agrega un sticker a un pack.
│
│ 🧾 *Uso:*
│ ${currentPrefix}addsticker (responder sticker)
╰──────────────────────────────╯

╭────────〔 ❌ DELSTICKER 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}delsticker
│
│ 📌 *¿Qué hace?*
│ Elimina un sticker guardado.
│
│ 🧾 *Uso:*
│ ${currentPrefix}delsticker
╰──────────────────────────────╯

╭────────〔 ⚙️ SETMETA 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setmeta
│
│ 📌 *¿Qué hace?*
│ Configura metadata del sticker.
╰──────────────────────────────╯

╭────────〔 ⚙️ SETPACKDESC 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setpackdesc
│
│ 📌 *¿Qué hace?*
│ Cambia la descripción del pack.
╰────────────────────────────────╯

╭────────〔 ⚙️ SETPACKNAME 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setpackname
│
│ 📌 *¿Qué hace?*
│ Cambia el nombre del pack.
╰────────────────────────────────╯

╭────────〔 🔒 SETPACKPRIVATE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setpackprivate
│
│ 📌 *¿Qué hace?*
│ Hace privado el pack.
╰────────────────────────────────────╯

╭────────〔 🌍 SETPACKPUBLIC 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setpackpublic
│
│ 📌 *¿Qué hace?*
│ Hace público el pack.
╰───────────────────────────────────╯

╭────────〔 ✨ BRAT 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}brat
│
│ 📌 *¿Qué hace?*
│ Genera sticker con estilo especial.
╰──────────────────────────╯

╭────────〔 ✨ BRATV 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}bratv
│
│ 📌 *¿Qué hace?*
│ Genera versión animada del sticker.
╰──────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(
      m.chat,
      {
        text: textMenu,
        contextInfo: {
          externalAdReply: {
            title: settings.nameid || 'RubyJX Bot',
            body: 'Ver canal oficial',
            thumbnailUrl: settings.icon || settings.banner || 'https://i.imgur.com/0Z8FQ9H.jpeg',
            sourceUrl: settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false
          }
        }
      },
      { quoted: m }
    )
  }
}