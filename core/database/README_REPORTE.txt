RUBYJX DATABASE SPLIT REPORT
============================
Fecha: 15/5/2026, 11:42:15 p. m.
Entrada: C:\Users\lafam\JoniBot\core\database.json
Salida: C:\Users\lafam\JoniBot\core\database

ARCHIVOS GENERADOS
-----------------
users.json: 3628 usuarios globales
chats.json: 181 chats/grupos
stats.json: 176 chats con stats, 4099 usuarios con stats, 9674 registros por fecha
settings.json: 1 configuraciones
characters.json: 2971 personajes
stickerspack.json: 1 dueños/registros
logs.json: 33 chats con historial/logs movidos

ECONOMÍA
--------
Modo: both
both  = users.json tiene economía global SUMADA y chats.json conserva economía local por grupo.
global = users.json tiene economía global SUMADA y chats.json queda en 0, guardando copia local previa.
local = users.json conserva solo lo global existente y chats.json conserva economía local por grupo.
Total global users.coins: 4018616
Total global users.bank: 1e+37
Total local chats.users.coins: 4017491
Total local chats.users.bank: 1e+37
Usuarios con dinero global: 153
Registros locales con dinero en grupos: 202

MODO Y LIMPIEZA
--------------
Historial commandHistory/botLogs conservado dentro de chats: NO
Settings Yuki conservados: NO
Settings Yuki eliminados: 5216242255295@s.whatsapp.net

IMPORTANTE
----------
Este script NO modifica tu database original.
Crea una copia backup y genera JSON separados para RubyJX.
stats se mueve fuera de chats.users[*].stats hacia stats.json.
En modo both, tu economía funciona GLOBAL y también POR GRUPO.
