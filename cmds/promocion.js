export default {
  command: [
    'pr',
    'prlist',
    'prshared',
    'prsus',
    'prmsg',
    'prsusmsg',
    'prall',
    'prtag',
    'prsustag',
    'prtagall',
    'prgtag',
    'prpromo',
    'prsuspromo',
    'prpromoall'
  ],
  category: 'owner',

  run: async (client, m, args) => {
    try {
      const OWNER_JID = '51901931862@s.whatsapp.net'
      if (m.sender !== OWNER_JID) return
      if (m.isGroup) return

      global.db.data.chats = global.db.data.chats || {}
      global.db.data.settings = global.db.data.settings || {}

      const usedCmd = (m.body || m.text || '').trim().split(/\s+/)[0].toLowerCase()
      const rawText = args.join(' ').trim()

      const botJid = (client.user?.id?.split(':')[0] || '').trim() + '@s.whatsapp.net'
      const settings = global.db.data.settings[botJid] || {}

      const CHANNEL_LINK = global.links?.channel || settings.link || 'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'
      const CHANNEL_JID = global.my?.ch || settings.id || '120363424461852442@newsletter'
      const CHANNEL_NAME = global.my?.name || settings.nameid || 'RubyJX Channel'
      const THUMBNAIL = settings.icon || settings.banner || ''

      const normalizeJid = (value = '') => String(value).trim()
      const digitsOnly = (value = '') => String(value).replace(/\D/g, '')

      const ownerDigits = digitsOnly(OWNER_JID)
      const botDigits = digitsOnly(botJid)

      const groupChats = Object.keys(global.db.data.chats).filter(jid => jid.endsWith('@g.us'))

      const sharedGroups = []
      const suspectGroups = []

      for (const jid of groupChats) {
        try {
          const metadata = await client.groupMetadata(jid).catch(() => null)
          if (!metadata) continue

          const participants = metadata.participants || []

          const ownerInGroup = participants.some(p => {
            const values = [
              p?.id,
              p?.jid,
              p?.lid,
              p?.phoneNumber,
              p?.participant
            ].filter(Boolean)

            return values.some(v => {
              const raw = normalizeJid(v)
              const dig = digitsOnly(v)
              return raw === OWNER_JID || dig === ownerDigits
            })
          })

          const botInGroup = participants.some(p => {
            const values = [
              p?.id,
              p?.jid,
              p?.lid,
              p?.phoneNumber,
              p?.participant
            ].filter(Boolean)

            return values.some(v => {
              const raw = normalizeJid(v)
              const dig = digitsOnly(v)
              return raw === botJid || dig === botDigits
            })
          })

          if (!botInGroup) continue

          const data = {
            jid,
            name: metadata.subject || 'Grupo sin nombre',
            members: participants.length,
            participants,
            ownerInGroup
          }

          if (ownerInGroup) sharedGroups.push(data)
          else suspectGroups.push(data)
        } catch {}
      }

      const allGroups = [...sharedGroups, ...suspectGroups]

      const buildMenu = () => {
        let txt = '╭━━〔 PR PANEL 〕━━⬣\n'
        txt += '┃\n'
        txt += `┃ ✅ Compartidos: ${sharedGroups.length}\n`
        txt += `┃ ⚠️ Sospechosos: ${suspectGroups.length}\n`
        txt += `┃ 📦 Total bot: ${allGroups.length}\n`
        txt += '┃\n'
        txt += '┃ Panel:\n'
        txt += '┃ .prlist\n'
        txt += '┃ .prshared\n'
        txt += '┃ .prsus\n'
        txt += '┃\n'
        txt += '┃ Mensajes normales:\n'
        txt += '┃ .prmsg 1,2 | texto\n'
        txt += '┃ .prsusmsg 1,2 | texto\n'
        txt += '┃ .prall | texto\n'
        txt += '┃\n'
        txt += '┃ Tag invisible:\n'
        txt += '┃ .prtag 1,2 | texto\n'
        txt += '┃ .prgtag 1,2 | texto\n'
        txt += '┃ .prsustag 1,2 | texto\n'
        txt += '┃ .prtagall | texto\n'
        txt += '┃\n'
        txt += '┃ Promo canal:\n'
        txt += '┃ .prpromo 1,2\n'
        txt += '┃ .prsuspromo 1,2\n'
        txt += '┃ .prpromoall\n'
        txt += '┃\n'
        txt += `┃ Canal: ${CHANNEL_LINK}\n`
        txt += '╰━━━━━━━━━━━━━━⬣'
        return txt
      }

      const buildList = (title, groups, prefix = '') => {
        let txt = `📂 *${title}*\n\n`

        if (!groups.length) {
          txt += 'No encontré grupos en esta categoría.'
          return txt
        }

        groups.forEach((g, i) => {
          txt += `${prefix}${i + 1}. ${g.name}\n`
          txt += `   👥 Miembros: ${g.members}\n`
          txt += `   🆔 ID: ${g.jid}\n\n`
        })

        return txt.trim()
      }

      const parseIndexes = (input = '', max = 0) => {
        return [...new Set(
          input
            .split(',')
            .map(x => parseInt(x.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= max)
        )]
      }

      const buildPromoText = () => {
        return [
          '🔥 *RUBYJX CHANNEL* 🔥',
          '',
          'No te quedes fuera 👀',
          '',
          '⚡ novedades del bot',
          '⚡ funciones exclusivas',
          '⚡ actualizaciones privadas',
          '⚡ contenido que no subo en grupos',
          '',
          '📢 *ÚNETE A MI CANAL OFICIAL:*',
          CHANNEL_LINK,
          '',
          'Entra desde el botón de abajo:',
          '*Ver canal*'
        ].join('\n')
      }

      const sendNormal = async (jid, text) => {
        await client.sendMessage(jid, { text: text.trim() })
      }

      const sendInvisibleTag = async (jid, text, participants = []) => {
        const mentions = participants
          .map(p => p?.id || p?.jid || p?.participant)
          .filter(Boolean)

        await client.sendMessage(jid, {
          text: text.trim() + '\u200B',
          mentions,
          contextInfo: {
            mentionedJid: mentions
          }
        })
      }

      const sendPromo = async (jid, participants = []) => {
        const mentions = participants
          .map(p => p?.id || p?.jid || p?.participant)
          .filter(Boolean)

        const text = buildPromoText()

        await client.sendMessage(jid, {
          text,
          mentions,
          contextInfo: {
            mentionedJid: mentions,
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: CHANNEL_JID,
              serverMessageId: '0',
              newsletterName: CHANNEL_NAME
            },
            externalAdReply: {
              title: CHANNEL_NAME,
              body: 'Únete a mi canal oficial',
              mediaType: 1,
              renderLargerThumbnail: true,
              thumbnailUrl: THUMBNAIL || undefined,
              sourceUrl: CHANNEL_LINK
            }
          }
        })
      }

      const runBulk = async ({ groups, indexes, message, mode = 'normal' }) => {
        const selected = indexes.map(i => ({
          index: i,
          ...groups[i - 1]
        }))

        let ok = 0
        let bad = 0
        let report = ''

        for (const g of selected) {
          try {
            if (mode === 'tag') {
              await sendInvisibleTag(g.jid, message, g.participants)
            } else if (mode === 'promo') {
              await sendPromo(g.jid, g.participants)
            } else {
              await sendNormal(g.jid, message)
            }

            ok++
            report += `✅ ${g.index}. ${g.name}\n`
          } catch {
            bad++
            report += `❌ ${g.index}. ${g.name}\n`
          }
        }

        return { ok, bad, report: report.trim() }
      }

      if (usedCmd === '.pr' || usedCmd === 'pr') {
        return m.reply(buildMenu())
      }

      if (usedCmd === '.prlist' || usedCmd === 'prlist') {
        let txt = buildList('GRUPOS COMPARTIDOS', sharedGroups)
        txt += '\n\n'
        txt += buildList('GRUPOS SOSPECHOSOS', suspectGroups, 'S')
        return m.reply(txt.trim())
      }

      if (usedCmd === '.prshared' || usedCmd === 'prshared') {
        return m.reply(buildList('GRUPOS COMPARTIDOS', sharedGroups))
      }

      if (usedCmd === '.prsus' || usedCmd === 'prsus') {
        return m.reply(buildList('GRUPOS SOSPECHOSOS', suspectGroups, 'S'))
      }

      if (usedCmd === '.prmsg' || usedCmd === 'prmsg') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.prmsg 1,2 | tu mensaje`')

        const indexes = parseIndexes(match[1], sharedGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: sharedGroups, indexes, message, mode: 'normal' })
        return m.reply(`*Envío completado*\n\n📨 Enviados: ${res.ok}\n⚠️ Fallidos: ${res.bad}\n\n${res.report}`)
      }

      if (usedCmd === '.prsusmsg' || usedCmd === 'prsusmsg') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.prsusmsg 1,2 | tu mensaje`')

        const indexes = parseIndexes(match[1], suspectGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos sospechosos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: suspectGroups, indexes, message, mode: 'normal' })
        return m.reply(`*Envío a sospechosos completado*\n\n📨 Enviados: ${res.ok}\n⚠️ Fallidos: ${res.bad}\n\n${res.report}`)
      }

if (usedCmd === '.prtag' || usedCmd === 'prtag') {
  const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
  if (!match) return m.reply('Usa: `.prtag 1,2 | tu mensaje`')

  const indexes = parseIndexes(match[1], sharedGroups.length)
  const message = match[2].trim()

  if (!indexes.length) return m.reply('No encontré grupos válidos.')
  if (!message) return m.reply('Debes escribir un mensaje.')

  const res = await runBulk({ groups: sharedGroups, indexes, message, mode: 'tag' })
  return m.reply(`*Tag invisible completado*\n\n📨 Enviados: ${res.ok}\n⚠️ Fallidos: ${res.bad}\n\n${res.report}`)
}

if (usedCmd === '.prgtag' || usedCmd === 'prgtag') {
  const indexes = parseIndexes(rawText, sharedGroups.length)
  if (!indexes.length) return m.reply('Usa: `.prgtag 1,2`')

  const res = await runBulk({ groups: sharedGroups, indexes, mode: 'promo' })
  return m.reply(`*Promo con tag enviada a grupos elegidos*\n\n📨 Enviados: ${res.ok}\n⚠️ Fallidos: ${res.bad}\n\n${res.report}`)
}
      if (usedCmd === '.prsustag' || usedCmd === 'prsustag') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.prsustag 1,2 | tu mensaje`')

        const indexes = parseIndexes(match[1], suspectGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos sospechosos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: suspectGroups, indexes, message, mode: 'tag' })
        return m.reply(`*Tag invisible a sospechosos completado*\n\n📨 Enviados: ${res.ok}\n⚠️ Fallidos: ${res.bad}\n\n${res.report}`)
      }

      if (usedCmd === '.prall' || usedCmd === 'prall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.prall | tu mensaje`')

        const message = match[1].trim()
        if (!message) return m.reply('Debes escribir un mensaje.')

        let ok = 0
        let bad = 0
        let report = ''

        for (let i = 0; i < allGroups.length; i++) {
          const g = allGroups[i]
          try {
            await sendNormal(g.jid, message)
            ok++
            report += `✅ ${i + 1}. ${g.name}\n`
          } catch {
            bad++
            report += `❌ ${i + 1}. ${g.name}\n`
          }
        }

        return m.reply(`*Envío global completado*\n\n📨 Enviados: ${ok}\n⚠️ Fallidos: ${bad}\n\n${report.trim()}`)
      }

      if (usedCmd === '.prtagall' || usedCmd === 'prtagall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.prtagall | tu mensaje`')

        const message = match[1].trim()
        if (!message) return m.reply('Debes escribir un mensaje.')

        let ok = 0
        let bad = 0
        let report = ''

        for (let i = 0; i < allGroups.length; i++) {
          const g = allGroups[i]
          try {
            await sendInvisibleTag(g.jid, message, g.participants)
            ok++
            report += `✅ ${i + 1}. ${g.name}\n`
          } catch {
            bad++
            report += `❌ ${i + 1}. ${g.name}\n`
          }
        }

        return m.reply(`*Tag global completado*\n\n📨 Enviados: ${ok}\n⚠️ Fallidos: ${bad}\n\n${report.trim()}`)
      }

