export default {
  command: ['interacciones', 'interactions'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings?.[botId] || {}

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *interacciones*

╭────────────〔 💞 INTERACCIONES 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 69 comandos aprox.
│ ⎔ *MODO ::* Acciones, reacciones y convivencia
╰─────────────────────────────────────────────╯

╭────────〔 ❤️ BÁSICAS 〕────────╮
│ ${currentPrefix}hug 🫂 (Abrazar)
│ ${currentPrefix}kiss 💋 (Besar)
│ ${currentPrefix}pat 👋 (Acariciar)
│ ${currentPrefix}slap 🖐️ (Bofetada)
│ ${currentPrefix}cuddle 🛌 (Acurrucarse)
│ ${currentPrefix}tickle 🤭 (Cosquillas)
│ ${currentPrefix}handhold 🤝 (Tomar la mano)
│ ${currentPrefix}highfive 🙌 (Chocar los cinco)
│ ${currentPrefix}blowkiss 😘 (Lanzar beso)
│ ${currentPrefix}snuggle 🤗 (Arrimarse)
╰───────────────────────────────╯

╭────────〔 😭 EMOCIONES 〕────────╮
│ ${currentPrefix}cry 😭 (Llorar)
│ ${currentPrefix}laugh 😂 (Reír)
│ ${currentPrefix}smile 😊 (Sonreír)
│ ${currentPrefix}blush 😊 (Sonrojarse)
│ ${currentPrefix}angry 😡 (Enojado)
│ ${currentPrefix}sad 😔 (Triste)
│ ${currentPrefix}happy 😄 (Feliz)
│ ${currentPrefix}shy 😳 (Tímido)
│ ${currentPrefix}scared 😨 (Asustado)
│ ${currentPrefix}bored 🥱 (Aburrido)
╰────────────────────────────────╯

╭────────〔 🎭 REACCIONES 〕────────╮
│ ${currentPrefix}dance 💃 (Bailar)
│ ${currentPrefix}wave 👋 (Saludar)
│ ${currentPrefix}wink 😉 (Guiñar)
│ ${currentPrefix}smug 😏 (Presumido)
│ ${currentPrefix}pout 😗 (Puchero)
│ ${currentPrefix}bleh 😛 (Sacar lengua)
│ ${currentPrefix}clap 👏 (Aplaudir)
│ ${currentPrefix}scream 😱 (Gritar)
│ ${currentPrefix}cringe 😬 (Cringe)
│ ${currentPrefix}nope 🙅 (No)
╰────────────────────────────────╯

╭────────〔 ⚔️ ACCIONES 〕────────╮
│ ${currentPrefix}bite 🦷 (Morder)
│ ${currentPrefix}lick 👅 (Lamer)
│ ${currentPrefix}bully 😈 (Molestar)
│ ${currentPrefix}punch 👊 (Puñetazo)
│ ${currentPrefix}kill 🔪 (Matar)
│ ${currentPrefix}bonk 🔨 (Bonk)
│ ${currentPrefix}push 🖐️ (Empujar)
│ ${currentPrefix}trip 🦶 (Tropezar)
│ ${currentPrefix}spit 💦 (Escupir)
│ ${currentPrefix}step 👣 (Pisar)
╰──────────────────────────────╯

╭────────〔 🧠 EXTRA 〕────────╮
│ ${currentPrefix}peek 👀 (Mirar a escondidas)
│ ${currentPrefix}comfort 🫂 (Consolar)
│ ${currentPrefix}sniff 👃 (Oler)
│ ${currentPrefix}stare 👁️ (Mirar fijamente)
│ ${currentPrefix}think 🤔 (Pensar)
│ ${currentPrefix}thinkhard 🤯 (Pensar mucho)
│ ${currentPrefix}curious 🧐 (Curioso)
│ ${currentPrefix}gaming 🎮 (Jugar)
│ ${currentPrefix}draw 🎨 (Dibujar)
│ ${currentPrefix}call 📞 (Llamar)
│ ${currentPrefix}seduce 🔥 (Seducir)
│ ${currentPrefix}follaragordo 🔞 (Follar a...)
╰────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu (Menú Principal)
│ ⟡ ${currentPrefix}menutotal (Menú Completo)
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