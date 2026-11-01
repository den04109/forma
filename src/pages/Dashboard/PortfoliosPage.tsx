import { PortfolioList } from '@/features/portfolios/PortfolioList'
import { usePortfolios } from '@/features/portfolios/usePortfolios'

export default function PortfoliosPage() {
  const { items, loading, error, reload, remove } = usePortfolios()
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Мои портфолио</h1>
      <PortfolioList items={items} loading={loading} error={error} onReload={reload} onDelete={remove} />
    </div>
  )
}
