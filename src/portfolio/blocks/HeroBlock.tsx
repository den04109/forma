import type { HeroBlock } from '@/portfolio/types'
import { Editable, ResizeHandle } from '@/portfolio/renderer/editing'
import { isExternal, safeImageUrl, safeUrl } from '@/lib/utils/url'
import { has } from './shared'

const align = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' }
const layout = { left: 'flex-col md:flex-row', right: 'flex-col md:flex-row-reverse', top: 'flex-col items-center' }

export function HeroView({ block }: { block: HeroBlock }) {
  const d = block.data
  if (!has(d.name) && !has(d.profession) && !has(d.description)) return null
  const photo = safeImageUrl(d.photoUrl)
  const size = d.photoSize ?? 144
  const href = safeUrl(d.buttonUrl)
  const initials = d.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
  return (
    <section className={`flex gap-8 md:gap-12 ${layout[d.photoPosition]} md:items-center`}>
      {(photo || initials) && (
        <div className="relative grid shrink-0 place-items-center overflow-hidden rounded-[var(--f-radius-card)] font-semibold"
          style={{ width: size, height: size, maxWidth: '100%', fontSize: size * 0.28, background: 'color-mix(in srgb, var(--f-primary) 15%, transparent)', color: 'var(--f-primary)' }}>
          {photo ? <img src={photo} alt={d.name} className="h-full w-full object-cover" /> : initials}
          <ResizeHandle blockId={block.id} field="photoSize" value={size} mode="px" min={80} max={360} />
        </div>
      )}
      <div className={`flex min-w-0 flex-1 flex-col ${align[d.align]}`}>
        {has(d.name) && (
          <Editable as="h1" blockId={block.id} path="name" value={d.name} className="font-semibold tracking-tight"
            style={{ fontSize: 'calc(clamp(2rem, 6vw, 3.25rem) * var(--f-heading-scale))', lineHeight: 1.1 }} />
        )}
        {has(d.profession) && (
          <Editable as="p" blockId={block.id} path="profession" value={d.profession} className="mt-2 text-lg font-medium" style={{ color: 'var(--f-primary)' }} />
        )}
        {has(d.description) && (
          <Editable as="p" blockId={block.id} path="description" value={d.description} multiline className="f-muted mt-4 max-w-xl whitespace-pre-line leading-relaxed" />
        )}
        {has(d.buttonLabel) && href && (
          <a href={href} className="f-btn mt-6" {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{d.buttonLabel}</a>
        )}
      </div>
    </section>
  )
}
