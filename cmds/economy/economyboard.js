export default {
  command: ['economyboard', 'eboard', 'baltop'],
  category: 'rpg',

  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'

    const botSettings = db.settings?.[botId] || {}
    const monedas = botSettings.currency || 'coins'
    const botName = botSettings.namebot || botSettings.botname || 'RubyJX Bot'

    const chatData = db.chats?.[chatId] || {}
    const cmd = command || 'economyboard'


const excludedNumbers = new Set([
  '51901931862',
  ...(Array.isArray(global.owner)
    ? global.owner.map(v => String(v).replace(/\D/g, ''))
    : [])
])

const isExcludedOwner = (jid) => {
  const number = String(jid).split('@')[0].replace(/\D/g, '')
  return excludedNumbers.has(number)
}

const isExcludedUser = (jid) => {
  const number = String(jid).split('@')[0].replace(/\D/g, '')
  return excludedNumbers.has(number)
}

    if (chatData.adminonly || !chatData.economy) {
      return m.reply(`╭━━━〔 💰 *ECONOMÍA DESACTIVADA* 〕━━━╮
┃
┃ ⚠️ Los comandos de *Economía* están
┃ desactivados en este grupo.
┃
┃ 👑 Un *administrador* puede activarlos con:
┃
┃ ➤ *${usedPrefix}economy on*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    try {
const users = Object.entries(chatData.users || {})
  .filter(([jid, data]) => {
    if (isExcludedOwner(jid)) return false

    const total = (data.coins || 0) + (data.bank || 0)
    return total >= 1000
  })
        .map(([jid, data]) => {
          const name = db.users?.[jid]?.name || data.name || 'Usuario'
          const coins = data.coins || 0
          const bank = data.bank || 0
          const total = coins + bank

          return {
            jid,
            name,
            coins,
            bank,
            total
          }
        })

      if (users.length === 0) {
        return m.reply(`╭━━━〔 🏦 *ECONOMY BOARD* 〕━━━╮
┃
┃ 😿 Aún no hay usuarios con más de
┃ *1,000 ${monedas}* en este grupo.
┃
┃ 💼 Usa *${usedPrefix}work* para ganar dinero.
┃ 🎁 Usa *${usedPrefix}daily* para reclamar recompensa.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      const sorted = users.sort((a, b) => b.total - a.total)

      const page = parseInt(args[0]) || 1
      const pageSize = 10
      const totalPages = Math.ceil(sorted.length / pageSize)

      if (isNaN(page) || page < 1 || page > totalPages) {
        return m.reply(`╭━━━〔 ❌ *PÁGINA NO ENCONTRADA* 〕━━━╮
┃
┃ La página *${page}* no existe.
┃
┃ 📄 Páginas disponibles: *1 - ${totalPages}*
┃
┃ Usa:
┃ ➤ *${usedPrefix + cmd} 1*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageUsers = sorted.slice(start, end)

      const medals = ['🥇', '🥈', '🥉']

      let text = `> 𖧧 *${botName}* 💰
> Ranking económico del grupo ✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│             ⟐ *E C O N O M Y  B O A R D* ⟐
│
│        💰 TYPE :: RANKING ECONÓMICO
│        🏦 MODE :: COINS + BANK
│        👥 USERS :: ${sorted.length}
│        📄 PAGE :: ${page}/${totalPages}
│        🟢 STATUS :: ACTIVE
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🏆 *TOP ECONOMÍA* 🏆 𓆪
        ✨ *Mínimo requerido:* 1,000 ${monedas}
        ⚡ *Ordenado por:* cartera + banco



`

text += pageUsers.map((user, i) => {
  const rank = start + i + 1
  const medal = medals[rank - 1] || '🏅'

  return `${medal} *TOP ${rank}* — *${user.name}*
┃ 🏦 Banco: *${user.bank.toLocaleString('es-PE')} ${monedas}*
┃ 💰 Total acumulado: *${user.total.toLocaleString('es-PE')} ${monedas}*`
}).join('\n\n')

      text += `



        𓆩 📄 *PÁGINA ${page}/${totalPages}* 📄 𓆪`

      if (page < totalPages) {
        text += `

➡️ *Siguiente página:*
*${usedPrefix + cmd} ${page + 1}*`
      }

      if (page > 1) {
        text += `

⬅️ *Página anterior:*
*${usedPrefix + cmd} ${page - 1}*`
      }

      text += `

🏠 *Tip:* Usa *${usedPrefix}balance* para ver tu dinero.`

      await client.sendMessage(
        chatId,
        { text },
        { quoted: m }
      )

    } catch (e) {
      await m.reply(`╭━━━〔 ❌ *ERROR ECONOMYBOARD* 〕━━━╮
┃
┃ Ocurrió un error al ejecutar:
┃ *${usedPrefix + cmd}*
┃
┃ ⚠️ Detalle:
┃ *${e.message}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
    }
  }
}