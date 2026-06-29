import { isSocketOwner } from "../../core/utils.js";

export default {
  command: ['setbotcurrency', 'setcurrency'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = await isSocketOwner(client, m, config)
    if (!isOwner2) return m.reply(mess.socket)
    const value = args.join(' ').trim()
    if (!value) return m.reply(`✐ Debes escribir un nombre de moneda valido.\n> Ejemplo: *${usedPrefix + command} Coins*`)
    config.currency = value
    return m.reply(`✿ Se ha cambiado la moneda del bot a *${value}*`)
  },
};
