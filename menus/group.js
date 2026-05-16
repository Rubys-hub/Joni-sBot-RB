export default {
  command: ['group', 'grupomenu', 'menugroup'],
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
> Accediste al sistema de *group* 👥✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *G R O U P S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: GROUP SYSTEM 👥
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 👥 *GROUP SYSTEM* 👥 𓆪
        ✨ *Total disponible:* 59 comandos
        ⚡ *Modo:* moderación, configuración y seguridad



ꕥ ⚙️ *BÁSICOS DEL GRUPO*

👤 *${currentPrefix}add*:
Agrega un usuario al grupo usando su número o mención.

👢 *${currentPrefix}kick*:
Expulsa a un usuario del grupo. Debes mencionar o responder al usuario.

💥 *${currentPrefix}kickall*:
Expulsa usuarios del grupo de forma masiva según el funcionamiento del comando.

👑 *${currentPrefix}promote*:
Da administrador a un usuario del grupo.

⬇️ *${currentPrefix}demote*:
Quita administrador a un usuario del grupo.

📌 *${currentPrefix}anclar* / *${currentPrefix}pin*:
Ancla un mensaje importante dentro del grupo.

🔗 *${currentPrefix}link*:
Muestra el enlace de invitación del grupo.

♻️ *${currentPrefix}revoke* / *${currentPrefix}restablecer*:
Restablece o cambia el enlace de invitación del grupo.



ꕥ 📝 *CONFIGURACIÓN DEL GRUPO*

📛 *${currentPrefix}setgpname*:
Cambia el nombre del grupo.

📝 *${currentPrefix}setgpdesc*:
Cambia la descripción del grupo.

🖼️ *${currentPrefix}setgpbanner*:
Cambia la imagen o banner del grupo.

ℹ️ *${currentPrefix}gp* / *${currentPrefix}groupinfo*:
Muestra información general del grupo.

🔒 *${currentPrefix}closet* / *${currentPrefix}close* / *${currentPrefix}cerrar*:
Cierra el grupo para que solo administradores puedan escribir.

🔓 *${currentPrefix}open* / *${currentPrefix}abrir*:
Abre el grupo para que todos los miembros puedan escribir.

⭐ *${currentPrefix}setprimary*:
Configura o marca el grupo como principal según el sistema del bot.



ꕥ 📢 *MENCIONES Y MENSAJES*

🙈 *${currentPrefix}hidetag* / *${currentPrefix}tag*:
Menciona a todos los miembros del grupo de forma oculta.

📢 *${currentPrefix}todos* / *${currentPrefix}invocar* / *${currentPrefix}tagall*:
Invoca o menciona a todos los miembros del grupo.

🧹 *${currentPrefix}delete* / *${currentPrefix}del* / *${currentPrefix}borrar*:
Elimina un mensaje respondiendo al mensaje que deseas borrar.


ꕥ 🛡️ *BAN DEL BOT*

🚫 *${currentPrefix}ban*:
Banea a un usuario del bot. El usuario baneado ya no podrá usar comandos hasta ser desbaneado. Debes mencionar o responder al usuario.

✅ *${currentPrefix}unban*:
Quita el ban de un usuario para que pueda volver a usar los comandos del bot normalmente.

ℹ️ *${currentPrefix}baninfo*:
Muestra información del ban de un usuario, como motivo, fecha, estado e intentos bloqueados.

📋 *${currentPrefix}banlist*:
Muestra la lista de usuarios baneados actualmente en el bot.

🛠️ *${currentPrefix}banpanel* / *${currentPrefix}banadmin*:
Panel exclusivo del owner para activar o desactivar permisos de ban/unban a admins del grupo.

🧽 *${currentPrefix}purge* / *${currentPrefix}clearchat*:
Limpia mensajes del chat según la función disponible.

🚮 *${currentPrefix}purgeuser* / *${currentPrefix}clearuser* / *${currentPrefix}deluser*:
Limpia mensajes relacionados a un usuario específico.

🤖 *${currentPrefix}bot*:
Activa o desactiva el uso del bot dentro del grupo.



ꕥ 🔇 *SISTEMA MUTE*

🔇 *${currentPrefix}mute*:
Silencia a un usuario para restringir su participación.

🔊 *${currentPrefix}unmute*:
Quita el silencio a un usuario previamente muteado.

📃 *${currentPrefix}mutelist*:
Muestra la lista de usuarios silenciados.

⏳ *${currentPrefix}mutetime* / *${currentPrefix}tempmute*:
Silencia a un usuario por un tiempo determinado.



ꕥ ⚠️ *ADVERTENCIAS Y CONTROL*

⚠️ *${currentPrefix}warn*:
Agrega una advertencia a un usuario.

📋 *${currentPrefix}warns*:
Muestra las advertencias acumuladas de un usuario.

🧹 *${currentPrefix}delwarn*:
Elimina advertencias de un usuario.

🚧 *${currentPrefix}setwarnlimit*:
Configura el límite de advertencias antes de aplicar sanciones.

🛡️ *${currentPrefix}modconfig* / *${currentPrefix}automodconfig*:
Muestra o configura opciones avanzadas de moderación.



ꕥ 🛡️ *ANTI SYSTEM*

🚫 *${currentPrefix}antiestado*:
Activa o desactiva el bloqueo relacionado a estados.

🌊 *${currentPrefix}antiflood* / *${currentPrefix}flood*:
Activa o desactiva el sistema antiflood para controlar spam.

🖼️ *${currentPrefix}antiimage* / *${currentPrefix}antiimg*:
Activa o desactiva el bloqueo de imágenes.

🎬 *${currentPrefix}antivideo*:
Activa o desactiva el bloqueo de videos.

🎭 *${currentPrefix}antisticker*:
Activa o desactiva el bloqueo de stickers.

🔞 *${currentPrefix}nsfwfilter* / *${currentPrefix}antinsfw*:
Activa o desactiva el filtro NSFW del grupo.

🤬 *${currentPrefix}badwords* / *${currentPrefix}antitoxic* / *${currentPrefix}antigroserias*:
Activa o desactiva el filtro de malas palabras.

🔗 *${currentPrefix}antilink* / *${currentPrefix}antienlaces* / *${currentPrefix}antilinks*:
Activa o desactiva el bloqueo de enlaces.

🧷 *${currentPrefix}antilinksoft*:
Activa o desactiva el modo suave del sistema antilink.

👮 *${currentPrefix}autoadmin*:
Activa o desactiva el sistema automático relacionado a administradores.



ꕥ 🎛️ *OPCIONES DEL GRUPO*

👋 *${currentPrefix}welcome* / *${currentPrefix}bienvenida*:
Activa o desactiva la bienvenida del grupo.

🚪 *${currentPrefix}goodbye* / *${currentPrefix}despedida*:
Activa o desactiva la despedida del grupo.

🚨 *${currentPrefix}alerts* / *${currentPrefix}alertas*:
Activa o desactiva alertas del grupo.

🔞 *${currentPrefix}nsfw*:
Activa o desactiva el modo NSFW en el grupo.

💰 *${currentPrefix}rpg* / *${currentPrefix}economy* / *${currentPrefix}economia*:
Activa o desactiva el sistema RPG o economía del grupo.

🎴 *${currentPrefix}gacha*:
Activa o desactiva el sistema gacha dentro del grupo.

👮‍♂️ *${currentPrefix}adminonly* / *${currentPrefix}onlyadmin*:
Permite que solo administradores usen ciertas funciones.



ꕥ 💬 *MENSAJES PERSONALIZADOS*

💬 *${currentPrefix}setwelcome*:
Configura el mensaje personalizado de bienvenida.

💬 *${currentPrefix}setgoodbye*:
Configura el mensaje personalizado de despedida.



ꕥ 📊 *ESTADÍSTICAS DEL GRUPO*

🔢 *${currentPrefix}count* / *${currentPrefix}mensajes* / *${currentPrefix}messages* / *${currentPrefix}msgcount*:
Muestra el conteo de mensajes de un usuario o del grupo.

🏆 *${currentPrefix}topcount* / *${currentPrefix}topmensajes* / *${currentPrefix}topmsgcount* / *${currentPrefix}topmessages*:
Muestra el ranking de usuarios con más mensajes.

😴 *${currentPrefix}topinactive* / *${currentPrefix}topinactivos* / *${currentPrefix}topinactiveusers*:
Muestra los usuarios más inactivos del grupo.



ꕥ 🧹 *LIMPIEZA DE INACTIVOS*

👢 *${currentPrefix}kickinactive* / *${currentPrefix}kickinactivos* / *${currentPrefix}kickinactivepage* / *${currentPrefix}kickinactiveall*:
Expulsa usuarios inactivos según el sistema del comando.

🌎 *${currentPrefix}kicknum* / *${currentPrefix}kickprefix* / *${currentPrefix}kickcountry*:
Expulsa usuarios por prefijo, país o número según el filtro indicado.



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