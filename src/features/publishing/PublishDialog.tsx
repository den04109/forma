import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { saveNow } from '@/features/editor/autosave'
import { checkSlugAvailable, publishPortfolio, unpublishPortfolio } from '@/features/portfolios/api'
import { useEditorStore } from '@/store/editorStore'
import { slugSchema, suggestSlug } from './slug'

export function PublishDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const meta = useEditorStore((s) => s.meta)
  const setPublication = useEditorStore((s) => s.setPublication)
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      setSlug(meta?.slug ?? suggestSlug(meta?.title ?? ''))
      setError(null)
      setCopied(false)
    }
    if (!open && d.open) d.close()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!meta) return null
  const published = meta.status === 'published' && meta.slug
  const url = `${window.location.origin}${import.meta.env.BASE_URL}p/${meta.slug ?? slug}`

  const run = async (task: () => Promise<void>, fallback: string) => {
    setBusy(true)
    setError(null)
    try { await task() }
    catch (e) { setError(e instanceof Error ? e.message : fallback) }
    finally { setBusy(false) }
  }

  const publish = (e: FormEvent) => {
    e.preventDefault()
    const parsed = slugSchema.safeParse(slug.trim().toLowerCase())
    if (!parsed.success) return setError(parsed.error.issues[0].message)
    void run(async () => {
      if (!(await checkSlugAvailable(parsed.data, meta.id))) throw new Error('Этот адрес уже занят')
      await saveNow()
      if (useEditorStore.getState().saveStatus === 'error') throw new Error('Не удалось сохранить изменения. Попробуйте ещё раз')
      await publishPortfolio(meta.id, parsed.data)
      setPublication('published', parsed.data)
    }, 'Не удалось опубликовать')
  }

  const unpublish = () => void run(async () => {
    await unpublishPortfolio(meta.id)
    setPublication('draft', meta.slug)
  }, 'Не удалось снять с публикации')

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true) } catch { setError('Не удалось скопировать ссылку') }
  }

  return (
    <dialog ref={ref} onClose={onClose} className="w-[min(92vw,28rem)] rounded-2xl border border-line p-6 shadow-xl backdrop:bg-ink/40">
      {published ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Портфолио опубликовано</h2>
          <p className="break-all rounded-xl bg-canvas p-3 text-sm">{url}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void copy()}>
              {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}{copied ? 'Скопировано' : 'Копировать ссылку'}
            </Button>
            <a href={url} target="_blank" rel="noreferrer"><Button size="sm"><ExternalLink className="h-3.5 w-3.5" aria-hidden />Открыть</Button></a>
          </div>
          <p className="text-xs text-ink-muted">Новые изменения сохраняются автоматически и сразу видны посетителям.</p>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-between gap-2">
            <Button variant="danger" size="sm" loading={busy} onClick={unpublish}>Снять с публикации</Button>
            <Button variant="secondary" size="sm" onClick={onClose}>Закрыть</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={publish} noValidate className="space-y-4">
          <h2 className="text-lg font-semibold">Публикация</h2>
          <Input label="Адрес страницы" value={slug} onChange={(e) => setSlug(e.target.value)} autoComplete="off" spellCheck={false} />
          <p className="break-all text-xs text-ink-muted">Страница будет доступна по адресу: {window.location.origin}{import.meta.env.BASE_URL}p/{slug.trim().toLowerCase() || '…'}</p>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>Отмена</Button>
            <Button type="submit" loading={busy}>Опубликовать</Button>
          </div>
        </form>
      )}
    </dialog>
  )
}
