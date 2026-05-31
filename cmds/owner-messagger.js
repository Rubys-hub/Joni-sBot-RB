const FORCE_OWNER = [
  '51901931862',
  '51901931862@s.whatsapp.net',
  '269015712845891',
  '269015712845891@lid'
]

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


global.prMetadataCache ||= new Map()

const PR_METADATA_TTL = 10 * 60 * 1000

async function safeGroupMetadata(client, jid, force = false) {
  const key = cleanJid(jid)
  if (!key) return null

  const cached = global.prMetadataCache.get(key)

  if (!force && cached && Date.now() - cached.time < PR_METADATA_TTL) {
    return cached.data
  }

  try {
    const metadata = await client.groupMetadata(key)

    global.prMetadataCache.set(key, {
      time: Date.now(),
      data: metadata
    })

    await sleep(650)
    return metadata
  } catch (error) {
    const msg = String(error?.message || error || '')

    if (msg.includes('rate-overlimit')) {
      await sleep(4000)

      try {
        const metadata = await client.groupMetadata(key)

        global.prMetadataCache.set(key, {
          time: Date.now(),
          data: metadata
        })

        await sleep(900)
        return metadata
      } catch {
        if (cached?.data) return cached.data
        return null
      }
    }

    if (cached?.data) return cached.data
    return null
  }
}


