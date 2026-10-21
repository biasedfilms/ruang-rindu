import { publicConfig, isSupabaseConfigured } from './config.js';
import { t } from './i18n.js';

export { isSupabaseConfigured };

let client = null;

if (isSupabaseConfigured) {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  client = createClient(publicConfig.supabaseUrl, publicConfig.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export class ConfigurationError extends Error {
  constructor() {
    super('Ruang Rindu belum terhubung ke Supabase.');
    this.name = 'ConfigurationError';
  }
}

function requireClient() {
  if (!client) throw new ConfigurationError();
  return client;
}

function cleanSearchTerm(value) {
  return value.replace(/[,%()]/g, ' ').trim().slice(0, 80);
}

export async function getPublishedLetters({ page = 0, pageSize = 12, category = '', search = '', sort = 'newest' } = {}) {
  const supabase = requireClient();
  const first = page * pageSize;
  const last = first + pageSize - 1;
  let query = supabase
    .from('letters')
    .select('id,title,message,display_name,is_anonymous,category,published_at', { count: 'exact' })
    .eq('status', 'published');

  if (category) query = query.eq('category', category);
  const term = cleanSearchTerm(search);
  if (term) query = query.textSearch('search_document', term, { config: 'simple', type: 'websearch' });

  query = query.order('published_at', { ascending: sort === 'oldest', nullsFirst: false }).range(first, last);
  const { data, error, count } = await query;
  if (error) throw error;
  return { letters: data ?? [], count: count ?? 0 };
}

export async function getFeaturedLetters(limit = 3) {
  const { letters } = await getPublishedLetters({ page: 0, pageSize: limit, sort: 'newest' });
  return letters;
}

export async function getPublishedLetter(id) {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from('letters')
    .select('id,title,message,display_name,is_anonymous,category,published_at')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function invokePublicFunction(name, body) {
  const supabase = requireClient();
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    const context = error.context;
    console.warn('Supabase function request failed', {
      function: name,
      errorName: error.name,
      status: context instanceof Response ? context.status : undefined,
      errorMessage: error.message,
    });
    if (context && typeof context.json === 'function') {
      let serverMessage = '';
      try {
        const payload = await context.json();
        if (typeof payload?.error === 'string') serverMessage = payload.error;
      } catch (parseError) {
        console.warn('Unable to read function error response', parseError);
      }
      throw new Error(serverMessage || t('states.requestError'));
    }
    throw new Error(t('states.requestError'));
  }
  return data;
}
