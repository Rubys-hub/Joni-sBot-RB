export default {
  command: ['economia', 'menueconomia'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const userTag = `@${m.sender.split('@')[0]}`

    const botRaw = client.user?.id || ''
    const botId = botRaw.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const botName = settings.botname || settings.namebot || 'RubyJX Bot'
    const coinsName = settings.currency || 'Coins'
    const channelName = settings.nameid || global.my?.name || 'RubyJX Channel'
    const channelJid = settings.id || global.my?.ch || '120363424461852442@newsletter'
    const channelLink = settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
    const thumbnail = settings.icon || settings.banner || undefined

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Accediste al sistema de *economía* 💰✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│             ⟐ *E C O N O M I A* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: ECONOMY SYSTEM 💰
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│        ✦ CURRENCY :: ${coinsName} 🪙
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 💰 *ECONOMY SYSTEM* 💰 𓆪
        ✨ *Total disponible:* 19 comandos
        ⚡ *Modo:* dinero, banco, recompensas y apuestas



ꕥ 💳 *BÁSICOS*

💰 *${currentPrefix}balance* / *${currentPrefix}bal* / *${currentPrefix}coins* / *${currentPrefix}bank*:
Muestra tu dinero disponible, el saldo guardado en banco y tu progreso económico dentro del grupo.

🎁 *${currentPrefix}daily* / *${currentPrefix}diario*:
Reclama tu recompensa diaria de economía. Solo puede usarse cuando el tiempo de espera haya terminado.

💼 *${currentPrefix}work* / *${currentPrefix}w* / *${currentPrefix}chambear* / *${currentPrefix}chamba* / *${currentPrefix}trabajar*:
Trabaja para ganar ${coinsName}. Es una forma segura de generar dinero dentro del sistema.

📅 *${currentPrefix}monthly* / *${currentPrefix}mensual*:
Reclama una recompensa mensual especial. Sirve para obtener una cantidad mayor de ${coinsName} cuando esté disponible.

🏆 *${currentPrefix}economyboard* / *${currentPrefix}eboard* / *${currentPrefix}baltop*:
Muestra el ranking económico del grupo con los usuarios que tienen más dinero.

ℹ️ *${currentPrefix}infoeconomy* / *${currentPrefix}cooldowns* / *${currentPrefix}economyinfo* / *${currentPrefix}einfo*:
Muestra información del sistema económico, tiempos de espera y estado de los comandos.



ꕥ 🏦 *BANCO Y TRANSFERENCIAS*

🏦 *${currentPrefix}deposit* / *${currentPrefix}dep* / *${currentPrefix}d*:
Deposita tus ${coinsName} en el banco para mantenerlos guardados dentro de tu cuenta.

💸 *${currentPrefix}withdraw* / *${currentPrefix}with* / *${currentPrefix}retirar*:
Retira ${coinsName} desde el banco hacia tu saldo disponible.

🤝 *${currentPrefix}givecoins* / *${currentPrefix}pay* / *${currentPrefix}coinsgive*:
Transfiere ${coinsName} a otro usuario del grupo. Debes mencionar al usuario o responder su mensaje.

🎟️ *${currentPrefix}codigo* / *${currentPrefix}codigos*:
Permite al owner crear, listar, activar, pausar, eliminar y administrar códigos de regalo con Coins.

🎁 *${currentPrefix}canjear* + <código>:
Permite canjear un código de regalo válido para recibir Coins en la economía del grupo.

ꕥ 🎰 *RIESGO Y APUESTAS*

🕵️ *${currentPrefix}crime* / *${currentPrefix}crimen*:
Realiza un crimen para intentar ganar ${coinsName}. Puede darte recompensa o hacerte perder dinero.

💋 *${currentPrefix}slut* / *${currentPrefix}prostituirse*:
Ejecuta una acción arriesgada para obtener ${coinsName}. Tiene probabilidad de éxito o fracaso.

🎰 *${currentPrefix}slot*:
Juega tragamonedas usando tus ${coinsName}. Puedes ganar más o perder lo apostado.

🎲 *${currentPrefix}apostar* / *${currentPrefix}casino*:
Apuesta una cantidad de ${coinsName} en el casino. Ideal para jugar con riesgo controlado.

🪙 *${currentPrefix}coinflip* / *${currentPrefix}cf* / *${currentPrefix}flip*:
Juega cara o cruz apostando ${coinsName}. Ganas si aciertas el resultado.



ꕥ 🧭 *AVENTURA Y SUPERVIVENCIA*

🏹 *${currentPrefix}hunt* / *${currentPrefix}cazar*:
Sal a cazar para conseguir recompensas. Puede darte ${coinsName} u otros resultados según el sistema.

🩹 *${currentPrefix}heal* / *${currentPrefix}curar*:
Cura tu estado dentro del sistema de economía o aventura, útil si quedaste afectado por una acción.

🏰 *${currentPrefix}dungeon* / *${currentPrefix}mazmorra*:
Entra a una mazmorra para enfrentar retos y conseguir recompensas especiales.



ꕥ 🎮 *MINIJUEGOS Y EXTRAS*

✊ *${currentPrefix}ppt*:
Juega piedra, papel o tijera dentro del sistema del bot.

🎟️ *${currentPrefix}canjear*:
Canjea códigos especiales entregados por el owner para recibir recompensas de economía.



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