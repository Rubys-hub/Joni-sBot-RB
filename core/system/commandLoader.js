import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.comandos ||= new Map();
global.plugins ||= {};
global.commandsReady = false;
global.commandsLoading = false;
global.commandLoadInfo = {
  totalPlugins: 0,
  totalCommands: 0,
  failedPlugins: 0,
  slowPlugins: [],
  startedAt: 0,
  finishedAt: 0,
  durationMs: 0
};

const pluginCache = new Map();

const commandsFolder = path.join(__dirname, "../../cmds");
const menusFolder = path.join(__dirname, "../../menus");

let loadPromise = null;

function formatMs(ms = 0) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function isValidJsFile(file = "") {
  return file.endsWith(".js") && !file.endsWith(".off.js") && !file.includes(".bak");
}

function getPluginName(fullPath) {
  return path.basename(fullPath).replace(".js", "");
}

function getPluginId(fullPath) {
  const normalized = fullPath.replace(/\\/g, "/")
  const commandsBase = commandsFolder.replace(/\\/g, "/")
  const menusBase = menusFolder.replace(/\\/g, "/")

  let relative = normalized

  if (normalized.startsWith(commandsBase)) {
    relative = path.relative(commandsFolder, fullPath)
  } else if (normalized.startsWith(menusBase)) {
    relative = path.relative(menusFolder, fullPath)
  }

  return relative
    .replace(/\\/g, "/")
    .replace(/\.js$/, "")
}

function removePluginCommands(pluginId) {
  for (const [cmd, data] of global.comandos.entries()) {
    if (data.pluginId === pluginId) {
      global.comandos.delete(cmd)
    }
  }
}

function normalizeCommands(command) {
  if (!command) return [];
  return Array.isArray(command) ? command : [command];
}

function registerPlugin(fullPath, imported) {
const comando = imported.default;
const pluginName = getPluginName(fullPath);

const pluginId = getPluginId(fullPath);

removePluginCommands(pluginId);

  global.plugins[pluginName] = {
    ...imported,
    ...(comando || {}),
    default: comando,
    before: imported.before || comando?.before,
    after: imported.after || comando?.after,
    all: imported.all || comando?.all
  };

  if (!comando?.command || typeof comando.run !== "function") {
    return {
      pluginName,
      commands: 0
    };
  }

  const cmds = normalizeCommands(comando.command);

  for (const cmd of cmds) {
    if (!cmd) continue;

global.comandos.set(String(cmd).toLowerCase(), {
  pluginName,
  pluginId,
  run: comando.run,
      category: comando.category || "uncategorized",
      isOwner: comando.isOwner || false,
      isAdmin: comando.isAdmin || false,
      botAdmin: comando.botAdmin || false,
      before: imported.before || comando?.before || null,
      after: imported.after || comando?.after || null,
      info: comando.info || {}
    });
  }

  return {
    pluginName,
    commands: cmds.length
  };
}

async function importPlugin(fullPath, forceReload = false) {
  const stat = fs.statSync(fullPath);
  const mtime = stat.mtimeMs;
  const cached = pluginCache.get(fullPath);

  if (!forceReload && cached && cached.mtime === mtime) {
    return cached.imported;
  }

  const modulePath = `${pathToFileURL(path.resolve(fullPath)).href}?update=${Date.now()}`;
  const imported = await import(modulePath);

  pluginCache.set(fullPath, {
    mtime,
    imported
  });

  return imported;
}

function getAllJsFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    try {
      const stat = fs.lstatSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getAllJsFiles(fullPath));
        continue;
      }

      if (stat.isFile() && isValidJsFile(item)) {
        files.push(fullPath);
      }
    } catch (e) {
      console.log(chalk.red(`⚠ No se pudo leer: ${fullPath}`));
    }
  }

  return files;
}

async function loadPlugin(fullPath, forceReload = false) {
  const filename = path.basename(fullPath);
  const started = Date.now();

  try {
    const imported = await importPlugin(fullPath, forceReload);
    const result = registerPlugin(fullPath, imported);

    const duration = Date.now() - started;

    global.commandLoadInfo.totalPlugins += 1;
    global.commandLoadInfo.totalCommands += result.commands;

    if (duration >= 1500) {
      global.commandLoadInfo.slowPlugins.push({
        file: filename,
        ms: duration
      });

      console.log(chalk.yellow(`⚠ Plugin lento: ${filename} cargó en ${formatMs(duration)}`));
    } else {
      console.log(chalk.gray(`✓ ${filename} cargado en ${formatMs(duration)}`));
    }

    return true;
  } catch (e) {
    const duration = Date.now() - started;

    global.commandLoadInfo.failedPlugins += 1;

    console.error(
      chalk.red(`✗ Error en plugin ${filename} después de ${formatMs(duration)}:`),
      e
    );

    return false;
  }
}

