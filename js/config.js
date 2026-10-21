/*
 * Browser-safe Supabase values only. The URL and anon/publishable key are
 * intentionally public; never put SUPABASE_SERVICE_ROLE_KEY in this file or
 * in any browser-delivered asset.
 */
export const publicConfig = Object.freeze({
  supabaseUrl: 'https://foksdgspaqzbeyevldyg.supabase.co',
  supabaseAnonKey: 'sb_publishable_guit1ha049LvwvcFPv1BYg_AohN-NHS',
});

export const isSupabaseConfigured = Boolean(
  publicConfig.supabaseUrl.startsWith('https://') &&
  publicConfig.supabaseAnonKey &&
  !publicConfig.supabaseAnonKey.includes('YOUR_'),
);
