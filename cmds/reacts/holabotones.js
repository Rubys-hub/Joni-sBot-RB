export default {
  command: ['holabotones'],
  category: 'tools',

  run: async (client, m) => {
    try {
      await client.sendMessage(
        m.chat,
        {
          text: `╭━━━〔 ✨ *MENÚ DE PRUEBA* 〕━━━╮
┃
┃ _Selecciona una categoría del menú._
┃ _Esta es una prueba con varios botones._
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
          footer: 'RubyJX Bot • Prueba de botones',
          buttons: [
            {
              buttonId: '.menu economia',
              buttonText: { displayText: '↩ ECONOMIA' },
              type: 1
            },
            {
              buttonId: '.menu gacha',
              buttonText: { displayText: '↩ GACHA' },
              type: 1
            },
            {
              buttonId: '.menu downloads',
              buttonText: { displayText: '↩ DOWNLOADS' },
              type: 1
            },
            {
              buttonId: '.menu profile',
              buttonText: { displayText: '↩ PROFILE' },
              type: 1
            },
            {
              buttonId: '.menu sockets',
              buttonText: { displayText: '↩ SOCKETS' },
              type: 1
            },
            {
              buttonId: '.menu utils',
              buttonText: { displayText: '↩ UTILS' },
              type: 1
            },
            {
              buttonId: '.menu grupo',
              buttonText: { displayText: '↩ GRUPO' },
              type: 1
            },
            {
              buttonId: '.menu nsfw',
              buttonText: { displayText: '↩ NSFW' },
              type: 1
            },
            {
              buttonId: '.menu anime',
              buttonText: { displayText: '↩ ANIME' },
              type: 1
            },
            {
              buttonId: '.menu stickers',
              buttonText: { displayText: '↩ STICKERS' },
              type: 1
            },
            {
              buttonId: '.menu owner',
              buttonText: { displayText: '↩ OWNER' },
              type: 1
            },
            {
              buttonId: '.menu completo',
              buttonText: { displayText: '📋 COMPLETO' },
              type: 1
            }
          ],
          headerType: 1
        },
        {
          quoted: m
        }
      )
    } catch (e) {
      console.error('ERROR BOTONES MENU:', e)
      return m.reply(`Error botones menu: ${e.message}`)
    }
  }
}