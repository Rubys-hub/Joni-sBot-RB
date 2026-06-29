import {
  getEconomyContext,
  economyOffText,
  applyGainBonus,
  formatMoney,
  formatTime,
  saveDB,
  vipBenefitLine,
  vipReminder
} from '../../core/vipNormalBonus.js'
import { applyEventoEconomyMultiplier } from '../adminabuse/eventoEconomy.js'

const DAY = 24 * 60 * 60 * 1000
const MAX_STREAK = 200

export default {
  command: ['daily', 'diario'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const { chatData, user, globalUser, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      const now = Date.now()

      globalUser.streak ??= 0
      globalUser.lastDailyGlobal ??= 0
      user.lastdaily ??= 0
      user.coins ??= 0

      if (now < user.lastdaily) {
        return m.reply(
          `⏳ ᴅᴀɪʟʏ — ʏᴀ ʀᴇᴄʟᴀᴍᴀᴅᴏ\n\n` +
          `Vuelve en: *${formatTime(user.lastdaily - now)}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      const lost = globalUser.streak >= 1 && now - globalUser.lastDailyGlobal > DAY * 1.5
      if (lost) globalUser.streak = 0

      const canClaimGlobal = now - globalUser.lastDailyGlobal >= DAY
      if (canClaimGlobal) {
        globalUser.streak = Math.min(globalUser.streak + 1, MAX_STREAK)
        globalUser.lastDailyGlobal = now
      }

      const baseReward = Math.min(20000 + (globalUser.streak - 1) * 5000, 1015000)
      const reward = applyGainBonus(baseReward, vipBonus)
      const eventMult = await applyEventoEconomyMultiplier(m.chat, reward.total, { currency })

      if (!m.isOwner) user.coins = Number(user.coins || 0) + eventMult.amount
      user.lastdaily = now + DAY

      const nextBase = Math.min(20000 + globalUser.streak * 5000, 1015000)

      saveDB()

      const text = vipBonus.active
        ? (
          `🎁 ᴅᴀɪʟʏ — ʀᴇᴄᴏᴍᴘᴇɴsᴀ ᴠɪᴘ\n\n` +
          `Racha actual: Día ${globalUser.streak}\n` +
          (lost ? `Perdiste tu racha anterior por inactividad.\n\n` : `Tu racha sigue activa.\n\n`) +
          vipBenefitLine(vipBonus, reward, currency) +
          `Reclamaste: ${formatMoney(eventMult.amount, currency)}
          ${eventMult.text || ''}
          \n` +
          
          `Próximo base: ${formatMoney(nextBase, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `🎁 ᴅᴀɪʟʏ — ʀᴇᴄʟᴀᴍᴀᴅᴏ\n\n` +
          `Racha actual: Día ${globalUser.streak}\n` +
          (lost ? `Perdiste tu racha anterior por inactividad.\n\n` : `Tu racha sigue activa.\n\n`) +
          `Reclamaste: ${formatMoney(eventMult.amount, currency)}
          ${eventMult.text || ''}\n` +
          `Próximo: ${formatMoney(nextBase, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}`
        )

      return m.reply(text)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}
