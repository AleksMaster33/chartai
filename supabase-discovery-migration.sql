-- Osiris Discovery Cache
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

create table if not exists public.discovery_cache (
  id          integer      primary key,
  results     jsonb        not null default '[]'::jsonb,
  scanned_at  timestamptz  not null default now()
);

-- RLS
alter table public.discovery_cache enable row level security;

-- Authenticated users can read cached results
create policy "Authenticated users can read discovery cache"
  on public.discovery_cache for select
  using (auth.role() = 'authenticated');

-- Service role (used by API routes) can insert/update
create policy "Service role can manage discovery cache"
  on public.discovery_cache for all
  using (true);
