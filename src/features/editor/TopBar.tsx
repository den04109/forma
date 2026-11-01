import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, Eye, Loader2, Redo2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ExportButton } from '@/features/export/ExportButton'
import { useEditorStore } from '@/store/editorStore'
import { saveNow } from './autosave'

export function TopBar({ onPreview, onPublish }: { onPreview: () => void; onPublish: () => void }) {
  const published = useEditorStore((s) => s.meta?.status === 'published')
  const title = useEditorStore((s) => s.meta?.title ?? '')
  const setTitle = useEditorStore((s) => s.setTitle)
  const status = useEditorStore((s) => s.saveStatus)
  const canUndo = useEditorStore((s) => s.past.length > 0)
  const canRedo = useEditorStore((s) => s.future.length > 0)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)

  return (
    <header className="flex h-14 items-center gap-3 border-b border-line bg-white px-3">
      <Link to="/app" aria-label="В личный кабинет" className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-canvas">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-600 text-xs font-bold text-white">F</span>
      </Link>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, 120))}
        aria-label="Название портфолио"
        className="min-w-0 flex-1 rounded-lg border border-transparent px-2 py-1 text-sm font-medium hover:border-line focus:border-brand-600 sm:max-w-xs"
      />
      <p role="status" className="hidden items-center gap-1.5 text-xs text-ink-soft sm:flex">
        {status === 'saving' && <><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />Сохранение...</>}
        {status === 'saved' && <><Check className="h-3.5 w-3.5 text-green-600" aria-hidden />Все изменения сохранены</>}
        {status === 'error' && (
          <>
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" aria-hidden /><span className="text-red-700">Ошибка сохранения</span>
            <button onClick={() => void saveNow()} className="font-medium text-brand-700 underline">Повторить</button>
          </>
        )}
      </p>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="sm" aria-label="Отменить" disabled={!canUndo} onClick={undo}><Undo2 className="h-4 w-4" aria-hidden /></Button>
        <Button variant="ghost" size="sm" aria-label="Повторить" disabled={!canRedo} onClick={redo}><Redo2 className="h-4 w-4" aria-hidden /></Button>
        <Button variant="secondary" size="sm" onClick={onPreview}><Eye className="h-4 w-4" aria-hidden />Просмотр</Button>
        <ExportButton getDocument={() => useEditorStore.getState().doc!} label="Скачать" />
        <Button size="sm" onClick={onPublish}>{published ? 'Опубликовано' : 'Опубликовать'}</Button>
      </div>
    </header>
  )
}
