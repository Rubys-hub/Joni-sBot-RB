const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const pendingKickNum = new Map()

function normalizeNumber(input = '') {
  return String(input).replace(/[^0-9]/g, '')
}

function getBotJid(client) {
  return client.user.id.split(':')[0] + '@s.whatsapp.net'
}

function getOwners() {
  const owners = global.owner || global.owners || []
  return owners
    .map(owner => {
      if (Array.isArray(owner)) return normalizeNumber(owner[0])
      return normalizeNumber(owner)
    })
    .filter(Boolean)
}

function isOwner(sender) {
  const senderNumber = normalizeNumber(sender.split('@')[0])
  return getOwners().includes(senderNumber)
}

function getUserName(jid, participants) {
  const p = participants.find(x => x.id === jid)
  return p?.name || p?.notify || '@' + jid.split('@')[0]
}

function parseArgs(args = []) {
  const prefixes = []
  let preview = false
  let silent = false
  let page = 1
  let limit = null

  for (let i = 0; i < args.length; i++) {
    const arg = String(args[i]).toLowerCase()

    if (arg === 'preview') {
      preview = true
      continue
    }

    if (arg === 'silent') {
      silent = true
      continue
    }

    if (arg === 'page') {
      const value = parseInt(args[i + 1])
      if (!isNaN(value) && value > 0) page = value
      i++
      continue
    }

    if (arg === 'limit') {
      const value = parseInt(args[i + 1])
      if (!isNaN(value) && value > 0) limit = value
      i++
      continue
    }

    const num = normalizeNumber(arg)
    if (num) prefixes.push(num)
  }

  return {
    prefixes: [...new Set(prefixes)],
    preview,
    silent,
    page,
    limit
  }
}

function getWhitelist(chatData) {
  if (!chatData.kicknumWhitelist) chatData.kicknumWhitelist = []
  return chatData.kicknumWhitelist
}

function isWhitelisted(jid, whitelist) {
  const number = normalizeNumber(jid.split('@')[0])
  return whitelist.includes(number)
}

async function kickUsers(client, m, users, participants, options = {}) {
  const { silent = false } = options
  const mentions = []
  let kicked = 0
  let failed = 0
  let report = `⚠ *KickNum ejecutado*\n\n`

  for (let i = 0; i < users.length; i++) {
    const jid = users[i]
    const name = getUserName(jid, participants)

    try {
      await client.groupParticipantsUpdate(m.chat, [jid], 'remove')
      kicked++

      if (silent) {
        report += `✅ ${i + 1}. ${jid.split('@')[0]}\n`
      } else {
        report += `✅ ${i + 1}. ${name}\n`
        mentions.push(jid)
      }

      await sleep(1200)
    } catch (e) {
      failed++

      if (silent) {
        report += `❌ ${i + 1}. ${jid.split('@')[0]} — error\n`
      } else {
        report += `❌ ${i + 1}. ${name} — error\n`
        mentions.push(jid)
      }
    }
  }

  report += `\n╭────〔 RESUMEN 〕────╮\n`
  report += `│ Expulsados: ${kicked}\n`
  report += `│ Fallidos: ${failed}\n`
  report += `╰───────────────────╯`

  return { report, mentions, kicked, failed }
}

