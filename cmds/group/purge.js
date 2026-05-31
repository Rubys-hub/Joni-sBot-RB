export default {
  command: ['purge', 'clearchat'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args = [], usedPrefix, command) => {
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

    const cleanJid = (jid = '') => {
      return String(jid || '').trim()
    }

    const botRawIds = [
      client?.user?.id,
      client?.user?.jid,
      client?.user?.lid,
      client?.user?.name
    ].filter(Boolean)

    const botNumbers = new Set(
      botRawIds
        .map(v => cleanNumber(v))
        .filter(Boolean)
    )

    const botNumber = [...botNumbers][0] || ''
    const botJid = botNumber ? `${botNumber}@s.whatsapp.net` : ''

    const isSameBot = (jid = '') => {
      const num = cleanNumber(jid)
      return !!num && botNumbers.has(num)
    }

    const isOwner = (jid = '') => {
      const num = cleanNumber(jid)
      return FORCE_OWNER.some(v => cleanNumber(v) === num)
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

      return possibleSenders.some(v => isSameBot(v))
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
        MUY IMPORTANTE PARA BORRAR BIEN:

        - Mensajes del bot:
          { remoteJid, fromMe: true, id }
          SIN participant.

        - Mensajes de usuarios en grupo:
          { remoteJid, fromMe: false, id, participant }
      */
      if (!fromMe && participant && String(remoteJid).endsWith('@g.us')) {
        deleteKey.participant = participant
      }

      return deleteKey
    }

    const uniqueKeys = (keys) => {
      const map = new Map()

      for (const item of keys) {
        const key = normalizeKey(item, m.chat)
        if (!key?.id) continue

        const uniqueId = `${key.remoteJid}:${key.id}:${key.fromMe}:${key.participant || ''}`
        map.set(uniqueId, key)
      }

      return [...map.values()]
    }

    const deleteMessage = async (key) => {
      try {
        await withTimeout(
          client.sendMessage(key.remoteJid, { delete: key }),
          DELETE_TIMEOUT_MS
        )

        return true
      } catch (e) {
        /*
          Fallback por si algún mensaje del bot quedó guardado raro.
          Normalmente los mensajes propios se borran con fromMe true y sin participant.
        */
        if (key?.fromMe && botJid) {
          try {
            const fallbackKey = {
              remoteJid: key.remoteJid,
              fromMe: true,
              id: key.id,
              participant: botJid
            }

            await withTimeout(
              client.sendMessage(key.remoteJid, { delete: fallbackKey }),
              DELETE_TIMEOUT_MS
            )

            return true
          } catch {}
        }

        return false
      }
    }

    const keyBelongsToUser = (key, targetJid) => {
      if (!key || !targetJid) return false

      const targetNumber = cleanNumber(targetJid)
      if (!targetNumber) return false

      if (key.fromMe) {
        return botNumbers.has(targetNumber)
      }

      return cleanNumber(key.participant) === targetNumber
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
            fromMe: isSameBot(participant)
          },
          sender: participant,
          participant,
          chat: m.chat
        }, m.chat)
      }

      return null
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
    if (!chat) return

    chat.messageLog = Array.isArray(chat.messageLog) ? chat.messageLog : []
    chat.userMessageLog = chat.userMessageLog || {}

    const lowerArgs = args.map(v => String(v || '').toLowerCase().trim())

    const deleteAll = lowerArgs.some(v =>
      ['all', 'todo', 'todos'].includes(v)
    )

    const amountToken = args.find(v => /^\d+$/.test(String(v || '').trim()))
    let amount = amountToken ? parseInt(amountToken, 10) : 10

    if (!deleteAll) {
      amount = Math.max(1, Math.min(amount, 300))
    }

    const mentionedJids = getMentionedJids()
    const quotedSender = getQuotedSender()
    const quotedKey = getQuotedKey()

    /*
      Modos:
      .purge              -> borra 10 mensajes recientes de todos, incluyendo mensajes del bot si están guardados
      .purge 30           -> borra 30 mensajes recientes de todos
      .purge all          -> borra todo el historial guardado
      .purge @user        -> borra 10 mensajes recientes de ese usuario
      .purge @user 30     -> borra 30 mensajes recientes de ese usuario
      Respondiendo .purge -> borra mensajes del usuario respondido
    */
    const targetJid =
      mentionedJids[0] ||
      quotedSender ||
      ''

    const commandKey = normalizeKey({
      key: m.key,
      sender: m.sender,
      participant: m.key?.participant || m.sender,
      chat: m.chat
    }, m.chat)

    const commandId = commandKey?.id

    let logs = []

    collectKeys(chat.messageLog, logs)

    for (const jid of Object.keys(chat.userMessageLog || {})) {
      collectKeys(chat.userMessageLog[jid], logs)
    }

    /*
      Extra:
      Si en alguna parte de tu bot guardas mensajes enviados por el bot
      con otro nombre, también los revisa aquí.
    */
    collectKeys(chat.botMessageLog, logs)
    collectKeys(chat.botMessages, logs)
    collectKeys(chat.sentMessageLog, logs)
    collectKeys(chat.sentMessages, logs)
    collectKeys(chat.messages, logs)

    logs = uniqueKeys(logs)

    let baseTargets = logs.filter(v => v.id !== commandId)

    if (targetJid) {
      baseTargets = baseTargets.filter(v => keyBelongsToUser(v, targetJid))
    }

    let targets = deleteAll
      ? baseTargets
      : baseTargets.slice(-amount)

    if (quotedKey) {
      if (!targetJid || keyBelongsToUser(quotedKey, targetJid)) {
        targets.push(quotedKey)
      }
    }

    if (commandKey) {
      targets.push(commandKey)
    }

    targets = uniqueKeys(targets).reverse()

    if (!targets.length) return

    const deletedIds = new Set()

    for (const key of targets) {
      const ok = await deleteMessage(key)

      if (ok) {
        deletedIds.add(key.id)
      }

      await sleep(DELAY_MS)
    }

    if (deletedIds.size) {
      chat.messageLog = chat.messageLog.filter(v => {
        const id = v?.key?.id || v?.id || v?.stanzaId
        return !deletedIds.has(id)
      })

      for (const jid of Object.keys(chat.userMessageLog || {})) {
        chat.userMessageLog[jid] = chat.userMessageLog[jid].filter(v => {
          const id = v?.key?.id || v?.id || v?.stanzaId
          return !deletedIds.has(id)
        })

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
          chat[prop] = chat[prop].filter(v => {
            const id = v?.key?.id || v?.id || v?.stanzaId
            return !deletedIds.has(id)
          })
        }
      }
    }

    return
  }
}