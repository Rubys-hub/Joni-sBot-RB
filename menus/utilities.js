export default {
  command: ['utils', 'tools', 'utilidades', 'utilities'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
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
> Accediste al sistema de *utilidades* 🛠️✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│            ⟐ *U T I L I T I E S* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: UTILITY SYSTEM 🛠️
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🛠️ *UTILITY SYSTEM* 🛠️ 𓆪
        ✨ *Total disponible:* 32 comandos
        ⚡ *Modo:* herramientas, conversión, IA y texto



ꕥ 📖 *LECTURA Y RESUMEN*

📖 *${currentPrefix}readviewonce* / *${currentPrefix}read* / *${currentPrefix}readvo*:
Permite leer contenido de una sola vista respondiendo a una imagen o video compatible.

📚 *${currentPrefix}resumen*:
Resume textos largos para obtener una versión más corta y entendible.

🗣️ *${currentPrefix}say* / *${currentPrefix}decir*:
Hace que el bot repita el texto que escribas.


🎙️ *${currentPrefix}hablar* / *${currentPrefix}voz* / *${currentPrefix}tts* / *${currentPrefix}decir*:
Convierte el texto que escribas en una nota de voz generada por el bot. También permite usar otros idiomas, por ejemplo *${currentPrefix}hablar en hello everyone*.




ꕥ 🌐 *WEB Y ARCHIVOS*

🌐 *${currentPrefix}ssweb* / *${currentPrefix}ss*:
Toma una captura de pantalla de una página web usando un enlace.

🔗 *${currentPrefix}tourl*:
Convierte una imagen, video o archivo respondido en un enlace directo.

🌐 *${currentPrefix}get* / *${currentPrefix}fetch*:
Obtiene información o contenido desde una URL indicada.

🔎 *${currentPrefix}inspect* / *${currentPrefix}inspeccionar*:
Inspecciona enlaces de grupos, canales u otros recursos compatibles.

🧬 *${currentPrefix}gitclone* / *${currentPrefix}git*:
Descarga o clona un repositorio de GitHub mediante enlace.



ꕥ 🖼️ *IMAGEN Y MULTIMEDIA*

🖼️ *${currentPrefix}toimg* / *${currentPrefix}toimage*:
Convierte un sticker respondido en imagen.

🖼️ *${currentPrefix}pfp* / *${currentPrefix}getpic*:
Obtiene la foto de perfil de un usuario mencionado o respondido.

✨ *${currentPrefix}hd* / *${currentPrefix}enhance* / *${currentPrefix}remini*:
Mejora la calidad de una imagen respondida.



ꕥ 🤖 *IA Y CÁLCULO*

🤖 *${currentPrefix}ia* / *${currentPrefix}chatgpt*:
Realiza consultas a la IA integrada del bot.

🧮 *${currentPrefix}calc* / *${currentPrefix}calcular* / *${currentPrefix}math*:
Resuelve operaciones matemáticas o cálculos rápidos.



ꕥ 🌍 *TRADUCCIÓN Y MENSAJES*

🌍 *${currentPrefix}translate* / *${currentPrefix}trad* / *${currentPrefix}traducir*:
Traduce texto al idioma indicado.

💌 *${currentPrefix}anonmsg* / *${currentPrefix}anonimo* / *${currentPrefix}anon*:
Envía un mensaje anónimo según el funcionamiento del comando.



ꕥ 🔤 *HERRAMIENTAS DE TEXTO*

🔠 *${currentPrefix}morse*:
Convierte texto normal a código morse.

🔡 *${currentPrefix}demorse*:
Convierte código morse a texto normal.

0️⃣ *${currentPrefix}binary*:
Convierte texto a formato binario.

1️⃣ *${currentPrefix}unbinary*:
Convierte texto binario a texto normal.

🔐 *${currentPrefix}encrypt*:
Encripta o codifica texto.

🔓 *${currentPrefix}decrypt*:
Desencripta o decodifica texto.

🔄 *${currentPrefix}reverse*:
Invierte el orden del texto escrito.

🪞 *${currentPrefix}mirror*:
Convierte texto a formato espejo.

✨ *${currentPrefix}fancy*:
Genera texto decorado o estilizado.

🔢 *${currentPrefix}count*:
Cuenta caracteres, palabras o datos del texto indicado.

🎲 *${currentPrefix}random*:
Genera un resultado aleatorio según el uso del comando.

📐 *${currentPrefix}format*:
Formatea texto para que se vea más limpio o estructurado.



ꕥ 📊 *SISTEMA Y ESTADÍSTICAS*

🏆 *${currentPrefix}topcmd* / *${currentPrefix}topcommands*:
Muestra los comandos más usados del bot.

🕘 *${currentPrefix}historialcmd* / *${currentPrefix}cmdhistory*:
Muestra historial de comandos usados.

📄 *${currentPrefix}log* / *${currentPrefix}logs*:
Muestra registros o logs disponibles del sistema.

⏱️ *${currentPrefix}uptime* / *${currentPrefix}runtime*:
Muestra cuánto tiempo lleva activo el bot.



        𓆩 ⚠️ *NOTA* ⚠️ 𓆪

🔢 *${currentPrefix}count*:
En utilidades funciona como herramienta de texto.
En group también existe un *count* para contar mensajes.



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