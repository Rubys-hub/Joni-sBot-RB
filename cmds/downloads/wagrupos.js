import { getBuffer } from '../../core/message.js'

export default {
  command: ['wpgrupos', 'gruposwa', 'wagrupos'],
  category: 'internet',

  run: async (client, m, args, usedPrefix, command) => {
    const currentPrefix = usedPrefix || '.'
    const currentCommand = command || 'wagrupos'

    if (!args || !args[0]) {
      return m.reply(`╭━━━〔 🔎 *WA GRUPOS* 〕━━━╮
┃
┃ Ingresa una categoría para buscar.
┃
┃ 📌 *Ejemplo:*
┃ ➤ *${currentPrefix + currentCommand} amistad*
┃ ➤ *${currentPrefix + currentCommand} anime 5*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    try {
      const lastArg = args[args.length - 1]
      const hasLimit = !isNaN(lastArg)

      const limite = hasLimit
        ? Math.min(Math.max(parseInt(lastArg, 10), 1), 20)
        : 10

      const categoria = hasLimit
        ? args.slice(0, -1).join(' ').toLowerCase()
        : args.join(' ').toLowerCase()

      const axiUrl = global.APIs?.axi?.url
const axiKey = global.APIs?.axi?.key

if (!axiUrl) {
  throw new Error('No existe global.APIs.axi.url en settings.js')
}

const api = axiKey
  ? `${axiUrl}/search/wpgrupos?categoria=${encodeURIComponent(categoria)}&limite=${limite}&key=${axiKey}`
  : `${axiUrl}/search/wpgrupos?categoria=${encodeURIComponent(categoria)}&limite=${limite}`

      const res = await fetch(api)

if (!res.ok) {
  if (res.status === 402) {
    throw new Error('La API AXI rechazó la solicitud: requiere key, saldo o plan activo')
  }

  throw new Error(`API respondió con estado ${res.status}`)
}

      const json = await res.json()

      if (!json?.status || !json?.resultado?.grupos?.length) {
        return m.reply(`╭━━━〔 ❌ *SIN RESULTADOS* 〕━━━╮
┃
┃ No se encontraron grupos para:
┃ *${categoria}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      const grupos = json.resultado.grupos.filter(v => v.estado === 'ok' && v.enlace)

      if (!grupos.length) {
        return m.reply(`╭━━━〔 ⚠️ *SIN ENLACES* 〕━━━╮
┃
┃ Se encontraron resultados en:
┃ *${categoria}*
┃
┃ Pero ninguno tiene enlace disponible.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      let thumbnail = null

      try {
        const thumb = 'https://iili.io/qp681b1.jpg'
        thumbnail = await getBuffer(thumb)
      } catch {}

      let teks = `> 𖧧 *RubyJX* 🔎
> Búsqueda de grupos WhatsApp ✨

╭━━━〔 🌐 *WA GRUPOS* 〕━━━╮
┃ 📌 *Categoría:* ${json.resultado.categoria || categoria}
┃ 📊 *Total API:* ${json.resultado.total || grupos.length}
┃ 📋 *Mostrando:* ${grupos.length}
╰━━━━━━━━━━━━━━━━━━━━━━╯

`

      teks += grupos.map((v, i) => {
        return `╭━━━〔 ${i + 1}. *${v.nombre || 'Grupo sin nombre'}* 〕━━━╮
┃ 🌎 *País:* ${v.pais || 'No especificado'}
┃ 🏷️ *Categoría:* ${v.categoria || categoria}
┃ ✅ *Estado:* ${v.estado || 'ok'}
┃ 🔗 *Url:* ${v.enlace}
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      }).join('\n\n')

      await client.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              title: 'RubyJX • WA Grupos',
              body: `Categoría: ${categoria}`,
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: false,
              thumbnail,
              sourceUrl: grupos[0]?.enlace || ''
            }
          }
        },
        { quoted: m }
      )

    } catch (e) {
      await m.reply(`╭━━━〔 ❌ *ERROR WA GRUPOS* 〕━━━╮
┃
┃ Ocurrió un error al ejecutar:
┃ *${currentPrefix + currentCommand}*
┃
┃ ⚠️ Detalle:
┃ *${e.message}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
    }
  }
}