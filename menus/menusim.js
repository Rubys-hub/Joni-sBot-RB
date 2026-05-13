export default {
  command: ['menu'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const query = (text || '').toLowerCase().trim()

    const botRaw = client.user?.id || ''
    const botId = botRaw.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const botName = settings.botname || settings.namebot || 'RubyJX Bot'
    const channelName = settings.nameid || global.my?.name || 'RubyJX Channel'
    const channelJid = settings.id || global.my?.ch || '120363424461852442@newsletter'
    const channelLink = settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
    const thumbnail = settings.icon || settings.banner || undefined

    const senderNum = m.sender.split('@')[0]
    const userTag = `@${senderNum}`

    const owners = Array.isArray(global.owner)
      ? global.owner.map(v => String(v).replace(/\D/g, ''))
      : []

    const isOwner = !!m.isOwner || owners.includes(senderNum)

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
      '12': 'reactions',

      economia: 'economia',
      economy: 'economia',
      rpg: 'economia',

      gacha: 'gacha',
      waifu: 'gacha',

      downloads: 'downloads',
      download: 'downloads',
      descargas: 'downloads',

      profile: 'profile',
      profiles: 'profile',
      perfil: 'profile',

      sockets: 'sockets',
      socket: 'sockets',
      subbot: 'sockets',
      subbots: 'sockets',

      stickers: 'stickers',
      sticker: 'stickers',

      utilities: 'utilities',
      utility: 'utilities',
      utils: 'utilities',
      tools: 'utilities',
      utilidades: 'utilities',

      grupo: 'group',
      grupos: 'group',
      group: 'group',
      groups: 'group',

      nsfw: 'nsfw',

      anime: 'anime',

      interacciones: 'interacciones',
      interactions: 'interacciones',

      reactions: 'reactions',
      reaction: 'reactions',
      reacciones: 'reactions',
      react: 'reactions',

      owner: 'owner',
      menuowner: 'owner',
      ownerpanel: 'owner'
    }

    const openMenu = async (pluginKey, cmdName) => {
      const plugin =
        global.plugins?.[pluginKey]?.default ||
        global.plugins?.[pluginKey]

      if (plugin?.run) {
        return plugin.run(client, m, [], currentPrefix, cmdName, '')
      }

      return m.reply(`⚠️ El menú *${cmdName}* aún no está cargado.`)
    }

    const selected = map[query]

    if (selected === 'owner') {
      if (!isOwner) {
        return m.reply(`╭━━━〔 ❌ *COMANDO NO ENCONTRADO* 〕━━━╮
┃
┃ El comando solicitado no existe.
┃ Usa *${currentPrefix}menu* para ver los menús disponibles.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      return await openMenu('owner', 'owner')
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
    if (selected === 'reactions') return await openMenu('reactions', 'reactions')

    const textMenu = `> 𖧧 *Hola, ${pushname}* 🧸
> Bienvenido al menú principal de *${botName}* ✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *M A I N  M E N U* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: MAIN MENU 📋
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🧭 *CATEGORÍAS DISPONIBLES* 🧭 𓆪
        ✨ *Menús públicos:* 12
        ⚡ *Usa los comandos para abrir cada menú*



💰 *1. ECONOMÍA*
> Dinero, banco, recompensas y apuestas.
> Usa: *${currentPrefix}menu economia* o *${currentPrefix}menu 1*

🎴 *2. GACHA*
> Waifus, colección, tienda e intercambios.
> Usa: *${currentPrefix}menu gacha* o *${currentPrefix}menu 2*

📥 *3. DOWNLOADS*
> Descargas, búsquedas y recursos.
> Usa: *${currentPrefix}menu downloads* o *${currentPrefix}menu 3*

👤 *4. PROFILE*
> Perfil, nivel, datos personales y pareja.
> Usa: *${currentPrefix}menu profile* o *${currentPrefix}menu 4*

🔐 *5. SOCKETS*
> Subbots, sesiones y configuración.
> Usa: *${currentPrefix}menu sockets* o *${currentPrefix}menu 5*

🎨 *6. STICKERS*
> Crear, editar y gestionar stickers.
> Usa: *${currentPrefix}menu stickers* o *${currentPrefix}menu 6*

🛠️ *7. UTILITIES*
> Herramientas, conversión, IA y texto.
> Usa: *${currentPrefix}menu utilities* o *${currentPrefix}menu 7*

👥 *8. GROUP*
> Moderación, configuración y seguridad.
> Usa: *${currentPrefix}menu group* o *${currentPrefix}menu 8*

🔞 *9. NSFW*
> Búsquedas y acciones NSFW.
> Usa: *${currentPrefix}menu nsfw* o *${currentPrefix}menu 9*

🌌 *10. ANIME*
> Waifu, neko, ppcouple y extras anime.
> Usa: *${currentPrefix}menu anime* o *${currentPrefix}menu 10*

💞 *11. INTERACCIONES*
> Acciones, emociones, gestos y convivencia.
> Usa: *${currentPrefix}menu interacciones* o *${currentPrefix}menu 11*

🎯 *12. REACTIONS*
> Compra, equipa y usa reacciones automáticas.
> Usa: *${currentPrefix}menu reactions* o *${currentPrefix}menu 12*



📋 *MENÚ COMPLETO*
> Usa: *${currentPrefix}menutotal*

👑 *OWNER*
> Usa: *${currentPrefix}menu owner*
> Solo disponible para el owner.



╭━━━〔 📌 *EJEMPLOS* 〕━━━╮
┃
┃ ${currentPrefix}menu economia
┃ ${currentPrefix}menu gacha
┃ ${currentPrefix}menu downloads
┃ ${currentPrefix}menu group
┃ ${currentPrefix}menutotal
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`

    await client.sendMessage(
      m.chat,
      {
        text: textMenu
      },
      { quoted: m }
    )

    await new Promise(resolve => setTimeout(resolve, 700))

    try {
      const externalAdReply = {
        title: channelName,
        body: 'Ver canal oficial',
        sourceUrl: channelLink,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }

      if (typeof thumbnail === 'string' && thumbnail.startsWith('http')) {
        externalAdReply.thumbnailUrl = thumbnail
      }

      await client.sendMessage(
        m.chat,
        {
          text: `📢 *Canal oficial de ${botName}* ${channelLink}`,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: channelJid,
              newsletterName: channelName,
              serverMessageId: '1'
            },
            externalAdReply
          }
        },
        { quoted: m }
      )
    } catch (e) {
      await client.sendMessage(
        m.chat,
        {
          text: `📢 *Canal oficial de ${botName}:*\n${channelLink}`
        },
        { quoted: m }
      )
    }

    return
  }
}