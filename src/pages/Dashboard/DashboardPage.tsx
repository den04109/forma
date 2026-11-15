import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PortfolioList } from '@/features/portfolios/PortfolioList'
import { usePortfolios } from '@/features/portfolios/usePortfolios'
import { useAuthStore } from '@/features/auth/authStore'

export default function DashboardPage() {
  const email = useAuthStore((s) => s.user?.email ?? '')
  const { items, loading, error, reload, remove } = usePortfolios()
  const published = items.filter((p) => p.status === 'published').length
  const stats = [['Создано портфолио', items.length], ['Опубликовано', published]] as const

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Добро пожаловать, {email.split('@')[0]}</h1>
          <p className="text-sm text-ink-soft">Управляйте своими портфолио</p>
        </div>
        <Link to="/app/new"><Button>Создать портфолио</Button></Link>
      </div>
      <dl className="mt-6 grid max-w-md grid-cols-2 gap-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-4">
            <dt className="text-sm text-ink-soft">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{loading ? '—' : value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mb-4 mt-10 text-lg font-semibold">Мои портфолио</h2>
      <PortfolioList items={items} loading={loading} error={error} onReload={reload} onDelete={remove} />
    </div>
  )
}
