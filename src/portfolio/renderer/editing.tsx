import {
  createContext, useContext, useEffect, useRef, useState,
  type CSSProperties, type ElementType, type KeyboardEvent as ReactKeyboardEvent, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export interface EditContextValue {
  onEdit: (blockId: string, path: string, value: string) => void
  onResize: (blockId: string, itemId: string | null, field: string, value: number) => void
  onSelect?: (blockId: string) => void
}

// Вне редактора контекста нет: Editable рендерит обычный текст, ручек нет.
export const EditCtx = createContext<EditContextValue | null>(null)

interface Props {
  blockId?: string
  path: string
  value: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  multiline?: boolean
  display?: ReactNode
}

export function Editable({ blockId, path, value, as: Tag = 'span', className, style, multiline, display }: Props) {
  const ctx = useContext(EditCtx)
  if (!ctx || !blockId) return <Tag className={className} style={style}>{display ?? value}</Tag>
  return <EditableText ctx={ctx} blockId={blockId} path={path} value={value} as={Tag} className={className} style={style} multiline={multiline} display={display} />
}

const COLORS = ['#e03131', '#e8590c', '#2f9e44', '#1971c2', '#6a45f5', '#868e96']

// Панель форматирования: оборачивает выделенный текст разметкой, которую понимает FormattedText.
function FormatBar({ doc, top, left }: { doc: Document; top: number; left: number }) {
  const wrap = (open: string, close: string) => {
    const text = doc.defaultView?.getSelection()?.toString()
    if (text) doc.execCommand('insertText', false, `${open}${text}${close}`)
  }
  const btn = 'grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-sm hover:bg-black/10'
  return (
    <div role="toolbar" aria-label="Форматирование текста" onMouseDown={(e) => e.preventDefault()}
      style={{ position: 'absolute', top, left, zIndex: 50 }}
      className="flex items-center gap-0.5 rounded-xl border border-line bg-white p-1 text-ink shadow-lg">
      <button type="button" className={`${btn} font-bold`} title="Жирный" onClick={() => wrap('**', '**')}>B</button>
      <button type="button" className={`${btn} italic`} title="Курсив" onClick={() => wrap('*', '*')}>I</button>
      <button type="button" className={btn} title="Крупнее" onClick={() => wrap('{{+|', '}}')}>A+</button>
      <button type="button" className={`${btn} text-xs`} title="Мельче" onClick={() => wrap('{{-|', '}}')}>A−</button>
      {COLORS.map((c) => (
        <button key={c} type="button" aria-label={`Цвет ${c}`} className="grid h-7 w-6 place-items-center rounded-md hover:bg-black/10" onClick={() => wrap(`{{${c}|`, '}}')}>
          <span className="h-3.5 w-3.5 rounded-full" style={{ background: c }} />
        </button>
      ))}
    </div>
  )
}

function EditableText({ ctx, blockId, path, value, as: Tag = 'span', className, style, multiline, display }: Props & { ctx: EditContextValue; blockId: string }) {
  const ref = useRef<HTMLElement>(null)
  const [editing, setEditing] = useState(false)
  const [version, setVersion] = useState(0)
  const [bar, setBar] = useState<{ top: number; left: number; doc: Document } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!editing || !el) return
    el.focus()
    const doc = el.ownerDocument
    const win = doc.defaultView!
    const range = doc.createRange()
    range.selectNodeContents(el)
    if (multiline) range.collapse(false)
    win.getSelection()?.removeAllRanges()
    win.getSelection()?.addRange(range)
    if (multiline && display) {
      const r = el.getBoundingClientRect()
      setBar({ top: Math.max(4, r.top + win.scrollY - 44), left: Math.max(4, r.left + win.scrollX), doc })
    }
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps

  const finish = (commit: boolean) => {
    const el = ref.current
    if (commit && el) {
      const raw = el.innerText.replace(/\u00a0/g, ' ').replace(/\n+$/, '')
      const next = multiline ? raw : raw.replace(/\n/g, ' ')
      if (next !== value) ctx.onEdit(blockId, path, next)
    }
    setEditing(false)
    setBar(null)
    setVersion((v) => v + 1) // пересоздаём элемент, чтобы DOM снова совпал с состоянием
  }

  return (
    <>
      {bar && createPortal(<FormatBar doc={bar.doc} top={bar.top} left={bar.left} />, bar.doc.body)}
      <Tag
        key={version}
        ref={ref}
        className={`${className ?? ''} ${editing ? 'f-editing' : 'f-editable'}`}
        style={editing && multiline ? { ...style, whiteSpace: 'pre-wrap' } : style}
        title={editing ? undefined : 'Двойной щелчок — редактировать'}
        contentEditable={editing ? 'plaintext-only' : undefined}
        suppressContentEditableWarning
        onClick={() => ctx.onSelect?.(blockId)}
        onDoubleClick={() => setEditing(true)}
        onBlur={() => editing && finish(true)}
        onKeyDown={(e: ReactKeyboardEvent) => {
          if (!editing) return
          if (e.key === 'Escape') finish(false)
          else if (e.key === 'Enter' && !multiline && !e.shiftKey) { e.preventDefault(); finish(true) }
        }}
      >
        {editing ? value : (display ?? value)}
      </Tag>
    </>
  )
}

interface HandleProps {
  blockId: string
  itemId?: string
  field: string
  value: number
  mode: 'px' | 'percent'
  min: number
  max: number
}

// Ручка в правом нижнем углу родителя: тянем мышью или стрелками клавиатуры.
export function ResizeHandle({ blockId, itemId, field, value, mode, min, max }: HandleProps) {
  const ctx = useContext(EditCtx)
  const start = useRef<{ x: number; v: number; width: number } | null>(null)
  if (!ctx) return null
  const apply = (v: number) => ctx.onResize(blockId, itemId ?? null, field, Math.round(Math.min(max, Math.max(min, v))))
  return (
    <span
      role="slider" tabIndex={0} aria-label="Изменить размер"
      aria-valuemin={min} aria-valuemax={max} aria-valuenow={Math.round(value)}
      onPointerDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)
        const box = e.currentTarget.parentElement!
        start.current = { x: e.clientX, v: value, width: mode === 'percent' ? (box.parentElement?.clientWidth ?? box.clientWidth) : 1 }
      }}
      onPointerMove={(e) => {
        const s = start.current
        if (!s) return
        const dx = e.clientX - s.x
        apply(mode === 'px' ? s.v + dx : s.v + (dx / s.width) * 100)
      }}
      onPointerUp={() => { start.current = null }}
      onKeyDown={(e: ReactKeyboardEvent) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        e.preventDefault()
        apply(value + (e.key === 'ArrowRight' ? 1 : -1) * (mode === 'px' ? 8 : 5))
      }}
      style={{ position: 'absolute', right: 4, bottom: 4, width: 16, height: 16, cursor: 'nwse-resize', touchAction: 'none' }}
      className="rounded-sm border-2 border-white bg-[var(--f-primary)] shadow"
    />
  )
}
