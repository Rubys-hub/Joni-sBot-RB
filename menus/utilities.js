export default {
  command: ['utils', 'tools', 'utilidades', 'utilities'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *utilidades*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│             ⟐ *U T I L I T I E S* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: UTILITY SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 🛠️ UTILITY SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 13 comandos
│ ⎔ *MODO ::* Herramientas, búsquedas y conversión
╰───────────────────────────────────────────────╯

╭────────〔 📖 MENU / HELP / AYUDA 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}menu
│ ✦ *Aliases:* ${currentPrefix}help • ${currentPrefix}ayuda
│
│ 📌 *¿Qué hace?*
│ Te muestra el menú general del bot o una
│ categoría específica si la indicas.
│
│ 🧠 *¿Cómo funciona?*
│ Puedes usarlo sin argumentos para ver el menú
│ principal, o escribir una categoría para abrir
│ directamente esa sección.
│
│ 🧾 *Uso:*
│ ${currentPrefix}menu
│ ${currentPrefix}menu anime
│ ${currentPrefix}help
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}ayuda
╰──────────────────────────────────────────────╯

╭────────〔 🤖 CHATGPT / IA 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}chatgpt
│ ✦ *Alias:* ${currentPrefix}ia
│
│ 📌 *¿Qué hace?*
│ Realiza preguntas a la IA integrada del bot.
│
│ 🧠 *¿Cómo funciona?*
│ Envías una pregunta o instrucción y el sistema
│ responde con texto generado por IA.
│
│ 🧾 *Uso:*
│ ${currentPrefix}chatgpt Hola
│ ${currentPrefix}ia explícame JavaScript
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}chatgpt dame ideas para mi grupo
│
│ ✅ *Recomendación:*
│ Úsalo para dudas rápidas, ideas, textos y apoyo.
╰──────────────────────────────────────────────╯

╭────────〔 🖼️ GETPIC / PFP 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}getpic
│ ✦ *Alias:* ${currentPrefix}pfp
│
│ 📌 *¿Qué hace?*
│ Muestra la foto de perfil de un usuario.
│
│ 🧠 *¿Cómo funciona?*
│ Mencionas a alguien y el bot intenta obtener
│ la foto de perfil de esa persona.
│
│ 🧾 *Uso:*
│ ${currentPrefix}getpic @usuario
│ ${currentPrefix}pfp @usuario
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}pfp @RubyJX
╰──────────────────────────────────────────────╯

╭────────〔 🗣️ SAY / DECIR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}say
│ ✦ *Alias:* ${currentPrefix}decir
│
│ 📌 *¿Qué hace?*
│ Hace que el bot repita un mensaje.
│
│ 🧠 *¿Cómo funciona?*
│ Escribes un texto y el bot lo enviará tal como
│ fue escrito.
│
│ 🧾 *Uso:*
│ ${currentPrefix}say hola mundo
│ ${currentPrefix}decir bienvenidos
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}say Activen las reglas
╰──────────────────────────────────────────────╯

╭────────〔 🌐 GET / FETCH 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}get
│ ✦ *Alias:* ${currentPrefix}fetch
│
│ 📌 *¿Qué hace?*
│ Realiza una solicitud a una URL o página web.
│
│ 🧠 *¿Cómo funciona?*
│ Le pasas un enlace y el bot intenta obtener
│ información o contenido desde ese recurso.
│
│ 🧾 *Uso:*
│ ${currentPrefix}get https://ejemplo.com
│ ${currentPrefix}fetch https://api.github.com
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}get https://google.com
│
│ ⚠ *Recomendación:*
│ Usa enlaces completos que empiecen con http o https.
╰──────────────────────────────────────────────╯

╭────────〔 🌍 TRAD / TRANSLATE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}trad
│ ✦ *Aliases:* ${currentPrefix}traducir • ${currentPrefix}translate
│
│ 📌 *¿Qué hace?*
│ Traduce texto al idioma que indiques.
│
│ 🧠 *¿Cómo funciona?*
│ Escribes el idioma y el texto a traducir, y el
│ bot devuelve la versión traducida.
│
│ 🧾 *Uso:*
│ ${currentPrefix}translate en / hola
│ ${currentPrefix}traducir pt / buenos días
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}trad en / como estas
│
│ ✅ *Recomendación:*
│ Separa idioma y texto para obtener mejores resultados.
╰──────────────────────────────────────────────╯

╭────────〔 🔗 TOURL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}tourl
│
│ 📌 *¿Qué hace?*
│ Convierte una imagen o video en un enlace.
│
│ 🧠 *¿Cómo funciona?*
│ Debes responder a un archivo multimedia y el bot
│ lo sube para devolverte una URL directa.
│
│ 🧾 *Uso:*
│ ${currentPrefix}tourl
│
│ 💡 *Ejemplo:*
│ Responde a una imagen y usa:
│ ${currentPrefix}tourl
╰──────────────────────────────────────────────╯

