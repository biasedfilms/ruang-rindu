-- Restrict the browser-facing letters contract to fields used by the public reader.
-- This migration also protects projects that already applied the initial schema.
revoke select on public.letters from anon, authenticated;

grant select (id, title, message, display_name, is_anonymous, category, published_at)
on public.letters to anon, authenticated;
