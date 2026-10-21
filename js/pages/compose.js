import { showToast } from '../components/ui.js?v=3.3.0';
import { getLanguage, t } from '../i18n.js?v=3.3.2';
import { invokePublicFunction, isSupabaseConfigured } from '../supabase.js';
import { categoryLabel, setText } from '../utils.js';

const form = document.querySelector('[data-letter-form]');
const titleInput = document.querySelector('#letter-title');
const categoryInput = document.querySelector('#letter-category');
const messageInput = document.querySelector('#letter-message');
const nameInput = document.querySelector('#display-name');
const countNode = document.querySelector('[data-character-count]');
const draftStatus = document.querySelector('[data-draft-status]');
const nameField = document.querySelector('[data-name-field]');
const identityOptions = [...document.querySelectorAll('.identity-option')];
const previewDialog = document.querySelector('[data-preview-dialog]');
const errorNode = document.querySelector('[data-form-error]');
const submitButton = form?.querySelector('[type="submit"]');
const submitLabel = document.querySelector('[data-submit-label]');
const letterSheet = document.querySelector('[data-letter-sheet]');
const letterDate = document.querySelector('[data-letter-date]');
const draftKey = 'ruang-rindu-letter-draft-v1';
let saveTimer;
let isSubmitting = false;
let currentErrorKey = '';

function countCharacters(value) {
  return Array.from(value || '').length;
}

function setLetterDate() {
  if (!letterDate) return;
  const today = new Date();
  letterDate.dateTime = today.toISOString().slice(0, 10);
  letterDate.textContent = new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-US' : 'id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(today);
}

function selectedIdentity() {
  return form?.querySelector('input[name="identity"]:checked')?.value || 'anonymous';
}

function currentDraft() {
  return {
    title: titleInput?.value ?? '', category: categoryInput?.value ?? '', message: messageInput?.value ?? '',
    identity: selectedIdentity(), display_name: nameInput?.value ?? '',
  };
}

function updateCount() {
  setText(countNode, `${countCharacters(messageInput?.value)} / 5.000`);
  letterSheet?.classList.toggle('is-writing', Boolean(messageInput?.value.trim()));
}

function toggleIdentity() {
  const named = selectedIdentity() === 'named';
  if (nameField) nameField.hidden = !named;
  if (nameInput) nameInput.required = named;
  identityOptions.forEach((option) => {
    option.classList.toggle('is-selected', option.querySelector('input')?.checked === true);
  });
}

function clearError() {
  currentErrorKey = '';
  if (errorNode) { errorNode.hidden = true; errorNode.textContent = ''; }
}

function showError(message, key = '') {
  currentErrorKey = key;
  if (!errorNode) return;
  errorNode.textContent = message;
  errorNode.hidden = false;
}

function saveDraftSoon() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      const draft = currentDraft();
      if (draft.title || draft.message || draft.display_name) {
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setText(draftStatus, t('compose.draftSaved'));
      }
    } catch (error) {
      console.warn('Unable to save local draft', error);
      setText(draftStatus, t('compose.draftUnavailable'));
    }
  }, 450);
}

function restoreDraft() {
  try {
    const stored = localStorage.getItem(draftKey);
    if (!stored) return;
    const draft = JSON.parse(stored);
    if (typeof draft.title === 'string') titleInput.value = draft.title;
    if (typeof draft.category === 'string') categoryInput.value = draft.category;
    if (typeof draft.message === 'string') messageInput.value = draft.message;
    if (typeof draft.display_name === 'string') nameInput.value = draft.display_name;
    const savedIdentity = draft.identity === 'named' ? 'named' : 'anonymous';
    const choice = form.querySelector(`input[name="identity"][value="${savedIdentity}"]`);
    if (choice) choice.checked = true;
    toggleIdentity(); updateCount();
    setText(draftStatus, t('compose.draftRestored'));
  } catch (error) {
    console.warn('Unable to restore local draft', error);
  }
}

