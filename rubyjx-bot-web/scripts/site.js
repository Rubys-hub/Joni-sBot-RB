const data = window.RUBYJX_COMMAND_DATA;

const state = {
  query: '',
  category: 'all',
  sort: 'name'
};

const els = {
  heroStats: document.getElementById('heroStats'),
  terminalText: document.getElementById('terminalText'),
  categorySelect: document.getElementById('categorySelect'),
  categoryRail: document.getElementById('categoryRail'),
  searchInput: document.getElementById('searchInput'),
  sortSelect: document.getElementById('sortSelect'),
  resultLine: document.getElementById('resultLine'),
  commandsGrid: document.getElementById('commandsGrid')
};

init();

function init() {
  if (!data) {
    els.commandsGrid.innerHTML = '<p>No se pudo cargar el archivo de comandos.</p>';
    return;
  }

  hydrateHero();
  hydrateFilters();
  bindEvents();
  renderCommands();
}

function hydrateHero() {
  els.heroStats.innerHTML = `
    <span><b>${data.bot.publicCommands}</b> comandos públicos</span>
    <span><b>${data.bot.categories}</b> categorías</span>
    <span><b>Owner</b> oculto</span>
  `;

  const categoryLines = data.categories
    .slice(0, 8)
    .map((category) => `loaded ${category.commands.length.toString().padStart(3, '0')} :: ${category.title}`)
    .join('\n');

  els.terminalText.textContent = `RubyJX Bot v3.0
status: online
mode: public command index
owner commands: excluded
categories: ${data.bot.categories}
commands: ${data.bot.publicCommands}

${categoryLines}

panel.ready(true)`;
}

function hydrateFilters() {
  const options = [
    `<option value="all">Todas las categorías</option>`,
    ...data.categories.map((category) => `<option value="${escapeAttr(category.id)}">${category.icon} ${escapeHtml(category.title)} (${category.commands.length})</option>`)
  ];
  els.categorySelect.innerHTML = options.join('');

  els.categoryRail.innerHTML = [
    railButton('all', '✦', 'Todo', data.bot.publicCommands),
    ...data.categories.map((category) => railButton(category.id, category.icon, category.title, category.commands.length))
  ].join('');

  document.querySelectorAll('.cat-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.category = button.dataset.category;
      els.categorySelect.value = state.category;
      renderCommands();
    });
  });
}

function bindEvents() {
  els.searchInput.addEventListener('input', () => {
    state.query = els.searchInput.value.trim().toLowerCase();
    renderCommands();
  });

  els.categorySelect.addEventListener('change', () => {
    state.category = els.categorySelect.value;
    renderCommands();
  });

  els.sortSelect.addEventListener('change', () => {
    state.sort = els.sortSelect.value;
    renderCommands();
  });
}

function renderCommands() {
  const commands = getFilteredCommands();
  document.querySelectorAll('.cat-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === state.category);
  });

  const categoryLabel = state.category === 'all'
    ? 'todas las categorías'
    : getCategory(state.category)?.title || state.category;

  els.resultLine.textContent = `${commands.length} comandos encontrados en ${categoryLabel}.`;

  if (!commands.length) {
    els.commandsGrid.innerHTML = `<article class="command-card"><h3>No encontré resultados</h3><p>Prueba con otro nombre, alias o categoría. Ejemplos útiles: economía, racha, sticker, chatgpt, ban, waifu, react.</p></article>`;
    return;
  }

  els.commandsGrid.innerHTML = commands.map(commandCard).join('');
}

function getFilteredCommands() {
  const all = data.categories.flatMap((category) => {
    return category.commands.map((command) => ({ ...command, categoryMeta: category }));
  });

  const filtered = all.filter((command) => {
    const inCategory = state.category === 'all' || command.category === state.category;
    if (!inCategory) return false;
    if (!state.query) return true;

    const haystack = [
      command.name,
      command.short,
      command.detail,
      command.usage,
      command.tip,
      command.categoryMeta.title,
      ...(command.aliases || [])
    ].join(' ').toLowerCase();

    return haystack.includes(state.query);
  });

  filtered.sort((a, b) => {
    if (state.sort === 'aliases') return (b.aliases?.length || 0) - (a.aliases?.length || 0) || a.name.localeCompare(b.name, 'es');
    if (state.sort === 'category') return a.categoryMeta.title.localeCompare(b.categoryMeta.title, 'es') || a.name.localeCompare(b.name, 'es');
    return a.name.localeCompare(b.name, 'es');
  });

  return filtered;
}

function commandCard(command) {
  const meta = command.categoryMeta;
  const aliases = (command.aliases || []).filter((alias) => alias !== command.name);
  const aliasHtml = aliases.length
    ? `<div class="alias-list">${aliases.slice(0, 14).map((alias) => `<span>.${escapeHtml(alias)}</span>`).join('')}${aliases.length > 14 ? `<span>+${aliases.length - 14} más</span>` : ''}</div>`
    : `<div class="alias-list"><span>Sin aliases públicos detectados</span></div>`;

  return `
    <article class="command-card" style="--card-color:${escapeAttr(meta.color)}">
      <span class="category-label">${escapeHtml(meta.icon)} ${escapeHtml(meta.title)}</span>
      <h3>.${escapeHtml(command.name)}</h3>
      <p>${escapeHtml(command.detail)}</p>
      <code class="usage">${escapeHtml(command.usage)}</code>
      ${aliasHtml}
      <div class="tip"><strong>Consejo:</strong> ${escapeHtml(command.tip)}</div>
    </article>
  `;
}

function railButton(id, icon, title, count) {
  return `<button class="cat-btn ${id === state.category ? 'active' : ''}" data-category="${escapeAttr(id)}">${escapeHtml(icon)} ${escapeHtml(title)} · ${count}</button>`;
}

function getCategory(id) {
  return data.categories.find((category) => category.id === id);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}
