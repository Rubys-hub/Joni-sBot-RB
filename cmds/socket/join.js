export default {
  command: ['join', 'unir'],
  category: 'socket',

  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botLid = client.user?.lid || ''
    const config = global.db.data.settings[idBot] ||= {}

    // AGREGA AQUÍ TU NÚMERO Y TU LID
    const FORCE_SOCKET = [
      '51901931862',
      '269015712845891@lid'
    ]

    const cleanJid = (jid = '') =>
      String(jid || '').trim().replace(/:\d+/, '')

    const digitsOnly = (jid = '') =>
      cleanJid(jid).split('@')[0].replace(/\D/g, '')

    const senderRaw = cleanJid(m.sender)
    const senderDigits = digitsOnly(m.sender)

    const allowedJids = [
      idBot,
      botLid,
      config.owner,
      ...(Array.isArray(global.owner)
        ? global.owner.map(num => `${String(num).replace(/\D/g, '')}@s.whatsapp.net`)
        : []),
      ...FORCE_SOCKET
    ].filter(Boolean)

    const allowedRaw = allowedJids.map(cleanJid)
    const allowedDigits = allowedJids.map(digitsOnly).filter(Boolean)

    const isOwner2 =
      allowedRaw.includes(senderRaw) ||
      (senderDigits && allowedDigits.includes(senderDigits))

    console.log('[JOIN PERMISO]', {
      sender: m.sender,
      senderRaw,
      senderDigits,
      allowedRaw,
      allowedDigits,
      isOwner2
    })

    if (!isOwner2) return m.reply(mess.socket)

    if (!args[0]) return m.reply('《✧》 Ingresa el enlace del grupo para unir el bot.')

    const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
    const match = args[0].match(linkRegex)

    if (!match || !match[1]) {
      return m.reply('《✧》 El enlace ingresado no es válido o está incompleto.')
    }

    try {
      const inviteCode = match[1]
      await client.groupAcceptInvite(inviteCode)
      await client.reply(m.chat, `❀ ${config.botname || 'El bot'} se ha unido exitosamente al grupo.`, m)
    } catch (e) {
      const errMsg = String(e.message || e)

      if (errMsg.includes('not-authorized') || errMsg.includes('requires-admin')) {
        await m.reply('《✧》 La unión requiere aprobación de administrador. Espera a que acepten tu solicitud.')
      } else if (errMsg.includes('not-in-group') || errMsg.includes('removed')) {
        await m.reply('《✧》 No se pudo unir al grupo porque el bot fue eliminado recientemente.')
      } else {
        console.log('[JOIN ERROR]', e)
        await m.reply('《✧》 No se pudo unir al grupo, verifica el enlace o los permisos.')
      }
    }
  }
}