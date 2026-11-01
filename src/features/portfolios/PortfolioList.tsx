import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ExportButton } from '@/features/export/ExportButton'
import { MiniPortfolio } from '@/components/shared/MiniPortfolio'
import { templates } from '@/portfolio/templates'
import type { Portfolio } from '@/portfolio/types'

interface Props {
  items: Portfolio[]
  loading: boolean
  error: string | null
  onReload: () => void
  onDelete: (id: string) => Promise<void>
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

export function PortfolioList({ items, loading, error, onReload, onDelete }: Props) {
  const [target, setTarget] = useState<Portfolio | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const confirmDelete = async () => {
    if (!target) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(target.id)
      setTarget(null)
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Не удалось удалить')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Загрузка">
        {[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-ink/5" />)}
      </div>
    )
  }
  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        <p>Не удалось загрузить портфолио: {error}</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={onReload}>Повторить</Button>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-brand-600" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold">Здесь появятся ваши портфолио</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">Выберите шаблон, и первая страница будет готова к редактированию за несколько секунд.</p>
        <Link to="/app/new" className="mt-5 inline-block"><Button>Создать портфолио</Button></Link>
      </div>
    )
  }

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <li key={p.id} className="rounded-2xl border border-line bg-white p-3 shadow-card">
            <MiniPortfolio variant={p.template_id} accent={p.document?.theme?.primaryColor ?? templates[p.template_id].accent} />
            <div className="mt-3 flex items-start justify-between gap-2 px-1">
              <h3 className="truncate font-medium">{p.title}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-ink/5 text-ink-soft'}`}>
                {p.status === 'published' ? 'Опубликовано' : 'Черновик'}
              </span>
            </div>
            <p className="px-1 text-xs text-ink-muted">Изменено: {formatDate(p.updated_at)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to={`/app/${p.id}/edit`}><Button size="sm"><Pencil className="h-3.5 w-3.5" aria-hidden />Редактировать</Button></Link>
              {p.status === 'published' && p.slug && (
                <a href={`${import.meta.env.BASE_URL}p/${p.slug}`} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="secondary"><ExternalLink className="h-3.5 w-3.5" aria-hidden />Открыть</Button>
                </a>
              )}
              <ExportButton getDocument={() => p.document} label="Скачать" />
              <Button size="sm" variant="ghost" aria-label={`Удалить «${p.title}»`} onClick={() => { setDeleteError(null); setTarget(p) }}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={target !== null}
        title="Удалить портфолио?"
        text={target ? `«${target.title}» будет удалено без возможности восстановления.` : ''}
        confirmLabel="Удалить"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  )
}
