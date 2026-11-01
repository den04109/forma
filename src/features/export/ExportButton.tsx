import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { PortfolioDocument } from '@/portfolio/types'
import { buildSiteHtml, downloadHtml } from './exportSite'

export function ExportButton({ getDocument, label = 'Скачать сайт' }: { getDocument: () => PortfolioDocument; label?: string }) {
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  const run = async () => {
    setBusy(true)
    setNote(null)
    try {
      const { html, failedImages } = await buildSiteHtml(getDocument())
      downloadHtml(html)
      setNote(failedImages > 0
        ? `Файл скачан, но ${failedImages} изображ. не удалось встроить: они останутся внешними ссылками.`
        : 'Файл index.html скачан. Загрузите его на любой хостинг.')
    } catch {
      setNote('Не удалось подготовить файл. Попробуйте ещё раз.')
    } finally {
      setBusy(false)
      window.setTimeout(() => setNote(null), 7000)
    }
  }

  return (
    <span className="relative inline-block">
      <Button variant="secondary" size="sm" loading={busy} onClick={() => void run()}>
        <Download className="h-3.5 w-3.5" aria-hidden />{label}
      </Button>
      {note && (
        <span role="status" className="absolute right-0 top-full z-30 mt-1 w-64 rounded-xl border border-line bg-white p-2.5 text-left text-xs font-normal text-ink-soft shadow-lg">
          {note}
        </span>
      )}
    </span>
  )
}
