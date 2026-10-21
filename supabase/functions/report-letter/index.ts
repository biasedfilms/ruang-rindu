import { createClient } from 'npm:@supabase/supabase-js@2';

const encoder = new TextEncoder();

function json(body: Record<string, unknown>, status = 200, origin = '') {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Vary': 'Origin' } });
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get('origin') || '';
  return (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((value) => value.trim()).includes(origin) ? origin : '';
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
      return json({ error: 'Laporan tidak valid.' }, 422, origin);
    }
    const letterId = typeof payload.letter_id === 'string' ? payload.letter_id : '';
    const reason = typeof payload.reason === 'string' ? payload.reason.trim() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(letterId) || Array.from(reason).length < 8 || Array.from(reason).length > 600) return json({ error: 'Laporan tidak valid.' }, 422, origin);
    const url = Deno.env.get('SUPABASE_URL'); const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); const salt = Deno.env.get('RATE_LIMIT_SALT');
    if (!url || !serviceKey || !salt) return json({ error: 'Layanan belum siap menerima laporan.' }, 503, origin);
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const sourceIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const fingerprint = await hash(`report:${sourceIp}:${salt}`);
    const { data: allowed, error: rateError } = await supabase.rpc('consume_submission_rate_limit', { p_rate_key: fingerprint, p_limit: 8, p_window_seconds: 3600 });
    if (rateError) throw rateError;
    if (!allowed) return json({ error: 'Terlalu banyak laporan dari sambungan ini. Coba lagi dalam satu jam.' }, 429, origin);
    const { data: letter, error: lookupError } = await supabase.from('letters').select('id').eq('id', letterId).eq('status', 'published').maybeSingle();
    if (lookupError) throw lookupError;
    if (!letter) return json({ error: 'Surat tidak tersedia untuk dilaporkan.' }, 404, origin);
    const { error: insertError } = await supabase.from('reports').insert({ letter_id: letterId, reason, reporter_fingerprint: fingerprint });
    if (insertError) throw insertError;
    return json({ ok: true }, 201, origin);
  } catch (error) {
    console.error('report-letter failed', error);
    return json({ error: 'Laporan belum dapat dikirim. Coba lagi sebentar lagi.' }, 500, origin);
  }
});
