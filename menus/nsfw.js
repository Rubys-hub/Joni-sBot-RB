export default {
command: ['menunsfw', 'nsfwmenu', 'menu 9'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema *NSFW*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *N S F W* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: ADULT SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

⚠ *Advertencia:* Este contenido es para mayores de edad.

╭────────────〔 🔞 NSFW SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 12 comandos
│ ⎔ *MODO ::* Anime + contenido adulto
╰───────────────────────────────────────────╯

╭────────〔 🍑 WAIFU NSFW 〕────────╮
│ ✦ *Comando:* ${currentPrefix}waifu
│
│ 📌 Imagen nsfw aleatoria
│
│ 🧾 Uso:
│ ${currentPrefix}waifu
╰────────────────────────────────╯

╭────────〔 💦 HENTAI 〕────────╮
│ ✦ *Comando:* ${currentPrefix}hentai
│
│ 📌 Imagen hentai
│
│ 🧾 Uso:
│ ${currentPrefix}hentai
╰────────────────────────────────╯

╭────────〔 🖤 NEKO NSFW 〕────────╮
│ ✦ *Comando:* ${currentPrefix}neko
│
│ 📌 Imagen neko nsfw
│
│ 🧾 Uso:
│ ${currentPrefix}neko
╰────────────────────────────────╯

╭────────〔 🔥 TRAP 〕────────╮
│ ✦ *Comando:* ${currentPrefix}trap
│
│ 📌 Imagen trap
│
│ 🧾 Uso:
│ ${currentPrefix}trap
╰────────────────────────────────╯

╭────────〔 👅 BLOWJOB 〕────────╮
│ ✦ *Comando:* ${currentPrefix}blowjob
│
│ 📌 Acción nsfw
│
│ 🧾 Uso:
│ ${currentPrefix}blowjob
╰────────────────────────────────╯

╭────────〔 💋 KISS 〕────────╮
│ ✦ *Comando:* ${currentPrefix}kiss
│
│ 📌 Acción romántica
│
│ 🧾 Uso:
│ ${currentPrefix}kiss @usuario
╰────────────────────────────────╯

╭────────〔 😈 FUCK 〕────────╮
│ ✦ *Comando:* ${currentPrefix}fuck
│
│ 📌 Acción nsfw
│
│ 🧾 Uso:
│ ${currentPrefix}fuck @usuario
╰────────────────────────────────╯

╭────────〔 🍆 ANAL 〕────────╮
│ ✦ *Comando:* ${currentPrefix}anal
│
│ 📌 Acción nsfw
│
│ 🧾 Uso:
│ ${currentPrefix}anal
╰────────────────────────────────╯

╭────────〔 👄 CUM 〕────────╮
│ ✦ *Comando:* ${currentPrefix}cum
│
│ 📌 Acción nsfw
│
│ 🧾 Uso:
│ ${currentPrefix}cum
╰────────────────────────────────╯

╭────────〔 🧼 ORGY 〕────────╮
│ ✦ *Comando:* ${currentPrefix}orgy
│
│ 📌 Acción nsfw
│
│ 🧾 Uso:
│ ${currentPrefix}orgy
╰────────────────────────────────╯

╭────────〔 🔞 NSFW MODE 〕────────╮
│ ✦ *Comando:* ${currentPrefix}nsfw
│
│ 📌 Activa/desactiva nsfw en grupo
│
│ 🧾 Uso:
│ ${currentPrefix}nsfw on/off
╰────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}