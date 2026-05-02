import axios from 'axios'

const stopWords = [
  'a','al','algo','algun','alguna','algunas','alguno','algunos','alla','alli','ahi','ante','antes',
  'aquel','aquella','aquellas','aquello','aquellos','aqui','asi','aunque','bajo','bien','cada','casi',
  'como','con','contra','cual','cuales','cuando','cuanto','cuanta','cuantos','cuantas','de','del',
  'desde','donde','dos','el','ella','ellas','ello','ellos','en','entre','era','eran','eres','es',
  'esa','esas','ese','eso','esos','esta','estan','estar','este','esto','estos','estoy','estuvo',
  'fue','fueron','ha','hace','hacen','hacer','hacia','han','hasta','hay','la','las','le','les',
  'lo','los','mas','me','mi','mis','muy','nada','ni','no','nos','nosotros','nuestra','nuestro',
  'o','otra','otras','otro','otros','para','pero','por','porque','pues','que','quien','quienes',
  'se','sea','ser','si','sin','sobre','son','su','sus','tambien','te','tener','tiene','tienen',
  'todo','todos','tu','tus','un','una','unas','uno','unos','va','van','ver','vez','ya','yo',
  'ahi','aca','acá','aqui','aquí','alla','allá','entonces','osea','o sea','literal','normal',
  'igual','creo','crees','creemos','tipo','bueno','buena','buenas','mal','mejor','peor','listo',
  'vale','dale','ok','okay','oki','sip','nop','aja','asu','mmm','ahh','ehh','uff','nah','xd',
  'xdd','xddd','jaja','jajaj','jajaja','jajajaja','jeje','jejeje','jsjs','jsjsjs','bro','mano',
  'manito','oe','oye','hola','holaa','holaaa','chau','adios','gracias','mensaje','mensajes',
  'grupo','chat','usuario','usuarios','gente','alguien','nadie','cosa','cosas','tema','temas',
  'parte','partes','forma','modo','manera','momento','rato','dia','dias','hoy','ayer','mañana',
  'también','más','qué','cómo','cuándo','dónde','quién','cuál','sí','solo','sólo','tal','vez',
  'mismo','misma','mismos','mismas','tanto','tanta','tantos','tantas','poco','poca','pocos',
  'pocas','mucho','mucha','muchos','muchas','primero','segundo','tercero','ultimo','último'
]

const names = [
  'pepe','pepito','pepin','pepona','manuela','manuel','manolo','juan','juanito','juana','pedro',
  'peter','pablo','pablito','carlos','carlitos','olivares','maria','maría','mari','maricarmen',
  'jose','josé','josesito','luis','lucho','luchito','miguel','miguelito','angel','ángel','angela',
  'ángela','andres','andrés','andrecito','andrea','ana','anita','lucia','lucía','luciana','sofia',
  'sofía','camila','cami','valeria','vale','valentina','vicky','victor','víctor','victoria',
  'diego','dieguito','dylan','dilan','mateo','matias','matías','sebastian','sebastián','sebas',
  'nicolas','nicolás','nico','fernando','fer','fercho','alejandro','ale','alex','alexis','alexa',
  'brayan','bryan','kevin','jean','jhon','jonathan','joni','jonny','joseph','joshua','cesar',
  'césar','rafael','rafa','marco','marcos','gabriel','gabo','santiago','santi','rodrigo','rodri',
  'esteban','estebitan','eduardo','edu','edwin','edwincito','mauricio','mau','renato','renatito',
  'ricardo','richi','oscar','óscar','hugo','ivan','iván','isaac','benjamin','benjamín','benja',
  'samuel','samu','tomas','tomás','tomi','max','maximo','máximo','leonardo','leo','leonel',
  'leito','bruno','franco','fran','fabian','fabián','fabi','adrian','adrián','adri','cristian',
  'christian','cris','cristopher','christopher','martin','martín','martincito','joel','jeremy',
  'yerson','yair','aaron','aarón','axel','emiliano','emilio','enrique','kike','gustavo','gian',
  'gianfranco','thiago','gael','ian','iker','dario','darío','javier','javi','ruben','rubén',
  'rubi','ruby','julian','julián','julio','cesitar','beto','betito','pancracio','eustaquio',
  'firulais','tiburcio','anacleto','chimuelo','rigoberto','ramiro','ramirez','ramírez','elmer',
  'federico','fede','rosendo','bartolo','bartolito','eusebio','don pepe','doña manuela',
  'laura','laurita','paula','paulita','paola','daniela','dani','gabriela','gabi','fernanda',
  'ferni','fiorella','fio','flavia','romina','romi','ximena','xime','ariana','ari','melissa',
  'meli','karla','carla','karol','carol','karen','kimberly','kim','ashley','angie','angy',
  'noelia','noe','natalia','nata','naty','estefany','stephany','stefany','luisa','luisana',
  'isabella','isa','isabel','belen','belén','bely','cielo','milagros','mili','nayeli','nay',
  'yasmin','yasmín','valery','mayra','maira','mariana','mariafe','mafer','diana','elena',
  'claudia','claudita','rosa','rosita','patricia','paty','patty','monica','mónica','moni',
  'susana','susy','teresa','tere','consuelo','chela','gloria','glorita','wendy','yenifer',
  'jennifer','yenni','jenny','liz','luz','lucero','esperanza','pilar','renata','renatita'
]

