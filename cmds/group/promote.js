const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

function cleanJid(jid = '') {
  jid = String(jid || '').trim()
  if (!jid) return ''

  if (!jid.includes('@')) return jid.split(':')[0]

  const [left, server] = jid.split('@')
  const cleanLeft = left.split(':')[0]

  return `${cleanLeft}@${server}`
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function sameUser(a = '', b = '') {
  const rawA = cleanJid(a)
  const rawB = cleanJid(b)

  if (!rawA || !rawB) return false
  if (rawA === rawB) return true

  const numA = onlyNumber(rawA)
  const numB = onlyNumber(rawB)

  return !!numA && !!numB && numA === numB
}

function isOwnerUser(jid = '') {
  const raw = cleanJid(jid)
  const number = onlyNumber(jid)

  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ].filter(Boolean)

  return owners.some(owner => {
    const ownerRaw = cleanJid(owner)
    const ownerNumber = onlyNumber(owner)

    return (
      ownerRaw === raw ||
      ownerNumber === number ||
      ownerRaw === `${number}@s.whatsapp.net` ||
      ownerRaw === `${number}@lid`
    )
  })
}

function isAdminParticipant(participant = {}) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin'
}

function findParticipant(participants = [], candidates = []) {
  const cleanCandidates = candidates.map(cleanJid).filter(Boolean)

  return participants.find(p => {
    const possible = [
      p?.id,
      p?.jid,
      p?.lid,
      p?.phoneNumber
    ].map(cleanJid).filter(Boolean)

    return possible.some(pid =>
      cleanCandidates.some(candidate => sameUser(pid, candidate) || pid === candidate)
    )
  })
}

function getContextInfo(m = {}) {
  return (
    m?.message?.extendedTextMessage?.contextInfo ||
    m?.msg?.contextInfo ||
    m?.message?.imageMessage?.contextInfo ||
    m?.message?.videoMessage?.contextInfo ||
    {}
  )
}

function getMentionedJids(m = {}) {
  const contextInfo = getContextInfo(m)

  return [
    ...(Array.isArray(m.mentionedJid) ? m.mentionedJid : []),
    ...(Array.isArray(contextInfo.mentionedJid) ? contextInfo.mentionedJid : [])
  ].filter(Boolean)
}

function getQuotedSender(m = {}) {
  const contextInfo = getContextInfo(m)

  return (
    m?.quoted?.sender ||
    m?.quoted?.participant ||
    contextInfo?.participant ||
    ''
  )
}

export default {
  command: ['promote'],
  category: 'grupo',
  botAdmin: true,
  group: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'promote') => {
    if (!m.isGroup) {
      return m.reply(
        `⚠️ *Comando solo para grupos*\n\n` +
        `> Este comando no funciona en privado.`
      )
    }

    const senderIsOwner = isOwnerUser(m.sender)

    if (!senderIsOwner && !m.isAdmin) {
      return m.reply(
        `🔒 *Permiso denegado*\n\n` +
        `> Solo los *admins del grupo* o el *owner del bot* pueden usar este comando.`
      )
    }

    if (!m.isBotAdmin) {
      return m.reply(
        `🛡️ *No puedo promover usuarios*\n\n` +
        `> Primero necesito ser *administrador* del grupo.`
      )
    }

    const mentioned = getMentionedJids(m)
    const quotedSender = getQuotedSender(m)

    const numberArg = args.find(v => {
      const num = onlyNumber(v)
      return num.length >= 8
    })

    const targetJid =
      mentioned[0] ||
      quotedSender ||
      (numberArg ? `${onlyNumber(numberArg)}@s.whatsapp.net` : '')

    if (!targetJid) {
      return m.reply(
        `✨ *Promover usuario*\n\n` +
        `> Menciona o responde al usuario que quieres hacer admin.\n\n` +
        `📌 *Ejemplo:*\n` +
        `> ${usedPrefix + command} @usuario`
      )
    }

    try {
      const groupMetadata = await client.groupMetadata(m.chat)

      const participants = Array.isArray(groupMetadata?.participants)
        ? groupMetadata.participants
        : []

      const targetParticipant = findParticipant(participants, [targetJid])

      if (!targetParticipant) {
        return m.reply(
          `🔎 *Usuario no encontrado*\n\n` +
          `> No pude encontrar a ese usuario dentro del grupo.`
        )
      }

      if (isAdminParticipant(targetParticipant)) {
        return client.sendMessage(m.chat, {
          text:
            `👑 *Ya es administrador*\n\n` +
            `> @${onlyNumber(targetParticipant.id || targetJid)} ya tiene rango de admin.`,
          mentions: [targetParticipant.id || targetJid]
        }, { quoted: m })
      }

      const promoteCandidates = [
        targetParticipant?.id,
        targetParticipant?.jid,
        targetParticipant?.lid,
        targetJid
      ].map(cleanJid).filter(Boolean)

      let promoted = false
      let lastError = null

      for (const jid of [...new Set(promoteCandidates)]) {
        try {
          await client.groupParticipantsUpdate(m.chat, [jid], 'promote')
          promoted = true
          break
        } catch (e) {
          lastError = e
        }
      }

      if (!promoted) {
        return m.reply(
          `❌ *No pude promoverlo*\n\n` +
          `> WhatsApp rechazó la promoción.\n\n` +
          `🧩 *Error:*\n` +
          `> _${lastError?.message || lastError || 'desconocido'}_`
        )
      }

      /*
        No enviamos mensaje de éxito.
        WhatsApp ya muestra automáticamente:
        “X fue promovido a administrador”.
        Así evitamos doble verificación.
      */

      return
    } catch (e) {
      return m.reply(
        `💥 *Error al ejecutar promote*\n\n` +
        `> Ocurrió un problema al intentar promover al usuario.\n\n` +
        `🧩 *Detalle:*\n` +
        `> _${e?.message || e}_`
      )
    }
  }
}