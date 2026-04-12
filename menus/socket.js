export default {
  command: ['sockets', 'socket'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *sockets / owner*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│            ⟐ *S O C K E T S* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: OWNER SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 🔐 SOCKET SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 18 comandos
│ ⎔ *MODO ::* Control total del bot
╰─────────────────────────────────────────────╯

╭────────〔 🤖 SUBBOT 〕────────╮
│ ✦ *Comando:* ${currentPrefix}subbot
│
│ 📌 Crea o gestiona subbots
│
│ 🧾 Uso:
│ ${currentPrefix}subbot
╰──────────────────────────────╯

╭────────〔 📝 SETNAME 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setname
│
│ 📌 Cambia el nombre del bot
│
│ 🧾 Uso:
│ ${currentPrefix}setname nombre
╰──────────────────────────────╯

╭────────〔 🔤 SETPREFIX 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setprefix
│
│ 📌 Cambia el prefijo del bot
│
│ 🧾 Uso:
│ ${currentPrefix}setprefix !
╰──────────────────────────────╯

╭────────〔 🖼️ SETPPBOT 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setppbot
│
│ 📌 Cambia la foto del bot
│
│ 🧾 Uso:
│ ${currentPrefix}setppbot (responde a imagen)
╰──────────────────────────────╯

╭────────〔 📄 SETBIO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setbio
│
│ 📌 Cambia la bio del bot
│
│ 🧾 Uso:
│ ${currentPrefix}setbio texto
╰──────────────────────────────╯

╭────────〔 🔄 RESTART 〕────────╮
│ ✦ *Comando:* ${currentPrefix}restart
│
│ 📌 Reinicia el bot
│
│ 🧾 Uso:
│ ${currentPrefix}restart
╰──────────────────────────────╯

╭────────〔 📴 SHUTDOWN 〕────────╮
│ ✦ *Comando:* ${currentPrefix}shutdown
│
│ 📌 Apaga el bot
│
│ 🧾 Uso:
│ ${currentPrefix}shutdown
╰──────────────────────────────╯

╭────────〔 ⚙️ UPDATE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}update
│
│ 📌 Actualiza el bot
│
│ 🧾 Uso:
│ ${currentPrefix}update
╰──────────────────────────────╯

╭────────〔 🧹 CLEARTMP 〕────────╮
│ ✦ *Comando:* ${currentPrefix}cleartmp
│
│ 📌 Limpia archivos temporales
│
│ 🧾 Uso:
│ ${currentPrefix}cleartmp
╰──────────────────────────────╯

╭────────〔 📂 GETFILE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}getfile
│
│ 📌 Obtiene archivos del servidor
│
│ 🧾 Uso:
│ ${currentPrefix}getfile ruta
╰──────────────────────────────╯

╭────────〔 📤 SAVEFILE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}savefile
│
│ 📌 Guarda archivos en el servidor
│
│ 🧾 Uso:
│ ${currentPrefix}savefile nombre
╰──────────────────────────────╯

╭────────〔 ❌ DELFILE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}delfile
│
│ 📌 Elimina archivos
│
│ 🧾 Uso:
│ ${currentPrefix}delfile nombre
╰──────────────────────────────╯

╭────────〔 📊 STATUS 〕────────╮
│ ✦ *Comando:* ${currentPrefix}status
│
│ 📌 Muestra estado del bot
│
│ 🧾 Uso:
│ ${currentPrefix}status
╰──────────────────────────────╯

╭────────〔 🔐 SETOWNER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}setowner
│
│ 📌 Cambia el owner
│
│ 🧾 Uso:
│ ${currentPrefix}setowner numero
╰──────────────────────────────╯

╭────────〔 🚫 BLOCK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}block
│
│ 📌 Bloquea usuarios
│
│ 🧾 Uso:
│ ${currentPrefix}block @usuario
╰──────────────────────────────╯

╭────────〔 🔓 UNBLOCK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}unblock
│
│ 📌 Desbloquea usuarios
│
│ 🧾 Uso:
│ ${currentPrefix}unblock @usuario
╰──────────────────────────────╯

╭────────〔 📡 BROADCAST 〕────────╮
│ ✦ *Comando:* ${currentPrefix}broadcast
│
│ 📌 Envía mensaje global
│
│ 🧾 Uso:
│ ${currentPrefix}broadcast texto
╰──────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}