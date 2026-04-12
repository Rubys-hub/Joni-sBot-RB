export default {
  command: ['gacha'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *gacha*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *G A C H A* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: GACHA SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 🎴 GACHA SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 21 comandos
│ ⎔ *MODO ::* Reclamos, intercambios y personajes
╰────────────────────────────────────────────╯

╭────────〔 🛒 BUYCHARACTER / COMPRAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}buycharacter
│ ✦ *Aliases:* ${currentPrefix}buychar • ${currentPrefix}buyc
│
│ 📌 *¿Qué hace?*
│ Compra un personaje que esté en venta.
│
│ 🧾 *Uso:*
│ ${currentPrefix}buycharacter <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🖼️ CHARIMAGE / IMAGEN 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}charimage
│ ✦ *Aliases:* ${currentPrefix}waifuimage • ${currentPrefix}cimage • ${currentPrefix}wimage
│
│ 📌 *¿Qué hace?*
│ Muestra una imagen aleatoria del personaje.
│
│ 🧾 *Uso:*
│ ${currentPrefix}charimage <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 📄 CHARINFO / INFO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}charinfo
│ ✦ *Aliases:* ${currentPrefix}winfo • ${currentPrefix}waifuinfo
│
│ 📌 *¿Qué hace?*
│ Muestra la información del personaje.
│
│ 🧾 *Uso:*
│ ${currentPrefix}charinfo <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🎯 CLAIM / RECLAMAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}claim
│ ✦ *Aliases:* ${currentPrefix}c • ${currentPrefix}reclamar
│
│ 📌 *¿Qué hace?*
│ Reclama un personaje disponible.
│
│ 🧾 *Uso:*
│ ${currentPrefix}claim <cite / waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🗑️ DELCLAIMMSG 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}delclaimmsg
│
│ 📌 *¿Qué hace?*
│ Restablece el mensaje de reclamo.
│
│ 🧾 *Uso:*
│ ${currentPrefix}delclaimmsg
╰──────────────────────────────────────────────╯

╭────────〔 ❌ DELETEWAIFU / ELIMINAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}deletewaifu
│ ✦ *Aliases:* ${currentPrefix}delwaifu • ${currentPrefix}delchar
│
│ 📌 *¿Qué hace?*
│ Elimina un personaje reclamado.
│
│ 🧾 *Uso:*
│ ${currentPrefix}deletewaifu <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🏆 FAVTOP / TOP FAVORITOS 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}favoritetop
│ ✦ *Alias:* ${currentPrefix}favtop
│
│ 📌 *¿Qué hace?*
│ Muestra el top de personajes favoritos.
│
│ 🧾 *Uso:*
│ ${currentPrefix}favoritetop
╰──────────────────────────────────────────────╯

╭────────〔 📊 GACHAINFO / GINFO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}gachainfo
│ ✦ *Aliases:* ${currentPrefix}ginfo • ${currentPrefix}infogacha
│
│ 📌 *¿Qué hace?*
│ Muestra tu información de gacha.
│
│ 🧾 *Uso:*
│ ${currentPrefix}gachainfo
╰──────────────────────────────────────────────╯

╭────────〔 🎁 GIVEALLHAREM 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}giveallharem
│
│ 📌 *¿Qué hace?*
│ Regala todos tus personajes a otro usuario.
│
│ 🧾 *Uso:*
│ ${currentPrefix}giveallharem @usuario
╰──────────────────────────────────────────────╯

╭────────〔 🤝 GIVECHAR / REGALAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}givechar
│ ✦ *Aliases:* ${currentPrefix}givewaifu • ${currentPrefix}regalar
│
│ 📌 *¿Qué hace?*
│ Regala un personaje a otro usuario.
│
│ 🧾 *Uso:*
│ ${currentPrefix}givechar <waifu> @usuario
╰──────────────────────────────────────────────╯

╭────────〔 🗂️ HAREM / WAIFUS 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}harem
│ ✦ *Aliases:* ${currentPrefix}waifus • ${currentPrefix}claims
│
│ 📌 *¿Qué hace?*
│ Muestra tus personajes reclamados.
│
│ 🧾 *Uso:*
│ ${currentPrefix}harem
│ ${currentPrefix}harem @usuario
╰──────────────────────────────────────────────╯

