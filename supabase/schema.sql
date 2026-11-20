-- FalconAI schema. Run in the Supabase SQL editor (or `supabase db push`).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.

create extension if not exists pgcrypto;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company text,
  plan text not null default 'trial' check (plan in ('trial','go','pro','enterprise')),
  trial_ends_at timestamptz not null default (now() + interval '15 days'),
  plan_activated_at timestamptz,
  ai_credits_used int not null default 0,
  credits_period_start timestamptz not null default now(),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, company)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'company')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- core tables ----------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hostname text not null,
  os text,
  ip text,
  owner text,
  criticality text not null default 'medium' check (criticality in ('low','medium','high','critical')),
  status text not null default 'active' check (status in ('active','isolated','retired')),
  last_seen timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, hostname)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'manual',
  event_type text not null,
  hostname text,
  username text,
  src_ip text,
  process text,
  command_line text,
  message text,
  raw jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists events_user_time on public.events (user_id, occurred_at desc);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  status text not null default 'open' check (status in ('open','investigating','contained','closed')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.detections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id text not null,
  title text not null,
  severity text not null check (severity in ('low','medium','high','critical')),
  technique text,
  status text not null default 'open' check (status in ('open','investigating','resolved','false_positive')),
  summary text,
  hostname text,
  event_ids uuid[] not null default '{}',
  ai_analysis jsonb,
  incident_id uuid references public.incidents(id) on delete set null,
  dedupe_key text,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);
create index if not exists detections_user_time on public.detections (user_id, created_at desc);

create table if not exists public.ioc_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('ip','domain','hash','process')),
  value text not null,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, type, value)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  kind text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  prefix text not null,
  key_hash text not null unique,
  revoked boolean not null default false,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  plan text,
  amount numeric,
  currency text,
  provider text not null default 'selar',
  provider_ref text unique,
  status text not null default 'pending',
  raw jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  topic text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.events enable row level security;
alter table public.incidents enable row level security;
alter table public.detections enable row level security;
alter table public.ioc_watchlist enable row level security;
alter table public.reports enable row level security;
alter table public.api_keys enable row level security;
alter table public.notifications enable row level security;
alter table public.payments enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "profile read own" on public.profiles;
create policy "profile read own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- Users may only edit name/company. Plan, credits and admin flag are server-controlled.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, company) on public.profiles to authenticated;

do $$
declare t text;
begin
  foreach t in array array['assets','events','incidents','detections','ioc_watchlist','reports','notifications'] loop
    execute format('drop policy if exists "%1$s own" on public.%1$s', t);
    execute format('create policy "%1$s own" on public.%1$s for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

-- API keys: users can see and revoke their own, creation goes through the server (hash stored).
drop policy if exists "api_keys own" on public.api_keys;
create policy "api_keys own" on public.api_keys for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Payments: users can read their own; only the service role writes.
drop policy if exists "payments read own" on public.payments;
create policy "payments read own" on public.payments for select using (auth.uid() = user_id);

-- Contact form: anyone may insert, nobody can read via the API.
drop policy if exists "contact insert" on public.contact_messages;
create policy "contact insert" on public.contact_messages for insert to anon, authenticated with check (true);

-- ---------- AI credit accounting ----------
create or replace function public.plan_credit_limit(p text) returns int language sql immutable as $$
  select case p when 'trial' then 10 when 'go' then 100 when 'pro' then 500 when 'enterprise' then 5000 else 0 end
$$;

-- Atomically consumes one credit for the calling user. Returns remaining credits, or -1 if exhausted/expired.
create or replace function public.consume_ai_credit() returns int
language plpgsql security definer set search_path = public as $$
declare p public.profiles; lim int;
begin
  select * into p from public.profiles where id = auth.uid() for update;
  if not found then return -1; end if;
  if p.plan = 'trial' and p.trial_ends_at < now() then return -1; end if;
  if p.credits_period_start < now() - interval '30 days' then
    update public.profiles set ai_credits_used = 0, credits_period_start = now() where id = p.id;
    p.ai_credits_used := 0;
  end if;
  lim := public.plan_credit_limit(p.plan);
  if p.ai_credits_used >= lim then return -1; end if;
  update public.profiles set ai_credits_used = ai_credits_used + 1 where id = p.id;
  return lim - (p.ai_credits_used + 1);
end $$;
revoke all on function public.consume_ai_credit() from public, anon;
grant execute on function public.consume_ai_credit() to authenticated;

-- Refunds a credit if the AI call failed after consuming one.
create or replace function public.refund_ai_credit() returns void
language sql security definer set search_path = public as $$
  update public.profiles set ai_credits_used = greatest(0, ai_credits_used - 1) where id = auth.uid();
$$;
revoke all on function public.refund_ai_credit() from public, anon;
grant execute on function public.refund_ai_credit() to authenticated;

-- To make yourself an admin (SQL editor only):
--   update public.profiles set is_admin = true where email = 'you@example.com';
