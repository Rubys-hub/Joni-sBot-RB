export default {
  command: ['gacha', 'menugacha'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const p = usedPrefix || '.'
    const name = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const text = `> 𖧧 *Hola, ${name}*
> Accediste al sistema de *gacha*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│              ⟐ *G A C H A* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: GACHA SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 🎴 GACHA SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 25 comandos
│ ⎔ *MODO ::* Waifus, colección y sistema RPG
╰────────────────────────────────────────────╯

╭────────〔 🎲 BÁSICOS 〕────────╮
│ ${p}gacha — invocar personaje
│ ${p}waifu — obtener waifu
│ ${p}husbando — obtener husbando
│ ${p}random — personaje aleatorio
╰──────────────────────────────╯

╭────────〔 📚 COLECCIÓN 〕────────╮
│ ${p}inv — ver inventario
│ ${p}collection — colección completa
│ ${p}claim — reclamar personaje
│ ${p}release — liberar personaje
│ ${p}favorite — marcar favorito
│ ${p}deletefav — eliminar favorito
╰────────────────────────────────╯

╭────────〔 💱 INTERACCIÓN 〕────────╮
│ ${p}trade — intercambiar personajes
│ ${p}accept — aceptar intercambio
│ ${p}aceptar — aceptar acción
│ ${p}gift — regalar personaje
│ ${p}robwaifu — robar personaje
╰────────────────────────────────╯

╭────────〔 📊 INFO 〕────────╮
│ ${p}charinfo — info personaje
│ ${p}topwaifu — ranking
│ ${p}searchwaifu — buscar personaje
╰───────────────────────────╯

╭────────〔 🎬 MULTIMEDIA 〕────────╮
│ ${p}charimage — imagen personaje
│ ${p}charvideo — video personaje
╰──────────────────────────────╯

╭────────〔 ⚙️ SISTEMA 〕────────╮
│ ${p}daily — recompensa diaria
│ ${p}cooldown — ver tiempos
│ ${p}resetgacha — reiniciar progreso
╰──────────────────────────────╯

╭────────〔 🎯 EXTRA 〕────────╮
│ ${p}waifuvideo — video alternativo
│ ${p}cvideo — alias video
│ ${p}wvideo — alias video
╰────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${p}menu
│ ⟡ ${p}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(
      m.chat,
      {
        text,
        contextInfo: {
          externalAdReply: {
            title: settings.nameid || 'RubyJX Bot',
            body: 'Ver canal oficial',
            thumbnailUrl: settings.icon || settings.banner || undefined,
            sourceUrl: settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )
  }
}