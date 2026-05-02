import { create, all } from 'mathjs'

const math = create(all, {
  number: 'BigNumber',
  precision: 80
})

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const cleanInput = (text) => {
  return text
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/\^/g, '^')
    .trim()
}

const isSimpleOperation = (input) => {
  return /^[0-9+\-*/().,%\s]+$/.test(input) && input.length <= 25
}

export default {
  command: ['calc', 'calcular', 'math'],
  category: 'utils',

  run: async (client, m, args, usedPrefix, command, text) => {
    const inputRaw = text?.trim() || args.join(' ').trim()

    if (!inputRaw) {
      return m.reply(
`> _Uso correcto:_
> *${usedPrefix + command} 5 + 5 * 2*

> _Ejemplos:_
> *${usedPrefix + command} sqrt(144)*
> *${usedPrefix + command} 2^100*
> *${usedPrefix + command} sin(90 deg)*
> *${usedPrefix + command} factorial(50)*`
      )
    }

    if (inputRaw.length > 500) {
      return m.reply('> _La operación es demasiado larga._\n> *Máximo permitido:* 500 caracteres.')
    }

    const input = cleanInput(inputRaw)

    const blocked = [
      'import',
      'createUnit',
      'evaluate(',
      'parse(',
      'simplify(',
      'derivative(',
      'resolve(',
      'chain(',
      'for',
      'while',
      'function',
      '=>'
    ]

    if (blocked.some(v => input.includes(v))) {
      return m.reply('> _Operación no permitida por seguridad._')
    }

    try {
      let thinkingMsg = null

      if (!isSimpleOperation(input)) {
        thinkingMsg = await client.sendMessage(
          m.chat,
          {
            text:
`> _Procesando operación..._
> *${inputRaw}*`
          },
          { quoted: m }
        )

        await sleep(1000)
      }

      const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tiempo máximo excedido')), 5000)
      })

      const calculation = new Promise((resolve) => {
        const result = math.evaluate(input)
        resolve(result)
      })

      let result = await Promise.race([calculation, timeout])

      if (typeof result?.toString === 'function') {
        result = result.toString()
      } else {
        result = String(result)
      }

      if (result.length > 3000) {
        result = result.slice(0, 3000) + '\n\n> _Resultado recortado por ser demasiado largo._'
      }

      const response =
`> _Operación:_
> *${inputRaw}*

> _Resultado:_
> *${result}*`

      if (thinkingMsg?.key) {
        return client.sendMessage(m.chat, {
          text: response,
          edit: thinkingMsg.key
        })
      }

      return m.reply(response)

    } catch (e) {
      return m.reply(
`> _No pude resolver esa operación._
> *Error:* ${e.message}`
      )
    }
  }
}