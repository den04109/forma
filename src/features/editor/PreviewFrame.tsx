import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// Предпросмотр в iframe: медиазапросы и адаптивная вёрстка работают по ширине устройства.
export function PreviewFrame({ width, children }: { width: string; children: ReactNode }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [mount, setMount] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const doc = ref.current?.contentDocument
    if (!doc) return
    doc.open()
    doc.write('<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="root"></div></body></html>')
    doc.close()
    document.head.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => doc.head.appendChild(n.cloneNode(true)))
    setMount(doc.getElementById('root'))
  }, [])

  return (
    <>
      <iframe ref={ref} title="Предпросмотр портфолио" style={{ width }} className="max-w-full rounded-xl border border-line bg-white shadow-card transition-[width] duration-200" />
      {mount && createPortal(children, mount)}
    </>
  )
}
