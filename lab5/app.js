'use strict';

class Card {
  constructor({ id, name, cost, text, faction, icon, preset = true }) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.text = text;
    this.faction = faction;
    this.icon = icon;
    this.preset = preset;
  }

  set name(v) {
    if (!String(v).trim()) throw new Error('Введите название карты');
    this._name = String(v).trim();
  }
  get name() {
    return this._name;
  }

  set cost(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0 || n > 15) throw new Error('Стоимость: 0-15');
    this._cost = n;
  }
  get cost() {
    return this._cost;
  }

  set text(v) {
    if (String(v).trim().length < 5) throw new Error('Описание слишком короткое');
    this._text = String(v).trim();
  }
  get text() {
    return this._text;
  }

  set faction(v) {
    if (!String(v).trim()) throw new Error('Введите фракцию');
    this._faction = String(v).trim();
  }
  get faction() {
    return this._faction;
  }

  set icon(v) {
    if (!String(v).trim()) throw new Error('Введите символ');
    this._icon = String(v).trim();
  }
  get icon() {
    return this._icon;
  }

  get typeName() {
    return 'Карта';
  }

  get typeClass() {
    return 'base';
  }

  extraRows() {
    return '';
  }

  toHTML() {
    return `
      <article class="card card--${this.typeClass}">
        <header class="card__header">
          <div>
            <p class="card__type">${this.typeName}</p>
            <h3>${esc(this.name)}</h3>
          </div>
          <span class="card__cost">${this.cost}</span>
        </header>
        <p class="card__description">${esc(this.text)}</p>
        <ul class="card__meta">
          <li><strong>Фракция:</strong> ${esc(this.faction)}</li>
          ${this.extraRows()}
        </ul>
        <p class="card__symbol">${esc(this.icon)}</p>
      </article>
    `;
  }

  updateCommon(data) {
    this.name = data.name;
    this.cost = data.cost;
    this.text = data.text;
    this.faction = data.faction;
    this.icon = data.icon;
  }

  updateFromForm(data) {
    this.updateCommon(data);
  }
}

class UnitCard extends Card {
  constructor({ atk, hp, role, ...base }) {
    super(base);
    this.atk = atk;
    this.hp = hp;
    this.role = role;
  }

  set atk(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1 || n > 20) throw new Error('Атака: 1-20');
    this._atk = n;
  }
  get atk() {
    return this._atk;
  }

  set hp(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1 || n > 30) throw new Error('Здоровье: 1-30');
    this._hp = n;
  }
  get hp() {
    return this._hp;
  }

  set role(v) {
    if (!String(v).trim()) throw new Error('Введите роль');
    this._role = String(v).trim();
  }
  get role() {
    return this._role;
  }

  get typeName() {
    return 'Боевая единица';
  }

  get typeClass() {
    return 'unit';
  }

  extraRows() {
    return `<li><strong>Атака:</strong> ${this.atk}</li><li><strong>Здоровье:</strong> ${this.hp}</li><li><strong>Роль:</strong> ${esc(this.role)}</li>`;
  }

  updateFromForm(data) {
    this.updateCommon(data);
    this.atk = data.atk;
    this.hp = data.hp;
    this.role = data.role;
  }
}

class SpellCard extends Card {
  constructor({ power, school, target, ...base }) {
    super(base);
    this.power = power;
    this.school = school;
    this.target = target;
  }

  set power(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1 || n > 25) throw new Error('Сила: 1-25');
    this._power = n;
  }
  get power() {
    return this._power;
  }

  set school(v) {
    if (!String(v).trim()) throw new Error('Введите школу');
    this._school = String(v).trim();
  }
  get school() {
    return this._school;
  }

  set target(v) {
    if (!String(v).trim()) throw new Error('Введите цель');
    this._target = String(v).trim();
  }
  get target() {
    return this._target;
  }

  get typeName() {
    return 'Заклинание';
  }

  get typeClass() {
    return 'spell';
  }

  extraRows() {
    return `<li><strong>Сила:</strong> ${this.power}</li><li><strong>Школа:</strong> ${esc(this.school)}</li><li><strong>Цель:</strong> ${esc(this.target)}</li>`;
  }

  updateFromForm(data) {
    this.updateCommon(data);
    this.power = data.power;
    this.school = data.school;
    this.target = data.target;
  }
}

class RelicCard extends Card {
  constructor({ dur, charge, aura, ...base }) {
    super(base);
    this.dur = dur;
    this.charge = charge;
    this.aura = aura;
  }