╭────────〔 🏪 HAREMSHOP / TIENDA 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}haremshop
│ ✦ *Aliases:* ${currentPrefix}tiendawaifus • ${currentPrefix}wshop
│
│ 📌 *¿Qué hace?*
│ Muestra los personajes en venta.
│
│ 🧾 *Uso:*
│ ${currentPrefix}haremshop
│ ${currentPrefix}haremshop 2
╰──────────────────────────────────────────────╯

╭────────〔 🚫 REMOVESALE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}removesale
│ ✦ *Alias:* ${currentPrefix}removerventa
│
│ 📌 *¿Qué hace?*
│ Quita un personaje de la venta.
│
│ 🧾 *Uso:*
│ ${currentPrefix}removesale <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🎲 ROLLWAIFU / RW 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}rollwaifu
│ ✦ *Aliases:* ${currentPrefix}rw • ${currentPrefix}roll
│
│ 📌 *¿Qué hace?*
│ Obtiene una waifu o husbando aleatorio.
│
│ 🧾 *Uso:*
│ ${currentPrefix}rollwaifu
╰──────────────────────────────────────────────╯

╭────────〔 💸 SELL / VENDER 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}sell
│ ✦ *Alias:* ${currentPrefix}vender
│
│ 📌 *¿Qué hace?*
│ Pone un personaje a la venta.
│
│ 🧾 *Uso:*
│ ${currentPrefix}sell <valor> <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 📚 SERIEINFO / ANIMEINFO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}serieinfo
│ ✦ *Aliases:* ${currentPrefix}ainfo • ${currentPrefix}animeinfo
│
│ 📌 *¿Qué hace?*
│ Muestra información de un anime.
│
│ 🧾 *Uso:*
│ ${currentPrefix}serieinfo <nombre>
╰──────────────────────────────────────────────╯

╭────────〔 📜 SERIELIST / ANIMELIST 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}serielist
│ ✦ *Aliases:* ${currentPrefix}slist • ${currentPrefix}animelist
│
│ 📌 *¿Qué hace?*
│ Lista las series disponibles.
│
│ 🧾 *Uso:*
│ ${currentPrefix}serielist
╰──────────────────────────────────────────────╯

╭────────〔 ✏️ SETCLAIMMSG 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setclaimmsg
│ ✦ *Alias:* ${currentPrefix}setclaim
│
│ 📌 *¿Qué hace?*
│ Cambia el mensaje al reclamar personajes.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setclaimmsg <texto>
╰──────────────────────────────────────────────╯

╭────────〔 ⭐ SETFAVOURITE / SETFAV 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}setfavourite
│ ✦ *Alias:* ${currentPrefix}setfav
│
│ 📌 *¿Qué hace?*
│ Establece tu personaje favorito.
│
│ 🧾 *Uso:*
│ ${currentPrefix}setfavourite <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🔄 TRADE / INTERCAMBIAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}trade
│ ✦ *Alias:* ${currentPrefix}intercambiar
│
│ 📌 *¿Qué hace?*
│ Intercambia personajes con otro usuario.
│
│ 🧾 *Uso:*
│ ${currentPrefix}trade <tu personaje / personaje 2>
╰──────────────────────────────────────────────╯

╭────────〔 🗳️ VOTE / VOTAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}vote
│ ✦ *Alias:* ${currentPrefix}votar
│
│ 📌 *¿Qué hace?*
│ Vota por un personaje para subir su valor.
│
│ 🧾 *Uso:*
│ ${currentPrefix}vote <waifu>
╰──────────────────────────────────────────────╯

╭────────〔 🥇 WAIFUSBOARD / TOP 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}waifusboard
│ ✦ *Aliases:* ${currentPrefix}waifustop • ${currentPrefix}topwaifus • ${currentPrefix}wtop
│
│ 📌 *¿Qué hace?*
│ Muestra el top de personajes con mayor valor.
│
│ 🧾 *Uso:*
│ ${currentPrefix}waifusboard
│ ${currentPrefix}waifusboard 2
╰──────────────────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}