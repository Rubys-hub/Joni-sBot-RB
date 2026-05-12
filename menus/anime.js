export default {
  command: ['anime'],
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
> Accediste al sistema de *anime* 🌌✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│               ⟐ *A N I M E* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: ANIME SYSTEM 🌌
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🌌 *ANIME SYSTEM* 🌌 𓆪
        ✨ *Total disponible:* 4 comandos
        ⚡ *Modo:* imágenes, perfiles y contenido anime



ꕥ 🌸 *IMÁGENES ANIME*

🌸 *${currentPrefix}waifu*:
Envía una imagen aleatoria de waifu. Ideal para contenido visual estilo anime.

🐱 *${currentPrefix}neko*:
Envía una imagen aleatoria de neko. Funciona como alternativa del mismo sistema de imágenes anime.



ꕥ 💞 *PERFILES DE PAREJA*

💞 *${currentPrefix}ppcouple* / *${currentPrefix}ppcp*:
Envía imágenes de pareja para foto de perfil. Sirve para usar matching icons o fotos combinadas.



ꕥ 🔞 *EXTRA ANIME*

🔞 *${currentPrefix}follaragordo*:
Ejecuta una acción especial de anime/interacción. Úsalo solo en grupos donde permitan este tipo de comandos.



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
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelJid,
        newsletterName: channelName,
        serverMessageId: '1'
      },
      externalAdReply: {
        title: channelName,
        body: 'Ver canal oficial',
        thumbnailUrl: thumbnail,
        sourceUrl: channelLink,
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