export default {
  command: ['profile', 'perfil'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *perfil*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│            ⟐ *P R O F I L E* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: USER SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 👤 PROFILE SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 15 comandos
│ ⎔ *MODO ::* Información, stats y progreso
╰──────────────────────────────────────────────╯

╭────────〔 🧾 PROFILE / PERFIL 〕────────╮
│ ✦ *Comando:* ${currentPrefix}profile
│ ✦ *Alias:* ${currentPrefix}perfil
│
│ 📌 Muestra tu información completa
│
│ 🧾 Uso:
│ ${currentPrefix}profile
│ ${currentPrefix}profile @usuario
╰──────────────────────────────────────╯

╭────────〔 📊 LEVEL / NIVEL 〕────────╮
│ ✦ *Comando:* ${currentPrefix}level
│ ✦ *Alias:* ${currentPrefix}nivel
│
│ 📌 Muestra tu nivel actual
│
│ 🧾 Uso:
│ ${currentPrefix}level
╰──────────────────────────────────────╯

╭────────〔 ⭐ EXP / EXPERIENCIA 〕────────╮
│ ✦ *Comando:* ${currentPrefix}exp
│
│ 📌 Muestra tu experiencia acumulada
│
│ 🧾 Uso:
│ ${currentPrefix}exp
╰──────────────────────────────────────╯

╭────────〔 🏆 RANK / RANGO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}rank
│
│ 📌 Muestra tu posición en el ranking
│
│ 🧾 Uso:
│ ${currentPrefix}rank
╰──────────────────────────────────────╯

╭────────〔 📈 LEVELUP 〕────────╮
│ ✦ *Comando:* ${currentPrefix}levelup
│
│ 📌 Sube de nivel si tienes experiencia suficiente
│
│ 🧾 Uso:
│ ${currentPrefix}levelup
╰──────────────────────────────────────╯

╭────────〔 🧠 MYSTATS 〕────────╮
│ ✦ *Comando:* ${currentPrefix}mystats
│
│ 📌 Muestra estadísticas del usuario
│
│ 🧾 Uso:
│ ${currentPrefix}mystats
╰──────────────────────────────────────╯

╭────────〔 📊 STATS 〕────────╮
│ ✦ *Comando:* ${currentPrefix}stats
│
│ 📌 Muestra estadísticas globales
│
│ 🧾 Uso:
│ ${currentPrefix}stats
╰──────────────────────────────────────╯

╭────────〔 🏅 TOP / RANKING 〕────────╮
│ ✦ *Comando:* ${currentPrefix}top
│
│ 📌 Muestra el ranking general
│
│ 🧾 Uso:
│ ${currentPrefix}top
╰──────────────────────────────────────╯

╭────────〔 🪪 REGISTER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}register
│
│ 📌 Registra tu usuario en el sistema
│
│ 🧾 Uso:
│ ${currentPrefix}register nombre.edad
╰──────────────────────────────────────╯

╭────────〔 ❌ UNREGISTER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}unregister
│
│ 📌 Elimina tu registro
│
│ 🧾 Uso:
│ ${currentPrefix}unregister
╰──────────────────────────────────────╯

╭────────〔 🧾 INFOUSER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}infouser
│
│ 📌 Muestra info de otro usuario
│
│ 🧾 Uso:
│ ${currentPrefix}infouser @usuario
╰──────────────────────────────────────╯

╭────────〔 📱 NUMBER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}number
│
│ 📌 Muestra tu número
│
│ 🧾 Uso:
│ ${currentPrefix}number
╰──────────────────────────────────────╯

╭────────〔 🧑 OWNER 〕────────╮
│ ✦ *Comando:* ${currentPrefix}owner
│
│ 📌 Muestra el owner del bot
│
│ 🧾 Uso:
│ ${currentPrefix}owner
╰──────────────────────────────────────╯

╭────────〔 🆔 ID 〕────────╮
│ ✦ *Comando:* ${currentPrefix}id
│
│ 📌 Muestra tu ID de usuario
│
│ 🧾 Uso:
│ ${currentPrefix}id
╰──────────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}