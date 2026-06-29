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

const WEEK = 7 * 24 * 60 * 60 * 1000
const MAX_STREAK = 30

export default {
  command: ['weekly', 'semanal'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const { chatData, user, globalUser, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      const now = Date.now()

      globalUser.weeklyStreak ??= 0
      globalUser.lastWeeklyGlobal ??= 0
      user.lastweekly ??= 0
      user.coins ??= 0

      if (now < user.lastweekly) {
        return m.reply(
          `⏳ ᴡᴇᴇᴋʟʏ — ʏᴀ ʀᴇᴄʟᴀᴍᴀᴅᴏ\n\n` +
          `Vuelve en: *${formatTime(user.lastweekly - now)}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      const lost = globalUser.weeklyStreak >= 1 && now - globalUser.lastWeeklyGlobal > WEEK * 1.5
      if (lost) globalUser.weeklyStreak = 0

      const canClaimGlobal = now - globalUser.lastWeeklyGlobal >= WEEK
      if (canClaimGlobal) {
        globalUser.weeklyStreak = Math.min(globalUser.weeklyStreak + 1, MAX_STREAK)
        globalUser.lastWeeklyGlobal = now
      }

      const baseReward = Math.min(40000 + (globalUser.weeklyStreak - 1) * 5000, 185000)
      const reward = applyGainBonus(baseReward, vipBonus)

      if (!m.isOwner) user.coins = Number(user.coins || 0) + reward.total
      user.lastweekly = now + WEEK

      const nextBase = Math.min(40000 + globalUser.weeklyStreak * 5000, 185000)

      saveDB()

      const text = vipBonus.active
        ? (
          `🎁 ᴡᴇᴇᴋʟʏ — ʙᴏɴᴏ sᴇᴍᴀɴᴀʟ ᴠɪᴘ\n\n` +
          `Semana actual: ${globalUser.weeklyStreak}\n` +
          (lost ? `Perdiste tu racha semanal anterior.\n\n` : `Tu racha semanal sigue activa.\n\n`) +
          vipBenefitLine(vipBonus, reward, currency) +
          `Reclamaste: ${formatMoney(reward.total, currency)}\n` +
          `Próximo base: ${formatMoney(nextBase, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `🎁 ᴡᴇᴇᴋʟʏ — ʀᴇᴄʟᴀᴍᴀᴅᴏ\n\n` +
          `Semana actual: ${globalUser.weeklyStreak}\n` +
          (lost ? `Perdiste tu racha semanal anterior.\n\n` : `Tu racha semanal sigue activa.\n\n`) +
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
