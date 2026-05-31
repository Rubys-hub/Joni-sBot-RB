import {
  getEconomyContext,
  economyOffText,
  applyCooldown,
  applyGainBonus,
  applyLossReduction,
  formatMoney,
  formatTime,
  randomInt,
  saveDB,
  takeMoney,
  vipBenefitLine,
  vipLossLine,
  vipReminder
} from '../../core/vipNormalBonus.js'
import { applyEventoEconomyMultiplier } from '../adminabuse/eventoEconomy.js'

const BASE_COOLDOWN = 3 * 60 * 60 * 1000

export default {
  command: ['cofre', 'coffer', 'chest', 'tesoro', 'caja'],
  category: 'economy',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const { chatData, user, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      user.lastCofre ||= 0
      user.coins ||= 0
      user.bank ||= 0

      const now = Date.now()
      const cooldown = applyCooldown(BASE_COOLDOWN, vipBonus)

      if (now - user.lastCofre < cooldown) {
        return m.reply(
          `⏳ ᴄᴏғʀᴇ — ᴇɴ ᴇsᴘᴇʀᴀ\n\n` +
          `Vuelve en: *${formatTime(cooldown - (now - user.lastCofre))}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      user.lastCofre = now

      const result = getCofreResult()

      if (result.type === 'bomb') {
        const loss = applyLossReduction(result.amount, vipBonus)
        const taken = takeMoney(user, loss.total)

        saveDB()

        const text = vipBonus.active
          ? (
            `💣 ᴄᴏғʀᴇ — ᴇxᴘʟᴏsɪóɴ\n\n` +
            `${result.message}\n` +
            `Tu protección VIP redujo parte del daño.\n\n` +
            vipLossLine(vipBonus, loss, currency) +
            `Perdiste: ${formatMoney(taken.lost, currency)}\n` +
            `Cartera: ${formatMoney(user.coins, currency)}\n` +
            `Banco: ${formatMoney(user.bank, currency)}` +
            vipReminder(vipBonus, usedPrefix)
          )
          : (
            `💣 ᴄᴏғʀᴇ — ᴇxᴘʟᴏsɪóɴ\n\n` +
            `${result.message}\n\n` +
            `Perdiste: ${formatMoney(taken.lost, currency)}\n` +
            `Cartera: ${formatMoney(user.coins, currency)}\n` +
            `Banco: ${formatMoney(user.bank, currency)}`
          )

        return m.reply(text)
      }

      if (result.amount <= 0) {
        saveDB()

        return m.reply(
          `🕸️ ᴄᴏғʀᴇ — ᴠᴀᴄíᴏ\n\n` +
          `${result.message}\n\n` +
          `Ganancia: ${formatMoney(0, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

const reward = applyGainBonus(result.amount, vipBonus)
const eventMult = await applyEventoEconomyMultiplier(m.chat, reward.total, { currency })

user.coins = Number(user.coins || 0) + eventMult.amount

      saveDB()

      const text = vipBonus.active
        ? (
          `${result.icon} ᴄᴏғʀᴇ — ${result.title}\n\n` +
          `${result.message}\n` +
          `Tu rango VIP aumentó la recompensa.\n\n` +
          vipBenefitLine(vipBonus, reward, currency) +
          `Ganaste: ${formatMoney(eventMult.amount, currency)}
          ${eventMult.text || ''}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `${result.icon} ᴄᴏғʀᴇ — ${result.title}\n\n` +
          `${result.message}\n\n` +
          `Ganaste: ${formatMoney(eventMult.amount, currency)}
          ${eventMult.text || ''}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}`
        )

      return m.reply(text)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}

function getCofreResult() {
  const roll = randomInt(1, 100000)

  if (roll <= 100) {
    return {
      type: 'divino',
      icon: '💎',
      title: 'ᴅɪᴠɪɴᴏ',
      amount: randomInt(300000, 500000),
      message: 'El cofre brilló con una luz rara. Encontraste una recompensa casi imposible.'
    }
  }

  if (roll <= 500) {
    return {
      type: 'legendario',
      icon: '👑',
      title: 'ʟᴇɢᴇɴᴅᴀʀɪᴏ',
      amount: randomInt(150000, 300000),
      message: 'Encontraste un tesoro legendario escondido entre polvo y oro.'
    }
  }

  if (roll <= 2000) {
    return {
      type: 'epico',
      icon: '✨',
      title: 'éᴘɪᴄᴏ',
      amount: randomInt(50000, 150000),
      message: 'El cofre soltó una recompensa bastante rara.'
    }
  }

  if (roll <= 10000) {
    return {
      type: 'bueno',
      icon: '🟡',
      title: 'ʙᴜᴇɴᴏ',
      amount: randomInt(10000, 50000),
      message: 'No fue el mejor cofre, pero sí dejó una buena paga.'
    }
  }

  if (roll <= 68000) {
    return {
      type: 'normal',
      icon: '📦',
      title: 'ɴᴏʀᴍᴀʟ',
      amount: randomInt(500, 10000),
      message: 'Abriste un cofre común y encontraste algunas monedas.'
    }
  }

  if (roll <= 93000) {
    return {
      type: 'vacio',
      icon: '🕸️',
      title: 'ᴠᴀᴄíᴏ',
      amount: 0,
      message: 'El cofre estaba casi vacío. Esta vez la suerte no quiso aparecer.'
    }
  }

  return {
    type: 'bomb',
    icon: '💣',
    title: 'ʙᴏᴍʙᴀ',
    amount: randomInt(5000, 50000),
    message: 'Abriste el cofre equivocado y explotó frente a ti.'
  }
}