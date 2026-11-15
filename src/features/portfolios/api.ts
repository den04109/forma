import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/features/auth/authStore'
import { createDemoDocument, templates } from '@/portfolio/templates'
import type { Portfolio, TemplateId } from '@/portfolio/types'

const NOT_ALLOWED = 'Портфолио не найдено или у вас нет прав на это действие'

function currentUserId(): string {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Требуется вход в аккаунт')
  return user.id
}

// Все операции явно привязаны к владельцу. RLS в БД остаётся второй линией защиты.
export async function listPortfolios(): Promise<Portfolio[]> {
  const { data, error } = await supabase
    .from('portfolios').select('*').eq('user_id', currentUserId()).order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as Portfolio[]
}

export async function createPortfolio(templateId: TemplateId): Promise<Portfolio> {
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id: currentUserId(),
      title: `Портфолио — ${templates[templateId].name}`,
      template_id: templateId,
      document: createDemoDocument(templateId),
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Portfolio
}

export async function deletePortfolio(id: string): Promise<void> {
  const { data, error } = await supabase.from('portfolios').delete().eq('id', id).eq('user_id', currentUserId()).select('id')
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error(NOT_ALLOWED)
}

// Для редактора: чужое портфолио (даже опубликованное) здесь не вернётся.
export async function getPortfolioById(id: string): Promise<Portfolio | null> {
  const { data, error } = await supabase.from('portfolios').select('*').eq('id', id).eq('user_id', currentUserId()).maybeSingle()
  if (error) throw new Error(error.message)
  return data as Portfolio | null
}

export type PublicPortfolio = Pick<Portfolio, 'id' | 'title' | 'slug' | 'template_id' | 'document' | 'published_at'>

// Публичная страница читает данные через функцию БД (см. миграцию 0002), а не прямым SELECT.
export async function getPublishedBySlug(slug: string): Promise<PublicPortfolio | null> {
  const { data, error } = await supabase.rpc('get_published_portfolio', { p_slug: slug })
  if (error) throw new Error(error.message)
  return ((data as PublicPortfolio[] | null) ?? [])[0] ?? null
}

// Без .select() запрос к строке, скрытой RLS, «успешно» ничего не меняет, поэтому считаем затронутые строки.
async function updateOwned(id: string, patch: Record<string, unknown>): Promise<void> {
  const { data, error } = await supabase.from('portfolios').update(patch).eq('id', id).eq('user_id', currentUserId()).select('id')
  if (error) throw new Error(error.code === '23505' ? 'Этот адрес уже занят' : error.message)
  if (!data || data.length === 0) throw new Error(NOT_ALLOWED)
}

export const updatePortfolio = (id: string, patch: { title: string; document: Portfolio['document'] }) => updateOwned(id, patch)
export const publishPortfolio = (id: string, slug: string) => updateOwned(id, { slug, status: 'published' })
export const unpublishPortfolio = (id: string) => updateOwned(id, { status: 'draft' })

export async function checkSlugAvailable(slug: string, portfolioId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_slug_available', { p_slug: slug, p_portfolio_id: portfolioId })
  if (error) throw new Error(error.message)
  return data === true
}
