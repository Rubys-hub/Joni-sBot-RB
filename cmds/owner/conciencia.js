import { handleComando, observeMessage } from '../../conciencia/index.js?engine=20260629a'

export async function all(m, { client }) {
  return observeMessage(client, m)
}

export default {
  command: ['com'],
  category: 'owner',
  isOwner: true,
  run: async (client, m, args, usedPrefix) => {
    return handleComando(client, m, args, usedPrefix)
  }
}
