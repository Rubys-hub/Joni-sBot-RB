export default {
  command: ['economia', 'economy'],
  category: 'main',

  run: async (client, m, args, usedPrefix, command, text) => {
    const currentPrefix = usedPrefix || '.'
    const pushname = m.pushName || 'Usuario'

    const textMenu = `> 𖧧 *Hola, ${pushname}*
> Accediste al sistema de *economía*

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╮
│
│           ⟐ *E C O N O M I A* ⟐
│
│               ⟡ OWNER :: RubyJX
│           ⎔ TYPE :: ECONOMY SYSTEM
│        ⟣ VERSION :: ^3.0 - Latest
│           ⌬ DEVICE :: ACTIVE
│           ⟐ STATUS :: ONLINE
│
╰┈ࠢ͜┅ࠦ͜͜╾݊͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ ⋮֔ ᩴ ⋰ ╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ݊͜͜╼┅ࠦ͜͜┈ࠢ͜╯

╭────────────〔 💰 ECONOMY SYSTEM 〕────────────╮
│ ⟡ *TOTAL DISPONIBLE ::* 26 comandos
│ ⎔ *MODO ::* Ganancias, apuestas, banco y aventura
╰──────────────────────────────────────────────╯

╭────────〔 🧑‍💼 WORK / TRABAJAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}work
│ ✦ *Aliases:* ${currentPrefix}w • ${currentPrefix}trabajar
│
│ 📌 *¿Qué hace?*
│ Este comando te permite trabajar para recibir
│ una recompensa en monedas dentro del sistema.
│ Es uno de los métodos más básicos, seguros y
│ constantes para generar ingresos.
│
│ 🧠 *¿Cómo funciona?*
│ Al usarlo, el bot simula una actividad de trabajo
│ y te entrega una cantidad determinada de coins.
│ Dependiendo del sistema del bot, puede tener
│ tiempo de espera antes de volver a usarse.
│
│ 🧾 *Uso:*
│ ${currentPrefix}work
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}w
│
│ ✅ *Recomendación:*
│ Úsalo siempre que esté disponible, porque es una
│ forma estable de farmear monedas sin arriesgar saldo.
╰──────────────────────────────────────────────╯

╭────────〔 💳 BALANCE / SALDO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}balance
│ ✦ *Aliases:* ${currentPrefix}bal • ${currentPrefix}coins
│
│ 📌 *¿Qué hace?*
│ Muestra la cantidad de monedas que tienes
│ actualmente dentro del sistema económico.
│ También puede servir para revisar el dinero
│ de otro usuario si el comando lo permite.
│
│ 🧠 *¿Cómo funciona?*
│ El bot consulta tu saldo registrado y te enseña
│ cuántas coins tienes disponibles. Si mencionas a
│ otra persona, también puede mostrarte su balance.
│
│ 🧾 *Uso:*
│ ${currentPrefix}balance
│ ${currentPrefix}balance @usuario
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}bal
│
│ ✅ *Recomendación:*
│ Revísalo antes de apostar, transferir o retirar
│ dinero para evitar errores de cantidad.
╰──────────────────────────────────────────────╯

╭────────〔 🎁 DAILY / DIARIO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}daily
│ ✦ *Alias:* ${currentPrefix}diario
│
│ 📌 *¿Qué hace?*
│ Reclama una recompensa diaria gratuita.
│
│ 🧠 *¿Cómo funciona?*
│ Una vez por día puedes usar este comando para
│ obtener monedas sin necesidad de apostar ni
│ realizar otras actividades. Es uno de los métodos
│ más fáciles para avanzar en tu economía.
│
│ 🧾 *Uso:*
│ ${currentPrefix}daily
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}diario
│
│ ✅ *Recomendación:*
│ No lo dejes pasar. Usarlo todos los días te da
│ una base de dinero constante.
╰──────────────────────────────────────────────╯

╭────────〔 🏦 DEPOSIT / DEPOSITAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}deposit
│ ✦ *Aliases:* ${currentPrefix}dep • ${currentPrefix}depositar • ${currentPrefix}d
│
│ 📌 *¿Qué hace?*
│ Guarda tu dinero en el banco.
│
│ 🧠 *¿Cómo funciona?*
│ Mueve una parte o todo tu saldo disponible al
│ banco. El dinero guardado suele ser más seguro,
│ especialmente contra comandos como robos o
│ pérdidas por descuido.
│
│ 🧾 *Uso:*
│ ${currentPrefix}deposit 500
│ ${currentPrefix}deposit all
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}dep 1000
│
│ ✅ *Recomendación:*
│ Si tienes bastante dinero, deposita una parte
│ para no perderlo fácilmente.
╰──────────────────────────────────────────────╯

╭────────〔 💸 WITHDRAW / RETIRAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}withdraw
│ ✦ *Aliases:* ${currentPrefix}with • ${currentPrefix}retirar
│
│ 📌 *¿Qué hace?*
│ Retira monedas del banco hacia tu saldo normal.
│
│ 🧠 *¿Cómo funciona?*
│ Saca el dinero que habías guardado en el banco
│ y lo devuelve a tu saldo principal para que puedas
│ usarlo en apuestas, transferencias o compras.
│
│ 🧾 *Uso:*
│ ${currentPrefix}withdraw 300
│ ${currentPrefix}withdraw all
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}retirar 500
│
│ ✅ *Recomendación:*
│ Retira solo lo necesario. Así mantienes el resto
│ protegido en el banco.
╰──────────────────────────────────────────────╯

╭────────〔 🎲 COINFLIP / CARA O CRUZ 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}coinflip
│ ✦ *Aliases:* ${currentPrefix}flip • ${currentPrefix}cf
│
│ 📌 *¿Qué hace?*
│ Permite apostar una cantidad de monedas en un
│ lanzamiento de cara o cruz.
│
│ 🧠 *¿Cómo funciona?*
│ Debes elegir una cantidad y una opción, ya sea
│ cara o cruz. Si aciertas, ganas la apuesta; si
│ fallas, pierdes las monedas que arriesgaste.
│
│ 🧾 *Uso:*
│ ${currentPrefix}coinflip 200 cara
│ ${currentPrefix}cf 500 cruz
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}flip 100 cara
│
│ ⚠ *Recomendación:*
│ No apuestes todo tu saldo de una sola vez.
│ Úsalo con moderación.
╰──────────────────────────────────────────────╯

╭────────〔 🎰 CASINO / SLOT 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}casino
│ ✦ *Aliases:* ${currentPrefix}apostar • ${currentPrefix}slot
│
│ 📌 *¿Qué hace?*
│ Te permite apostar monedas dentro del casino.
│
│ 🧠 *¿Cómo funciona?*
│ El sistema procesa una apuesta con una cantidad
│ que tú eliges. Dependiendo del resultado, puedes
│ multiplicar tus monedas o perder lo apostado.
│
│ 🧾 *Uso:*
│ ${currentPrefix}casino 500
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}slot 250
│
│ ⚠ *Recomendación:*
│ Es útil para subir rápido, pero tiene riesgo.
│ No lo uses si estás corto de saldo.
╰──────────────────────────────────────────────╯

╭────────〔 🎡 ROULETTE / RULETA 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}roulette
│ ✦ *Aliases:* ${currentPrefix}rt • ${currentPrefix}ruleta
│
│ 📌 *¿Qué hace?*
│ Apuestas monedas en una ruleta con colores.
│
│ 🧠 *¿Cómo funciona?*
│ Debes indicar una cantidad y un color entre
│ red, black o green. Si sale el color correcto,
│ ganas; si no, pierdes la apuesta.
│
│ 🧾 *Uso:*
│ ${currentPrefix}roulette 300 red
│ ${currentPrefix}ruleta 100 black
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}rt 200 green
│
│ ⚠ *Recomendación:*
│ Úsalo como apuesta ocasional, no como método
│ principal de ingresos.
╰──────────────────────────────────────────────╯

╭────────〔 💰 GIVECOINS / PAGAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}givecoins
│ ✦ *Aliases:* ${currentPrefix}pay • ${currentPrefix}coinsgive
│
│ 📌 *¿Qué hace?*
│ Envía una cantidad de dinero a otro usuario.
│
│ 🧠 *¿Cómo funciona?*
│ Tomas una parte de tu saldo y la transfieres a
│ otra persona usando mención o identificador.
│
│ 🧾 *Uso:*
│ ${currentPrefix}givecoins 300 @usuario
│ ${currentPrefix}pay all @usuario
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}pay 150 @amigo
│
│ ✅ *Recomendación:*
│ Ideal para premios, intercambios o regalos.
╰──────────────────────────────────────────────╯

╭────────〔 🕵️ STEAL / ROBAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}steal
│ ✦ *Aliases:* ${currentPrefix}robar • ${currentPrefix}rob
│
│ 📌 *¿Qué hace?*
│ Intenta quitarle monedas a otro usuario.
│
│ 🧠 *¿Cómo funciona?*
│ El bot ejecuta un intento de robo. Dependiendo
│ del resultado, puedes ganar monedas o salir
│ perjudicado. Es un comando de alto riesgo.
│
│ 🧾 *Uso:*
│ ${currentPrefix}steal @usuario
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}rob @usuario
│
│ ⚠ *Recomendación:*
│ Mejor úsalo si tienes respaldo de dinero y no
│ dependes de ese saldo.
╰──────────────────────────────────────────────╯

╭────────〔 🗺️ AVENTURA / ADVENTURE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}aventura
│ ✦ *Alias:* ${currentPrefix}adventure
│
│ 📌 *¿Qué hace?*
│ Te manda a una aventura para conseguir monedas,
│ objetos o recompensas varias.
│
│ 🧠 *¿Cómo funciona?*
│ El sistema simula una exploración. El resultado
│ puede darte beneficios útiles dentro del modo
│ economía o RPG.
│
│ 🧾 *Uso:*
│ ${currentPrefix}aventura
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}adventure
│
│ ✅ *Recomendación:*
│ Úsalo junto con curación y otros comandos de
│ progreso para aprovecharlo mejor.
╰──────────────────────────────────────────────╯

╭────────〔 ❤️ CURAR / HEAL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}curar
│ ✦ *Alias:* ${currentPrefix}heal
│
│ 📌 *¿Qué hace?*
│ Recupera tu salud para seguir usando funciones
│ ligadas a aventura o exploración.
│
│ 🧠 *¿Cómo funciona?*
│ Te permite restaurar estado antes o después de
│ entrar a actividades más exigentes.
│
│ 🧾 *Uso:*
│ ${currentPrefix}curar
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}heal
│
│ ✅ *Recomendación:*
│ Úsalo antes de aventurarte si tu sistema de
│ economía está enlazado con RPG.
╰──────────────────────────────────────────────╯

╭────────〔 🏹 CAZAR / HUNT 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}cazar
│ ✦ *Alias:* ${currentPrefix}hunt
│
│ 📌 *¿Qué hace?*
│ Sales de caza para obtener recompensas.
│
│ 🧠 *¿Cómo funciona?*
│ El bot procesa una actividad de caza que puede
│ darte monedas u otros recursos dependiendo
│ del resultado.
│
│ 🧾 *Uso:*
│ ${currentPrefix}cazar
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}hunt
│
│ ✅ *Recomendación:*
│ Es una buena fuente secundaria de ingresos.
╰──────────────────────────────────────────────╯

╭────────〔 🎣 FISH / PESCAR 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}fish
│ ✦ *Alias:* ${currentPrefix}pescar
│
│ 📌 *¿Qué hace?*
│ Te permite pescar para conseguir beneficios.
│
│ 🧠 *¿Cómo funciona?*
│ El sistema realiza una pesca y dependiendo del
│ resultado obtienes monedas, peces o recompensas.
│
│ 🧾 *Uso:*
│ ${currentPrefix}fish
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}pescar
│
│ ✅ *Recomendación:*
│ Úsalo junto a otros comandos diarios para sumar
│ ingresos poco a poco.
╰──────────────────────────────────────────────╯

╭────────〔 ⛏️ MINAR / MINE 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}minar
│ ✦ *Alias:* ${currentPrefix}mine
│
│ 📌 *¿Qué hace?*
│ Realiza minería para conseguir recompensas.
│
│ 🧠 *¿Cómo funciona?*
│ El bot simula una extracción de recursos y te
│ entrega premios relacionados con economía.
│
│ 🧾 *Uso:*
│ ${currentPrefix}minar
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}mine
│
│ ✅ *Recomendación:*
│ Es útil para complementar tus ganancias si no
│ quieres depender solo de apuestas.
╰──────────────────────────────────────────────╯

╭────────〔 📦 COFRE / COFFER 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}cofre
│ ✦ *Alias:* ${currentPrefix}coffer
│
│ 📌 *¿Qué hace?*
│ Abre un cofre con recompensas.
│
│ 🧠 *¿Cómo funciona?*
│ Dependiendo del sistema, el cofre puede darte
│ monedas, premios u otros beneficios limitados
│ por tiempo de uso.
│
│ 🧾 *Uso:*
│ ${currentPrefix}cofre
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}coffer
│
│ ✅ *Recomendación:*
│ Reclámalo siempre que esté disponible.
╰──────────────────────────────────────────────╯

╭────────〔 📅 WEEKLY / SEMANAL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}weekly
│ ✦ *Alias:* ${currentPrefix}semanal
│
│ 📌 *¿Qué hace?*
│ Reclama una recompensa semanal.
│
│ 🧠 *¿Cómo funciona?*
│ Una vez por semana puedes obtener un premio
│ mayor que el diario.
│
│ 🧾 *Uso:*
│ ${currentPrefix}weekly
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}semanal
│
│ ✅ *Recomendación:*
│ Muy importante para avanzar más rápido.
╰──────────────────────────────────────────────╯

╭────────〔 🗓️ MONTHLY / MENSUAL 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}monthly
│ ✦ *Alias:* ${currentPrefix}mensual
│
│ 📌 *¿Qué hace?*
│ Reclama una recompensa mensual especial.
│
│ 🧠 *¿Cómo funciona?*
│ Entrega un premio más grande que el semanal,
│ pero solo una vez al mes.
│
│ 🧾 *Uso:*
│ ${currentPrefix}monthly
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}mensual
│
│ ✅ *Recomendación:*
│ No lo olvides, suele ser de las mejores fuentes
│ de recompensa periódica.
╰──────────────────────────────────────────────╯

╭────────〔 🏰 MAZMORRA / DUNGEON 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}mazmorra
│ ✦ *Alias:* ${currentPrefix}dungeon
│
│ 📌 *¿Qué hace?*
│ Te permite entrar a una mazmorra para conseguir
│ recompensas y desafíos.
│
│ 🧠 *¿Cómo funciona?*
│ El sistema te enfrenta a un evento de exploración
│ con posibles ganancias económicas.
│
│ 🧾 *Uso:*
│ ${currentPrefix}mazmorra
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}dungeon
│
│ ✅ *Recomendación:*
│ Muy útil si te gusta el lado RPG de tu economía.
╰──────────────────────────────────────────────╯

╭────────〔 🧠 MATH / MATES 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}math
│ ✦ *Alias:* ${currentPrefix}mates
│
│ 📌 *¿Qué hace?*
│ Inicia un juego de matemáticas con recompensa.
│
│ 🧠 *¿Cómo funciona?*
│ Seleccionas una dificultad y resuelves operaciones.
│ Si respondes bien, ganas monedas.
│
│ 🧾 *Uso:*
│ ${currentPrefix}math easy
│ ${currentPrefix}mates hard
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}math medium
│
│ ✅ *Recomendación:*
│ Buena opción si quieres ganar sin apostar.
╰──────────────────────────────────────────────╯

╭────────〔 ✊ PPT 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}ppt
│
│ 📌 *¿Qué hace?*
│ Juegas piedra, papel o tijera contra el bot.
│
│ 🧠 *¿Cómo funciona?*
│ Debes elegir una de las tres opciones. Si ganas,
│ recibes beneficio; si pierdes, pierdes parte de
│ lo apostado o arriesgado.
│
│ 🧾 *Uso:*
│ ${currentPrefix}ppt piedra
│ ${currentPrefix}ppt papel
│ ${currentPrefix}ppt tijera
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}ppt piedra
│
│ ✅ *Recomendación:*
│ Es un juego rápido para variar entre comandos.
╰──────────────────────────────────────────────╯

╭────────〔 🏆 ECONOMYBOARD / TOP 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}economyboard
│ ✦ *Aliases:* ${currentPrefix}eboard • ${currentPrefix}baltop
│
│ 📌 *¿Qué hace?*
│ Muestra el ranking de los usuarios con más dinero.
│
│ 🧠 *¿Cómo funciona?*
│ El bot ordena los saldos y muestra a los usuarios
│ más ricos del sistema.
│
│ 🧾 *Uso:*
│ ${currentPrefix}economyboard
│ ${currentPrefix}economyboard 2
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}eboard
│
│ ✅ *Recomendación:*
│ Úsalo para medir tu progreso frente a otros.
╰──────────────────────────────────────────────╯

╭────────〔 📊 ECONOMYINFO / EINFO 〕────────╮
│ ✦ *Comando principal:* ${currentPrefix}economyinfo
│ ✦ *Alias:* ${currentPrefix}einfo
│
│ 📌 *¿Qué hace?*
│ Muestra información detallada de tu economía.
│
│ 🧠 *¿Cómo funciona?*
│ Te enseña tus datos principales relacionados con
│ dinero, avances o estado económico en el grupo.
│
│ 🧾 *Uso:*
│ ${currentPrefix}economyinfo
│
│ 💡 *Ejemplo:*
│ ${currentPrefix}einfo
│
│ ✅ *Recomendación:*
│ Muy útil para saber cómo vas antes de apostar.
╰──────────────────────────────────────────────╯

╭──────────〔 🔙 RETURN 〕──────────╮
│ ⟐ ${currentPrefix}menu
│ ⟡ ${currentPrefix}menutotal
╰──────────────────────────────────╯`

    await client.sendMessage(m.chat, { text: textMenu }, { quoted: m })
  }
}