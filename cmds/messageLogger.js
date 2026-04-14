export default {
  name: 'messageLogger',

  async all(m, { client }) {
    try {
      if (!m?.isGroup || !m?.chat || !m?.message || !m?.key?.id) return false

      global.db.data.chats = global.db.data.chats || {}
      if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

      const chat = global.db.data.chats[m.chat]

      chat.messageLog = Array.isArray(chat.messageLog) ? chat.messageLog : []
      chat.userMessageLog = chat.userMessageLog || {}

      const entry = {
        id: m.key.id,
        chat: m.chat,
        sender: m.sender,
        participant: m.key.participant || m.sender,
        fromMe: !!m.key.fromMe,
        timestamp: Date.now()
      }

      chat.messageLog.push(entry)
      if (chat.messageLog.length > 5000) {
        chat.messageLog = chat.messageLog.slice(-5000)
      }

      if (!chat.userMessageLog[m.sender]) {
        chat.userMessageLog[m.sender] = []
      }

      chat.userMessageLog[m.sender].push(entry)
      if (chat.userMessageLog[m.sender].length > 1500) {
        chat.userMessageLog[m.sender] = chat.userMessageLog[m.sender].slice(-1500)
      }


      console.log('[LOGGER OK]', m.chat, m.sender, m.key.id)
      
      return false
    } catch (e) {
      console.error('[MESSAGE LOGGER ERROR]', e)
      return false
    }
  }
}