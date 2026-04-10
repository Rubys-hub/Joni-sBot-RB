export default {
  command: ['follaragordo'],
  category: 'fun',

  async run(client, m) {

    await m.reply(`🎭 *_iniciando follación a gordo..._*`)
    await new Promise(r => setTimeout(r, 1500))

    await m.reply(`⚙️ *_follando a gordo, por favor espere..._*`)
    await new Promise(r => setTimeout(r, 2000))

    await m.reply(`🔥 *¡Se ha follado a gordo con éxito!*`)
  }
}