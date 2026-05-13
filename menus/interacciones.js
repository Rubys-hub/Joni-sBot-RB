export default {
  command: ['interacciones', 'interactions'],
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
> Accediste al sistema de *interacciones* 💞✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│          ⟐ *I N T E R A C C I O N E S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: INTERACTION SYSTEM 💞
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 💞 *INTERACTION SYSTEM* 💞 𓆪
        ✨ *Total disponible:* 67 comandos
        ⚡ *Modo:* acciones, emociones y convivencia



ꕥ ❤️ *AFECTO Y CARIÑO*

🫂 *${currentPrefix}hug* / *${currentPrefix}abrazar*:
Envía una acción de abrazo a otro usuario.

💋 *${currentPrefix}kiss* / *${currentPrefix}muak*:
Envía una acción de beso a otro usuario.

😘 *${currentPrefix}kisscheek* / *${currentPrefix}beso* / *${currentPrefix}besar*:
Envía un beso en la mejilla o acción cariñosa.

👋 *${currentPrefix}pat* / *${currentPrefix}acariciar*:
Acaricia a otro usuario de forma amistosa.

🤗 *${currentPrefix}cuddle* / *${currentPrefix}acurrucar*:
Envía una acción de acurrucarse con otro usuario.

🤗 *${currentPrefix}snuggle* / *${currentPrefix}acurrucarse*:
Envía una acción de arrimarse o acurrucarse.

😘 *${currentPrefix}blowkiss* / *${currentPrefix}besito*:
Lanza un besito a otro usuario.

🤝 *${currentPrefix}handhold* / *${currentPrefix}tomar*:
Toma la mano de otro usuario.

🙌 *${currentPrefix}highfive* / *${currentPrefix}choca*:
Choca los cinco con otro usuario.

❤️ *${currentPrefix}love* / *${currentPrefix}amor*:
Muestra una acción de amor o cariño.



ꕥ 😭 *EMOCIONES*

😡 *${currentPrefix}angry* / *${currentPrefix}enojado* / *${currentPrefix}enojada*:
Muestra una reacción de enojo.

🥱 *${currentPrefix}bored* / *${currentPrefix}aburrido* / *${currentPrefix}aburrida*:
Muestra una reacción de aburrimiento.

😂 *${currentPrefix}laugh*:
Muestra una reacción de risa.

😔 *${currentPrefix}sad* / *${currentPrefix}triste*:
Muestra una reacción de tristeza.

😨 *${currentPrefix}scared* / *${currentPrefix}asustado*:
Muestra una reacción de miedo.

😳 *${currentPrefix}shy* / *${currentPrefix}timido* / *${currentPrefix}timida*:
Muestra una reacción de timidez.

😄 *${currentPrefix}happy* / *${currentPrefix}feliz*:
Muestra una reacción de felicidad.

😊 *${currentPrefix}blush* / *${currentPrefix}sonrojarse*:
Muestra una reacción de sonrojo.

😊 *${currentPrefix}smile* / *${currentPrefix}sonreir*:
Muestra una sonrisa.

😭 *${currentPrefix}cry* / *${currentPrefix}llorar*:
Muestra una reacción de llanto.



ꕥ 🎭 *REACCIONES Y GESTOS*

😛 *${currentPrefix}bleh*:
Muestra una reacción sacando la lengua.

👏 *${currentPrefix}clap* / *${currentPrefix}aplaudir*:
Aplaude a otro usuario o situación.

🎭 *${currentPrefix}dramatic* / *${currentPrefix}drama*:
Muestra una reacción dramática.

😗 *${currentPrefix}pout*:
Muestra una reacción de puchero.

😉 *${currentPrefix}wink* / *${currentPrefix}guiñar*:
Guiña el ojo a otro usuario.

👋 *${currentPrefix}wave* / *${currentPrefix}saludar*:
Saluda a otro usuario.

😏 *${currentPrefix}smug* / *${currentPrefix}presumir*:
Muestra una expresión presumida.

😬 *${currentPrefix}cringe*:
Muestra una reacción de cringe.

🙅 *${currentPrefix}nope* / *${currentPrefix}no*:
Muestra una reacción de negación.

👀 *${currentPrefix}peek*:
Mira de forma curiosa o escondida.



ꕥ ⚔️ *ACCIONES*

👊 *${currentPrefix}punch* / *${currentPrefix}golpear*:
Golpea a otro usuario de forma ficticia.

🔪 *${currentPrefix}kill* / *${currentPrefix}matar*:
Ejecuta una acción ficticia de atacar o eliminar.

😈 *${currentPrefix}bully* / *${currentPrefix}molestar*:
Molesta a otro usuario de forma ficticia.

🦷 *${currentPrefix}bite* / *${currentPrefix}morder*:
Muerde a otro usuario de forma ficticia.

🔨 *${currentPrefix}bonk* / *${currentPrefix}golpe*:
Da un golpe tipo bonk.

👅 *${currentPrefix}lick* / *${currentPrefix}lamer*:
Lame a otro usuario de forma ficticia.

🖐️ *${currentPrefix}slap* / *${currentPrefix}bofetada*:
Da una bofetada ficticia.

🖐️ *${currentPrefix}push* / *${currentPrefix}empujar*:
Empuja a otro usuario de forma ficticia.

🦶 *${currentPrefix}trip* / *${currentPrefix}tropezar*:
Hace tropezar a otro usuario.

💦 *${currentPrefix}spit* / *${currentPrefix}escupir*:
Escupe de forma ficticia.

👣 *${currentPrefix}step* / *${currentPrefix}pisar*:
Pisa a otro usuario de forma ficticia.



ꕥ 🧠 *PENSAR Y OBSERVAR*

🤔 *${currentPrefix}think* / *${currentPrefix}pensar*:
Muestra una acción de pensar.

🤯 *${currentPrefix}thinkhard*:
Muestra una acción de pensar intensamente.

🧐 *${currentPrefix}curious* / *${currentPrefix}curioso* / *${currentPrefix}curiosa*:
Muestra curiosidad.

👁️ *${currentPrefix}stare* / *${currentPrefix}mirar*:
Mira fijamente a otro usuario.

👃 *${currentPrefix}sniff* / *${currentPrefix}oler*:
Huele de forma ficticia.

🫂 *${currentPrefix}comfort* / *${currentPrefix}consolar*:
Consuela a otro usuario.



ꕥ 🏃 *MOVIMIENTO Y ACTIVIDAD*

🏃 *${currentPrefix}run* / *${currentPrefix}correr*:
Muestra una acción de correr.

🚶 *${currentPrefix}walk* / *${currentPrefix}caminar*:
Muestra una acción de caminar.

💃 *${currentPrefix}dance* / *${currentPrefix}bailar*:
Muestra una acción de baile.

🦘 *${currentPrefix}jump* / *${currentPrefix}saltar*:
Muestra una acción de salto.

🎮 *${currentPrefix}gaming* / *${currentPrefix}jugar*:
Muestra una acción de jugar.

🎨 *${currentPrefix}draw* / *${currentPrefix}dibujar*:
Muestra una acción de dibujar.

📞 *${currentPrefix}call* / *${currentPrefix}llamar*:
Muestra una acción de llamar.

🎤 *${currentPrefix}sing* / *${currentPrefix}cantar*:
Muestra una acción de cantar.



ꕥ ☕ *VIDA DIARIA*

☕ *${currentPrefix}coffee* / *${currentPrefix}cafe*:
Muestra una acción relacionada con café.

🍻 *${currentPrefix}drunk*:
Muestra una reacción de estar ebrio.

🥶 *${currentPrefix}cold*:
Muestra una reacción de frío.

😴 *${currentPrefix}sleep* / *${currentPrefix}dormir*:
Muestra una acción de dormir.

🚬 *${currentPrefix}smoke* / *${currentPrefix}fumar*:
Muestra una acción de fumar.

🍽️ *${currentPrefix}eat* / *${currentPrefix}nom* / *${currentPrefix}comer*:
Muestra una acción de comer.

🛁 *${currentPrefix}bath* / *${currentPrefix}bañarse*:
Muestra una acción de bañarse.



ꕥ 🔥 *EXTRAS*

🔥 *${currentPrefix}seduce* / *${currentPrefix}seducir*:
Muestra una acción de seducción.

🥵 *${currentPrefix}heat* / *${currentPrefix}calor*:
Muestra una reacción de calor.

🤰 *${currentPrefix}impregnate* / *${currentPrefix}preg* / *${currentPrefix}preñar* / *${currentPrefix}embarazar*:
Ejecuta una acción especial de interacción.

🤭 *${currentPrefix}tickle* / *${currentPrefix}cosquillas*:
Hace cosquillas a otro usuario.

😱 *${currentPrefix}scream* / *${currentPrefix}gritar*:
Muestra una acción de gritar.



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