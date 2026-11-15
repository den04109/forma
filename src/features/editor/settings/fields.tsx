import { useEffect, useId, useState, type ChangeEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { uploadImage } from '@/features/portfolios/storage'
import { cn } from '@/lib/utils/cn'

interface TextProps { label: string; value: string; onChange: (v: string) => void; placeholder?: string }

export const TextField = ({ label, value, onChange, placeholder }: TextProps) => (
  <Input label={label} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
)

export function TextAreaField({ label, value, onChange, hint, rows = 4 }: TextProps & { hint?: string; rows?: number }) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink-soft">{label}</label>
      <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-brand-600" />
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}

interface SegProps<T extends string | number> { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }

export function Segmented<T extends string | number>({ label, value, options, onChange }: SegProps<T>) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-ink-soft">{label}</span>
      <div role="group" aria-label={label} className="flex gap-1 rounded-xl border border-line bg-canvas p-1">
        {options.map(([v, text]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}
            className={cn('flex-1 rounded-lg px-2 py-1 text-xs font-medium', value === v ? 'bg-white text-brand-700 shadow-card' : 'text-ink-soft')}>
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

const parseTags = (s: string) => s.split(',').map((t) => t.trim())

// Список через запятую; локальный текст не даёт «съедать» запятые при вводе.
export function TagsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join(', '))
  useEffect(() => {
    if (parseTags(text).join('|') !== value.join('|')) setText(value.join(', '))
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return <TextField label={label} value={text} placeholder="Через запятую" onChange={(v) => { setText(v); onChange(parseTags(v)) }} />
}

export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError(null)
    try { onChange(await uploadImage(file)) }
    catch (err) { setError(err instanceof Error ? err.message : 'Не удалось загрузить файл') }
    finally { setBusy(false) }
  }
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-ink-soft">{label}</span>
      {value && <img src={value} alt="" className="h-24 w-full rounded-xl border border-line object-cover" />}
      <div className="flex gap-2">
        <label className={cn('inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-sm font-medium focus-within:outline-2 focus-within:outline-brand-600 hover:bg-canvas', busy && 'pointer-events-none opacity-50')}>
          <ImagePlus className="h-3.5 w-3.5" aria-hidden />{busy ? 'Загрузка...' : value ? 'Заменить' : 'Загрузить'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={pick} />
        </label>
        {value && <Button size="sm" variant="ghost" onClick={() => onChange('')}>Убрать</Button>}
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface ListProps<T extends { id: string }> {
  title: string
  addLabel: string
  items: T[]
  onChange: (items: T[]) => void
  makeNew: () => T
  renderItem: (item: T, set: (patch: Partial<T>) => void) => ReactNode
}

export function ItemList<T extends { id: string }>({ title, addLabel, items, onChange, makeNew, renderItem }: ListProps<T>) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...items]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold">{title}</span>
      {items.map((item, i) => (
        <div key={item.id} className="space-y-3 rounded-xl border border-line p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">№ {i + 1}</span>
            <div className="flex">
              <Button size="sm" variant="ghost" aria-label="Выше" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-3.5 w-3.5" aria-hidden /></Button>
              <Button size="sm" variant="ghost" aria-label="Ниже" disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-3.5 w-3.5" aria-hidden /></Button>
              <Button size="sm" variant="ghost" aria-label="Удалить" onClick={() => onChange(items.filter((x) => x.id !== item.id))}><Trash2 className="h-3.5 w-3.5" aria-hidden /></Button>
            </div>
          </div>
          {renderItem(item, (patch) => onChange(items.map((x) => (x.id === item.id ? { ...x, ...patch } : x))))}
        </div>
      ))}
      <Button variant="secondary" size="sm" className="w-full" onClick={() => onChange([...items, makeNew()])}>
        <Plus className="h-3.5 w-3.5" aria-hidden />{addLabel}
      </Button>
    </div>
  )
}

export function RangeField({ label, value, min, max, step = 1, unit = '', onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void
}) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex justify-between text-sm font-medium text-ink-soft">
        <span>{label}</span><span className="text-xs text-ink-muted">{value}{unit}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-600" />
    </div>
  )
}
