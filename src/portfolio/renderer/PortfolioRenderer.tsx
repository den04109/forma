import type { CSSProperties } from 'react'
import type { PortfolioDocument, Theme } from '@/portfolio/types'
import { BlockView } from '@/portfolio/blocks'
import { readableOn } from '@/lib/utils/color'
import { EditCtx, type EditContextValue } from './editing'
import { fonts } from './fonts'
import './portfolio.css'

const radius: Record<Theme['radius'], [string, string]> = {
  none: ['0px', '0px'], sm: ['6px', '8px'], md: ['10px', '16px'], lg: ['16px', '24px'], full: ['9999px', '28px'],
}
const widths: Record<Theme['contentWidth'], string> = { narrow: '42rem', normal: '56rem', wide: '72rem' }

// Единый рендерер: используется и в предпросмотре редактора, и на публичной странице.
export function PortfolioRenderer({ document, editing }: { document: PortfolioDocument; editing?: EditContextValue }) {
  const { theme, blocks } = document
  const [btnRadius, cardRadius] = radius[theme.radius]
  const vars = {
    '--f-primary': theme.primaryColor,
    '--f-on-primary': readableOn(theme.primaryColor),
    '--f-bg': theme.backgroundColor,
    '--f-text': theme.textColor,
    '--f-font': fonts[theme.fontFamily],
    '--f-radius': btnRadius,
    '--f-radius-card': cardRadius,
    '--f-heading-scale': String(theme.headingScale),
  } as CSSProperties
  return (
    <EditCtx.Provider value={editing ?? null}>
    <div className="f-root" data-btn={theme.buttonStyle} style={vars}>
      <main className="mx-auto space-y-16 px-5 py-12 sm:py-16" style={{ maxWidth: widths[theme.contentWidth] }}>
        {blocks.filter((b) => !b.hidden).map((b) => <BlockView key={b.id} block={b} />)}
      </main>
    </div>
    </EditCtx.Provider>
  )
}
