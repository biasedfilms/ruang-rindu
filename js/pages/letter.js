import { populateReadingLetter, showToast } from '../components/ui.js?v=3.3.0';
import { t } from '../i18n.js';
import { getPublishedLetter, invokePublicFunction, isSupabaseConfigured } from '../supabase.js';
import { isUuid } from '../utils.js';

const loader = document.querySelector('[data-letter-loader]');
const readingLetter = document.querySelector('[data-reading-letter]');
const actions = document.querySelector('[data-reading-actions]');
const notFound = document.querySelector('[data-not-found]');
const reportDialog = document.querySelector('[data-report-dialog]');
const reportForm = document.querySelector('[data-report-form]');
const reportError = document.querySelector('[data-report-error]');
const reportReason = document.querySelector('#report-reason');
const reportSubmit = document.querySelector('[data-report-submit-label]');
const id = new URLSearchParams(window.location.search).get('id');
let currentLetter = null;

function showNotFound({ configuration = false } = {}) {
  loader?.setAttribute('hidden', '');
  notFound?.removeAttribute('hidden');
  if (configuration && notFound) {
    const title = notFound.querySelector('h1');
    const text = notFound.querySelector('p:not(.eyebrow)');
    if (title) title.textContent = t('letter.notConfiguredTitle');
    if (text) text.textContent = t('letter.notConfiguredBody');
  }
}

async function loadLetter() {
  if (!id || !isUuid(id)) { showNotFound(); return; }
  if (!isSupabaseConfigured) { showNotFound({ configuration: true }); return; }
  try {
    const letter = await getPublishedLetter(id);
    if (!letter) { showNotFound(); return; }
    currentLetter = letter;
    document.title = `${letter.title || 'Surat'} — Ruang Rindu`;
    populateReadingLetter(letter);
    loader?.setAttribute('hidden', '');
    readingLetter?.removeAttribute('hidden');
    actions?.removeAttribute('hidden');
  } catch (error) {
    console.error(error);
    showNotFound();
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast(t('letter.copied'));
  } catch (error) {
    console.error(error);
    showToast(t('letter.copyFailed'));
  }
}

document.querySelector('[data-copy-button]')?.addEventListener('click', copyLink);
document.querySelector('[data-share-button]')?.addEventListener('click', async () => {
  if (!currentLetter) return;
  if (!navigator.share) { copyLink(); return; }
  try {
    await navigator.share({ title: `${currentLetter.title || t('categories.empty')} — Ruang Rindu`, text: t('letter.sharedText'), url: window.location.href });
  } catch (error) {
    if (error?.name !== 'AbortError') console.error(error);
  }
});

document.querySelector('[data-report-button]')?.addEventListener('click', () => reportDialog?.showModal());
document.querySelectorAll('[data-close-report]').forEach((button) => button.addEventListener('click', () => reportDialog?.close()));

reportForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const reason = reportReason.value.trim();
  if (reason.length < 8) {
    reportError.textContent = t('letter.reportHint');
    reportError.hidden = false;
    return;
  }
  if (!currentLetter || !isSupabaseConfigured) return;
  reportError.hidden = true;
  reportSubmit.textContent = t('letter.reportSending');
  const button = reportForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    await invokePublicFunction('report-letter', { letter_id: currentLetter.id, reason });
    reportDialog.close();
    reportForm.reset();
    showToast(t('letter.reportSuccess'));
  } catch (error) {
    console.error(error);
    reportError.textContent = error.message || t('letter.reportError');
    reportError.hidden = false;
  } finally {
    button.disabled = false;
    reportSubmit.textContent = t('letter.reportSubmit');
  }
});

loadLetter();

window.addEventListener('languagechange', () => {
  if (currentLetter) {
    populateReadingLetter(currentLetter);
    document.title = `${currentLetter.title || t('categories.empty')} — Ruang Rindu`;
  }
  if (reportForm?.querySelector('[type="submit"]')?.disabled) reportSubmit.textContent = t('letter.reportSending');
});
