export default {
  command: ['menu profile', 'menuperfil'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

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
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 👤 PROFILE SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 14 comandos
│ ⎔ *MODO ::* Información, progreso y datos personales
╰──────────────────────────────────────────────╯

╭────────〔 🧾 PROFILE / PERFIL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}profile
│ ✦ *Alias:* ${currentPrefix}perfil
│
│ 📌 *¿Qué hace?*
│ Muestra tu perfil completo dentro del bot.
│ Incluye cumpleaños, género, pasatiempo, pareja,
│ nivel, experiencia, ranking, coins y datos de gacha.
│
│ 🧾 *Uso:*
│ ${currentPrefix}profile
│ ${currentPrefix}profile @usuario
╰────────────────────────────────────────╯

╭────────〔 📊 LEVEL / LVL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}level
│ ✦ *Alias:* ${currentPrefix}lvl
│
│ 📌 *¿Qué hace?*
│ Muestra tu nivel, experiencia, progreso y puesto
│ dentro del ranking de usuarios.
│
│ 🧾 *Uso:*
│ ${currentPrefix}level
│ ${currentPrefix}level @usuario
╰───────────────────────────────────╯

╭────────〔 🏆 LEADERBOARD / LBOARD 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}lboard
│ ✦ *Aliases:* ${currentPrefix}lb • ${currentPrefix}leaderboard
│
│ 📌 *¿Qué hace?*
│ Muestra el top de usuarios con más experiencia.
│
│ 🧾 *Uso:*
│ ${currentPrefix}lboard
│ ${currentPrefix}leaderboard 2
╰────────────────────────────────────────────╯

╭────────〔 💤 AFK 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}afk
│
│ 📌 *¿Qué hace?*
│ Marca tu estado como ausente y permite indicar
│ un motivo. Al volver, el bot muestra cuánto tiempo
│ estuviste inactivo.
│
│ 🧾 *Uso:*
│ ${currentPrefix}afk ocupado
╰───────────────────────────╯

╭────────〔 🎂 SETBIRTH 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setbirth
│
│ 📌 *¿Qué hace?*
│ Establece tu fecha de nacimiento en el perfil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setbirth 01/01/2000
│ ${currentPrefix}setbirth 01/01
╰───────────────────────────────╯

╭────────〔 ❌ DELBIRTH 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}delbirth
│
│ 📌 *¿Qué hace?*
│ Elimina tu fecha de nacimiento guardada.
│
│ 🧾 *Uso:*
│ ${currentPrefix}delbirth
╰──────────────────────────────╯

╭────────〔 📝 SETDESC 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setdescription
│ ✦ *Alias:* ${currentPrefix}setdesc
│
│ 📌 *¿Qué hace?*
│ Establece una descripción personalizada para tu perfil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setdesc Hola, uso RubyJX Bot
╰──────────────────────────────╯

╭────────〔 ❌ DELDESC 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}deldescription
│ ✦ *Alias:* ${currentPrefix}deldesc
│
│ 📌 *¿Qué hace?*
│ Elimina tu descripción personalizada.
│
│ 🧾 *Uso:*
│ ${currentPrefix}deldesc
╰─────────────────────────────╯

╭────────〔 ⚥ SETGENRE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setgenre
│
│ 📌 *¿Qué hace?*
│ Establece tu género dentro del perfil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setgenre hombre
│ ${currentPrefix}setgenre mujer
╰──────────────────────────────╯

╭────────〔 ❌ DELGENRE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}delgenre
│
│ 📌 *¿Qué hace?*
│ Elimina el género guardado en tu perfil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}delgenre
╰──────────────────────────────╯

╭────────〔 🎯 SETHOBBY 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setpasatiempo
│ ✦ *Alias:* ${currentPrefix}sethobby
│
│ 📌 *¿Qué hace?*
│ Establece tu pasatiempo favorito dentro del perfil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}sethobby 1
│ ${currentPrefix}setpasatiempo Leer
╰──────────────────────────────╯

╭────────〔 ❌ REMOVEHOBBY 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}delpasatiempo
│ ✦ *Alias:* ${currentPrefix}removehobby
│
│ 📌 *¿Qué hace?*
│ Elimina tu pasatiempo guardado.
│
│ 🧾 *Uso:*
│ ${currentPrefix}removehobby
╰─────────────────────────────────╯

╭────────〔 💍 MARRY / CASARSE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}marry
│ ✦ *Alias:* ${currentPrefix}casarse
│
│ 📌 *¿Qué hace?*
│ Envía una propuesta de matrimonio a otro usuario.
│
│ 🧾 *Uso:*
│ ${currentPrefix}marry @usuario
╰──────────────────────────────────────╯

╭────────〔 💔 DIVORCE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}divorce
│
│ 📌 *¿Qué hace?*
│ Termina tu matrimonio actual dentro del sistema.
│
│ 🧾 *Uso:*
│ ${currentPrefix}divorce
╰──────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(
      m.chat,
      {
        text: textMenu,
        contextInfo: {
          externalAdReply: {
            title: settings.nameid || 'RubyJX Bot',
            body: 'Ver canal oficial',
            thumbnailUrl: settings.icon || settings.banner || '',
            sourceUrl: settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F',
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