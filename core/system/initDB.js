let isNumber = (x) => typeof x === 'number' && !isNaN(x)

function ensureNumber(value, fallback = 0) {
  return isNumber(value) ? value : fallback
}

function initDB(m, client) {
  global.db.data ||= {}
  global.db.data.users ||= {}
  global.db.data.chats ||= {}
  global.db.data.stats ||= {}
  global.db.data.settings ||= {}
  global.db.data.characters ||= {}
  global.db.data.stickerspack ||= {}
  global.db.data.logs ||= {}

  const botJid =
    client?.user?.id?.split(':')?.[0] + '@s.whatsapp.net'

  const sender = m.sender
  const chatId = m.chat
  const pushname = m.pushName || 'Usuario'

  const settings = global.db.data.settings[botJid] ||= {}

  settings.self ??= false
  settings.prefix ??= ['/', '!', '.', '#']
  settings.commandsejecut = ensureNumber(settings.commandsejecut, 0)
  settings.cmdsejecut = ensureNumber(settings.cmdsejecut, 0)

  settings.id ??= '120363424461852442@newsletter'
  settings.nameid ??= 'RubyJX Bot'
  settings.type ??= 'Owner'
  settings.link ??= 'https://chat.whatsapp.com/KtXac3mqt1zFv3FAfDkJ23'
  settings.banner ??= 'https://d.uguu.se/vUqOqVEQ.jpeg'
  settings.icon ??= 'https://h.uguu.se/QRqObVoA.jpeg'
  settings.currency ??= 'Soles'
  settings.namebot ??= 'RubyJX'
  settings.botname ??= 'RubyJX (JBot)'
  settings.owner ??= '51901931862@s.whatsapp.net'

  const user = global.db.data.users[sender] ||= {}

  user.id ??= sender
  user.name ??= pushname

  user.exp = ensureNumber(user.exp, 0)
  user.level = ensureNumber(user.level, 0)
  user.usedcommands = ensureNumber(user.usedcommands, 0)
  user.usedcmds = ensureNumber(user.usedcmds, 0)
  user.minxp = ensureNumber(user.minxp, 0)
  user.maxxp = ensureNumber(user.maxxp, 0)

  // Economía global
  user.coins = ensureNumber(user.coins, 0)
  user.bank = ensureNumber(user.bank, 0)

  user.vip ??= false
  user.vipType ??= ''
  user.vipExpire = ensureNumber(user.vipExpire, 0)
  user.vipSince = ensureNumber(user.vipSince, 0)
  user.vipReason ??= ''

  user.banned ??= false
  user.ban ??= false
  user.isBanned ??= false
  user.banReason ??= ''
  user.banDate ??= ''
  user.banChat ??= ''
  user.bannedBy ??= ''
  user.bannedByNumber ??= ''
  user.banWarnCount = ensureNumber(user.banWarnCount, 0)
  user.banFirstWarned ??= false
  user.banLastWarn ??= ''
  user.banWarnEvery = ensureNumber(user.banWarnEvery, 10)

  user.banInfo ||= {
    active: false,
    reason: '',
    date: '',
    chat: '',
    by: '',
    byNumber: '',
    attempts: 0,
    lastAttempt: '',
    warnEvery: 10
  }

  user.streak = ensureNumber(user.streak, 0)
  user.lastDailyGlobal = ensureNumber(user.lastDailyGlobal, 0)
  user.weeklyStreak = ensureNumber(user.weeklyStreak, 0)
  user.lastWeeklyGlobal = ensureNumber(user.lastWeeklyGlobal, 0)
  user.monthlyStreak = ensureNumber(user.monthlyStreak, 0)
  user.lastMonthlyGlobal = ensureNumber(user.lastMonthlyGlobal, 0)

  user.pasatiempo ??= ''
  user.description ??= ''
  user.marry ??= ''
  user.genre ??= ''
  user.birth ??= ''
  user.favorite ??= ''
  user.claimMessage ??= ''
  user.Subs = ensureNumber(user.Subs, 0)

  user.metadatos ??= null
  user.metadatos2 ??= null

  user.mainJid ??= sender
  user.jidAliases = Array.isArray(user.jidAliases) ? user.jidAliases : [sender]
  if (!user.jidAliases.includes(sender)) user.jidAliases.push(sender)

  user.firstSeen = ensureNumber(user.firstSeen, Date.now())
  user.lastSeen = Date.now()

  const chat = global.db.data.chats[chatId] ||= {}

  chat.isBanned ??= false
  chat.welcome ??= false
  chat.goodbye ??= false
  chat.sWelcome ??= ''
  chat.sGoodbye ??= ''

  chat.nsfw ??= false
  chat.alerts ??= true
  chat.gacha ??= true
  chat.economy ??= true
  chat.adminonly ??= false
  chat.primaryBot ??= null

  chat.antilinks ??= true
  chat.antilinksoft ??= false
  chat.antilinkWarnings ||= {}

  chat.autoAdmin ??= false
  chat.antiflood ??= false
  chat.floodSettings ||= {}
  chat.antifloodConfig ||= {}
  chat.antifloodUsers ||= {}

  chat.mutedUsers = Array.isArray(chat.mutedUsers) ? chat.mutedUsers : []
  chat.warnLimit = ensureNumber(chat.warnLimit, 3)
  chat.expulsar ??= false

  chat.sales ||= {}
  chat.nsfwFilter ??= false
  chat.antisticker ??= false
  chat.badwords = Array.isArray(chat.badwords) ? chat.badwords : []

  chat.antiestado ??= false
  chat.antivideo ??= false
  chat.rolls ||= {}
  chat.commandStats ||= {}

  chat.users ||= {}

  const localUser = chat.users[sender] ||= {}

  localUser.id ??= sender
  localUser.name ??= pushname

  // Economía local por grupo
  localUser.coins = ensureNumber(localUser.coins, 0)
  localUser.bank = ensureNumber(localUser.bank, 0)

  localUser.warns = ensureNumber(localUser.warns, 0)
  localUser.warnings = ensureNumber(localUser.warnings, 0)

  localUser.afk = ensureNumber(localUser.afk, -1)
  localUser.afkReason ??= ''

  localUser.usedTime ??= null
  localUser.lastCmd = ensureNumber(localUser.lastCmd, 0)

  localUser.lastwork = ensureNumber(localUser.lastwork, 0)
  localUser.lastdaily = ensureNumber(localUser.lastdaily, 0)
  localUser.lastcrime = ensureNumber(localUser.lastcrime, 0)
  localUser.lastmine = ensureNumber(localUser.lastmine, 0)
  localUser.laststeal = ensureNumber(localUser.laststeal, 0)
  localUser.lastweekly = ensureNumber(localUser.lastweekly, 0)
  localUser.lastmonthly = ensureNumber(localUser.lastmonthly, 0)
  localUser.lastRoll = ensureNumber(localUser.lastRoll, 0)
  localUser.lastslut = ensureNumber(localUser.lastslut, 0)
  localUser.lastClaim = ensureNumber(localUser.lastClaim, 0)
  localUser.lastadventure = ensureNumber(localUser.lastadventure, 0)
  localUser.lasthunt = ensureNumber(localUser.lasthunt, 0)
  localUser.lastfish = ensureNumber(localUser.lastfish, 0)
  localUser.lastdungeon = ensureNumber(localUser.lastdungeon, 0)
  localUser.lastppt = ensureNumber(localUser.lastppt, 0)
  localUser.lastApuesta = ensureNumber(localUser.lastApuesta, 0)
  localUser.lastinvoke = ensureNumber(localUser.lastinvoke, 0)

  localUser.health = ensureNumber(localUser.health, 100)
  localUser.characters = Array.isArray(localUser.characters) ? localUser.characters : []
  localUser.favorite ??= ''
}

export default initDB