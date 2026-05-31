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

const BASE_COOLDOWN = 7 * 60 * 1000
const BASE_SUCCESS = 0.40

export default {
  command: ['crime', 'crimen'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.') => {
    try {
      const { chatData, user, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      user.lastcrime ||= 0
      user.coins ||= 0
      user.bank ||= 0

      const now = Date.now()
      const cooldown = applyCooldown(BASE_COOLDOWN, vipBonus)

      if (now < user.lastcrime) {
        return m.reply(
          `⏳ ᴄʀɪᴍᴇ — ᴇɴ ᴇsᴘᴇʀᴀ\n\n` +
          `Vuelve en: *${formatTime(user.lastcrime - now)}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      const successChance = applySuccessChance(BASE_SUCCESS, vipBonus)
      const success = Math.random() < successChance

      user.lastcrime = now + cooldown

      if (success) {
        const baseAmount = randomInt(5500, 7500)
const gain = applyGainBonus(baseAmount, vipBonus)
const eventMult = await applyEventoEconomyMultiplier(m.chat, gain.total, { currency })

user.coins = Number(user.coins || 0) + eventMult.amount

        saveDB()

        const text = vipBonus.active
          ? (
            `🕵️ ᴄʀɪᴍᴇ — ɢᴏʟᴘᴇ ᴇxɪᴛᴏsᴏ\n\n` +
            `${pickRandom(successMessages)}\n` +
            `Tu rango VIP aumentó la recompensa de la jugada.\n\n` +
            vipBenefitLine(vipBonus, gain, currency) +
            `Ganaste: ${formatMoney(eventMult.amount, currency)}
            ${eventMult.text || ''}\n` +
            `Cartera: ${formatMoney(user.coins, currency)}` +
            vipReminder(vipBonus, usedPrefix)
          )
          : (
            `🕵️ ᴄʀɪᴍᴇ — ɢᴏʟᴘᴇ ᴇxɪᴛᴏsᴏ\n\n` +
            `${pickRandom(successMessages)}\n\n` +
            `Ganaste: ${formatMoney(eventMult.amount, currency)}
            ${eventMult.text || ''}\n` +
            `Cartera: ${formatMoney(user.coins, currency)}`
          )

        return m.reply(text)
      }

      const baseLoss = randomInt(4000, 6000)
      const loss = applyLossReduction(baseLoss, vipBonus)
      const taken = takeMoney(user, loss.total)

      saveDB()

      const text = vipBonus.active
        ? (
          `🕵️ ᴄʀɪᴍᴇ — ʟᴀ ᴊᴜɢᴀᴅᴀ ғᴀʟʟó\n\n` +
          `${pickRandom(failMessages)}\n` +
          `Tu protección VIP redujo parte de la pérdida.\n\n` +
          vipLossLine(vipBonus, loss, currency) +
          `Perdiste: ${formatMoney(taken.lost, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}\n` +
          `Banco: ${formatMoney(user.bank, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `🕵️ ᴄʀɪᴍᴇ — ʟᴀ ᴊᴜɢᴀᴅᴀ ғᴀʟʟó\n\n` +
          `${pickRandom(failMessages)}\n\n` +
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

const successMessages = [
  'Hiciste un movimiento arriesgado y salió perfecto.',
  'Lograste escapar sin ser visto y conseguiste una buena paga.',
  'Tu plan funcionó mejor de lo esperado.',
  'La suerte estuvo de tu lado y saliste ganando.',
  'Ejecutaste una jugada limpia y rápida.'
]

const failMessages = [
  'Tu plan salió mal y terminaste perdiendo dinero.',
  'Te atraparon en el intento y la jugada fue un desastre.',
  'Fallaste la operación y pagaste las consecuencias.',
  'La suerte no estuvo de tu lado esta vez.',
  'La jugada se cayó antes de completarse.'
]