-- Опубликованные портфолио читаются публичной страницей через функцию,
-- а не прямым SELECT. Тогда авторизованный пользователь на уровне БД
-- видит в таблице только СВОИ записи, даже если в клиенте забыли фильтр.

-- ЧАСТЬ 1. Безопасна, выполните первой (до обновления сайта).
create or replace function public.get_published_portfolio(p_slug text)
returns table (id uuid, title text, slug text, template_id text, document jsonb, published_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.title, p.slug, p.template_id, p.document, p.published_at
  from public.portfolios p
  where p.slug = lower(p_slug) and p.status = 'published'
  limit 1;
$$;

revoke all on function public.get_published_portfolio(text) from public;
grant execute on function public.get_published_portfolio(text) to anon, authenticated;

-- ЧАСТЬ 2. Выполните ПОСЛЕ того, как обновлённый сайт задеплоен и работает.
drop policy if exists "anyone can read published portfolios" on public.portfolios;
