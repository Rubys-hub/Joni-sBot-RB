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

const MONTH = 30 * 24 * 60 * 60 * 1000
const MAX_STREAK = 12

export default {
  command: ['monthly', 'mensual'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const { chatData, user, globalUser, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      const now = Date.now()

      globalUser.monthlyStreak ??= 0
      globalUser.lastMonthlyGlobal ??= 0
      user.lastmonthly ??= 0
      user.coins ??= 0

      if (now < user.lastmonthly) {
        return m.reply(
          `⏳ ᴍᴏɴᴛʜʟʏ — ʏᴀ ʀᴇᴄʟᴀᴍᴀᴅᴏ\n\n` +
          `Vuelve en: *${formatTime(user.lastmonthly - now)}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      const lost = globalUser.monthlyStreak >= 1 && now - globalUser.lastMonthlyGlobal > MONTH * 1.5
      if (lost) globalUser.monthlyStreak = 0

      const canClaimGlobal = now - globalUser.lastMonthlyGlobal >= MONTH
      if (canClaimGlobal) {
        globalUser.monthlyStreak = Math.min(globalUser.monthlyStreak + 1, MAX_STREAK)
        globalUser.lastMonthlyGlobal = now
      }

      const baseReward = Math.min(150000 + (globalUser.monthlyStreak - 1) * 25000, 1000000)
      const reward = applyGainBonus(baseReward, vipBonus)

      if (!m.isOwner) user.coins = Number(user.coins || 0) + reward.total
      user.lastmonthly = now + MONTH

      const nextBase = Math.min(150000 + globalUser.monthlyStreak * 25000, 1000000)

      saveDB()

      const text = vipBonus.active
        ? (
          `🎁 ᴍᴏɴᴛʜʟʏ — ʙᴏɴᴏ ᴍᴇɴsᴜᴀʟ ᴠɪᴘ\n\n` +
          `Mes actual: ${globalUser.monthlyStreak}\n` +
          (lost ? `Perdiste tu racha mensual anterior.\n\n` : `Tu racha mensual sigue activa.\n\n`) +
          vipBenefitLine(vipBonus, reward, currency) +
          `Reclamaste: ${formatMoney(reward.total, currency)}\n` +
          `Próximo base: ${formatMoney(nextBase, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `🎁 ᴍᴏɴᴛʜʟʏ — ʀᴇᴄʟᴀᴍᴀᴅᴏ\n\n` +
          `Mes actual: ${globalUser.monthlyStreak}\n` +
          (lost ? `Perdiste tu racha mensual anterior.\n\n` : `Tu racha mensual sigue activa.\n\n`) +
          `Reclamaste: ${formatMoney(reward.total, currency)}\n` +
          `Próximo: ${formatMoney(nextBase, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}`
        )

      return m.reply(text)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}
