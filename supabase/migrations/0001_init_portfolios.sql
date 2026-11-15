-- Forma: схема портфолио, RLS и хранилище изображений

create extension if not exists pgcrypto;

create type public.portfolio_status as enum ('draft', 'published');

create table public.portfolios (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  title        text not null default 'Новое портфолио'
               check (char_length(title) between 1 and 120),
  slug         text unique
               check (
                 slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'
                 and slug !~ '--'
                 and slug not in ('app','login','register','admin','api','p','settings','new')
               ),
  status       public.portfolio_status not null default 'draft',
  template_id  text not null check (template_id in ('minimal', 'creative', 'professional')),
  document     jsonb not null default '{}'::jsonb
               check (octet_length(document::text) < 1000000),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz,
  -- опубликованное портфолио обязано иметь адрес
  constraint published_requires_slug check (status = 'draft' or slug is not null)
);

create index portfolios_user_updated_idx on public.portfolios (user_id, updated_at desc);
create index portfolios_published_idx on public.portfolios (slug) where status = 'published';

-- updated_at и published_at ведёт сервер, а не клиент
create or replace function public.portfolios_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
    new.published_at := now();
  elsif new.status = 'draft' then
    new.published_at := null;
  end if;
  if tg_op = 'UPDATE' then
    new.user_id := old.user_id;  -- владельца менять нельзя
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

create trigger portfolios_before_write
  before insert or update on public.portfolios
  for each row execute function public.portfolios_before_write();

-- Проверка доступности адреса. security definer нужен, потому что RLS
-- скрывает чужие черновики, а slug должен быть уникальным среди всех.
create or replace function public.is_slug_available(p_slug text, p_portfolio_id uuid default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.portfolios
    where slug = lower(p_slug)
      and (p_portfolio_id is null or id <> p_portfolio_id)
  );
$$;

revoke all on function public.is_slug_available(text, uuid) from public;
grant execute on function public.is_slug_available(text, uuid) to authenticated;

-- Row Level Security
alter table public.portfolios enable row level security;

create policy "owner can read own portfolios"
  on public.portfolios for select to authenticated
  using (auth.uid() = user_id);

create policy "anyone can read published portfolios"
  on public.portfolios for select to anon, authenticated
  using (status = 'published');

create policy "owner can create portfolios"
  on public.portfolios for insert to authenticated
  with check (auth.uid() = user_id);

create policy "owner can update own portfolios"
  on public.portfolios for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner can delete own portfolios"
  on public.portfolios for delete to authenticated
  using (auth.uid() = user_id);

-- Storage: публичный бакет, запись только в собственную папку <user_id>/...
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images', 'portfolio-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "owner can list own images"
  on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner can upload own images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner can update own images"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner can delete own images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-images' and (storage.foldername(name))[1] = auth.uid()::text);