async function loadFolder(folder) {
  const files = getAllJsFiles(folder);

  for (const file of files) {
    await loadPlugin(file, false);
  }
}

const debounceMap = new Map();

global.reload = async (_ev, fullPath) => {
  if (!fullPath || !isValidJsFile(fullPath)) return;

  if (debounceMap.has(fullPath)) {
    clearTimeout(debounceMap.get(fullPath));
  }

  debounceMap.set(
    fullPath,
    setTimeout(async () => {
      debounceMap.delete(fullPath);

      const filename = path.basename(fullPath);
      const pluginName = getPluginName(fullPath);
const pluginId = getPluginId(fullPath);
      if (!fs.existsSync(fullPath)) {
        console.log(chalk.yellow(`⚠ Plugin eliminado: ${filename}`));

        pluginCache.delete(fullPath);
removePluginCommands(pluginId);
delete global.plugins[pluginName];

        console.log(chalk.yellow(`⚠ Comandos eliminados del plugin: ${pluginName}`));
        return;
      }

      console.log(chalk.cyan(`⟳ Recargando plugin: ${filename}`));

      await loadPlugin(fullPath, true);

      console.log(chalk.green(`✓ Plugin recargado: ${filename}`));
    }, 400)
  );
};

Object.freeze(global.reload);

const watchers = [];

function startWatcher() {
  for (const watcher of watchers) {
    try {
      watcher.close();
    } catch {}
  }

  watchers.length = 0;

  function watchDir(dir) {
    if (!fs.existsSync(dir)) return;

    try {
      const watcher = fs.watch(dir, (event, filename) => {
        if (!filename || !isValidJsFile(filename)) return;

        const fullPath = path.join(dir, filename);
        global.reload(event, fullPath);
      });

      watchers.push(watcher);

      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);

        try {
          if (fs.lstatSync(full).isDirectory()) {
            watchDir(full);
          }
        } catch {}
      }
    } catch (e) {
      console.log(chalk.red(`⚠ No se pudo observar carpeta: ${dir}`));
    }
  }

  watchDir(commandsFolder);
  watchDir(menusFolder);
}

startWatcher();

export default async function loadAll() {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    global.commandsReady = false;
    global.commandsLoading = true;

    global.comandos = new Map();
    global.plugins = {};

    global.commandLoadInfo = {
      totalPlugins: 0,
      totalCommands: 0,
      failedPlugins: 0,
      slowPlugins: [],
      startedAt: Date.now(),
      finishedAt: 0,
      durationMs: 0
    };

    console.log(chalk.cyan("╭──────────────────────────────╮"));
    console.log(chalk.cyan("│  Cargando comandos del bot... │"));
    console.log(chalk.cyan("╰──────────────────────────────╯"));

    await loadFolder(commandsFolder);
    await loadFolder(menusFolder);

    global.commandLoadInfo.finishedAt = Date.now();
    global.commandLoadInfo.durationMs =
      global.commandLoadInfo.finishedAt - global.commandLoadInfo.startedAt;

    global.commandsReady = true;
    global.commandsLoading = false;

    console.log(chalk.green("╭──────────────────────────────╮"));
    console.log(chalk.green("│  Comandos cargados correctamente"));
    console.log(chalk.green(`│  Plugins: ${global.commandLoadInfo.totalPlugins}`));
    console.log(chalk.green(`│  Comandos: ${global.comandos.size}`));
    console.log(chalk.green(`│  Errores: ${global.commandLoadInfo.failedPlugins}`));
    console.log(chalk.green(`│  Tiempo: ${formatMs(global.commandLoadInfo.durationMs)}`));
    console.log(chalk.green("╰──────────────────────────────╯"));

    if (global.commandLoadInfo.slowPlugins.length) {
      console.log(chalk.yellow("⚠ Plugins lentos detectados:"));

      for (const item of global.commandLoadInfo.slowPlugins) {
        console.log(chalk.yellow(`- ${item.file}: ${formatMs(item.ms)}`));
      }
    }

    return true;
  })();

  return loadPromise;
}