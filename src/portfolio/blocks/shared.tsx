import type { ReactNode } from 'react'
import { Editable } from '@/portfolio/renderer/editing'

export const has = (s: string) => s.trim().length > 0

export function Section({ id, title, blockId, children }: { id?: string; title?: string; blockId?: string; children: ReactNode }) {
  return (
    <section id={id}>
      {has(title ?? '') && (
        <Editable as="h2" blockId={blockId} path="title" value={title ?? ''} className="mb-6 font-semibold tracking-tight" style={{ fontSize: 'calc(1.5rem * var(--f-heading-scale))' }} />
      )}
      {children}
    </section>
  )
}

const TOKEN = /(\{\{(?:#[0-9a-fA-F]{6}|[+-])\|[^}]+\}\}|\*\*[^*]+\*\*|\*[^*]+\*)/g

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const m = /^\{\{(#[0-9a-fA-F]{6}|[+-])\|([^}]+)\}\}$/.exec(part)
    if (m) {
      const [, k, t] = m
      const style = k === '+' ? { fontSize: '1.3em' } : k === '-' ? { fontSize: '0.85em' } : { color: k }
      return <span key={i} style={style}>{t}</span>
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

// Простое форматирование: абзацы через пустую строку, **жирный**, *курсив*.
export function FormattedText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean)
  return (
    <div className="space-y-4 leading-relaxed">
      {paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line">{inline(p)}</p>)}
    </div>
  )
}
