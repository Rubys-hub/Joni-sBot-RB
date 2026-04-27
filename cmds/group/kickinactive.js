const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const pendingKickInactive = new Map()

function getJidNumber(jid) {
  return jid.split('@')[0]
}

function getUserName(jid, participants) {
  const participant = participants.find(p => p.id === jid)
  return participant?.name || participant?.notify || '@' + getJidNumber(jid)
}

async function getInactiveRanking(client, m, daysArg = 30) {
  const db = global.db.data
  const chatId = m.chat
  const chatData = db.chats[chatId] || {}
  const groupUsers = chatData.users || {}

  const now = new Date()
  const cutoff = new Date(now.getTime() - daysArg * 24 * 60 * 60 * 1000)

  const metadata = await client.groupMetadata(chatId)
  const participants = metadata.participants || []

  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net'

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
    .filter(user => {
      if (!user.jid.endsWith('@s.whatsapp.net')) return false
      if (user.jid === botJid) return false
      if (user.isAdmin) return false
      return true
    })
    .sort((a, b) => a.totalMsgs - b.totalMsgs)

  return { ranking, metadata, participants }
}

async function kickUsers(client, m, users, participants, title) {
  const chatId = m.chat

  if (!users.length) return ''

  let report = `${title}\n\n`
  const mentions = []

  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    const jid = user.jid
    const name = getUserName(jid, participants)

    try {
      await client.groupParticipantsUpdate(chatId, [jid], 'remove')
      report += `✅ ${i + 1}. ${name} — ${user.totalMsgs} msgs\n`
      mentions.push(jid)
      await sleep(1500)
    } catch (e) {
      report += `❌ ${i + 1}. ${name} — no se pudo expulsar\n`
      mentions.push(jid)
    }
  }

  return { report, mentions }
}

