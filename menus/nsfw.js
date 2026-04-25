export default {
  command: ['menunsfw', 'nsfwmenu'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema *NSFW*

╭────────────〔 🔞 NSFW SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 12 comandos
╰───────────────────────────────────────────╯

╭────────〔 🍑 IMÁGENES 〕────────╮
│ ✦ ${currentPrefix}waifu — nsfw
│ ✦ ${currentPrefix}neko — nsfw
│ ✦ ${currentPrefix}hentai — hentai
│ ✦ ${currentPrefix}trap — contenido
╰──────────────────────────────╯

╭────────〔 🔥 ACCIONES 〕────────╮
│ ✦ ${currentPrefix}blowjob — acción
│ ✦ ${currentPrefix}fuck — acción
│ ✦ ${currentPrefix}anal — acción
│ ✦ ${currentPrefix}cum — acción
│ ✦ ${currentPrefix}orgy — acción
╰──────────────────────────────╯

╭────────〔 ⚙️ CONTROL 〕────────╮
│ ✦ ${currentPrefix}nsfw — activar/desactivar
╰──────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}