-- ============================================================
-- Consola POPUPS · esquema v1 (Supabase / PostgreSQL)
-- Idempotente: se puede re-ejecutar sin romper nada.
-- ============================================================

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text not null default 'dev' check (role in ('owner','admin','dev','support')),
  active boolean default true,
  created_at timestamptz default now(),
  last_login_at timestamptz
);

create table if not exists apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  category text,
  status text not null default 'idea'
    check (status in ('idea','en_desarrollo','demo','produccion','mantenimiento','pausada','retirada')),
  version text,
  version_date date,
  urls jsonb not null default '{}',
  supabase_ref text default '',
  brand jsonb default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists app_releases (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references apps(id) on delete cascade,
  version text not null,
  summary text,
  actor text,
  released_at timestamptz default now()
);

create table if not exists app_notes (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references apps(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  app_id uuid references apps(id) on delete set null,
  detail jsonb,
  created_at timestamptz default now()
);

-- Índices útiles
create index if not exists idx_apps_status on apps(status);
create index if not exists idx_releases_app on app_releases(app_id, released_at desc);
create index if not exists idx_notes_app on app_notes(app_id, created_at desc);
create index if not exists idx_activity_created on activity_log(created_at desc);

-- ============================================================
-- RLS: solo miembros autenticados leen/escriben.
-- (Se completa cuando se active Supabase Auth en la Fase E.)
-- ============================================================
alter table team_members enable row level security;
alter table apps enable row level security;
alter table app_releases enable row level security;
alter table app_notes enable row level security;
alter table activity_log enable row level security;

drop policy if exists "equipo_lectura" on apps;
create policy "equipo_lectura" on apps for select using (true);

drop policy if exists "equipo_escritura" on apps;
create policy "equipo_escritura" on apps for all using (true) with check (true);
-- ⚠️ Ajustar cuando haya Auth: using (auth.uid() in (select id from team_members where active))