export default {
  command: [
    'kickinactive',
    'kickinactivos',
    'kickinactivepage',
    'kickinactiveall'
  ],
  category: 'group',

  run: async (client, m, args, command, text, prefix) => {
    if (!m.isGroup) return m.reply('「✎」 Este comando solo funciona en grupos.')

    const chatId = m.chat
    const metadata = await client.groupMetadata(chatId)
    const participants = metadata.participants || []

    const sender = m.sender
    const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net'

    const senderIsAdmin = participants.some(p => p.id === sender && p.admin)
    const botIsAdmin = participants.some(p => p.id === botJid && p.admin)

    if (!senderIsAdmin) return m.reply('「✎」 Solo admins pueden usar este comando.')
    if (!botIsAdmin) return m.reply('「✎」 Necesito ser admin para expulsar usuarios.')

    const input = (text || args.join(' ') || '').toLowerCase().trim()

    const pendingKey = `${chatId}:${sender}`

    if (['si', 'sí', 's', 'yes', 'y'].includes(input)) {
      const pending = pendingKickInactive.get(pendingKey)

      if (!pending) {
        return m.reply('「✎」 No hay una expulsión pendiente para confirmar.')
      }

      pendingKickInactive.delete(pendingKey)

      const result = await kickUsers(
        client,
        m,
        pending.users,
        pending.participants,
        `⚠ *Expulsando usuarios con baja actividad*`
      )

      if (!result) return m.reply('「✎」 No hay usuarios para expulsar.')

      return await client.reply(chatId, result.report, m, {
        mentions: result.mentions
      })
    }

    if (['no', 'n'].includes(input)) {
      if (pendingKickInactive.has(pendingKey)) {
        pendingKickInactive.delete(pendingKey)
        return m.reply('「✎」 Cancelado. No expulsaré a los usuarios con baja actividad.')
      }
    }

    let daysArg = args[0] ? parseInt(args[0]) : 30
    if (isNaN(daysArg) || daysArg < 1) daysArg = 30

    const perPage = 10
    const { ranking, participants: groupParticipants } = await getInactiveRanking(client, m, daysArg)

    if (!ranking.length) {
      return m.reply(`「✎」 No hay usuarios registrados para revisar en este grupo.`)
    }

    const totalPages = Math.ceil(ranking.length / perPage)

    if (command === 'kickinactiveall') {
      const zeroUsers = ranking.filter(u => u.totalMsgs === 0)
      const lowUsers = ranking.filter(u => u.totalMsgs > 0 && u.totalMsgs < 10)

      let finalReport = `⚠ *Kick inactive — todas las páginas*\n`
      finalReport += `> Días revisados: \`${daysArg}\`\n`
      finalReport += `> Sin mensajes: \`${zeroUsers.length}\`\n`
      finalReport += `> Baja actividad: \`${lowUsers.length}\`\n\n`

      const mentions = []

      if (zeroUsers.length) {
        const kicked = await kickUsers(
          client,
          m,
          zeroUsers,
          groupParticipants,
          `🚫 *Expulsados con 0 mensajes*`
        )

        finalReport += kicked.report + '\n'
        mentions.push(...kicked.mentions)
      } else {
        finalReport += `「✎」 No hay usuarios con 0 mensajes.\n\n`
      }

      if (lowUsers.length) {
        pendingKickInactive.set(pendingKey, {
          users: lowUsers,
          participants: groupParticipants,
          createdAt: Date.now()
        })

        finalReport += `⚠ *Usuarios con menos de 10 mensajes encontrados:*\n\n`

        lowUsers.forEach((u, i) => {
          const name = getUserName(u.jid, groupParticipants)
          finalReport += `*${i + 1}.* ${name} — ${u.totalMsgs} msgs\n`
          mentions.push(u.jid)
        })

        finalReport += `\n> Responde *sí* para expulsarlos también.\n`
        finalReport += `> Responde *no* para cancelar.`
      }

      return await client.reply(chatId, finalReport, m, { mentions })
    }

    let page = args[1] ? parseInt(args[1]) : 1
    if (isNaN(page) || page < 1) page = 1

    if (page > totalPages) {
      return m.reply(`「✎」 Página inválida. Solo hay ${totalPages} páginas disponibles.`)
    }

    const start = (page - 1) * perPage
    const end = start + perPage
    const pageUsers = ranking.slice(start, end)

    const zeroUsers = pageUsers.filter(u => u.totalMsgs === 0)
    const lowUsers = pageUsers.filter(u => u.totalMsgs > 0 && u.totalMsgs < 10)

    let finalReport = `⚠ *Kick inactive — página ${page}/${totalPages}*\n`
    finalReport += `> Días revisados: \`${daysArg}\`\n`
    finalReport += `> Usuarios revisados: \`${pageUsers.length}\`\n`
    finalReport += `> Sin mensajes: \`${zeroUsers.length}\`\n`
    finalReport += `> Baja actividad: \`${lowUsers.length}\`\n\n`

    const mentions = []

    if (zeroUsers.length) {
      const kicked = await kickUsers(
        client,
        m,
        zeroUsers,
        groupParticipants,
        `🚫 *Expulsados con 0 mensajes*`
      )

      finalReport += kicked.report + '\n'
      mentions.push(...kicked.mentions)
    } else {
      finalReport += `「✎」 No hay usuarios con 0 mensajes en esta página.\n\n`
    }

    if (lowUsers.length) {
      pendingKickInactive.set(pendingKey, {
        users: lowUsers,
        participants: groupParticipants,
        createdAt: Date.now()
      })

      finalReport += `⚠ *Usuarios con menos de 10 mensajes en esta página:*\n\n`

      lowUsers.forEach((u, i) => {
        const name = getUserName(u.jid, groupParticipants)
        finalReport += `*${i + 1}.* ${name} — ${u.totalMsgs} msgs\n`
        mentions.push(u.jid)
      })

      finalReport += `\n> Responde *sí* para expulsarlos también.\n`
      finalReport += `> Responde *no* para cancelar.`
    }

    if (page < totalPages) {
      finalReport += `\n> Siguiente página: *${prefix + command} ${daysArg} ${page + 1}*`
    }

    await client.reply(chatId, finalReport, m, { mentions })
  }
}