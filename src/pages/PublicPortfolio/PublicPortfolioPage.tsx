import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { getPublishedBySlug, type PublicPortfolio } from '@/features/portfolios/api'
import { PortfolioRenderer } from '@/portfolio/renderer/PortfolioRenderer'

type State = { status: 'loading' } | { status: 'error' } | { status: 'notFound' } | { status: 'ok'; portfolio: PublicPortfolio }

function setMeta(description: string) {
  let el = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!el) {
    el = document.createElement('meta')
    el.name = 'description'
    document.head.appendChild(el)
  }
  el.content = description
}

export default function PublicPortfolioPage() {
  const { slug = '' } = useParams()
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    getPublishedBySlug(slug)
      .then((p) => !cancelled && setState(p?.document?.blocks ? { status: 'ok', portfolio: p } : { status: 'notFound' }))
      .catch(() => !cancelled && setState({ status: 'error' }))
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (state.status !== 'ok') return
    const { seo } = state.portfolio.document
    const prevTitle = document.title
    document.title = seo.title || state.portfolio.title
    setMeta(seo.description)
    return () => { document.title = prevTitle }
  }, [state])

  if (state.status === 'ok') return <PortfolioRenderer document={state.portfolio.document} />
  if (state.status === 'loading') {
    return <div className="grid min-h-screen place-items-center" role="status" aria-label="Загрузка"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>
  }
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">{state.status === 'notFound' ? 'Портфолио не найдено' : 'Не удалось загрузить страницу'}</h1>
        <p className="mt-2 text-sm text-ink-soft">{state.status === 'notFound' ? 'Возможно, адрес изменился или страница снята с публикации.' : 'Проверьте соединение и обновите страницу.'}</p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline">На главную Forma</Link>
      </div>
    </main>
  )
}
