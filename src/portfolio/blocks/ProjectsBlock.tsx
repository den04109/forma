import type { ProjectsBlock } from '@/portfolio/types'
import { isExternal, safeImageUrl, safeUrl } from '@/lib/utils/url'
import { ResizeHandle } from '@/portfolio/renderer/editing'
import { has, Section } from './shared'

export function ProjectsView({ block }: { block: ProjectsBlock }) {
  const items = block.data.items.filter((p) => has(p.name))
  if (items.length === 0) return null
  return (
    <Section blockId={block.id} title={block.data.title}>
      <ul className="grid gap-5 sm:grid-cols-2">
        {items.map((p) => {
          const img = safeImageUrl(p.imageUrl)
          const href = safeUrl(p.url)
          return (
            <li key={p.id} className="f-card flex flex-col gap-3">
              {img && (
                <div className="relative" style={{ width: `${p.imageWidth ?? 100}%` }}>
                  <img src={img} alt="" loading="lazy" decoding="async" className="aspect-video w-full rounded-[var(--f-radius)] object-cover" />
                  <ResizeHandle blockId={block.id} itemId={p.id} field="imageWidth" value={p.imageWidth ?? 100} mode="percent" min={30} max={100} />
                </div>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {has(p.description) && <p className="f-muted whitespace-pre-line text-sm leading-relaxed">{p.description}</p>}
              {p.tags.filter(has).length > 0 && (
                <ul className="flex flex-wrap gap-1.5">{p.tags.filter(has).map((t, i) => <li key={i} className="f-tag">{t}</li>)}</ul>
              )}
              {href && <a href={href} className="f-link mt-auto text-sm" {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>Открыть проект →</a>}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
