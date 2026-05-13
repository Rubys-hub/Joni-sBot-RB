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

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Aquí tienes el *panel completo* de comandos 📋✨



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
        ✨ *Menús públicos:* 12
        ⚡ *Owner:* oculto y exclusivo del propietario



ꕥ 🧩 *MAIN / GENERAL*

🏠 *${currentPrefix}menu*:
Abre el menú principal del bot.

📋 *${currentPrefix}menutotal*:
Muestra este panel completo de comandos.

🤖 *${currentPrefix}infobot* / *${currentPrefix}infosocket*:
Muestra información general del bot o socket.

📨 *${currentPrefix}invite* / *${currentPrefix}invitar*:
Genera o muestra invitación del bot.

⚡ *${currentPrefix}ping* / *${currentPrefix}p*:
Mide la velocidad de respuesta del bot.

📊 *${currentPrefix}status* / *${currentPrefix}estado*:
Muestra el estado actual del sistema.

📝 *${currentPrefix}report* / *${currentPrefix}reporte* / *${currentPrefix}sug* / *${currentPrefix}suggest*:
Envía reportes o sugerencias al owner.



ꕥ 💰 *ECONOMÍA* — *19 comandos*
> Acceso: *${currentPrefix}menu economia*

💳 *${currentPrefix}balance* / *${currentPrefix}bal* / *${currentPrefix}coins* / *${currentPrefix}bank*
🎁 *${currentPrefix}daily* / *${currentPrefix}diario*
💼 *${currentPrefix}work* / *${currentPrefix}w* / *${currentPrefix}chambear* / *${currentPrefix}chamba* / *${currentPrefix}trabajar*
🕵️ *${currentPrefix}crime* / *${currentPrefix}crimen*
💋 *${currentPrefix}slut* / *${currentPrefix}prostituirse*
🎰 *${currentPrefix}slot*
🎲 *${currentPrefix}apostar* / *${currentPrefix}casino*
🪙 *${currentPrefix}coinflip* / *${currentPrefix}cf* / *${currentPrefix}flip*
🏦 *${currentPrefix}deposit* / *${currentPrefix}dep* / *${currentPrefix}depositar* / *${currentPrefix}d*
💸 *${currentPrefix}withdraw* / *${currentPrefix}with* / *${currentPrefix}retirar*
🤝 *${currentPrefix}givecoins* / *${currentPrefix}pay* / *${currentPrefix}coinsgive*
🏆 *${currentPrefix}economyboard* / *${currentPrefix}eboard* / *${currentPrefix}baltop*
ℹ️ *${currentPrefix}infoeconomy* / *${currentPrefix}cooldowns* / *${currentPrefix}economyinfo* / *${currentPrefix}einfo*
💊 *${currentPrefix}heal* / *${currentPrefix}curar*
🏹 *${currentPrefix}hunt* / *${currentPrefix}cazar*
📅 *${currentPrefix}monthly* / *${currentPrefix}mensual*
✊ *${currentPrefix}ppt*
🎟️ *${currentPrefix}canjear*
🎁 *${currentPrefix}code* / *${currentPrefix}codigo* / *${currentPrefix}codigos*



ꕥ 🎴 *GACHA* — *26 comandos*
> Acceso: *${currentPrefix}menu gacha*

