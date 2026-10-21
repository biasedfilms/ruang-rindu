import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedCategories = new Set(['cinta', 'rindu', 'maaf', 'terima kasih', 'perpisahan', 'lainnya']);
const encoder = new TextEncoder();

function json(body: Record<string, unknown>, status = 200, origin = '') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Vary': 'Origin',
    },
  });
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get('origin') || '';
  const configured = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((value) => value.trim()).filter(Boolean);
  return configured.includes(origin) ? origin : '';
}

function asOptionalString(value: unknown, max: number) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return countCharacters(trimmed) <= max ? trimmed : undefined;
}

function countCharacters(value: string) {
  return Array.from(value).length;
}

async function hash(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (request) => {
  const origin = allowedOrigin(request);
  if (request.method === 'OPTIONS') return origin ? new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' } }) : json({ error: 'Origin tidak diizinkan.' }, 403);
  if (!origin) return json({ error: 'Origin tidak diizinkan.' }, 403);
  if (request.method !== 'POST') return json({ error: 'Metode tidak diizinkan.' }, 405, origin);

  try {
    const payload = await request.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return json({ error: 'Isi surat tidak valid.' }, 422, origin);
    }
    const title = asOptionalString(payload.title, 120);
    const message = typeof payload.message === 'string' ? payload.message.trim() : '';
    const category = payload.category === null || payload.category === '' ? null : payload.category;
    const isAnonymous = payload.is_anonymous === true;
    const displayName = asOptionalString(payload.display_name, 60);
    if (title === undefined || !message || countCharacters(message) > 5000) return json({ error: 'Isi surat harus berisi 1–5.000 karakter.' }, 422, origin);
    if (category !== null && (typeof category !== 'string' || !allowedCategories.has(category))) return json({ error: 'Kategori surat tidak valid.' }, 422, origin);
    if (!isAnonymous && !displayName) return json({ error: 'Nama yang ditampilkan harus berisi 1–60 karakter.' }, 422, origin);

    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const salt = Deno.env.get('RATE_LIMIT_SALT');
    if (!url || !serviceKey || !salt) return json({ error: 'Layanan belum siap menerima surat.' }, 503, origin);
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const sourceIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const fingerprint = await hash(`letter:${sourceIp}:${salt}`);
    const { data: allowed, error: rateError } = await supabase.rpc('consume_submission_rate_limit', { p_rate_key: fingerprint, p_limit: 5, p_window_seconds: 3600 });
    if (rateError) throw rateError;
    if (!allowed) return json({ error: 'Terlalu banyak kiriman dari sambungan ini. Coba lagi dalam satu jam.' }, 429, origin);

    const contentHash = await hash(`${title || ''}\n${message}\n${category || ''}\n${isAnonymous ? '' : displayName || ''}`);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: duplicate, error: duplicateError } = await supabase.from('letters').select('id').eq('content_hash', contentHash).gte('created_at', yesterday).limit(1);
    if (duplicateError) throw duplicateError;
    if (duplicate?.length) return json({ error: 'Surat yang sama sudah pernah diterima dalam 24 jam terakhir.' }, 409, origin);

    const { data: letter, error: insertError } = await supabase.from('letters').insert({
      title, message, category, is_anonymous: isAnonymous, display_name: isAnonymous ? null : displayName,
      content_hash: contentHash, status: 'published',
    }).select('id, created_at').single();
    if (insertError) throw insertError;
    return json({ id: letter.id, created_at: letter.created_at, status: 'published' }, 201, origin);
  } catch (error) {
    console.error('submit-letter failed', error);
    return json({ error: 'Surat belum dapat diterima. Coba lagi sebentar lagi.' }, 500, origin);
  }
});
