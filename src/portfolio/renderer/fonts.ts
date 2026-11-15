import type { Theme } from '@/portfolio/types'

export const fonts: Record<Theme['fontFamily'], string> = {
  inter: '"Inter Variable", system-ui, sans-serif',
  manrope: '"Manrope Variable", system-ui, sans-serif',
  playfair: '"Playfair Display Variable", Georgia, serif',
  jetbrains: '"JetBrains Mono Variable", ui-monospace, monospace',
}

// Имена семейств в @font-face (нужны при экспорте, чтобы встроить только используемые шрифты).
export const fontFaceNames: Record<Theme['fontFamily'], string> = {
  inter: 'Inter Variable',
  manrope: 'Manrope Variable',
  playfair: 'Playfair Display Variable',
  jetbrains: 'JetBrains Mono Variable',
}
