import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { MiniPortfolio } from '@/components/shared/MiniPortfolio'
import { createPortfolio } from '@/features/portfolios/api'
import { templateList } from '@/portfolio/templates'
import type { TemplateId } from '@/portfolio/types'

export default function TemplateSelectionPage() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState<TemplateId | null>(null)
  const [error, setError] = useState<string | null>(null)

  const choose = async (id: TemplateId) => {
    setBusy(id)
    setError(null)
    try {
      const created = await createPortfolio(id)
      navigate(`/app/${created.id}/edit`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось создать портфолио')
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight">Выберите шаблон</h1>
      <p className="mt-1 text-sm text-ink-soft">Демонстрационные данные можно будет заменить своими.</p>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {templateList.map((t) => (
          <li key={t.id} className="rounded-2xl border border-line bg-white p-3 shadow-card">
            <MiniPortfolio variant={t.id} accent={t.accent} />
            <h2 className="mt-3 px-1 font-medium">{t.name}</h2>
            <p className="px-1 text-sm text-ink-soft">{t.description}</p>
            <Button className="mt-3 w-full" loading={busy === t.id} disabled={busy !== null} onClick={() => void choose(t.id)}>
              Использовать шаблон
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
