export default {
  command: ['menunsfw', 'nsfwmenu'],
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
> Accediste al sistema *NSFW* 🔞✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *N S F W* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: NSFW SYSTEM 🔞
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🔞 *NSFW SYSTEM* 🔞 𓆪
        ✨ *Total disponible:* 37 comandos
        ⚡ *Modo:* búsquedas y acciones NSFW
        ⚠️ *Nota:* requiere tener NSFW activo en el grupo



ꕥ 🔎 *BÚSQUEDAS NSFW*

🔎 *${currentPrefix}danbooru* / *${currentPrefix}dbooru*:
Busca contenido NSFW desde Danbooru según el texto indicado.

🔎 *${currentPrefix}gelbooru* / *${currentPrefix}gbooru*:
Busca contenido NSFW desde Gelbooru usando etiquetas o palabras clave.

🔎 *${currentPrefix}r34* / *${currentPrefix}rule34* / *${currentPrefix}rule*:
Busca contenido NSFW desde Rule34 usando una palabra o etiqueta.

🎥 *${currentPrefix}xnxx*:
Busca o descarga contenido desde la plataforma configurada en el comando.

🎥 *${currentPrefix}xvideos*:
Busca o descarga contenido desde la plataforma configurada en el comando.



ꕥ 🔥 *ACCIONES NSFW*

🍑 *${currentPrefix}anal*:
Ejecuta una acción NSFW dentro del chat.

💦 *${currentPrefix}cum*:
Ejecuta una acción NSFW dentro del chat.

🔓 *${currentPrefix}undress* / *${currentPrefix}encuerar*:
Ejecuta una acción NSFW dentro del chat.

🔥 *${currentPrefix}fuck* / *${currentPrefix}coger*:
Ejecuta una acción NSFW dentro del chat.

🍑 *${currentPrefix}spank* / *${currentPrefix}nalgada*:
Ejecuta una acción NSFW dentro del chat.

👅 *${currentPrefix}lickpussy*:
Ejecuta una acción NSFW dentro del chat.

✊ *${currentPrefix}fap* / *${currentPrefix}paja*:
Ejecuta una acción NSFW dentro del chat.

🫳 *${currentPrefix}grope*:
Ejecuta una acción NSFW dentro del chat.

6️⃣9️⃣ *${currentPrefix}sixnine* / *${currentPrefix}69*:
Ejecuta una acción NSFW dentro del chat.

🍒 *${currentPrefix}suckboobs*:
Ejecuta una acción NSFW dentro del chat.

🍒 *${currentPrefix}grabboobs*:
Ejecuta una acción NSFW dentro del chat.

💋 *${currentPrefix}blowjob* / *${currentPrefix}mamada* / *${currentPrefix}bj*:
Ejecuta una acción NSFW dentro del chat.

🍒 *${currentPrefix}boobjob*:
Ejecuta una acción NSFW dentro del chat.

🌸 *${currentPrefix}yuri* / *${currentPrefix}tijeras*:
Ejecuta una acción NSFW dentro del chat.

🦶 *${currentPrefix}footjob*:
Ejecuta una acción NSFW dentro del chat.

💦 *${currentPrefix}cummouth*:
Ejecuta una acción NSFW dentro del chat.

💦 *${currentPrefix}cumshot*:
Ejecuta una acción NSFW dentro del chat.

✋ *${currentPrefix}handjob*:
Ejecuta una acción NSFW dentro del chat.

👅 *${currentPrefix}lickass*:
Ejecuta una acción NSFW dentro del chat.

👅 *${currentPrefix}lickdick*:
Ejecuta una acción NSFW dentro del chat.

👉 *${currentPrefix}fingering*:
Ejecuta una acción NSFW dentro del chat.

💦 *${currentPrefix}creampie*:
Ejecuta una acción NSFW dentro del chat.

🪑 *${currentPrefix}facesitting*:
Ejecuta una acción NSFW dentro del chat.

🔥 *${currentPrefix}deepthroat*:
Ejecuta una acción NSFW dentro del chat.

🦵 *${currentPrefix}thighjob*:
Ejecuta una acción NSFW dentro del chat.

⛓️ *${currentPrefix}bondage*:
Ejecuta una acción NSFW dentro del chat.

🔥 *${currentPrefix}pegging*:
Ejecuta una acción NSFW dentro del chat.

🔞 *${currentPrefix}futanari* / *${currentPrefix}futa*:
Ejecuta una acción NSFW dentro del chat.

🌈 *${currentPrefix}yaoi*:
Ejecuta una acción NSFW dentro del chat.

💦 *${currentPrefix}bukkake*:
Ejecuta una acción NSFW dentro del chat.

🎉 *${currentPrefix}orgy* / *${currentPrefix}orgia*:
Ejecuta una acción NSFW dentro del chat.

💦 *${currentPrefix}squirt* / *${currentPrefix}squirting*:
Ejecuta una acción NSFW dentro del chat.



        𓆩 ⚙️ *CONTROL* ⚙️ 𓆪

🔞 *${currentPrefix}nsfw on*:
Activa el modo NSFW en el grupo.

🚫 *${currentPrefix}nsfw off*:
Desactiva el modo NSFW en el grupo.



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