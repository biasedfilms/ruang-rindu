import { getLanguage, t } from './i18n.js';

export function categoryLabel(value) {
  const keys = {
    cinta: 'categories.cinta',
    rindu: 'categories.rindu',
    maaf: 'categories.maaf',
    'terima kasih': 'categories.terimaKasih',
    perpisahan: 'categories.perpisahan',
    lainnya: 'categories.lainnya',
  };
  return t(keys[value] ?? 'categories.empty');
}

export function displayAuthor(letter) {
  return letter.is_anonymous || !letter.display_name ? 'Tanpa nama' : letter.display_name;
}

export function formatDate(value) {
  if (!value) return 'baru saja';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function excerpt(text, limit = 115) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trimEnd()}…`;
}

export function debounce(callback, delay = 260) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function setText(element, value) {
  if (element) element.textContent = value ?? '';
}
