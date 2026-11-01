import type { EducationBlock, ExperienceBlock } from '@/portfolio/types'
import { has, Section } from './shared'

interface Row { id: string; period: string; title: string; subtitle: string; text: string }

function Timeline({ title, rows, blockId }: { title: string; rows: Row[]; blockId: string }) {
  if (rows.length === 0) return null
  return (
    <Section blockId={blockId} title={title}>
      <ul className="space-y-6">
        {rows.map((r) => (
          <li key={r.id} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <p className="f-muted text-sm">{r.period}</p>
            <div>
              <h3 className="font-semibold">{r.title}</h3>
              {has(r.subtitle) && <p className="text-sm" style={{ color: 'var(--f-primary)' }}>{r.subtitle}</p>}
              {has(r.text) && <p className="f-muted mt-2 whitespace-pre-line text-sm leading-relaxed">{r.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function ExperienceView({ block }: { block: ExperienceBlock }) {
  const rows = block.data.items
    .filter((i) => has(i.position) || has(i.company))
    .map((i) => ({ id: i.id, period: i.period, title: has(i.position) ? i.position : i.company, subtitle: has(i.position) ? i.company : '', text: i.description }))
  return <Timeline blockId={block.id} title={block.data.title} rows={rows} />
}

export function EducationView({ block }: { block: EducationBlock }) {
  const rows = block.data.items
    .filter((i) => has(i.institution) || has(i.specialty))
    .map((i) => ({ id: i.id, period: i.period, title: has(i.institution) ? i.institution : i.specialty, subtitle: has(i.institution) ? i.specialty : '', text: i.details }))
  return <Timeline blockId={block.id} title={block.data.title} rows={rows} />
}
