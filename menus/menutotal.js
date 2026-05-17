export default {
  command: ['menutotal', 'allmenu', 'menucompleto'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const botRaw = client.user?.id || ''
    const botId = botRaw.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const botName = settings.botname || settings.namebot || 'RubyJX Bot'
    const channelName = settings.nameid || global.my?.name || 'RubyJX Channel'
    const channelJid = settings.id || global.my?.ch || '120363424461852442@newsletter'
    const channelLink = settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
    const thumbnail = settings.icon || settings.banner || undefined

    const senderNum = m.sender.split('@')[0]

    const owners = Array.isArray(global.owner)
      ? global.owner.map(v => String(v).replace(/\D/g, ''))
      : []

    const isOwner = !!m.isOwner || owners.includes(senderNum)

    const ownerSection = isOwner
      ? `


ꕥ 👑 *OWNER* — *panel privado*
> Acceso: solo owner.

💰 *${currentPrefix}addcoin* / *${currentPrefix}addxp*:
Agrega coins o experiencia manualmente a un usuario.

🧹 *${currentPrefix}clear*:
Limpia datos antiguos o registros internos del bot.

⚠️ *${currentPrefix}errorfake*:
Simula un error falso para pruebas internas.

🔄 *${currentPrefix}restart*:
Reinicia el bot.

🛠️ *${currentPrefix}fix* / *${currentPrefix}update*:
Corrige, actualiza o recarga partes del sistema.

⚙️ *${currentPrefix}ex* / *${currentPrefix}e*:
Ejecuta código avanzado. Uso exclusivo del owner.

🖥️ *${currentPrefix}r*:
Ejecuta instrucciones internas del sistema.

📋 *${currentPrefix}mlist*:
Muestra listas para mensajería masiva.

📨 *${currentPrefix}mp*:
Envía mensajes privados o masivos según configuración.

🏷️ *${currentPrefix}mtag*:
Envía mensajes usando menciones.

🏷️ *${currentPrefix}mptag*:
Envía mensajes privados con menciones.

📢 *${currentPrefix}mall*:
Envía mensajes masivos o globales.

📢 *${currentPrefix}mtagall*:
Envía mensajes masivos con menciones.

📌 *${currentPrefix}pr*:
Abre el sistema principal de promoción.

📋 *${currentPrefix}prlist*:
Muestra destinos disponibles para promoción.

🔗 *${currentPrefix}prshared*:
Muestra destinos compartidos o relacionados.

🔔 *${currentPrefix}prsus*:
Gestiona destinos suscritos para promoción.

💬 *${currentPrefix}prmsg*:
Envía mensaje promocional normal.

💬 *${currentPrefix}prsusmsg*:
Envía mensaje promocional a suscritos.

📢 *${currentPrefix}prall*:
Envía promoción a todos los destinos configurados.

🏷️ *${currentPrefix}prtag*:
Envía promoción con menciones.

🏷️ *${currentPrefix}prsustag*:
Envía promoción con menciones a suscritos.

🏷️ *${currentPrefix}prtagall*:
Envía promoción con menciones a todos.

👥 *${currentPrefix}prgtag*:
Envía promoción con mención en grupo específico.

📣 *${currentPrefix}prpromo*:
Envía promoción del canal o contenido configurado.

📣 *${currentPrefix}prsuspromo*:
Envía promoción del canal a suscritos.

📣 *${currentPrefix}prpromoall*:
Envía promoción del canal a todos los destinos.`
      : ''

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Aquí tienes el *panel completo actualizado* de comandos de *${botName}* 📋✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│             ⟐ *A L L  M E N U* ⟐
│
│        𖧧 USER :: @${senderNum} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: FULL MENU SYSTEM 📋
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🧭 *CATEGORÍAS DISPONIBLES* 🧭 𓆪

💰 *1. ECONOMÍA*
> Dinero, banco, recompensas, apuestas y códigos.
> Usa: *${currentPrefix}menu economia*

🎴 *2. GACHA*
> Waifus, colección, tienda, favoritos e intercambios.
> Usa: *${currentPrefix}menu gacha*

📥 *3. DOWNLOADS*
> Descargas, búsquedas, redes sociales, archivos y apps.
> Usa: *${currentPrefix}menu downloads*

👤 *4. PROFILE*
> Perfil, nivel, cumpleaños, descripción, género y pareja.
> Usa: *${currentPrefix}menu profile*

🔐 *5. SOCKETS*
> Subbots, conexión, sesiones y configuración de socket.
> Usa: *${currentPrefix}menu sockets*

🎨 *6. STICKERS*
> Crear stickers, packs, metadata y gestión de stickers.
> Usa: *${currentPrefix}menu stickers*

🛠️ *7. UTILITIES*
> Herramientas, IA, texto, archivos, enlaces y conversión.
> Usa: *${currentPrefix}menu utilities*

👥 *8. GROUP*
> Moderación, seguridad, menciones, estadísticas y configuración.
> Usa: *${currentPrefix}menu group*

🔞 *9. NSFW*
> Búsquedas y acciones NSFW. Requiere activación en el grupo.
> Usa: *${currentPrefix}menu nsfw*

🌌 *10. ANIME*
> Imágenes anime, parejas y extras.
> Usa: *${currentPrefix}menu anime*

💞 *11. INTERACCIONES*
> Acciones, emociones, gestos y convivencia.
> Usa: *${currentPrefix}menu interacciones*

🎯 *12. REACTIONS*
> Sistema de reacciones comprables y equipables.
> Usa: *${currentPrefix}menu reactions*



ꕥ 🧩 *MAIN / GENERAL*

🏠 *${currentPrefix}menu*:
Abre el menú principal del bot.

📋 *${currentPrefix}menutotal* / *${currentPrefix}allmenu* / *${currentPrefix}menucompleto*:
Muestra este panel completo actualizado.

🤖 *${currentPrefix}infobot* / *${currentPrefix}infosocket*:
Muestra información general del bot o socket.

📨 *${currentPrefix}invite* / *${currentPrefix}invitar*:
Muestra invitación o información para agregar el bot.

⚡ *${currentPrefix}ping* / *${currentPrefix}p*:
Mide la velocidad de respuesta del bot.

📊 *${currentPrefix}status* / *${currentPrefix}estado*:
Muestra el estado actual del sistema.

📝 *${currentPrefix}report* / *${currentPrefix}reporte* / *${currentPrefix}sug* / *${currentPrefix}suggest*:
Envía reportes o sugerencias al owner.



ꕥ 💰 *ECONOMÍA* — *20 comandos*
> Acceso: *${currentPrefix}menu economia*

💰 *${currentPrefix}balance* / *${currentPrefix}bal* / *${currentPrefix}coins* / *${currentPrefix}bank*:
Muestra tu dinero, banco y progreso económico.

🎁 *${currentPrefix}daily* / *${currentPrefix}diario*:
Reclama tu recompensa diaria.


🧰 *${currentPrefix}cofre* / *${currentPrefix}coffer* / *${currentPrefix}chest* / *${currentPrefix}tesoro* / *${currentPrefix}caja*:
Abre un cofre de suerte. Puedes ganar dinero, no recibir nada o perder dinero si aparece una bomba.

💼 *${currentPrefix}work* / *${currentPrefix}w* / *${currentPrefix}chambear* / *${currentPrefix}chamba* / *${currentPrefix}trabajar*:
Trabaja para ganar monedas.

📅 *${currentPrefix}monthly* / *${currentPrefix}mensual*:
Reclama una recompensa mensual.

🏆 *${currentPrefix}economyboard* / *${currentPrefix}eboard* / *${currentPrefix}baltop*:
Muestra el ranking económico del grupo.

ℹ️ *${currentPrefix}infoeconomy* / *${currentPrefix}cooldowns* / *${currentPrefix}economyinfo* / *${currentPrefix}einfo*:
Muestra información y tiempos de espera de economía.

🏦 *${currentPrefix}deposit* / *${currentPrefix}dep* / *${currentPrefix}d*:
Deposita monedas en el banco.

💸 *${currentPrefix}withdraw* / *${currentPrefix}with* / *${currentPrefix}retirar*:
Retira monedas del banco.

🤝 *${currentPrefix}givecoins* / *${currentPrefix}pay* / *${currentPrefix}coinsgive*:
Transfiere monedas a otro usuario.

🎟️ *${currentPrefix}codigo* / *${currentPrefix}codigos*:
Administra códigos de recompensa.

🎁 *${currentPrefix}canjear*:
Canjea códigos para recibir recompensas.

🕵️ *${currentPrefix}crime* / *${currentPrefix}crimen*:
Intenta ganar monedas con una acción arriesgada.

💋 *${currentPrefix}slut* / *${currentPrefix}prostituirse*:
Comando de riesgo para ganar o perder monedas.

🎰 *${currentPrefix}slot*:
Juega tragamonedas.

🎲 *${currentPrefix}apostar* / *${currentPrefix}casino*:
Apuesta monedas en casino.

🪙 *${currentPrefix}coinflip* / *${currentPrefix}cf* / *${currentPrefix}flip*:
Juega cara o cruz apostando monedas.

🏹 *${currentPrefix}hunt* / *${currentPrefix}cazar*:
Caza para conseguir recompensas.

🩹 *${currentPrefix}heal* / *${currentPrefix}curar*:
Cura tu estado dentro del sistema.

🏰 *${currentPrefix}dungeon* / *${currentPrefix}mazmorra*:
Entra a una mazmorra para conseguir recompensas.

✊ *${currentPrefix}ppt*:
Juega piedra, papel o tijera.



ꕥ 🎴 *GACHA* — *26 comandos*
> Acceso: *${currentPrefix}menu gacha*

🎴 *${currentPrefix}rollwaifu* / *${currentPrefix}rw* / *${currentPrefix}roll*:
Invoca un personaje aleatorio.

💖 *${currentPrefix}claim* / *${currentPrefix}c* / *${currentPrefix}reclamar*:
Reclama el personaje disponible.

📦 *${currentPrefix}harem* / *${currentPrefix}waifus* / *${currentPrefix}claims*:
Muestra tu colección de personajes.

ℹ️ *${currentPrefix}gachainfo* / *${currentPrefix}ginfo* / *${currentPrefix}infogacha*:
Muestra información del sistema gacha.

👤 *${currentPrefix}charinfo* / *${currentPrefix}winfo* / *${currentPrefix}waifuinfo*:
Muestra información de un personaje.

🎞️ *${currentPrefix}serieinfo* / *${currentPrefix}ainfo* / *${currentPrefix}animeinfo*:
Muestra información de una serie o anime.

📚 *${currentPrefix}serielist* / *${currentPrefix}slist* / *${currentPrefix}animelist*:
Lista series disponibles.

🖼️ *${currentPrefix}charimage* / *${currentPrefix}waifuimage* / *${currentPrefix}cimage* / *${currentPrefix}wimage*:
Muestra imagen de un personaje.

🎬 *${currentPrefix}charvideo* / *${currentPrefix}waifuvideo* / *${currentPrefix}cvideo* / *${currentPrefix}wvideo*:
Muestra video de un personaje.

🗳️ *${currentPrefix}vote* / *${currentPrefix}votar*:
Vota por un personaje.

🏆 *${currentPrefix}waifusboard* / *${currentPrefix}waifustop* / *${currentPrefix}topwaifus* / *${currentPrefix}wtop*:
Muestra ranking de waifus.

⭐ *${currentPrefix}favtop* / *${currentPrefix}favoritetop* / *${currentPrefix}favboard*:
Muestra ranking de favoritos.

💘 *${currentPrefix}setfav* / *${currentPrefix}setfavourite*:
Marca un personaje como favorito.

❌ *${currentPrefix}deletefav* / *${currentPrefix}delfav*:
Elimina tu favorito.

💰 *${currentPrefix}sell* / *${currentPrefix}vender*:
Pone un personaje en venta.

🛒 *${currentPrefix}wshop* / *${currentPrefix}haremshop* / *${currentPrefix}tiendawaifus*:
Abre la tienda de personajes.

🛍️ *${currentPrefix}buyc* / *${currentPrefix}buycharacter* / *${currentPrefix}buychar*:
Compra un personaje.

🚫 *${currentPrefix}removesale* / *${currentPrefix}removerventa*:
Retira un personaje de la venta.

🎁 *${currentPrefix}givechar* / *${currentPrefix}givewaifu* / *${currentPrefix}regalar*:
Regala un personaje a otro usuario.

📤 *${currentPrefix}giveallharem*:
Entrega toda una colección según el sistema.

🔁 *${currentPrefix}trade* / *${currentPrefix}intercambiar*:
Inicia intercambio de personajes.

✅ *${currentPrefix}aceptar*:
Acepta un intercambio o acción pendiente.

🦹 *${currentPrefix}robwaifu* / *${currentPrefix}robarwaifu*:
Intenta robar una waifu.

💬 *${currentPrefix}setclaim* / *${currentPrefix}setclaimmsg*:
Configura mensaje de reclamo.

🧹 *${currentPrefix}delclaimmsg* / *${currentPrefix}resetclaimmsg*:
Elimina o reinicia el mensaje de reclamo.

🗑️ *${currentPrefix}delchar* / *${currentPrefix}deletewaifu* / *${currentPrefix}delwaifu*:
Elimina un personaje según permisos.



ꕥ 📥 *DOWNLOADS* — *13 comandos*
> Acceso: *${currentPrefix}menu downloads*

🎧 *${currentPrefix}play* / *${currentPrefix}mp3* / *${currentPrefix}ytmp3* / *${currentPrefix}ytaudio* / *${currentPrefix}playaudio*:
Busca música en YouTube y la descarga en audio.

🎬 *${currentPrefix}play2* / *${currentPrefix}mp4* / *${currentPrefix}ytmp4* / *${currentPrefix}ytvideo* / *${currentPrefix}playvideo*:
Busca o descarga videos de YouTube.

🔎 *${currentPrefix}ytsearch* / *${currentPrefix}search*:
Busca videos en YouTube.

🎶 *${currentPrefix}tiktok* / *${currentPrefix}tt*:
Descarga videos de TikTok.

🔍 *${currentPrefix}tiktoksearch* / *${currentPrefix}ttsearch* / *${currentPrefix}tts*:
Busca videos de TikTok.

📸 *${currentPrefix}instagram* / *${currentPrefix}ig*:
Descarga contenido de Instagram.

📘 *${currentPrefix}facebook* / *${currentPrefix}fb*:
Descarga videos de Facebook.

🐦 *${currentPrefix}twitter* / *${currentPrefix}x* / *${currentPrefix}xdl*:
Descarga contenido de Twitter o X.

🌄 *${currentPrefix}imagen* / *${currentPrefix}img* / *${currentPrefix}image*:
Busca imágenes por texto.

📌 *${currentPrefix}pinterest* / *${currentPrefix}pin*:
Busca imágenes en Pinterest.

📁 *${currentPrefix}mediafire* / *${currentPrefix}mf*:
Descarga archivos de MediaFire.

☁️ *${currentPrefix}drive* / *${currentPrefix}gdrive*:
Descarga archivos de Google Drive.

📲 *${currentPrefix}apk* / *${currentPrefix}aptoide* / *${currentPrefix}apkdl*:
Busca y descarga APKs.

👥 *${currentPrefix}wpgrupos* / *${currentPrefix}gruposwa* / *${currentPrefix}wagrupos*:
Busca grupos de WhatsApp.



ꕥ 👤 *PROFILE* — *14 comandos*
> Acceso: *${currentPrefix}menu profile*

👤 *${currentPrefix}profile* / *${currentPrefix}perfil*:
Muestra tu perfil completo.

📊 *${currentPrefix}level* / *${currentPrefix}lvl*:
Muestra tu nivel y experiencia.

🏆 *${currentPrefix}lboard* / *${currentPrefix}lb* / *${currentPrefix}leaderboard*:
Muestra ranking de niveles.

💤 *${currentPrefix}afk*:
Activa estado ausente.

🎂 *${currentPrefix}setbirth*:
Configura tu cumpleaños.

❌ *${currentPrefix}delbirth*:
Elimina tu cumpleaños.

📝 *${currentPrefix}setdescription* / *${currentPrefix}setdesc*:
Configura tu descripción.

🧹 *${currentPrefix}deldescription* / *${currentPrefix}deldesc*:
Elimina tu descripción.

⚥ *${currentPrefix}setgenre*:
Configura tu género.

❌ *${currentPrefix}delgenre*:
Elimina tu género.

🎯 *${currentPrefix}setpasatiempo* / *${currentPrefix}sethobby*:
Configura tu pasatiempo.

🧹 *${currentPrefix}delpasatiempo* / *${currentPrefix}removehobby*:
Elimina tu pasatiempo.

💍 *${currentPrefix}marry* / *${currentPrefix}casarse*:
Propone matrimonio a otro usuario.

💔 *${currentPrefix}divorce*:
Termina tu matrimonio dentro del bot.



ꕥ 🔐 *SOCKETS* — *18 comandos*
> Acceso: *${currentPrefix}menu sockets*

🤖 *${currentPrefix}bots* / *${currentPrefix}sockets*:
Muestra subbots activos.

📱 *${currentPrefix}code* / *${currentPrefix}qr*:
Genera código o QR para vincular subbot.

🔗 *${currentPrefix}join* / *${currentPrefix}unir*:
Hace que el socket entre a un grupo.

🚪 *${currentPrefix}leave*:
Hace que el socket salga del grupo.

🔌 *${currentPrefix}logout*:
Cierra sesión del socket.

♻️ *${currentPrefix}reload*:
Recarga el socket o sistema.

🔒 *${currentPrefix}self*:
Activa o desactiva modo privado.

📝 *${currentPrefix}setname* / *${currentPrefix}setbotname*:
Cambia el nombre del bot.

🔤 *${currentPrefix}setprefix* / *${currentPrefix}setbotprefix*:
Cambia el prefijo del bot.

🖼️ *${currentPrefix}setbanner* / *${currentPrefix}setbotbanner*:
Cambia el banner del bot.

🧩 *${currentPrefix}seticon* / *${currentPrefix}setboticon*:
Cambia el ícono del bot.

🔗 *${currentPrefix}setlink* / *${currentPrefix}setbotlink*:
Cambia el enlace del bot.

📢 *${currentPrefix}setchannel* / *${currentPrefix}setbotchannel*:
Cambia el canal del bot.

💰 *${currentPrefix}setcurrency* / *${currentPrefix}setbotcurrency*:
Cambia el nombre de la moneda.

👑 *${currentPrefix}setowner* / *${currentPrefix}setbotowner*:
Configura el owner del bot.

🖼️ *${currentPrefix}setpfp* / *${currentPrefix}setimage*:
Cambia foto de perfil.

📊 *${currentPrefix}setstatus*:
Cambia el estado del bot.

👤 *${currentPrefix}setusername*:
Cambia el usuario o nombre visible.



ꕥ 🎨 *STICKERS* — *19 comandos*
> Acceso: *${currentPrefix}menu stickers*

🖼️ *${currentPrefix}sticker* / *${currentPrefix}s*:
Convierte imagen o video en sticker.

🧩 *${currentPrefix}s1*:
Crea sticker con método alternativo.

💬 *${currentPrefix}qc*:
Crea sticker tipo quote.

😎 *${currentPrefix}emojimix*:
Combina emojis en sticker.

🍼 *${currentPrefix}brat*:
Crea sticker estilo brat.

🎥 *${currentPrefix}bratv*:
Crea sticker/video estilo brat.

🏷️ *${currentPrefix}stickername* / *${currentPrefix}sname* / *${currentPrefix}sn* / *${currentPrefix}sn1*:
Cambia nombre o autor del sticker.

⚙️ *${currentPrefix}setstickermeta* / *${currentPrefix}setmeta*:
Configura metadata de stickers.

🧹 *${currentPrefix}delmeta* / *${currentPrefix}delstickermeta*:
Elimina metadata personalizada.

📦 *${currentPrefix}getpack* / *${currentPrefix}pack* / *${currentPrefix}stickerpack*:
Muestra o obtiene un pack de stickers.

🆕 *${currentPrefix}newpack* / *${currentPrefix}newstickerpack*:
Crea un nuevo pack de stickers.

📜 *${currentPrefix}packlist* / *${currentPrefix}stickerpacks*:
Lista tus packs de stickers.

🗑️ *${currentPrefix}delpack*:
Elimina un pack.

➕ *${currentPrefix}addsticker* / *${currentPrefix}stickeradd*:
Agrega sticker a un pack.

❌ *${currentPrefix}stickerdel* / *${currentPrefix}delsticker*:
Elimina sticker de un pack.

📝 *${currentPrefix}setstickerpackdesc* / *${currentPrefix}setpackdesc* / *${currentPrefix}packdesc*:
Cambia descripción de un pack.

🏷️ *${currentPrefix}setstickerpackname* / *${currentPrefix}setpackname* / *${currentPrefix}packname*:
Cambia nombre de un pack.

🔒 *${currentPrefix}setpackprivate* / *${currentPrefix}setpackpriv* / *${currentPrefix}packprivate*:
Hace privado un pack.

🌍 *${currentPrefix}setpackpublic* / *${currentPrefix}setpackpub* / *${currentPrefix}packpublic*:
Hace público un pack.



ꕥ 🛠️ *UTILITIES* — *32 comandos*
> Acceso: *${currentPrefix}menu utilities*

📖 *${currentPrefix}readviewonce* / *${currentPrefix}read* / *${currentPrefix}readvo*:
Lee contenido de una sola vista.

📚 *${currentPrefix}resumen*:
Resume textos largos.

🗣️ *${currentPrefix}say* / *${currentPrefix}decir*:
Hace que el bot repita un texto.

🎙️ *${currentPrefix}hablar* / *${currentPrefix}voz* / *${currentPrefix}tts*:
Convierte texto en nota de voz generada por el bot.

🌐 *${currentPrefix}ssweb* / *${currentPrefix}ss*:
Toma captura de una página web.

🔗 *${currentPrefix}tourl*:
Convierte multimedia en enlace.

🌐 *${currentPrefix}get* / *${currentPrefix}fetch*:
Obtiene contenido desde una URL.

🔎 *${currentPrefix}inspect* / *${currentPrefix}inspeccionar*:
Inspecciona enlaces o recursos.

🧬 *${currentPrefix}gitclone* / *${currentPrefix}git*:
Clona o descarga repositorios.

🖼️ *${currentPrefix}toimg* / *${currentPrefix}toimage*:
Convierte sticker a imagen.

🖼️ *${currentPrefix}pfp* / *${currentPrefix}getpic*:
Obtiene foto de perfil.

✨ *${currentPrefix}hd* / *${currentPrefix}enhance* / *${currentPrefix}remini*:
Mejora calidad de imagen.

🤖 *${currentPrefix}ia* / *${currentPrefix}chatgpt*:
Consulta inteligencia artificial.

🧮 *${currentPrefix}calc* / *${currentPrefix}calcular* / *${currentPrefix}math*:
Resuelve cálculos.

🌍 *${currentPrefix}translate* / *${currentPrefix}trad* / *${currentPrefix}traducir*:
Traduce textos.

💌 *${currentPrefix}anonmsg* / *${currentPrefix}anonimo* / *${currentPrefix}anon*:
Envía mensaje anónimo.

🔠 *${currentPrefix}morse*:
Convierte texto a código Morse.

🔡 *${currentPrefix}demorse*:
Convierte Morse a texto.

0️⃣ *${currentPrefix}binary*:
Convierte texto a binario.

1️⃣ *${currentPrefix}unbinary*:
Convierte binario a texto.

🔐 *${currentPrefix}encrypt*:
Encripta texto.

🔓 *${currentPrefix}decrypt*:
Desencripta texto.

🔄 *${currentPrefix}reverse*:
Invierte texto.

🪞 *${currentPrefix}mirror*:
Convierte texto a efecto espejo.

✨ *${currentPrefix}fancy*:
Genera texto decorado.

🔢 *${currentPrefix}count*:
Cuenta caracteres, palabras o texto.

📊 *${currentPrefix}topcmd* / *${currentPrefix}topcommands*:
Muestra comandos más usados.

🕘 *${currentPrefix}historialcmd* / *${currentPrefix}cmdhistory*:
Muestra historial de comandos.

📄 *${currentPrefix}log* / *${currentPrefix}logs*:
Muestra registros del sistema.

⏱️ *${currentPrefix}uptime* / *${currentPrefix}runtime*:
Muestra cuánto tiempo lleva activo el bot.



ꕥ 👥 *GROUP* — *59 comandos*
> Acceso: *${currentPrefix}menu group*

👤 *${currentPrefix}add*:
Agrega un usuario al grupo.

👢 *${currentPrefix}kick*:
Expulsa a un usuario del grupo.

💥 *${currentPrefix}kickall*:
Expulsa usuarios de forma masiva.

👑 *${currentPrefix}promote*:
Da admin a un usuario.

⬇️ *${currentPrefix}demote*:
Quita admin a un usuario.

📌 *${currentPrefix}anclar* / *${currentPrefix}pin*:
Ancla un mensaje importante.

🔗 *${currentPrefix}link*:
Muestra enlace del grupo.

♻️ *${currentPrefix}revoke* / *${currentPrefix}restablecer*:
Restablece el enlace del grupo.

📛 *${currentPrefix}setgpname*:
Cambia nombre del grupo.

📝 *${currentPrefix}setgpdesc*:
Cambia descripción del grupo.

🖼️ *${currentPrefix}setgpbanner*:
Cambia imagen del grupo.

ℹ️ *${currentPrefix}gp* / *${currentPrefix}groupinfo*:
Muestra información del grupo.

🔒 *${currentPrefix}closet* / *${currentPrefix}close* / *${currentPrefix}cerrar*:
Cierra el grupo.

🔓 *${currentPrefix}open* / *${currentPrefix}abrir*:
Abre el grupo.

⭐ *${currentPrefix}setprimary*:
Marca grupo principal.

🙈 *${currentPrefix}hidetag* / *${currentPrefix}tag*:
Menciona a todos ocultamente.

📢 *${currentPrefix}todos* / *${currentPrefix}invocar* / *${currentPrefix}tagall*:
Menciona a todos los miembros.

🧹 *${currentPrefix}delete* / *${currentPrefix}del* / *${currentPrefix}borrar*:
Elimina un mensaje respondido.

🧽 *${currentPrefix}purge* / *${currentPrefix}clearchat*:
Limpia mensajes según el sistema.

🚮 *${currentPrefix}purgeuser* / *${currentPrefix}clearuser* / *${currentPrefix}deluser*:
Limpia mensajes o datos de un usuario.

🤖 *${currentPrefix}bot*:
Activa o desactiva el bot en el grupo.

🚫 *${currentPrefix}ban*:
Banea a un usuario del bot.

✅ *${currentPrefix}unban*:
Quita el ban de un usuario.

ℹ️ *${currentPrefix}baninfo*:
Muestra información del ban de un usuario.

📋 *${currentPrefix}banlist*:
Muestra lista de usuarios baneados.

🛠️ *${currentPrefix}banpanel* / *${currentPrefix}banadmin*:
Panel del owner para permitir ban/unban a admins.

🔇 *${currentPrefix}mute*:
Mutea a un usuario.

🔊 *${currentPrefix}unmute*:
Quita mute a un usuario.

📃 *${currentPrefix}mutelist*:
Muestra lista de muteados.

⏳ *${currentPrefix}mutetime* / *${currentPrefix}tempmute*:
Mutea temporalmente.

⚠️ *${currentPrefix}warn*:
Da advertencia a un usuario.

📋 *${currentPrefix}warns*:
Muestra advertencias de un usuario.

🧹 *${currentPrefix}delwarn*:
Elimina advertencias.

🚧 *${currentPrefix}setwarnlimit*:
Configura límite de advertencias.

🛡️ *${currentPrefix}modconfig* / *${currentPrefix}automodconfig*:
Configura moderación automática.

🚫 *${currentPrefix}antiestado*:
Activa o desactiva antiestados.

🌊 *${currentPrefix}antiflood* / *${currentPrefix}flood*:
Activa o desactiva antiflood.

🖼️ *${currentPrefix}antiimage* / *${currentPrefix}antiimg*:
Bloquea imágenes.

🎬 *${currentPrefix}antivideo*:
Bloquea videos.

🎭 *${currentPrefix}antisticker*:
Bloquea stickers.

🔞 *${currentPrefix}nsfwfilter* / *${currentPrefix}antinsfw*:
Filtra contenido NSFW.

🤬 *${currentPrefix}badwords* / *${currentPrefix}antitoxic* / *${currentPrefix}antigroserias*:
Configura filtro de malas palabras.

🔗 *${currentPrefix}antilink* / *${currentPrefix}antienlaces* / *${currentPrefix}antilinks*:
Activa o desactiva antilinks.

🧷 *${currentPrefix}antilinksoft*:
Activa modo suave de antilinks.

👮 *${currentPrefix}autoadmin*:
Activa sistema de auto admin.

👋 *${currentPrefix}welcome* / *${currentPrefix}bienvenida*:
Activa o desactiva bienvenida.

🚪 *${currentPrefix}goodbye* / *${currentPrefix}despedida*:
Activa o desactiva despedida.

🚨 *${currentPrefix}alerts* / *${currentPrefix}alertas*:
Activa o desactiva alertas.

🔞 *${currentPrefix}nsfw*:
Activa o desactiva NSFW en el grupo.

💰 *${currentPrefix}rpg* / *${currentPrefix}economy* / *${currentPrefix}economia*:
Activa o desactiva economía.

🎴 *${currentPrefix}gacha*:
Activa o desactiva gacha.

👮‍♂️ *${currentPrefix}adminonly* / *${currentPrefix}onlyadmin*:
Solo admins pueden usar comandos.

💬 *${currentPrefix}setwelcome*:
Configura mensaje de bienvenida.

💬 *${currentPrefix}setgoodbye*:
Configura mensaje de despedida.

🔢 *${currentPrefix}count* / *${currentPrefix}mensajes* / *${currentPrefix}messages* / *${currentPrefix}msgcount*:
Cuenta mensajes del grupo.

🏆 *${currentPrefix}topcount* / *${currentPrefix}topmensajes* / *${currentPrefix}topmsgcount* / *${currentPrefix}topmessages*:
Muestra top de mensajes.

😴 *${currentPrefix}topinactive* / *${currentPrefix}topinactivos* / *${currentPrefix}topinactiveusers*:
Muestra usuarios inactivos.

👢 *${currentPrefix}kickinactive* / *${currentPrefix}kickinactivos* / *${currentPrefix}kickinactivepage* / *${currentPrefix}kickinactiveall*:
Expulsa usuarios inactivos.

🌎 *${currentPrefix}kicknum* / *${currentPrefix}kickprefix* / *${currentPrefix}kickcountry*:
Expulsa usuarios por prefijo o país.



ꕥ 🔞 *NSFW* — *37 comandos*
> Acceso: *${currentPrefix}menu nsfw*

🔎 *${currentPrefix}danbooru* / *${currentPrefix}dbooru*:
Busca contenido NSFW en Danbooru.

🔎 *${currentPrefix}gelbooru* / *${currentPrefix}gbooru*:
Busca contenido NSFW en Gelbooru.

🔎 *${currentPrefix}r34* / *${currentPrefix}rule34* / *${currentPrefix}rule*:
Busca contenido en Rule34.

🎥 *${currentPrefix}xnxx*:
Busca o descarga contenido configurado.

🎥 *${currentPrefix}xvideos*:
Busca o descarga contenido configurado.

🍑 *${currentPrefix}anal*:
Ejecuta acción NSFW.

💦 *${currentPrefix}cum*:
Ejecuta acción NSFW.

🔓 *${currentPrefix}undress* / *${currentPrefix}encuerar*:
Ejecuta acción NSFW.

🔥 *${currentPrefix}fuck* / *${currentPrefix}coger*:
Ejecuta acción NSFW.

🍑 *${currentPrefix}spank* / *${currentPrefix}nalgada*:
Ejecuta acción NSFW.

👅 *${currentPrefix}lickpussy*:
Ejecuta acción NSFW.

✊ *${currentPrefix}fap* / *${currentPrefix}paja*:
Ejecuta acción NSFW.

🫳 *${currentPrefix}grope*:
Ejecuta acción NSFW.

6️⃣9️⃣ *${currentPrefix}sixnine* / *${currentPrefix}69*:
Ejecuta acción NSFW.

🍒 *${currentPrefix}suckboobs*:
Ejecuta acción NSFW.

🍒 *${currentPrefix}grabboobs*:
Ejecuta acción NSFW.

💋 *${currentPrefix}blowjob* / *${currentPrefix}mamada* / *${currentPrefix}bj*:
Ejecuta acción NSFW.

🍒 *${currentPrefix}boobjob*:
Ejecuta acción NSFW.

🌸 *${currentPrefix}yuri* / *${currentPrefix}tijeras*:
Ejecuta acción NSFW.

🦶 *${currentPrefix}footjob*:
Ejecuta acción NSFW.

💦 *${currentPrefix}cummouth*:
Ejecuta acción NSFW.

💦 *${currentPrefix}cumshot*:
Ejecuta acción NSFW.

✋ *${currentPrefix}handjob*:
Ejecuta acción NSFW.

👅 *${currentPrefix}lickass*:
Ejecuta acción NSFW.

👅 *${currentPrefix}lickdick*:
Ejecuta acción NSFW.

👉 *${currentPrefix}fingering*:
Ejecuta acción NSFW.

💦 *${currentPrefix}creampie*:
Ejecuta acción NSFW.

🪑 *${currentPrefix}facesitting*:
Ejecuta acción NSFW.

🔥 *${currentPrefix}deepthroat*:
Ejecuta acción NSFW.

🦵 *${currentPrefix}thighjob*:
Ejecuta acción NSFW.

⛓️ *${currentPrefix}bondage*:
Ejecuta acción NSFW.

🔥 *${currentPrefix}pegging*:
Ejecuta acción NSFW.

🔞 *${currentPrefix}futanari* / *${currentPrefix}futa*:
Ejecuta acción NSFW.

🌈 *${currentPrefix}yaoi*:
Ejecuta acción NSFW.

💦 *${currentPrefix}bukkake*:
Ejecuta acción NSFW.

🎉 *${currentPrefix}orgy* / *${currentPrefix}orgia*:
Ejecuta acción NSFW.

💦 *${currentPrefix}squirt* / *${currentPrefix}squirting*:
Ejecuta acción NSFW.



ꕥ 🌌 *ANIME* — *4 comandos*
> Acceso: *${currentPrefix}menu anime*

🌸 *${currentPrefix}waifu*:
Muestra imagen anime de waifu.

🐱 *${currentPrefix}neko*:
Muestra imagen anime de neko.

💞 *${currentPrefix}ppcouple* / *${currentPrefix}ppcp*:
Envía imágenes de perfil para parejas.

🔞 *${currentPrefix}follaragordo*:
Comando extra anime.



ꕥ 💞 *INTERACCIONES* — *67 comandos*
> Acceso: *${currentPrefix}menu interacciones*

🫂 *${currentPrefix}hug* / *${currentPrefix}abrazar*:
Abraza a otro usuario.

💋 *${currentPrefix}kiss* / *${currentPrefix}muak*:
Besa a otro usuario.

😘 *${currentPrefix}kisscheek* / *${currentPrefix}beso* / *${currentPrefix}besar*:
Da un beso en la mejilla.

👋 *${currentPrefix}pat* / *${currentPrefix}acariciar*:
Acaricia a otro usuario.

🤗 *${currentPrefix}cuddle* / *${currentPrefix}acurrucar*:
Se acurruca con otro usuario.

🤗 *${currentPrefix}snuggle* / *${currentPrefix}acurrucarse*:
Se arrima cariñosamente.

😘 *${currentPrefix}blowkiss* / *${currentPrefix}besito*:
Lanza un beso.

🤝 *${currentPrefix}handhold* / *${currentPrefix}tomar*:
Toma la mano de otro usuario.

🙌 *${currentPrefix}highfive* / *${currentPrefix}choca*:
Choca los cinco.

❤️ *${currentPrefix}love* / *${currentPrefix}amor*:
Muestra cariño.

😡 *${currentPrefix}angry* / *${currentPrefix}enojado* / *${currentPrefix}enojada*:
Muestra enojo.

🥱 *${currentPrefix}bored* / *${currentPrefix}aburrido* / *${currentPrefix}aburrida*:
Muestra aburrimiento.

😂 *${currentPrefix}laugh*:
Muestra risa.

😔 *${currentPrefix}sad* / *${currentPrefix}triste*:
Muestra tristeza.

😨 *${currentPrefix}scared* / *${currentPrefix}asustado*:
Muestra miedo.

😳 *${currentPrefix}shy* / *${currentPrefix}timido* / *${currentPrefix}timida*:
Muestra timidez.

😄 *${currentPrefix}happy* / *${currentPrefix}feliz*:
Muestra felicidad.

😊 *${currentPrefix}blush* / *${currentPrefix}sonrojarse*:
Muestra sonrojo.

😊 *${currentPrefix}smile* / *${currentPrefix}sonreir*:
Muestra sonrisa.

😭 *${currentPrefix}cry* / *${currentPrefix}llorar*:
Muestra llanto.

😛 *${currentPrefix}bleh*:
Saca la lengua.

👏 *${currentPrefix}clap* / *${currentPrefix}aplaudir*:
Aplaude.

🎭 *${currentPrefix}dramatic* / *${currentPrefix}drama*:
Hace una reacción dramática.

😗 *${currentPrefix}pout*:
Muestra puchero.

😉 *${currentPrefix}wink* / *${currentPrefix}guiñar*:
Guiña el ojo.

👋 *${currentPrefix}wave* / *${currentPrefix}saludar*:
Saluda.

😏 *${currentPrefix}smug* / *${currentPrefix}presumir*:
Muestra actitud presumida.

😬 *${currentPrefix}cringe*:
Muestra cringe.

🙅 *${currentPrefix}nope* / *${currentPrefix}no*:
Niega algo.

👀 *${currentPrefix}peek*:
Mira de forma curiosa.

👊 *${currentPrefix}punch* / *${currentPrefix}golpear*:
Golpea de forma ficticia.

🔪 *${currentPrefix}kill* / *${currentPrefix}matar*:
Acción ficticia de ataque.

😈 *${currentPrefix}bully* / *${currentPrefix}molestar*:
Molesta a otro usuario.

🦷 *${currentPrefix}bite* / *${currentPrefix}morder*:
Muerde ficticiamente.

🔨 *${currentPrefix}bonk* / *${currentPrefix}golpe*:
Da un bonk.

👅 *${currentPrefix}lick* / *${currentPrefix}lamer*:
Lame de forma ficticia.

🖐️ *${currentPrefix}slap* / *${currentPrefix}bofetada*:
Da una bofetada ficticia.

🖐️ *${currentPrefix}push* / *${currentPrefix}empujar*:
Empuja a otro usuario.

🦶 *${currentPrefix}trip* / *${currentPrefix}tropezar*:
Hace tropezar.

💦 *${currentPrefix}spit* / *${currentPrefix}escupir*:
Escupe ficticiamente.

👣 *${currentPrefix}step* / *${currentPrefix}pisar*:
Pisa ficticiamente.

🤔 *${currentPrefix}think* / *${currentPrefix}pensar*:
Muestra pensamiento.

🤯 *${currentPrefix}thinkhard*:
Piensa intensamente.

🧐 *${currentPrefix}curious* / *${currentPrefix}curioso* / *${currentPrefix}curiosa*:
Muestra curiosidad.

👁️ *${currentPrefix}stare* / *${currentPrefix}mirar*:
Mira fijamente.

👃 *${currentPrefix}sniff* / *${currentPrefix}oler*:
Huele ficticiamente.

🫂 *${currentPrefix}comfort* / *${currentPrefix}consolar*:
Consuela a otro usuario.

🏃 *${currentPrefix}run* / *${currentPrefix}correr*:
Corre.

🚶 *${currentPrefix}walk* / *${currentPrefix}caminar*:
Camina.

💃 *${currentPrefix}dance* / *${currentPrefix}bailar*:
Baila.

🦘 *${currentPrefix}jump* / *${currentPrefix}saltar*:
Salta.

🎮 *${currentPrefix}gaming* / *${currentPrefix}jugar*:
Juega.

🎨 *${currentPrefix}draw* / *${currentPrefix}dibujar*:
Dibuja.

📞 *${currentPrefix}call* / *${currentPrefix}llamar*:
Llama.

🎤 *${currentPrefix}sing* / *${currentPrefix}cantar*:
Canta.

☕ *${currentPrefix}coffee* / *${currentPrefix}cafe*:
Toma café.

🍻 *${currentPrefix}drunk*:
Muestra estado ebrio.

🥶 *${currentPrefix}cold*:
Muestra frío.

😴 *${currentPrefix}sleep* / *${currentPrefix}dormir*:
Duerme.

🚬 *${currentPrefix}smoke* / *${currentPrefix}fumar*:
Fuma ficticiamente.

🍽️ *${currentPrefix}eat* / *${currentPrefix}nom* / *${currentPrefix}comer*:
Come.

🛁 *${currentPrefix}bath* / *${currentPrefix}bañarse*:
Se baña.

🔥 *${currentPrefix}seduce* / *${currentPrefix}seducir*:
Seducción ficticia.

🥵 *${currentPrefix}heat* / *${currentPrefix}calor*:
Muestra calor.

🤰 *${currentPrefix}impregnate* / *${currentPrefix}preg* / *${currentPrefix}preñar* / *${currentPrefix}embarazar*:
Acción especial de interacción.

🤭 *${currentPrefix}tickle* / *${currentPrefix}cosquillas*:
Hace cosquillas.

😱 *${currentPrefix}scream* / *${currentPrefix}gritar*:
Grita.



ꕥ 🎯 *REACTIONS* — *1 comando principal*
> Acceso: *${currentPrefix}menu reactions*

🎯 *${currentPrefix}react* / *${currentPrefix}reacciones*:
Abre el sistema de reacciones.

🏪 *${currentPrefix}react list* / *${currentPrefix}react shop* / *${currentPrefix}react tienda*:
Muestra tienda de reacciones.

💰 *${currentPrefix}react buy* / *${currentPrefix}react comprar*:
Compra una reacción.

🎨 *${currentPrefix}react select*:
Equipa una reacción comprada.

📦 *${currentPrefix}react my* / *${currentPrefix}react coleccion* / *${currentPrefix}react collection*:
Muestra tus reacciones.

❌ *${currentPrefix}react unequip* / *${currentPrefix}react quitar*:
Quita tu reacción activa.
${ownerSection}



        𓆩 🔙 *RETURN* 🔙 𓆪

🏠 *${currentPrefix}menu*:
Regresa al menú principal del bot.

📋 *${currentPrefix}menutotal*:
Vuelve a abrir este panel completo.`

    await client.sendMessage(
      m.chat,
      {
        text: textMenu,
        mentions: [m.sender]
      },
      { quoted: m }
    )
  }
}