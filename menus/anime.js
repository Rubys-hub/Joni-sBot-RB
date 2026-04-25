export default {
  command: ['anime'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *anime*

╭────────────〔 🌌 ANIME SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 4 comandos
│ ⎔ *MODO ::* Imágenes y contenido anime
╰────────────────────────────────────────────╯

╭────────〔 😍 WAIFU 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}waifu
│
│ 📌 *¿Qué hace?*
│ Envía una imagen aleatoria de waifu.
│
│ 🧾 *Uso:*
│ ${currentPrefix}waifu
╰─────────────────────────────╯

╭────────〔 🐱 NEKO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}neko
│
│ 📌 *¿Qué hace?*
│ Envía una imagen aleatoria de neko.
│
│ 🧾 *Uso:*
│ ${currentPrefix}neko
╰────────────────────────────╯

╭────────〔 💞 PPCOUPLE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}ppcouple
│ ✦ *Alias:* ${currentPrefix}ppcp
│
│ 📌 *¿Qué hace?*
│ Envía imágenes de pareja para foto de perfil.
│
│ 🧾 *Uso:*
│ ${currentPrefix}ppcouple
╰───────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, {
      text: textMenu,
      contextInfo: {
        externalAdReply: {
          title: settings.nameid || 'RubyJX Bot',
          body: 'Ver canal oficial',
          thumbnailUrl: settings.icon || settings.banner || undefined,
          sourceUrl: settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    }, { quoted: m })
  }
}