╭────────〔 🖼️ TOIMAGE / TOIMG 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}toimage
│ ✦ *Alias:* ${currentPrefix}toimg
│
│ 📌 *¿Qué hace?*
│ Convierte un sticker en imagen.
│
│ 🧠 *¿Cómo funciona?*
│ Respondes a un sticker y el bot lo transforma
│ en una imagen descargable o visible.
│
│ 🧾 *Uso:*
│ ${currentPrefix}toimg
│
│ 💡 *Ejemplo:*
│ Responde a un sticker y usa:
│ ${currentPrefix}toimage
╰──────────────────────────────────────────────╯

╭────────〔 📚 READ / READVIEWONCE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}read
│ ✦ *Alias:* ${currentPrefix}readviewonce
│
│ 📌 *¿Qué hace?*
│ Permite leer contenido de una sola vista.
│
│ 🧠 *¿Cómo funciona?*
│ Respondes a una imagen o video view once y el
│ bot intenta mostrar el contenido normalmente.
│
│ 🧾 *Uso:*
│ ${currentPrefix}read
│
│ 💡 *Ejemplo:*
│ Responde a una foto view once y usa:
│ ${currentPrefix}read
╰──────────────────────────────────────────────╯

╭────────〔 🔎 INSPECT / INSPECCIONAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}inspect
│ ✦ *Alias:* ${currentPrefix}inspeccionar
│
│ 📌 *¿Qué hace?*
│ Muestra información de grupos o canales.
│
│ 🧠 *¿Cómo funciona?*
│ Le pasas un enlace de invitación y el bot intenta
│ analizarlo para mostrar información útil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}inspect <url>
│ ${currentPrefix}inspeccionar <url>
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}inspect https://chat.whatsapp.com/xxxx
╰──────────────────────────────────────────────╯

╭────────〔 ✨ HD / ENHANCE / REMINI 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}hd
│ ✦ *Aliases:* ${currentPrefix}enhance • ${currentPrefix}remini
│
│ 📌 *¿Qué hace?*
│ Mejora la calidad de una imagen.
│
│ 🧠 *¿Cómo funciona?*
│ Respondes a una imagen y el bot intenta aumentar
│ su nitidez o mejorar su calidad visual.
│
│ 🧾 *Uso:*
│ ${currentPrefix}hd
│ ${currentPrefix}enhance
│
│ 💡 *Ejemplo:*
│ Responde a una foto y usa:
│ ${currentPrefix}remini
╰──────────────────────────────────────────────╯

╭────────〔 🧬 GITCLONE / GIT 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}gitclone
│ ✦ *Alias:* ${currentPrefix}git
│
│ 📌 *¿Qué hace?*
│ Busca o descarga un repositorio de GitHub.
│
│ 🧠 *¿Cómo funciona?*
│ Puedes enviar una URL o una búsqueda para que
│ el bot localice o descargue el repositorio.
│
│ 🧾 *Uso:*
│ ${currentPrefix}gitclone <url>
│ ${currentPrefix}git <url|query>
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}git https://github.com/usuario/repo
╰──────────────────────────────────────────────╯

╭────────〔 🌐 SSWEB / CAPTURA WEB 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}ssweb
│
│ 📌 *¿Qué hace?*
│ Toma una captura de una página web.
│
│ 🧠 *¿Cómo funciona?*
│ Le pasas un enlace y el bot genera una imagen
│ de esa página.
│
│ 🧾 *Uso:*
│ ${currentPrefix}ssweb https://ejemplo.com
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}ssweb https://openai.com
╰──────────────────────────────────────────────╯

╭────────〔 💡 SUG / SUGGEST 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}sug
│ ✦ *Alias:* ${currentPrefix}suggest
│
│ 📌 *¿Qué hace?*
│ Envía sugerencias a los moderadores o owner.
│
│ 🧠 *¿Cómo funciona?*
│ Escribes una idea o mejora y el bot la reenvía
│ como sugerencia.
│
│ 🧾 *Uso:*
│ ${currentPrefix}sug Agreguen nuevos comandos
│ ${currentPrefix}suggest Mejoren el menú
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}sug pongan más comandos de anime
╰──────────────────────────────────────────────╯

╭────────〔 📡 REPORT / REPORTE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}report
│ ✦ *Alias:* ${currentPrefix}reporte
│
│ 📌 *¿Qué hace?*
│ Envía un reporte de error o problema.
│
│ 🧠 *¿Cómo funciona?*
│ Escribes el fallo que encontraste y el sistema
│ lo manda a revisión.
│
│ 🧾 *Uso:*
│ ${currentPrefix}report El comando menu falla
│ ${currentPrefix}reporte bug en sticker
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}report no funciona play2
╰──────────────────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}