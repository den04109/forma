import type { AboutBlock, CustomTextBlock } from '@/portfolio/types'
import { Editable } from '@/portfolio/renderer/editing'
import { FormattedText, has, Section } from './shared'

function TextView({ blockId, title, text }: { blockId: string; title: string; text: string }) {
  if (!has(text)) return null
  return (
    <Section blockId={blockId} title={title}>
      <Editable as="div" blockId={blockId} path="text" value={text} multiline display={<FormattedText text={text} />} />
    </Section>
  )
}

export const AboutView = ({ block }: { block: AboutBlock }) => <TextView blockId={block.id} {...block.data} />
export const CustomTextView = ({ block }: { block: CustomTextBlock }) => <TextView blockId={block.id} {...block.data} />
