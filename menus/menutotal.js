export default {
  command: ['menutotal', 'allmenu', 'menucompleto'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Aquí tienes el *panel completo* de categorías disponibles

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│✿ *OWNER ::* RubyJX
│ꕥ *TYPE ::* MAIN SYSTEM
│⸙ *VERSION ::* ^3.0 - Latest
│⚘ *DEVICE ::* ACTIVE
│○ *STATUS ::* ONLINE
│𓏸 *MODE ::* FULL MENU ACCESS
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 💰 ECONOMY 〕────────────╮
│ ✦ *Comandos:* 26
│ ✦ *Acceso:* ${currentPrefix}menu economia
│
│ 📌 *Incluye:*
│ ${currentPrefix}work
│ ${currentPrefix}balance
│ ${currentPrefix}daily
│ ${currentPrefix}deposit
│ ${currentPrefix}withdraw
│ ${currentPrefix}coinflip
│ ${currentPrefix}casino
│ ${currentPrefix}roulette
│ ${currentPrefix}givecoins
│ ${currentPrefix}steal
│ ${currentPrefix}adventure
│ ${currentPrefix}heal
│ ${currentPrefix}hunt
│ ${currentPrefix}fish
│ ${currentPrefix}mine
│ ${currentPrefix}cofre
│ ${currentPrefix}weekly
│ ${currentPrefix}monthly
│ ${currentPrefix}dungeon
│ ${currentPrefix}math
│ ${currentPrefix}ppt
│ ${currentPrefix}economyboard
│ ${currentPrefix}economyinfo
╰───────────────────────────────────────╯

╭────────────〔 🎴 GACHA 〕────────────╮
│ ✦ *Comandos:* 21
│ ✦ *Acceso:* ${currentPrefix}menu gacha
│
│ 📌 *Incluye:*
│ ${currentPrefix}buycharacter
│ ${currentPrefix}charimage
│ ${currentPrefix}charinfo
│ ${currentPrefix}claim
│ ${currentPrefix}delclaimmsg
│ ${currentPrefix}deletewaifu
│ ${currentPrefix}favoritetop
│ ${currentPrefix}gachainfo
│ ${currentPrefix}giveallharem
│ ${currentPrefix}givechar
│ ${currentPrefix}harem
│ ${currentPrefix}haremshop
│ ${currentPrefix}removesale
│ ${currentPrefix}rollwaifu
│ ${currentPrefix}sell
│ ${currentPrefix}serieinfo
│ ${currentPrefix}serielist
│ ${currentPrefix}setclaimmsg
│ ${currentPrefix}setfavourite
│ ${currentPrefix}trade
│ ${currentPrefix}vote
│ ${currentPrefix}waifusboard
╰──────────────────────────────────────╯

╭────────────〔 ⬇️ DOWNLOADS 〕────────────╮
│ ✦ *Comandos:* 12
│ ✦ *Acceso:* ${currentPrefix}menu downloads
│
│ 📌 *Incluye:*
│ ${currentPrefix}facebook
│ ${currentPrefix}mediafire
│ ${currentPrefix}play
│ ${currentPrefix}play2
│ ${currentPrefix}pinterest
│ ${currentPrefix}instagram
│ ${currentPrefix}tiktok
│ ${currentPrefix}twitter
│ ${currentPrefix}ytsearch
│ ${currentPrefix}wagrupos
│ ${currentPrefix}imagen
│ ${currentPrefix}apk
╰─────────────────────────────────────────╯

╭────────────〔 👤 PROFILES 〕────────────╮
│ ✦ *Comandos:* 15
│ ✦ *Acceso:* ${currentPrefix}menu profile
│
│ 📌 *Incluye:*
│ ${currentPrefix}profile
│ ${currentPrefix}leaderboard
│ ${currentPrefix}level
│ ${currentPrefix}setgenre
│ ${currentPrefix}delgenre
│ ${currentPrefix}setbirth
│ ${currentPrefix}delbirth
│ ${currentPrefix}setdescription
│ ${currentPrefix}deldescription
│ ${currentPrefix}marry
│ ${currentPrefix}divorce
│ ${currentPrefix}setfavourite
│ ${currentPrefix}deletefav
│ ${currentPrefix}setpasatiempo
│ ${currentPrefix}delpasatiempo
╰────────────────────────────────────────╯

╭────────────〔 🔐 SOCKETS 〕────────────╮
│ ✦ *Comandos:* 18
│ ✦ *Acceso:* ${currentPrefix}menu sockets
│
│ 📌 *Incluye:*
│ ${currentPrefix}bots
│ ${currentPrefix}join
│ ${currentPrefix}leave
│ ${currentPrefix}logout
│ ${currentPrefix}self
│ ${currentPrefix}qr
│ ${currentPrefix}code
│ ${currentPrefix}reload
│ ${currentPrefix}setname
│ ${currentPrefix}setbanner
│ ${currentPrefix}seticon
│ ${currentPrefix}setprefix
│ ${currentPrefix}setcurrency
│ ${currentPrefix}setowner
│ ${currentPrefix}setchannel
│ ${currentPrefix}setlink
│ ${currentPrefix}setpfp
│ ${currentPrefix}setstatus
│ ${currentPrefix}setusername
│
│ ⚠ *Nota:*
│ La mayoría de estos comandos son solo para owner
│ o propietario del socket.
╰───────────────────────────────────────╯

╭────────────〔 🎨 STICKERS 〕────────────╮
│ ✦ *Comandos:* 15
│ ✦ *Acceso:* ${currentPrefix}menu stickers
│
│ 📌 *Incluye:*
│ ${currentPrefix}stickerpack
│ ${currentPrefix}delpack
│ ${currentPrefix}delstickermeta
│ ${currentPrefix}getpack
│ ${currentPrefix}newpack
│ ${currentPrefix}setpackprivate
│ ${currentPrefix}setpackpublic
│ ${currentPrefix}setstickermeta
│ ${currentPrefix}sticker
│ ${currentPrefix}setstickerpackdesc
│ ${currentPrefix}setstickerpackname
│ ${currentPrefix}stickeradd
│ ${currentPrefix}stickerdel
│ ${currentPrefix}stickerpacks
│ ${currentPrefix}brat
│ ${currentPrefix}qc
│ ${currentPrefix}emojimix
╰────────────────────────────────────────╯

╭────────────〔 🛠️ UTILITIES 〕────────────╮
│ ✦ *Comandos:* 13
│ ✦ *Acceso:* ${currentPrefix}menu utils
│
│ 📌 *Incluye:*
│ ${currentPrefix}menu
│ ${currentPrefix}help
│ ${currentPrefix}chatgpt
│ ${currentPrefix}getpic
│ ${currentPrefix}say
│ ${currentPrefix}get
│ ${currentPrefix}translate
│ ${currentPrefix}tourl
│ ${currentPrefix}toimg
│ ${currentPrefix}read
│ ${currentPrefix}inspect
│ ${currentPrefix}hd
│ ${currentPrefix}gitclone
│ ${currentPrefix}ssweb
│ ${currentPrefix}sug
│ ${currentPrefix}report
╰─────────────────────────────────────────╯

╭────────────〔 👥 GROUPS 〕────────────╮
│ ✦ *Comandos:* 18
│ ✦ *Acceso:* ${currentPrefix}menu grupo
│
│ 📌 *Incluye:*
│ ${currentPrefix}alerts
│ ${currentPrefix}antilinks
│ ${currentPrefix}bot
│ ${currentPrefix}close
│ ${currentPrefix}gp
│ ${currentPrefix}delwarn
│ ${currentPrefix}demote
│ ${currentPrefix}economy
│ ${currentPrefix}gacha
│ ${currentPrefix}goodbye
│ ${currentPrefix}setgpbanner
│ ${currentPrefix}setgpname
│ ${currentPrefix}setgpdesc
│ ${currentPrefix}kick
│ ${currentPrefix}nsfw
│ ${currentPrefix}adminonly
│ ${currentPrefix}open
│ ${currentPrefix}promote
│ ${currentPrefix}setgoodbye
│ ${currentPrefix}setprimary
│ ${currentPrefix}setwarnlimit
│ ${currentPrefix}setwelcome
│ ${currentPrefix}tagall
│ ${currentPrefix}msgcount
│ ${currentPrefix}topcount
│ ${currentPrefix}topinactive
│ ${currentPrefix}warn
│ ${currentPrefix}warns
│ ${currentPrefix}welcome
│ ${currentPrefix}link
╰───────────────────────────────────────╯

╭────────────〔 🔞 NSFW 〕────────────╮
│ ✦ *Comandos:* 38
│ ✦ *Acceso:* ${currentPrefix}menu nsfw
│
│ 📌 *Incluye:*
│ ${currentPrefix}xnxx
│ ${currentPrefix}xvideos
│ ${currentPrefix}danbooru
│ ${currentPrefix}gelbooru
│ ${currentPrefix}rule34
│ ${currentPrefix}anal
│ ${currentPrefix}blowjob
│ ${currentPrefix}boobjob
│ ${currentPrefix}bondage
│ ${currentPrefix}bukkake
│ ${currentPrefix}cum
│ ${currentPrefix}cummouth
│ ${currentPrefix}cumshot
│ ${currentPrefix}creampie
│ ${currentPrefix}deepthroat
│ ${currentPrefix}facesitting
│ ${currentPrefix}fap
│ ${currentPrefix}fingering
│ ${currentPrefix}footjob
│ ${currentPrefix}fuck
│ ${currentPrefix}futanari
│ ${currentPrefix}grabboobs
│ ${currentPrefix}grope
│ ${currentPrefix}handjob
│ ${currentPrefix}lickass
│ ${currentPrefix}lickdick
│ ${currentPrefix}lickpussy
│ ${currentPrefix}orgy
│ ${currentPrefix}pegging
│ ${currentPrefix}sixnine
│ ${currentPrefix}spank
│ ${currentPrefix}squirt
│ ${currentPrefix}suckboobs
│ ${currentPrefix}thighjob
│ ${currentPrefix}undress
│ ${currentPrefix}yaoi
│ ${currentPrefix}yuri
╰──────────────────────────────────────╯

╭────────────〔 🌌 ANIME 〕────────────╮
│ ✦ *Comandos:* 69
│ ✦ *Acceso:* ${currentPrefix}menu anime
│
│ 📌 *Incluye:*
│ ${currentPrefix}waifu
│ ${currentPrefix}ppcouple
│ ${currentPrefix}peek
│ ${currentPrefix}comfort
│ ${currentPrefix}thinkhard
│ ${currentPrefix}curious
│ ${currentPrefix}sniff
│ ${currentPrefix}stare
│ ${currentPrefix}trip
│ ${currentPrefix}blowkiss
│ ${currentPrefix}snuggle
│ ${currentPrefix}angry
│ ${currentPrefix}bleh
│ ${currentPrefix}bored
│ ${currentPrefix}clap
│ ${currentPrefix}coffee
│ ${currentPrefix}cold
│ ${currentPrefix}sing
│ ${currentPrefix}tickle
│ ${currentPrefix}scream
│ ${currentPrefix}push
│ ${currentPrefix}nope
│ ${currentPrefix}jump
│ ${currentPrefix}heat
│ ${currentPrefix}gaming
│ ${currentPrefix}draw
│ ${currentPrefix}call
│ ${currentPrefix}dramatic
│ ${currentPrefix}drunk
│ ${currentPrefix}impregnate
│ ${currentPrefix}kisscheek
│ ${currentPrefix}laugh
│ ${currentPrefix}love
│ ${currentPrefix}pout
│ ${currentPrefix}punch
│ ${currentPrefix}run
│ ${currentPrefix}sad
│ ${currentPrefix}scared
│ ${currentPrefix}seduce
│ ${currentPrefix}shy
│ ${currentPrefix}sleep
│ ${currentPrefix}smoke
│ ${currentPrefix}spit
│ ${currentPrefix}step
│ ${currentPrefix}think
│ ${currentPrefix}walk
│ ${currentPrefix}hug
│ ${currentPrefix}kill
│ ${currentPrefix}eat
│ ${currentPrefix}kiss
│ ${currentPrefix}wink
│ ${currentPrefix}pat
│ ${currentPrefix}happy
│ ${currentPrefix}bully
│ ${currentPrefix}bite
│ ${currentPrefix}blush
│ ${currentPrefix}wave
│ ${currentPrefix}bath
│ ${currentPrefix}smug
│ ${currentPrefix}smile
│ ${currentPrefix}highfive
│ ${currentPrefix}handhold
│ ${currentPrefix}cringe
│ ${currentPrefix}bonk
│ ${currentPrefix}cry
│ ${currentPrefix}lick
│ ${currentPrefix}slap
│ ${currentPrefix}dance
│ ${currentPrefix}cuddle
╰──────────────────────────────────────╯

╭────────────〔 📌 ACCESS GUIDE 〕────────────╮
│ ✦ *Abrir por nombre*
│   ${currentPrefix}menu economia
│   ${currentPrefix}menu gacha
│   ${currentPrefix}menu downloads
│   ${currentPrefix}menu profile
│   ${currentPrefix}menu sockets
│   ${currentPrefix}menu stickers
│   ${currentPrefix}menu utils
│   ${currentPrefix}menu grupo
│   ${currentPrefix}menu nsfw
│   ${currentPrefix}menu anime
│
│ ✦ *Abrir por número*
│   ${currentPrefix}menu 1
│   ${currentPrefix}menu 2
│   ${currentPrefix}menu 3
│   ${currentPrefix}menu 4
│   ${currentPrefix}menu 5
│   ${currentPrefix}menu 6
│   ${currentPrefix}menu 7
│   ${currentPrefix}menu 8
│   ${currentPrefix}menu 9
│   ${currentPrefix}menu 10
╰─────────────────────────────────────────────╯

╭────────────〔 💡 EXTRA 〕────────────╮
│ ✦ *Volver al panel principal*
│   ${currentPrefix}menu
│
│ ✦ *Abrir menú completo*
│   ${currentPrefix}menutotal
│
│ ✦ *Consejo*
│   Usa el nombre o número de categoría
│   para entrar más rápido al menú deseado.
╰─────────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}