export default {
  command: ['reactions', 'reaction', 'reacciones', 'menureactions', 'menureact'],
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

    const senderNum = m.sender.split('@')[0]
    const owners = Array.isArray(global.owner)
      ? global.owner.map(v => String(v).replace(/\D/g, ''))
      : []

    const isOwner = !!m.isOwner || owners.includes(senderNum)

    const ownerSection = isOwner
      ? `

ꕥ 👑 *OWNER REACTIONS*

👑 *${currentPrefix}reactowner*:
Abre el panel privado para administrar la tienda de reacciones. Solo funciona para owner.

➕ *${currentPrefix}reactowner create*:
Crea una nueva reacción para la tienda.

📦 *${currentPrefix}reactowner stock*:
Modifica el stock disponible de una reacción.

💸 *${currentPrefix}reactowner price*:
Cambia el precio de una reacción.

🏷️ *${currentPrefix}reactowner rarity*:
Cambia la rareza de una reacción.

💎 *${currentPrefix}reactowner vip*:
Marca una reacción como VIP o normal.

📝 *${currentPrefix}reactowner name*:
Cambia el nombre visible de una reacción.

🙈 *${currentPrefix}reactowner hide*:
Oculta una reacción de la tienda.

👁️ *${currentPrefix}reactowner show*:
Vuelve a mostrar una reacción en la tienda.

🗑️ *${currentPrefix}reactowner delete*:
Elimina una reacción del sistema.

🎁 *${currentPrefix}reactowner give*:
Entrega una reacción directamente a un usuario.

❌ *${currentPrefix}reactowner remove*:
Quita una reacción a un usuario.

🔄 *${currentPrefix}reactowner reset*:
Reinicia las reacciones de un usuario.

💎 *${currentPrefix}reactowner vipuser*:
Activa o desactiva el estado VIP de un usuario.

📦 *${currentPrefix}reactowner user*:
Muestra la información de reacciones de un usuario.
`
      : ''

    const totalText = isOwner
      ? '2 comandos principales + panel owner'
      : '1 comando público'

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Accediste al sistema de *reacciones* 🎯✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│            ⟐ *R E A C T I O N S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: REACTION SYSTEM 🎯
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│        ✦ CURRENCY :: ${coinsName} 🪙
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🎯 *REACTION SYSTEM* 🎯 𓆪
        ✨ *Total disponible:* ${totalText}
        ⚡ *Modo:* compra, equipa y usa reacciones automáticas



ꕥ 🎨 *REACCIONES DE USUARIO*

🎯 *${currentPrefix}react* / *${currentPrefix}reacciones*:
Abre el menú principal del sistema de reacciones. Desde ahí puedes ver la tienda, comprar, equipar o quitar tu reacción activa.

🏪 *${currentPrefix}react list* / *${currentPrefix}react shop* / *${currentPrefix}react tienda*:
Muestra la tienda de reacciones disponibles, con precio, rareza, stock y estado.

💰 *${currentPrefix}react buy* / *${currentPrefix}react comprar* _emoji_:
Compra una reacción de la tienda usando tus ${coinsName} de la cartera.

🎨 *${currentPrefix}react select* _emoji_:
Equipa una reacción comprada. El bot reaccionará automáticamente a tus mensajes con ese emoji.

📦 *${currentPrefix}react my* / *${currentPrefix}react coleccion* / *${currentPrefix}react collection*:
Muestra tu colección de reacciones compradas y cuál tienes equipada.

❌ *${currentPrefix}react unequip* / *${currentPrefix}react quitar*:
Quita tu reacción activa para que el bot deje de reaccionar automáticamente a tus mensajes.



ꕥ 💡 *EJEMPLOS*

🏪 *${currentPrefix}react list*
Ver la tienda de reacciones.

💰 *${currentPrefix}react buy 👀*
Comprar la reacción indicada.

🎨 *${currentPrefix}react select 🔥*
Equipar una reacción comprada.

📦 *${currentPrefix}react my*
Ver tu colección.

❌ *${currentPrefix}react unequip*
Quitar tu reacción activa.${ownerSection}



        𓆩 ⚠️ *NOTA* ⚠️ 𓆪

🔰 Solo puedes tener una reacción equipada a la vez.
💡 Las compras usan monedas de la *cartera*, no del banco.
👑 El panel owner no se muestra a usuarios normales.



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