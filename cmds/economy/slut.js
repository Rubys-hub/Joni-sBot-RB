import {
  getEconomyContext,
  economyOffText,
  applyCooldown,
  applyGainBonus,
  applyLossReduction,
  applySuccessChance,
  formatMoney,
  formatTime,
  pickRandom,
  randomInt,
  saveDB,
  takeMoney,
  vipBenefitLine,
  vipLossLine,
  vipReminder
} from '../../core/vipNormalBonus.js'
import { applyEventoEconomyMultiplier } from '../adminabuse/eventoEconomy.js'

const BASE_COOLDOWN = 5 * 60 * 1000
const BASE_SUCCESS = 0.50

export default {
  command: ['slut', 'prostituirse'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const { chatData, user, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      user.lastslut ||= 0
      user.coins ||= 0
      user.bank ||= 0

      const now = Date.now()
      const cooldown = applyCooldown(BASE_COOLDOWN, vipBonus)

      if (now < user.lastslut) {
        return m.reply(
          `⏳ ʀɪᴇsɢᴏ — ᴇɴ ᴇsᴘᴇʀᴀ\n\n` +
          `Vuelve en: *${formatTime(user.lastslut - now)}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      const successChance = applySuccessChance(BASE_SUCCESS, vipBonus)
      const success = Math.random() < successChance

      user.lastslut = now + cooldown

      if (success) {
        const baseAmount = randomInt(3500, 6000)
const gain = applyGainBonus(baseAmount, vipBonus)
const eventMult = await applyEventoEconomyMultiplier(m.chat, gain.total, { currency })

user.coins = Number(user.coins || 0) + eventMult.amount

        saveDB()

        const text = vipBonus.active
          ? (
            `💋 ʀɪᴇsɢᴏ — ᴘᴀɢᴏ ᴍᴇᴊᴏʀᴀᴅᴏ\n\n` +
            `${pickRandom(winMessages)}\n` +
            `Tu rango VIP hizo que la recompensa subiera.\n\n` +
            vipBenefitLine(vipBonus, gain, currency) +
            `Ganaste: ${formatMoney(eventMult.amount, currency)}
            ${eventMult.text || ''}\n` +
            `Cartera: ${formatMoney(user.coins, currency)}` +
            vipReminder(vipBonus, usedPrefix)
          )
          : (
            `💋 ʀɪᴇsɢᴏ — ᴛᴜᴠɪsᴛᴇ sᴜᴇʀᴛᴇ\n\n` +
            `${pickRandom(winMessages)}\n\n` +
            `Ganaste: ${formatMoney(eventMult.amount, currency)}
            ${eventMult.text || ''}\n` +
            `Cartera: ${formatMoney(user.coins, currency)}`
          )

        return m.reply(text)
      }

      const baseLoss = randomInt(2000, 4000)
      const loss = applyLossReduction(baseLoss, vipBonus)
      const taken = takeMoney(user, loss.total)

      saveDB()

      const text = vipBonus.active
        ? (
          `💋 ʀɪᴇsɢᴏ — sᴀʟɪó ᴍᴀʟ\n\n` +
          `${pickRandom(loseMessages)}\n` +
          `Tu protección VIP redujo parte de la pérdida.\n\n` +
          vipLossLine(vipBonus, loss, currency) +
          `Perdiste: ${formatMoney(taken.lost, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}\n` +
          `Banco: ${formatMoney(user.bank, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `💋 ʀɪᴇsɢᴏ — sᴀʟɪó ᴍᴀʟ\n\n` +
          `${pickRandom(loseMessages)}\n\n` +
          `Perdiste: ${formatMoney(taken.lost, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}\n` +
          `Banco: ${formatMoney(user.bank, currency)}`
        )

      return m.reply(text)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}

const winMessages = [
  'Hiciste una presentación privada y todo salió mejor de lo esperado.',
  'Te contrataron para un evento elegante y pagaron bien.',
  'Tu actuación fue un éxito y recibiste una buena paga.',
  'Vendiste contenido exclusivo y te fue bastante bien.',
  'Tu presentación se volvió popular y generó ganancias.'
]

const loseMessages = [
  'La oportunidad salió mal y terminaste perdiendo dinero.',
  'Cancelaron el evento a último momento y quedaste en pérdida.',
  'Invertiste en vestuario y no recuperaste lo gastado.',
  'Tu actuación no convenció y la ganancia se volvió pérdida.',
  'Fue un mal día y la suerte no estuvo contigo.',
  'Le mamaste el pene a un gordo'
]