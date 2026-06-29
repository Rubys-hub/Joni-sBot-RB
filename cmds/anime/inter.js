import fetch from 'node-fetch';
import { resolveLidToRealJid } from "../../core/utils.js"

const captions = {
  peek: (from, to, genero) => from === to ? 'está espiando detrás de una puerta por diversión.' : `está espiando a`,
  comfort: (from, to) => (from === to ? 'se está consolando a sí mismo.' : 'está consolando a'),
  thinkhard: (from, to) => from === to ? 'se quedó pensando muy intensamente.' : 'está pensando profundamente en',
  curious: (from, to) => from === to ? 'se muestra curioso por todo.' : 'está curioso por lo que hace',
  sniff: (from, to) => from === to ? 'se olfatea como si buscara algo raro.' : 'está olfateando a',
  stare: (from, to) => from === to ? 'se queda mirando al techo sin razón.' : 'se queda mirando fijamente a',
  trip: (from, to) => from === to ? 'se tropezó consigo mismo, otra vez.' : 'tropezó accidentalmente con',
  blowkiss: (from, to) => (from === to ? 'se manda un beso al espejo.' : 'le lanzó un beso a'),
  snuggle: (from, to) => from === to ? 'se acurruca con una almohada suave.' : 'se acurruca dulcemente con',
  sleep: (from, to, genero) => from === to ? 'está durmiendo plácidamente.' : 'está durmiendo con',
  cold: (from, to, genero) => (from === to ? 'tiene mucho frío.' : 'se congela por el frío de'),
  sing: (from, to, genero) => (from === to ? 'está cantando.' : 'le está cantando a'),
  tickle: (from, to, genero) => from === to ? 'se está haciendo cosquillas.' : 'le está haciendo cosquillas a',
  scream: (from, to, genero) => (from === to ? 'está gritando al viento.' : 'le está gritando a'),
  push: (from, to, genero) => (from === to ? 'se empujó a sí mismo.' : 'empujó a'),
  nope: (from, to, genero) => (from === to ? 'expresa claramente su desacuerdo.' : 'dice “¡No!” a'),
  jump: (from, to, genero) => (from === to ? 'salta de felicidad.' : 'salta feliz con'),
  heat: (from, to, genero) => (from === to ? 'siente mucho calor.' : 'tiene calor por'),
  gaming: (from, to, genero) => (from === to ? 'está jugando solo.' : 'está jugando con'),
  draw: (from, to, genero) => (from === to ? 'hace un lindo dibujo.' : 'dibuja inspirado en'),
  call: (from, to, genero) => from === to ? 'marca su propio número esperando respuesta.' : 'llamó al número de',
  seduce: (from, to, genero) => from === to ? 'lanzó una mirada seductora al vacío.' : 'está intentando seducir a',
  shy: (from, to, genero) => from === to ? `se sonrojó tímidamente y desvió la mirada.` : `se siente demasiado ${genero === 'Hombre' ? 'tímido' : genero === 'Mujer' ? 'tímida' : 'tímide'} para mirar a`,
  slap: (from, to, genero) => from === to ? `se dio una bofetada a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio una bofetada a',
  bath: (from, to) => (from === to ? 'se está bañando.' : 'está bañando a'),
  angry: (from, to, genero) => from === to ? `está muy ${genero === 'Hombre' ? 'enojado' : genero === 'Mujer' ? 'enojada' : 'enojadx'}.` : `está super ${genero === 'Hombre' ? 'enojado' : genero === 'Mujer' ? 'enojada' : 'enojadx'} con`,
  bored: (from, to, genero) => from === to ? `está muy ${genero === 'Hombre' ? 'aburrido' : genero === 'Mujer' ? 'aburrida' : 'aburridx'}.` : `está ${genero === 'Hombre' ? 'aburrido' : genero === 'Mujer' ? 'aburrida' : 'aburridx'} de`,
  bite: (from, to, genero) => from === to ? `se mordió ${genero === 'Hombre' ? 'solito' : genero === 'Mujer' ? 'solita' : 'solitx'}.` : 'mordió a',
  bleh: (from, to) => from === to ? 'se sacó la lengua frente al espejo.' : 'le está haciendo muecas con la lengua a',
  bonk: (from, to, genero) => from === to ? `se dio un bonk a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio un golpe a',
  blush: (from, to) => (from === to ? 'se sonrojó.' : 'se sonrojó por'),
  impregnate: (from, to) => (from === to ? 'se embarazó.' : 'embarazó a'),
  bully: (from, to, genero) => from === to ? `se hace bullying ${genero === 'Hombre' ? 'el mismo' : genero === 'Mujer' ? 'ella misma' : 'el/ella mismx'}… alguien ${genero === 'Hombre' ? 'que lo abrace' : genero === 'Mujer' ? 'que la abrace' : `que ${genero === 'Hombre' ? 'lo' : genero === 'Mujer' ? 'la' : 'lx'} ayude`}.` : 'le está haciendo bullying a',
  cry: (from, to) => (from === to ? 'está llorando.' : 'está llorando por'),
  happy: (from, to) => (from === to ? 'está feliz.' : 'está feliz con'),
  coffee: (from, to) => (from === to ? 'está tomando café.' : 'está tomando café con'),
  clap: (from, to) => (from === to ? 'está aplaudiendo por algo.' : 'está aplaudiendo por'),
  cringe: (from, to) => (from === to ? 'siente cringe.' : 'siente cringe por'),
  dance: (from, to) => (from === to ? 'está bailando.' : 'está bailando con'),
  cuddle: (from, to, genero) => from === to ? `se acurrucó ${genero === 'Hombre' ? 'solo' : genero === 'Mujer' ? 'sola' : 'solx'}.` : 'se acurrucó con',
  drunk: (from, to, genero) => from === to ? `está demasiado ${genero === 'Hombre' ? 'borracho' : genero === 'Mujer' ? 'borracha' : 'borrachx'}` : `está ${genero === 'Hombre' ? 'borracho' : genero === 'Mujer' ? 'borracha' : 'borrachx'} con`,
  dramatic: (from, to) => from === to ? 'está haciendo un drama exagerado.' : 'le está haciendo un drama a',
  handhold: (from, to, genero) => from === to ? `se dio la mano consigo ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le agarró la mano a',
  eat: (from, to) => (from === to ? 'está comiendo algo delicioso.' : 'está comiendo con'),
  highfive: (from, to) => from === to ? 'se chocó los cinco frente al espejo.' : 'chocó los 5 con',
  hug: (from, to, genero) => from === to ? `se abrazó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio un abrazo a',
  kill: (from, to) => (from === to ? 'se autoeliminó en modo dramático.' : 'asesinó a'),
  kiss: (from, to) => (from === to ? 'se mandó un beso al aire.' : 'le dio un beso a'),
  kisscheek: (from, to) => from === to ? 'se besó en la mejilla usando un espejo.' : 'le dio un beso en la mejilla a',
  lick: (from, to) => (from === to ? 'se lamió por curiosidad.' : 'lamió a'),
  laugh: (from, to) => (from === to ? 'se está riendo de algo.' : 'se está burlando de'),
  pat: (from, to) => (from === to ? 'se acarició la cabeza con ternura.' : 'le dio una caricia a'),
  love: (from, to, genero) => from === to ? `se quiere mucho a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'siente atracción por',
  pout: (from, to, genero) => from === to ? `está haciendo pucheros ${genero === 'Hombre' ? 'solo' : genero === 'Mujer' ? 'sola' : 'solx'}.` : 'está haciendo pucheros con',
  punch: (from, to) => (from === to ? 'lanzó un puñetazo al aire.' : 'le dio un puñetazo a'),
  run: (from, to) => (from === to ? 'está corriendo por su vida.' : 'está corriendo con'),
  scared: (from, to, genero) => from === to ? `está ${genero === 'Hombre' ? 'asustado' : genero === 'Mujer' ? 'asustada' : 'asustxd'} por algo.` : `está ${genero === 'Hombre' ? 'asustado' : genero === 'Mujer' ? 'asustada' : 'asustxd'} por`,
  sad: (from, to) => (from === to ? `está triste` : `está expresando su tristeza a`),
  smoke: (from, to) => (from === to ? 'está fumando tranquilamente.' : 'está fumando con'),
  smile: (from, to) => (from === to ? 'está sonriendo.' : 'le sonrió a'),
  spit: (from, to, genero) => from === to ? `se escupió a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} por accidente.` : 'le escupió a',
  smug: (from, to) => (from === to ? 'está presumiendo mucho últimamente.' : 'está presumiendo a'),
  think: (from, to) => from === to ? 'está pensando profundamente.' : 'no puede dejar de pensar en',
  step: (from, to, genero) => from === to ? `se pisó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} por accidente.` : 'está pisando a',
  wave: (from, to, genero) => from === to ? `se saludó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} en el espejo.` : 'está saludando a',
  walk: (from, to) => (from === to ? 'salió a caminar en soledad.' : 'decidió dar un paseo con'),
  wink: (from, to, genero) => from === to ? `se guiñó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} en el espejo.` : 'le guiñó a',
}

const symbols = ['(⁠◠⁠‿⁠◕⁠)', '˃͈◡˂͈', '૮(˶ᵔᵕᵔ˶)ა', '(づ｡◕‿‿◕｡)づ', '(✿◡‿◡)', '(꒪⌓꒪)', '(✿✪‿✪｡)', '(*≧ω≦)', '(✧ω◕)', '˃ 𖥦 ˂', '(⌒‿⌒)', '(¬‿¬)', '(✧ω✧)', '✿(◕ ‿◕)✿', 'ʕ•́ᴥ•̀ʔっ', '(ㅇㅅㅇ❀)', '(∩︵∩)', '(✪ω✪)', '(✯◕‿◕✯)', '(•̀ᴗ•́)و ̑̑']
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const REQUEST_TIMEOUT_MS = 15_000
const WAIFU_PICS_MAP = {
  angry: 'slap',
  bleh: 'smile',
  bored: 'smug',
  bully: 'bully',
  coffee: 'nom',
  cold: 'cuddle',
  clap: 'highfive',
  dramatic: 'cringe',
  drunk: 'happy',
  impregnate: 'kiss',
  cuddle: 'cuddle',
  cry: 'cry',
  hug: 'hug',
  kisscheek: 'kiss',
  laugh: 'happy',
  love: 'hug',
  kiss: 'kiss',
  lick: 'lick',
  pat: 'pat',
  pout: 'blush',
  punch: 'bonk',
  run: 'yeet',
  sad: 'cry',
  scared: 'cry',
  seduce: 'blush',
  shy: 'blush',
  sleep: 'cuddle',
  smoke: 'smug',
  spit: 'slap',
  step: 'bonk',
  think: 'smug',
  walk: 'wave',
  smug: 'smug',
  bonk: 'bonk',
  blush: 'blush',
  smile: 'smile',
  wave: 'wave',
  highfive: 'highfive',
  handhold: 'handhold',
  eat: 'nom',
  bite: 'bite',
  slap: 'slap',
  kill: 'kill',
  happy: 'happy',
  wink: 'wink',
  dance: 'dance',
  cringe: 'cringe',
  bath: 'smile',
  sing: 'happy',
  tickle: 'happy',
  scream: 'cringe',
  push: 'yeet',
  nope: 'wave',
  jump: 'happy',
  heat: 'blush',
  gaming: 'happy',
  draw: 'smile',
  call: 'wave',
  snuggle: 'cuddle',
  blowkiss: 'kiss',
  trip: 'bonk',
  stare: 'smug',
  sniff: 'smug',
  curious: 'smile',
  thinkhard: 'smug',
  comfort: 'hug',
  peek: 'smug'
}

function isValidMediaUrl(url = '') {
  return /^https?:\/\//i.test(String(url || '').trim())
}

function extractMediaUrl(data = {}) {
  const candidates = [
    data?.result?.url,
    data?.result?.gif,
    data?.result?.video,
    data?.result,
    data?.url,
    data?.data?.url,
    data?.data?.result,
    data?.data?.video
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && isValidMediaUrl(candidate)) {
      return candidate
    }
  }

  return null
}

async function fetchJson(url = '') {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { accept: 'application/json' }
  })

  if (!response.ok) return null
  return response.json()
}

function buildStellarInteractionUrl(action = '') {
  const api = global.APIs?.stellar || { url: 'https://api.stellarwa.xyz', key: 'YukiWaBot' }
  if (!api.url) return null

  const url = new URL('/sfw/interaction', api.url)
  url.searchParams.set('inter', action)

  if (api.key) {
    url.searchParams.set('key', api.key)
    url.searchParams.set('apikey', api.key)
  }

  return url.toString()
}

async function getStellarMedia(action = '') {
  const url = buildStellarInteractionUrl(action)
  if (!url) return null

  const data = await fetchJson(url)
  return extractMediaUrl(data)
}

async function getWaifuPicsMedia(action = '') {
  const mapped = WAIFU_PICS_MAP[action]
  if (!mapped) return null

  const data = await fetchJson(`https://api.waifu.pics/sfw/${mapped}`)
  return extractMediaUrl(data)
}

