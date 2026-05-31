import {
  getEconomyContext,
  economyOffText,
  applyCooldown,
  applyGainBonus,
  formatMoney,
  formatTime,
  pickRandom,
  randomInt,
  saveDB,
  vipBenefitLine,
  vipReminder
} from '../../core/vipNormalBonus.js'

const BASE_COOLDOWN = 3 * 60 * 1000

export default {
  command: ['w', 'work', 'chambear', 'chamba', 'trabajar'],
  category: 'rpg',
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = '') => {
    try {
      const { chatData, user, currency, vipBonus } = await getEconomyContext(client, m, usedPrefix)

      if (chatData.adminonly || !chatData.economy) {
        return m.reply(economyOffText(usedPrefix))
      }

      user.lastwork ||= 0

      const cooldown = applyCooldown(BASE_COOLDOWN, vipBonus)
      const now = Date.now()

      if (now < user.lastwork) {
        return m.reply(
          `⏳ ᴡᴏʀᴋ — ᴇɴ ᴇsᴘᴇʀᴀ\n\n` +
          `Vuelve en: *${formatTime(user.lastwork - now)}*` +
          vipReminder(vipBonus, usedPrefix)
        )
      }

      const baseGain = randomInt(2000, 4000)
      const gain = applyGainBonus(baseGain, vipBonus)

      user.coins = Number(user.coins || 0) + gain.total
      user.lastwork = now + cooldown

      saveDB()

      const job = pickRandom(trabajos)

      const text = vipBonus.active
        ? (
          `💼 ᴡᴏʀᴋ — ᴘᴀɢᴏ ᴍᴇᴊᴏʀᴀᴅᴏ\n\n` +
          `${job}.\n` +
          `La jornada estuvo pesada, pero tu rango VIP aumentó la paga.\n\n` +
          vipBenefitLine(vipBonus, gain, currency) +
          `Ganaste: ${formatMoney(gain.total, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}` +
          vipReminder(vipBonus, usedPrefix)
        )
        : (
          `💼 ᴡᴏʀᴋ — ᴄʜᴀᴍʙᴀ ʀᴇᴀʟɪᴢᴀᴅᴀ\n\n` +
          `${job}.\n` +
          `La jornada estuvo pesada, pero valió la pena.\n\n` +
          `Ganaste: ${formatMoney(gain.total, currency)}\n` +
          `Cartera: ${formatMoney(user.coins, currency)}`
        )

      return m.reply(text)
    } catch (error) {
      return m.reply(`Error: ${error?.message || String(error)}`)
    }
  }
}

const trabajos = [
  'Trabajaste como mesero en un restaurante lleno',
  'Reparaste celulares durante toda la tarde',
  'Ayudaste cargando cajas en un almacén',
  'Hiciste delivery bajo presión',
  'Diseñaste un logo para un cliente exigente',
  'Editaste videos para redes sociales',
  'Limpiaste una oficina y dejaste todo brillante',
  'Vendiste productos en una tienda ocupada',
  'Trabajaste como asistente administrativo',
  'Organizaste documentos y ganaste una buena comisión',
  'Hiciste una chamba rápida en construcción',
  'Trabajaste de barista preparando cafés',
  'Ayudaste en un taller mecánico',
  'Hiciste soporte técnico a varios usuarios',
  'Trabajaste como repartidor de comida',
  'Hiciste mantenimiento a computadoras',
  'Atendiste clientes en una tienda',
  'Trabajaste como fotógrafo en un evento',
  'Hiciste una campaña publicitaria pequeña',
  'Trabajaste como jardinero por unas horas',
  'Le mamaste el pene a un gordo'
]