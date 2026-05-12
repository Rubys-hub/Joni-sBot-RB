export default {
  command: ['menuprofile', 'menuperfil'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
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
> Accediste al sistema de *perfil* 👤✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *P R O F I L E* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: USER SYSTEM 👤
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 👤 *PROFILE SYSTEM* 👤 𓆪
        ✨ *Total disponible:* 14 comandos
        ⚡ *Modo:* perfil, nivel, datos personales y pareja



ꕥ 🧾 *PERFIL Y PROGRESO*

👤 *${currentPrefix}profile* / *${currentPrefix}perfil*:
Muestra tu perfil completo dentro del bot. Incluye datos como nivel, experiencia, coins, banco, pareja, cumpleaños, género, pasatiempo y datos del sistema gacha.

📊 *${currentPrefix}level* / *${currentPrefix}lvl*:
Muestra tu nivel, experiencia actual, progreso y posición dentro del sistema.

🏆 *${currentPrefix}lboard* / *${currentPrefix}lb* / *${currentPrefix}leaderboard*:
Muestra el ranking de usuarios con más experiencia o progreso.

💤 *${currentPrefix}afk*:
Marca tu estado como ausente. Puedes agregar un motivo para que el bot avise cuando alguien te mencione.



ꕥ 🎂 *CUMPLEAÑOS*

🎂 *${currentPrefix}setbirth*:
Establece tu fecha de nacimiento dentro del perfil.

❌ *${currentPrefix}delbirth*:
Elimina la fecha de nacimiento guardada en tu perfil.



ꕥ 📝 *DESCRIPCIÓN PERSONAL*

📝 *${currentPrefix}setdescription* / *${currentPrefix}setdesc*:
Establece una descripción personalizada para tu perfil.

🧹 *${currentPrefix}deldescription* / *${currentPrefix}deldesc*:
Elimina la descripción personalizada guardada en tu perfil.



ꕥ ⚥ *GÉNERO*

⚥ *${currentPrefix}setgenre*:
Establece tu género dentro del perfil.

❌ *${currentPrefix}delgenre*:
Elimina el género guardado en tu perfil.



ꕥ 🎯 *PASATIEMPO*

🎯 *${currentPrefix}setpasatiempo* / *${currentPrefix}sethobby*:
Establece tu pasatiempo favorito dentro del perfil.

🧹 *${currentPrefix}delpasatiempo* / *${currentPrefix}removehobby*:
Elimina el pasatiempo guardado en tu perfil.



ꕥ 💍 *PAREJA*

💍 *${currentPrefix}marry* / *${currentPrefix}casarse*:
Envía una propuesta de matrimonio o pareja a otro usuario.

💔 *${currentPrefix}divorce*:
Termina la relación o pareja guardada dentro del sistema.



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