const toxicWords = [
  'idiota','imbecil','imbécil','estupido','estúpido','tonto','tonta','tarado','tarada','burro',
  'burra','animal','bestia','inutil','inútil','baboso','babosa','payaso','payasa','ridiculo',
  'ridícula','ridicula','gil','gila','gilazo','mongol','mongolo','mongola','mensazo','mensaza',
  'sonso','sonsa','sonsera','huevon','huevón','webon','webón','weon','weón','weona','huevona',
  'cojudo','cojuda','cojudazo','cojudaza','pendejo','pendeja','pendejazo','pendejada','mierda',
  'mrd','mrda','caca','basura','asqueroso','asquerosa','asco','maldito','maldita','malditos',
  'malditas','rata','ratero','ratera','lacra','babosada','estupidez','porqueria','porquería',
  'callate','cállate','calla','largate','lárgate','vete','muere','muerto','muerta','muerete',
  'muérete','odio','odioso','odiosa','toxica','tóxica','toxico','tóxico','lloron','llorón',
  'llorona','ardido','ardida','picado','picada','resentido','resentida','fracasado','fracasada',
  'perdedor','perdedora','bobo','boba','bobazo','lento','lenta','bruto','bruta','brutazo',
  'brutaza','ignorante','mediocre','sinverguenza','sinvergüenza','patetico','patético','patetica',
  'patética','feo','fea','horrible','espantoso','espantosa','metiche','sapo','sapa','chismoso',
  'chismosa','chupamedias','arrastrado','arrastrada','traidor','traidora','falso','falsa',
  'hipocrita','hipócrita','payasada','molesto','molesta','jodido','jodida','joder','jodete',
  'jódete','chingar','chingas','chingada','chingado','chingon','chingón','chinga','verga',
  'vrg','v3rga','vergazo','verguero','carajo','carajazo','puta','puto','putazo','putiza',
  'putear','putea','ptm','ptmr','conchetumare','ctm','ctmr','concha','conchudo','conchuda',
  'cabron','cabrón','cabrona','cabronazo','maricon','maricón','marica','mariquita','mamaguevo',
  'mamaguebo','mamagüevo','mmg','culero','culera','culiao','culiado','culiada','culazo',
  'culo','qliao','qlia','hpta','hijueputa','hijodeputa','hijo de puta','hdp','hp','malparido',
  'malparida','gonorrea','gonorreita','careverga','caremonda','carepalo','careculo','carechimba',
  'chimba','chimbada','ñero','ñera','lampara','lámpara','sarnoso','sarnosa','babieca','tarupido',
  'zopenco','pelotudo','pelotuda','boludo','boluda','forro','forra','forrito','mogolico',
  'mogólico','mogolica','mogólica','retrasado','retrasada','subnormal','anormal','enfermo',
  'enferma','loco','loca','demente','psicopata','psicópata','parásito','parasito','insecto',
  'gusano','gusana','escoria','desgraciado','desgraciada','infeliz','miserable','zorra','zorro',
  'perra','perro','perrita','perrito','prostituta','prostituto','ramera','golfa','imbesil',
  'estupida','estúpida','pendejos','pendejas','cojudos','cojudas','huevones','webones','weones',
  'idiotas','tarados','taradas','babosos','babosas','burros','burras','brutos','brutas'
]

