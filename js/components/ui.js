import { categoryLabel, displayAuthor, excerpt, formatDate, setText } from '../utils.js';
import { t } from '../i18n.js';

function categoryTone(category) {
  const tones = {
    cinta: 'love',
    rindu: 'longing',
    maaf: 'apology',
    'terima kasih': 'gratitude',
    perpisahan: 'goodbye',
    lainnya: 'other',
  };
  return tones[category] || 'neutral';
}

export function showToast(message) {
  const region = document.querySelector('[data-toast-region]');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  region.replaceChildren(toast);
  window.setTimeout(() => {
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 180);
  }, 3400);
}

export function createLetterPreview(letter) {
  const link = document.createElement('a');
  link.className = 'letter-preview';
  link.dataset.reveal = '';
  link.dataset.categoryTone = categoryTone(letter.category);
  link.href = `letter.html?id=${encodeURIComponent(letter.id)}`;
  link.setAttribute('aria-label', `${t('common.readArchive')}: ${letter.title || t('categories.empty')}`);

  const category = document.createElement('p');
  category.className = 'letter-kicker';
  category.textContent = categoryLabel(letter.category);
  const title = document.createElement('h3');
  title.textContent = letter.title || excerpt(letter.message, 72);
  const bottom = document.createElement('div');
  bottom.className = 'preview-bottom';
  const meta = document.createElement('span');
  meta.className = 'preview-meta';
  meta.textContent = `${displayAuthor(letter)} · ${formatDate(letter.published_at)}`;
  const arrow = document.createElement('span');
  arrow.className = 'preview-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  bottom.append(meta, arrow);
  link.append(category, title, bottom);
  return link;
}

export function createArchiveRow(letter) {
  const link = document.createElement('a');
  link.className = 'archive-row';
  link.dataset.reveal = '';
  link.dataset.categoryTone = categoryTone(letter.category);
  link.href = `letter.html?id=${encodeURIComponent(letter.id)}`;
  const category = document.createElement('span');
  category.className = 'archive-row-category';
  category.textContent = categoryLabel(letter.category);
  const title = document.createElement('span');
  title.className = 'archive-row-title';
  title.textContent = letter.title || excerpt(letter.message, 70);
  const excerptNode = document.createElement('p');
  excerptNode.className = 'archive-row-excerpt';
  excerptNode.textContent = excerpt(letter.message, 110);
  const meta = document.createElement('span');
  meta.className = 'archive-row-meta';
  const author = document.createElement('span');
  author.className = 'archive-row-author';
  author.textContent = displayAuthor(letter);
  const separator = document.createElement('span');
  separator.className = 'archive-row-meta-separator';
  separator.setAttribute('aria-hidden', 'true');
  separator.textContent = '·';
  const date = document.createElement('time');
  date.className = 'archive-row-date';
  date.dateTime = letter.published_at || '';
  date.textContent = formatDate(letter.published_at);
  meta.append(author, separator, date);
  const arrow = document.createElement('span');
  arrow.className = 'archive-row-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  link.append(category, title, excerptNode, meta, arrow);
  return link;
}

export function renderState(container, { title, description, action } = {}) {
  const panel = document.createElement('div');
  panel.className = 'state-panel';
  const heading = document.createElement('h2');
  heading.textContent = title;
  const text = document.createElement('p');
  text.textContent = description;
  panel.append(heading, text);
  if (action) {
    const button = document.createElement('a');
    button.className = 'button button-ink';
    button.href = action.href;
    const label = document.createElement('span');
    label.textContent = action.label;
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    button.append(label, arrow);
    panel.append(button);
  }
  container.replaceChildren(panel);
}

export function populateLetterBody(element, text) {
  if (!element) return;
  element.textContent = text || '';
}

export function populateReadingLetter(letter) {
  setText(document.querySelector('[data-letter-category]'), categoryLabel(letter.category));
  setText(document.querySelector('[data-letter-title]'), letter.title || t('categories.empty'));
  setText(document.querySelector('[data-letter-author]'), displayAuthor(letter));
  setText(document.querySelector('[data-letter-author-footer]'), displayAuthor(letter));
  const time = document.querySelector('[data-letter-date]');
  if (time) {
    time.dateTime = letter.published_at || '';
    time.textContent = formatDate(letter.published_at);
  }
  populateLetterBody(document.querySelector('[data-letter-message]'), letter.message);
}
