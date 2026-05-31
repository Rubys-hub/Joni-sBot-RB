export default {
  command: ['purgeuser', 'purgueuser', 'clearuser', 'deluser'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args = []) => {
    const FORCE_OWNER = [
      '51901931862',
      '51901931862@s.whatsapp.net',
      '269015712845891',
      '269015712845891@lid'
    ]

    const DELETE_TIMEOUT_MS = 8000
    const DELAY_MS = 180

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const withTimeout = (promise, ms) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('DELETE_TIMEOUT')), ms)
        )
      ])
    }

    const cleanNumber = (jid = '') => {
      return String(jid || '')
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')
    }

    const sameUser = (a = '', b = '') => {
      const na = cleanNumber(a)
      const nb = cleanNumber(b)
      return !!na && !!nb && na === nb
    }

    const isOwner = (jid = '') => {
      return FORCE_OWNER.some(owner => sameUser(owner, jid))
    }

    const botRawIds = [
      client?.user?.id,
      client?.user?.jid,
      client?.user?.lid
    ].filter(Boolean)

    const botNumbers = new Set(
      botRawIds.map(v => cleanNumber(v)).filter(Boolean)
    )

    const isBotJid = (jid = '') => {
      const num = cleanNumber(jid)
      return !!num && botNumbers.has(num)
    }

    const getContextInfo = () => {
      return (
        m?.message?.extendedTextMessage?.contextInfo ||
        m?.msg?.contextInfo ||
        m?.message?.imageMessage?.contextInfo ||
        m?.message?.videoMessage?.contextInfo ||
        {}
      )
    }

    const getMentionedJids = () => {
      const contextInfo = getContextInfo()

      return [
        ...(Array.isArray(m.mentionedJid) ? m.mentionedJid : []),
        ...(Array.isArray(contextInfo.mentionedJid) ? contextInfo.mentionedJid : [])
      ].filter(Boolean)
    }

    const getQuotedSender = () => {
      const contextInfo = getContextInfo()

      return (
        m?.quoted?.sender ||
        m?.quoted?.participant ||
        contextInfo?.participant ||
        ''
      )
    }

    const isBotMessage = (msg = {}) => {
      const key = msg.key || msg

      if (key.fromMe === true || msg.fromMe === true) return true

      const possibleSenders = [
        key.participant,
        msg.participant,
        msg.sender,
        key.sender,
        msg.jid,
        msg.from
      ].filter(Boolean)

      return possibleSenders.some(v => isBotJid(v))
    }

    const normalizeKey = (msg, fallbackChat = m.chat) => {
      if (!msg) return null

      const key = msg.key || msg

      const remoteJid =
        key.remoteJid ||
        msg.remoteJid ||
        msg.chat ||
        msg.from ||
        fallbackChat

      const id =
        key.id ||
        msg.id ||
        msg.stanzaId

      if (!remoteJid || !id) return null

      const fromMe = isBotMessage(msg)

      const participant =
        key.participant ||
        msg.participant ||
        msg.sender ||
        key.sender ||
        undefined

      const deleteKey = {
        remoteJid,
        fromMe,
        id
      }

      /*
        Para borrar en grupo:
        - Mensaje del bot: fromMe true, sin participant.
        - Mensaje de usuario: fromMe false, con participant.
      */
      if (!fromMe && participant && String(remoteJid).endsWith('@g.us')) {
        deleteKey.participant = participant
      }

      return deleteKey
    }

    const getQuotedKey = () => {
      const contextInfo = getContextInfo()

      if (m?.quoted?.key || m?.quoted?.id) {
        return normalizeKey({
          ...m.quoted,
          key: m.quoted.key,
          sender: m.quoted.sender || m.quoted.participant,
          participant: m.quoted.participant || m.quoted.sender,
          chat: m.chat
        }, m.chat)
      }

      if (contextInfo?.stanzaId) {
        const participant = contextInfo.participant

        return normalizeKey({
          key: {
            remoteJid: m.chat,
            id: contextInfo.stanzaId,
            participant,
            fromMe: isBotJid(participant)
          },
          sender: participant,
          participant,
          chat: m.chat
        }, m.chat)
      }

      return null
    }

    const keyBelongsToUser = (key, targetJid) => {
      if (!key || !targetJid) return false

      if (key.fromMe) {
        return isBotJid(targetJid)
      }

      return sameUser(key.participant, targetJid)
    }

    const uniqueKeys = (keys = []) => {
      const map = new Map()

      for (const item of keys) {
        const key = normalizeKey(item, m.chat)
        if (!key?.id) continue

        const uniqueId = `${key.remoteJid}:${key.id}:${key.fromMe}:${key.participant || ''}`
        map.set(uniqueId, key)
      }

      return [...map.values()]
    }

    const collectKeys = (source, output = []) => {
      if (!source) return output

      if (Array.isArray(source)) {
        for (const item of source) {
          const key = normalizeKey(item, m.chat)
          if (key) output.push(key)
        }

        return output
      }

      if (typeof source === 'object') {
        const directKey = normalizeKey(source, m.chat)
        if (directKey) output.push(directKey)

        for (const value of Object.values(source)) {
          if (Array.isArray(value)) {
            for (const item of value) {
              const key = normalizeKey(item, m.chat)
              if (key) output.push(key)
            }
          }
        }
      }

      return output
    }

    const deleteMessage = async (key) => {
      try {
        await withTimeout(
          client.sendMessage(key.remoteJid, { delete: key }),
          DELETE_TIMEOUT_MS
        )

        return true
      } catch {
        return false
      }
    }

    const idOf = (v) => {
      return v?.key?.id || v?.id || v?.stanzaId || ''
    }

    if (!m.isGroup) {
      return m.reply('Este comando solo funciona en grupos.')
    }

    if (!isOwner(m.sender) && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isBotAdmin) {
      return m.reply('Necesito ser administrador para poder borrar mensajes.')
    }

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat) {
      return m.reply('No encontré la base de datos de este grupo.')
    }

    chat.messageLog = Array.isArray(chat.messageLog) ? chat.messageLog : []
    chat.userMessageLog = chat.userMessageLog || {}

    const mentionedJids = getMentionedJids()
    const quotedSender = getQuotedSender()
    const quotedKey = getQuotedKey()

    const numberArg = args.find(v => {
      const text = String(v || '').replace(/\D/g, '')
      return text.length >= 8
    })

    const targetJid =
      mentionedJids[0] ||
      quotedSender ||
      (numberArg ? `${cleanNumber(numberArg)}@s.whatsapp.net` : '')

    if (!targetJid) {
      return m.reply(
        'Menciona o responde al usuario cuyos mensajes quieres borrar.\n\n' +
        'Ejemplos:\n' +
        '▪ .purgeuser @usuario\n' +
        '▪ .purgeuser @usuario 20\n' +
        '▪ .purgeuser @usuario all\n' +
        '▪ Responde un mensaje y usa .purgeuser'
      )
    }

    const lowerArgs = args.map(v => String(v || '').toLowerCase().trim())

    const deleteAll = lowerArgs.some(v =>
      ['all', 'todo', 'todos'].includes(v)
    )

    const amountToken = args.find(v => /^\d+$/.test(String(v || '').trim()))
    let amount = amountToken ? parseInt(amountToken, 10) : 10

    if (!deleteAll) {
      amount = Math.max(1, Math.min(amount, 300))
    }

    let allLogs = []

    collectKeys(chat.messageLog, allLogs)

    for (const jid of Object.keys(chat.userMessageLog || {})) {
      collectKeys(chat.userMessageLog[jid], allLogs)
    }

    collectKeys(chat.botMessageLog, allLogs)
    collectKeys(chat.botMessages, allLogs)
    collectKeys(chat.sentMessageLog, allLogs)
    collectKeys(chat.sentMessages, allLogs)
    collectKeys(chat.messages, allLogs)

    allLogs = uniqueKeys(allLogs)

    let targets = allLogs.filter(key => keyBelongsToUser(key, targetJid))

    if (quotedKey && keyBelongsToUser(quotedKey, targetJid)) {
      targets.push(quotedKey)
    }

    targets = uniqueKeys(targets)

    targets = deleteAll
      ? targets
      : targets.slice(-amount)

    if (!targets.length) {
      return m.reply(
        `No encontré mensajes registrados de @${cleanNumber(targetJid)}.\n\n` +
        'Puede pasar si el bot recién entró, si se reinició, o si ese mensaje no quedó guardado en el historial.',
        null,
        { mentions: [targetJid] }
      )
    }

    targets = targets.reverse()

    let deleted = 0
    const deletedIds = new Set()

    for (const key of targets) {
      const ok = await deleteMessage(key)

      if (ok) {
        deleted++
        deletedIds.add(key.id)
      }

      await sleep(DELAY_MS)
    }

    const commandKey = normalizeKey({
      key: m.key,
      sender: m.sender,
      participant: m.key?.participant || m.sender,
      chat: m.chat
    }, m.chat)

    if (commandKey) {
      await deleteMessage(commandKey)
    }

    if (deletedIds.size) {
      chat.messageLog = chat.messageLog.filter(v => !deletedIds.has(idOf(v)))

      for (const jid of Object.keys(chat.userMessageLog || {})) {
        chat.userMessageLog[jid] = chat.userMessageLog[jid].filter(v => !deletedIds.has(idOf(v)))

        if (!chat.userMessageLog[jid].length) {
          delete chat.userMessageLog[jid]
        }
      }

      for (const prop of [
        'botMessageLog',
        'botMessages',
        'sentMessageLog',
        'sentMessages',
        'messages'
      ]) {
        if (Array.isArray(chat[prop])) {
          chat[prop] = chat[prop].filter(v => !deletedIds.has(idOf(v)))
        }
      }
    }

    return client.reply(
      m.chat,
      `🧹 ▣ ᴘᴜʀɢᴇ ᴜsᴇʀ\n\n` +
      `▪ Usuario: @${cleanNumber(targetJid)}\n` +
      `▪ Intentados: ${targets.length}\n` +
      `▪ Eliminados: ${deleted}\n\n` +
      `Los mensajes eliminados deben aparecer como “Se eliminó este mensaje”.`,
      null,
      { mentions: [targetJid] }
    )
  }
}