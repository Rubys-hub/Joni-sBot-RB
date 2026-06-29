export default {
  command: ['interacciones', 'interaccion', 'interactions', 'acciones'],
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

🫂 *${currentPrefix}hug* / *${currentPrefix}abrazar* / *${currentPrefix}abrazo*:
Envía una acción de abrazo a otro usuario.

💋 *${currentPrefix}kiss* / *${currentPrefix}muak* / *${currentPrefix}besaroca*:
Envía una acción de beso a otro usuario.

😘 *${currentPrefix}kisscheek* / *${currentPrefix}beso* / *${currentPrefix}besar* / *${currentPrefix}mejilla* / *${currentPrefix}cachete* / *${currentPrefix}besomejilla*:
Envía un beso en la mejilla o acción cariñosa.

👋 *${currentPrefix}pat* / *${currentPrefix}acariciar* / *${currentPrefix}palmadita*:
Acaricia a otro usuario de forma amistosa.

🤗 *${currentPrefix}cuddle* / *${currentPrefix}acurrucar*:
Envía una acción de acurrucarse con otro usuario.

🤗 *${currentPrefix}snuggle* / *${currentPrefix}acurrucarse*:
Envía una acción de arrimarse o acurrucarse.

😘 *${currentPrefix}blowkiss* / *${currentPrefix}besito* / *${currentPrefix}besoaire*:
Lanza un besito a otro usuario.

🤝 *${currentPrefix}handhold* / *${currentPrefix}tomar* / *${currentPrefix}mano* / *${currentPrefix}agarrarmano*:
Toma la mano de otro usuario.

🙌 *${currentPrefix}highfive* / *${currentPrefix}choca* / *${currentPrefix}chocar* / *${currentPrefix}cinco*:
Choca los cinco con otro usuario.

❤️ *${currentPrefix}love* / *${currentPrefix}amor* / *${currentPrefix}amar* / *${currentPrefix}enamorar*:
Muestra una acción de amor o cariño.



ꕥ 😭 *EMOCIONES*

😡 *${currentPrefix}angry* / *${currentPrefix}enojado* / *${currentPrefix}enojada* / *${currentPrefix}enojo* / *${currentPrefix}furioso* / *${currentPrefix}furiosa* / *${currentPrefix}enfado*:
Muestra una reacción de enojo.

🥱 *${currentPrefix}bored* / *${currentPrefix}aburrido* / *${currentPrefix}aburrida* / *${currentPrefix}aburrimiento*:
Muestra una reacción de aburrimiento.

😂 *${currentPrefix}laugh* / *${currentPrefix}laught* / *${currentPrefix}laugth* / *${currentPrefix}laguht* / *${currentPrefix}risa* / *${currentPrefix}reir* / *${currentPrefix}reirse* / *${currentPrefix}jaja*:
Muestra una reacción de risa.

😔 *${currentPrefix}sad* / *${currentPrefix}triste* / *${currentPrefix}tristeza*:
Muestra una reacción de tristeza.

😨 *${currentPrefix}scared* / *${currentPrefix}asustado* / *${currentPrefix}asustada* / *${currentPrefix}miedo*:
Muestra una reacción de miedo.

😳 *${currentPrefix}shy* / *${currentPrefix}timido* / *${currentPrefix}timida* / *${currentPrefix}verguenza*:
Muestra una reacción de timidez.

😄 *${currentPrefix}happy* / *${currentPrefix}feliz* / *${currentPrefix}alegre* / *${currentPrefix}felicidad*:
Muestra una reacción de felicidad.

😊 *${currentPrefix}blush* / *${currentPrefix}sonrojarse* / *${currentPrefix}sonrojo* / *${currentPrefix}sonrojado* / *${currentPrefix}sonrojada*:
Muestra una reacción de sonrojo.

😊 *${currentPrefix}smile* / *${currentPrefix}sonreir* / *${currentPrefix}sonrisa*:
Muestra una sonrisa.

😭 *${currentPrefix}cry* / *${currentPrefix}llorar* / *${currentPrefix}llanto*:
Muestra una reacción de llanto.



ꕥ 🎭 *REACCIONES Y GESTOS*

😛 *${currentPrefix}bleh* / *${currentPrefix}lengua* / *${currentPrefix}mueca* / *${currentPrefix}muecalengua*:
Muestra una reacción sacando la lengua.

👏 *${currentPrefix}clap* / *${currentPrefix}aplaudir* / *${currentPrefix}aplauso* / *${currentPrefix}aplausos*:
Aplaude a otro usuario o situación.

🎭 *${currentPrefix}dramatic* / *${currentPrefix}drama* / *${currentPrefix}dramatico* / *${currentPrefix}dramatica*:
Muestra una reacción dramática.

😗 *${currentPrefix}pout* / *${currentPrefix}puchero* / *${currentPrefix}pucheros*:
Muestra una reacción de puchero.

😉 *${currentPrefix}wink* / *${currentPrefix}guiñar* / *${currentPrefix}guiño*:
Guiña el ojo a otro usuario.

👋 *${currentPrefix}wave* / *${currentPrefix}saludar* / *${currentPrefix}saludo*:
Saluda a otro usuario.

😏 *${currentPrefix}smug* / *${currentPrefix}presumir* / *${currentPrefix}presumido* / *${currentPrefix}presumida*:
Muestra una expresión presumida.

😬 *${currentPrefix}cringe* / *${currentPrefix}penaajena*:
Muestra una reacción de cringe.

🙅 *${currentPrefix}nope* / *${currentPrefix}no* / *${currentPrefix}nop*:
Muestra una reacción de negación.

👀 *${currentPrefix}peek* / *${currentPrefix}espiar* / *${currentPrefix}miraroculto*:
Mira de forma curiosa o escondida.



ꕥ ⚔️ *ACCIONES*

👊 *${currentPrefix}punch* / *${currentPrefix}golpear* / *${currentPrefix}puñete* / *${currentPrefix}puñetazo*:
Golpea a otro usuario de forma ficticia.

🔪 *${currentPrefix}kill* / *${currentPrefix}matar* / *${currentPrefix}asesinar*:
Ejecuta una acción ficticia de atacar o eliminar.

😈 *${currentPrefix}bully* / *${currentPrefix}molestar* / *${currentPrefix}bullying*:
Molesta a otro usuario de forma ficticia.

🦷 *${currentPrefix}bite* / *${currentPrefix}morder* / *${currentPrefix}mordida*:
Muerde a otro usuario de forma ficticia.

🔨 *${currentPrefix}bonk* / *${currentPrefix}golpe* / *${currentPrefix}coscorrón* / *${currentPrefix}coscorron*:
Da un golpe tipo bonk.

👅 *${currentPrefix}lick* / *${currentPrefix}lamer* / *${currentPrefix}lamida*:
Lame a otro usuario de forma ficticia.

🖐️ *${currentPrefix}slap* / *${currentPrefix}bofetada* / *${currentPrefix}cachetada*:
Da una bofetada ficticia.

🖐️ *${currentPrefix}push* / *${currentPrefix}empujar* / *${currentPrefix}empujon*:
Empuja a otro usuario de forma ficticia.

🦶 *${currentPrefix}trip* / *${currentPrefix}tropezar* / *${currentPrefix}tropiezo*:
Hace tropezar a otro usuario.

💦 *${currentPrefix}spit* / *${currentPrefix}escupir* / *${currentPrefix}escupirle*:
Escupe de forma ficticia.

👣 *${currentPrefix}step* / *${currentPrefix}pisar* / *${currentPrefix}pisoton*:
Pisa a otro usuario de forma ficticia.



ꕥ 🧠 *PENSAR Y OBSERVAR*

🤔 *${currentPrefix}think* / *${currentPrefix}pensar* / *${currentPrefix}pensando*:
Muestra una acción de pensar.

🤯 *${currentPrefix}thinkhard* / *${currentPrefix}pensarprofundo* / *${currentPrefix}reflexionar*:
Muestra una acción de pensar intensamente.

🧐 *${currentPrefix}curious* / *${currentPrefix}curioso* / *${currentPrefix}curiosa* / *${currentPrefix}curiosidad*:
Muestra curiosidad.

👁️ *${currentPrefix}stare* / *${currentPrefix}mirar* / *${currentPrefix}mirada*:
Mira fijamente a otro usuario.

👃 *${currentPrefix}sniff* / *${currentPrefix}oler* / *${currentPrefix}olfatear*:
Huele de forma ficticia.

🫂 *${currentPrefix}comfort* / *${currentPrefix}consolar* / *${currentPrefix}consuelo*:
Consuela a otro usuario.



ꕥ 🏃 *MOVIMIENTO Y ACTIVIDAD*

🏃 *${currentPrefix}run* / *${currentPrefix}correr* / *${currentPrefix}huir* / *${currentPrefix}escapar*:
Muestra una acción de correr.

🚶 *${currentPrefix}walk* / *${currentPrefix}caminar* / *${currentPrefix}pasear*:
Muestra una acción de caminar.

💃 *${currentPrefix}dance* / *${currentPrefix}bailar* / *${currentPrefix}baile*:
Muestra una acción de baile.

🦘 *${currentPrefix}jump* / *${currentPrefix}saltar* / *${currentPrefix}salto*:
Muestra una acción de salto.

🎮 *${currentPrefix}gaming* / *${currentPrefix}jugar* / *${currentPrefix}gamer* / *${currentPrefix}juego*:
Muestra una acción de jugar.

🎨 *${currentPrefix}draw* / *${currentPrefix}dibujar* / *${currentPrefix}dibujo*:
Muestra una acción de dibujar.

📞 *${currentPrefix}call* / *${currentPrefix}llamar* / *${currentPrefix}llamada*:
Muestra una acción de llamar.

🎤 *${currentPrefix}sing* / *${currentPrefix}cantar* / *${currentPrefix}cancion*:
Muestra una acción de cantar.



ꕥ ☕ *VIDA DIARIA*

☕ *${currentPrefix}coffee* / *${currentPrefix}cafe* / *${currentPrefix}cafecito*:
Muestra una acción relacionada con café.

🍻 *${currentPrefix}drunk* / *${currentPrefix}borracho* / *${currentPrefix}borracha* / *${currentPrefix}ebrio* / *${currentPrefix}ebria*:
Muestra una reacción de estar ebrio.

🥶 *${currentPrefix}cold* / *${currentPrefix}frio* / *${currentPrefix}fria*:
Muestra una reacción de frío.

😴 *${currentPrefix}sleep* / *${currentPrefix}dormir* / *${currentPrefix}duerme* / *${currentPrefix}sueño*:
Muestra una acción de dormir.

🚬 *${currentPrefix}smoke* / *${currentPrefix}fumar* / *${currentPrefix}fumando*:
Muestra una acción de fumar.

🍽️ *${currentPrefix}eat* / *${currentPrefix}nom* / *${currentPrefix}comer* / *${currentPrefix}comida*:
Muestra una acción de comer.

🛁 *${currentPrefix}bath* / *${currentPrefix}bañarse* / *${currentPrefix}baño*:
Muestra una acción de bañarse.



ꕥ 🔥 *EXTRAS*

🔥 *${currentPrefix}seduce* / *${currentPrefix}seducir* / *${currentPrefix}seductor* / *${currentPrefix}seductora*:
Muestra una acción de seducción.

🥵 *${currentPrefix}heat* / *${currentPrefix}calor*:
Muestra una reacción de calor.

🤰 *${currentPrefix}impregnate* / *${currentPrefix}preg* / *${currentPrefix}preñar* / *${currentPrefix}embarazar*:
Ejecuta una acción especial de interacción.

🤭 *${currentPrefix}tickle* / *${currentPrefix}cosquillas*:
Hace cosquillas a otro usuario.

😱 *${currentPrefix}scream* / *${currentPrefix}gritar* / *${currentPrefix}grito*:
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
