-- Schema inicial do portal acadêmico (placeholder: Campus Agora)
-- Projeto Supabase: jbwrnvmidjvcnkexjsqj
-- O banco ativo já contém as estruturas abaixo.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  type text not null default 'news' check (type in ('news','notice','orientation')),
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  kind text not null default 'event' check (kind in ('event','deadline','notice')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (ends_at is null or ends_at >= starts_at)
);

create table if not exists public.campus_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'sector' check (category in ('room','sector','service','other')),
  building text,
  floor text,
  reference text,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transport_schedules (
  id uuid primary key default gen_random_uuid(),
  line_name text not null,
  direction text not null,
  departure_time time not null,
  active_days text[] not null default array['seg','ter','qua','qui','sex'],
  note text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.campus_locations enable row level security;
alter table public.transport_schedules enable row level security;

-- No banco ativo:
-- • visitantes e usuários autenticados leem apenas conteúdo publicado/ativo;
-- • escrita administrativa usa app_metadata.role = 'admin';
-- • user_metadata não é usado para autorização.