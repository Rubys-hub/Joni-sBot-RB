import fetch from 'node-fetch'
import { WAMessageStubType } from 'baileys'
import chalk from 'chalk'



function safeJid(value = '') {
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
      value?.phone ||
      ''
  }

  value = String(value).trim()
  if (!value) return ''

  if (value.includes('@')) {
    const [left, server] = value.split('@')
    return `${left.split(':')[0]}@${server}`
  }

  const number = value.replace(/\D/g, '')
  return number ? `${number}@s.whatsapp.net` : ''
}

function onlyNumber(value = '') {
  return safeJid(value).split('@')[0].replace(/\D/g, '')
}


function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
}

function isGreeting(text = '') {
  const t = normalizeText(text)
  if (!t) return false

  const compact = t.replace(/\s+/g, '')

  const patterns = [
    /^hola+$/i,
    /^ola+$/i,
    /^hola+h*$/i,
    /^holi+s*$/i,
    /^buenas+$/i,
    /^wenas+$/i,
    /^hello+$/i,
    /^hi+$/i,
    /^holis+$/i
  ]

  if (patterns.some(r => r.test(compact))) return true

  const starts = [
    'hola',
    'ola',
    'holi',
    'holis',
    'buenas',
    'wenas',
    'hello',
    'hi'
  ]

  return starts.some(word => t.startsWith(word))
}

function getRandomWelcomeLove(phone) {
  const msgs = [
    `💖 Bienvenido @${phone}, ya te amamos muchísimo y estamos felices de que estés aquí.`,
    `🌷 Hola @${phone}, qué alegría tenerte con nosotros, ya te amamos un montón.`,
    `💜 Bienvenido @${phone}, esta familia ya te quiere y te amamos mucho.`,
    `✨ @${phone}, gracias por llegar, te damos la bienvenida con muchísimo cariño, te amamos.`,
    `💕 Bienvenido @${phone}, esperamos que te sientas querido desde el primer momento, porque ya te amamos.`
  ]
  return msgs[Math.floor(Math.random() * msgs.length)]
}

function getRandomGreetingReply(phone) {
  const msgs = [
    `💜 Hola @${phone}, qué lindo saludarte, te mando un abrazo enorme.`,
    `🌸 Holaa @${phone}, qué alegría leerte, te queremos mucho.`,
    `✨ Hola @${phone}, me alegra verte por aquí, te mando mucho cariño.`,
    `💖 Holi @${phone}, espero que estés muy bien, te queremos muchísimo.`,
    `💕 Hola @${phone}, qué bonito saludarte, te mando amor y buenas vibras.`
  ]
  return msgs[Math.floor(Math.random() * msgs.length)]
}

