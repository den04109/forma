import { useId } from 'react'
import { Button } from '@/components/ui/Button'
import { templates } from '@/portfolio/templates'
import type { Theme } from '@/portfolio/types'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils/cn'
import { Segmented, TextAreaField, TextField } from './fields'

const schemes = [
  { name: 'Фиолетовая', primaryColor: '#6a45f5', backgroundColor: '#ffffff', textColor: '#14121f' },
  { name: 'Океан', primaryColor: '#0b7285', backgroundColor: '#f8f9fa', textColor: '#212529' },
  { name: 'Апельсин', primaryColor: '#e8590c', backgroundColor: '#fff8f0', textColor: '#2b1a0f' },
  { name: 'Лес', primaryColor: '#2f9e44', backgroundColor: '#f4faf5', textColor: '#16241a' },
  { name: 'Роза', primaryColor: '#d6336c', backgroundColor: '#fff5f8', textColor: '#2b1020' },
  { name: 'Графит', primaryColor: '#212529', backgroundColor: '#ffffff', textColor: '#212529' },
  { name: 'Ночь', primaryColor: '#8b7bff', backgroundColor: '#14121f', textColor: '#f1f0f7' },
]

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-muted">{value}</span>
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 cursor-pointer rounded-lg border border-line bg-white p-0.5" />
      </div>
    </div>
  )
}

export function DesignPanel() {
  const theme = useEditorStore((s) => s.doc!.theme)
  const seo = useEditorStore((s) => s.doc!.seo)
  const templateId = useEditorStore((s) => s.meta!.templateId)
  const update = useEditorStore((s) => s.update)
  const setTheme = (patch: Partial<Theme>, key: string) => update((d) => ({ ...d, theme: { ...d.theme, ...patch } }), `theme:${key}`)
  const setSeo = (patch: Partial<typeof seo>, key: string) => update((d) => ({ ...d, seo: { ...d.seo, ...patch } }), `seo:${key}`)

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <span className="block text-sm font-semibold">Цветовые схемы</span>
        <div className="grid grid-cols-4 gap-2">
          {schemes.map((s) => {
            const active = s.primaryColor === theme.primaryColor && s.backgroundColor === theme.backgroundColor && s.textColor === theme.textColor
            return (
              <button key={s.name} type="button" aria-pressed={active} aria-label={s.name} title={s.name}
                onClick={() => setTheme({ primaryColor: s.primaryColor, backgroundColor: s.backgroundColor, textColor: s.textColor }, 'scheme')}
                className={cn('flex h-10 overflow-hidden rounded-xl border', active ? 'border-brand-600 ring-2 ring-brand-600' : 'border-line')}>
                <span className="w-1/2" style={{ background: s.backgroundColor }} />
                <span className="w-1/2" style={{ background: s.primaryColor }} />
              </button>
            )
          })}
        </div>
      </div>
      <ColorField label="Основной цвет" value={theme.primaryColor} onChange={(v) => setTheme({ primaryColor: v }, 'primary')} />
      <ColorField label="Цвет фона" value={theme.backgroundColor} onChange={(v) => setTheme({ backgroundColor: v }, 'bg')} />
      <ColorField label="Цвет текста" value={theme.textColor} onChange={(v) => setTheme({ textColor: v }, 'text')} />
      <Segmented label="Шрифт" value={theme.fontFamily} options={[['inter', 'Inter'], ['manrope', 'Manrope'], ['playfair', 'Playfair'], ['jetbrains', 'Mono']]} onChange={(v) => setTheme({ fontFamily: v }, 'font')} />
      <Segmented label="Размер заголовков" value={theme.headingScale} options={[[0.85, 'S'], [1, 'M'], [1.15, 'L'], [1.3, 'XL']]} onChange={(v) => setTheme({ headingScale: v }, 'scale')} />
      <Segmented label="Скругления" value={theme.radius} options={[['none', 'Нет'], ['sm', 'S'], ['md', 'M'], ['lg', 'L'], ['full', 'Круг']]} onChange={(v) => setTheme({ radius: v }, 'radius')} />
      <Segmented label="Стиль кнопок" value={theme.buttonStyle} options={[['solid', 'Заливка'], ['outline', 'Контур'], ['ghost', 'Мягкая']]} onChange={(v) => setTheme({ buttonStyle: v }, 'btn')} />
      <Segmented label="Ширина контента" value={theme.contentWidth} options={[['narrow', 'Узкая'], ['normal', 'Обычная'], ['wide', 'Широкая']]} onChange={(v) => setTheme({ contentWidth: v }, 'width')} />
      <Button variant="secondary" size="sm" className="w-full" onClick={() => setTheme(templates[templateId].theme, 'reset')}>Вернуть тему шаблона</Button>
      <div className="space-y-3 border-t border-line pt-4">
        <span className="block text-sm font-semibold">Для поисковиков</span>
        <TextField label="Заголовок страницы" value={seo.title} onChange={(v) => setSeo({ title: v.slice(0, 70) }, 'title')} />
        <TextAreaField label="Описание" rows={3} value={seo.description} onChange={(v) => setSeo({ description: v.slice(0, 160) }, 'desc')} hint="До 160 символов." />
      </div>
    </div>
  )
}
