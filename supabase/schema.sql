-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Decisions table
create table if not exists public.decisions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  goal text not null,
  time_minutes int not null,
  energy int not null check (energy between 1 and 5),
  tasks jsonb not null,
  recommendation jsonb not null,
  user_feedback text,
  notes text
);

-- Turn on RLS
alter table public.profiles enable row level security;
alter table public.decisions enable row level security;

-- Profiles policies
create policy "Users can view their profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert their profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles for update
using (auth.uid() = id);

-- Decisions policies
create policy "Users can view their decisions"
on public.decisions for select
using (auth.uid() = user_id);

create policy "Users can insert their decisions"
on public.decisions for insert
with check (auth.uid() = user_id);

create policy "Users can update their decisions"
on public.decisions for update
using (auth.uid() = user_id);

create policy "Users can delete their decisions"
on public.decisions for delete
using (auth.uid() = user_id);

-- Automatically create a profile row after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
