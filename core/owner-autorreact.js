export default {
  name: 'ownerAutoReact',

  async all(m, { client }) {
    try {
      if (!m?.key) return false

      const OWNER_NUMBER = '51901931862'

      const sender =
        m.sender ||
        m.key?.participant ||
        m.participant ||
        ''

      const senderNumber = String(sender).split('@')[0]

      // solo tú
      if (senderNumber !== OWNER_NUMBER) return false

      // evitar reaccionar a mensajes del bot
      if (m.key?.fromMe) return false

      const chat = m.chat || m.key?.remoteJid || ''

      // solo grupos / comunidad / canal
      const isGroup = chat.endsWith('@g.us')
      const isCommunity = chat.includes('@newsletter') || chat.includes('@broadcast')

      if (!isGroup && !isCommunity) return false

      await client.sendMessage(chat, {
        react: {
          text: '🔥',
          key: m.key
        }
      })

      return false
    } catch {
      return false
    }
  }
}