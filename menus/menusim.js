export default {
  command: ['menu'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const query = (text || '').toLowerCase().trim()

    const map = {
      '1': 'economia',
      '2': 'gacha',
      '3': 'downloads',
      '4': 'profile',
      '5': 'sockets',
      '6': 'stickers',
      '7': 'utilities',
      '8': 'grupo',
      '9': 'nsfw',
      '10': 'anime',

      economia: 'economia',
      economy: 'economia',
      gacha: 'gacha',
      downloads: 'downloads',
      download: 'downloads',
      profile: 'profile',
      profiles: 'profile',
      sockets: 'sockets',
      socket: 'sockets',
      stickers: 'stickers',
      sticker: 'stickers',
      utilities: 'utilities',
      utility: 'utilities',
      grupo: 'grupo',
      groups: 'grupo',
      group: 'grupo',
      nsfw: 'nsfw',
      anime: 'anime'
    }

    const selected = map[query]

    if (selected === 'economia' && global.plugins?.economia?.default?.run) {
      return global.plugins.economia.default.run(client, m, [], currentPrefix, 'economia', '')
    }

    if (selected === 'gacha' && global.plugins?.gacha?.default?.run) {
      return global.plugins.gacha.default.run(client, m, [], currentPrefix, 'gacha', '')
    }

    if (selected === 'downloads' && global.plugins?.downloads?.default?.run) {
      return global.plugins.downloads.default.run(client, m, [], currentPrefix, 'downloads', '')
    }

    if (selected === 'profile' && global.plugins?.profile?.default?.run) {
      return global.plugins.profile.default.run(client, m, [], currentPrefix, 'profile', '')
    }

    if (selected === 'sockets' && global.plugins?.sockets?.default?.run) {
      return global.plugins.sockets.default.run(client, m, [], currentPrefix, 'sockets', '')
    }

    if (selected === 'stickers' && global.plugins?.stickers?.default?.run) {
      return global.plugins.stickers.default.run(client, m, [], currentPrefix, 'stickers', '')
    }

    if (selected === 'utilities' && global.plugins?.utilities?.default?.run) {
      return global.plugins.utilities.default.run(client, m, [], currentPrefix, 'utilities', '')
    }

    if (selected === 'grupo' && global.plugins?.grupo?.default?.run) {
      return global.plugins.grupo.default.run(client, m, [], currentPrefix, 'grupo', '')
    }

    if (selected === 'nsfw' && global.plugins?.nsfw?.default?.run) {
      return global.plugins.nsfw.default.run(client, m, [], currentPrefix, 'nsfw', '')
    }

    if (selected === 'anime' && global.plugins?.anime?.default?.run) {
      return global.plugins.anime.default.run(client, m, [], currentPrefix, 'anime', '')
    }

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Aquí tienes el panel de *menús disponibles*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│⟐ *OWNER ::* RubyJX
│⟡ *TYPE ::* SYSTEM
│⎔ *VERSION ::* ^3.0 - Latest
│⟣ *DEVICE ::* ACTIVE
│⌬ *STATUS ::* ONLINE
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

*1.* 💰 *ECONOMY* (26)
> ${currentPrefix}menu economia o ${currentPrefix}menu 1

*2.* 🎴 *GACHA* (21)
> ${currentPrefix}menu gacha o ${currentPrefix}menu 2

*3.* ⬇️ *DOWNLOAD* (12)
> ${currentPrefix}menu downloads o ${currentPrefix}menu 3

*4.* 👤 *PROFILES* (15)
> ${currentPrefix}menu profile o ${currentPrefix}menu 4

*5.* 🔐 *SOCKETS* (18)
> ${currentPrefix}menu sockets o ${currentPrefix}menu 5

*6.* 🧩 *STICKERS* (15)
> ${currentPrefix}menu stickers o ${currentPrefix}menu 6

*7.* 🛠️ *UTILITIES* (18)
> ${currentPrefix}menu utilities o ${currentPrefix}menu 7

*8.* 👥 *GROUPS* (30)
> ${currentPrefix}menu grupo o ${currentPrefix}menu 8

*9.* 🔞 *NSFW* (38)
> ${currentPrefix}menu nsfw o ${currentPrefix}menu 9

*10.* 🌌 *ANIME* (69)
> ${currentPrefix}menu anime o ${currentPrefix}menu 10

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ 〔 ACCESS 〕 ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│⟐ *Ver categoría*
│   ${currentPrefix}menu <nombre>
│⟡ *Ejemplo*
│   ${currentPrefix}menu anime
│⎔ *Menú completo*
│   ${currentPrefix}menutotal
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}