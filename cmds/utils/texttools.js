const morseMap = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.',
  g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..',
  m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.',
  s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
  y: '-.--', z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
  '-': '-....-', '/': '-..-.', '@': '.--.-.', '(': '-.--.',
  ')': '-.--.-'
}

const reverseMorseMap = Object.fromEntries(
  Object.entries(morseMap).map(([k, v]) => [v, k])
)

const mirrorMap = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ',
  g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l',
  m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x',
  y: 'ʎ', z: 'z',
  A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ',
  G: 'פ', H: 'H', I: 'I', J: 'ſ', K: 'K', L: '˥',
  M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ᴚ',
  S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X',
  Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
  '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", '?': '¿', '!': '¡', '"': '„',
  "'": ',', '(': ')', ')': '(', '[': ']', ']': '[',
  '{': '}', '}': '{'
}

const fancyMap = {
  a: '𝓪', b: '𝓫', c: '𝓬', d: '𝓭', e: '𝓮', f: '𝓯',
  g: '𝓰', h: '𝓱', i: '𝓲', j: '𝓳', k: '𝓴', l: '𝓵',
  m: '𝓶', n: '𝓷', o: '𝓸', p: '𝓹', q: '𝓺', r: '𝓻',
  s: '𝓼', t: '𝓽', u: '𝓾', v: '𝓿', w: '𝔀', x: '𝔁',
  y: '𝔂', z: '𝔃',
  A: '𝓐', B: '𝓑', C: '𝓒', D: '𝓓', E: '𝓔', F: '𝓕',
  G: '𝓖', H: '𝓗', I: '𝓘', J: '𝓙', K: '𝓚', L: '𝓛',
  M: '𝓜', N: '𝓝', O: '𝓞', P: '𝓟', Q: '𝓠', R: '𝓡',
  S: '𝓢', T: '𝓣', U: '𝓤', V: '𝓥', W: '𝓦', X: '𝓧',
  Y: '𝓨', Z: '𝓩'
}

const rot13 = (text) => {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}

const getText = (args, text) => {
  return text?.trim() || args.join(' ').trim()
}

export default {
  command: [
    'morse',
    'demorse',
    'binary',
    'unbinary',
    'encrypt',
    'decrypt',
    'reverse',
    'mirror',
    'fancy',
    'count',
    'random',
    'format'
  ],
  category: 'utils',

  run: async (client, m, args, usedPrefix, command, text) => {
    const input = getText(args, text)

    if (!input && !['random'].includes(command)) {
      return m.reply(`Usa: ${usedPrefix + command} texto`)
    }

    if (command === 'morse') {
      const result = input
        .toLowerCase()
        .split('')
        .map(char => char === ' ' ? '/' : morseMap[char] || char)
        .join(' ')

      return m.reply(result)
    }

    if (command === 'demorse') {
      const result = input
        .split(' ')
        .map(code => code === '/' ? ' ' : reverseMorseMap[code] || '')
        .join('')
        .replace(/\s+/g, ' ')
        .trim()

      return m.reply(result)
    }

    if (command === 'binary') {
      const result = input
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ')

      return m.reply(result)
    }

    if (command === 'unbinary') {
      const result = input
        .split(/\s+/)
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('')

      return m.reply(result)
    }

    if (command === 'encrypt') {
      const type = args[0]?.toLowerCase()
      const content = args.slice(1).join(' ').trim()

      if (!type || !content) {
        return m.reply(`Usa:\n${usedPrefix}encrypt base64 texto\n${usedPrefix}encrypt rot13 texto\n${usedPrefix}encrypt hex texto\n${usedPrefix}encrypt uri texto`)
      }

      if (type === 'base64') {
        return m.reply(Buffer.from(content, 'utf-8').toString('base64'))
      }

      if (type === 'rot13') {
        return m.reply(rot13(content))
      }

      if (type === 'hex') {
        return m.reply(Buffer.from(content, 'utf-8').toString('hex'))
      }

      if (type === 'uri') {
        return m.reply(encodeURIComponent(content))
      }

      return m.reply('Métodos disponibles: base64, rot13, hex, uri')
    }

    if (command === 'decrypt') {
      const type = args[0]?.toLowerCase()
      const content = args.slice(1).join(' ').trim()

      if (!type || !content) {
        return m.reply(`Usa:\n${usedPrefix}decrypt base64 texto\n${usedPrefix}decrypt rot13 texto\n${usedPrefix}decrypt hex texto\n${usedPrefix}decrypt uri texto`)
      }

      try {
        if (type === 'base64') {
          return m.reply(Buffer.from(content, 'base64').toString('utf-8'))
        }

        if (type === 'rot13') {
          return m.reply(rot13(content))
        }

        if (type === 'hex') {
          return m.reply(Buffer.from(content, 'hex').toString('utf-8'))
        }

        if (type === 'uri') {
          return m.reply(decodeURIComponent(content))
        }

        return m.reply('Métodos disponibles: base64, rot13, hex, uri')
      } catch {
        return m.reply('No se pudo desencriptar ese texto.')
      }
    }

    if (command === 'reverse') {
      return m.reply(input.split('').reverse().join(''))
    }

    if (command === 'mirror') {
      const result = input
        .split('')
        .reverse()
        .map(char => mirrorMap[char] || char)
        .join('')

      return m.reply(result)
    }

    if (command === 'fancy') {
      const result = input
        .split('')
        .map(char => fancyMap[char] || char)
        .join('')

      return m.reply(result)
    }

    if (command === 'count') {
      const characters = input.length
      const spaces = (input.match(/\s/g) || []).length
      const words = input.trim().split(/\s+/).filter(Boolean).length
      const letters = (input.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/g) || []).length
      const numbers = (input.match(/[0-9]/g) || []).length

      const result = `
✦ En tu mensaje hay:

• Caracteres: *${characters}*
• Letras: *${letters}*
• Números: *${numbers}*
• Espacios: *${spaces}*
• Palabras: *${words}*
`.trim()

      return m.reply(result)
    }

    if (command === 'random') {
      let min = parseInt(args[0])
      let max = parseInt(args[1])

      if (isNaN(min) && isNaN(max)) {
        min = 1
        max = 100
      } else if (!isNaN(min) && isNaN(max)) {
        max = min
        min = 1
      }

      if (min > max) [min, max] = [max, min]

      if (max > 99999999) max = 99999999
      if (min < 0) min = 0

      const number = Math.floor(Math.random() * (max - min + 1)) + min

      return m.reply(String(number))
    }

    if (command === 'format') {
      let mode = args[0]?.toLowerCase()

      if (mode === 'lines') {
        const content = args.slice(1).join(' ')
        if (!content) return m.reply(`Usa: ${usedPrefix}format lines texto | texto | texto`)

        const result = content
          .split('|')
          .map(v => v.trim())
          .filter(Boolean)
          .join('\n')

        return m.reply(result)
      }

      if (mode === 'list') {
        const content = args.slice(1).join(' ')
        if (!content) return m.reply(`Usa: ${usedPrefix}format list texto | texto | texto`)

        const result = content
          .split('|')
          .map(v => v.trim())
          .filter(Boolean)
          .map((v, i) => `${i + 1}. ${v}`)
          .join('\n')

        return m.reply(result)
      }

      const result = input
        .replace(/\s+/g, ' ')
        .trim()

      return m.reply(result)
    }
  }
}