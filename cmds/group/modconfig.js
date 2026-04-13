export default {
  command: ['modconfig', 'automodconfig'],
  category: 'grupo',

  run: async (client, m) => {
    const OWNER_NUMBER = '51901931862'
    const senderNumber = m.sender.split('@')[0]
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('Este comando es solo para administradores o el owner del bot.')
    }

    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    const chat = global.db.data.chats[m.chat] || {}
    const mutedCount = Object.keys(chat.mutedUsers || {}).length

    const text =
      `⚙️ *Configuración de Moderación*\n\n` +
      `🔇 Muteados: ${mutedCount}\n` +
      `🎥 AntiVideo: ${chat.antivideo ? 'ON' : 'OFF'}\n` +
      `🖼️ AntiImage: ${chat.antiimage ? 'ON' : 'OFF'}\n` +
      `🎭 AntiSticker: ${chat.antisticker ? 'ON' : 'OFF'}\n` +
      `📢 AntiEstado: ${chat.antiestado ? 'ON' : 'OFF'}\n` +
      `💀 BadWords: ${chat.badwords ? 'ON' : 'OFF'}\n` +
      `🔗 AntiLink: ${chat.antilinks ? 'ON' : 'OFF'}\n` +
      `🧹 AntiLinkSoft: ${chat.antilinksoft ? 'ON' : 'OFF'}`

    return m.reply(text)
  }
}