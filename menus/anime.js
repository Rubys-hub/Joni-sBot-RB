export default {
  command: ['anime', 'random'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *anime / random*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│            ⟐ *A N I M E* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: FUN SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 🎌 ANIME SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 15 comandos
│ ⎔ *MODO ::* Reacciones y contenido anime
╰────────────────────────────────────────────╯

╭────────〔 😘 KISS 〕────────╮
│ ✦ *Comando:* ${currentPrefix}kiss
│
│ 📌 Besa a alguien
│
│ 🧾 Uso:
│ ${currentPrefix}kiss @usuario
╰────────────────────────────╯

╭────────〔 🤗 HUG 〕────────╮
│ ✦ *Comando:* ${currentPrefix}hug
│
│ 📌 Abraza a alguien
│
│ 🧾 Uso:
│ ${currentPrefix}hug @usuario
╰────────────────────────────╯

╭────────〔 😏 PAT 〕────────╮
│ ✦ *Comando:* ${currentPrefix}pat
│
│ 📌 Da palmaditas
│
│ 🧾 Uso:
│ ${currentPrefix}pat @usuario
╰────────────────────────────╯

╭────────〔 😂 LAUGH 〕────────╮
│ ✦ *Comando:* ${currentPrefix}laugh
│
│ 📌 Reacción de risa
│
│ 🧾 Uso:
│ ${currentPrefix}laugh
╰────────────────────────────╯

╭────────〔 😡 ANGRY 〕────────╮
│ ✦ *Comando:* ${currentPrefix}angry
│
│ 📌 Reacción de enojo
│
│ 🧾 Uso:
│ ${currentPrefix}angry
╰────────────────────────────╯

╭────────〔 😭 CRY 〕────────╮
│ ✦ *Comando:* ${currentPrefix}cry
│
│ 📌 Reacción triste
│
│ 🧾 Uso:
│ ${currentPrefix}cry
╰────────────────────────────╯

╭────────〔 😳 BLUSH 〕────────╮
│ ✦ *Comando:* ${currentPrefix}blush
│
│ 📌 Reacción sonrojado
│
│ 🧾 Uso:
│ ${currentPrefix}blush
╰────────────────────────────╯

╭────────〔 😴 SLEEP 〕────────╮
│ ✦ *Comando:* ${currentPrefix}sleep
│
│ 📌 Reacción dormir
│
│ 🧾 Uso:
│ ${currentPrefix}sleep
╰────────────────────────────╯

╭────────〔 😍 WAIFU 〕────────╮
│ ✦ *Comando:* ${currentPrefix}waifu
│
│ 📌 Waifu random
│
│ 🧾 Uso:
│ ${currentPrefix}waifu
╰────────────────────────────╯

╭────────〔 🐱 NEKO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}neko
│
│ 📌 Neko random
│
│ 🧾 Uso:
│ ${currentPrefix}neko
╰────────────────────────────╯

╭────────〔 🖼️ ANIMEPIC 〕────────╮
│ ✦ *Comando:* ${currentPrefix}animepic
│
│ 📌 Imagen anime random
│
│ 🧾 Uso:
│ ${currentPrefix}animepic
╰────────────────────────────╯

╭────────〔 🎭 COSPLAY 〕────────╮
│ ✦ *Comando:* ${currentPrefix}cosplay
│
│ 📌 Cosplay random
│
│ 🧾 Uso:
│ ${currentPrefix}cosplay
╰────────────────────────────╯

╭────────〔 🎲 RANDOM 〕────────╮
│ ✦ *Comando:* ${currentPrefix}random
│
│ 📌 Contenido random
│
│ 🧾 Uso:
│ ${currentPrefix}random
╰────────────────────────────╯

╭────────〔 🎌 OTAKU 〕────────╮
│ ✦ *Comando:* ${currentPrefix}otaku
│
│ 📌 Contenido otaku
│
│ 🧾 Uso:
│ ${currentPrefix}otaku
╰────────────────────────────╯

╭────────〔 🎥 ANIMEVIDEO 〕────────╮
│ ✦ *Comando:* ${currentPrefix}animevideo
│
│ 📌 Video anime
│
│ 🧾 Uso:
│ ${currentPrefix}animevideo
╰────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}