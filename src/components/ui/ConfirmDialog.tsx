import { useEffect, useRef } from 'react'
import { Button } from './Button'

interface Props {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, text, confirmLabel, loading, error, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); if (!loading) onCancel() }}
      className="w-[min(92vw,26rem)] rounded-2xl border border-line p-6 shadow-xl backdrop:bg-ink/40"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-ink-soft">{text}</p>
      {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>Отмена</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </dialog>
  )
}
