function normalizeJid(value = '') {
  return String(value || '').trim()
}

function digitsOnly(value = '') {
  return String(value || '').replace(/\D/g, '')
}

function getParticipantId(p) {
  return p?.id || p?.jid || p?.lid || p?.phoneNumber || ''
}

function isAdminParticipant(participant) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin'
}

function getText(m) {
  return (
    m?.text ||
    m?.body ||
    m?.message?.conversation ||
    m?.message?.extendedTextMessage?.text ||
    m?.message?.imageMessage?.caption ||
    m?.message?.videoMessage?.caption ||
    ''
  )
}

function normalizeText(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function compactText(text = '') {
  return normalizeText(text).replace(/[\W_]+/g, '')
}

async function safeDelete(client, m) {
  try {
    await client.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.key.participant || m.sender
      }
    })
    return true
  } catch (e) {
    console.error('[AUTOMOD DELETE ERROR]', e)
    return false
  }
}

export default async function automod(client, m) {
  try {
    if (!m?.isGroup || !m?.chat || !m?.message) return false

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat) return false

    const OWNER_JID = '51901931862@s.whatsapp.net'
    const botJid =
      client.user?.jid ||
      (client.user?.id ? client.user.id.split(':')[0] + '@s.whatsapp.net' : '')

    const senderJid = m.sender
    if (!senderJid) return false

    const senderRaw = normalizeJid(senderJid)
    const senderDigits = digitsOnly(senderJid)

    const isOwner =
      senderRaw === OWNER_JID ||
      senderDigits === digitsOnly(OWNER_JID)

    if (isOwner) return false
    if (senderJid === botJid) return false

    const metadata = await client.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return false

    const participants = metadata.participants || []

    const senderParticipant = participants.find(p => {
      const id = getParticipantId(p)
      return normalizeJid(id) === senderRaw || digitsOnly(id) === senderDigits
    })

    const botParticipant = participants.find(p => {
      const id = getParticipantId(p)
      return normalizeJid(id) === normalizeJid(botJid) || digitsOnly(id) === digitsOnly(botJid)
    })

    const senderIsAdmin = isAdminParticipant(senderParticipant)
    const botIsAdmin = isAdminParticipant(botParticipant)

    if (senderIsAdmin) return false
    if (!botIsAdmin) return false

    const text = getText(m)
    const textNorm = normalizeText(text)
    const textCompact = compactText(text)

    const hasVideo =
      !!m?.message?.videoMessage ||
      m?.mtype === 'videoMessage' ||
      m?.mimetype?.startsWith?.('video/')

    const hasImage =
      !!m?.message?.imageMessage ||
      m?.mtype === 'imageMessage' ||
      m?.mimetype?.startsWith?.('image/')

    const hasSticker =
      !!m?.message?.stickerMessage ||
      m?.mtype === 'stickerMessage'

    // MUTE
    const mutedUsers = chat.mutedUsers || {}
    const muted = mutedUsers[senderJid]

    if (muted?.active) {
      if (muted.type === 'temporary' && muted.expires && muted.expires <= Date.now()) {
        delete mutedUsers[senderJid]
      } else {
        await safeDelete(client, m)
        return true
      }
    }



          // ANTIFLOOD
      if (chat.antiflood) {
        chat.floodUsers = chat.floodUsers || {}

        const settings = chat.floodSettings || {
          maxMessages: 5,
          intervalMs: 5000,
          action: 'delete'
        }

        const now = Date.now()
        const userLog = Array.isArray(chat.floodUsers[senderJid]) ? chat.floodUsers[senderJid] : []

        const filtered = userLog.filter(t => now - t < settings.intervalMs)
        filtered.push(now)
        chat.floodUsers[senderJid] = filtered

        if (filtered.length > settings.maxMessages) {
          await safeDelete(client, m)
          return true
        }
      }

      
    // ANTIVIDEO
    if (chat.antivideo && hasVideo) {
      await safeDelete(client, m)
      return true
    }

    // ANTIIMAGE
    if (chat.antiimage && hasImage) {
      await safeDelete(client, m)
      return true
    }

    // ANTISTICKER
    if (chat.antisticker && hasSticker) {
      await safeDelete(client, m)
      return true
    }

    // ANTIESTADO
    if (chat.antiestado && text) {
      const stateWords = [
        'estado',
        'estados',
        'suban a sus estados',
        'etiqueten en sus estados',
        'etiqueta en tus estados',
        'comparte en tu estado',
        'compartan en sus estados',
        'viral en estados',
        'sube a tu estado',
        'suban a estados',
        'pasalo por estados'
      ]

      if (stateWords.some(w => textNorm.includes(normalizeText(w)))) {
        await safeDelete(client, m)
        return true
      }
    }

    // BADWORDS
    if (chat.badwords && text) {
      const badWords = [
        'puta','putas','puto','putos','mierda','verga','pene','vagina',
        'culo','culona','culazo','tetona','tetas','coño','follar',
        'sexo','perra','perras','hdp','hpta','hijueputa','malparido',
        'malparida','gonorrea','carepicha','careverga','marica','maricon',
        'p0rn','porn','porno','xxx','hentai','nudes','onlyfans','xnxx','xvideos'
      ]

      if (badWords.some(w => textCompact.includes(compactText(w)))) {
        await safeDelete(client, m)
        return true
      }
    }

    // NSFW FILTER
    if (chat.nsfwFilter && (hasImage || hasVideo || hasSticker)) {
      const whitelist = [
        'sexo masculino',
        'educacion sexual'
      ]

      if (!whitelist.some(w => textNorm.includes(normalizeText(w)))) {
        const nsfwWords = [
          'porn','porno','xxx','sex','sexual','hentai','nude','nudes','naked',
          'onlyfans','of','pornhub','xnxx','xvideos','redtube','brazzers',
          'blowjob','cum','anal','milf','teen','bdsm','fetish',
          'puta','putas','puto','perra','perras','mierda','verga','pene','vagina',
          'culo','culona','culazo','tetona','tetas','coño','cojida','coger',
          'follar','sexo','desnuda','desnudo','encuerada','encuerado',
          'pack','packs','packcito','packsito',
          'pasapack','mandapack','quieropack','contenidoxxx','videosporno',
          'prn','nvd','sx','s3x','p0rn','xxxvid','pornvid'
        ]

        if (nsfwWords.some(w => textCompact.includes(compactText(w)))) {
          await safeDelete(client, m)
          return true
        }
      }
    }

    return false
  } catch (e) {
    console.error('[AUTOMOD ERROR]', e)
    return false
  }
}