export default async (client, m) => {
const startTime = Math.floor(Date.now() / 1000)

client.ev.on('group-participants.update', async (anu) => {
  try {
    // ❌ IGNORAR EVENTOS ANTIGUOS
    if (anu?.timestamp && anu.timestamp < startTime) return
      const metadata = await client.groupMetadata(anu.id).catch(() => null)
      if (!metadata) return

      const groupAdmins = metadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
      const chat = global?.db?.data?.chats?.[anu.id]
      if (!chat) return

      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot
      const memberCount = metadata.participants.length
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return

for (const p of anu.participants) {
  const jid = safeJid(p?.phoneNumber || p?.id || p?.jid || p?.lid || p)
  const phone = onlyNumber(p?.phoneNumber || jid || p)
  const pp = await client.profilePictureUrl(jid, 'image').catch(_ => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')
        const mensajes = {
          add: chat.sWelcome
            ? `\n┊➤ ${chat.sWelcome
                .replace(/{usuario}/g, `@${phone}`)
                .replace(/{grupo}/g, `*${metadata.subject}*`)
                .replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}`
            : '',
          remove: chat.sGoodbye
            ? `\n┊➤ ${chat.sGoodbye
                .replace(/{usuario}/g, `@${phone}`)
                .replace(/{grupo}/g, `*${metadata.subject}*`)
                .replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}`
            : '',
          leave: chat.sGoodbye
            ? `\n┊➤ ${chat.sGoodbye
                .replace(/{usuario}/g, `@${phone}`)
                .replace(/{grupo}/g, `*${metadata.subject}*`)
                .replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}`
            : ''
        }

        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.db.data.settings[botId].id,
              serverMessageId: '0',
              newsletterName: global.db.data.settings[botId].nameid
            },
            externalAdReply: {
              title: global.db.data.settings[botId].namebot,
              body: dev,
              mediaUrl: null,
              description: null,
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId].icon,
              sourceUrl: global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net'].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }

        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Bienvenido (⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠)* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa /menu para ver los comandos.*
┊➤ *Ahora somos ${memberCount} miembros.* ${mensajes[anu.action]}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`

          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })

          await client.sendMessage(anu.id, {
            text: getRandomWelcomeLove(phone),
            mentions: [jid]
          })
        }

        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.goodbye && (!primaryBotId || primaryBotId === botId)) {
          const caption = `╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Hasta pronto (⁠╥⁠﹏⁠╥⁠)* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ojalá que vuelva pronto.*
┊➤ *Ahora somos ${memberCount} miembros.* ${mensajes[anu.action]}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`

          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })
        }

        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          // EXCEPCIÓN MODO NINJA: Ignorar a tu número
          if (phone === '51901931862') continue

          const usuario = anu.author
          await client.sendMessage(anu.id, {
            text: `「✎」 *@${phone}* ha sido promovido a Administrador por *@${onlyNumber(usuario)}.*`,
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)]
          })
        }

        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          // EXCEPCIÓN MODO NINJA: Ignorar a tu número
          if (phone === '51901931862') continue

          const usuario = anu.author
          await client.sendMessage(anu.id, {
            text: `「✎」 *@${phone}* ha sido degradado de Administrador por *@${onlyNumber(usuario)}.*`,
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)]
          })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`[ BOT  ]  → ${err}`))
    }
  })

client.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return

  const msg = messages[0]
  if (!msg?.message) return

  // ❌ IGNORAR MENSAJES ANTIGUOS
  const now = Math.floor(Date.now() / 1000)
  const msgTime = Number(msg.messageTimestamp || 0)
  if (msgTime && msgTime < (now - 10)) return

    const id = msg.key.remoteJid
    if (!id || !id.endsWith('@g.us')) return

    const chat = global?.db?.data?.chats?.[id]
    if (!chat) return

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const primaryBotId = chat?.primaryBot
    const isSelf = global.db.data.settings[botId]?.self ?? false
    if (isSelf) return

    // Alertas del grupo por cambios
    if (msg.messageStubType && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
      const actor = msg.key?.participant || msg.participant || msg.key?.remoteJid
      const phone = onlyNumber(actor)
      const groupMetadata = await client.groupMetadata(id).catch(() => null)
      const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []

      if (msg.messageStubType == 21) {
        await client.sendMessage(id, {
          text: `「✎」 @${phone} cambió el nombre del grupo a *${msg.messageStubParameters[0]}*`,
          mentions: [actor, ...groupAdmins.map(v => v.id)]
        })
      }
      if (msg.messageStubType == 22) {
        await client.sendMessage(id, {
          text: `「✎」 @${phone} cambió el icono del grupo.`,
          mentions: [actor, ...groupAdmins.map(v => v.id)]
        })
      }
      if (msg.messageStubType == 23) {
        await client.sendMessage(id, {
          text: `「✎」 @${phone} restableció el enlace del grupo.`,
          mentions: [actor, ...groupAdmins.map(v => v.id)]
        })
      }
      if (msg.messageStubType == 24) {
        await client.sendMessage(id, {
          text: `「✎」 @${phone} cambió la descripción del grupo.`,
          mentions: [actor, ...groupAdmins.map(v => v.id)]
        })
      }
      if (msg.messageStubType == 25) {
        await client.sendMessage(id, {
          text: `「✎」 @${phone} cambió los ajustes del grupo para permitir que ${msg.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`,
          mentions: [actor, ...groupAdmins.map(v => v.id)]
        })
      }
      if (msg.messageStubType == 26) {
        await client.sendMessage(id, {
          text: `「✎」 @${phone} cambió los ajustes del grupo para permitir que ${msg.messageStubParameters[0] === 'on' ? 'solo los administradores puedan enviar mensajes al grupo.' : 'todos los miembros puedan enviar mensajes al grupo.'}`,
          mentions: [actor, ...groupAdmins.map(v => v.id)]
        })
      }
    }



    // Respuesta amorosa a saludos
    if (!msg.messageStubType && (!primaryBotId || primaryBotId === botId)) {
      const sender = msg.key?.participant || msg.participant || msg.key?.remoteJid
      if (!sender || sender === botId) return

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        ''

      if (!text) return
      if (!isGreeting(text)) return

      chat.lastGreetingReply = chat.lastGreetingReply || {}
      const now = Date.now()
      const last = chat.lastGreetingReply[sender] || 0

      // evita spam: una respuesta cada 45s por usuario
      if (now - last < 45000) return
      chat.lastGreetingReply[sender] = now

      const phone = onlyNumber(sender)

      await client.sendMessage(id, {
        text: getRandomGreetingReply(phone),
        mentions: [sender]
      })
    }
  })
}

export async function groupParticipantsUpdate(client, { id, participants, action }) {
  try {
    if (action !== 'add') return

    const chat = global.db.data.chats[id]
    if (!chat?.autoAdmin) return

    for (const user of participants) {
      try {
        await client.groupParticipantsUpdate(id, [user], 'promote')
      } catch {}
    }

  } catch {}
}