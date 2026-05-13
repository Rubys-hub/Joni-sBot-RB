export default {
  command: ['stickers', 'stickermenu', 'menusticker'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const userTag = `@${m.sender.split('@')[0]}`

    const botRaw = client.user?.id || ''
    const botId = botRaw.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const botName = settings.botname || settings.namebot || 'RubyJX Bot'
    const channelName = settings.nameid || global.my?.name || 'RubyJX Channel'
    const channelJid = settings.id || global.my?.ch || '120363424461852442@newsletter'
    const channelLink = settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
    const thumbnail = settings.icon || settings.banner || undefined

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Accediste al sistema de *stickers* 🎨✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│             ⟐ *S T I C K E R S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: STICKER SYSTEM 🎨
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🎨 *STICKER SYSTEM* 🎨 𓆪
        ✨ *Total disponible:* 19 comandos
        ⚡ *Modo:* crear, editar y gestionar stickers



ꕥ 🖼️ *CREACIÓN DE STICKERS*

🖼️ *${currentPrefix}sticker* / *${currentPrefix}s*:
Convierte imágenes, videos o multimedia compatible en sticker.

🧩 *${currentPrefix}s1*:
Crea sticker usando el segundo método disponible del sistema.

💬 *${currentPrefix}qc*:
Genera un sticker tipo quote con el texto que escribas.

😎 *${currentPrefix}emojimix*:
Combina dos emojis para crear un sticker especial.

🍼 *${currentPrefix}brat*:
Crea un sticker estilo brat con texto personalizado.

🎥 *${currentPrefix}bratv*:
Crea una versión animada o en video del estilo brat, según el sistema.



ꕥ 🏷️ *NOMBRE Y METADATA*

🏷️ *${currentPrefix}stickername* / *${currentPrefix}sname* / *${currentPrefix}sn* / *${currentPrefix}sn1*:
Cambia o personaliza el nombre y autor de un sticker.

⚙️ *${currentPrefix}setstickermeta* / *${currentPrefix}setmeta*:
Configura la metadata general de tus stickers.

🧹 *${currentPrefix}delmeta* / *${currentPrefix}delstickermeta*:
Elimina la metadata personalizada de stickers.



ꕥ 📦 *PACKS DE STICKERS*

📦 *${currentPrefix}getpack* / *${currentPrefix}pack* / *${currentPrefix}stickerpack*:
Muestra u obtiene información de tus packs de stickers.

🆕 *${currentPrefix}newpack* / *${currentPrefix}newstickerpack*:
Crea un nuevo pack de stickers.

📜 *${currentPrefix}packlist* / *${currentPrefix}stickerpacks*:
Lista los packs de stickers disponibles.

🗑️ *${currentPrefix}delpack*:
Elimina un pack de stickers.



ꕥ ➕ *GESTIÓN DE STICKERS*

➕ *${currentPrefix}addsticker* / *${currentPrefix}stickeradd*:
Agrega un sticker a un pack existente.

❌ *${currentPrefix}stickerdel* / *${currentPrefix}delsticker*:
Elimina un sticker guardado dentro de un pack.



ꕥ 📝 *CONFIGURACIÓN DE PACKS*

📝 *${currentPrefix}setstickerpackdesc* / *${currentPrefix}setpackdesc* / *${currentPrefix}packdesc*:
Cambia la descripción de un pack de stickers.

🏷️ *${currentPrefix}setstickerpackname* / *${currentPrefix}setpackname* / *${currentPrefix}packname*:
Cambia el nombre de un pack de stickers.

🔒 *${currentPrefix}setpackprivate* / *${currentPrefix}setpackpriv* / *${currentPrefix}packprivate*:
Hace privado un pack de stickers.

🌍 *${currentPrefix}setpackpublic* / *${currentPrefix}setpackpub* / *${currentPrefix}packpublic*:
Hace público un pack de stickers.



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