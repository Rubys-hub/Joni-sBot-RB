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
> Bienvenido al panel principal de *${botName}* ⚡✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *M A I N  M E N U* ⟐
│
│        𖧧 USER :: ${userTag} 🧑‍💻
│        ✦ BOT :: ${botName} 🤖
│        ⟡ OWNER :: RubyJX 👑
│        ⎔ TYPE :: BUTTON MENU 🧩
│        ⟣ VERSION :: ^3.0 - Latest ⚙️
│        ⌬ DEVICE :: ACTIVE 📲
│        ⟐ STATUS :: ONLINE 🟢
│        ✦ CHANNEL :: ${channelName} 📢
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🧭 *MENÚS DISPONIBLES* 🧭 𓆪
        ✨ *Categorías públicas:* 12
        ⚡ *Usa los botones para abrir cada menú*



💰 *1. ECONOMÍA* — *19 comandos*
> Sistema de dinero, banco, recompensas y apuestas.

🎴 *2. GACHA* — *26 comandos*
> Waifus, colección, tienda e intercambio.

📥 *3. DOWNLOADS* — *13 comandos*
> YouTube, redes, imágenes, archivos y apps.

👤 *4. PROFILE* — *14 comandos*
> Perfil, nivel, AFK, datos personales y pareja.

🔐 *5. SOCKETS* — *18 comandos*
> Subbots, sesiones, conexión y configuración.

🎨 *6. STICKERS* — *19 comandos*
> Crear, editar y gestionar stickers.

🛠️ *7. UTILITIES* — *31 comandos*
> Herramientas, IA, texto, web y conversión.

👥 *8. GROUP* — *54 comandos*
> Moderación, seguridad, configuración y estadísticas.

🔞 *9. NSFW* — *37 comandos*
> Búsquedas y acciones NSFW.

🌌 *10. ANIME* — *4 comandos*
> Waifu, neko, ppcouple y extras anime.

💞 *11. INTERACCIONES* — *67 comandos*
> Acciones, emociones, gestos y convivencia.

🎯 *12. REACTIONS*
> Compra, equipa y usa reacciones automáticas.



        𓆩 📌 *ACCESO MANUAL* 📌 𓆪

🔎 *${currentPrefix}menu nombre*
Ejemplo: *${currentPrefix}menu downloads*

🔢 *${currentPrefix}menu número*
Ejemplo: *${currentPrefix}menu 3*

📋 *${currentPrefix}menutotal*
Muestra el panel completo del bot.`

    await client.sendMessage(
      m.chat,
      {
        text: textMenu,
        footer: `${botName} • ${channelName}`,
        buttons: [
          {
            buttonId: `${currentPrefix}menutotal`,
            buttonText: { displayText: '📋 COMPLETO' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu economia`,
            buttonText: { displayText: '💰 ECONOMÍA' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu gacha`,
            buttonText: { displayText: '🎴 GACHA' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu downloads`,
            buttonText: { displayText: '📥 DOWNLOADS' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu profile`,
            buttonText: { displayText: '👤 PROFILE' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu sockets`,
            buttonText: { displayText: '🔐 SOCKETS' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu stickers`,
            buttonText: { displayText: '🎨 STICKERS' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu utilities`,
            buttonText: { displayText: '🛠️ UTILS' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu group`,
            buttonText: { displayText: '👥 GROUP' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu nsfw`,
            buttonText: { displayText: '🔞 NSFW' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu anime`,
            buttonText: { displayText: '🌌 ANIME' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu interacciones`,
            buttonText: { displayText: '💞 INTERACCIONES' },
            type: 1
          },
          {
            buttonId: `${currentPrefix}menu reactions`,
            buttonText: { displayText: '🎯 REACTIONS' },
            type: 1
          }
        ],
        headerType: 1,
        mentions: [m.sender],
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelJid,
            newsletterName: channelName,
            serverMessageId: '1'
          },
          externalAdReply: {
            title: channelName,
            body: 'Ver canal oficial',
            thumbnailUrl: thumbnail,
            sourceUrl: channelLink,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false
          }
        }
      },
      { quoted: m }
    )
  }
}