function validate() {
  const message = messageInput.value.trim();
  const title = titleInput.value.trim();
  const named = selectedIdentity() === 'named';
  const displayName = nameInput.value.trim();
  if (!message) return { key: 'compose.validationMessageRequired', message: t('compose.validationMessageRequired') };
  if (countCharacters(message) > 5000) return { key: 'compose.validationMessageLong', message: t('compose.validationMessageLong') };
  if (countCharacters(title) > 120) return { key: 'compose.validationTitleLong', message: t('compose.validationTitleLong') };
  if (named && (!displayName || countCharacters(displayName) > 60)) return { key: 'compose.validationName', message: t('compose.validationName') };
  return null;
}

function populatePreview() {
  const error = validate();
  if (error) { showError(error.message, error.key); messageInput.focus(); return; }
  clearError();
  setText(document.querySelector('[data-preview-category]'), categoryInput.value ? categoryLabel(categoryInput.value) : 'Catatan pribadi');
  setText(document.querySelector('[data-preview-title]'), titleInput.value.trim() || t('compose.previewNoTitle'));
  setText(document.querySelector('[data-preview-message]'), messageInput.value.trim());
  setText(document.querySelector('[data-preview-author]'), selectedIdentity() === 'named' ? nameInput.value.trim() : t('compose.previewAuthor'));
  previewDialog?.showModal();
}

function setSubmitting(value) {
  isSubmitting = value;
  if (submitButton) submitButton.disabled = value;
  setText(submitLabel, value ? t('compose.sending') : t('common.send'));
}

function showSuccess() {
  const panel = document.createElement('section');
  panel.className = 'state-panel';
  const eyebrow = document.createElement('p'); eyebrow.className = 'eyebrow'; eyebrow.textContent = t('compose.successEyebrow');
  const title = document.createElement('h2'); title.textContent = t('compose.successTitle');
  const body = document.createElement('p'); body.textContent = t('compose.successBody');
  const link = document.createElement('a'); link.className = 'button button-ink'; link.href = 'index.html';
  const label = document.createElement('span'); label.textContent = t('compose.backToSpace'); const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '→'; link.append(label, arrow);
  panel.append(eyebrow, title, body, link);
  form.replaceWith(panel);
  setText(draftStatus, t('compose.draftDeleted'));
}

form?.addEventListener('input', () => { updateCount(); saveDraftSoon(); });
form?.addEventListener('change', (event) => { if (event.target.name === 'identity') toggleIdentity(); saveDraftSoon(); });
messageInput?.addEventListener('focus', () => letterSheet?.classList.add('is-writing'));
messageInput?.addEventListener('blur', updateCount);
document.querySelector('[data-preview-button]')?.addEventListener('click', populatePreview);
document.querySelectorAll('[data-close-preview]').forEach((button) => button.addEventListener('click', () => previewDialog?.close()));

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSubmitting) return;
  clearError();
  const validationError = validate();
  if (validationError) { showError(validationError.message, validationError.key); return; }
  if (!isSupabaseConfigured) {
    showError(t('compose.notConfigured'), 'compose.notConfigured');
    return;
  }
  const identity = selectedIdentity();
  const payload = {
    title: titleInput.value.trim() || null,
    category: categoryInput.value || null,
    message: messageInput.value.trim(),
    is_anonymous: identity === 'anonymous',
    display_name: identity === 'named' ? nameInput.value.trim() : null,
  };
  setSubmitting(true);
  try {
    await invokePublicFunction('submit-letter', payload);
    localStorage.removeItem(draftKey);
    showToast(t('compose.submittedToast'));
    showSuccess();
  } catch (error) {
    console.error(error);
    showError(error.message || t('compose.submitError'), error.message ? '' : 'compose.submitError');
  } finally {
    setSubmitting(false);
  }
});

restoreDraft();
setLetterDate();
updateCount();

window.addEventListener('languagechange', () => {
  setLetterDate();
  updateCount();
  if (isSubmitting) setSubmitting(true);
  if (currentErrorKey) showError(t(currentErrorKey), currentErrorKey);
  if (previewDialog?.open) populatePreview();
});