  set dur(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1 || n > 20) throw new Error('Прочность: 1-20');
    this._dur = n;
  }
  get dur() {
    return this._dur;
  }

  set charge(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0 || n > 10) throw new Error('Заряд: 0-10');
    this._charge = n;
  }
  get charge() {
    return this._charge;
  }

  set aura(v) {
    if (!String(v).trim()) throw new Error('Введите ауру');
    this._aura = String(v).trim();
  }
  get aura() {
    return this._aura;
  }

  get typeName() {
    return 'Реликвия';
  }

  get typeClass() {
    return 'relic';
  }

  extraRows() {
    return `<li><strong>Прочность:</strong> ${this.dur}</li><li><strong>Заряд:</strong> ${this.charge}</li><li><strong>Аура:</strong> ${esc(this.aura)}</li>`;
  }

  updateFromForm(data) {
    this.updateCommon(data);
    this.dur = data.dur;
    this.charge = data.charge;
    this.aura = data.aura;
  }
}

const state = {
  edit: false,
  cards: [
    new UnitCard({ id: 1, name: 'Пепельный страж', cost: 2, text: 'При выходе даёт +1 к защите соседу.', faction: 'Искра', icon: '🛡️', atk: 3, hp: 4, role: 'Танк', preset: true }),
    new SpellCard({ id: 2, name: 'Огненный шар', cost: 3, text: 'Наносит 6 урона одной цели.', faction: 'Искра', icon: '🔥', power: 6, school: 'Огонь', target: 'Одна цель', preset: true }),
    new RelicCard({ id: 3, name: 'Компас охотника', cost: 2, text: 'Даёт 1 ресурс в начале хода.', faction: 'Механики', icon: '🧭', dur: 5, charge: 2, aura: 'Экономика', preset: true }),
    new UnitCard({ id: 4, name: 'Ночной клинок', cost: 1, text: 'После атаки открывает верх колоды.', faction: 'Туман', icon: '🗡️', atk: 2, hp: 2, role: 'Разведка', preset: true })
  ],
  blocks: [
    { id: 1, title: 'Идея колоды', text: 'Сначала дешёвые юниты, потом усиление заклинанием.' },
    { id: 2, title: 'План хода', text: 'Держать ресурс под реликвию и добивание.' }
  ],
  nextBlockId: 3
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  buildBody();
  bindEvents();
  render();
}

function buildBody() {
  document.body.innerHTML = `
    <header class="site-header">
      <div class="container header-layout">
        <div>
          <p class="subtitle">Лабораторная работа 5</p>
          <h1>Колода карточной игры</h1>
        </div>
        <div class="edit-toggle">
          <label for="edit-mode">Режим редактирования</label>
          <input id="edit-mode" type="checkbox" />
        </div>
      </div>
    </header>

    <main class="container page-main">
      <section class="panel" aria-labelledby="deck-title">
        <div class="panel-head">
          <h2 id="deck-title">Карты</h2>
          <p class="status status--idle" id="deck-status">Просмотр</p>
        </div>
        <div class="deck-grid" id="deck-grid"></div>
      </section>

      <section class="panel" aria-labelledby="blocks-title" id="blocks-section"></section>
    </main>

    <footer class="site-footer">
      <div class="container"><p>ЛР5 · КС-20</p></div>
    </footer>
  `;
}

function bindEvents() {
  document.body.addEventListener('change', (e) => {
    if (e.target.id === 'edit-mode') {
      state.edit = e.target.checked;
      render();
    }
  });

  document.body.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    e.preventDefault();

    if (form.dataset.action === 'save-card') saveCard(form);
    if (form.dataset.action === 'add-block') addBlock(form);
  });

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="remove-block"]');
    if (!btn) return;
    removeBlock(Number(btn.dataset.id));
  });
}

function render() {
  renderCards();
  renderBlocks();
  setStatus('deck-status', state.edit ? 'Редактирование включено' : 'Просмотр', state.edit ? 'editing' : 'idle');
}

function renderCards() {
  const root = document.getElementById('deck-grid');
  root.innerHTML = state.cards
    .map((card) => {
      const html = `<article class="deck-item">${card.toHTML()}${state.edit && card.preset ? cardForm(card) : ''}</article>`;
      return html;
    })
    .join('');
}

function renderBlocks() {
  const root = document.getElementById('blocks-section');
  const list = state.blocks
    .map((b) => {
      return `
        <article class="note-card">
          <h3>${esc(b.title)}</h3>
          <p>${esc(b.text)}</p>
          ${state.edit ? `<button type="button" class="button button--danger" data-action="remove-block" data-id="${b.id}">Удалить блок</button>` : ''}
        </article>
      `;
    })
    .join('');

  root.innerHTML = `
    <div class="panel-head">
      <h2 id="blocks-title">Доп. блоки</h2>
      <p class="status status--idle" id="blocks-status">${state.edit ? 'Можно добавлять и удалять блоки' : 'Только чтение'}</p>
    </div>
    <div class="notes-grid">${list || '<p class="empty">Блоков нет</p>'}</div>
    ${state.edit ? blockForm() : ''}
  `;
}

