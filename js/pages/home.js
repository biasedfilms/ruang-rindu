import { createLetterPreview } from '../components/ui.js?v=3.3.0';
import { t } from '../i18n.js';
import { getFeaturedLetters, isSupabaseConfigured } from '../supabase.js';

const container = document.querySelector('[data-featured-letters]');

async function loadFeatured() {
  if (!container) return;
  if (!isSupabaseConfigured) {
    const state = document.createElement('p');
    state.className = 'featured-empty';
    state.textContent = t('home.archiveUnavailable');
    container.replaceChildren(state);
    container.setAttribute('aria-busy', 'false');
    return;
  }
  try {
    const letters = await getFeaturedLetters(3);
    if (!letters.length) {
      const state = document.createElement('p');
      state.className = 'featured-empty';
      state.textContent = t('home.archiveEmpty');
      container.replaceChildren(state);
    } else {
      container.replaceChildren(...letters.map(createLetterPreview));
    }
  } catch (error) {
    console.error(error);
    const state = document.createElement('p');
    state.className = 'featured-empty';
    state.textContent = t('home.archiveError');
    container.replaceChildren(state);
  } finally {
    container.setAttribute('aria-busy', 'false');
  }
}

loadFeatured();

window.addEventListener('languagechange', loadFeatured);