🎲 *${currentPrefix}rollwaifu* / *${currentPrefix}rw* / *${currentPrefix}roll*
💖 *${currentPrefix}claim* / *${currentPrefix}c* / *${currentPrefix}reclamar*
📦 *${currentPrefix}harem* / *${currentPrefix}waifus* / *${currentPrefix}claims*
ℹ️ *${currentPrefix}gachainfo* / *${currentPrefix}ginfo* / *${currentPrefix}infogacha*
👤 *${currentPrefix}charinfo* / *${currentPrefix}winfo* / *${currentPrefix}waifuinfo*
🎞️ *${currentPrefix}serieinfo* / *${currentPrefix}ainfo* / *${currentPrefix}animeinfo*
📚 *${currentPrefix}serielist* / *${currentPrefix}slist* / *${currentPrefix}animelist*
🖼️ *${currentPrefix}charimage* / *${currentPrefix}waifuimage* / *${currentPrefix}cimage* / *${currentPrefix}wimage*
🎬 *${currentPrefix}charvideo* / *${currentPrefix}waifuvideo* / *${currentPrefix}cvideo* / *${currentPrefix}wvideo*
🗳️ *${currentPrefix}vote* / *${currentPrefix}votar*
🏆 *${currentPrefix}waifusboard* / *${currentPrefix}waifustop* / *${currentPrefix}topwaifus* / *${currentPrefix}wtop*
⭐ *${currentPrefix}favtop* / *${currentPrefix}favoritetop* / *${currentPrefix}favboard*
💘 *${currentPrefix}setfav* / *${currentPrefix}setfavourite*
❌ *${currentPrefix}deletefav* / *${currentPrefix}delfav*
💰 *${currentPrefix}sell* / *${currentPrefix}vender*
🛒 *${currentPrefix}wshop* / *${currentPrefix}haremshop* / *${currentPrefix}tiendawaifus*
🛍️ *${currentPrefix}buyc* / *${currentPrefix}buycharacter* / *${currentPrefix}buychar*
🚫 *${currentPrefix}removesale* / *${currentPrefix}removerventa*
🎁 *${currentPrefix}givechar* / *${currentPrefix}givewaifu* / *${currentPrefix}regalar*
📤 *${currentPrefix}giveallharem*
🔁 *${currentPrefix}trade* / *${currentPrefix}intercambiar*
✅ *${currentPrefix}aceptar*
🦹 *${currentPrefix}robwaifu* / *${currentPrefix}robarwaifu*
💬 *${currentPrefix}setclaim* / *${currentPrefix}setclaimmsg*
🧹 *${currentPrefix}delclaimmsg* / *${currentPrefix}resetclaimmsg*
🗑️ *${currentPrefix}delchar* / *${currentPrefix}deletewaifu* / *${currentPrefix}delwaifu*



ꕥ 📥 *DOWNLOADS* — *13 comandos*
> Acceso: *${currentPrefix}menu downloads*

🎧 *${currentPrefix}play* / *${currentPrefix}mp3* / *${currentPrefix}ytmp3* / *${currentPrefix}ytaudio* / *${currentPrefix}playaudio*
🎬 *${currentPrefix}play2* / *${currentPrefix}mp4* / *${currentPrefix}ytmp4* / *${currentPrefix}ytvideo* / *${currentPrefix}playvideo*
🔎 *${currentPrefix}ytsearch* / *${currentPrefix}search*
🎶 *${currentPrefix}tiktok* / *${currentPrefix}tt*
🔍 *${currentPrefix}tiktoksearch* / *${currentPrefix}ttsearch* / *${currentPrefix}tts*
📸 *${currentPrefix}instagram* / *${currentPrefix}ig*
📘 *${currentPrefix}facebook* / *${currentPrefix}fb*
🐦 *${currentPrefix}twitter* / *${currentPrefix}x* / *${currentPrefix}xdl*
🌄 *${currentPrefix}imagen* / *${currentPrefix}img* / *${currentPrefix}image*
📌 *${currentPrefix}pinterest* / *${currentPrefix}pin*
📁 *${currentPrefix}mediafire* / *${currentPrefix}mf*
☁️ *${currentPrefix}drive* / *${currentPrefix}gdrive*
📲 *${currentPrefix}apk* / *${currentPrefix}aptoide* / *${currentPrefix}apkdl*
👥 *${currentPrefix}wpgrupos* / *${currentPrefix}gruposwa* / *${currentPrefix}wagrupos*



ꕥ 👤 *PROFILE* — *14 comandos*
> Acceso: *${currentPrefix}menu profile*

👤 *${currentPrefix}profile* / *${currentPrefix}perfil*
📊 *${currentPrefix}level* / *${currentPrefix}lvl*
🏆 *${currentPrefix}lboard* / *${currentPrefix}lb* / *${currentPrefix}leaderboard*
💤 *${currentPrefix}afk*
🎂 *${currentPrefix}setbirth*
❌ *${currentPrefix}delbirth*
📝 *${currentPrefix}setdescription* / *${currentPrefix}setdesc*
🧹 *${currentPrefix}deldescription* / *${currentPrefix}deldesc*
⚥ *${currentPrefix}setgenre*
❌ *${currentPrefix}delgenre*
🎯 *${currentPrefix}setpasatiempo* / *${currentPrefix}sethobby*
🧹 *${currentPrefix}delpasatiempo* / *${currentPrefix}removehobby*
💍 *${currentPrefix}marry* / *${currentPrefix}casarse*
💔 *${currentPrefix}divorce*



ꕥ 🔐 *SOCKETS* — *18 comandos*
> Acceso: *${currentPrefix}menu sockets*