export default {
  command: ['kicknum', 'kickprefix', 'kickcountry'],
  category: 'group',

  run: async (client, m, args, command, text, prefix) => {
    if (!m.isGroup) return m.reply('「✎」 Este comando solo funciona en grupos.')

    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId] || (db.chats[chatId] = {})

    const metadata = await client.groupMetadata(chatId)
    const participants = metadata.participants || []

    const sender = m.sender
    const senderIsAdmin = participants.some(p => p.id === sender && p.admin)
    const senderIsOwner = isOwner(sender)

    const botJid = getBotJid(client)
    const botIsAdmin = participants.some(p => p.id === botJid && p.admin)

    if (!senderIsAdmin && !senderIsOwner) {
      return m.reply('「✎」 Solo admins del grupo o owner pueden usar este comando.')
    }

    if (!botIsAdmin) {
      return m.reply('「✎」 Necesito ser admin para expulsar usuarios.')
    }

    const key = `${chatId}:${sender}`
    const input = (text || args.join(' ') || '').toLowerCase().trim()

    const whitelist = getWhitelist(chatData)

    if (args[0]?.toLowerCase() === 'whitelist') {
      const action = args[1]?.toLowerCase()
      const number = normalizeNumber(args[2])

      if (action === 'add') {
        if (!number) return m.reply(`Uso: ${prefix}kicknum whitelist add 51999999999`)

        if (!whitelist.includes(number)) whitelist.push(number)

        return m.reply(`✅ Número agregado a whitelist: +${number}`)
      }

      if (action === 'del' || action === 'remove') {
        if (!number) return m.reply(`Uso: ${prefix}kicknum whitelist del 51999999999`)

        chatData.kicknumWhitelist = whitelist.filter(n => n !== number)

        return m.reply(`✅ Número eliminado de whitelist: +${number}`)
      }

      if (action === 'list') {
        if (!whitelist.length) return m.reply('「✎」 No hay números en whitelist.')

        let msg = `📋 *KickNum Whitelist*\n\n`
        whitelist.forEach((n, i) => {
          msg += `*${i + 1}.* +${n}\n`
        })

        return m.reply(msg)
      }

      return m.reply(
        `Uso:\n` +
        `${prefix}kicknum whitelist add 51999999999\n` +
        `${prefix}kicknum whitelist del 51999999999\n` +
        `${prefix}kicknum whitelist list`
      )
    }

    if (['si', 'sí', 's', 'yes', 'y'].includes(input)) {
      const pending = pendingKickNum.get(key)
      if (!pending) return m.reply('「✎」 No hay una acción pendiente para confirmar.')

      pendingKickNum.delete(key)

      const result = await kickUsers(client, m, pending.users, participants, {
        silent: pending.silent
      })

      if (!chatData.kicknumLogs) chatData.kicknumLogs = []
      chatData.kicknumLogs.push({
        admin: sender,
        prefixes: pending.prefixes,
        total: pending.users.length,
        kicked: result.kicked,
        failed: result.failed,
        date: Date.now()
      })

      return client.sendMessage(
        chatId,
        {
          text: result.report,
          mentions: result.mentions
        },
        { quoted: m }
      )
    }

    if (['no', 'n'].includes(input)) {
      if (pendingKickNum.has(key)) {
        pendingKickNum.delete(key)
        return m.reply('「✎」 Acción cancelada.')
      }

      return m.reply('「✎」 No hay acción pendiente.')
    }

    const parsed = parseArgs(args)

    if (!parsed.prefixes.length) {
      return m.reply(
        `Uso:\n` +
        `${prefix}kicknum 51\n` +
        `${prefix}kicknum 51 52\n` +
        `${prefix}kicknum 51 preview\n` +
        `${prefix}kicknum 51 page 2\n` +
        `${prefix}kicknum 51 limit 20\n` +
        `${prefix}kicknum whitelist add 51999999999`
      )
    }

    const adminJids = participants
      .filter(p => p.admin)
      .map(p => p.id)

    const ownerNumbers = getOwners()

    const protectedUsers = []
    const targets = participants
      .filter(p => {
        const jid = p.id
        const number = normalizeNumber(jid.split('@')[0])

        if (!jid.endsWith('@s.whatsapp.net')) return false
        if (jid === botJid) return false

        if (adminJids.includes(jid)) {
          protectedUsers.push({ jid, reason: 'admin' })
          return false
        }

        if (ownerNumbers.includes(number)) {
          protectedUsers.push({ jid, reason: 'owner' })
          return false
        }

        if (isWhitelisted(jid, whitelist)) {
          protectedUsers.push({ jid, reason: 'whitelist' })
          return false
        }

        return parsed.prefixes.some(pref => number.startsWith(pref))
      })
      .map(p => p.id)

    if (!targets.length) {
      return m.reply(`「✎」 No encontré usuarios con prefijo: +${parsed.prefixes.join(', +')}`)
    }

    const perPage = 10
    const totalPages = Math.ceil(targets.length / perPage)

    if (parsed.page > totalPages) {
      return m.reply(`「✎」 Página inválida. Solo hay ${totalPages} páginas disponibles.`)
    }

    const start = (parsed.page - 1) * perPage
    const end = start + perPage
    let selectedUsers = targets.slice(start, end)

    if (parsed.limit) {
      selectedUsers = selectedUsers.slice(0, parsed.limit)
    }

    let msg = `⚠ *KickNum Preview*\n\n`
    msg += `> Grupo: *${metadata.subject || 'Sin nombre'}*\n`
    msg += `> Prefijos: +${parsed.prefixes.join(', +')}\n`
    msg += `> Detectados: ${targets.length}\n`
    msg += `> Página: ${parsed.page}/${totalPages}\n`
    msg += `> Seleccionados: ${selectedUsers.length}\n`
    msg += `> Protegidos saltados: ${protectedUsers.length}\n\n`

    const mentions = []

    selectedUsers.forEach((jid, i) => {
      const name = getUserName(jid, participants)
      msg += `*${i + 1}.* ${name}\n`
      mentions.push(jid)
    })

    if (parsed.page < totalPages) {
      msg += `\n> Siguiente página: *${prefix}kicknum ${parsed.prefixes.join(' ')} page ${parsed.page + 1}*`
    }

    if (parsed.preview) {
      msg += `\n\n「✎」 Modo preview: no se expulsó a nadie.`
      return client.sendMessage(chatId, { text: msg, mentions }, { quoted: m })
    }

    pendingKickNum.set(key, {
      users: selectedUsers,
      prefixes: parsed.prefixes,
      silent: parsed.silent,
      createdAt: Date.now()
    })

    msg += `\n\n> Responde *si* para expulsarlos.`
    msg += `\n> Responde *no* para cancelar.`

    return client.sendMessage(chatId, { text: msg, mentions }, { quoted: m })
  }
}