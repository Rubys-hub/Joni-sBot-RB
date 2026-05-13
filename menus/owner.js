export default {
  command: ['owner', 'menuowner', 'ownerpanel'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Owner'
    const userTag = `@${m.sender.split('@')[0]}`

    const senderNum = m.sender.split('@')[0]
    const owners = Array.isArray(global.owner)
      ? global.owner.map(v => String(v).replace(/\D/g, ''))
      : []

    const isOwner = !!m.isOwner || owners.includes(senderNum)

    if (!isOwner) {
      return m.reply(`╭━━━〔 ❌ *COMANDO NO ENCONTRADO* 〕━━━╮
┃
┃ El comando solicitado no existe.
┃ Usa *${currentPrefix}menu* para ver los menús disponibles.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    const botRaw = client.user?.id || ''
    const botId = botRaw.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const botName = settings.botname || settings.namebot || 'RubyJX Bot'
    const channelName = settings.nameid || global.my?.name || 'RubyJX Channel'
    const channelJid = settings.id || global.my?.ch || '120363424461852442@newsletter'
    const channelLink = settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
    const thumbnail = settings.icon || settings.banner || undefined

    const textMenu = `> 𖧧 *Hola, ${pushname}* 👑
> Accediste al panel privado de *owner* 🔐✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│               ⟐ *O W N E R* ⟐
│
│        𖧧 USER :: ${userTag} 👑
│        ✦ BOT :: ${botName} 🤖
│        ⟡ ACCESS :: PRIVATE 🔐
│        ⎔ TYPE :: OWNER SYSTEM 👑
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 👑 *OWNER SYSTEM* 👑 𓆪
        🔐 *Acceso:* exclusivo del propietario
        ⚠️ *Modo:* administración, sistema y difusión



ꕥ 💰 *ECONOMÍA OWNER*

💰 *${currentPrefix}addcoin* / *${currentPrefix}addxp*:
Agrega monedas o experiencia manualmente a un usuario. Útil para premios, compensaciones o pruebas internas.



ꕥ 🧹 *MANTENIMIENTO*

🧹 *${currentPrefix}clear*:
Limpia datos antiguos, registros o información interna según el funcionamiento del comando.

⚠️ *${currentPrefix}errorfake*:
Genera o simula un error falso. Úsalo solo para pruebas internas.

🔄 *${currentPrefix}restart*:
Reinicia el bot.

🛠️ *${currentPrefix}fix* / *${currentPrefix}update*:
Actualiza, corrige o recarga partes del sistema del bot.



ꕥ 🧪 *EJECUCIÓN AVANZADA*

⚙️ *${currentPrefix}ex* / *${currentPrefix}e*:
Ejecuta código JavaScript directamente. Comando delicado, úsalo solo si sabes lo que haces.

🖥️ *${currentPrefix}r*:
Ejecuta instrucciones internas del sistema. Comando sensible y exclusivo del owner.



ꕥ 📩 *MENSAJERÍA MASIVA*

📋 *${currentPrefix}mlist*:
Muestra la lista disponible para mensajería masiva.

📨 *${currentPrefix}mp*:
Envía mensaje privado o masivo según el sistema configurado.

🏷️ *${currentPrefix}mtag*:
Envía mensaje con mención o tag según el sistema.

🏷️ *${currentPrefix}mptag*:
Envía mensaje privado con tag o mención.

📢 *${currentPrefix}mall*:
Envía mensaje global o masivo.

📢 *${currentPrefix}mtagall*:
Envía mensaje masivo con tag a todos según los grupos disponibles.



ꕥ 📣 *PROMOCIÓN Y DIFUSIÓN*

📌 *${currentPrefix}pr*:
Abre o ejecuta el sistema principal de promoción.

📋 *${currentPrefix}prlist*:
Muestra la lista de grupos o destinos disponibles para promoción.

🔗 *${currentPrefix}prshared*:
Muestra grupos compartidos o destinos relacionados.

🔔 *${currentPrefix}prsus*:
Gestiona grupos o destinos suscritos para promoción.

💬 *${currentPrefix}prmsg*:
Envía mensaje promocional normal.

💬 *${currentPrefix}prsusmsg*:
Envía mensaje promocional a suscritos.

📢 *${currentPrefix}prall*:
Envía promoción a todos los destinos configurados.

🏷️ *${currentPrefix}prtag*:
Envía promoción con tag.

🏷️ *${currentPrefix}prsustag*:
Envía promoción con tag a suscritos.

🏷️ *${currentPrefix}prtagall*:
Envía promoción con tag a todos.

👥 *${currentPrefix}prgtag*:
Envía promoción con tag en grupo específico.

📣 *${currentPrefix}prpromo*:
Envía promoción del canal o contenido configurado.

📣 *${currentPrefix}prsuspromo*:
Envía promoción del canal a suscritos.

📣 *${currentPrefix}prpromoall*:
Envía promoción del canal a todos los destinos configurados.



        𓆩 ⚠️ *IMPORTANTE* ⚠️ 𓆪

🚫 *promoto* no se muestra en este menú.
🔐 Este panel no aparece para usuarios normales.
👑 Solo el owner puede ejecutar este comando.



        𓆩 🔙 *RETURN* 🔙 𓆪

🏠 *${currentPrefix}menu*:
Regresa al menú principal público.

📋 *${currentPrefix}menutotal*:
Abre el menú completo público.`

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