🤖 *${currentPrefix}bots* / *${currentPrefix}sockets*
📱 *${currentPrefix}code* / *${currentPrefix}qr*
🔗 *${currentPrefix}join* / *${currentPrefix}unir*
🚪 *${currentPrefix}leave*
🔌 *${currentPrefix}logout*
♻️ *${currentPrefix}reload*
🔒 *${currentPrefix}self*
📝 *${currentPrefix}setname* / *${currentPrefix}setbotname*
🔤 *${currentPrefix}setprefix* / *${currentPrefix}setbotprefix*
🖼️ *${currentPrefix}setbanner* / *${currentPrefix}setbotbanner*
🧩 *${currentPrefix}seticon* / *${currentPrefix}setboticon*
🔗 *${currentPrefix}setlink* / *${currentPrefix}setbotlink*
📢 *${currentPrefix}setchannel* / *${currentPrefix}setbotchannel*
💰 *${currentPrefix}setcurrency* / *${currentPrefix}setbotcurrency*
👑 *${currentPrefix}setowner* / *${currentPrefix}setbotowner*
🖼️ *${currentPrefix}setpfp* / *${currentPrefix}setimage*
📊 *${currentPrefix}setstatus*
👤 *${currentPrefix}setusername*



ꕥ 🎨 *STICKERS* — *19 comandos*
> Acceso: *${currentPrefix}menu stickers*

🖼️ *${currentPrefix}sticker* / *${currentPrefix}s*
🧩 *${currentPrefix}s1*
🏷️ *${currentPrefix}stickername* / *${currentPrefix}sname* / *${currentPrefix}sn* / *${currentPrefix}sn1*
💬 *${currentPrefix}qc*
😎 *${currentPrefix}emojimix*
🍼 *${currentPrefix}brat*
🎥 *${currentPrefix}bratv*
➕ *${currentPrefix}addsticker* / *${currentPrefix}stickeradd*
❌ *${currentPrefix}stickerdel* / *${currentPrefix}delsticker*
📦 *${currentPrefix}getpack* / *${currentPrefix}pack* / *${currentPrefix}stickerpack*
🆕 *${currentPrefix}newpack* / *${currentPrefix}newstickerpack*
📜 *${currentPrefix}packlist* / *${currentPrefix}stickerpacks*
🗑️ *${currentPrefix}delpack*
🧹 *${currentPrefix}delmeta* / *${currentPrefix}delstickermeta*
⚙️ *${currentPrefix}setstickermeta* / *${currentPrefix}setmeta*
📝 *${currentPrefix}setstickerpackdesc* / *${currentPrefix}setpackdesc* / *${currentPrefix}packdesc*
🏷️ *${currentPrefix}setstickerpackname* / *${currentPrefix}setpackname* / *${currentPrefix}packname*
🔒 *${currentPrefix}setpackprivate* / *${currentPrefix}setpackpriv* / *${currentPrefix}packprivate*
🌍 *${currentPrefix}setpackpublic* / *${currentPrefix}setpackpub* / *${currentPrefix}packpublic*



ꕥ 🛠️ *UTILITIES* — *31 comandos*
> Acceso: *${currentPrefix}menu utilities*

📖 *${currentPrefix}readviewonce* / *${currentPrefix}read* / *${currentPrefix}readvo*
📚 *${currentPrefix}resumen*
🗣️ *${currentPrefix}say* / *${currentPrefix}decir*
🆓 *${currentPrefix}sf* / *${currentPrefix}stickfree* / *${currentPrefix}sf1*
🌐 *${currentPrefix}ssweb* / *${currentPrefix}ss*
🔠 *${currentPrefix}morse*
🔡 *${currentPrefix}demorse*
0️⃣ *${currentPrefix}binary*
1️⃣ *${currentPrefix}unbinary*
🔐 *${currentPrefix}encrypt*
🔓 *${currentPrefix}decrypt*
🔄 *${currentPrefix}reverse*
🪞 *${currentPrefix}mirror*
✨ *${currentPrefix}fancy*
🔢 *${currentPrefix}count*
🎲 *${currentPrefix}random*
📐 *${currentPrefix}format*
🖼️ *${currentPrefix}toimg* / *${currentPrefix}toimage*
🏆 *${currentPrefix}topcmd* / *${currentPrefix}topcommands*
🔗 *${currentPrefix}tourl*
🌍 *${currentPrefix}translate* / *${currentPrefix}trad* / *${currentPrefix}traducir*
💌 *${currentPrefix}anonmsg* / *${currentPrefix}anonimo* / *${currentPrefix}anon*
🧮 *${currentPrefix}calc* / *${currentPrefix}calcular* / *${currentPrefix}math*
🤖 *${currentPrefix}ia* / *${currentPrefix}chatgpt*
🌐 *${currentPrefix}get* / *${currentPrefix}fetch*
🖼️ *${currentPrefix}pfp* / *${currentPrefix}getpic*
🧬 *${currentPrefix}gitclone* / *${currentPrefix}git*
✨ *${currentPrefix}hd* / *${currentPrefix}enhance* / *${currentPrefix}remini*
🕘 *${currentPrefix}historialcmd* / *${currentPrefix}cmdhistory*
🔎 *${currentPrefix}inspect* / *${currentPrefix}inspeccionar*
📄 *${currentPrefix}log* / *${currentPrefix}logs*
⏱️ *${currentPrefix}uptime* / *${currentPrefix}runtime*



