const panels = Array.from(document.querySelectorAll('.panel'));
const menuButtons = Array.from(document.querySelectorAll('.menu-btn'));
const logList = document.getElementById('log-list');

const countryForm = document.getElementById('country-form');
const countryInput = document.getElementById('country-input');
const countryStatus = document.getElementById('country-status');
const countryResult = document.getElementById('country-result');

const dogButton = document.getElementById('dog-btn');
const dogStatus = document.getElementById('dog-status');
const dogResult = document.getElementById('dog-result');

const postsLoadButton = document.getElementById('posts-load-btn');
const postCreateForm = document.getElementById('post-create-form');
const postPatchForm = document.getElementById('post-patch-form');
const postDeleteForm = document.getElementById('post-delete-form');
const postStatus = document.getElementById('post-status');
const postResponse = document.getElementById('post-response');

const ENDPOINTS = {
  countries: 'https://restcountries.com/v3.1/name/',
  dogs: 'https://dog.ceo/api/breeds/image/random',
  posts: 'https://jsonplaceholder.typicode.com/posts'
};

async function sendRequest(urlObject, data = {}, params = {}) {
  const method = urlObject.method || 'GET';
  const url = constructUrl(urlObject.path, params);
  const withBody = method !== 'GET' && method !== 'DELETE';
  const options = {
    method
  };

  if (withBody) {
    options.headers = getDefaultHeaders();
    options.body = JSON.stringify(data);
  }

  addLog(`${urlObject.operation}: отправка ${method}.`);

  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    const message = normalizeError(error);
    addLog(`${urlObject.operation}: ошибка сети (${message}).`);
    throw new Error(message);
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message = buildApiErrorMessage(responseBody, response.status);
    addLog(`${urlObject.operation}: ошибка (${message}).`);
    throw new Error(message);
  }

  addLog(`${urlObject.operation}: успешно.`);
  return responseBody;
}

function constructUrl(path, params = {}) {
  const url = new URL(path);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function getDefaultHeaders() {
  return {
    'Content-Type': 'application/json; charset=UTF-8'
  };
}

async function parseResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildApiErrorMessage(responseBody, status) {
  if (responseBody && typeof responseBody === 'object') {
    if (typeof responseBody.message === 'string' && responseBody.message) {
      return responseBody.message;
    }

    if (typeof responseBody.error === 'string' && responseBody.error) {
      return responseBody.error;
    }
  }

  return `HTTP ${status}`;
}

menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActivePanel(button.dataset.target || '');
  });
});

countryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const country = countryInput.value.trim();

  if (!country) {
    setStatus(countryStatus, 'warning', 'Введите название страны.');
    setPlaceholder(countryResult, 'Поиск не выполнен: пустой запрос.');
    addLog('REST Countries: пустой запрос (отклонено).');
    return;
  }

  setStatus(countryStatus, 'loading', 'Загрузка данных о стране...');
  setPlaceholder(countryResult, 'Идёт запрос к REST Countries API...');

  try {
    const data = await sendRequest(
      {
        path: `${ENDPOINTS.countries}${encodeURIComponent(country)}`,
        method: 'GET',
        operation: 'REST Countries GET'
      },
      {},
      { fields: 'name,capital,region,population,flags,cca2' }
    );

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Страна не найдена.');
    }

    renderCountries(data.slice(0, 4));
    setStatus(countryStatus, 'success', `Найдено стран: ${Math.min(data.length, 4)}.`);
  } catch (error) {
    const message = normalizeError(error);
    setStatus(countryStatus, 'error', `Ошибка: ${message}`);
    setPlaceholder(countryResult, 'Не удалось получить данные по стране.');
  }
});

dogButton.addEventListener('click', async () => {
  setStatus(dogStatus, 'loading', 'Загружается изображение...');
  setPlaceholder(dogResult, 'Идёт запрос к Dog CEO API...');

  try {
    const data = await sendRequest({
      path: ENDPOINTS.dogs,
      method: 'GET',
      operation: 'Dog API GET'
    });

    if (!data.message) {
      throw new Error('Некорректный ответ API.');
    }

    dogResult.innerHTML = `
      <figure>
        <img class="dog-image" src="${data.message}" alt="Случайная собака" loading="lazy" />
      </figure>
    `;

    setStatus(dogStatus, 'success', 'Изображение успешно получено.');
  } catch (error) {
    const message = normalizeError(error);
    setStatus(dogStatus, 'error', `Ошибка: ${message}`);
    setPlaceholder(dogResult, 'Не удалось загрузить изображение собаки.');
  }
});

postsLoadButton.addEventListener('click', async () => {
  setStatus(postStatus, 'loading', 'GET-запрос: загружаем список постов...');
  setPlaceholder(postResponse, 'Идёт запрос к JSONPlaceholder (GET)...');

  try {
    const posts = await sendRequest(
      {
        path: ENDPOINTS.posts,
        method: 'GET',
        operation: 'JSONPlaceholder GET'
      },
      {},
      { _limit: 5 }
    );

    renderPosts(posts);
    setStatus(postStatus, 'success', 'GET выполнен: 5 постов загружено.');
  } catch (error) {
    const message = normalizeError(error);
    setStatus(postStatus, 'error', `Ошибка GET: ${message}`);
    setPlaceholder(postResponse, 'Не удалось получить список постов.');
  }
});

postCreateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(postCreateForm);
  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '').trim();

  if (!title || !body) {
    setStatus(postStatus, 'warning', 'Для POST заполните заголовок и текст.');
    addLog('JSONPlaceholder POST: валидация не пройдена.');
    return;
  }

  setStatus(postStatus, 'loading', 'POST-запрос: создаём пост...');

  try {
    const createdPost = await sendRequest(
      {
        path: ENDPOINTS.posts,
        method: 'POST',
        operation: 'JSONPlaceholder POST'
      },
      { title, body, userId: 1 }
    );

    renderRawResponse('POST', createdPost);
    setStatus(postStatus, 'success', 'POST выполнен: пост создан (тестовый ответ сервиса).');
    postCreateForm.reset();
  } catch (error) {
    const message = normalizeError(error);
    setStatus(postStatus, 'error', `Ошибка POST: ${message}`);
    setPlaceholder(postResponse, 'Не удалось создать пост.');
  }
});

postPatchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(postPatchForm);
  const id = Number(formData.get('id'));
  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '').trim();

  if (!id) {
    setStatus(postStatus, 'warning', 'Для PATCH укажите корректный ID.');
    addLog('JSONPlaceholder PATCH: не указан ID.');
    return;
  }

  const payload = {};

  if (title) {
    payload.title = title;
  }

  if (body) {
    payload.body = body;
  }

  if (!payload.title && !payload.body) {
    setStatus(postStatus, 'warning', 'Для PATCH укажите хотя бы одно поле для обновления.');
    addLog('JSONPlaceholder PATCH: нет полей для изменения.');
    return;
  }

  setStatus(postStatus, 'loading', `PATCH-запрос: обновляем пост ${id}...`);

  try {
    const patchedPost = await sendRequest(
      {
        path: `${ENDPOINTS.posts}/${id}`,
        method: 'PATCH',
        operation: 'JSONPlaceholder PATCH'
      },
      payload
    );

    renderRawResponse('PATCH', patchedPost);
    setStatus(postStatus, 'success', `PATCH выполнен: пост ${id} обновлён (тестовый ответ сервиса).`);
    postPatchForm.reset();
  } catch (error) {
    const message = normalizeError(error);
    setStatus(postStatus, 'error', `Ошибка PATCH: ${message}`);
    setPlaceholder(postResponse, 'Не удалось обновить пост.');
  }
});

postDeleteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(postDeleteForm);
  const id = Number(formData.get('id'));

  if (!id) {
    setStatus(postStatus, 'warning', 'Для DELETE укажите корректный ID.');
    addLog('JSONPlaceholder DELETE: не указан ID.');
    return;
  }

  setStatus(postStatus, 'loading', `DELETE-запрос: удаляем пост ${id}...`);

  try {
    await sendRequest({
      path: `${ENDPOINTS.posts}/${id}`,
      method: 'DELETE',
      operation: 'JSONPlaceholder DELETE'
    });

    renderRawResponse('DELETE', { id, deleted: true, note: 'JSONPlaceholder возвращает тестовый результат.' });
    setStatus(postStatus, 'success', `DELETE выполнен: пост ${id} удалён (тестовый ответ сервиса).`);
    postDeleteForm.reset();
  } catch (error) {
    const message = normalizeError(error);
    setStatus(postStatus, 'error', `Ошибка DELETE: ${message}`);
    setPlaceholder(postResponse, 'Не удалось удалить пост.');
  }
});

function setActivePanel(targetId) {
  menuButtons.forEach((button) => {
    const isActive = button.dataset.target === targetId;
    button.classList.toggle('is-active', isActive);
  });

  panels.forEach((panel) => {
    const isTarget = panel.id === targetId;
    panel.classList.toggle('is-active', isTarget);
    panel.hidden = !isTarget;
  });

  const selectedLabel = menuButtons.find((button) => button.dataset.target === targetId)?.textContent?.trim();
  if (selectedLabel) {
    addLog(`Переход во вкладку: ${selectedLabel}.`);
  }
}

function setStatus(element, type, message) {
  element.className = `status status-${type}`;
  element.textContent = message;
}

function setPlaceholder(container, text) {
  container.innerHTML = `<p class="placeholder">${escapeHtml(text)}</p>`;
}

function renderCountries(countries) {
  const html = countries
    .map((country) => {
      const name = country?.name?.common || 'Без названия';
      const capital = Array.isArray(country.capital) ? country.capital.join(', ') : 'Нет данных';
      const region = country.region || 'Нет данных';
      const population = typeof country.population === 'number' ? country.population.toLocaleString('ru-RU') : 'Нет данных';
      const flag = country?.flags?.svg || country?.flags?.png || '';
      const code = country.cca2 || 'N/A';

      return `
        <article class="country-card">
          ${flag ? `<img src="${flag}" alt="Флаг ${escapeHtml(name)}" class="country-flag" loading="lazy" />` : ''}
          <h3>${escapeHtml(name)} (${escapeHtml(code)})</h3>
          <p><strong>Столица:</strong> ${escapeHtml(capital)}</p>
          <p><strong>Регион:</strong> ${escapeHtml(region)}</p>
          <p><strong>Население:</strong> ${escapeHtml(population)}</p>
        </article>
      `;
    })
    .join('');

  countryResult.innerHTML = `<div class="country-grid">${html}</div>`;
}

function renderPosts(posts) {
  const html = posts
    .map((post) => {
      return `
        <article class="post-card">
          <h3>#${post.id}: ${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.body)}</p>
        </article>
      `;
    })
    .join('');

  postResponse.innerHTML = `<div class="post-grid">${html}</div>`;
}

function renderRawResponse(method, payload) {
  postResponse.innerHTML = `
    <h3>Ответ API (${escapeHtml(method)})</h3>
    <pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
  `;
}

function addLog(message) {
  const item = document.createElement('li');
  item.textContent = `${new Date().toLocaleTimeString('ru-RU')}: ${message}`;
  logList.prepend(item);

  while (logList.children.length > 10) {
    logList.removeChild(logList.lastChild);
  }
}

function normalizeError(error) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