if (usedCmd === '.prpromo' || usedCmd === 'prpromo') {

  if (!rawText) return m.reply('Usa: `.prpromo 1,2 o S1,S2`')

  const parts = rawText.split(',').map(x => x.trim().toLowerCase())
  let selected = []

  for (const p of parts) {
    if (p.startsWith('s')) {
      const i = parseInt(p.slice(1)) - 1
      if (!isNaN(i) && suspectGroups[i]) {
        selected.push(suspectGroups[i])
      }
    } else {
      const i = parseInt(p) - 1
      if (!isNaN(i) && sharedGroups[i]) {
        selected.push(sharedGroups[i])
      }
    }
  }

  if (!selected.length) return m.reply('No encontré grupos válidos.')

  const TOTAL_MESSAGES = 200
  const DELAY_MS = 150

  let ok = 0
  let bad = 0

  for (let r = 0; r < TOTAL_MESSAGES; r++) {
    for (const g of selected) {
      try {
        await sendPromo(g.jid, g.participants)
        ok++
      } catch {
        bad++
      }
    }

    await new Promise(res => setTimeout(res, DELAY_MS))
  }

  return m.reply(
    `🔥 *Promo enviada*\n\n` +
    `📦 Grupos: ${selected.length}\n` +
    `🔁 Rondas: ${TOTAL_MESSAGES}\n` +
    `⏱️ Delay: ${DELAY_MS}ms\n\n` +
    `✅ Enviados: ${ok}\n` +
    `⚠️ Fallidos: ${bad}`
  )
}

      if (usedCmd === '.prsuspromo' || usedCmd === 'prsuspromo') {
        const indexes = parseIndexes(rawText, suspectGroups.length)
        if (!indexes.length) return m.reply('Usa: `.prsuspromo 1,2`')

        const res = await runBulk({ groups: suspectGroups, indexes, mode: 'promo' })
        return m.reply(`*Promo enviada a grupos sospechosos*\n\n📨 Enviados: ${res.ok}\n⚠️ Fallidos: ${res.bad}\n\n${res.report}`)
      }

      if (usedCmd === '.prpromo' || usedCmd === 'prpromo') {
        const TOTAL_MESSAGES = 50
        const DELAY_MS = 150

        let roundsOk = 0
        let roundsBad = 0

        for (let round = 0; round < TOTAL_MESSAGES; round++) {
          for (let i = 0; i < allGroups.length; i++) {
            const g = allGroups[i]
            try {
              await sendPromo(g.jid, g.participants)
              roundsOk++
            } catch {
              roundsBad++
            }
          }

          await new Promise(resolve => setTimeout(resolve, DELAY_MS))
        }

        return m.reply(
          `*Promo global enviada en modo rápido*\n\n` +
          `📨 Rondas: ${TOTAL_MESSAGES}\n` +
          `⏱️ Delay: ${DELAY_MS}ms\n` +
          `✅ Envíos correctos: ${roundsOk}\n` +
          `⚠️ Fallidos: ${roundsBad}\n` +
          `📦 Grupos objetivo: ${allGroups.length}`
        )
      }

    } catch (e) {
      return m.reply(`Error: ${e.message}`)
    }
  }
}