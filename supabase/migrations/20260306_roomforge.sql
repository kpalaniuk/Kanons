-- RoomForge: parametric room + cabinet design projects
-- Run this migration to enable Supabase persistence for RoomForge

create table if not exists public.roomforge_projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,           -- Clerk user ID
  name        text not null default 'Untitled Room',
  room_spec   jsonb not null default '{}',
  cabinets    jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast user lookups
create index if not exists roomforge_projects_user_id_idx
  on public.roomforge_projects (user_id);

-- Auto-update updated_at on change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roomforge_projects_updated_at on public.roomforge_projects;
create trigger roomforge_projects_updated_at
  before update on public.roomforge_projects
  for each row execute function public.set_updated_at();

-- RLS: users can only see/edit their own projects
alter table public.roomforge_projects enable row level security;

-- Note: these policies use Supabase JWT claims; with Clerk you'll want
-- to set up Clerk → Supabase JWT integration first (see Clerk docs).
-- For now, the service role key bypasses RLS from the API routes.

comment on table public.roomforge_projects is 
  'RoomForge parametric room design projects. Each row is a saved room for a Clerk user.';
