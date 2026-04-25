export default {
  command: ['sockets', 'socket'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *socket*

╭────────────〔 🔐 SOCKET SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 18 comandos
│ ⎔ *MODO ::* Control, subbots y configuración
╰─────────────────────────────────────────────╯

╭────────〔 🤖 BOTS / SOCKETS 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}bots
│ ✦ *Alias:* ${currentPrefix}sockets
│
│ 📌 *¿Qué hace?*
│ Muestra los sockets o subbots activos.
│
│ 🧾 *Uso:*
│ ${currentPrefix}bots
╰─────────────────────────────────────╯

╭────────〔 📱 CODE / QR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}code
│ ✦ *Alias:* ${currentPrefix}qr
│
│ 📌 *¿Qué hace?*
│ Genera código o QR para vincular un subbot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}code
│ ${currentPrefix}qr
╰────────────────────────────────╯

╭────────〔 🔗 JOIN / UNIR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}join
│ ✦ *Alias:* ${currentPrefix}unir
│
│ 📌 *¿Qué hace?*
│ Hace que el socket entre a un grupo.
│
│ 🧾 *Uso:*
│ ${currentPrefix}join enlace
╰──────────────────────────────────╯

╭────────〔 🚪 LEAVE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}leave
│
│ 📌 *¿Qué hace?*
│ Hace que el socket salga del grupo.
│
│ 🧾 *Uso:*
│ ${currentPrefix}leave
╰────────────────────────────╯

╭────────〔 🔌 LOGOUT 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}logout
│
│ 📌 *¿Qué hace?*
│ Cierra sesión de una instancia Sub-Bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}logout
╰────────────────────────────╯

╭────────〔 ♻️ RELOAD 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}reload
│
│ 📌 *¿Qué hace?*
│ Reinicia la sesión de un Sub-Bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}reload
╰────────────────────────────╯

╭────────〔 🔒 SELF 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}self
│
│ 📌 *¿Qué hace?*
│ Activa o desactiva el modo self del socket.
│
│ 🧾 *Uso:*
│ ${currentPrefix}self on
│ ${currentPrefix}self off
╰──────────────────────────╯

╭────────〔 📝 SETNAME 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setname
│ ✦ *Alias:* ${currentPrefix}setbotname
│
│ 📌 *¿Qué hace?*
│ Cambia el nombre corto y largo del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setname Ruby / RubyJX Bot
╰──────────────────────────────╯

╭────────〔 🔤 SETPREFIX 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setprefix
│ ✦ *Alias:* ${currentPrefix}setbotprefix
│
│ 📌 *¿Qué hace?*
│ Cambia los prefijos del socket.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setprefix .
│ ${currentPrefix}setprefix noprefix
╰────────────────────────────────╯

╭────────〔 🖼️ SETBANNER 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setbanner
│ ✦ *Alias:* ${currentPrefix}setbotbanner
│
│ 📌 *¿Qué hace?*
│ Cambia el banner del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setbanner
╰────────────────────────────────╯

╭────────〔 🧩 SETICON 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}seticon
│ ✦ *Alias:* ${currentPrefix}setboticon
│
│ 📌 *¿Qué hace?*
│ Cambia el icon del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}seticon
╰──────────────────────────────╯

╭────────〔 🔗 SETLINK 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setlink
│ ✦ *Alias:* ${currentPrefix}setbotlink
│
│ 📌 *¿Qué hace?*
│ Cambia el enlace principal del socket.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setlink https://...
╰──────────────────────────────╯

╭────────〔 📢 SETCHANNEL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setchannel
│ ✦ *Alias:* ${currentPrefix}setbotchannel
│
│ 📌 *¿Qué hace?*
│ Cambia el canal oficial del socket.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setchannel enlace
╰────────────────────────────────╯

╭────────〔 💰 SETCURRENCY 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setcurrency
│ ✦ *Alias:* ${currentPrefix}setbotcurrency
│
│ 📌 *¿Qué hace?*
│ Cambia el nombre de la moneda del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setcurrency coins
╰─────────────────────────────────╯

╭────────〔 👑 SETOWNER 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setowner
│ ✦ *Alias:* ${currentPrefix}setbotowner
│
│ 📌 *¿Qué hace?*
│ Cambia o elimina el dueño asignado al socket.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setowner @usuario
│ ${currentPrefix}setowner clear
╰───────────────────────────────╯

╭────────〔 🖼️ SETPFP 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setpfp
│ ✦ *Alias:* ${currentPrefix}setimage
│
│ 📌 *¿Qué hace?*
│ Cambia la foto de perfil del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setpfp
╰──────────────────────────────╯

╭────────〔 📊 SETSTATUS 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setstatus
│
│ 📌 *¿Qué hace?*
│ Cambia el estado del perfil del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setstatus Hola, soy RubyJX Bot
╰───────────────────────────────╯

╭────────〔 👤 SETUSERNAME 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setusername
│
│ 📌 *¿Qué hace?*
│ Cambia el nombre visible del bot.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setusername RubyJX Bot
╰─────────────────────────────────╯

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
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    }, { quoted: m })
  }
}