ꕥ 👥 *GROUP* — *54 comandos*
> Acceso: *${currentPrefix}menu group*

👤 *${currentPrefix}add*
👢 *${currentPrefix}kick*
💥 *${currentPrefix}kickall*
👑 *${currentPrefix}promote*
⬇️ *${currentPrefix}demote*
📌 *${currentPrefix}anclar* / *${currentPrefix}pin*
🔗 *${currentPrefix}link*
♻️ *${currentPrefix}revoke* / *${currentPrefix}restablecer*
📛 *${currentPrefix}setgpname*
📝 *${currentPrefix}setgpdesc*
🖼️ *${currentPrefix}setgpbanner*
ℹ️ *${currentPrefix}gp* / *${currentPrefix}groupinfo*
🙈 *${currentPrefix}hidetag* / *${currentPrefix}tag*
📢 *${currentPrefix}todos* / *${currentPrefix}invocar* / *${currentPrefix}tagall*
🔇 *${currentPrefix}mute*
🔊 *${currentPrefix}unmute*
📃 *${currentPrefix}mutelist*
⏳ *${currentPrefix}mutetime* / *${currentPrefix}tempmute*
🧹 *${currentPrefix}delete* / *${currentPrefix}del* / *${currentPrefix}borrar*
🧽 *${currentPrefix}purge* / *${currentPrefix}clearchat*
🚮 *${currentPrefix}purgeuser* / *${currentPrefix}clearuser* / *${currentPrefix}deluser*
⚠️ *${currentPrefix}warn*
📋 *${currentPrefix}warns*
🧹 *${currentPrefix}delwarn*
🚧 *${currentPrefix}setwarnlimit*
🔒 *${currentPrefix}closet* / *${currentPrefix}close* / *${currentPrefix}cerrar*
🔓 *${currentPrefix}open* / *${currentPrefix}abrir*
🤖 *${currentPrefix}bot*
🛡️ *${currentPrefix}modconfig* / *${currentPrefix}automodconfig*
🚫 *${currentPrefix}antiestado*
🌊 *${currentPrefix}antiflood* / *${currentPrefix}flood*
🖼️ *${currentPrefix}antiimage* / *${currentPrefix}antiimg*
🔞 *${currentPrefix}nsfwfilter* / *${currentPrefix}antinsfw*
🎭 *${currentPrefix}antisticker*
🎬 *${currentPrefix}antivideo*
🤬 *${currentPrefix}badwords* / *${currentPrefix}antitoxic* / *${currentPrefix}antigroserias*
🔗 *${currentPrefix}antilink* / *${currentPrefix}antienlaces* / *${currentPrefix}antilinks*
🧷 *${currentPrefix}antilinksoft*
👮 *${currentPrefix}autoadmin*
👋 *${currentPrefix}welcome* / *${currentPrefix}bienvenida*
🚪 *${currentPrefix}goodbye* / *${currentPrefix}despedida*
🚨 *${currentPrefix}alerts* / *${currentPrefix}alertas*
🔞 *${currentPrefix}nsfw*
💰 *${currentPrefix}rpg* / *${currentPrefix}economy* / *${currentPrefix}economia*
🎴 *${currentPrefix}gacha*
👮‍♂️ *${currentPrefix}adminonly* / *${currentPrefix}onlyadmin*
💬 *${currentPrefix}setwelcome*
💬 *${currentPrefix}setgoodbye*
⭐ *${currentPrefix}setprimary*
🔢 *${currentPrefix}count* / *${currentPrefix}mensajes* / *${currentPrefix}messages* / *${currentPrefix}msgcount*
🏆 *${currentPrefix}topcount* / *${currentPrefix}topmensajes* / *${currentPrefix}topmsgcount* / *${currentPrefix}topmessages*
😴 *${currentPrefix}topinactive* / *${currentPrefix}topinactivos* / *${currentPrefix}topinactiveusers*
👢 *${currentPrefix}kickinactive* / *${currentPrefix}kickinactivos* / *${currentPrefix}kickinactivepage* / *${currentPrefix}kickinactiveall*
🌎 *${currentPrefix}kicknum* / *${currentPrefix}kickprefix* / *${currentPrefix}kickcountry*



