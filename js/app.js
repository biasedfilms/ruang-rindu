import { showToast } from './components/ui.js?v=3.3.0';
import { initI18n, t } from './i18n.js?v=3.3.2';

initI18n();
document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });

const THEME_KEY = 'ruang-rindu-theme';
const themeToggles = [...document.querySelectorAll('[data-theme-toggle]')];
const themeMeta = document.querySelector('meta[name="theme-color"]');
function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function setTheme(theme, { persist = true } = {}) {
  const nextTheme = theme === 'light' || theme === 'dark' ? theme : systemTheme();
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  themeToggles.forEach((themeToggle) => {
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'light'));
    themeToggle.setAttribute('aria-label', t(nextTheme === 'light' ? 'common.themeDark' : 'common.themeLight'));
    themeToggle.querySelector('[data-theme-icon]')?.setAttribute('data-icon', nextTheme);
  });
  if (themeMeta) themeMeta.setAttribute('content', nextTheme === 'light' ? '#f4f1eb' : '#0c1020');
  if (persist) {
    try { window.localStorage.setItem(THEME_KEY, nextTheme); } catch { /* preference remains session-only */ }
  }
}
if (themeToggles.length) {
  themeToggles.forEach((themeToggle) => themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  }));
  window.addEventListener('languagechange', () => setTheme(document.documentElement.dataset.theme, { persist: false }));
  const media = window.matchMedia('(prefers-color-scheme: light)');
  media.addEventListener?.('change', () => {
    try {
      if (!window.localStorage.getItem(THEME_KEY)) setTheme(systemTheme(), { persist: false });
    } catch { setTheme(systemTheme(), { persist: false }); }
  });
}

const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
if (toggle && nav) {
  const closeMenu = ({ returnFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    toggle.querySelector('.sr-only').dataset.i18n = 'common.menuOpen';
    toggle.querySelector('[aria-hidden="true"]').dataset.i18n = 'common.menu';
    toggle.querySelector('.sr-only').textContent = t('common.menuOpen');
    toggle.querySelector('[aria-hidden="true"]').textContent = t('common.menu');
    if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    toggle.querySelector('.sr-only').dataset.i18n = open ? 'common.menuOpen' : 'common.menuClose';
    toggle.querySelector('[aria-hidden="true"]').dataset.i18n = open ? 'common.menu' : 'common.close';
    toggle.querySelector('.sr-only').textContent = t(open ? 'common.menuOpen' : 'common.menuClose');
    toggle.querySelector('[aria-hidden="true"]').textContent = t(open ? 'common.menu' : 'common.close');
  });
  nav.addEventListener('click', () => {
    closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu({ returnFocus: true });
  });
}

const heroLetter = document.querySelector('[data-hero-letter]');
const heroNote = document.querySelector('[data-hero-note]');
const closeNote = document.querySelector('[data-note-close]');
function closeHeroNote() {
  if (!heroLetter || !heroNote) return;
  heroLetter.classList.remove('is-open');
  heroLetter.disabled = false;
  heroLetter.focus();
  heroLetter.setAttribute('aria-expanded', 'false');
  heroNote.classList.remove('is-visible');
  heroNote.setAttribute('aria-hidden', 'true');
}
if (heroLetter && heroNote) {
  heroLetter.addEventListener('click', () => {
    heroLetter.classList.add('is-open');
    heroLetter.disabled = true;
    heroLetter.setAttribute('aria-expanded', 'true');
    heroNote.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => heroNote.classList.add('is-visible'), 140);
  });
  closeNote?.addEventListener('click', closeHeroNote);
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  const observeReveals = (root = document) => root.querySelectorAll?.('[data-reveal]:not(.is-revealed)').forEach((node) => revealObserver.observe(node));
  observeReveals();
  new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches?.('[data-reveal]')) revealObserver.observe(node);
    observeReveals(node);
  }))).observe(document.body, { childList: true, subtree: true });
} else {
  document.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-revealed'));
}

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'ConfigurationError') return;
  // Keep the UI calm while errors are still visible to developers in the console.
  console.error('Unhandled application error:', event.reason);
});

export { showToast };