async function getInteractionMedia(action = '') {
  const providers = [
    () => getStellarMedia(action),
    () => getWaifuPicsMedia(action)
  ]

  for (const provider of providers) {
    try {
      const media = await provider()
      if (media) return media
    } catch {}
  }

  return null
}

const alias = {
  angry: ['angry','enojado','enojada','enojo','enfado','furioso','furiosa'],
  bleh: ['bleh','lengua','muecalengua'],
  bored: ['bored','aburrido','aburrida','aburrimiento'],
  clap: ['clap','aplaudir','aplauso','aplausos'],
  coffee: ['coffee','cafe','cafecito'],
  dramatic: ['dramatic','drama','dramatico','dramatica'],
  drunk: ['drunk','borracho','borracha','ebrio','ebria'],
  cold: ['cold','frio','fria'],
  impregnate: ['impregnate','preg','preñar','embarazar'],
  kisscheek: ['kisscheek','beso','besar','besomejilla','mejilla','cachete'],
  laugh: ['laugh','laught','laugth','laguht','risa','reir','reirse','jaja'],
  love: ['love','amor','amar','enamorar'],
  pout: ['pout','mueca','puchero','pucheros'],
  punch: ['punch','golpear','puñete','puñetazo'],
  run: ['run','correr','huir','escapar'],
  sad: ['sad','triste','tristeza'],
  scared: ['scared','asustado','asustada','miedo'],
  seduce: ['seduce','seducir','seductor','seductora'],
  shy: ['shy','timido','timida','verguenza'],
  sleep: ['sleep','dormir','duerme','sueño'],
  smoke: ['smoke','fumar','fumando'],
  spit: ['spit','escupir','escupirle'],
  step: ['step','pisar','pisoton'],
  think: ['think','pensar','pensando'],
  walk: ['walk','caminar','pasear'],
  hug: ['hug','abrazar','abrazo'],
  kill: ['kill','matar','asesinar'],
  eat: ['eat','nom','comer','comida'],
  kiss: ['kiss','muak','besar','besaroca'],
  wink: ['wink','guiñar','guiño'],
  pat: ['pat','acariciar','palmadita'],
  happy: ['happy','feliz','felicidad','alegre'],
  bully: ['bully','molestar','bullying'],
  bite: ['bite','morder','mordida'],
  blush: ['blush','sonrojarse','sonrojo','sonrojado','sonrojada'],
  wave: ['wave','saludar','saludo'],
  bath: ['bath','bañarse','baño'],
  smug: ['smug','presumir','presumido','presumida'],
  smile: ['smile','sonreir','sonrisa'],
  highfive: ['highfive','choca','chocar','cinco'],
  handhold: ['handhold','tomar','mano','agarrarmano'],
  cringe: ['cringe','mueca','penaajena'],
  bonk: ['bonk','golpe','coscorrón','coscorron'],
  cry: ['cry','llorar','llanto'],
  lick: ['lick','lamer','lamida'],
  slap: ['slap','bofetada','cachetada'],
  dance: ['dance','bailar','baile'],
  cuddle: ['cuddle','acurrucar'],
  sing: ['sing','cantar','cancion'],
  tickle: ['tickle','cosquillas'],
  scream: ['scream','gritar','grito'],
  push: ['push','empujar','empujon'],
  nope: ['nope','no','nop'],
  jump: ['jump','saltar','salto'],
  heat: ['heat','calor'],
  gaming: ['gaming','jugar','gamer','juego'],
  draw: ['draw','dibujar','dibujo'],
  call: ['call','llamar','llamada'],
  snuggle: ['snuggle','acurrucarse'],
  blowkiss: ['blowkiss','besito','besoaire'],
  trip: ['trip','tropezar','tropiezo'],
  stare: ['stare','mirar','mirada'],
  sniff: ['sniff','oler','olfatear'],
  curious: ['curious','curioso','curiosa','curiosidad'],
  thinkhard: ['thinkhard','pensarprofundo','reflexionar'],
  comfort: ['comfort','consolar','consuelo'],
  peek: ['peek','espiar','miraroculto']
};

