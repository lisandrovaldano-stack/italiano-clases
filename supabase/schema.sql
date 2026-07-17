-- Esquema de la plataforma de clases de italiano
-- Pegar completo en el SQL Editor de Supabase (Project > SQL Editor > New query > Run)

-- ============ TABLAS ============

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('teacher', 'student')),
  avatar_color text not null default '#2f6d4f',
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  description text,
  schedule_text text,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (course_id, student_id)
);

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  numero int not null,
  fecha timestamptz not null,
  temario text,
  material_url text,
  estado text not null default 'programado' check (estado in ('programado', 'dictado', 'cancelado')),
  created_at timestamptz not null default now(),
  unique (course_id, numero)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  presente boolean not null default false,
  nota text,
  unique (session_id, student_id)
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions (id) on delete cascade,
  file_name text,
  url text not null,
  created_at timestamptz not null default now()
);

-- permite materiales que son solo un link (YouTube, etc.), sin archivo subido
alter table public.materials alter column file_name drop not null;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  file_name text,
  file_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  kind text not null check (kind in ('youtube', 'image', 'file', 'link')),
  url text not null,
  file_name text,
  created_at timestamptz not null default now()
);

-- migra el material_url de una sola clase (esquema viejo) a la tabla nueva, sin duplicar si se corre de nuevo
insert into public.materials (session_id, file_name, url)
select cs.id, 'material', cs.material_url
from public.class_sessions cs
where cs.material_url is not null
  and not exists (
    select 1 from public.materials m where m.session_id = cs.id and m.url = cs.material_url
  );

-- ============ ALTA AUTOMÁTICA DE PERFIL ============
-- Cuando alguien se registra (Supabase Auth), se crea automáticamente su fila en profiles.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'student'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ HELPER: ¿es la profesora? ============

create or replace function public.is_teacher()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

-- ============ ROW LEVEL SECURITY ============

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.class_sessions enable row level security;
alter table public.attendance enable row level security;
alter table public.materials enable row level security;
alter table public.tasks enable row level security;
alter table public.library_items enable row level security;

-- profiles: cada uno ve/edita su propio perfil; la profesora ve y edita todos.
drop policy if exists "profiles_select_own_or_teacher" on public.profiles;
create policy "profiles_select_own_or_teacher" on public.profiles
  for select using (auth.uid() = id or public.is_teacher());

drop policy if exists "profiles_update_own_or_teacher" on public.profiles;
create policy "profiles_update_own_or_teacher" on public.profiles
  for update using (auth.uid() = id or public.is_teacher());

-- courses: catálogo público (incluso sin login); solo la profesora crea/edita/borra.
drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public" on public.courses
  for select using (true);

drop policy if exists "courses_write_teacher" on public.courses;
create policy "courses_write_teacher" on public.courses
  for all using (public.is_teacher()) with check (public.is_teacher());

-- enrollments: el alumno ve las suyas; la profesora ve y administra todas.
drop policy if exists "enrollments_select_own_or_teacher" on public.enrollments;
create policy "enrollments_select_own_or_teacher" on public.enrollments
  for select using (auth.uid() = student_id or public.is_teacher());

drop policy if exists "enrollments_write_teacher" on public.enrollments;
create policy "enrollments_write_teacher" on public.enrollments
  for all using (public.is_teacher()) with check (public.is_teacher());

-- class_sessions: el alumno ve las de cursos en los que está inscripto; la profesora ve y administra todas.
drop policy if exists "sessions_select_enrolled_or_teacher" on public.class_sessions;
create policy "sessions_select_enrolled_or_teacher" on public.class_sessions
  for select using (
    public.is_teacher()
    or exists (
      select 1 from public.enrollments e
      where e.course_id = class_sessions.course_id
        and e.student_id = auth.uid()
    )
  );

drop policy if exists "sessions_write_teacher" on public.class_sessions;
create policy "sessions_write_teacher" on public.class_sessions
  for all using (public.is_teacher()) with check (public.is_teacher());

-- attendance: el alumno ve la suya; la profesora ve y administra toda.
drop policy if exists "attendance_select_own_or_teacher" on public.attendance;
create policy "attendance_select_own_or_teacher" on public.attendance
  for select using (auth.uid() = student_id or public.is_teacher());

drop policy if exists "attendance_write_teacher" on public.attendance;
create policy "attendance_write_teacher" on public.attendance
  for all using (public.is_teacher()) with check (public.is_teacher());

-- materials: el alumno ve los de cursos en los que está inscripto; la profesora ve y administra todos.
drop policy if exists "materials_select_enrolled_or_teacher" on public.materials;
create policy "materials_select_enrolled_or_teacher" on public.materials
  for select using (
    public.is_teacher()
    or exists (
      select 1 from public.class_sessions cs
      join public.enrollments e on e.course_id = cs.course_id
      where cs.id = materials.session_id and e.student_id = auth.uid()
    )
  );

drop policy if exists "materials_write_teacher" on public.materials;
create policy "materials_write_teacher" on public.materials
  for all using (public.is_teacher()) with check (public.is_teacher());

-- tasks: el alumno ve las de cursos en los que está inscripto; la profesora ve y administra todas.
drop policy if exists "tasks_select_enrolled_or_teacher" on public.tasks;
create policy "tasks_select_enrolled_or_teacher" on public.tasks
  for select using (
    public.is_teacher()
    or exists (
      select 1 from public.class_sessions cs
      join public.enrollments e on e.course_id = cs.course_id
      where cs.id = tasks.session_id and e.student_id = auth.uid()
    )
  );

drop policy if exists "tasks_write_teacher" on public.tasks;
create policy "tasks_write_teacher" on public.tasks
  for all using (public.is_teacher()) with check (public.is_teacher());

-- library_items: cualquier usuario logueado (alumno o profesora) puede verlos; solo la profesora los administra.
drop policy if exists "library_select_authenticated" on public.library_items;
create policy "library_select_authenticated" on public.library_items
  for select using (auth.uid() is not null);

drop policy if exists "library_write_teacher" on public.library_items;
create policy "library_write_teacher" on public.library_items
  for all using (public.is_teacher()) with check (public.is_teacher());

-- ============ STORAGE: materiales de clase ============

insert into storage.buckets (id, name, public)
values ('materiales', 'materiales', true)
on conflict (id) do nothing;

drop policy if exists "materiales_read_public" on storage.objects;
create policy "materiales_read_public" on storage.objects
  for select using (bucket_id = 'materiales');

drop policy if exists "materiales_write_teacher" on storage.objects;
create policy "materiales_write_teacher" on storage.objects
  for all using (bucket_id = 'materiales' and public.is_teacher())
  with check (bucket_id = 'materiales' and public.is_teacher());
