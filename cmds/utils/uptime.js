export default {
  command: ['uptime', 'runtime'],
  category: 'info',

  run: async (client, m) => {
    const uptime = process.uptime()

    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    const text = `
╭━━━〔 ⏱️ *UPTIME* 〕━━━⬣
┃
┃ 🤖 *Estado:* Online
┃ 🟢 *Tiempo activo:*
┃
┃ ❖ *${days}* día${days !== 1 ? 's' : ''}
┃ ❖ *${hours}* hora${hours !== 1 ? 's' : ''}
┃ ❖ *${minutes}* minuto${minutes !== 1 ? 's' : ''}
┃ ❖ *${seconds}* segundo${seconds !== 1 ? 's' : ''}
┃
╰━━━〔 RubyJX Bot 〕━━━⬣
`.trim()

    return m.reply(text)
  }
}