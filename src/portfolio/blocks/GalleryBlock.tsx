import type { GalleryBlock } from '@/portfolio/types'
import { safeImageUrl } from '@/lib/utils/url'
import { has, Section } from './shared'

const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

export function GalleryView({ block }: { block: GalleryBlock }) {
  const items = block.data.items.map((i) => ({ ...i, src: safeImageUrl(i.imageUrl) })).filter((i) => i.src)
  if (items.length === 0) return null
  return (
    <Section blockId={block.id} title={block.data.title}>
      <ul className={`grid grid-cols-1 gap-4 ${cols[block.data.columns]}`}>
        {items.map((i) => (
          <li key={i.id}>
            <figure>
              <img src={i.src!} alt={i.title} loading="lazy" decoding="async" className="aspect-square w-full rounded-[var(--f-radius-card)] object-cover" />
              {(has(i.title) || has(i.caption)) && (
                <figcaption className="mt-2 text-sm">
                  {has(i.title) && <span className="font-medium">{i.title}</span>}
                  {has(i.caption) && <span className="f-muted block">{i.caption}</span>}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}
