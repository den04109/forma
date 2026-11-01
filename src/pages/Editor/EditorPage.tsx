import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getPortfolioById } from '@/features/portfolios/api'
import { useAutosave } from '@/features/editor/autosave'
import { BlocksPanel } from '@/features/editor/BlocksPanel'
import { DesignPanel } from '@/features/editor/settings/DesignPanel'
import { PublishDialog } from '@/features/publishing/PublishDialog'
import { Resizer, usePanelWidth } from '@/features/editor/Resizer'
import type { Block } from '@/portfolio/types'
import { PreviewFrame } from '@/features/editor/PreviewFrame'
import { TopBar } from '@/features/editor/TopBar'
import { BlockSettings } from '@/features/editor/settings/BlockSettings'
import { blockLabels } from '@/portfolio/blocks/defaults'
import { PortfolioRenderer } from '@/portfolio/renderer/PortfolioRenderer'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils/cn'

const devices = [
  { id: 'desktop', label: 'Компьютер', icon: Monitor, width: '100%' },
  { id: 'mobile', label: 'Смартфон', icon: Smartphone, width: '390px' },
] as const

function Editor() {
  useAutosave()
  const doc = useEditorStore((s) => s.doc)
  const selected = useEditorStore((s) => s.doc?.blocks.find((b) => b.id === s.selectedId))
  const [device, setDevice] = useState<(typeof devices)[number]['id']>('desktop')
  const [fullPreview, setFullPreview] = useState(false)
  const [tab, setTab] = useState<'block' | 'design'>('block')
  const [publishOpen, setPublishOpen] = useState(false)
  const [leftW, setLeftW] = usePanelWidth('forma.leftW', 260)
  const [rightW, setRightW] = usePanelWidth('forma.rightW', 300)
  const update = useEditorStore((s) => s.update)
  const select = useEditorStore((s) => s.select)
  const onEdit = useCallback((blockId: string, path: string, value: string) => update((d) => ({
    ...d,
    blocks: d.blocks.map((b) => (b.id === blockId ? ({ ...b, data: { ...b.data, [path]: value } } as unknown as Block) : b)),
  }), `${blockId}:${path}`), [update])
  const onResize = useCallback((blockId: string, itemId: string | null, field: string, value: number) => update((d) => ({
    ...d,
    blocks: d.blocks.map((b) => {
      if (b.id !== blockId) return b
      const data = b.data as unknown as Record<string, unknown>
      if (!itemId) return { ...b, data: { ...data, [field]: value } } as unknown as Block
      const items = (data.items as { id: string }[]).map((i) => (i.id === itemId ? { ...i, [field]: value } : i))
      return { ...b, data: { ...data, items } } as unknown as Block
    }),
  }), `${blockId}:${itemId ?? ''}:${field}`), [update])
  const editing = useMemo(() => ({ onEdit, onResize, onSelect: select }), [onEdit, onResize, select])
  const selectedId = selected?.id
  useEffect(() => { if (selectedId) setTab('block') }, [selectedId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        const { undo, redo } = useEditorStore.getState()
        if (e.shiftKey) redo()
        else undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!doc) return null
  const width = devices.find((d) => d.id === device)!.width

  const renderPreview = (editable: boolean) => (
    <section aria-label="Предпросмотр" className="flex min-h-[70vh] flex-1 flex-col items-center gap-3 bg-canvas p-4 lg:min-h-0">
      <div role="group" aria-label="Устройство" className="flex gap-1 rounded-xl border border-line bg-white p-1">
        {devices.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setDevice(id)} aria-pressed={device === id} aria-label={label}
            className={cn('rounded-lg p-1.5', device === id ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-canvas')}>
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        ))}
      </div>
      <div className="flex min-h-0 w-full flex-1 justify-center">
        <PreviewFrame width={width}><PortfolioRenderer document={doc} editing={editable ? editing : undefined} /></PreviewFrame>
      </div>
    </section>
  )

  if (fullPreview) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2 text-sm">
          <span>Режим просмотра</span>
          <Button size="sm" onClick={() => setFullPreview(false)}>Вернуться к редактированию</Button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{renderPreview(false)}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col lg:h-screen">
      <TopBar onPreview={() => setFullPreview(true)} onPublish={() => setPublishOpen(true)} />
      <div className="grid min-h-0 flex-1 lg:grid-cols-[var(--lw)_minmax(0,1fr)_var(--rw)]" style={{ '--lw': `${leftW}px`, '--rw': `${rightW}px` } as CSSProperties}>
        <div className="relative min-h-0"><aside aria-label="Структура" className="overflow-y-auto border-b border-line bg-white p-3 lg:h-full lg:border-b-0 lg:border-r"><BlocksPanel /></aside><Resizer side="left" label="Ширина панели структуры" width={leftW} onChange={setLeftW} /></div>
        {renderPreview(true)}
        <div className="relative min-h-0"><aside aria-label="Настройки" className="overflow-y-auto lg:h-full border-t border-line bg-white p-3 lg:border-l lg:border-t-0">
          <div role="group" aria-label="Раздел настроек" className="mb-4 flex gap-1 rounded-xl border border-line bg-canvas p-1">
            {([['block', 'Блок'], ['design', 'Дизайн']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id}
                className={cn('flex-1 rounded-lg px-2 py-1 text-sm font-medium', tab === id ? 'bg-white text-brand-700 shadow-card' : 'text-ink-soft')}>{label}</button>
            ))}
          </div>
          {tab === 'design' ? (
            <DesignPanel />
          ) : selected ? (
            <>
              <h2 className="mb-4 text-sm font-semibold">{blockLabels[selected.type]}</h2>
              <BlockSettings key={selected.id} block={selected} />
            </>
          ) : (
            <p className="text-sm text-ink-soft">Выберите блок в списке слева, чтобы изменить его содержимое.</p>
          )}
        </aside><Resizer side="right" label="Ширина панели настроек" width={rightW} onChange={setRightW} /></div>
      </div>
      <PublishDialog open={publishOpen} onClose={() => setPublishOpen(false)} />
    </div>
  )
}

export default function EditorPage() {
  const { id = '' } = useParams()
  const [state, setState] = useState<'loading' | 'ok' | 'missing' | 'error'>('loading')
  const load = useEditorStore((s) => s.load)

  useEffect(() => {
    setState('loading')
    getPortfolioById(id)
      .then((p) => {
        if (!p?.document?.blocks) return setState('missing')
        load(p)
        setState('ok')
      })
      .catch(() => setState('error'))
  }, [id, load])

  if (state === 'loading') return <div className="grid min-h-screen place-items-center" role="status" aria-label="Загрузка"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>
  if (state !== 'ok') {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <p className="font-medium">{state === 'missing' ? 'Портфолио не найдено' : 'Не удалось загрузить редактор'}</p>
          <Link to="/app" className="mt-2 inline-block text-sm text-brand-700 hover:underline">В личный кабинет</Link>
        </div>
      </main>
    )
  }
  return <Editor />
}
