export default {
  command: ['msticker', 'menusticker', 'stickermenu', 'menustickers'],
  category: 'stickers',

  run: async (client, m, args, usedPrefix = '.') => {
    return m.reply(
      `🎨 ▣ ᴍᴇɴú ᴅᴇ sᴛɪᴄᴋᴇʀs\n` +
      `▪️ Responde a una imagen, video, GIF o sticker.\n` +
      `▪️ Usa *${usedPrefix}s* + el código del efecto o forma.\n` +
      `\n` +

      `📌 ▣ ʙásɪᴄᴏ\n` +
      `▪️ *${usedPrefix}s* → imagen a sticker\n` +
      `▪️ *${usedPrefix}s1* → sticker cuadrado\n` +
      `\n` +

      `🔷 ▣ ғᴏʀᴍᴀs\n` +
      `▪️ *${usedPrefix}s cir* → sticker circular\n` +
      `▪️ *${usedPrefix}s tri* → sticker triangular\n` +
      `▪️ *${usedPrefix}s dia* → sticker diamante\n` +
      `▪️ *${usedPrefix}s cor* → sticker corazón\n` +
      `\n` +

      `🖼️ ▣ ᴍᴏᴅᴏ ᴅᴇ ɪᴍᴀɢᴇɴ\n` +
      `▪️ *${usedPrefix}s e* → sticker al revés / volteado vertical\n` +
      `▪️ *${usedPrefix}s i* → sticker reflejado / espejo horizontal\n` +
      `▪️ *${usedPrefix}s n* → sticker negativo\n` +
      `▪️ *${usedPrefix}s b* → sticker borroso\n` +
      `▪️ *${usedPrefix}s r* → sticker con tinte rojo\n` +
      `▪️ *${usedPrefix}s g* → sticker gris / blanco y negro\n` +
      `\n` +

      `🎞️ ▣ ᴇғᴇᴄᴛᴏs ᴍᴏᴠɪᴍɪᴇɴᴛᴏ\n` +
      `▪️ *${usedPrefix}shake* → temblor\n` +
      `▪️ *${usedPrefix}zoom* → zoom\n` +
      `▪️ *${usedPrefix}spin* → giro\n` +
      `▪️ *${usedPrefix}bounce* → rebote\n` +
      `▪️ *${usedPrefix}rage* → movimiento agresivo\n` +
      `▪️ *${usedPrefix}pulse* → latido\n` +
      `\n` +

      `✅ ▣ ᴇᴊᴇᴍᴘʟᴏs\n` +
      `▪️ Responde a una imagen y usa: *${usedPrefix}s cir*\n` +
      `▪️ Responde a un sticker y usa: *${usedPrefix}s n*\n` +
      `▪️ Responde a un sticker animado y usa: *${usedPrefix}zoom*`
    )
  }
}