ꕥ 🔞 *NSFW* — *37 comandos*
> Acceso: *${currentPrefix}menu nsfw*

🔎 *${currentPrefix}danbooru* / *${currentPrefix}dbooru*
🔎 *${currentPrefix}gelbooru* / *${currentPrefix}gbooru*
🔎 *${currentPrefix}r34* / *${currentPrefix}rule34* / *${currentPrefix}rule*
🎥 *${currentPrefix}xnxx*
🎥 *${currentPrefix}xvideos*
🍑 *${currentPrefix}anal*
💦 *${currentPrefix}cum*
🔓 *${currentPrefix}undress* / *${currentPrefix}encuerar*
🔥 *${currentPrefix}fuck* / *${currentPrefix}coger*
🍑 *${currentPrefix}spank* / *${currentPrefix}nalgada*
👅 *${currentPrefix}lickpussy*
✊ *${currentPrefix}fap* / *${currentPrefix}paja*
🫳 *${currentPrefix}grope*
6️⃣9️⃣ *${currentPrefix}sixnine* / *${currentPrefix}69*
🍒 *${currentPrefix}suckboobs*
🍒 *${currentPrefix}grabboobs*
💋 *${currentPrefix}blowjob* / *${currentPrefix}mamada* / *${currentPrefix}bj*
🍒 *${currentPrefix}boobjob*
🌸 *${currentPrefix}yuri* / *${currentPrefix}tijeras*
🦶 *${currentPrefix}footjob*
💦 *${currentPrefix}cummouth*
💦 *${currentPrefix}cumshot*
✋ *${currentPrefix}handjob*
👅 *${currentPrefix}lickass*
👅 *${currentPrefix}lickdick*
👉 *${currentPrefix}fingering*
💦 *${currentPrefix}creampie*
🪑 *${currentPrefix}facesitting*
🔥 *${currentPrefix}deepthroat*
🦵 *${currentPrefix}thighjob*
⛓️ *${currentPrefix}bondage*
🔥 *${currentPrefix}pegging*
🔞 *${currentPrefix}futanari* / *${currentPrefix}futa*
🌈 *${currentPrefix}yaoi*
💦 *${currentPrefix}bukkake*
🎉 *${currentPrefix}orgy* / *${currentPrefix}orgia*
💦 *${currentPrefix}squirt* / *${currentPrefix}squirting*



ꕥ 🌌 *ANIME* — *3 comandos*
> Acceso: *${currentPrefix}menu anime*

💞 *${currentPrefix}ppcp* / *${currentPrefix}ppcouple*
🌸 *${currentPrefix}waifu*
🐱 *${currentPrefix}neko*



ꕥ 💞 *INTERACCIONES* — *67 comandos*
> Acceso: *${currentPrefix}menu interacciones*

