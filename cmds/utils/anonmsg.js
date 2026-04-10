export default {
  command: ['anonmsg', 'anonimo', 'anon'],
  category: 'tools',
  run: async (client, m, args) => {
    try {
      if (m.isGroup) {
        return m.reply(
          'Usa este comando por privado con el bot.\n\n' +
          'Ejemplos:\n' +
          'anon 1 | hola grupo\n' +
          'anon 1  (respondiendo a un sticker)'
        )
      }

      global.db.data.users = global.db.data.users || {}
      global.db.data.chats = global.db.data.chats || {}

      const sender = m.sender
      const isMainOwner = sender === '51901931862@s.whatsapp.net'
      const user = global.db.data.users[sender] ||= {}

      user.anonCooldownUntil ||= 0
      user.anonWarnCount ||= 0
      user.anonLastWarn ||= 0
      user.anonPenaltyApplied ||= false
      user.banned ||= false
      user.bannedReason ||= ''

      if (user.banned && !isMainOwner) {
        return m.reply(
          `No puedes usar este sistema.\nMotivo: ${user.bannedReason || 'Bloqueado'}`
        )
      }

      const text = args.join(' ').trim()
      const quoted = m.quoted || null
      const quotedMime = (quoted?.msg || quoted)?.mimetype || ''
      const isStickerQuoted = /webp/i.test(quotedMime)

      const groupChats = Object.keys(global.db.data.chats).filter(jid => jid.endsWith('@g.us'))
      const sharedGroups = []

      const normalizeJid = (value = '') => String(value).trim()
      const digitsOnly = (value = '') => String(value).replace(/\D/g, '')

      const senderDigits = digitsOnly(sender)
      const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net'
      const botDigits = digitsOnly(botJid)

      for (const jid of groupChats) {
        try {
          const metadata = await client.groupMetadata(jid).catch(() => null)
          if (!metadata) continue

          const participants = metadata.participants || []

          const isUserInGroup = participants.some(p => {
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
              return raw === sender || dig === senderDigits
            })
          })

          const isBotInGroup = participants.some(p => {
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

          if (isUserInGroup && isBotInGroup) {
            sharedGroups.push({
              jid,
              name: metadata.subject || 'Grupo sin nombre',
              members: participants.length
            })
          }
        } catch {}
      }

      if (!sharedGroups.length) {
        return m.reply('No encontré grupos compartidos entre tú y el bot.')
      }

      if (!text && !isStickerQuoted) {
        let msg = '📩 *Sistema de mensajes anónimos*\n\n'
        msg += 'Estos son los grupos compartidos entre tú y el bot:\n\n'

        sharedGroups.forEach((g, i) => {
          msg += `${i + 1}. ${g.name}\n`
          msg += `   Integrantes: ${g.members}\n`
          msg += `   ID: ${g.jid}\n\n`
        })

        msg += '━━━━━━━━━━━━━━━\n'
        msg += '*Cómo usarlo paso a paso:*\n\n'
        msg += '1. Debes elegir el número del grupo de la lista.\n'
        msg += '2. Para texto usa este formato exacto:\n\n'
        msg += '   anon NUMERO | tu mensaje\n\n'
        msg += '3. Para sticker, responde al sticker y usa:\n\n'
        msg += '   anon NUMERO\n\n'
        msg += '4. La barrita `|` es obligatoria solo para mensajes de texto.\n'
        msg += '5. Todo lo que escribas después de la barrita será enviado de forma anónima al grupo.\n\n'
        msg += 'Ejemplos:\n'
        msg += '   anon 2 | hola grupo\n'
        msg += '   anon 2   (respondiendo a un sticker)\n\n'
        msg += '⚠️ *Importante:*\n'
        msg += '- No se permiten enlaces en mensajes de texto.\n'
        msg += '- Máximo 300 caracteres para texto.\n'
        if (!isMainOwner) {
          msg += '- Cooldown: 30 minutos por envío.\n'
        } else {
          msg += '- Tú eres owner principal, así que no tienes cooldown.\n'
        }
        msg += '\nSi quieres que te mande una plantilla lista para copiar y pegar, responde con:\n'
        msg += '*anon si*'

        return m.reply(msg)
      }

      if (/^si$/i.test(text)) {
        return m.reply('|')
      }

      if (/^lista$/i.test(text)) {
        let msg = '📩 *Grupos compartidos disponibles*\n\n'
        sharedGroups.forEach((g, i) => {
          msg += `${i + 1}. ${g.name}\n`
          msg += `   Integrantes: ${g.members}\n`
          msg += `   ID: ${g.jid}\n\n`
        })
        msg += 'Para enviar texto usa:\n'
        msg += 'anon NUMERO | tu mensaje\n\n'
        msg += 'Para enviar sticker responde a un sticker y usa:\n'
        msg += 'anon NUMERO\n\n'
        msg += 'Si quieres plantilla, escribe:\n'
        msg += 'anon si'
        return m.reply(msg.trim())
      }

      const now = Date.now()

      if (!isMainOwner && user.anonCooldownUntil > now) {
        const remainingMs = user.anonCooldownUntil - now
        const remainingMin = Math.ceil(remainingMs / 60000)

        const within5Min = (now - (user.anonLastWarn || 0)) <= 5 * 60 * 1000

        if (within5Min) {
          user.anonWarnCount = (user.anonWarnCount || 0) + 1
        } else {
          user.anonWarnCount = 1
        }

        user.anonLastWarn = now

        if (user.anonWarnCount >= 3 && !user.anonPenaltyApplied) {
          user.anonCooldownUntil += 60 * 60 * 1000
          user.anonPenaltyApplied = true

          return m.reply(
            `⚠️ Estás insistiendo demasiado.\n` +
            `Se añadió *1 hora extra* de espera.\n\n` +
            `Cooldown actual restante: ${Math.ceil((user.anonCooldownUntil - now) / 60000)} minutos.\n` +
            `Si vuelves a insistir después de esta sanción, quedarás bloqueado del sistema.`
          )
        }

        if (user.anonPenaltyApplied) {
          user.banned = true
          user.bannedReason = 'Abuso del sistema de mensajes anónimos'
          return m.reply(
            '⛔ Has sido bloqueado del sistema por insistir repetidamente durante el cooldown.'
          )
        }

        return m.reply(
          `Aún estás en cooldown.\n` +
          `Espera aproximadamente *${remainingMin} minutos* antes de enviar otro mensaje anónimo.\n\n` +
          `No insistas en menos de 5 minutos o recibirás sanción.`
        )
      }

      let target = null
      let mensaje = null
      let sendSticker = false

      if (isStickerQuoted) {
        const matchSticker = text.match(/^(\d+)$/)
        if (!matchSticker) {
          return m.reply(
            'Para enviar un sticker anónimo debes responder al sticker y escribir:\n\n' +
            'anon NUMERO\n\n' +
            'Ejemplo:\n' +
            'anon 1'
          )
        }

        const index = parseInt(matchSticker[1])
        if (!index || index < 1 || index > sharedGroups.length) {
          return m.reply('El número de grupo no es válido. Usa `anon` o `anon lista`.')
        }

        target = sharedGroups[index - 1]
        sendSticker = true
      } else {
        const match = text.match(/^(\d+)\s*\|\s*([\s\S]+)$/)
        if (!match) {
          return m.reply(
            'Formato incorrecto.\n\n' +
            'Para texto:\n' +
            'anon NUMERO | tu mensaje\n\n' +
            'Ejemplo:\n' +
            'anon 1 | hola grupo\n\n' +
            'Para sticker:\n' +
            'responde a un sticker y usa:\n' +
            'anon 1'
          )
        }

        const index = parseInt(match[1])
        mensaje = match[2].trim()

        if (!index || index < 1 || index > sharedGroups.length) {
          return m.reply('El número de grupo no es válido. Usa `anon` o `anon lista`.')
        }

        if (!mensaje) {
          return m.reply('Debes escribir un mensaje después de la barrita `|`.')
        }

        if (mensaje.length > 300) {
          return m.reply('El mensaje no puede superar los 300 caracteres.')
        }

        if (/(https?:\/\/|wa\.me|chat\.whatsapp\.com|t\.me|telegram\.me)/i.test(mensaje)) {
          return m.reply('No se permiten enlaces en mensajes anónimos.')
        }

        if (/@everyone|@all|@admins/gi.test(mensaje)) {
          return m.reply('No se permiten menciones masivas en mensajes anónimos.')
        }

        target = sharedGroups[index - 1]
      }

      if (sendSticker) {
  const sticker = await quoted.download()
  if (!sticker) {
    return m.reply('No se pudo descargar el sticker citado.')
  }

  // 1️⃣ Mensaje previo
  await client.sendMessage(target.jid, {
    text: '📩 *Sticker anónimo*\n\n⏳ Enviando...'
  })

  // 2️⃣ Pequeño delay (opcional pero queda GOD)
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 3️⃣ Enviar sticker
  await client.sendMessage(target.jid, {
    sticker
  })

  user.anonLastMessage = '[sticker]'
  user.anonLastType = 'sticker'

        if (!sticker) {
          return m.reply('No se pudo descargar el sticker citado.')
        }

        await client.sendMessage(target.jid, {
          sticker
        })

        user.anonLastMessage = '[sticker]'
        user.anonLastType = 'sticker'
      } else {
        const anonText = `📩 *Mensaje anónimo*\n\n${mensaje}`
        await client.sendMessage(target.jid, { text: anonText })

        user.anonLastMessage = mensaje
        user.anonLastType = 'text'
      }

      if (!isMainOwner) {
        user.anonCooldownUntil = now + (30 * 60 * 1000)
        user.anonWarnCount = 0
        user.anonLastWarn = 0
        user.anonPenaltyApplied = false
      }

      user.anonLastGroup = target.jid
      user.anonLastSentAt = now

      return m.reply(
        `${sendSticker ? 'Sticker anónimo' : 'Mensaje anónimo'} enviado a *${target.name}*.\n\n` +
        (isMainOwner
          ? 'Como eres owner principal, no se te aplicó cooldown.'
          : 'Cooldown activado: *30 minutos*.')
      )
    } catch (e) {
      return m.reply(`Error: ${e.message}`)
    }
  }
}