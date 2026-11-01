import type { ContactBlock, SocialLinksBlock } from '@/portfolio/types'
import { isExternal, normalizeSocial, safeUrl } from '@/lib/utils/url'
import { has, Section } from './shared'

interface Item { label: string; href: string }

function LinkList({ id, title, items }: { id?: string; title?: string; items: Item[] }) {
  if (items.length === 0) return null
  return (
    <Section id={id} title={title}>
      <ul className="flex flex-wrap gap-3">
        {items.map((i) => (
          <li key={i.label + i.href}>
            <a href={i.href} className="f-btn" {...(isExternal(i.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{i.label}</a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function ContactView({ block }: { block: ContactBlock }) {
  const { email, phone, links, title } = block.data
  const items: Item[] = []
  if (has(email)) items.push({ label: email.trim(), href: `mailto:${email.trim()}` })
  if (has(phone)) items.push({ label: phone.trim(), href: `tel:${phone.replace(/[^\d+]/g, '')}` })
  for (const l of links) {
    const href = safeUrl(l.url)
    if (href) items.push({ label: has(l.label) ? l.label : l.url, href })
  }
  return <LinkList id="contact" title={title} items={items} />
}

export function SocialLinksView({ block }: { block: SocialLinksBlock }) {
  const d = block.data
  const named: [string, string | null][] = [
    ['GitHub', normalizeSocial('github', d.github)], ['Telegram', normalizeSocial('telegram', d.telegram)],
    ['VK', normalizeSocial('vk', d.vk)], ['LinkedIn', normalizeSocial('linkedin', d.linkedin)],
  ]
  const items: Item[] = named.flatMap(([label, href]) => (href ? [{ label, href }] : []))
  for (const l of d.custom) {
    const href = safeUrl(l.url)
    if (href) items.push({ label: has(l.label) ? l.label : l.url, href })
  }
  return <LinkList items={items} />
}
