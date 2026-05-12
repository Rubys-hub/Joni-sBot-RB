export default {
command: ['eboardglobal', 'economyboardglobal', 'baltopglobal'],
  category: 'rpg',

  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'

    const botSettings = db.settings?.[botId] || {}
    const monedas = botSettings.currency || 'coins'
    const botName = botSettings.namebot || botSettings.botname || 'RubyJX Bot'

    const chatData = db.chats?.[chatId] || {}
    const cmd = command || 'eboardglobal'

    const senderNumber = m.sender.split('@')[0].replace(/\D/g, '')

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
      return m.reply(`╭━━━〔 🌍 *ECONOMÍA DESACTIVADA* 〕━━━╮
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
      const globalUsers = new Map()

      for (const [groupId, groupData] of Object.entries(db.chats || {})) {
        if (!groupData?.users) continue

for (const [jid, data] of Object.entries(groupData.users || {})) {
  if (isExcludedOwner(jid)) continue

  const coins = Number(data.coins || 0)
  const bank = Number(data.bank || 0)
  const total = coins + bank

          if (total <= 0) continue

          const name = db.users?.[jid]?.name || data.name || 'Usuario'

          if (!globalUsers.has(jid)) {
            globalUsers.set(jid, {
              jid,
              name,
              bank: 0,
              total: 0,
              groups: 0
            })
          }

          const user = globalUsers.get(jid)
          user.bank += bank
          user.total += total
          user.groups += 1
        }
      }

      const users = [...globalUsers.values()]
        .filter(user => user.total >= 1000)
        .sort((a, b) => b.total - a.total)

      if (users.length === 0) {
        return m.reply(`╭━━━〔 🌍 *GLOBAL ECONOMY BOARD* 〕━━━╮
┃
┃ 😿 Aún no hay usuarios con más de
┃ *1,000 ${monedas}* registrados globalmente.
┃
┃ 💼 Usa *${usedPrefix}work* para ganar dinero.
┃ 🎁 Usa *${usedPrefix}daily* para reclamar recompensa.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      const page = parseInt(args[0]) || 1
      const pageSize = 10
      const totalPages = Math.ceil(users.length / pageSize)

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
      const pageUsers = users.slice(start, end)

      const medals = ['🥇', '🥈', '🥉']

      let text = `> 𖧧 *${botName}* 🌍
> Ranking económico global ✨



╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│          ⟐ *G L O B A L  E C O N O M Y* ⟐
│
│        🌍 TYPE :: GLOBAL RANKING
│        🏦 MODE :: ECONOMY SYSTEM
│        👥 USERS :: ${users.length}
│        📄 PAGE :: ${page}/${totalPages}
│        🟢 STATUS :: ACTIVE
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯



        𓆩 🌍 *TOP ECONOMÍA GLOBAL* 🌍 𓆪
        ✨ *Mínimo requerido:* 1,000 ${monedas}
        ⚡ *Ranking acumulado de todos los grupos*



`

      text += pageUsers.map((user, i) => {
        const rank = start + i + 1
        const medal = medals[rank - 1] || '🏅'

        return `${medal} *TOP ${rank}* — *${user.name}*
┃ 🏦 Banco global: *${user.bank.toLocaleString('es-PE')} ${monedas}*
┃ 💰 Total acumulado: *${user.total.toLocaleString('es-PE')} ${monedas}*
┃ 👥 Grupos registrados: *${user.groups}*`
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

🏠 *Tip:* Usa *${usedPrefix}eboardglobal* para ver el ranking global.`

      await client.sendMessage(
        chatId,
        { text },
        { quoted: m }
      )

    } catch (e) {
      await m.reply(`╭━━━〔 ❌ *ERROR EBOARDGLOBAL* 〕━━━╮
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