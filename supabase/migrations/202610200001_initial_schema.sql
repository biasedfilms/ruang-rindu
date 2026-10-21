-- Ruang Rindu: public letters are deliberately read-only from the browser.
-- All inserts, reporting, throttling, and moderation write paths use Edge Functions
-- with the service-role key stored only as a Supabase Function secret.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

create table public.letters (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text not null,
  display_name text,
  is_anonymous boolean not null default true,
  category text,
  status text not null default 'pending',
  content_hash text not null,
  search_document tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || message || ' ' || coalesce(display_name, ''))
  ) stored,
  created_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint letters_title_length check (title is null or char_length(title) between 1 and 120),
  constraint letters_message_length check (char_length(btrim(message)) between 1 and 5000),
  constraint letters_display_name_length check (display_name is null or char_length(btrim(display_name)) between 1 and 60),
  constraint letters_identity_check check (
    (is_anonymous = true and display_name is null)
    or (is_anonymous = false and display_name is not null)
  ),
  constraint letters_category_check check (category is null or category in ('cinta', 'rindu', 'maaf', 'terima kasih', 'perpisahan', 'lainnya')),
  constraint letters_status_check check (status in ('pending', 'published', 'rejected', 'archived')),
  constraint letters_publication_check check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create index letters_published_newest_idx on public.letters (published_at desc, id desc) where status = 'published';
create index letters_published_category_idx on public.letters (category, published_at desc, id desc) where status = 'published';
create index letters_content_hash_created_idx on public.letters (content_hash, created_at desc);
create index letters_search_idx on public.letters using gin (search_document);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete restrict,
  reason text not null,
  reporter_fingerprint text not null,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz,
  constraint reports_reason_length check (char_length(reason) between 8 and 600),
  constraint reports_status_check check (status in ('open', 'reviewing', 'resolved', 'dismissed'))
);

create index reports_open_created_idx on public.reports (status, created_at asc);
create index reports_letter_idx on public.reports (letter_id, created_at desc);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete restrict,
  action text not null,
  note text,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint moderation_actions_action_check check (action in ('published', 'rejected', 'archived', 'restored', 'report_resolved'))
);

create table private.submission_rate_limits (
  rate_key text primary key,
  window_started_at timestamptz not null default timezone('utc', now()),
  request_count integer not null default 1 check (request_count >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_letter_timestamps()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at = coalesce(new.published_at, timezone('utc', now()));
  elsif new.status <> 'published' then
    new.published_at = null;
  end if;
  return new;
end;
$$;

create trigger letters_set_timestamps
before insert or update on public.letters
for each row execute procedure public.set_letter_timestamps();

-- The function is callable only by service_role. It serializes each fingerprint
-- through the unique key and makes the Edge Function's rate check atomic.
create or replace function public.consume_submission_rate_limit(
  p_rate_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = private, pg_temp
as $$
declare
  accepted boolean := false;
begin
  if p_rate_key is null or char_length(p_rate_key) < 32 or p_limit < 1 or p_limit > 20 or p_window_seconds < 60 or p_window_seconds > 86400 then
    raise exception 'Invalid rate-limit request';
  end if;

  insert into private.submission_rate_limits as limits (rate_key, window_started_at, request_count, updated_at)
  values (p_rate_key, timezone('utc', now()), 1, timezone('utc', now()))
  on conflict (rate_key) do update
    set window_started_at = case
          when limits.window_started_at < timezone('utc', now()) - make_interval(secs => p_window_seconds)
          then timezone('utc', now()) else limits.window_started_at end,
        request_count = case
          when limits.window_started_at < timezone('utc', now()) - make_interval(secs => p_window_seconds)
          then 1 else limits.request_count + 1 end,
        updated_at = timezone('utc', now())
    where limits.window_started_at < timezone('utc', now()) - make_interval(secs => p_window_seconds)
       or limits.request_count < p_limit
  returning true into accepted;

  return coalesce(accepted, false);
end;
$$;

alter table public.letters enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table private.submission_rate_limits enable row level security;

-- The only browser-level table access: read published letters, and only the
-- safe public fields selected by the client. There are intentionally no insert,
-- update, delete, report, or moderation policies for anon/authenticated roles.
create policy "published letters are publicly readable"
on public.letters for select
to anon, authenticated
using (status = 'published');

revoke all on public.letters, public.reports, public.moderation_actions from anon, authenticated;
-- Keep the browser contract limited to fields needed by the public archive.
-- Table-level SELECT would also expose content_hash and internal timestamps.
grant select (id, title, message, display_name, is_anonymous, category, published_at)
on public.letters to anon, authenticated;
revoke all on private.submission_rate_limits from public, anon, authenticated;
revoke all on function public.consume_submission_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_submission_rate_limit(text, integer, integer) to service_role;
