export default {
  command: ['purge', 'clearchat'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args = [], usedPrefix, command) => {
    const OWNER_NUMBER = '51901931862'
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
      return String(jid)
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')
    }

    const botNumber = cleanNumber(client?.user?.id || client?.user?.jid || '')
    const botJid = botNumber ? `${botNumber}@s.whatsapp.net` : ''

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

      const fromMe = Boolean(key.fromMe ?? msg.fromMe)

      const senderNumber = cleanNumber(
        key.participant ||
        msg.participant ||
        msg.sender ||
        ''
      )

      return fromMe || (!!botNumber && senderNumber === botNumber)
    }

    const normalizeKey = (msg, fallbackChat = m.chat) => {
      if (!msg) return null

      const key = msg.key || msg

      const remoteJid =
        key.remoteJid ||
        msg.remoteJid ||
        msg.chat ||
        fallbackChat

      const id =
        key.id ||
        msg.id

      if (!remoteJid || !id) return null

      const fromMe = isBotMessage(msg)

      const participant =
        key.participant ||
        msg.participant ||
        msg.sender ||
        undefined

      const deleteKey = {
        remoteJid,
        fromMe,
        id
      }

      /*
        IMPORTANTE:
        - Mensajes propios del bot: fromMe true y SIN participant.
        - Mensajes de otros usuarios en grupo: fromMe false CON participant.
      */
      if (!fromMe && participant) {
        deleteKey.participant = participant
      }

      return deleteKey
    }

    const uniqueKeys = (keys) => {
      const map = new Map()

      for (const key of keys) {
        const cleanKey = normalizeKey(key, m.chat)
        if (!cleanKey?.id) continue

        const uniqueId = `${cleanKey.remoteJid}:${cleanKey.id}:${cleanKey.fromMe}:${cleanKey.participant || ''}`
        map.set(uniqueId, cleanKey)
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
        return false
      }
    }

    const keyBelongsToUser = (key, targetJid) => {
      if (!key || !targetJid) return false

      const targetNumber = cleanNumber(targetJid)

      if (!targetNumber) return false

      // Si el mensaje es del bot
      if (key.fromMe) {
        return targetNumber === botNumber
      }

      // Si el mensaje es de otro usuario
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
            fromMe: cleanNumber(participant) === botNumber
          },
          sender: participant,
          participant,
          chat: m.chat
        }, m.chat)
      }

      return null
    }

    const senderNumber = cleanNumber(m.sender)
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!m.isGroup) {
      return m.reply('Este comando solo funciona en grupos.')
    }

    if (!isOwnerBot && !m.isAdmin) {
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

    const contextInfo = getContextInfo()
    const mentionedJids = getMentionedJids()
    const quotedSender = getQuotedSender()
    const quotedKey = getQuotedKey()

    /*
      Modos:
      .purge              -> borra 10 mensajes recientes de todos
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

    let logs = chat.messageLog
      .map(v => normalizeKey(v, m.chat))
      .filter(Boolean)

    /*
      También revisa userMessageLog por si quedaron guardados
      mensajes del bot o de usuarios que no están en messageLog.
    */
    for (const jid of Object.keys(chat.userMessageLog || {})) {
      const arr = Array.isArray(chat.userMessageLog[jid])
        ? chat.userMessageLog[jid]
        : []

      for (const item of arr) {
        const key = normalizeKey(item, m.chat)
        if (key) logs.push(key)
      }
    }

    logs = uniqueKeys(logs)

    let baseTargets = logs.filter(v => v.id !== commandId)

    // Si hay usuario mencionado o mensaje respondido, solo borra mensajes de ese usuario
    if (targetJid) {
      baseTargets = baseTargets.filter(v => keyBelongsToUser(v, targetJid))
    }

    let targets = deleteAll
      ? baseTargets
      : baseTargets.slice(-amount)

    // Si respondió a un mensaje, intenta borrar también ese mensaje exacto
    if (quotedKey) {
      if (!targetJid || keyBelongsToUser(quotedKey, targetJid)) {
        targets.push(quotedKey)
      }
    }

    // Borra también el mensaje donde enviaron el comando
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
        const id = v?.key?.id || v?.id
        return !deletedIds.has(id)
      })

      for (const jid of Object.keys(chat.userMessageLog || {})) {
        chat.userMessageLog[jid] = chat.userMessageLog[jid].filter(v => {
          const id = v?.key?.id || v?.id
          return !deletedIds.has(id)
        })

        if (!chat.userMessageLog[jid].length) {
          delete chat.userMessageLog[jid]
        }
      }
    }

    return
  }
}