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
      '8': 'group',
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
      stickermenu: 'stickers',
      utilities: 'utilities',
      utility: 'utilities',
      utils: 'utilities',
      grupo: 'group',
      groups: 'group',
      group: 'group',
      nsfw: 'nsfw',
      anime: 'anime'
    }

    const selected = map[query]

    const openMenu = async (pluginKey, cmdName) => {
      const plugin =
        global.plugins?.[pluginKey]?.default ||
        global.plugins?.[pluginKey]

      if (plugin?.run) {
        return plugin.run(client, m, [], currentPrefix, cmdName, '')
      }
      return null
    }

    if (selected === 'economia') return await openMenu('economia', 'economia')
    if (selected === 'gacha') return await openMenu('gacha', 'gacha')
    if (selected === 'downloads') return await openMenu('downloads', 'downloads')
    if (selected === 'profile') return await openMenu('profile', 'profile')
    if (selected === 'sockets') return await openMenu('socket', 'sockets')
    if (selected === 'stickers') return await openMenu('sticker', 'stickers')
    if (selected === 'utilities') return await openMenu('utilities', 'utilities')
    if (selected === 'group') return await openMenu('group', 'group')
    if (selected === 'nsfw') return await openMenu('nsfw', 'nsfw')
    if (selected === 'anime') return await openMenu('anime', 'anime')

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
> ${currentPrefix}menu group o ${currentPrefix}menu 8

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