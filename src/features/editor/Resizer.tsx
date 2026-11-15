import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

const MIN = 200
const MAX = 520
const clamp = (w: number) => Math.min(MAX, Math.max(MIN, w))

export function usePanelWidth(key: string, initial: number): [number, (w: number) => void] {
  const [width, setWidth] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(key))
      return saved ? clamp(saved) : initial
    } catch { return initial }
  })
  const set = useCallback((w: number) => {
    setWidth(w)
    try { localStorage.setItem(key, String(w)) } catch { /* хранилище недоступно */ }
  }, [key])
  return [width, set]
}

interface Props { side: 'left' | 'right'; label: string; width: number; onChange: (w: number) => void }

// Ручка изменения ширины боковой панели: мышь/касание и стрелки клавиатуры.
export function Resizer({ side, label, width, onChange }: Props) {
  const start = useRef<{ x: number; w: number } | null>(null)
  const dir = side === 'left' ? 1 : -1
  return (
    <div
      role="separator" aria-orientation="vertical" aria-label={label} tabIndex={0}
      aria-valuenow={width} aria-valuemin={MIN} aria-valuemax={MAX}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); start.current = { x: e.clientX, w: width } }}
      onPointerMove={(e) => { if (start.current) onChange(clamp(start.current.w + dir * (e.clientX - start.current.x))) }}
      onPointerUp={() => { start.current = null }}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        e.preventDefault()
        onChange(clamp(width + (e.key === 'ArrowRight' ? 1 : -1) * dir * 16))
      }}
      className={cn('absolute inset-y-0 z-10 hidden w-1.5 cursor-col-resize touch-none hover:bg-brand-500/40 focus-visible:bg-brand-500/60 lg:block', side === 'left' ? 'right-0' : 'left-0')}
    />
  )
}
