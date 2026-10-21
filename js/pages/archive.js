import { createArchiveRow, renderState } from '../components/ui.js?v=3.3.0';
import { t } from '../i18n.js';
import { getPublishedLetters, isSupabaseConfigured } from '../supabase.js';
import { debounce } from '../utils.js';

const list = document.querySelector('[data-archive-list]');
const searchInput = document.querySelector('#archive-search');
const countNode = document.querySelector('[data-result-count]');
const sortSelect = document.querySelector('[data-sort-select]');
const loadMore = document.querySelector('[data-load-more]');
const categoryButtons = [...document.querySelectorAll('[data-category]')];

const state = { page: 0, pageSize: 12, category: '', search: '', sort: 'newest', total: 0, requestId: 0 };

function updateCount() {
  if (!countNode) return;
  if (!state.total) countNode.textContent = t('archive.noMatch');
  else countNode.textContent = t('archive.count', { count: state.total });
}

function showLoading() {
  if (state.page === 0 && list) {
    const loader = document.createElement('div');
    loader.className = 'state-panel';
    const text = document.createElement('p');
    text.textContent = t('archive.preparing');
    loader.append(text);
    list.replaceChildren(loader);
  }
}

async function loadLetters({ append = false } = {}) {
  if (!list) return;
  if (!isSupabaseConfigured) {
    renderState(list, {
      title: t('archive.unavailableTitle'),
      description: t('archive.unavailableDescription'),
      action: { href: 'compose.html', label: t('archive.writeFirst') },
    });
    if (countNode) countNode.textContent = t('archive.connectionWaiting');
    return;
  }
  const requestId = ++state.requestId;
  showLoading();
  list.classList.add('is-refreshing');
  if (loadMore) loadMore.disabled = true;
  try {
    const { letters, count } = await getPublishedLetters(state);
    if (requestId !== state.requestId) return;
    state.total = count;
    updateCount();
    if (!letters.length && !append) {
      renderState(list, {
        title: state.search || state.category ? t('archive.noMatchTitle') : t('archive.quietTitle'),
        description: state.search || state.category ? t('archive.noMatchDescription') : t('archive.quietDescription'),
        action: { href: 'compose.html', label: t('archive.writeLetter') },
      });
    } else if (append) {
      list.append(...letters.map(createArchiveRow));
    } else {
      list.replaceChildren(...letters.map(createArchiveRow));
    }
    const shown = (state.page + 1) * state.pageSize;
    if (loadMore) loadMore.hidden = shown >= state.total;
  } catch (error) {
    console.error(error);
    if (requestId !== state.requestId) return;
    renderState(list, {
      title: t('archive.errorTitle'),
      description: t('archive.errorDescription'),
    });
    if (countNode) countNode.textContent = t('archive.connectionError');
  } finally {
    if (requestId === state.requestId && loadMore) loadMore.disabled = false;
    list.setAttribute('aria-busy', 'false');
    if (requestId === state.requestId) {
      window.setTimeout(() => list.classList.remove('is-refreshing'), 180);
    }
  }
}

function resetAndLoad() {
  state.page = 0;
  loadLetters();
}

searchInput?.addEventListener('input', debounce((event) => {
  state.search = event.target.value;
  resetAndLoad();
}));

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.category = button.dataset.category || '';
    categoryButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    resetAndLoad();
  });
});

sortSelect?.addEventListener('change', (event) => {
  state.sort = event.target.value;
  resetAndLoad();
});

loadMore?.addEventListener('click', () => {
  state.page += 1;
  loadLetters({ append: true });
});

window.addEventListener('languagechange', () => {
  state.page = 0;
  loadLetters();
});

loadLetters();