export default {
  command: ['mlist', 'mp', 'mtag', 'mptag', 'mall', 'mtagall'],
  category: 'owner',

  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      const senderReal = m.sender

      const senderIsOwner =
        isOwnerUser(m.sender) ||
        isOwnerUser(senderReal)

      if (!senderIsOwner) return

      global.db.data.users ||= {}
      global.db.data.chats ||= {}

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

      const senderCandidates = [
        m.sender,
        senderReal,
        ...FORCE_OWNER,
        ...(Array.isArray(global.owner)
          ? global.owner.flat(Infinity).map(num => `${String(num).replace(/\D/g, '')}@s.whatsapp.net`)
          : []),
        `${digitsOnly(m.sender)}@s.whatsapp.net`,
        `${digitsOnly(senderReal)}@s.whatsapp.net`,
        `${digitsOnly(m.sender)}@lid`,
        `${digitsOnly(senderReal)}@lid`
      ].filter(Boolean)

      const botJid = cleanJid(client?.user?.id || client?.user?.lid)
      const botCandidates = [
        botJid,
        client?.user?.id,
        client?.user?.lid,
        `${digitsOnly(botJid)}@s.whatsapp.net`,
        `${digitsOnly(botJid)}@lid`
      ].filter(Boolean)

      const groupChats = Object.keys(global.db.data.chats)
        .filter(jid => jid.endsWith('@g.us'))

      const sharedGroups = []

      for (const jid of groupChats) {
        try {
          const metadata = await safeGroupMetadata(client, jid)
          if (!metadata) continue

          const participants = metadata.participants || []

          const isUserInGroup = participants.some(p => {
            const ids = getParticipantJids(p)
            return ids.some(id =>
              senderCandidates.some(candidate => sameUser(id, candidate))
            )
          })

          const isBotInGroup = participants.some(p => {
            const ids = getParticipantJids(p)
            return ids.some(id =>
              botCandidates.some(candidate => sameUser(id, candidate))
            )
          })

          if (isUserInGroup && isBotInGroup) {
            sharedGroups.push({
              jid,
              name: metadata.subject || 'Grupo sin nombre',
              members: participants.length,
              participants
            })
          }
        } catch {}
      }

      if (!sharedGroups.length) {
        return m.reply(`📂 ᴍʟɪsᴛ ✦ No encontré grupos compartidos entre tú y el bot.`)
      }

      const makeList = () => {
        let txt = `📂 *Lista de grupos compartidos*\n\n`

        sharedGroups.forEach((g, i) => {
          txt += `*${i + 1}.* ${g.name}\n`
          txt += `👥 Miembros: ${g.members}\n`
          txt += `🆔 ID: ${g.jid}\n\n`
        })

        txt += `━━━━━━━━━━━━━━━\n`
        txt += `*Uso:*\n`
        txt += `• *${usedPrefix}mp 1,3,2 | hola*\n`
        txt += `• *${usedPrefix}mtag 1,3,2 | hola*\n`
        txt += `• *${usedPrefix}mall | hola a todos*\n`
        txt += `• *${usedPrefix}mtagall | hola a todos*`

        return txt.trim()
      }

      const parseIndexes = (input = '') => {
        return [...new Set(
          String(input)
            .split(',')
            .map(x => parseInt(x.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= sharedGroups.length)
        )]
      }

      const sendNormalMessage = async (jid, message) => {
        await client.sendMessage(jid, {
          text: message.trim()
        })
      }

      const sendTagMessage = async (jid, message, participants = []) => {
        const mentions = getMentions(participants)

        await client.sendMessage(jid, {
          text: message.trim(),
          mentions
        })
      }

      if (usedCmd === 'mlist') {
        return m.reply(makeList())
      }

      if (['mp', 'mtag', 'mptag'].includes(usedCmd)) {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)

        if (!match) {
          return m.reply(
            `✎ ғᴏʀᴍᴀᴛᴏ ɪɴᴄᴏʀʀᴇᴄᴛᴏ\n\n` +
            `Ejemplos:\n` +
            `*${usedPrefix}mp 1,3,2 | hola*\n` +
            `*${usedPrefix}mtag 1,3,2 | hola*\n` +
            `*${usedPrefix}mptag 1,3,2 | hola*`
          )
        }

        const indexesRaw = match[1].trim()
        const message = match[2].trim()

        if (!message) return m.reply(`✎ ᴀᴠɪsᴏ ✦ Debes escribir un mensaje después de *|*.`)

        const indexes = parseIndexes(indexesRaw)
        if (!indexes.length) return m.reply(`📂 ᴀᴠɪsᴏ ✦ No encontré grupos válidos en la lista.`)

        const selectedGroups = indexes.map(i => ({
          index: i,
          ...sharedGroups[i - 1]
        }))

        let enviados = 0
        let fallidos = 0
        let reporte = ''

        const isTagCmd = ['mtag', 'mptag'].includes(usedCmd)

        for (const g of selectedGroups) {
          try {
            if (isTagCmd) {
              await sendTagMessage(g.jid, message, g.participants)
            } else {
              await sendNormalMessage(g.jid, message)
            }

            enviados++
            reporte += `✅ ${g.index}. ${g.name}\n`
          } catch (error) {
            fallidos++
            reporte += `❌ ${g.index}. ${g.name} » ${error?.message || 'Error'}\n`
          }

          await sleep(1200)
        }

        return m.reply(
          `📨 *Envío completado*\n\n` +
          `✅ Enviados: *${enviados}*\n` +
          `⚠️ Fallidos: *${fallidos}*\n\n` +
          reporte.trim()
        )
      }

      if (usedCmd === 'mall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`✎ ᴜsᴏ ✦ *${usedPrefix}mall | tu mensaje*`)

        const message = match[1].trim()
        if (!message) return m.reply(`✎ ᴀᴠɪsᴏ ✦ Debes escribir un mensaje después de *|*.`)

        let enviados = 0
        let fallidos = 0
        let reporte = ''

        for (let i = 0; i < sharedGroups.length; i++) {
          const g = sharedGroups[i]

          try {
            await sendNormalMessage(g.jid, message)
            enviados++
            reporte += `✅ ${i + 1}. ${g.name}\n`
          } catch (error) {
            fallidos++
            reporte += `❌ ${i + 1}. ${g.name} » ${error?.message || 'Error'}\n`
          }

          await sleep(1200)
        }

        return m.reply(
          `📨 *Mensaje enviado a todos los grupos compartidos*\n\n` +
          `✅ Enviados: *${enviados}*\n` +
          `⚠️ Fallidos: *${fallidos}*\n\n` +
          reporte.trim()
        )
      }

      if (usedCmd === 'mtagall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply(`✎ ᴜsᴏ ✦ *${usedPrefix}mtagall | tu mensaje*`)

        const message = match[1].trim()
        if (!message) return m.reply(`✎ ᴀᴠɪsᴏ ✦ Debes escribir un mensaje después de *|*.`)

        let enviados = 0
        let fallidos = 0
        let reporte = ''

        for (let i = 0; i < sharedGroups.length; i++) {
          const g = sharedGroups[i]

          try {
            await sendTagMessage(g.jid, message, g.participants)
            enviados++
            reporte += `✅ ${i + 1}. ${g.name}\n`
          } catch (error) {
            fallidos++
            reporte += `❌ ${i + 1}. ${g.name} » ${error?.message || 'Error'}\n`
          }

          await sleep(1200)
        }

        return m.reply(
          `🏷️ *Mensaje con menciones enviado a todos los grupos compartidos*\n\n` +
          `✅ Enviados: *${enviados}*\n` +
          `⚠️ Fallidos: *${fallidos}*\n\n` +
          reporte.trim()
        )
      }
} catch (e) {
  const msg = String(e?.message || e)

  if (msg.includes('rate-overlimit')) {
    return m.reply(
      `⚠️ ᴘʀ ʟɪᴍɪᴛᴀᴅᴏ\n\n` +
      `WhatsApp limitó las consultas de grupos por exceso de velocidad.\n` +
      `Espera 1 o 2 minutos y vuelve a usar *${usedPrefix}prlist*.\n\n` +
      `Ya agregué caché y delay para reducir este error.`
    )
  }

  return m.reply(`❌ ᴇʀʀᴏʀ ✦ ${msg}`)
}
  }
}