function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function cleanWord(word = '') {
  return normalizeText(word).replace(/[^a-z0-9ñ]/gi, '')
}

function getMessageText(msg) {
  return String(msg.text || msg.body || msg.caption || msg.message || '')
}

function countWords(words) {
  const count = {}
  for (const word of words) count[word] = (count[word] || 0) + 1
  return Object.entries(count).sort((a, b) => b[1] - a[1])
}

function getWords(text) {
  return normalizeText(text)
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/chat\.whatsapp\.com\/\S+/gi, ' ')
    .replace(/[^a-z0-9ñ\s]/gi, ' ')
    .split(/\s+/)
    .map(cleanWord)
    .filter(Boolean)
}

function getTopKeywords(fullText) {
  const toxicSet = new Set(toxicWords.map(cleanWord))
  const nameSet = new Set(names.map(cleanWord))

  const words = getWords(fullText)
    .filter(w => w.length >= 4)
    .filter(w => !stopWords.includes(w))
    .filter(w => !toxicSet.has(w))
    .filter(w => !nameSet.has(w))

  return countWords(words).slice(0, 14).map(([word]) => word)
}

function getDetectedNames(fullText) {
  const words = getWords(fullText)
  const nameSet = new Set(names.map(cleanWord))

  return countWords(words.filter(w => nameSet.has(w)))
    .slice(0, 8)
    .map(([word]) => word)
}

function getToxicity(fullText) {
  const words = getWords(fullText)
  const toxicSet = new Set(toxicWords.map(cleanWord))
  const found = words.filter(w => toxicSet.has(w))
  const top = countWords(found).slice(0, 8).map(([word]) => word)

  let level = 'bajo'
  if (found.length >= 4) level = 'medio'
  if (found.length >= 9) level = 'alto'

  return {
    total: found.length,
    level,
    top
  }
}

