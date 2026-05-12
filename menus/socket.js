export default {
  command: ['sockets', 'socket'],
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
> Accediste al sistema de *socket* 🔐✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *S O C K E T S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: SOCKET SYSTEM 🔐
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🔐 *SOCKET SYSTEM* 🔐 𓆪
        ✨ *Total disponible:* 18 comandos
        ⚡ *Modo:* subbots, sesiones y configuración



ꕥ 🤖 *BOTS Y CONEXIÓN*

🤖 *${currentPrefix}bots* / *${currentPrefix}sockets*:
Muestra los sockets o subbots activos conectados al sistema.

📱 *${currentPrefix}code* / *${currentPrefix}qr*:
Genera código o QR para vincular un subbot al sistema.

🔗 *${currentPrefix}join* / *${currentPrefix}unir*:
Hace que el socket entre a un grupo usando un enlace de invitación.

🚪 *${currentPrefix}leave*:
Hace que el socket salga del grupo actual.

🔌 *${currentPrefix}logout*:
Cierra sesión de una instancia Sub-Bot.

♻️ *${currentPrefix}reload*:
Reinicia o recarga la sesión de un Sub-Bot.

🔒 *${currentPrefix}self*:
Activa o desactiva el modo self del socket.



ꕥ ⚙️ *CONFIGURACIÓN DEL BOT*

📝 *${currentPrefix}setname* / *${currentPrefix}setbotname*:
Cambia el nombre corto o largo del bot.

🔤 *${currentPrefix}setprefix* / *${currentPrefix}setbotprefix*:
Cambia el prefijo del socket. También puede usarse para configurar modo sin prefijo.

🖼️ *${currentPrefix}setbanner* / *${currentPrefix}setbotbanner*:
Cambia el banner principal del bot.

🧩 *${currentPrefix}seticon* / *${currentPrefix}setboticon*:
Cambia el icono del bot.

🔗 *${currentPrefix}setlink* / *${currentPrefix}setbotlink*:
Cambia el enlace principal asociado al bot.

📢 *${currentPrefix}setchannel* / *${currentPrefix}setbotchannel*:
Configura el canal oficial del bot.

💰 *${currentPrefix}setcurrency* / *${currentPrefix}setbotcurrency*:
Cambia el nombre de la moneda usada por el sistema.

👑 *${currentPrefix}setowner* / *${currentPrefix}setbotowner*:
Cambia o elimina el dueño asignado al socket.

🖼️ *${currentPrefix}setpfp* / *${currentPrefix}setimage*:
Cambia la foto de perfil del bot.

📊 *${currentPrefix}setstatus*:
Cambia el estado o información visible del bot.

👤 *${currentPrefix}setusername*:
Cambia el nombre de usuario del socket o bot.



        𓆩 ⚠️ *NOTA* ⚠️ 𓆪

🔐 La mayoría de comandos de socket son sensibles.
Úsalos solo si eres owner o tienes permisos sobre el subbot.



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