window.RUBYJX_COMMAND_DATA = {
  "generatedAt": "2026-06-05T20:04:04.585Z",
  "bot": {
    "name": "RubyJX Bot",
    "version": "^3.0 - Latest",
    "stack": "WhatsApp Bot Multi Device · Baileys · Node.js",
    "author": "J_Drsx",
    "publicCommands": 330,
    "categories": 15
  },
  "categories": [
    {
      "id": "main",
      "title": "Principal",
      "icon": "✦",
      "color": "#72f7ff",
      "intro": "Comandos base para abrir menús, consultar información del bot, medir respuesta y enviar reportes.",
      "commands": [
        {
          "name": "allmenu",
          "aliases": [
            "allmenu",
            "help",
            "menu"
          ],
          "category": "main",
          "short": "Ejecuta el comando público “allmenu” dentro de la categoría Principal",
          "detail": "Ejecuta el comando público “allmenu” dentro de la categoría Principal. Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".allmenu",
          "tip": "Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.",
          "source": "cmds/main/menu.js"
        },
        {
          "name": "infobot",
          "aliases": [
            "infobot",
            "infosocket"
          ],
          "category": "main",
          "short": "Ejecuta el comando público “infobot” dentro de la categoría Principal",
          "detail": "Ejecuta el comando público “infobot” dentro de la categoría Principal. Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".infobot",
          "tip": "Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.",
          "source": "cmds/main/infobot.js"
        },
        {
          "name": "invite",
          "aliases": [
            "invite",
            "invitar"
          ],
          "category": "main",
          "short": "Ejecuta el comando público “invite” dentro de la categoría Principal",
          "detail": "Ejecuta el comando público “invite” dentro de la categoría Principal. Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".invite",
          "tip": "Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.",
          "source": "cmds/main/invite.js"
        },
        {
          "name": "report",
          "aliases": [
            "report",
            "reporte",
            "sug",
            "suggest"
          ],
          "category": "main",
          "short": "Ejecuta el comando público “report” dentro de la categoría Principal",
          "detail": "Ejecuta el comando público “report” dentro de la categoría Principal. Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".report",
          "tip": "Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.",
          "source": "cmds/main/suggest.js"
        },
        {
          "name": "status",
          "aliases": [
            "status",
            "estado"
          ],
          "category": "main",
          "short": "Ejecuta el comando público “status” dentro de la categoría Principal",
          "detail": "Ejecuta el comando público “status” dentro de la categoría Principal. Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".status",
          "tip": "Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.",
          "source": "cmds/main/status.js"
        }
      ]
    },
    {
      "id": "economia",
      "title": "Economía",
      "icon": "💰",
      "color": "#9dff7a",
      "intro": "Sistema de dinero, banco, recompensas, apuestas, granjas y movimiento económico dentro del grupo.",
      "commands": [
        {
          "name": "adventure",
          "aliases": [
            "adventure",
            "aventura"
          ],
          "category": "economia",
          "short": "Ejecuta el comando público “adventure” dentro de la categoría Economía",
          "detail": "Ejecuta el comando público “adventure” dentro de la categoría Economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".adventure [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "cmds/economy/adventure.js"
        },
        {
          "name": "apostar",
          "aliases": [
            "apostar",
            "casino"
          ],
          "category": "economia",
          "short": "🎲 Apuesta monedas en casino.",
          "detail": "🎲 Apuesta monedas en casino. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".apostar [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "balance",
          "aliases": [
            "balance",
            "bal",
            "coins",
            "bank"
          ],
          "category": "economia",
          "short": "💳 Muestra tu dinero, banco y progreso económico.",
          "detail": "💳 Muestra tu dinero, banco y progreso económico. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".balance [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "buyfarm",
          "aliases": [
            "buyfarm",
            "harvest",
            "harvestall"
          ],
          "category": "economia",
          "short": "🏡 Compra granjas y cobra producción acumulada.",
          "detail": "🏡 Compra granjas y cobra producción acumulada. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".buyfarm [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "canjear",
          "aliases": [
            "canjear"
          ],
          "category": "economia",
          "short": "🎁 Canjea códigos para recibir premios.",
          "detail": "🎁 Canjea códigos para recibir premios. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".canjear [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "codigo",
          "aliases": [
            "codigo",
            "codigos",
            "code",
            "qr"
          ],
          "category": "economia",
          "short": "🎟️ Administra o muestra códigos de recompensa.",
          "detail": "🎟️ Administra o muestra códigos de recompensa. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".codigo [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "cofre",
          "aliases": [
            "cofre",
            "coffer",
            "chest",
            "tesoro",
            "caja"
          ],
          "category": "economia",
          "short": "🧰 Abre un cofre de suerte. Puedes ganar dinero, no recibir nada o perder si aparece una bomba. Con muchísima suerte puedes ganar hasta 500,000.",
          "detail": "🧰 Abre un cofre de suerte. Puedes ganar dinero, no recibir nada o perder si aparece una bomba. Con muchísima suerte puedes ganar hasta 500,000. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cofre [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "coinflip",
          "aliases": [
            "coinflip",
            "cf",
            "flip"
          ],
          "category": "economia",
          "short": "🪙 Juega cara o cruz apostando monedas.",
          "detail": "🪙 Juega cara o cruz apostando monedas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".coinflip [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "crime",
          "aliases": [
            "crime",
            "crimen"
          ],
          "category": "economia",
          "short": "🕵️ Intenta ganar monedas con una acción arriesgada.",
          "detail": "🕵️ Intenta ganar monedas con una acción arriesgada. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".crime [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "daily",
          "aliases": [
            "daily",
            "diario"
          ],
          "category": "economia",
          "short": "🎁 Reclama tu recompensa diaria.",
          "detail": "🎁 Reclama tu recompensa diaria. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".daily [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "deposit",
          "aliases": [
            "deposit",
            "dep",
            "depositar",
            "d"
          ],
          "category": "economia",
          "short": "🏦 Deposita monedas en el banco.",
          "detail": "🏦 Deposita monedas en el banco. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".deposit [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "dungeon",
          "aliases": [
            "dungeon",
            "mazmorra"
          ],
          "category": "economia",
          "short": "🏰 Entra a una mazmorra para conseguir recompensas.",
          "detail": "🏰 Entra a una mazmorra para conseguir recompensas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".dungeon [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "economyboard",
          "aliases": [
            "economyboard",
            "eboard",
            "baltop",
            "eboardglobal",
            "economyboardglobal",
            "baltopglobal"
          ],
          "category": "economia",
          "short": "🏆 Muestra el ranking económico del grupo.",
          "detail": "🏆 Muestra el ranking económico del grupo. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".economyboard [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "farm",
          "aliases": [
            "farm",
            "farminfo",
            "buyfarm",
            "harvest",
            "harvestall",
            "upgradefarm",
            "repairfarm"
          ],
          "category": "economia",
          "short": "🌾 Muestra tu panel de granjas, producción, daños y dinero acumulado.",
          "detail": "🌾 Muestra tu panel de granjas, producción, daños y dinero acumulado. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".farm [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "givecoins",
          "aliases": [
            "givecoins",
            "pay",
            "coinsgive"
          ],
          "category": "economia",
          "short": "🤝 Transfiere monedas a otro usuario.",
          "detail": "🤝 Transfiere monedas a otro usuario. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".givecoins [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "heal",
          "aliases": [
            "heal",
            "curar"
          ],
          "category": "economia",
          "short": "🩹 Cura tu estado dentro del sistema.",
          "detail": "🩹 Cura tu estado dentro del sistema. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".heal [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "hunt",
          "aliases": [
            "hunt",
            "cazar"
          ],
          "category": "economia",
          "short": "🏹 Caza para conseguir recompensas.",
          "detail": "🏹 Caza para conseguir recompensas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".hunt [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "infoeconomy",
          "aliases": [
            "infoeconomy",
            "cooldowns",
            "economyinfo",
            "einfo"
          ],
          "category": "economia",
          "short": "ℹ️ Muestra información y tiempos de espera de economía.",
          "detail": "ℹ️ Muestra información y tiempos de espera de economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".infoeconomy [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "mine",
          "aliases": [
            "mine",
            "minar"
          ],
          "category": "economia",
          "short": "Ejecuta el comando público “mine” dentro de la categoría Economía",
          "detail": "Ejecuta el comando público “mine” dentro de la categoría Economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".mine [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "cmds/economy/mine.js"
        },
        {
          "name": "monthly",
          "aliases": [
            "monthly",
            "mensual"
          ],
          "category": "economia",
          "short": "📅 Reclama una recompensa mensual.",
          "detail": "📅 Reclama una recompensa mensual. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".monthly [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "pescar",
          "aliases": [
            "pescar",
            "fish"
          ],
          "category": "economia",
          "short": "Ejecuta el comando público “pescar” dentro de la categoría Economía",
          "detail": "Ejecuta el comando público “pescar” dentro de la categoría Economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".pescar [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "cmds/economy/fish.js"
        },
        {
          "name": "ppt",
          "aliases": [
            "ppt"
          ],
          "category": "economia",
          "short": "✊ Juega piedra, papel o tijera.",
          "detail": "✊ Juega piedra, papel o tijera. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ppt [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "robar",
          "aliases": [
            "robar",
            "steal",
            "rob"
          ],
          "category": "economia",
          "short": "Ejecuta el comando público “robar” dentro de la categoría Economía",
          "detail": "Ejecuta el comando público “robar” dentro de la categoría Economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".robar [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "cmds/economy/steal.js"
        },
        {
          "name": "rt",
          "aliases": [
            "rt",
            "roulette",
            "ruleta"
          ],
          "category": "economia",
          "short": "Ejecuta el comando público “rt” dentro de la categoría Economía",
          "detail": "Ejecuta el comando público “rt” dentro de la categoría Economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".rt [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "cmds/economy/roulette.js"
        },
        {
          "name": "slot",
          "aliases": [
            "slot"
          ],
          "category": "economia",
          "short": "🎰 Juega tragamonedas.",
          "detail": "🎰 Juega tragamonedas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".slot [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "slut",
          "aliases": [
            "slut",
            "prostituirse"
          ],
          "category": "economia",
          "short": "💋 Comando de riesgo para ganar o perder monedas.",
          "detail": "💋 Comando de riesgo para ganar o perder monedas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".slut [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "upgradefarm",
          "aliases": [
            "upgradefarm",
            "repairfarm"
          ],
          "category": "economia",
          "short": "🛠️ Mejora o repara tus granjas.",
          "detail": "🛠️ Mejora o repara tus granjas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".upgradefarm [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "weekly",
          "aliases": [
            "weekly",
            "semanal"
          ],
          "category": "economia",
          "short": "Ejecuta el comando público “weekly” dentro de la categoría Economía",
          "detail": "Ejecuta el comando público “weekly” dentro de la categoría Economía. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".weekly [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "cmds/economy/weekly.js"
        },
        {
          "name": "withdraw",
          "aliases": [
            "withdraw",
            "with",
            "retirar"
          ],
          "category": "economia",
          "short": "💸 Retira monedas del banco.",
          "detail": "💸 Retira monedas del banco. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".withdraw [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        },
        {
          "name": "work",
          "aliases": [
            "work",
            "w",
            "chambear",
            "chamba",
            "trabajar"
          ],
          "category": "economia",
          "short": "💼 Trabaja para ganar monedas.",
          "detail": "💼 Trabaja para ganar monedas. Está pensado para que la economía del grupo se sienta viva: los usuarios ganan, guardan, apuestan, administran o mueven recursos sin salir del chat. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".work [cantidad / usuario / opción]",
          "tip": "Úsalo con cuidado si mueve dinero: revisa cantidades, menciones y cooldowns antes de confirmar.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "gacha",
      "title": "Gacha",
      "icon": "🎴",
      "color": "#ff74d4",
      "intro": "Colección de personajes, tienda, favoritos, rankings, intercambios y acciones de waifus.",
      "commands": [
        {
          "name": "aceptar",
          "aliases": [
            "aceptar"
          ],
          "category": "gacha",
          "short": "✅ Acepta un intercambio o acción pendiente.",
          "detail": "✅ Acepta un intercambio o acción pendiente. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".aceptar [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "buyc",
          "aliases": [
            "buyc",
            "buycharacter",
            "buychar"
          ],
          "category": "gacha",
          "short": "🛍️ Compra un personaje.",
          "detail": "🛍️ Compra un personaje. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".buyc [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "charimage",
          "aliases": [
            "charimage",
            "waifuimage",
            "cimage",
            "wimage"
          ],
          "category": "gacha",
          "short": "🖼️ Muestra imagen de un personaje.",
          "detail": "🖼️ Muestra imagen de un personaje. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".charimage [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "charinfo",
          "aliases": [
            "charinfo",
            "winfo",
            "waifuinfo"
          ],
          "category": "gacha",
          "short": "👤 Muestra información de un personaje.",
          "detail": "👤 Muestra información de un personaje. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".charinfo [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "charvideo",
          "aliases": [
            "charvideo",
            "waifuvideo",
            "cvideo",
            "wvideo"
          ],
          "category": "gacha",
          "short": "🎬 Muestra video de un personaje.",
          "detail": "🎬 Muestra video de un personaje. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".charvideo [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "claim",
          "aliases": [
            "claim",
            "c",
            "reclamar"
          ],
          "category": "gacha",
          "short": "💖 Reclama el personaje disponible.",
          "detail": "💖 Reclama el personaje disponible. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".claim [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "delchar",
          "aliases": [
            "delchar",
            "deletewaifu",
            "delwaifu"
          ],
          "category": "gacha",
          "short": "🗑️ Elimina un personaje según permisos.",
          "detail": "🗑️ Elimina un personaje según permisos. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delchar [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "delclaimmsg",
          "aliases": [
            "delclaimmsg",
            "resetclaimmsg"
          ],
          "category": "gacha",
          "short": "🧹 Elimina o reinicia el mensaje de reclamo.",
          "detail": "🧹 Elimina o reinicia el mensaje de reclamo. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delclaimmsg [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "deletefav",
          "aliases": [
            "deletefav",
            "delfav"
          ],
          "category": "gacha",
          "short": "❌ Elimina tu favorito.",
          "detail": "❌ Elimina tu favorito. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".deletefav [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "favtop",
          "aliases": [
            "favtop",
            "favoritetop",
            "favboard"
          ],
          "category": "gacha",
          "short": "⭐ Muestra ranking de favoritos.",
          "detail": "⭐ Muestra ranking de favoritos. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".favtop [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "gachainfo",
          "aliases": [
            "gachainfo",
            "ginfo",
            "infogacha"
          ],
          "category": "gacha",
          "short": "ℹ️ Muestra información del sistema gacha.",
          "detail": "ℹ️ Muestra información del sistema gacha. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".gachainfo [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "giveallharem",
          "aliases": [
            "giveallharem"
          ],
          "category": "gacha",
          "short": "📤 Entrega toda una colección según el sistema.",
          "detail": "📤 Entrega toda una colección según el sistema. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".giveallharem [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "givechar",
          "aliases": [
            "givechar",
            "givewaifu",
            "regalar"
          ],
          "category": "gacha",
          "short": "🎁 Regala un personaje a otro usuario.",
          "detail": "🎁 Regala un personaje a otro usuario. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".givechar [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "harem",
          "aliases": [
            "harem",
            "waifus",
            "claims"
          ],
          "category": "gacha",
          "short": "📦 Muestra tu colección de personajes.",
          "detail": "📦 Muestra tu colección de personajes. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".harem [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "removesale",
          "aliases": [
            "removesale",
            "removerventa"
          ],
          "category": "gacha",
          "short": "🚫 Retira un personaje de la venta.",
          "detail": "🚫 Retira un personaje de la venta. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".removesale [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "robwaifu",
          "aliases": [
            "robwaifu",
            "robarwaifu"
          ],
          "category": "gacha",
          "short": "🦹 Intenta robar una waifu.",
          "detail": "🦹 Intenta robar una waifu. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".robwaifu [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "rollwaifu",
          "aliases": [
            "rollwaifu",
            "rw",
            "roll"
          ],
          "category": "gacha",
          "short": "🎴 Invoca un personaje aleatorio.",
          "detail": "🎴 Invoca un personaje aleatorio. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".rollwaifu [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "sell",
          "aliases": [
            "sell",
            "vender"
          ],
          "category": "gacha",
          "short": "💰 Pone un personaje en venta.",
          "detail": "💰 Pone un personaje en venta. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sell [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "serieinfo",
          "aliases": [
            "serieinfo",
            "ainfo",
            "animeinfo"
          ],
          "category": "gacha",
          "short": "🎞️ Muestra información de una serie o anime.",
          "detail": "🎞️ Muestra información de una serie o anime. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".serieinfo [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "serielist",
          "aliases": [
            "serielist",
            "slist",
            "animelist"
          ],
          "category": "gacha",
          "short": "📚 Lista series disponibles.",
          "detail": "📚 Lista series disponibles. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".serielist [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "setclaim",
          "aliases": [
            "setclaim",
            "setclaimmsg"
          ],
          "category": "gacha",
          "short": "💬 Configura mensaje de reclamo.",
          "detail": "💬 Configura mensaje de reclamo. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setclaim [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "setfav",
          "aliases": [
            "setfav",
            "setfavourite"
          ],
          "category": "gacha",
          "short": "💘 Marca un personaje como favorito.",
          "detail": "💘 Marca un personaje como favorito. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setfav [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "trade",
          "aliases": [
            "trade",
            "intercambiar"
          ],
          "category": "gacha",
          "short": "🔁 Inicia intercambio de personajes.",
          "detail": "🔁 Inicia intercambio de personajes. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".trade [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "vote",
          "aliases": [
            "vote",
            "votar"
          ],
          "category": "gacha",
          "short": "🗳️ Vota por un personaje.",
          "detail": "🗳️ Vota por un personaje. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".vote [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "waifusboard",
          "aliases": [
            "waifusboard",
            "waifustop",
            "topwaifus",
            "wtop"
          ],
          "category": "gacha",
          "short": "🏆 Muestra ranking de waifus.",
          "detail": "🏆 Muestra ranking de waifus. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".waifusboard [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        },
        {
          "name": "wshop",
          "aliases": [
            "wshop",
            "haremshop",
            "tiendawaifus"
          ],
          "category": "gacha",
          "short": "🛒 Abre la tienda de personajes.",
          "detail": "🛒 Abre la tienda de personajes. Forma parte del sistema de colección, donde cada usuario puede construir progreso, personajes favoritos, rankings y movimiento social alrededor de sus waifus. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".wshop [personaje / opción / usuario]",
          "tip": "Funciona mejor cuando el grupo participa: rankings, favoritos e intercambios hacen que el sistema tenga vida.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "downloads",
      "title": "Descargas",
      "icon": "📥",
      "color": "#48d7ff",
      "intro": "Búsquedas y descargas desde YouTube, TikTok, Instagram, Facebook, X, MediaFire, Drive y más.",
      "commands": [
        {
          "name": "apk",
          "aliases": [
            "apk",
            "aptoide",
            "apkdl"
          ],
          "category": "downloads",
          "short": "📲 Busca y descarga APKs.",
          "detail": "📲 Busca y descarga APKs. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".apk [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "drive",
          "aliases": [
            "drive",
            "gdrive"
          ],
          "category": "downloads",
          "short": "☁️ Descarga archivos de Google Drive.",
          "detail": "☁️ Descarga archivos de Google Drive. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".drive [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "facebook",
          "aliases": [
            "facebook",
            "fb"
          ],
          "category": "downloads",
          "short": "📘 Descarga videos de Facebook.",
          "detail": "📘 Descarga videos de Facebook. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".facebook [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "imagen",
          "aliases": [
            "imagen",
            "img",
            "image"
          ],
          "category": "downloads",
          "short": "🌄 Busca imágenes por texto.",
          "detail": "🌄 Busca imágenes por texto. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".imagen [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "instagram",
          "aliases": [
            "instagram",
            "ig"
          ],
          "category": "downloads",
          "short": "📸 Descarga contenido de Instagram.",
          "detail": "📸 Descarga contenido de Instagram. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".instagram [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "mediafire",
          "aliases": [
            "mediafire",
            "mf"
          ],
          "category": "downloads",
          "short": "📁 Descarga archivos de MediaFire.",
          "detail": "📁 Descarga archivos de MediaFire. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".mediafire [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "pinterest",
          "aliases": [
            "pinterest",
            "pin",
            "anclar"
          ],
          "category": "downloads",
          "short": "📌 Busca imágenes en Pinterest.",
          "detail": "📌 Busca imágenes en Pinterest. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".pinterest [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "play",
          "aliases": [
            "play",
            "mp3",
            "audiomp3",
            "audio",
            "youtubemp3",
            "tiktokmp3",
            "igmp3",
            "linkmp3",
            "ytmp3",
            "ytaudio",
            "playaudio"
          ],
          "category": "downloads",
          "short": "🎧 Busca música en YouTube y la descarga en audio.",
          "detail": "🎧 Busca música en YouTube y la descarga en audio. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".play [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "play2",
          "aliases": [
            "play2",
            "mp4",
            "ytmp4",
            "ytvideo",
            "playvideo"
          ],
          "category": "downloads",
          "short": "🎬 Busca o descarga videos de YouTube.",
          "detail": "🎬 Busca o descarga videos de YouTube. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".play2 [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "tiktok",
          "aliases": [
            "tiktok",
            "tt",
            "tiktoksearch",
            "ttsearch",
            "tts"
          ],
          "category": "downloads",
          "short": "🎶 Descarga videos de TikTok.",
          "detail": "🎶 Descarga videos de TikTok. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".tiktok [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "tiktoksearch",
          "aliases": [
            "tiktoksearch",
            "ttsearch",
            "tts",
            "hablar",
            "voz",
            "decir"
          ],
          "category": "downloads",
          "short": "🔍 Busca videos de TikTok.",
          "detail": "🔍 Busca videos de TikTok. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".tiktoksearch [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "twitter",
          "aliases": [
            "twitter",
            "x",
            "xdl"
          ],
          "category": "downloads",
          "short": "🐦 Descarga contenido de Twitter o X.",
          "detail": "🐦 Descarga contenido de Twitter o X. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".twitter [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "wpgrupos",
          "aliases": [
            "wpgrupos",
            "gruposwa",
            "wagrupos"
          ],
          "category": "downloads",
          "short": "👥 Busca grupos de WhatsApp.",
          "detail": "👥 Busca grupos de WhatsApp. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".wpgrupos [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        },
        {
          "name": "ytsearch",
          "aliases": [
            "ytsearch",
            "search"
          ],
          "category": "downloads",
          "short": "🔎 Busca videos en YouTube.",
          "detail": "🔎 Busca videos en YouTube. Ayuda a convertir el bot en una herramienta rápida para buscar, descargar o transformar contenido sin pasar por páginas externas complicadas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ytsearch [búsqueda o enlace]",
          "tip": "Si usas enlaces, pega una URL limpia. Si usas búsqueda, escribe términos concretos para obtener mejores resultados.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "profile",
      "title": "Perfil",
      "icon": "👤",
      "color": "#ffd166",
      "intro": "Perfil social del usuario: nivel, experiencia, cumpleaños, descripción, género, hobbies y pareja.",
      "commands": [
        {
          "name": "afk",
          "aliases": [
            "afk"
          ],
          "category": "profile",
          "short": "💤 Activa estado ausente.",
          "detail": "💤 Activa estado ausente. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".afk [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "delbirth",
          "aliases": [
            "delbirth"
          ],
          "category": "profile",
          "short": "❌ Elimina tu cumpleaños.",
          "detail": "❌ Elimina tu cumpleaños. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delbirth [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "deldescription",
          "aliases": [
            "deldescription",
            "deldesc"
          ],
          "category": "profile",
          "short": "🧹 Elimina tu descripción.",
          "detail": "🧹 Elimina tu descripción. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".deldescription [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "delgenre",
          "aliases": [
            "delgenre"
          ],
          "category": "profile",
          "short": "❌ Elimina tu género.",
          "detail": "❌ Elimina tu género. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delgenre [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "delpasatiempo",
          "aliases": [
            "delpasatiempo",
            "removehobby"
          ],
          "category": "profile",
          "short": "🧹 Elimina tu pasatiempo.",
          "detail": "🧹 Elimina tu pasatiempo. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delpasatiempo [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "divorce",
          "aliases": [
            "divorce"
          ],
          "category": "profile",
          "short": "💔 Termina tu matrimonio dentro del bot.",
          "detail": "💔 Termina tu matrimonio dentro del bot. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".divorce [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "lboard",
          "aliases": [
            "lboard",
            "lb",
            "leaderboard"
          ],
          "category": "profile",
          "short": "🏆 Muestra ranking de niveles.",
          "detail": "🏆 Muestra ranking de niveles. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".lboard [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "level",
          "aliases": [
            "level",
            "lvl"
          ],
          "category": "profile",
          "short": "📊 Muestra tu nivel y experiencia.",
          "detail": "📊 Muestra tu nivel y experiencia. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".level [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "marry",
          "aliases": [
            "marry",
            "casarse"
          ],
          "category": "profile",
          "short": "💍 Propone matrimonio a otro usuario.",
          "detail": "💍 Propone matrimonio a otro usuario. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".marry [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "profile",
          "aliases": [
            "profile",
            "perfil"
          ],
          "category": "profile",
          "short": "👤 Muestra tu perfil completo.",
          "detail": "👤 Muestra tu perfil completo. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".profile [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "setbirth",
          "aliases": [
            "setbirth"
          ],
          "category": "profile",
          "short": "🎂 Configura tu cumpleaños.",
          "detail": "🎂 Configura tu cumpleaños. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setbirth [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "setdescription",
          "aliases": [
            "setdescription",
            "setdesc"
          ],
          "category": "profile",
          "short": "📝 Configura tu descripción.",
          "detail": "📝 Configura tu descripción. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setdescription [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "setgenre",
          "aliases": [
            "setgenre"
          ],
          "category": "profile",
          "short": "⚥ Configura tu género.",
          "detail": "⚥ Configura tu género. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setgenre [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        },
        {
          "name": "setpasatiempo",
          "aliases": [
            "setpasatiempo",
            "sethobby"
          ],
          "category": "profile",
          "short": "🎯 Configura tu pasatiempo.",
          "detail": "🎯 Configura tu pasatiempo. Aporta identidad personal al usuario dentro del bot, haciendo que cada miembro tenga presencia, progreso y datos sociales visibles. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setpasatiempo [usuario o dato]",
          "tip": "Mantener tu perfil completo ayuda a que otros comandos sociales muestren información más bonita.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "grupo",
      "title": "Grupo",
      "icon": "👥",
      "color": "#b7ff5c",
      "intro": "Moderación, seguridad, configuración del grupo, advertencias, rachas, menciones e inactividad.",
      "commands": [
        {
          "name": "add",
          "aliases": [
            "add"
          ],
          "category": "grupo",
          "short": "👤 Agrega un usuario al grupo.",
          "detail": "👤 Agrega un usuario al grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".add [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "adminonly",
          "aliases": [
            "adminonly",
            "onlyadmin"
          ],
          "category": "grupo",
          "short": "👮‍♂️ Solo admins pueden usar comandos.",
          "detail": "👮‍♂️ Solo admins pueden usar comandos. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".adminonly [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "alerts",
          "aliases": [
            "alerts",
            "alertas"
          ],
          "category": "grupo",
          "short": "🚨 Activa o desactiva alertas.",
          "detail": "🚨 Activa o desactiva alertas. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".alerts [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antiestado",
          "aliases": [
            "antiestado"
          ],
          "category": "grupo",
          "short": "🚫 Activa o desactiva antiestados.",
          "detail": "🚫 Activa o desactiva antiestados. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antiestado [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antiflood",
          "aliases": [
            "antiflood",
            "flood"
          ],
          "category": "grupo",
          "short": "🌊 Activa o desactiva antiflood.",
          "detail": "🌊 Activa o desactiva antiflood. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antiflood [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antiimage",
          "aliases": [
            "antiimage",
            "antiimg"
          ],
          "category": "grupo",
          "short": "🖼️ Bloquea imágenes.",
          "detail": "🖼️ Bloquea imágenes. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antiimage [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antilink",
          "aliases": [
            "antilink",
            "antienlaces",
            "antilinks"
          ],
          "category": "grupo",
          "short": "🔗 Activa o desactiva antilinks.",
          "detail": "🔗 Activa o desactiva antilinks. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antilink [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antilinksoft",
          "aliases": [
            "antilinksoft"
          ],
          "category": "grupo",
          "short": "🧷 Activa modo suave de antilinks.",
          "detail": "🧷 Activa modo suave de antilinks. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antilinksoft [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antisticker",
          "aliases": [
            "antisticker"
          ],
          "category": "grupo",
          "short": "🎭 Bloquea stickers.",
          "detail": "🎭 Bloquea stickers. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antisticker [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "antivideo",
          "aliases": [
            "antivideo"
          ],
          "category": "grupo",
          "short": "🎬 Bloquea videos.",
          "detail": "🎬 Bloquea videos. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".antivideo [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "autoadmin",
          "aliases": [
            "autoadmin"
          ],
          "category": "grupo",
          "short": "👮 Activa sistema de auto admin.",
          "detail": "👮 Activa sistema de auto admin. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".autoadmin [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "badwords",
          "aliases": [
            "badwords",
            "antitoxic",
            "antigroserias"
          ],
          "category": "grupo",
          "short": "🤬 Configura filtro de malas palabras.",
          "detail": "🤬 Configura filtro de malas palabras. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".badwords [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "ban",
          "aliases": [
            "ban"
          ],
          "category": "grupo",
          "short": "🚫 Banea a un usuario del bot.",
          "detail": "🚫 Banea a un usuario del bot. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ban [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "baninfo",
          "aliases": [
            "baninfo"
          ],
          "category": "grupo",
          "short": "ℹ️ Muestra información del ban de un usuario.",
          "detail": "ℹ️ Muestra información del ban de un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".baninfo [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "banlist",
          "aliases": [
            "banlist"
          ],
          "category": "grupo",
          "short": "📋 Muestra lista de usuarios baneados.",
          "detail": "📋 Muestra lista de usuarios baneados. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".banlist [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "banpanel",
          "aliases": [
            "banpanel",
            "banadmin"
          ],
          "category": "grupo",
          "short": "🛠️ Panel del owner para permitir ban/unban a admins.",
          "detail": "🛠️ Panel del owner para permitir ban/unban a admins. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".banpanel [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "bot",
          "aliases": [
            "bot"
          ],
          "category": "grupo",
          "short": "🤖 Activa o desactiva el bot en el grupo.",
          "detail": "🤖 Activa o desactiva el bot en el grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bot [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "botruby",
          "aliases": [
            "botruby"
          ],
          "category": "grupo",
          "short": "Ejecuta el comando público “botruby” dentro de la categoría Grupo",
          "detail": "Ejecuta el comando público “botruby” dentro de la categoría Grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".botruby [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "cmds/group/bot.js"
        },
        {
          "name": "closet",
          "aliases": [
            "closet",
            "close",
            "cerrar"
          ],
          "category": "grupo",
          "short": "🔒 Cierra el grupo.",
          "detail": "🔒 Cierra el grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".closet [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "delete",
          "aliases": [
            "delete",
            "del",
            "borrar"
          ],
          "category": "grupo",
          "short": "🧹 Elimina un mensaje respondido.",
          "detail": "🧹 Elimina un mensaje respondido. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delete [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "delwarn",
          "aliases": [
            "delwarn"
          ],
          "category": "grupo",
          "short": "🧹 Elimina advertencias.",
          "detail": "🧹 Elimina advertencias. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delwarn [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "demote",
          "aliases": [
            "demote"
          ],
          "category": "grupo",
          "short": "⬇️ Quita admin a un usuario.",
          "detail": "⬇️ Quita admin a un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".demote [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "gacha",
          "aliases": [
            "gacha"
          ],
          "category": "grupo",
          "short": "🎴 Activa o desactiva gacha.",
          "detail": "🎴 Activa o desactiva gacha. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".gacha [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "goodbye",
          "aliases": [
            "goodbye",
            "despedida"
          ],
          "category": "grupo",
          "short": "🚪 Activa o desactiva despedida.",
          "detail": "🚪 Activa o desactiva despedida. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".goodbye [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "gp",
          "aliases": [
            "gp",
            "groupinfo"
          ],
          "category": "grupo",
          "short": "ℹ️ Muestra información del grupo.",
          "detail": "ℹ️ Muestra información del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".gp [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "hidetag",
          "aliases": [
            "hidetag",
            "tag"
          ],
          "category": "grupo",
          "short": "🙈 Menciona a todos ocultamente.",
          "detail": "🙈 Menciona a todos ocultamente. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".hidetag [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "inforacha",
          "aliases": [
            "inforacha",
            "streakinfo",
            "rachainfo"
          ],
          "category": "grupo",
          "short": "🔥 Muestra el estado de tu racha diaria en el grupo.",
          "detail": "🔥 Muestra el estado de tu racha diaria en el grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".inforacha [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "kick",
          "aliases": [
            "kick"
          ],
          "category": "grupo",
          "short": "👢 Expulsa a un usuario del grupo.",
          "detail": "👢 Expulsa a un usuario del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kick [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "kickall",
          "aliases": [
            "kickall"
          ],
          "category": "grupo",
          "short": "💥 Expulsa usuarios de forma masiva.",
          "detail": "💥 Expulsa usuarios de forma masiva. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kickall [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "kickinactive",
          "aliases": [
            "kickinactive",
            "kickinactivos",
            "kickinactivepage",
            "kickinactiveall"
          ],
          "category": "grupo",
          "short": "👢 Expulsa usuarios inactivos.",
          "detail": "👢 Expulsa usuarios inactivos. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kickinactive [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "kicknum",
          "aliases": [
            "kicknum",
            "kickprefix",
            "kickcountry"
          ],
          "category": "grupo",
          "short": "🌎 Expulsa usuarios por prefijo o país.",
          "detail": "🌎 Expulsa usuarios por prefijo o país. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kicknum [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "link",
          "aliases": [
            "link"
          ],
          "category": "grupo",
          "short": "🔗 Muestra enlace del grupo.",
          "detail": "🔗 Muestra enlace del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".link [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "modconfig",
          "aliases": [
            "modconfig",
            "automodconfig"
          ],
          "category": "grupo",
          "short": "🛡️ Configura moderación automática.",
          "detail": "🛡️ Configura moderación automática. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".modconfig [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "mute",
          "aliases": [
            "mute"
          ],
          "category": "grupo",
          "short": "🔇 Mutea a un usuario.",
          "detail": "🔇 Mutea a un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".mute [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "mutelist",
          "aliases": [
            "mutelist"
          ],
          "category": "grupo",
          "short": "📃 Muestra lista de muteados.",
          "detail": "📃 Muestra lista de muteados. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".mutelist [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "mutetime",
          "aliases": [
            "mutetime",
            "tempmute"
          ],
          "category": "grupo",
          "short": "⏳ Mutea temporalmente.",
          "detail": "⏳ Mutea temporalmente. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".mutetime [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "nsfw",
          "aliases": [
            "nsfw"
          ],
          "category": "grupo",
          "short": "🔞 Activa o desactiva NSFW en el grupo.",
          "detail": "🔞 Activa o desactiva NSFW en el grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".nsfw [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "nsfwfilter",
          "aliases": [
            "nsfwfilter",
            "antinsfw"
          ],
          "category": "grupo",
          "short": "🔞 Filtra contenido NSFW.",
          "detail": "🔞 Filtra contenido NSFW. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".nsfwfilter [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "open",
          "aliases": [
            "open",
            "abrir"
          ],
          "category": "grupo",
          "short": "🔓 Abre el grupo.",
          "detail": "🔓 Abre el grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".open [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "promote",
          "aliases": [
            "promote"
          ],
          "category": "grupo",
          "short": "👑 Da admin a un usuario.",
          "detail": "👑 Da admin a un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".promote [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "promoto",
          "aliases": [
            "promoto"
          ],
          "category": "grupo",
          "short": "Ejecuta el comando público “promoto” dentro de la categoría Grupo",
          "detail": "Ejecuta el comando público “promoto” dentro de la categoría Grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".promoto [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "cmds/group/promoto.js"
        },
        {
          "name": "purge",
          "aliases": [
            "purge",
            "clearchat"
          ],
          "category": "grupo",
          "short": "🧽 Limpia mensajes según el sistema.",
          "detail": "🧽 Limpia mensajes según el sistema. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".purge [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "purgeuser",
          "aliases": [
            "purgeuser",
            "clearuser",
            "deluser",
            "purgueuser"
          ],
          "category": "grupo",
          "short": "🚮 Limpia mensajes o datos de un usuario.",
          "detail": "🚮 Limpia mensajes o datos de un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".purgeuser [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "racha",
          "aliases": [
            "racha",
            "inforacha",
            "streakinfo",
            "rachainfo"
          ],
          "category": "grupo",
          "short": "🔥 Muestra el menú decorado de rachas del grupo.",
          "detail": "🔥 Muestra el menú decorado de rachas del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".racha [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "revoke",
          "aliases": [
            "revoke",
            "restablecer"
          ],
          "category": "grupo",
          "short": "♻️ Restablece el enlace del grupo.",
          "detail": "♻️ Restablece el enlace del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".revoke [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "rpg",
          "aliases": [
            "rpg",
            "economy",
            "economia"
          ],
          "category": "grupo",
          "short": "💰 Activa o desactiva economía.",
          "detail": "💰 Activa o desactiva economía. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".rpg [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setgoodbye",
          "aliases": [
            "setgoodbye"
          ],
          "category": "grupo",
          "short": "💬 Configura mensaje de despedida.",
          "detail": "💬 Configura mensaje de despedida. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setgoodbye [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setgpbanner",
          "aliases": [
            "setgpbanner"
          ],
          "category": "grupo",
          "short": "🖼️ Cambia imagen del grupo.",
          "detail": "🖼️ Cambia imagen del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setgpbanner [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setgpdesc",
          "aliases": [
            "setgpdesc"
          ],
          "category": "grupo",
          "short": "📝 Cambia descripción del grupo.",
          "detail": "📝 Cambia descripción del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setgpdesc [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setgpname",
          "aliases": [
            "setgpname"
          ],
          "category": "grupo",
          "short": "📛 Cambia nombre del grupo.",
          "detail": "📛 Cambia nombre del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setgpname [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setprimary",
          "aliases": [
            "setprimary"
          ],
          "category": "grupo",
          "short": "⭐ Marca grupo principal.",
          "detail": "⭐ Marca grupo principal. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setprimary [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setracha",
          "aliases": [
            "setracha"
          ],
          "category": "grupo",
          "short": "🔥 Activa o desactiva las rachas automáticas del grupo.",
          "detail": "🔥 Activa o desactiva las rachas automáticas del grupo. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setracha [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setwarnlimit",
          "aliases": [
            "setwarnlimit"
          ],
          "category": "grupo",
          "short": "🚧 Configura límite de advertencias.",
          "detail": "🚧 Configura límite de advertencias. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setwarnlimit [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "setwelcome",
          "aliases": [
            "setwelcome"
          ],
          "category": "grupo",
          "short": "💬 Configura mensaje de bienvenida.",
          "detail": "💬 Configura mensaje de bienvenida. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setwelcome [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "todos",
          "aliases": [
            "todos",
            "invocar",
            "tagall",
            "ritual",
            "invoke"
          ],
          "category": "grupo",
          "short": "📢 Menciona a todos los miembros.",
          "detail": "📢 Menciona a todos los miembros. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".todos [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "topcount",
          "aliases": [
            "topcount",
            "topmensajes",
            "topmsgcount",
            "topmessages"
          ],
          "category": "grupo",
          "short": "🏆 Muestra top de mensajes.",
          "detail": "🏆 Muestra top de mensajes. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".topcount [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "topinactive",
          "aliases": [
            "topinactive",
            "topinactivos",
            "topinactiveusers"
          ],
          "category": "grupo",
          "short": "😴 Muestra usuarios inactivos.",
          "detail": "😴 Muestra usuarios inactivos. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".topinactive [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "unban",
          "aliases": [
            "unban"
          ],
          "category": "grupo",
          "short": "✅ Quita el ban de un usuario.",
          "detail": "✅ Quita el ban de un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".unban [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "unmute",
          "aliases": [
            "unmute"
          ],
          "category": "grupo",
          "short": "🔊 Quita mute a un usuario.",
          "detail": "🔊 Quita mute a un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".unmute [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "warn",
          "aliases": [
            "warn"
          ],
          "category": "grupo",
          "short": "⚠️ Da advertencia a un usuario.",
          "detail": "⚠️ Da advertencia a un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".warn [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "warns",
          "aliases": [
            "warns"
          ],
          "category": "grupo",
          "short": "📋 Muestra advertencias de un usuario.",
          "detail": "📋 Muestra advertencias de un usuario. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".warns [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        },
        {
          "name": "welcome",
          "aliases": [
            "welcome",
            "bienvenida",
            "goodbye",
            "despedida",
            "alerts",
            "alertas",
            "nsfw",
            "antilink",
            "antienlaces",
            "antilinks",
            "antilinksoft",
            "rpg",
            "economy",
            "economia",
            "gacha",
            "setracha",
            "adminonly",
            "onlyadmin"
          ],
          "category": "grupo",
          "short": "👋 Activa o desactiva bienvenida.",
          "detail": "👋 Activa o desactiva bienvenida. Está orientado a administrar comunidades: orden, seguridad, bienvenida, menciones, estadísticas y automatizaciones del grupo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".welcome [usuario, opción o configuración]",
          "tip": "La mayoría requiere permisos de admin o configuración activa. Lee el resultado para confirmar el cambio.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "stickers",
      "title": "Stickers",
      "icon": "🎨",
      "color": "#ff9f43",
      "intro": "Creación de stickers, efectos, packs, metadata, nombres, autores y administración de colecciones.",
      "commands": [
        {
          "name": "addsticker",
          "aliases": [
            "addsticker",
            "stickeradd"
          ],
          "category": "stickers",
          "short": "➕ Agrega sticker a un pack.",
          "detail": "➕ Agrega sticker a un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".addsticker respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "brat",
          "aliases": [
            "brat"
          ],
          "category": "stickers",
          "short": "🍼 Crea sticker estilo brat.",
          "detail": "🍼 Crea sticker estilo brat. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".brat respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "bratv",
          "aliases": [
            "bratv"
          ],
          "category": "stickers",
          "short": "🎥 Crea sticker/video estilo brat.",
          "detail": "🎥 Crea sticker/video estilo brat. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bratv respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "delmeta",
          "aliases": [
            "delmeta",
            "delstickermeta"
          ],
          "category": "stickers",
          "short": "🧹 Elimina metadata personalizada.",
          "detail": "🧹 Elimina metadata personalizada. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delmeta respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "delpack",
          "aliases": [
            "delpack"
          ],
          "category": "stickers",
          "short": "🗑️ Elimina un pack.",
          "detail": "🗑️ Elimina un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".delpack respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "emojimix",
          "aliases": [
            "emojimix"
          ],
          "category": "stickers",
          "short": "😎 Combina emojis en sticker.",
          "detail": "😎 Combina emojis en sticker. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".emojimix respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "getpack",
          "aliases": [
            "getpack",
            "pack",
            "stickerpack"
          ],
          "category": "stickers",
          "short": "📦 Muestra u obtiene un pack de stickers.",
          "detail": "📦 Muestra u obtiene un pack de stickers. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".getpack respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "msticker",
          "aliases": [
            "msticker",
            "menusticker",
            "stickermenu",
            "menustickers"
          ],
          "category": "stickers",
          "short": "Ejecuta el comando público “msticker” dentro de la categoría Stickers",
          "detail": "Ejecuta el comando público “msticker” dentro de la categoría Stickers. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".msticker respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "cmds/stickers/msticker.js"
        },
        {
          "name": "newpack",
          "aliases": [
            "newpack",
            "newstickerpack"
          ],
          "category": "stickers",
          "short": "🆕 Crea un nuevo pack de stickers.",
          "detail": "🆕 Crea un nuevo pack de stickers. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".newpack respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "packlist",
          "aliases": [
            "packlist",
            "stickerpacks"
          ],
          "category": "stickers",
          "short": "📜 Lista tus packs de stickers.",
          "detail": "📜 Lista tus packs de stickers. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".packlist respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "qc",
          "aliases": [
            "qc"
          ],
          "category": "stickers",
          "short": "💬 Crea sticker tipo quote.",
          "detail": "💬 Crea sticker tipo quote. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".qc respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "s1",
          "aliases": [
            "s1"
          ],
          "category": "stickers",
          "short": "🧩 Crea sticker con método alternativo.",
          "detail": "🧩 Crea sticker con método alternativo. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".s1 respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "setpackprivate",
          "aliases": [
            "setpackprivate",
            "setpackpriv",
            "packprivate"
          ],
          "category": "stickers",
          "short": "🔒 Hace privado un pack.",
          "detail": "🔒 Hace privado un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setpackprivate respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "setpackpublic",
          "aliases": [
            "setpackpublic",
            "setpackpub",
            "packpublic"
          ],
          "category": "stickers",
          "short": "🌍 Hace público un pack.",
          "detail": "🌍 Hace público un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setpackpublic respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "setstickermeta",
          "aliases": [
            "setstickermeta",
            "setmeta"
          ],
          "category": "stickers",
          "short": "⚙️ Configura metadata de stickers.",
          "detail": "⚙️ Configura metadata de stickers. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setstickermeta respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "setstickerpackdesc",
          "aliases": [
            "setstickerpackdesc",
            "setpackdesc",
            "packdesc"
          ],
          "category": "stickers",
          "short": "📝 Cambia descripción de un pack.",
          "detail": "📝 Cambia descripción de un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setstickerpackdesc respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "setstickerpackname",
          "aliases": [
            "setstickerpackname",
            "setpackname",
            "packname"
          ],
          "category": "stickers",
          "short": "🏷️ Cambia nombre de un pack.",
          "detail": "🏷️ Cambia nombre de un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setstickerpackname respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "sticker",
          "aliases": [
            "sticker",
            "s",
            "s1"
          ],
          "category": "stickers",
          "short": "🖼️ Convierte imagen o video en sticker.",
          "detail": "🖼️ Convierte imagen o video en sticker. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sticker respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "stickerdel",
          "aliases": [
            "stickerdel",
            "delsticker"
          ],
          "category": "stickers",
          "short": "❌ Elimina sticker de un pack.",
          "detail": "❌ Elimina sticker de un pack. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".stickerdel respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        },
        {
          "name": "stickername",
          "aliases": [
            "stickername",
            "sname",
            "sn",
            "sn1"
          ],
          "category": "stickers",
          "short": "🏷️ Cambia nombre o autor del sticker.",
          "detail": "🏷️ Cambia nombre o autor del sticker. Convierte el chat en un taller creativo para crear stickers, administrar packs y personalizar metadata de forma cómoda. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".stickername respondiendo a una imagen, video o sticker",
          "tip": "Para mejores resultados, responde directamente al archivo que quieres convertir o modificar.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "utils",
      "title": "Utilidades",
      "icon": "🛠️",
      "color": "#66e3ff",
      "intro": "Herramientas de IA, texto, traducción, enlaces, multimedia, sistema, logs y productividad.",
      "commands": [
        {
          "name": "anonmsg",
          "aliases": [
            "anonmsg",
            "anonimo",
            "anon"
          ],
          "category": "utils",
          "short": "💌 Envía mensaje anónimo.",
          "detail": "💌 Envía mensaje anónimo. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".anonmsg [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "binary",
          "aliases": [
            "binary"
          ],
          "category": "utils",
          "short": "0️⃣ Convierte texto a binario.",
          "detail": "0️⃣ Convierte texto a binario. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".binary [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "calc",
          "aliases": [
            "calc",
            "calcular",
            "math",
            "mates",
            "resp",
            "mathextremo",
            "mathextreme",
            "calculadora"
          ],
          "category": "utils",
          "short": "🧮 Resuelve cálculos.",
          "detail": "🧮 Resuelve cálculos. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".calc [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "count",
          "aliases": [
            "count",
            "mensajes",
            "messages",
            "msgcount"
          ],
          "category": "utils",
          "short": "🔢 Cuenta caracteres, palabras o texto.",
          "detail": "🔢 Cuenta caracteres, palabras o texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".count [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "decrypt",
          "aliases": [
            "decrypt"
          ],
          "category": "utils",
          "short": "🔓 Desencripta texto.",
          "detail": "🔓 Desencripta texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".decrypt [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "demorse",
          "aliases": [
            "demorse"
          ],
          "category": "utils",
          "short": "🔡 Convierte Morse a texto.",
          "detail": "🔡 Convierte Morse a texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".demorse [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "encrypt",
          "aliases": [
            "encrypt"
          ],
          "category": "utils",
          "short": "🔐 Encripta texto.",
          "detail": "🔐 Encripta texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".encrypt [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "fancy",
          "aliases": [
            "fancy"
          ],
          "category": "utils",
          "short": "✨ Genera texto decorado.",
          "detail": "✨ Genera texto decorado. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".fancy [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "get",
          "aliases": [
            "get",
            "fetch"
          ],
          "category": "utils",
          "short": "🌐 Obtiene contenido desde una URL.",
          "detail": "🌐 Obtiene contenido desde una URL. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".get [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "gitclone",
          "aliases": [
            "gitclone",
            "git"
          ],
          "category": "utils",
          "short": "🧬 Clona o descarga repositorios.",
          "detail": "🧬 Clona o descarga repositorios. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".gitclone [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "hd",
          "aliases": [
            "hd",
            "enhance",
            "remini"
          ],
          "category": "utils",
          "short": "✨ Mejora calidad de imagen.",
          "detail": "✨ Mejora calidad de imagen. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".hd [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "historialcmd",
          "aliases": [
            "historialcmd",
            "cmdhistory"
          ],
          "category": "utils",
          "short": "🕘 Muestra historial de comandos.",
          "detail": "🕘 Muestra historial de comandos. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".historialcmd [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "ia",
          "aliases": [
            "ia",
            "chatgpt"
          ],
          "category": "utils",
          "short": "🤖 Consulta inteligencia artificial. Tiene cooldown de 3 minutos.",
          "detail": "🤖 Consulta inteligencia artificial. Tiene cooldown de 3 minutos. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ia [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "inspect",
          "aliases": [
            "inspect",
            "inspeccionar"
          ],
          "category": "utils",
          "short": "🔎 Inspecciona enlaces o recursos.",
          "detail": "🔎 Inspecciona enlaces o recursos. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".inspect [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "log",
          "aliases": [
            "log",
            "logs"
          ],
          "category": "utils",
          "short": "📄 Muestra registros del sistema.",
          "detail": "📄 Muestra registros del sistema. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".log [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "mirror",
          "aliases": [
            "mirror"
          ],
          "category": "utils",
          "short": "🪞 Convierte texto a efecto espejo.",
          "detail": "🪞 Convierte texto a efecto espejo. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".mirror [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "morse",
          "aliases": [
            "morse",
            "demorse",
            "binary",
            "unbinary",
            "encrypt",
            "decrypt",
            "reverse",
            "mirror",
            "fancy",
            "count",
            "random",
            "format"
          ],
          "category": "utils",
          "short": "🔠 Convierte texto a código Morse.",
          "detail": "🔠 Convierte texto a código Morse. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".morse [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "pfp",
          "aliases": [
            "pfp",
            "getpic"
          ],
          "category": "utils",
          "short": "🖼️ Obtiene foto de perfil.",
          "detail": "🖼️ Obtiene foto de perfil. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".pfp [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "ping",
          "aliases": [
            "ping",
            "p"
          ],
          "category": "utils",
          "short": "🏓 Mide la latencia del bot.",
          "detail": "🏓 Mide la latencia del bot. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ping [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "readviewonce",
          "aliases": [
            "readviewonce",
            "read",
            "readvo"
          ],
          "category": "utils",
          "short": "📖 Lee contenido de una sola vista.",
          "detail": "📖 Lee contenido de una sola vista. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".readviewonce [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "resumen",
          "aliases": [
            "resumen"
          ],
          "category": "utils",
          "short": "📚 Resume textos largos.",
          "detail": "📚 Resume textos largos. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".resumen [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "reverse",
          "aliases": [
            "reverse"
          ],
          "category": "utils",
          "short": "🔄 Invierte texto.",
          "detail": "🔄 Invierte texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".reverse [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "say",
          "aliases": [
            "say",
            "decir"
          ],
          "category": "utils",
          "short": "🗣️ Hace que el bot repita un texto.",
          "detail": "🗣️ Hace que el bot repita un texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".say [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "ssweb",
          "aliases": [
            "ssweb",
            "ss"
          ],
          "category": "utils",
          "short": "🌐 Toma captura de una página web.",
          "detail": "🌐 Toma captura de una página web. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ssweb [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "toimg",
          "aliases": [
            "toimg",
            "toimage"
          ],
          "category": "utils",
          "short": "🖼️ Convierte sticker a imagen.",
          "detail": "🖼️ Convierte sticker a imagen. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".toimg [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "topcmd",
          "aliases": [
            "topcmd",
            "topcommands"
          ],
          "category": "utils",
          "short": "📊 Muestra comandos más usados.",
          "detail": "📊 Muestra comandos más usados. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".topcmd [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "tourl",
          "aliases": [
            "tourl"
          ],
          "category": "utils",
          "short": "🔗 Convierte multimedia en enlace.",
          "detail": "🔗 Convierte multimedia en enlace. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".tourl [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "translate",
          "aliases": [
            "translate",
            "trad",
            "traducir"
          ],
          "category": "utils",
          "short": "🌍 Traduce textos.",
          "detail": "🌍 Traduce textos. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".translate [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "unbinary",
          "aliases": [
            "unbinary"
          ],
          "category": "utils",
          "short": "1️⃣ Convierte binario a texto.",
          "detail": "1️⃣ Convierte binario a texto. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".unbinary [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        },
        {
          "name": "uptime",
          "aliases": [
            "uptime",
            "runtime"
          ],
          "category": "utils",
          "short": "⏱️ Muestra cuánto tiempo lleva activo el bot.",
          "detail": "⏱️ Muestra cuánto tiempo lleva activo el bot. Es una herramienta práctica de productividad: texto, IA, enlaces, multimedia, traducción, conversiones o diagnóstico del sistema. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".uptime [texto, enlace o archivo respondido]",
          "tip": "Aprovecha respuestas a mensajes: muchos comandos entienden texto citado, multimedia o enlaces.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "sockets",
      "title": "Sockets",
      "icon": "🔐",
      "color": "#a78bfa",
      "intro": "Funciones para subbots, sesiones, conexión, identidad visual y configuración de sockets.",
      "commands": [
        {
          "name": "bots",
          "aliases": [
            "bots",
            "sockets"
          ],
          "category": "sockets",
          "short": "🤖 Muestra subbots activos.",
          "detail": "🤖 Muestra subbots activos. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bots [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "join",
          "aliases": [
            "join",
            "unir"
          ],
          "category": "sockets",
          "short": "🔗 Hace que el socket entre a un grupo.",
          "detail": "🔗 Hace que el socket entre a un grupo. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".join [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "leave",
          "aliases": [
            "leave"
          ],
          "category": "sockets",
          "short": "🚪 Hace que el socket salga del grupo.",
          "detail": "🚪 Hace que el socket salga del grupo. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".leave [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "logout",
          "aliases": [
            "logout"
          ],
          "category": "sockets",
          "short": "🔌 Cierra sesión del socket.",
          "detail": "🔌 Cierra sesión del socket. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".logout [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "reload",
          "aliases": [
            "reload"
          ],
          "category": "sockets",
          "short": "♻️ Recarga el socket o sistema.",
          "detail": "♻️ Recarga el socket o sistema. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".reload [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "self",
          "aliases": [
            "self"
          ],
          "category": "sockets",
          "short": "🔒 Activa o desactiva modo privado.",
          "detail": "🔒 Activa o desactiva modo privado. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".self [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setbanner",
          "aliases": [
            "setbanner",
            "setbotbanner"
          ],
          "category": "sockets",
          "short": "🖼️ Cambia el banner del bot.",
          "detail": "🖼️ Cambia el banner del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setbanner [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setchannel",
          "aliases": [
            "setchannel",
            "setbotchannel"
          ],
          "category": "sockets",
          "short": "📢 Cambia el canal del bot.",
          "detail": "📢 Cambia el canal del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setchannel [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setcurrency",
          "aliases": [
            "setcurrency",
            "setbotcurrency"
          ],
          "category": "sockets",
          "short": "💰 Cambia el nombre de la moneda.",
          "detail": "💰 Cambia el nombre de la moneda. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setcurrency [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "seticon",
          "aliases": [
            "seticon",
            "setboticon"
          ],
          "category": "sockets",
          "short": "🧩 Cambia el ícono del bot.",
          "detail": "🧩 Cambia el ícono del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".seticon [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setlink",
          "aliases": [
            "setlink",
            "setbotlink"
          ],
          "category": "sockets",
          "short": "🔗 Cambia el enlace del bot.",
          "detail": "🔗 Cambia el enlace del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setlink [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setname",
          "aliases": [
            "setname",
            "setbotname"
          ],
          "category": "sockets",
          "short": "📝 Cambia el nombre del bot.",
          "detail": "📝 Cambia el nombre del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setname [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setpfp",
          "aliases": [
            "setpfp",
            "setimage"
          ],
          "category": "sockets",
          "short": "🖼️ Cambia foto de perfil.",
          "detail": "🖼️ Cambia foto de perfil. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setpfp [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setprefix",
          "aliases": [
            "setprefix",
            "setbotprefix"
          ],
          "category": "sockets",
          "short": "🔤 Cambia el prefijo del bot.",
          "detail": "🔤 Cambia el prefijo del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setprefix [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setstatus",
          "aliases": [
            "setstatus"
          ],
          "category": "sockets",
          "short": "📊 Cambia el estado del bot.",
          "detail": "📊 Cambia el estado del bot. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setstatus [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        },
        {
          "name": "setusername",
          "aliases": [
            "setusername"
          ],
          "category": "sockets",
          "short": "👤 Cambia el usuario o nombre visible.",
          "detail": "👤 Cambia el usuario o nombre visible. Sirve para manejar conexiones, subbots o detalles de identidad del sistema cuando el bot trabaja con sesiones múltiples. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".setusername [opción de conexión]",
          "tip": "Estos comandos pueden afectar sesiones o identidad del bot; conviene usarlos con calma y leer la respuesta.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "anime",
      "title": "Anime",
      "icon": "🌌",
      "color": "#c084fc",
      "intro": "Imágenes anime, parejas de perfil y extras visuales relacionados con el estilo anime.",
      "commands": [
        {
          "name": "follaragordo",
          "aliases": [
            "follaragordo"
          ],
          "category": "anime",
          "short": "🔞 Comando extra anime.",
          "detail": "🔞 Comando extra anime. Entrega contenido visual anime o extras de estilo, ideal para grupos que disfrutan estética, parejas de perfil y contenido ligero. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".follaragordo [opcional: usuario o búsqueda]",
          "tip": "Ideal para dinamizar el chat con contenido visual ligero.",
          "source": "menu"
        },
        {
          "name": "neko",
          "aliases": [
            "neko"
          ],
          "category": "anime",
          "short": "🐱 Muestra imagen anime de neko.",
          "detail": "🐱 Muestra imagen anime de neko. Entrega contenido visual anime o extras de estilo, ideal para grupos que disfrutan estética, parejas de perfil y contenido ligero. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".neko [opcional: usuario o búsqueda]",
          "tip": "Ideal para dinamizar el chat con contenido visual ligero.",
          "source": "menu"
        },
        {
          "name": "ppcouple",
          "aliases": [
            "ppcouple",
            "ppcp"
          ],
          "category": "anime",
          "short": "💞 Envía imágenes de perfil para parejas.",
          "detail": "💞 Envía imágenes de perfil para parejas. Entrega contenido visual anime o extras de estilo, ideal para grupos que disfrutan estética, parejas de perfil y contenido ligero. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".ppcouple [opcional: usuario o búsqueda]",
          "tip": "Ideal para dinamizar el chat con contenido visual ligero.",
          "source": "menu"
        },
        {
          "name": "waifu",
          "aliases": [
            "waifu",
            "neko"
          ],
          "category": "anime",
          "short": "🌸 Muestra imagen anime de waifu.",
          "detail": "🌸 Muestra imagen anime de waifu. Entrega contenido visual anime o extras de estilo, ideal para grupos que disfrutan estética, parejas de perfil y contenido ligero. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".waifu [opcional: usuario o búsqueda]",
          "tip": "Ideal para dinamizar el chat con contenido visual ligero.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "interacciones",
      "title": "Interacciones",
      "icon": "💞",
      "color": "#ff7ad9",
      "intro": "Acciones sociales, emociones, gestos, convivencia, roleplay suave y respuestas visuales.",
      "commands": [
        {
          "name": "angry",
          "aliases": [
            "angry",
            "enojado",
            "enojada",
            "enojo",
            "furioso",
            "furiosa",
            "enfado"
          ],
          "category": "interacciones",
          "short": "😡 Muestra enojo.",
          "detail": "😡 Muestra enojo. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".angry @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "bath",
          "aliases": [
            "bath",
            "bañarse",
            "baño"
          ],
          "category": "interacciones",
          "short": "🛁 Se baña.",
          "detail": "🛁 Se baña. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bath @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "bite",
          "aliases": [
            "bite",
            "morder",
            "mordida"
          ],
          "category": "interacciones",
          "short": "🦷 Muerde ficticiamente.",
          "detail": "🦷 Muerde ficticiamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bite @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "bleh",
          "aliases": [
            "bleh",
            "lengua",
            "mueca",
            "muecalengua"
          ],
          "category": "interacciones",
          "short": "😛 Saca la lengua.",
          "detail": "😛 Saca la lengua. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bleh @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "blowkiss",
          "aliases": [
            "blowkiss",
            "besito",
            "besoaire"
          ],
          "category": "interacciones",
          "short": "😘 Lanza un beso.",
          "detail": "😘 Lanza un beso. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".blowkiss @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "blush",
          "aliases": [
            "blush",
            "sonrojarse",
            "sonrojo",
            "sonrojado",
            "sonrojada"
          ],
          "category": "interacciones",
          "short": "😊 Muestra sonrojo.",
          "detail": "😊 Muestra sonrojo. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".blush @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "bonk",
          "aliases": [
            "bonk",
            "golpe",
            "coscorrón",
            "coscorron"
          ],
          "category": "interacciones",
          "short": "🔨 Da un bonk.",
          "detail": "🔨 Da un bonk. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bonk @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "bored",
          "aliases": [
            "bored",
            "aburrido",
            "aburrida",
            "aburrimiento"
          ],
          "category": "interacciones",
          "short": "🥱 Muestra aburrimiento.",
          "detail": "🥱 Muestra aburrimiento. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bored @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "bully",
          "aliases": [
            "bully",
            "molestar",
            "bullying"
          ],
          "category": "interacciones",
          "short": "😈 Molesta a otro usuario.",
          "detail": "😈 Molesta a otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bully @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "call",
          "aliases": [
            "call",
            "llamar",
            "llamada"
          ],
          "category": "interacciones",
          "short": "📞 Llama.",
          "detail": "📞 Llama. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".call @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "clap",
          "aliases": [
            "clap",
            "aplaudir",
            "aplauso",
            "aplausos"
          ],
          "category": "interacciones",
          "short": "👏 Aplaude.",
          "detail": "👏 Aplaude. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".clap @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "coffee",
          "aliases": [
            "coffee",
            "cafe",
            "cafecito"
          ],
          "category": "interacciones",
          "short": "☕ Toma café.",
          "detail": "☕ Toma café. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".coffee @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "cold",
          "aliases": [
            "cold",
            "frio",
            "fria"
          ],
          "category": "interacciones",
          "short": "🥶 Muestra frío.",
          "detail": "🥶 Muestra frío. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cold @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "comfort",
          "aliases": [
            "comfort",
            "consolar",
            "consuelo"
          ],
          "category": "interacciones",
          "short": "🫂 Consuela a otro usuario.",
          "detail": "🫂 Consuela a otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".comfort @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "cringe",
          "aliases": [
            "cringe",
            "penaajena"
          ],
          "category": "interacciones",
          "short": "😬 Muestra cringe.",
          "detail": "😬 Muestra cringe. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cringe @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "cry",
          "aliases": [
            "cry",
            "llorar",
            "llanto"
          ],
          "category": "interacciones",
          "short": "😭 Muestra llanto.",
          "detail": "😭 Muestra llanto. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cry @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "cuddle",
          "aliases": [
            "cuddle",
            "acurrucar"
          ],
          "category": "interacciones",
          "short": "🤗 Se acurruca con otro usuario.",
          "detail": "🤗 Se acurruca con otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cuddle @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "curious",
          "aliases": [
            "curious",
            "curioso",
            "curiosa",
            "curiosidad"
          ],
          "category": "interacciones",
          "short": "🧐 Muestra curiosidad.",
          "detail": "🧐 Muestra curiosidad. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".curious @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "dance",
          "aliases": [
            "dance",
            "bailar",
            "baile"
          ],
          "category": "interacciones",
          "short": "💃 Baila.",
          "detail": "💃 Baila. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".dance @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "dramatic",
          "aliases": [
            "dramatic",
            "drama",
            "dramatico",
            "dramatica"
          ],
          "category": "interacciones",
          "short": "🎭 Hace una reacción dramática.",
          "detail": "🎭 Hace una reacción dramática. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".dramatic @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "draw",
          "aliases": [
            "draw",
            "dibujar",
            "dibujo"
          ],
          "category": "interacciones",
          "short": "🎨 Dibuja.",
          "detail": "🎨 Dibuja. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".draw @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "drunk",
          "aliases": [
            "drunk",
            "borracho",
            "borracha",
            "ebrio",
            "ebria"
          ],
          "category": "interacciones",
          "short": "🍻 Muestra estado ebrio.",
          "detail": "🍻 Muestra estado ebrio. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".drunk @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "eat",
          "aliases": [
            "eat",
            "nom",
            "comer",
            "comida"
          ],
          "category": "interacciones",
          "short": "🍽️ Come.",
          "detail": "🍽️ Come. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".eat @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "gaming",
          "aliases": [
            "gaming",
            "jugar",
            "gamer",
            "juego"
          ],
          "category": "interacciones",
          "short": "🎮 Juega.",
          "detail": "🎮 Juega. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".gaming @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "handhold",
          "aliases": [
            "handhold",
            "tomar",
            "mano",
            "agarrarmano"
          ],
          "category": "interacciones",
          "short": "🤝 Toma la mano de otro usuario.",
          "detail": "🤝 Toma la mano de otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".handhold @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "happy",
          "aliases": [
            "happy",
            "feliz",
            "alegre",
            "felicidad"
          ],
          "category": "interacciones",
          "short": "😄 Muestra felicidad.",
          "detail": "😄 Muestra felicidad. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".happy @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "heat",
          "aliases": [
            "heat",
            "calor"
          ],
          "category": "interacciones",
          "short": "🥵 Muestra calor.",
          "detail": "🥵 Muestra calor. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".heat @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "highfive",
          "aliases": [
            "highfive",
            "choca",
            "chocar",
            "cinco"
          ],
          "category": "interacciones",
          "short": "🙌 Choca los cinco.",
          "detail": "🙌 Choca los cinco. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".highfive @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "hug",
          "aliases": [
            "hug",
            "abrazar",
            "abrazo"
          ],
          "category": "interacciones",
          "short": "🫂 Abraza a otro usuario.",
          "detail": "🫂 Abraza a otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".hug @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "impregnate",
          "aliases": [
            "impregnate",
            "preg",
            "preñar",
            "embarazar"
          ],
          "category": "interacciones",
          "short": "🤰 Acción especial de interacción.",
          "detail": "🤰 Acción especial de interacción. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".impregnate @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "jump",
          "aliases": [
            "jump",
            "saltar",
            "salto"
          ],
          "category": "interacciones",
          "short": "🦘 Salta.",
          "detail": "🦘 Salta. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".jump @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "kill",
          "aliases": [
            "kill",
            "matar",
            "asesinar"
          ],
          "category": "interacciones",
          "short": "🔪 Acción ficticia de ataque.",
          "detail": "🔪 Acción ficticia de ataque. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kill @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "kiss",
          "aliases": [
            "kiss",
            "muak",
            "besaroca"
          ],
          "category": "interacciones",
          "short": "💋 Besa a otro usuario.",
          "detail": "💋 Besa a otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kiss @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "kisscheek",
          "aliases": [
            "kisscheek",
            "beso",
            "besar",
            "mejilla",
            "cachete",
            "besomejilla"
          ],
          "category": "interacciones",
          "short": "😘 Da un beso en la mejilla.",
          "detail": "😘 Da un beso en la mejilla. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".kisscheek @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "laugh",
          "aliases": [
            "laugh",
            "laught",
            "laugth",
            "laguht",
            "risa",
            "reir",
            "reirse",
            "jaja"
          ],
          "category": "interacciones",
          "short": "😂 Muestra risa.",
          "detail": "😂 Muestra risa. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".laugh @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "lick",
          "aliases": [
            "lick",
            "lamer",
            "lamida"
          ],
          "category": "interacciones",
          "short": "👅 Lame de forma ficticia.",
          "detail": "👅 Lame de forma ficticia. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".lick @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "love",
          "aliases": [
            "love",
            "amor",
            "amar",
            "enamorar"
          ],
          "category": "interacciones",
          "short": "❤️ Muestra cariño.",
          "detail": "❤️ Muestra cariño. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".love @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "nope",
          "aliases": [
            "nope",
            "no",
            "nop"
          ],
          "category": "interacciones",
          "short": "🙅 Niega algo.",
          "detail": "🙅 Niega algo. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".nope @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "pat",
          "aliases": [
            "pat",
            "acariciar",
            "palmadita"
          ],
          "category": "interacciones",
          "short": "👋 Acaricia a otro usuario.",
          "detail": "👋 Acaricia a otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".pat @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "peek",
          "aliases": [
            "peek",
            "espiar",
            "miraroculto"
          ],
          "category": "interacciones",
          "short": "👀 Mira de forma curiosa.",
          "detail": "👀 Mira de forma curiosa. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".peek @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "pout",
          "aliases": [
            "pout",
            "puchero",
            "pucheros"
          ],
          "category": "interacciones",
          "short": "😗 Muestra puchero.",
          "detail": "😗 Muestra puchero. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".pout @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "punch",
          "aliases": [
            "punch",
            "golpear",
            "puñete",
            "puñetazo"
          ],
          "category": "interacciones",
          "short": "👊 Golpea de forma ficticia.",
          "detail": "👊 Golpea de forma ficticia. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".punch @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "push",
          "aliases": [
            "push",
            "empujar",
            "empujon"
          ],
          "category": "interacciones",
          "short": "🖐️ Empuja a otro usuario.",
          "detail": "🖐️ Empuja a otro usuario. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".push @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "run",
          "aliases": [
            "run",
            "correr",
            "huir",
            "escapar"
          ],
          "category": "interacciones",
          "short": "🏃 Corre.",
          "detail": "🏃 Corre. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".run @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "sad",
          "aliases": [
            "sad",
            "triste",
            "tristeza"
          ],
          "category": "interacciones",
          "short": "😔 Muestra tristeza.",
          "detail": "😔 Muestra tristeza. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sad @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "scared",
          "aliases": [
            "scared",
            "asustado",
            "asustada",
            "miedo"
          ],
          "category": "interacciones",
          "short": "😨 Muestra miedo.",
          "detail": "😨 Muestra miedo. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".scared @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "scream",
          "aliases": [
            "scream",
            "gritar",
            "grito"
          ],
          "category": "interacciones",
          "short": "😱 Grita.",
          "detail": "😱 Grita. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".scream @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "seduce",
          "aliases": [
            "seduce",
            "seducir",
            "seductor",
            "seductora"
          ],
          "category": "interacciones",
          "short": "🔥 Seducción ficticia.",
          "detail": "🔥 Seducción ficticia. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".seduce @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "shy",
          "aliases": [
            "shy",
            "timido",
            "timida",
            "verguenza"
          ],
          "category": "interacciones",
          "short": "😳 Muestra timidez.",
          "detail": "😳 Muestra timidez. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".shy @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "sing",
          "aliases": [
            "sing",
            "cantar",
            "cancion"
          ],
          "category": "interacciones",
          "short": "🎤 Canta.",
          "detail": "🎤 Canta. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sing @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "slap",
          "aliases": [
            "slap",
            "bofetada",
            "cachetada"
          ],
          "category": "interacciones",
          "short": "🖐️ Da una bofetada ficticia.",
          "detail": "🖐️ Da una bofetada ficticia. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".slap @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "sleep",
          "aliases": [
            "sleep",
            "dormir",
            "duerme",
            "sueño"
          ],
          "category": "interacciones",
          "short": "😴 Duerme.",
          "detail": "😴 Duerme. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sleep @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "smile",
          "aliases": [
            "smile",
            "sonreir",
            "sonrisa"
          ],
          "category": "interacciones",
          "short": "😊 Muestra sonrisa.",
          "detail": "😊 Muestra sonrisa. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".smile @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "smoke",
          "aliases": [
            "smoke",
            "fumar",
            "fumando"
          ],
          "category": "interacciones",
          "short": "🚬 Fuma ficticiamente.",
          "detail": "🚬 Fuma ficticiamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".smoke @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "smug",
          "aliases": [
            "smug",
            "presumir",
            "presumido",
            "presumida"
          ],
          "category": "interacciones",
          "short": "😏 Muestra actitud presumida.",
          "detail": "😏 Muestra actitud presumida. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".smug @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "sniff",
          "aliases": [
            "sniff",
            "oler",
            "olfatear"
          ],
          "category": "interacciones",
          "short": "👃 Huele ficticiamente.",
          "detail": "👃 Huele ficticiamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sniff @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "snuggle",
          "aliases": [
            "snuggle",
            "acurrucarse"
          ],
          "category": "interacciones",
          "short": "🤗 Se arrima cariñosamente.",
          "detail": "🤗 Se arrima cariñosamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".snuggle @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "spit",
          "aliases": [
            "spit",
            "escupir",
            "escupirle"
          ],
          "category": "interacciones",
          "short": "💦 Escupe ficticiamente.",
          "detail": "💦 Escupe ficticiamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".spit @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "stare",
          "aliases": [
            "stare",
            "mirar",
            "mirada"
          ],
          "category": "interacciones",
          "short": "👁️ Mira fijamente.",
          "detail": "👁️ Mira fijamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".stare @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "step",
          "aliases": [
            "step",
            "pisar",
            "pisoton"
          ],
          "category": "interacciones",
          "short": "👣 Pisa ficticiamente.",
          "detail": "👣 Pisa ficticiamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".step @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "think",
          "aliases": [
            "think",
            "pensar",
            "pensando"
          ],
          "category": "interacciones",
          "short": "🤔 Muestra pensamiento.",
          "detail": "🤔 Muestra pensamiento. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".think @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "thinkhard",
          "aliases": [
            "thinkhard",
            "pensarprofundo",
            "reflexionar"
          ],
          "category": "interacciones",
          "short": "🤯 Piensa intensamente.",
          "detail": "🤯 Piensa intensamente. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".thinkhard @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "tickle",
          "aliases": [
            "tickle",
            "cosquillas"
          ],
          "category": "interacciones",
          "short": "🤭 Hace cosquillas.",
          "detail": "🤭 Hace cosquillas. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".tickle @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "trip",
          "aliases": [
            "trip",
            "tropezar",
            "tropiezo"
          ],
          "category": "interacciones",
          "short": "🦶 Hace tropezar.",
          "detail": "🦶 Hace tropezar. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".trip @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "walk",
          "aliases": [
            "walk",
            "caminar",
            "pasear"
          ],
          "category": "interacciones",
          "short": "🚶 Camina.",
          "detail": "🚶 Camina. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".walk @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "wave",
          "aliases": [
            "wave",
            "saludar",
            "saludo"
          ],
          "category": "interacciones",
          "short": "👋 Saluda.",
          "detail": "👋 Saluda. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".wave @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        },
        {
          "name": "wink",
          "aliases": [
            "wink",
            "guiñar",
            "guiño"
          ],
          "category": "interacciones",
          "short": "😉 Guiña el ojo.",
          "detail": "😉 Guiña el ojo. Genera acciones sociales y emocionales para que el chat se sienta más vivo, expresivo y divertido. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".wink @usuario",
          "tip": "Menciona a alguien para que la acción salga más natural y personalizada.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "reactions",
      "title": "Reacciones",
      "icon": "🎯",
      "color": "#60a5fa",
      "intro": "Sistema de reacciones comprables, equipables y coleccionables para personalizar el bot.",
      "commands": [
        {
          "name": "holabotones",
          "aliases": [
            "holabotones"
          ],
          "category": "reactions",
          "short": "Ejecuta el comando público “holabotones” dentro de la categoría Reacciones",
          "detail": "Ejecuta el comando público “holabotones” dentro de la categoría Reacciones. Permite que cada usuario compre, equipe o administre reacciones para darle personalidad a sus respuestas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".holabotones [list | buy | select | my | unequip]",
          "tip": "Compra primero, luego equipa tu reacción favorita para usarla cuando quieras.",
          "source": "cmds/reacts/holabotones.js"
        },
        {
          "name": "react",
          "aliases": [
            "react",
            "reacciones"
          ],
          "category": "reactions",
          "short": "🎯 Abre el sistema de reacciones.",
          "detail": "🎯 Abre el sistema de reacciones. Permite que cada usuario compre, equipe o administre reacciones para darle personalidad a sus respuestas. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".react [list | buy | select | my | unequip]",
          "tip": "Compra primero, luego equipa tu reacción favorita para usarla cuando quieras.",
          "source": "menu"
        }
      ]
    },
    {
      "id": "vip",
      "title": "VIP",
      "icon": "💎",
      "color": "#67e8f9",
      "intro": "Funciones especiales para usuarios VIP cuando el sistema está disponible.",
      "commands": [
        {
          "name": "vip",
          "aliases": [
            "vip",
            "vipstatus",
            "vipperfil",
            "vipbeneficios",
            "vipbonus",
            "vipstars",
            "viprank",
            "vipdaily",
            "vipcofre",
            "vipbox",
            "vipcooldowns",
            "vipshop",
            "vipreglas",
            "viprules",
            "reglasvip",
            "buyvip",
            "titulo",
            "deltitulo",
            "addvip",
            "addvipdays",
            "delvip",
            "vipinfo",
            "viplist",
            "vipcode",
            "redeem",
            "vipcodes",
            "vipcodeinfo",
            "delvipcode"
          ],
          "category": "vip",
          "short": "Ejecuta el comando público “vip” dentro de la categoría VIP",
          "detail": "Ejecuta el comando público “vip” dentro de la categoría VIP. Agrupa beneficios especiales cuando el sistema VIP está activo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".vip [opción VIP]",
          "tip": "Depende de que el sistema VIP esté activo para el usuario.",
          "source": "cmds/VIP/indexvip.js"
        },
        {
          "name": "vipmenu",
          "aliases": [
            "vipmenu",
            "menuvip"
          ],
          "category": "vip",
          "short": "Ejecuta el comando público “vipmenu” dentro de la categoría VIP",
          "detail": "Ejecuta el comando público “vipmenu” dentro de la categoría VIP. Agrupa beneficios especiales cuando el sistema VIP está activo. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".vipmenu [opción VIP]",
          "tip": "Depende de que el sistema VIP esté activo para el usuario.",
          "source": "cmds/VIP/vipmenu.js"
        }
      ]
    },
    {
      "id": "eventos",
      "title": "Eventos",
      "icon": "⚡",
      "color": "#f0abfc",
      "intro": "Eventos y paneles especiales del bot que no pertenecen a una categoría tradicional.",
      "commands": [
        {
          "name": "evento",
          "aliases": [
            "evento",
            "eventoglobal",
            "vipcraft"
          ],
          "category": "eventos",
          "short": "Ejecuta el comando público “evento” dentro de la categoría Eventos",
          "detail": "Ejecuta el comando público “evento” dentro de la categoría Eventos. Es un comando público detectado desde los archivos del bot y forma parte del flujo normal de uso. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".evento",
          "tip": "Revisa la respuesta del bot para conocer variantes, errores o requisitos especiales.",
          "source": "cmds/adminabuse/evento.js"
        }
      ]
    },
    {
      "id": "nsfw",
      "title": "NSFW",
      "icon": "🔞",
      "color": "#ff5c8a",
      "intro": "Comandos para grupos con contenido adulto activado. Se documentan con descripción moderada.",
      "commands": [
        {
          "name": "anal",
          "aliases": [
            "anal"
          ],
          "category": "nsfw",
          "short": "🍑 Ejecuta acción NSFW.",
          "detail": "🍑 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".anal [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "blowjob",
          "aliases": [
            "blowjob",
            "mamada",
            "bj"
          ],
          "category": "nsfw",
          "short": "💋 Ejecuta acción NSFW.",
          "detail": "💋 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".blowjob [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "bondage",
          "aliases": [
            "bondage"
          ],
          "category": "nsfw",
          "short": "⛓️ Ejecuta acción NSFW.",
          "detail": "⛓️ Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bondage [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "boobjob",
          "aliases": [
            "boobjob"
          ],
          "category": "nsfw",
          "short": "🍒 Ejecuta acción NSFW.",
          "detail": "🍒 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".boobjob [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "bukkake",
          "aliases": [
            "bukkake"
          ],
          "category": "nsfw",
          "short": "💦 Ejecuta acción NSFW.",
          "detail": "💦 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".bukkake [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "creampie",
          "aliases": [
            "creampie"
          ],
          "category": "nsfw",
          "short": "💦 Ejecuta acción NSFW.",
          "detail": "💦 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".creampie [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "cum",
          "aliases": [
            "cum"
          ],
          "category": "nsfw",
          "short": "💦 Ejecuta acción NSFW.",
          "detail": "💦 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cum [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "cummouth",
          "aliases": [
            "cummouth"
          ],
          "category": "nsfw",
          "short": "💦 Ejecuta acción NSFW.",
          "detail": "💦 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cummouth [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "cumshot",
          "aliases": [
            "cumshot"
          ],
          "category": "nsfw",
          "short": "💦 Ejecuta acción NSFW.",
          "detail": "💦 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".cumshot [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "danbooru",
          "aliases": [
            "danbooru",
            "dbooru"
          ],
          "category": "nsfw",
          "short": "🔎 Busca contenido NSFW en Danbooru.",
          "detail": "🔎 Busca contenido NSFW en Danbooru. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".danbooru [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "deepthroat",
          "aliases": [
            "deepthroat"
          ],
          "category": "nsfw",
          "short": "🔥 Ejecuta acción NSFW.",
          "detail": "🔥 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".deepthroat [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "facesitting",
          "aliases": [
            "facesitting"
          ],
          "category": "nsfw",
          "short": "🪑 Ejecuta acción NSFW.",
          "detail": "🪑 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".facesitting [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "fap",
          "aliases": [
            "fap",
            "paja"
          ],
          "category": "nsfw",
          "short": "✊ Ejecuta acción NSFW.",
          "detail": "✊ Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".fap [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "fingering",
          "aliases": [
            "fingering"
          ],
          "category": "nsfw",
          "short": "👉 Ejecuta acción NSFW.",
          "detail": "👉 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".fingering [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "footjob",
          "aliases": [
            "footjob"
          ],
          "category": "nsfw",
          "short": "🦶 Ejecuta acción NSFW.",
          "detail": "🦶 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".footjob [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "fuck",
          "aliases": [
            "fuck",
            "coger"
          ],
          "category": "nsfw",
          "short": "🔥 Ejecuta acción NSFW.",
          "detail": "🔥 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".fuck [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "futanari",
          "aliases": [
            "futanari",
            "futa"
          ],
          "category": "nsfw",
          "short": "🔞 Ejecuta acción NSFW.",
          "detail": "🔞 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".futanari [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "gelbooru",
          "aliases": [
            "gelbooru",
            "gbooru"
          ],
          "category": "nsfw",
          "short": "🔎 Busca contenido NSFW en Gelbooru.",
          "detail": "🔎 Busca contenido NSFW en Gelbooru. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".gelbooru [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "grabboobs",
          "aliases": [
            "grabboobs"
          ],
          "category": "nsfw",
          "short": "🍒 Ejecuta acción NSFW.",
          "detail": "🍒 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".grabboobs [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "grope",
          "aliases": [
            "grope"
          ],
          "category": "nsfw",
          "short": "🫳 Ejecuta acción NSFW.",
          "detail": "🫳 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".grope [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "handjob",
          "aliases": [
            "handjob"
          ],
          "category": "nsfw",
          "short": "✋ Ejecuta acción NSFW.",
          "detail": "✋ Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".handjob [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "lickass",
          "aliases": [
            "lickass"
          ],
          "category": "nsfw",
          "short": "👅 Ejecuta acción NSFW.",
          "detail": "👅 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".lickass [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "lickdick",
          "aliases": [
            "lickdick"
          ],
          "category": "nsfw",
          "short": "👅 Ejecuta acción NSFW.",
          "detail": "👅 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".lickdick [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "lickpussy",
          "aliases": [
            "lickpussy"
          ],
          "category": "nsfw",
          "short": "👅 Ejecuta acción NSFW.",
          "detail": "👅 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".lickpussy [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "orgy",
          "aliases": [
            "orgy",
            "orgia"
          ],
          "category": "nsfw",
          "short": "🎉 Ejecuta acción NSFW.",
          "detail": "🎉 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".orgy [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "pegging",
          "aliases": [
            "pegging"
          ],
          "category": "nsfw",
          "short": "🔥 Ejecuta acción NSFW.",
          "detail": "🔥 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".pegging [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "r34",
          "aliases": [
            "r34",
            "rule34",
            "rule"
          ],
          "category": "nsfw",
          "short": "🔎 Busca contenido en Rule34.",
          "detail": "🔎 Busca contenido en Rule34. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".r34 [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "sixnine",
          "aliases": [
            "sixnine",
            "69"
          ],
          "category": "nsfw",
          "short": "6️⃣9️⃣ Ejecuta acción NSFW.",
          "detail": "6️⃣9️⃣ Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".sixnine [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "spank",
          "aliases": [
            "spank",
            "nalgada"
          ],
          "category": "nsfw",
          "short": "🍑 Ejecuta acción NSFW.",
          "detail": "🍑 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".spank [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "squirt",
          "aliases": [
            "squirt",
            "squirting"
          ],
          "category": "nsfw",
          "short": "💦 Ejecuta acción NSFW.",
          "detail": "💦 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".squirt [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "suckboobs",
          "aliases": [
            "suckboobs"
          ],
          "category": "nsfw",
          "short": "🍒 Ejecuta acción NSFW.",
          "detail": "🍒 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".suckboobs [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "thighjob",
          "aliases": [
            "thighjob"
          ],
          "category": "nsfw",
          "short": "🦵 Ejecuta acción NSFW.",
          "detail": "🦵 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".thighjob [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "undress",
          "aliases": [
            "undress",
            "encuerar"
          ],
          "category": "nsfw",
          "short": "🔓 Ejecuta acción NSFW.",
          "detail": "🔓 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".undress [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "xnxx",
          "aliases": [
            "xnxx"
          ],
          "category": "nsfw",
          "short": "🎥 Busca o descarga contenido configurado.",
          "detail": "🎥 Busca o descarga contenido configurado. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".xnxx [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "xvideos",
          "aliases": [
            "xvideos"
          ],
          "category": "nsfw",
          "short": "🎥 Busca o descarga contenido configurado.",
          "detail": "🎥 Busca o descarga contenido configurado. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".xvideos [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "yaoi",
          "aliases": [
            "yaoi"
          ],
          "category": "nsfw",
          "short": "🌈 Ejecuta acción NSFW.",
          "detail": "🌈 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".yaoi [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        },
        {
          "name": "yuri",
          "aliases": [
            "yuri",
            "tijeras"
          ],
          "category": "nsfw",
          "short": "🌸 Ejecuta acción NSFW.",
          "detail": "🌸 Ejecuta acción NSFW. Solo debe usarse en grupos donde el contenido adulto esté permitido y activado; la página lo documenta de forma moderada por seguridad. En la práctica, el usuario lo llama con el prefijo del bot, revisa el resultado y puede combinarlo con menciones, respuestas o argumentos según el comando.",
          "usage": ".yuri [usuario o búsqueda]",
          "tip": "Debe usarse solo en grupos adecuados y con la función NSFW activada.",
          "source": "menu"
        }
      ]
    }
  ]
};
