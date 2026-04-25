export default {
  command: ['economia', 'menueconomia'],
  category: 'main',

  run: async (client, m, args, usedPrefix) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *economía*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│           ⟐ *E C O N O M I A* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: ECONOMY SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│         ✦ CHANNEL :: https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F
│       ✦ COMMUNITY :: https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23
│  
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 💰 ECONOMY SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 17 comandos
│ ⎔ *MODO ::* Dinero, trabajo y apuestas
╰──────────────────────────────────────────────╯

╭────────〔 💵 BÁSICOS 〕────────╮
│ ✦ ${currentPrefix}balance — ver dinero
│ ✦ ${currentPrefix}daily — recompensa diaria
│ ✦ ${currentPrefix}work — trabajar
│ ✦ ${currentPrefix}beg — pedir dinero
│ ✦ ${currentPrefix}crime — crimen
│ ✦ ${currentPrefix}slut — acción arriesgada
│ ✦ ${currentPrefix}ritual — ritual especial
╰──────────────────────────────╯

╭────────〔 🎰 APUESTAS 〕────────╮
│ ✦ ${currentPrefix}slot — tragamonedas
│ ✦ ${currentPrefix}casino — apostar
│ ✦ ${currentPrefix}coinflip — cara o cruz
╰──────────────────────────────╯

╭────────〔 💸 TRANSFERENCIAS 〕────────╮
│ ✦ ${currentPrefix}pay — transferir dinero
│ ✦ ${currentPrefix}rob — robar dinero
╰──────────────────────────────╯

╭────────〔 🏦 BANCO 〕────────╮
│ ✦ ${currentPrefix}bank — ver banco
│ ✦ ${currentPrefix}deposit — depositar
│ ✦ ${currentPrefix}withdraw — retirar
╰────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}