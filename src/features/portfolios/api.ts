import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/features/auth/authStore'
import { createDemoDocument, templates } from '@/portfolio/templates'
import type { Portfolio, TemplateId } from '@/portfolio/types'

export async function listPortfolios(): Promise<Portfolio[]> {
  const { data, error } = await supabase.from('portfolios').select('*').order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as Portfolio[]
}

export async function createPortfolio(templateId: TemplateId): Promise<Portfolio> {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Требуется вход в аккаунт')
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id: user.id,
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
  const { error } = await supabase.from('portfolios').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getPortfolioById(id: string): Promise<Portfolio | null> {
  const { data, error } = await supabase.from('portfolios').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as Portfolio | null
}

export async function getPublishedBySlug(slug: string): Promise<Portfolio | null> {
  const { data, error } = await supabase
    .from('portfolios').select('*').eq('slug', slug.toLowerCase()).eq('status', 'published').maybeSingle()
  if (error) throw new Error(error.message)
  return data as Portfolio | null
}

export async function updatePortfolio(id: string, patch: { title: string; document: Portfolio['document'] }): Promise<void> {
  const { error } = await supabase.from('portfolios').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function checkSlugAvailable(slug: string, portfolioId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_slug_available', { p_slug: slug, p_portfolio_id: portfolioId })
  if (error) throw new Error(error.message)
  return data === true
}

export async function publishPortfolio(id: string, slug: string): Promise<void> {
  const { error } = await supabase.from('portfolios').update({ slug, status: 'published' }).eq('id', id)
  if (error) throw new Error(error.code === '23505' ? 'Этот адрес уже занят' : error.message)
}

export async function unpublishPortfolio(id: string): Promise<void> {
  const { error } = await supabase.from('portfolios').update({ status: 'draft' }).eq('id', id)
  if (error) throw new Error(error.message)
}
