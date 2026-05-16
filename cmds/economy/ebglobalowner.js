export default {
  command: ['ebglobalowner', 'eboardglobalowner', 'baltopglobalowner'],
  category: 'owner',

  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db?.data || {}
    const chatId = m.chat
    const cmd = command || 'ebglobalowner'

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const botNumber = String(client.user?.id || '').split(':')[0].replace(/\D/g, '')
    const botId = botNumber ? `${botNumber}@s.whatsapp.net` : String(client.user?.id || '')

    const botSettings = db.settings?.[botId] || {}
    const monedas = botSettings.currency || 'coins'
    const botName = botSettings.namebot || botSettings.botname || 'RubyJX Bot'

    const ownerFromGlobal = String(JSON.stringify(global.owner || [])).match(/\d{5,}/g) || []

    const ownerNumbers = new Set([
      '51901931862',
      '269015712845891',
      ...ownerFromGlobal
    ])

    const normalizeNumber = (jid = '') => {
      return String(jid || '')
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')
    }

    const senderNumber = normalizeNumber(m.sender)
    const isOwner = Boolean(m.isOwner) || ownerNumbers.has(senderNumber)

    if (!isOwner) {
      return m.reply(`╭━━━〔 🔒 *COMANDO OWNER* 〕━━━╮
┃
┃ Este comando es solo para el owner.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    const safeNumber = (value = 0) => {
      const n = Number(value || 0)
      return Number.isFinite(n) ? n : 0
    }

    const money = (value = 0) => {
      return safeNumber(value).toLocaleString('es-PE')
    }

    const cleanText = (text = '') => {
      return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    }

    const groupDigits = (digits = '') => {
      if (!digits) return ''
      if (digits.length === 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      if (digits.length === 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`
      if (digits.length === 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim()
    }

    const formatPhone = (jid = '') => {
      const raw = String(jid || '')

      if (raw.includes('@lid')) {
        return `LID: ${normalizeNumber(raw)}`
      }

      const n = normalizeNumber(raw)
      if (!n) return 'No disponible'

      if (n.startsWith('51') && n.length === 11) return `+51 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`
      if (n.startsWith('57') && n.length === 12) return `+57 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`
      if (n.startsWith('521') && n.length === 13) return `+52 1 ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`
      if (n.startsWith('52') && n.length === 12) return `+52 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`
      if (n.startsWith('54')) return `+54 ${groupDigits(n.slice(2))}`
      if (n.startsWith('56')) return `+56 ${groupDigits(n.slice(2))}`
      if (n.startsWith('58')) return `+58 ${groupDigits(n.slice(2))}`
      if (n.startsWith('593')) return `+593 ${groupDigits(n.slice(3))}`
      if (n.startsWith('591')) return `+591 ${groupDigits(n.slice(3))}`
      if (n.startsWith('595')) return `+595 ${groupDigits(n.slice(3))}`
      if (n.startsWith('598')) return `+598 ${groupDigits(n.slice(3))}`
      if (n.startsWith('34')) return `+34 ${groupDigits(n.slice(2))}`
      if (n.startsWith('55')) return `+55 ${groupDigits(n.slice(2))}`

      const codes3 = ['502', '503', '504', '505', '506', '507', '509']

      for (const code of codes3) {
        if (n.startsWith(code)) return `+${code} ${groupDigits(n.slice(code.length))}`
      }

      if (n.startsWith('1') && n.length === 11) {
        return `+1 ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7)}`
      }

      return `+${groupDigits(n)}`
    }

    const getGroupName = (groupData = {}) => {
      return (
        groupData.name ||
        groupData.subject ||
        groupData.title ||
        groupData.groupName ||
        groupData.metadata?.subject ||
        'Grupo sin nombre'
      )
    }

    const getUserName = (jid = '', data = {}) => {
      return (
        db.users?.[jid]?.name ||
        data.name ||
        data.pushname ||
        data.username ||
        data.nick ||
        data.nombre ||
        'Usuario'
      )
    }

    const mentioned = m.mentionedJid?.[0] || m.quoted?.sender || ''
    const rawQuery = args.join(' ').trim()
    const rawQueryClean = cleanText(rawQuery)

    let page = 1
    let searchQuery = ''
    let sendAll = false

    if (rawQueryClean === 'all' || rawQueryClean === 'todo') {
      sendAll = true
    } else if (mentioned) {
      searchQuery = mentioned
    } else if (args.length === 1 && /^\d{1,3}$/.test(args[0])) {
      page = Number(args[0]) || 1
    } else if (rawQuery) {
      searchQuery = rawQuery
    }

    try {
      const usersMap = new Map()

      for (const [groupId, groupData] of Object.entries(db.chats || {})) {
        if (!groupData?.users) continue

        const groupName = getGroupName(groupData)

        for (const [jid, data] of Object.entries(groupData.users || {})) {
          const coins = safeNumber(data.coins)
          const bank = safeNumber(data.bank)
          const total = coins + bank

          if (total <= 0 && !searchQuery) continue

          if (!usersMap.has(jid)) {
            usersMap.set(jid, {
              jid,
              name: getUserName(jid, data),
              number: formatPhone(jid),
              coins: 0,
              bank: 0,
              total: 0,
              groups: []
            })
          }

          const user = usersMap.get(jid)

          user.coins += coins
          user.bank += bank
          user.total += total

          user.groups.push({
            groupId,
            groupName,
            coins,
            bank,
            total
          })
        }
      }

      let users = [...usersMap.values()]

      if (searchQuery) {
        const q = cleanText(searchQuery)
        const qNumber = normalizeNumber(searchQuery)

        users = users.filter(user => {
          return (
            cleanText(user.name).includes(q) ||
            cleanText(user.jid).includes(q) ||
            normalizeNumber(user.jid).includes(qNumber) ||
            user.jid === searchQuery
          )
        })
      }

      users = users.sort((a, b) => b.total - a.total)

      if (users.length === 0) {
        return m.reply(`╭━━━〔 👑 *EBGLOBAL OWNER* 〕━━━╮
┃
┃ No encontré resultados.
┃
┃ Usa:
┃ ➤ *${usedPrefix + cmd}*
┃ ➤ *${usedPrefix + cmd} 2*
┃ ➤ *${usedPrefix + cmd} all*
┃ ➤ *${usedPrefix + cmd} número*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      const pageSize = searchQuery ? 6 : 8
      const totalPages = Math.ceil(users.length / pageSize)

      const buildPageText = (currentPage) => {
        const start = (currentPage - 1) * pageSize
        const pageUsers = users.slice(start, start + pageSize)

        let text = `╭━━━〔 👑 *EBGLOBAL OWNER* 〕━━━╮
┃
┃ 🤖 Bot: *${botName}*
┃ 💰 Moneda: *${monedas}*
┃ 👥 Usuarios: *${users.length}*
┃ 📄 Página: *${currentPage}/${totalPages}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

`

        for (const [index, user] of pageUsers.entries()) {
          const rank = start + index + 1
          const mainGroup = [...user.groups].sort((a, b) => b.total - a.total)[0]

          text += `╭━━〔 🏅 *TOP ${rank}* 〕━━╮
┃ 👤 *${user.name}*
┃ 📱 ${user.number}
┃ 💰 Coins: *${money(user.coins)}*
┃ 🏦 Bank: *${money(user.bank)}*
┃ 💎 Total: *${money(user.total)} ${monedas}*
┃
┃ 🏠 Grupo:
┃ ${mainGroup?.groupName || 'No registrado'}
┃
┃ 🆔 ID Grupo:
┃ ${mainGroup?.groupId || 'No disponible'}
┃
┃ 📍 Aparece en: *${user.groups.length} grupo(s)*
╰━━━━━━━━━━━━━━━━━━━━━━╯

`
        }

        text += `📄 *Página ${currentPage}/${totalPages}*`

        if (!searchQuery && !sendAll && currentPage < totalPages) {
          text += `\n➡️ Siguiente: *${usedPrefix + cmd} ${currentPage + 1}*`
        }

        if (!searchQuery && !sendAll && currentPage > 1) {
          text += `\n⬅️ Anterior: *${usedPrefix + cmd} ${currentPage - 1}*`
        }

        if (!sendAll) {
          text += `\n\n📤 Enviar todo: *${usedPrefix + cmd} all*`
        }

        text += `\n🔎 Buscar: *${usedPrefix + cmd} número*`

        return text
      }

      if (sendAll) {
        await m.reply(`╭━━━〔 👑 *EBGLOBAL OWNER ALL* 〕━━━╮
┃
┃ Se enviarán *${totalPages} página(s)*.
┃
┃ ⏱️ Tiempo entre páginas: *5 segundos*
┃
┃ ⚠️ No uses muchos comandos mientras termina.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
          const text = buildPageText(currentPage)

          await client.sendMessage(chatId, { text }, { quoted: m })

          if (currentPage < totalPages) {
            await sleep(5000)
          }
        }

        return
      }

      if (page < 1 || page > totalPages) {
        return m.reply(`╭━━━〔 ❌ *PÁGINA NO ENCONTRADA* 〕━━━╮
┃
┃ Página: *${page}*
┃ Disponibles: *1 - ${totalPages}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
      }

      const text = buildPageText(page)

      await client.sendMessage(chatId, { text }, { quoted: m })

    } catch (e) {
      await m.reply(`╭━━━〔 ❌ *ERROR EBGLOBALOWNER* 〕━━━╮
┃
┃ Error:
┃ *${e.message}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`)
    }
  }
}