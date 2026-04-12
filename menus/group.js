export default {
command: ['groups', 'group', 'grupo'],  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *grupos*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│            ⟐ *G R O U P S* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: GROUP SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 👥 GROUP SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 18 comandos
│ ⎔ *MODO ::* Administración y control
╰────────────────────────────────────────────╯

╭────────〔 👑 PROMOTE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}promote
│
│ 📌 Da admin a un usuario
│
│ 🧾 Uso:
│ ${currentPrefix}promote @usuario
╰────────────────────────────────╯

╭────────〔 ⛔ DEMOTE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}demote
│
│ 📌 Quita admin
│
│ 🧾 Uso:
│ ${currentPrefix}demote @usuario
╰────────────────────────────────╯

╭────────〔 🚪 KICK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}kick
│
│ 📌 Expulsa usuario
│
│ 🧾 Uso:
│ ${currentPrefix}kick @usuario
╰────────────────────────────────╯

╭────────〔 📩 ADD 〕────────╮
│ ✦ *Comando:* ${currentPrefix}add
│
│ 📌 Agrega usuario
│
│ 🧾 Uso:
│ ${currentPrefix}add numero
╰────────────────────────────────╯

╭────────〔 🔗 LINK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}link
│
│ 📌 Obtiene link del grupo
│
│ 🧾 Uso:
│ ${currentPrefix}link
╰────────────────────────────────╯

╭────────〔 🔒 CLOSE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}close
│
│ 📌 Cierra el grupo
│
│ 🧾 Uso:
│ ${currentPrefix}close
╰────────────────────────────────╯

╭────────〔 🔓 OPEN 〕────────╮
│ ✦ *Comando:* ${currentPrefix}open
│
│ 📌 Abre el grupo
│
│ 🧾 Uso:
│ ${currentPrefix}open
╰────────────────────────────────╯

╭────────〔 📝 SETDESC 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setdesc
│
│ 📌 Cambia descripción
│
│ 🧾 Uso:
│ ${currentPrefix}setdesc texto
╰────────────────────────────────╯

╭────────〔 🖼️ SETPPGROUP 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setppgroup
│
│ 📌 Cambia foto del grupo
│
│ 🧾 Uso:
│ ${currentPrefix}setppgroup
╰────────────────────────────────╯

╭────────〔 🏷️ SETNAME 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setname
│
│ 📌 Cambia nombre del grupo
│
│ 🧾 Uso:
│ ${currentPrefix}setname texto
╰────────────────────────────────╯

╭────────〔 ⚠️ WARN 〕────────╮
│ ✦ *Comando:* ${currentPrefix}warn
│
│ 📌 Advierte usuario
│
│ 🧾 Uso:
│ ${currentPrefix}warn @usuario
╰────────────────────────────────╯

╭────────〔 🧹 DELETE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}delete
│
│ 📌 Borra mensaje
│
│ 🧾 Uso:
│ ${currentPrefix}delete (responder)
╰────────────────────────────────╯

╭────────〔 🚫 ANTILINK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}antilink
│
│ 📌 Activa anti links
│
│ 🧾 Uso:
│ ${currentPrefix}antilink on/off
╰────────────────────────────────╯

╭────────〔 🧹 ANTILINK SOFT 〕────────╮
│ ✦ *Comando:* ${currentPrefix}antilinksoft
│
│ 📌 Elimina links sin expulsar
│
│ 🧾 Uso:
│ ${currentPrefix}antilinksoft on/off
╰────────────────────────────────╯

╭────────〔 🤖 WELCOME 〕────────╮
│ ✦ *Comando:* ${currentPrefix}welcome
│
│ 📌 Mensajes de bienvenida
│
│ 🧾 Uso:
│ ${currentPrefix}welcome on/off
╰────────────────────────────────╯

╭────────〔 👋 GOODBYE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}goodbye
│
│ 📌 Mensajes de salida
│
│ 🧾 Uso:
│ ${currentPrefix}goodbye on/off
╰────────────────────────────────╯

╭────────〔 🔔 ALERTS 〕────────╮
│ ✦ *Comando:* ${currentPrefix}alerts
│
│ 📌 Alertas del grupo
│
│ 🧾 Uso:
│ ${currentPrefix}alerts on/off
╰────────────────────────────────╯

╭────────〔 👮 ADMINONLY 〕────────╮
│ ✦ *Comando:* ${currentPrefix}adminonly
│
│ 📌 Solo admins usan comandos
│
│ 🧾 Uso:
│ ${currentPrefix}adminonly on/off
╰────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}