export default {
  command: ['menugacha', 'gachamenu'],
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
> Accediste al sistema de *gacha* 🎴✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *G A C H A* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: GACHA SYSTEM 🎴
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🎴 *GACHA SYSTEM* 🎴 𓆪
        ✨ *Total disponible:* 26 comandos
        ⚡ *Modo:* waifus, colección, tienda e intercambio



ꕥ 🎲 *INVOCACIÓN Y RECLAMO*

🎴 *${currentPrefix}rollwaifu* / *${currentPrefix}rw* / *${currentPrefix}roll*:
Invoca un personaje aleatorio del sistema gacha. Sirve para buscar nuevas waifus y agregarlas a la dinámica del grupo.

💖 *${currentPrefix}claim* / *${currentPrefix}c* / *${currentPrefix}reclamar*:
Reclama el personaje disponible. Debes usarlo cuando aparezca una waifu o personaje que quieras guardar.

📦 *${currentPrefix}harem* / *${currentPrefix}waifus* / *${currentPrefix}claims*:
Muestra tu colección de personajes reclamados. También permite revisar tus waifus guardadas.



ꕥ ℹ️ *INFORMACIÓN GACHA*

ℹ️ *${currentPrefix}gachainfo* / *${currentPrefix}ginfo* / *${currentPrefix}infogacha*:
Muestra información general del sistema gacha, reglas, datos y funcionamiento.

👤 *${currentPrefix}charinfo* / *${currentPrefix}winfo* / *${currentPrefix}waifuinfo*:
Muestra información detallada de un personaje o waifu, incluyendo datos disponibles del registro.

🎞️ *${currentPrefix}serieinfo* / *${currentPrefix}ainfo* / *${currentPrefix}animeinfo*:
Muestra información sobre una serie o anime relacionado con los personajes.

📚 *${currentPrefix}serielist* / *${currentPrefix}slist* / *${currentPrefix}animelist*:
Lista series o animes disponibles dentro del sistema gacha.



ꕥ 🖼️ *MULTIMEDIA*

🖼️ *${currentPrefix}charimage* / *${currentPrefix}waifuimage* / *${currentPrefix}cimage* / *${currentPrefix}wimage*:
Muestra una imagen del personaje o waifu seleccionado.

🎬 *${currentPrefix}charvideo* / *${currentPrefix}waifuvideo* / *${currentPrefix}cvideo* / *${currentPrefix}wvideo*:
Muestra un video relacionado con el personaje o waifu seleccionado.



ꕥ 🏆 *RANKING Y FAVORITOS*

🗳️ *${currentPrefix}vote* / *${currentPrefix}votar*:
Vota por un personaje dentro del sistema gacha.

🏆 *${currentPrefix}waifusboard* / *${currentPrefix}waifustop* / *${currentPrefix}topwaifus* / *${currentPrefix}wtop*:
Muestra el ranking de waifus o personajes más destacados.

⭐ *${currentPrefix}favtop* / *${currentPrefix}favoritetop* / *${currentPrefix}favboard*:
Muestra el ranking de personajes favoritos.

💘 *${currentPrefix}setfav* / *${currentPrefix}setfavourite*:
Marca una waifu o personaje como favorito dentro de tu colección.

❌ *${currentPrefix}deletefav* / *${currentPrefix}delfav*:
Elimina el personaje marcado como favorito.



ꕥ 🛒 *TIENDA Y VENTAS*

💰 *${currentPrefix}sell* / *${currentPrefix}vender*:
Pone una waifu o personaje en venta.

🛒 *${currentPrefix}wshop* / *${currentPrefix}haremshop* / *${currentPrefix}tiendawaifus*:
Abre la tienda de waifus disponibles para compra.

🛍️ *${currentPrefix}buyc* / *${currentPrefix}buycharacter* / *${currentPrefix}buychar*:
Compra un personaje disponible en la tienda.

🚫 *${currentPrefix}removesale* / *${currentPrefix}removerventa*:
Retira un personaje de la venta.



ꕥ 🔁 *REGALOS E INTERCAMBIOS*

🎁 *${currentPrefix}givechar* / *${currentPrefix}givewaifu* / *${currentPrefix}regalar*:
Regala un personaje o waifu a otro usuario.

📤 *${currentPrefix}giveallharem*:
Entrega todo el harem o colección según la función del sistema.

🔁 *${currentPrefix}trade* / *${currentPrefix}intercambiar*:
Inicia un intercambio de personajes con otro usuario.

✅ *${currentPrefix}aceptar*:
Acepta una acción pendiente, como intercambio o proceso relacionado al gacha.

🦹 *${currentPrefix}robwaifu* / *${currentPrefix}robarwaifu*:
Intenta robar una waifu a otro usuario según las reglas del sistema.



ꕥ ⚙️ *CONFIGURACIÓN Y CONTROL*

💬 *${currentPrefix}setclaim* / *${currentPrefix}setclaimmsg*:
Configura el mensaje personalizado de reclamo.

🧹 *${currentPrefix}delclaimmsg* / *${currentPrefix}resetclaimmsg*:
Elimina o reinicia el mensaje personalizado de reclamo.

🗑️ *${currentPrefix}delchar* / *${currentPrefix}deletewaifu* / *${currentPrefix}delwaifu*:
Elimina un personaje o waifu del sistema según permisos disponibles.



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