export default {
  command: ['topinactive', 'topinactivos', 'topinactiveusers'],
  category: 'group',

  run: async (client, m, args, command, text, prefix) => {
    if (!m.isGroup) return m.reply('「✎」 Este comando solo funciona en grupos.')

    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId] || {}
    const groupUsers = chatData.users || {}
    const now = new Date()

    let daysArg = args[0] ? parseInt(args[0]) : 30
    if (isNaN(daysArg) || daysArg < 1) daysArg = 30

    const cutoff = new Date(now.getTime() - daysArg * 24 * 60 * 60 * 1000)

    const metadata = await client.groupMetadata(chatId)
    const participants = metadata.participants || []

    const ranking = participants
      .map(participant => {
        const jid = participant.id
        const userData = groupUsers[jid] || {}
        const stats = userData.stats || {}

        const days = Object.entries(stats).filter(([date]) => {
          return new Date(date) >= cutoff
        })

        const totalMsgs = days.reduce((acc, [, d]) => {
          return acc + (d.msgs || 0)
        }, 0)

        return {
          jid,
          totalMsgs,
          isAdmin: Boolean(participant.admin)
        }
      })
      .filter(user => user.jid.endsWith('@s.whatsapp.net'))
      .sort((a, b) => a.totalMsgs - b.totalMsgs)

    if (ranking.length === 0) {
      return m.reply('「✎」 No hay participantes registrados en este grupo.')
    }

    const page = parseInt(args[1]) || 1
    const perPage = 10
    const totalPages = Math.ceil(ranking.length / perPage)

    if (page < 1 || page > totalPages) {
      return m.reply(`「✎」 Página inválida. Solo hay ${totalPages} páginas disponibles.`)
    }

    const start = (page - 1) * perPage
    const end = start + perPage
    const pageRanking = ranking.slice(start, end)

    let report = `❀ Top de usuarios inactivos del grupo ❀\n`
    report += `> » Grupo: *${metadata.subject || 'Sin nombre'}*\n`
    report += `> » Días revisados: \`${daysArg}\`\n`
    report += `> » Página: \`${page}\` de \`${totalPages}\`\n`
    report += `> » Solo miembros actuales del grupo\n\n`

    const mentions = []

    pageRanking.forEach((u, i) => {
      const participant = participants.find(p => p.id === u.jid)

const name =
  participant?.name ||
  participant?.notify ||
  '@' + u.jid.split('@')[0]
      const adminTag = u.isAdmin ? ' 👑 Admin' : ''
      const status = u.totalMsgs === 0 ? '⚠️ SIN MENSAJES' : '💬 BAJA ACTIVIDAD'

      report += `*${start + i + 1}.* ${name}${adminTag}\n`
      report += `   » Mensajes en ${daysArg} días: \`${u.totalMsgs}\`\n`
      report += `   » Estado: ${status}\n\n`

      mentions.push(u.jid)
    })

    if (page < totalPages) {
      report += `> Para ver la siguiente página › *${prefix + command} ${daysArg} ${page + 1}*`
    }

    await client.reply(chatId, report, m, { mentions })
  }
}