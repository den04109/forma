import { useCallback, useEffect, useState } from 'react'
import type { Portfolio } from '@/portfolio/types'
import { deletePortfolio, listPortfolios } from './api'

export function usePortfolios() {
  const [items, setItems] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await listPortfolios())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить портфолио')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void reload() }, [reload])

  const remove = useCallback(async (id: string) => {
    await deletePortfolio(id)
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { items, loading, error, reload, remove }
}
