export default {
  command: ['sf', 'stickfree'],
  category: 'stickers',
  isOwner: true,
  run: async (client, m) => {
    try {
      if (m.sender !== '51901931862@s.whatsapp.net') return

      const q = m.quoted ? m.quoted : m
      const mime = q?.msg?.mimetype || q?.mimetype || ''

      if (/image/.test(mime)) {
        const media = await q.download()
        return await client.sendImageAsSticker(m.chat, media, m, {})
      }

      if (/video/.test(mime)) {
        const media = await q.download()
        return await client.sendVideoAsSticker(m.chat, media, m, {})
      }

      return m.reply('Responde a una imagen o video con sf')
    } catch (e) {
      return m.reply(`Error: ${e.message}`)
    }
  }
}