😡 *${currentPrefix}angry* / *${currentPrefix}enojado* / *${currentPrefix}enojada*
😛 *${currentPrefix}bleh*
🥱 *${currentPrefix}bored* / *${currentPrefix}aburrido* / *${currentPrefix}aburrida*
👏 *${currentPrefix}clap* / *${currentPrefix}aplaudir*
☕ *${currentPrefix}coffee* / *${currentPrefix}cafe*
🎭 *${currentPrefix}dramatic* / *${currentPrefix}drama*
🍻 *${currentPrefix}drunk*
🥶 *${currentPrefix}cold*
🤰 *${currentPrefix}impregnate* / *${currentPrefix}preg* / *${currentPrefix}preñar* / *${currentPrefix}embarazar*
😘 *${currentPrefix}kisscheek* / *${currentPrefix}beso* / *${currentPrefix}besar*
😂 *${currentPrefix}laugh*
❤️ *${currentPrefix}love* / *${currentPrefix}amor*
😗 *${currentPrefix}pout*
👊 *${currentPrefix}punch* / *${currentPrefix}golpear*
🏃 *${currentPrefix}run* / *${currentPrefix}correr*
😔 *${currentPrefix}sad* / *${currentPrefix}triste*
😨 *${currentPrefix}scared* / *${currentPrefix}asustado*
🔥 *${currentPrefix}seduce* / *${currentPrefix}seducir*
😳 *${currentPrefix}shy* / *${currentPrefix}timido* / *${currentPrefix}timida*
😴 *${currentPrefix}sleep* / *${currentPrefix}dormir*
🚬 *${currentPrefix}smoke* / *${currentPrefix}fumar*
💦 *${currentPrefix}spit* / *${currentPrefix}escupir*
👣 *${currentPrefix}step* / *${currentPrefix}pisar*
🤔 *${currentPrefix}think* / *${currentPrefix}pensar*
🚶 *${currentPrefix}walk* / *${currentPrefix}caminar*
🫂 *${currentPrefix}hug* / *${currentPrefix}abrazar*
🔪 *${currentPrefix}kill* / *${currentPrefix}matar*
🍽️ *${currentPrefix}eat* / *${currentPrefix}nom* / *${currentPrefix}comer*
💋 *${currentPrefix}kiss* / *${currentPrefix}muak*
😉 *${currentPrefix}wink* / *${currentPrefix}guiñar*
👋 *${currentPrefix}pat* / *${currentPrefix}acariciar*
😄 *${currentPrefix}happy* / *${currentPrefix}feliz*
😈 *${currentPrefix}bully* / *${currentPrefix}molestar*
🦷 *${currentPrefix}bite* / *${currentPrefix}morder*
😊 *${currentPrefix}blush* / *${currentPrefix}sonrojarse*
👋 *${currentPrefix}wave* / *${currentPrefix}saludar*
🛁 *${currentPrefix}bath* / *${currentPrefix}bañarse*
😏 *${currentPrefix}smug* / *${currentPrefix}presumir*
😊 *${currentPrefix}smile* / *${currentPrefix}sonreir*
🙌 *${currentPrefix}highfive* / *${currentPrefix}choca*
🤝 *${currentPrefix}handhold* / *${currentPrefix}tomar*
😬 *${currentPrefix}cringe*
🔨 *${currentPrefix}bonk* / *${currentPrefix}golpe*
😭 *${currentPrefix}cry* / *${currentPrefix}llorar*
👅 *${currentPrefix}lick* / *${currentPrefix}lamer*
🖐️ *${currentPrefix}slap* / *${currentPrefix}bofetada*
💃 *${currentPrefix}dance* / *${currentPrefix}bailar*
🤗 *${currentPrefix}cuddle* / *${currentPrefix}acurrucar*
🎤 *${currentPrefix}sing* / *${currentPrefix}cantar*
🤭 *${currentPrefix}tickle* / *${currentPrefix}cosquillas*
😱 *${currentPrefix}scream* / *${currentPrefix}gritar*
🖐️ *${currentPrefix}push* / *${currentPrefix}empujar*
🙅 *${currentPrefix}nope* / *${currentPrefix}no*
🦘 *${currentPrefix}jump* / *${currentPrefix}saltar*
🥵 *${currentPrefix}heat* / *${currentPrefix}calor*
🎮 *${currentPrefix}gaming* / *${currentPrefix}jugar*
🎨 *${currentPrefix}draw* / *${currentPrefix}dibujar*
📞 *${currentPrefix}call* / *${currentPrefix}llamar*
🤗 *${currentPrefix}snuggle* / *${currentPrefix}acurrucarse*
😘 *${currentPrefix}blowkiss* / *${currentPrefix}besito*
🦶 *${currentPrefix}trip* / *${currentPrefix}tropezar*
👁️ *${currentPrefix}stare* / *${currentPrefix}mirar*
👃 *${currentPrefix}sniff* / *${currentPrefix}oler*
🧐 *${currentPrefix}curious* / *${currentPrefix}curioso* / *${currentPrefix}curiosa*
🤯 *${currentPrefix}thinkhard*
🫂 *${currentPrefix}comfort* / *${currentPrefix}consolar*
👀 *${currentPrefix}peek*



ꕥ 🎯 *REACTIONS* — *2 comandos*
> Acceso: *${currentPrefix}menu reactions*

💫 *${currentPrefix}react* / *${currentPrefix}reacciones*
🧪 *${currentPrefix}holabotones*



        𓆩 🔙 *RETURN* 🔙 𓆪

🏠 *${currentPrefix}menu*:
Regresa al menú principal del bot.

📋 *${currentPrefix}menutotal*:
Vuelve a abrir el panel completo.`

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