export default {
command: [...new Set(Object.values(alias).flat())],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    const currentCommand = Object.keys(alias).find(key => alias[key].includes(command)) || command
    if (!captions[currentCommand]) return
    const mentionedJid = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
    let who2 = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat)
    const fromName = global.db.data.users[m.sender]?.name || '@'+m.sender.split('@')[0]
    const toName = global.db.data.users[who]?.name || '@'+who.split('@')[0]
    const genero = global.db.data.users[m.sender]?.genre || 'Oculto'
    const captionText = captions[currentCommand](fromName, toName, genero)
    const caption = who !== m.sender ? `\`${fromName}.\` ${captionText} \`${toName}.\` ${getRandomSymbol()}.` : `\`${fromName}\` ${captionText} ${getRandomSymbol()}.`
    try {
      const media = await getInteractionMedia(currentCommand)

      if (!media) {
        return client.sendMessage(
          m.chat,
          {
            text: `${caption}\n\n⚠️ No pude cargar el gif ahora, pero la reacción sí se envió.`,
            mentions: [who, m.sender]
          },
          { quoted: m }
        )
      }

      try {
        await client.sendMessage(m.chat, { video: { url: media }, gifPlayback: true, caption, mentions: [who, m.sender] }, { quoted: m })
      } catch {
        await client.sendMessage(
          m.chat,
          {
            text: `${caption}\n\n⚠️ El gif no pudo enviarse, pero la reacción sí se envió.`,
            mentions: [who, m.sender]
          },
          { quoted: m }
        )
      }
    } catch (e) {
    await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
