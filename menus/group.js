export default {
  command: ['group', 'grupomenu', 'menugroup'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *group*

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
│ ⟡ *TOTAL DISPONIBLE ::* 30+ comandos
│ ⎔ *MODO ::* Moderación y configuración
╰────────────────────────────────────────────╯

╭────────〔 ⚙️ BÁSICOS 〕────────╮
│ ✦ ${currentPrefix}add — agregar usuario
│ ✦ ${currentPrefix}kick — expulsar usuario
│ ✦ ${currentPrefix}promote — dar admin
│ ✦ ${currentPrefix}demote — quitar admin
│ ✦ ${currentPrefix}link — ver enlace
│ ✦ ${currentPrefix}setname — cambiar nombre
│ ✦ ${currentPrefix}setdesc — cambiar descripción
│ ✦ ${currentPrefix}setppgroup — cambiar foto
╰──────────────────────────────╯

╭────────〔 🔇 SISTEMA MUTE 〕────────╮
│ ✦ ${currentPrefix}mute — silenciar grupo
│ ✦ ${currentPrefix}mutelist — ver silenciados
│ ✦ ${currentPrefix}mutetime — mute temporal
│ ✦ ${currentPrefix}unmute — quitar silencio
╰────────────────────────────────╯

╭────────〔 ⚡ MODERACIÓN 〕────────╮
│ ✦ ${currentPrefix}kickall — expulsar todos
│ ✦ ${currentPrefix}hidetag — mencionar todos oculto
│ ✦ ${currentPrefix}purge — borrar mensajes
│ ✦ ${currentPrefix}purgeuser — borrar mensajes de usuario
│ ✦ ${currentPrefix}revoke — reiniciar enlace
╰────────────────────────────────╯

╭────────〔 ⚙️ CONFIGURACIÓN 〕────────╮
│ ✦ ${currentPrefix}modconfig — configuración avanzada
╰────────────────────────────────╯

╭────────〔 🛡️ ANTI SYSTEM 〕────────╮
│ ✦ ${currentPrefix}antiestado — bloquear estados
│ ✦ ${currentPrefix}antiflood — anti spam
│ ✦ ${currentPrefix}antiimage — bloquear imágenes
│ ✦ ${currentPrefix}antivideo — bloquear videos
│ ✦ ${currentPrefix}antisticker — bloquear stickers
│ ✦ ${currentPrefix}badwords — filtro de palabras
│ ✦ ${currentPrefix}antinsfw — bloquear contenido nsfw
╰────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}