function getImportantPhrases(texts) {
  return texts
    .map(t => t.trim())
    .filter(t => t.length >= 18)
    .filter(t => !/^(\.|!|\/|#)/.test(t))
    .filter(t => !/https?:\/\/|chat\.whatsapp\.com/i.test(t))
    .slice(-10)
}

function joinNatural(list, fallback = 'varios temas') {
  const arr = list.filter(Boolean)
  if (!arr.length) return fallback
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} y ${arr[1]}`
  return `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`
}

function pickDetails(phrases, keywords) {
  const cleaned = phrases
    .map(v => v.replace(/\s+/g, ' ').trim())
    .filter(v => v.length > 15)

  if (cleaned.length >= 2) {
    return cleaned
      .slice(-3)
      .map(v => {
        if (v.length > 90) return v.slice(0, 90).trim() + '...'
        return v
      })
  }

  return keywords.slice(0, 5)
}

function buildDynamicSummary({ keywords, detectedNames, toxicity, phrases, participants }) {
  const main = joinNatural(keywords.slice(0, 5), 'varios temas que fueron apareciendo en el chat')
  const secondary = joinNatural(keywords.slice(5, 10), 'comentarios secundarios y dudas sueltas')
  const namesText = joinNatural(detectedNames.slice(0, 5), '')
  const participantsText = joinNatural(participants.slice(0, 4), 'varios usuarios')
  const details = pickDetails(phrases, keywords)
  const detailText = joinNatural(details, secondary)

  let tone = 'La conversación se sintió bastante normal y casual, con mensajes mezclados entre ideas, respuestas y comentarios rápidos.'
  if (toxicity.level === 'medio') {
    tone = 'También se detectó un tono algo tenso en algunas partes, con palabras fuertes o bromas pesadas que pudieron subir la intensidad del chat.'
  }
  if (toxicity.level === 'alto') {
    tone = 'Además, hubo señales claras de una conversación bastante tóxica o conflictiva, porque aparecieron varias palabras fuertes, insultos o respuestas agresivas.'
  }

  let namesLine = ''
  if (detectedNames.length) {
    namesLine = `Se mencionaron nombres como ${namesText}, por lo que parte de la charla pudo estar relacionada con personas específicas, bromas internas o coordinación entre conocidos. `
  }

  return `En esta conversación se estuvo hablando principalmente de ${main}. A medida que avanzó el chat, también aparecieron ideas relacionadas con ${secondary}, así que el tema no se quedó en una sola cosa, sino que fue tomando varios caminos según lo que iban respondiendo. ${namesLine}Entre los mensajes se notaron detalles como ${detailText}, lo que ayuda a entender que la conversación mezcló información, opiniones y momentos más espontáneos. ${participantsText} participaron en distintos momentos, dando continuidad al tema con preguntas, respuestas o comentarios sueltos. ${tone} En general, el grupo estuvo desarrollando una conversación activa, con un tema central reconocible y varios detalles alrededor que fueron apareciendo poco a poco.`
}


async function aiSummary({ texts, keywords, detectedNames, toxicity, phrases, participants, botname }) {
  const conversation = texts.slice(-45).join('\n')

  const prompt = `
Eres ${botname}. Resume una conversación de WhatsApp en español.

- Un solo párrafo (5-6 líneas)
- Natural, humano
- No menciones análisis ni estadísticas
- Si hay insultos, di que hubo tensión, mencionando los insultos usados, mencionalos con humor si son graciosos para ti (repitiendolos) y aclarando que para ti fue gracioso entre parentesis, con un acento relajado, como sobrado y acento cangri, peruano y de calle peruano de calle
- No inventes cosas que no están en el chat

Palabras clave: ${keywords.join(', ')}
Nombres: ${detectedNames.join(', ')}
Toxicidad: ${toxicity.level}

Conversación:
${conversation}
`

  const res = await axios.post('https://ai.siputzx.my.id', {
    content: conversation,
    user: 'grupo',
    prompt,
    webSearchMode: false
  })

  return res.data?.result?.trim()
}


export default {
  command: ['resumen'],
  category: 'utils',

  run: async (client, m) => {
    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

    const chat = global.db.data.chats[m.chat]
    if (!chat?.messageLog?.length) {
      return m.reply('No hay mensajes suficientes para resumir todavía.')
    }

    const recent = chat.messageLog
      .slice(-80)
      .filter(msg => {
        const text = getMessageText(msg)
        if (!text) return false
        if (/^(\.|\/|!|#)/.test(text.trim())) return false
        return text.trim().length > 2
      })

    if (recent.length < 5) {
      return m.reply('Todavía hay muy pocos mensajes normales para hacer un resumen.')
    }

    const texts = recent.map(getMessageText)
    const fullText = texts.join(' ')

    const keywords = getTopKeywords(fullText)
    const detectedNames = getDetectedNames(fullText)
    const toxicity = getToxicity(fullText)
    const phrases = getImportantPhrases(texts)

    const participantIds = [...new Set(recent.map(v => v.sender || v.participant).filter(Boolean))]
    const mentions = participantIds.slice(0, 8)
    const participants = mentions.map(jid => `@${jid.split('@')[0]}`)

    let summary = null

const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
const botname = global.db.data.settings[botId]?.botname || 'RubyJX Bot'

try {
  summary = await aiSummary({
    texts,
    keywords,
    detectedNames,
    toxicity,
    phrases,
    participants,
    botname
  })
} catch (e) {
  summary = null
}

if (!summary) {
  summary = buildDynamicSummary({
    keywords,
    detectedNames,
    toxicity,
    phrases,
    participants
  })
}

    const text = `
╭━━━〔 🧠 *RESUMEN DEL CHAT* 〕━━━⬣

${summary}

╰━━━〔 RubyJX Bot 〕━━━⬣
`.trim()

    return client.reply(m.chat, text, m, { mentions })
  }
}