function saveCard(form) {
  if (!state.edit) return;

  const id = Number(form.dataset.id);
  const card = state.cards.find((c) => c.id === id && c.preset);
  if (!card) return;

  const data = dataFrom(form);
  try {
    card.updateFromForm(data);
    setStatus('deck-status', `Карта «${card.name}» сохранена`, 'success');
    renderCards();
  } catch (err) {
    setStatus('deck-status', err.message || 'Ошибка', 'error');
  }
}

function addBlock(form) {
  if (!state.edit) return;

  const title = val(form, 'title');
  const text = val(form, 'text');

  if (title.length < 3 || text.length < 5) {
    setStatus('blocks-status', 'Заполните поля нормально', 'error');
    return;
  }

  state.blocks.push({ id: state.nextBlockId++, title, text });
  form.reset();
  renderBlocks();
  setStatus('blocks-status', 'Блок добавлен', 'success');
}

function removeBlock(id) {
  if (!state.edit) return;
  state.blocks = state.blocks.filter((b) => b.id !== id);
  renderBlocks();
  setStatus('blocks-status', 'Блок удалён', 'success');
}

function setStatus(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `status status--${type}`;
  el.textContent = text;
}

function cardForm(card) {
  let extra = '';

  if (card instanceof UnitCard) {
    extra = `
      ${numField(card.id, 'atk', 'Атака', card.atk, 1, 20)}
      ${numField(card.id, 'hp', 'Здоровье', card.hp, 1, 30)}
      ${textField(card.id, 'role', 'Роль', card.role)}
    `;
  }

  if (card instanceof SpellCard) {
    extra = `
      ${numField(card.id, 'power', 'Сила', card.power, 1, 25)}
      ${textField(card.id, 'school', 'Школа', card.school)}
      ${textField(card.id, 'target', 'Цель', card.target)}
    `;
  }

  if (card instanceof RelicCard) {
    extra = `
      ${numField(card.id, 'dur', 'Прочность', card.dur, 1, 20)}
      ${numField(card.id, 'charge', 'Заряд', card.charge, 0, 10)}
      ${textField(card.id, 'aura', 'Аура', card.aura)}
    `;
  }

  return `
    <form class="card-form" data-action="save-card" data-id="${card.id}">
      ${textField(card.id, 'name', 'Название', card.name)}
      ${numField(card.id, 'cost', 'Стоимость', card.cost, 0, 15)}
      ${textField(card.id, 'faction', 'Фракция', card.faction)}
      ${textField(card.id, 'icon', 'Символ', card.icon)}
      ${textAreaField(card.id, 'text', 'Описание', card.text)}
      ${extra}
      <button type="submit" class="button">Сохранить карту</button>
    </form>
  `;
}

function blockForm() {
  return `
    <form class="note-form" data-action="add-block">
      <h3>Добавить блок</h3>
      <div class="field">
        <label for="block-title">Заголовок</label>
        <input id="block-title" name="title" type="text" maxlength="50" required />
      </div>
      <div class="field">
        <label for="block-text">Текст</label>
        <textarea id="block-text" name="text" rows="3" required></textarea>
      </div>
      <button type="submit" class="button">Добавить</button>
    </form>
  `;
}

function textField(id, name, label, value) {
  const inputId = `c-${id}-${name}`;
  return `
    <div class="field">
      <label for="${inputId}">${label}</label>
      <input id="${inputId}" name="${name}" type="text" value="${escAttr(value)}" required />
    </div>
  `;
}

function numField(id, name, label, value, min, max) {
  const inputId = `c-${id}-${name}`;
  return `
    <div class="field">
      <label for="${inputId}">${label}</label>
      <input id="${inputId}" name="${name}" type="number" min="${min}" max="${max}" value="${value}" required />
    </div>
  `;
}

function textAreaField(id, name, label, value) {
  const inputId = `c-${id}-${name}`;
  return `
    <div class="field">
      <label for="${inputId}">${label}</label>
      <textarea id="${inputId}" name="${name}" rows="2" required>${esc(value)}</textarea>
    </div>
  `;
}

function dataFrom(form) {
  const fd = new FormData(form);
  const data = {};
  for (const [k, v] of fd.entries()) data[k] = String(v).trim();
  return data;
}

function val(form, name) {
  return String(new FormData(form).get(name) || '').trim();
}

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escAttr(s) {
  return esc(s).replaceAll('"', '&quot;');
}
