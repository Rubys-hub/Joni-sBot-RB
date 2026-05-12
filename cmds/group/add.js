export default {
  command: ['add'],
  category: 'grupo',
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {
    const currentPrefix = usedPrefix || '.'

    const OWNER_NUMBER = '51901931862'
    const senderNumber = String(m.sender).split('@')[0].replace(/\D/g, '')
    const isOwnerBot = senderNumber === OWNER_NUMBER

    if (!m.isGroup) {
      return m.reply('╭━━━〔 👥 *SOLO GRUPOS* 〕━━━╮\n┃\n┃ Este comando solo funciona en grupos.\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━╯')
    }

    if (!isOwnerBot && !m.isAdmin) {
      return m.reply('╭━━━〔 🔐 *ACCESO DENEGADO* 〕━━━╮\n┃\n┃ Este comando solo puede ser usado por:\n┃ 👑 Owner del bot\n┃ 👮 Administradores del grupo\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━╯')
    }

    if (!m.isBotAdmin) {
      return m.reply('╭━━━〔 🤖 *BOT SIN ADMIN* 〕━━━╮\n┃\n┃ No puedo agregar usuarios porque\n┃ no soy administrador del grupo.\n┃\n┃ 👑 Dame admin y vuelve a intentar.\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━╯')
    }

    const rawNumber = args[0]

    if (!rawNumber) {
      return m.reply(`╭━━━〔 ➕ *AGREGAR USUARIO* 〕━━━╮
┃
┃ Ingresa un número para agregar.
┃
┃ 📌 *Ejemplo:*
┃ ➤ *${currentPrefix + command} +51999999999*
┃ ➤ *${currentPrefix + command} 51999999999*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    const numberOnly = String(rawNumber).replace(/\D/g, '')

    if (!numberOnly || numberOnly.length < 8) {
      return m.reply(`╭━━━〔 ❌ *NÚMERO INVÁLIDO* 〕━━━╮
┃
┃ El número ingresado no parece válido.
┃
┃ 📌 Usa formato internacional:
┃ ➤ *${currentPrefix + command} +51999999999*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
    }

    const target = `${numberOnly}@s.whatsapp.net`

    try {
      await m.react?.('🕒')

      const result = await client.groupParticipantsUpdate(
        m.chat,
        [target],
        'add'
      )

      const info = Array.isArray(result) ? result[0] : result
      const status = String(info?.status || info?.content?.status || '')

      if (status === '200' || status === '201') {
        await m.react?.('✅')

        return client.sendMessage(
          m.chat,
          {
            text: `╭━━━〔 ✅ *USUARIO AGREGADO* 〕━━━╮
┃
┃ Se agregó correctamente:
┃ 👤 @${numberOnly}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            mentions: [target]
          },
          { quoted: m }
        )
      }

      if (status === '403') {
        await m.react?.('⚠️')

        let inviteCode = ''
        try {
          inviteCode = await client.groupInviteCode(m.chat)
        } catch {}

        const inviteLink = inviteCode
          ? `https://chat.whatsapp.com/${inviteCode}`
          : ''

        return m.reply(`╭━━━〔 ⚠️ *NO SE PUDO AGREGAR* 〕━━━╮
┃
┃ WhatsApp no permitió agregar a:
┃ 👤 @${numberOnly}
┃
┃ 📌 Posibles razones:
┃ • Tiene privacidad activada.
┃ • No permite que lo agreguen a grupos.
┃ • Debe entrar con enlace.
┃
${inviteLink ? `┃ 🔗 *Enlace del grupo:*\n┃ ${inviteLink}\n┃\n` : ''}╰━━━━━━━━━━━━━━━━━━━━━━╯`, null, {
          mentions: [target]
        })
      }

      if (status === '408') {
        await m.react?.('⚠️')

        return m.reply(`╭━━━〔 ⏳ *INVITACIÓN PENDIENTE* 〕━━━╮
┃
┃ WhatsApp dejó la invitación pendiente para:
┃ 👤 @${numberOnly}
┃
┃ El usuario debe aceptar la invitación.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`, null, {
          mentions: [target]
        })
      }

      if (status === '409') {
        await m.react?.('ℹ️')

        return m.reply(`╭━━━〔 ℹ️ *YA ESTÁ EN EL GRUPO* 〕━━━╮
┃
┃ El usuario @${numberOnly}
┃ ya pertenece a este grupo.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`, null, {
          mentions: [target]
        })
      }

      await m.react?.('❌')

      return m.reply(`╭━━━〔 ❌ *NO SE PUDO AGREGAR* 〕━━━╮
┃
┃ Usuario:
┃ 👤 @${numberOnly}
┃
┃ Código devuelto por WhatsApp:
┃ *${status || 'sin estado'}*
┃
┃ Revisa si el número existe o si tiene privacidad.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`, null, {
        mentions: [target]
      })

    } catch (e) {
      await m.react?.('❌')

      console.log(e)

      return m.reply(`╭━━━〔 ❌ *ERROR AL AGREGAR* 〕━━━╮
┃
┃ No se pudo agregar al usuario.
┃
┃ ⚠️ Error:
┃ *${e.message}*
┃
┃ 📌 Revisa:
┃ • Que el bot sea admin.
┃ • Que el número exista en WhatsApp.
┃ • Que el usuario permita ser agregado.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`)
    }
  }
}