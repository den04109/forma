import type { SkillsBlock } from '@/portfolio/types'
import { has, Section } from './shared'

export function SkillsView({ block }: { block: SkillsBlock }) {
  const cats = block.data.categories
    .map((c) => ({ ...c, skills: c.skills.filter(has) }))
    .filter((c) => c.skills.length > 0)
  if (cats.length === 0) return null
  return (
    <Section blockId={block.id} title={block.data.title}>
      <div className="space-y-5">
        {cats.map((c) => (
          <div key={c.id}>
            {has(c.name) && <h3 className="f-muted mb-2 text-sm font-medium">{c.name}</h3>}
            <ul className="flex flex-wrap gap-2">{c.skills.map((s, i) => <li key={i} className="f-tag">{s}</li>)}</ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
