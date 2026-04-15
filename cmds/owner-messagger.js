export default {
  command: ['mlist', 'mp', 'mtag', 'mptag', 'mall', 'mtagall'],
  category: 'owner',

  run: async (client, m, args) => {
    try {
      const OWNER_NUMBER = '51901931862'
      const senderNumber = (m.sender || '').split('@')[0]
      const isOwner = senderNumber === OWNER_NUMBER

      if (!isOwner) return
      if (m.isGroup) return

      global.db.data.users = global.db.data.users || {}
      global.db.data.chats = global.db.data.chats || {}

      const usedCmd = (m.body || m.text || '').trim().split(/\s+/)[0].toLowerCase()
      const rawText = args.join(' ').trim()

      const normalizeJid = (value = '') => String(value).trim()
      const digitsOnly = (value = '') => String(value).replace(/\D/g, '')

      const sender = m.sender
      const senderDigits = digitsOnly(sender)
      const botJid = (client.user?.id?.split(':')[0] || '').trim() + '@s.whatsapp.net'
      const botDigits = digitsOnly(botJid)

      const groupChats = Object.keys(global.db.data.chats).filter(jid => jid.endsWith('@g.us'))
      const sharedGroups = []

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
              members: participants.length,
              participants
            })
          }
        } catch {}
      }

      if (!sharedGroups.length) {
        return m.reply('No encontré grupos compartidos entre tú y el bot.')
      }

      const makeList = () => {
        let txt = '📂 *Lista de grupos compartidos*\n\n'
        sharedGroups.forEach((g, i) => {
          txt += `${i + 1}. ${g.name}\n`
          txt += `   👥 Miembros: ${g.members}\n`
          txt += `   🆔 ID: ${g.jid}\n\n`
        })
        txt += '━━━━━━━━━━━━━━━\n'
        txt += '*Uso:*\n'
        txt += '• `.mp 1,3,2 | hola`\n'
        txt += '• `.mtag 1,3,2 | hola`\n'
        txt += '• `.mall | hola a todos`\n'
        txt += '• `.mtagall | hola a todos`\n'
        return txt.trim()
      }

      const parseIndexes = (input = '') => {
        return [...new Set(
          input
            .split(',')
            .map(x => parseInt(x.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= sharedGroups.length)
        )]
      }

      const sendNormalMessage = async (jid, text) => {
        await client.sendMessage(jid, { text: text.trim() })
      }

      // TAG INVISIBLE
      const sendTagMessage = async (jid, text, participants = []) => {
        const mentions = participants
          .map(p => p?.id)
          .filter(Boolean)

        await client.sendMessage(jid, {
          text: text.trim(),
          mentions
        })
      }

      if (usedCmd === '.mlist' || usedCmd === 'mlist') {
        return m.reply(makeList())
      }

      if (
        usedCmd === '.mp' || usedCmd === 'mp' ||
        usedCmd === '.mtag' || usedCmd === 'mtag' ||
        usedCmd === '.mptag' || usedCmd === 'mptag'
      ) {
        const match = rawText.match(/^([\d,\s]+)\s*\|\s*([\s\S]+)$/)
        if (!match) {
          return m.reply(
            'Formato incorrecto.\n\n' +
            'Ejemplos:\n' +
            '`.mp 1,3,2 | hola`\n' +
            '`.mtag 1,3,2 | hola`\n' +
            '`.mptag 1,3,2 | hola`'
          )
        }

        const indexesRaw = match[1].trim()
        const message = match[2].trim()

        if (!message) return m.reply('Debes escribir un mensaje después de `|`.')

        const indexes = parseIndexes(indexesRaw)
        if (!indexes.length) return m.reply('No encontré grupos válidos en la lista.')

        const selectedGroups = indexes.map(i => ({
          index: i,
          ...sharedGroups[i - 1]
        }))

        let enviados = 0
        let fallidos = 0
        let reporte = ''

        const isTagCmd =
          usedCmd === '.mtag' || usedCmd === 'mtag' ||
          usedCmd === '.mptag' || usedCmd === 'mptag'

        for (const g of selectedGroups) {
          try {
            if (isTagCmd) {
              await sendTagMessage(g.jid, message, g.participants)
            } else {
              await sendNormalMessage(g.jid, message)
            }

            enviados++
            reporte += `✅ ${g.index}. ${g.name}\n`
          } catch {
            fallidos++
            reporte += `❌ ${g.index}. ${g.name}\n`
          }
        }

        return m.reply(
          `*Envío completado*\n\n` +
          `📨 Enviados: ${enviados}\n` +
          `⚠️ Fallidos: ${fallidos}\n\n` +
          reporte.trim()
        )
      }

      if (usedCmd === '.mall' || usedCmd === 'mall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.mall | tu mensaje`')

        const message = match[1].trim()
        if (!message) return m.reply('Debes escribir un mensaje después de `|`.')

        let enviados = 0
        let fallidos = 0
        let reporte = ''

        for (let i = 0; i < sharedGroups.length; i++) {
          const g = sharedGroups[i]
          try {
            await sendNormalMessage(g.jid, message)
            enviados++
            reporte += `✅ ${i + 1}. ${g.name}\n`
          } catch {
            fallidos++
            reporte += `❌ ${i + 1}. ${g.name}\n`
          }
        }

        return m.reply(
          `*Mensaje enviado a todos los grupos compartidos*\n\n` +
          `📨 Enviados: ${enviados}\n` +
          `⚠️ Fallidos: ${fallidos}\n\n` +
          reporte.trim()
        )
      }

      if (usedCmd === '.mtagall' || usedCmd === 'mtagall') {
        const match = rawText.match(/^\|\s*([\s\S]+)$/)
        if (!match) return m.reply('Usa: `.mtagall | tu mensaje`')

        const message = match[1].trim()
        if (!message) return m.reply('Debes escribir un mensaje después de `|`.')

        let enviados = 0
        let fallidos = 0
        let reporte = ''

        for (let i = 0; i < sharedGroups.length; i++) {
          const g = sharedGroups[i]
          try {
            await sendTagMessage(g.jid, message, g.participants)
            enviados++
            reporte += `✅ ${i + 1}. ${g.name}\n`
          } catch {
            fallidos++
            reporte += `❌ ${i + 1}. ${g.name}\n`
          }
        }

        return m.reply(
          `*Mensaje con tag invisible enviado a todos los grupos compartidos*\n\n` +
          `📨 Enviados: ${enviados}\n` +
          `⚠️ Fallidos: ${fallidos}\n\n` +
          reporte.trim()
        )
      }

    } catch (e) {
      return m.reply(`Error: ${e.message}`)
    }
  }
}