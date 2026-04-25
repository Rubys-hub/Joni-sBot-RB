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
      '11': 'interacciones',

      economia: 'economia',
      economy: 'economia',

      gacha: 'gacha',

      downloads: 'downloads',
      download: 'downloads',

      profile: 'profile',
      profiles: 'profile',
      perfil: 'profile',

      sockets: 'sockets',
      socket: 'sockets',

      stickers: 'stickers',
      sticker: 'stickers',

      utilities: 'utilities',
      utility: 'utilities',
      utils: 'utilities',
      tools: 'utilities',

      grupo: 'group',
      groups: 'group',
      group: 'group',

      nsfw: 'nsfw',

      anime: 'anime',

      interacciones: 'interacciones',
      interactions: 'interacciones'
    }

    const selected = map[query]

    const openMenu = async (pluginKey, cmdName) => {
      const plugin =
        global.plugins?.[pluginKey]?.default ||
        global.plugins?.[pluginKey]

      if (plugin?.run) {
        return plugin.run(client, m, [], currentPrefix, cmdName, '')
      }
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
    if (selected === 'interacciones') return await openMenu('interacciones', 'interacciones')

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Aquí tienes el panel de *menús disponibles*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ 〔 MAIN MENU 〕 ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│⟐ *OWNER ::* RubyJX
│⟡ *TYPE ::* SYSTEM
│⎔ *VERSION ::* ^3.0 - Latest
│⟣ *DEVICE ::* ACTIVE
│⌬ *STATUS ::* ONLINE
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

*1.* 💰 *ECONOMIA* (17)
> ${currentPrefix}menu economia o ${currentPrefix}menu 1

*2.* 🎴 *GACHA* (25)
> ${currentPrefix}menu gacha o ${currentPrefix}menu 2

*3.* ⬇️ *DOWNLOADS* (12)
> ${currentPrefix}menu downloads o ${currentPrefix}menu 3

*4.* 👤 *PROFILE* (14)
> ${currentPrefix}menu profile o ${currentPrefix}menu 4

*5.* 🔐 *SOCKETS* (18)
> ${currentPrefix}menu sockets o ${currentPrefix}menu 5

*6.* 🎨 *STICKERS* (17)
> ${currentPrefix}menu stickers o ${currentPrefix}menu 6

*7.* 🛠️ *UTILITIES* (13)
> ${currentPrefix}menu utilities o ${currentPrefix}menu 7

*8.* 👥 *GROUP* (30+)
> ${currentPrefix}menu group o ${currentPrefix}menu 8

*9.* 🔞 *NSFW* (12)
> ${currentPrefix}menu nsfw o ${currentPrefix}menu 9

*10.* 🌌 *ANIME* (3)
> ${currentPrefix}menu anime o ${currentPrefix}menu 10

*11.* ❤️ *INTERACCIONES* (60+)
> ${currentPrefix}menu interacciones o ${currentPrefix}menu 11

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ 〔 ACCESS 〕 ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│⟐ *Ver categoría*
│   ${currentPrefix}menu <nombre>
│
│⟡ *Ejemplo*
│   ${currentPrefix}menu interacciones
│
│⎔ *Menú completo*
│   ${currentPrefix}menutotal
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}