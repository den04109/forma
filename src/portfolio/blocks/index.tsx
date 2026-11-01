import type { CSSProperties } from 'react'
import type { Block } from '@/portfolio/types'
import { fonts } from '@/portfolio/renderer/fonts'
import { HeroView } from './HeroBlock'
import { AboutView, CustomTextView } from './TextBlocks'
import { SkillsView } from './SkillsBlock'
import { ProjectsView } from './ProjectsBlock'
import { EducationView, ExperienceView } from './TimelineBlocks'
import { GalleryView } from './GalleryBlock'
import { ContactView, SocialLinksView } from './LinkBlocks'

function BlockInner({ block }: { block: Block }) {
  switch (block.type) {
    case 'hero': return <HeroView block={block} />
    case 'about': return <AboutView block={block} />
    case 'skills': return <SkillsView block={block} />
    case 'projects': return <ProjectsView block={block} />
    case 'experience': return <ExperienceView block={block} />
    case 'education': return <EducationView block={block} />
    case 'gallery': return <GalleryView block={block} />
    case 'contact': return <ContactView block={block} />
    case 'socialLinks': return <SocialLinksView block={block} />
    case 'customText': return <CustomTextView block={block} />
  }
}

const padding = { none: '0', sm: '1rem', md: '2rem', lg: '3rem' }

// Оформление конкретного блока поверх общей темы сайта.
export function BlockView({ block }: { block: Block }) {
  const st = block.style
  const css: Record<string, string | number> = {}
  if (st?.fontFamily) css.fontFamily = fonts[st.fontFamily]
  if (st?.scale && st.scale !== 1) css.zoom = st.scale
  if (st?.textColor) { css['--f-text'] = st.textColor; css.color = st.textColor }
  if (st?.bgColor) { css.background = st.bgColor; css.borderRadius = 'var(--f-radius-card)' }
  if (st?.align) css.textAlign = st.align
  const pad = st?.padding ?? (st?.bgColor ? 'md' : undefined)
  if (pad) css.padding = padding[pad]
  return <div className="f-block" style={css as CSSProperties}><BlockInner block={block} /></div>
}
