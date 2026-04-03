-- ============================================
-- ChartAI - Supabase Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'trader')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  daily_analyses_used integer default 0,
  daily_reset_at timestamptz default now(),
  total_analyses integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ANALYSES TABLE
-- ============================================
create table public.analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  ticker text,
  timeframe text,
  trend text,
  pattern text,
  support_level numeric,
  resistance_level numeric,
  entry_price numeric,
  stop_loss numeric,
  take_profit_1 numeric,
  take_profit_2 numeric,
  take_profit_3 numeric,
  risk_reward numeric,
  confidence integer check (confidence between 0 and 100),
  signal text check (signal in ('LONG', 'SHORT', 'NEUTRAL')),
  rationale text,
  key_levels jsonb,
  indicators jsonb,
  raw_gemini_output text,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Analyses: users can only see their own analyses
create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- RESET DAILY ANALYSES FUNCTION
-- ============================================
create or replace function public.reset_daily_analyses()
returns void as $$
begin
  update public.profiles
  set daily_analyses_used = 0,
      daily_reset_at = now()
  where daily_reset_at < now() - interval '24 hours';
end;
$$ language plpgsql security definer;

-- ============================================
-- STORAGE BUCKET FOR CHART IMAGES
-- ============================================
-- Run this in Supabase Storage settings:
-- Create bucket named "charts" with public: false
-- Add policy: authenticated users can upload to their own folder

insert into storage.buckets (id, name, public)
values ('charts', 'charts', false)
on conflict do nothing;

create policy "Users upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'charts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users view own charts"
  on storage.objects for select
  using (
    bucket_id = 'charts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
