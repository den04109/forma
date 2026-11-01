import { useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'
import type {
  AboutBlock, Block, ContactBlock, CustomTextBlock, EducationBlock, ExperienceBlock, GalleryBlock,
  BlockStyle, HeroBlock, Link, ProjectsBlock, SkillsBlock, SocialLinksBlock,
} from '@/portfolio/types'
import { Button } from '@/components/ui/Button'
import { ColorField } from './DesignPanel'
import { ImageField, ItemList, RangeField, Segmented, TagsField, TextAreaField, TextField } from './fields'

type Setter<B extends Block> = (patch: Partial<B['data']>, key: string) => void
interface P<B extends Block> { block: B; set: Setter<B> }

const uid = () => crypto.randomUUID()
const FORMAT_HINT = 'Абзацы разделяйте пустой строкой. Двойной щелчок по тексту в превью открывает панель форматирования: жирный, курсив, размер и цвет выделенного.'

function LinksEditor({ items, onChange }: { items: Link[]; onChange: (l: Link[]) => void }) {
  return (
    <ItemList title="Дополнительные ссылки" addLabel="Добавить ссылку" items={items} onChange={onChange}
      makeNew={() => ({ id: uid(), label: '', url: '' })}
      renderItem={(l, s) => (
        <>
          <TextField label="Название" value={l.label} onChange={(v) => s({ label: v })} />
          <TextField label="Адрес" value={l.url} placeholder="https://" onChange={(v) => s({ url: v })} />
        </>
      )} />
  )
}

function HeroForm({ block, set }: P<HeroBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Имя" value={d.name} onChange={(v) => set({ name: v }, 'name')} />
      <TextField label="Профессия" value={d.profession} onChange={(v) => set({ profession: v }, 'profession')} />
      <TextAreaField label="Краткое описание" value={d.description} onChange={(v) => set({ description: v }, 'description')} />
      <ImageField label="Фотография" value={d.photoUrl} onChange={(v) => set({ photoUrl: v }, 'photo')} />
      <RangeField label="Размер фото" min={80} max={360} step={8} unit=" px" value={d.photoSize ?? 144} onChange={(v) => set({ photoSize: v }, 'photoSize')} />
      <TextField label="Текст кнопки" value={d.buttonLabel} onChange={(v) => set({ buttonLabel: v }, 'btnLabel')} />
      <TextField label="Ссылка кнопки" value={d.buttonUrl} placeholder="https://… или #contact" onChange={(v) => set({ buttonUrl: v }, 'btnUrl')} />
      <Segmented label="Выравнивание текста" value={d.align} options={[['left', 'Слева'], ['center', 'По центру'], ['right', 'Справа']]} onChange={(v) => set({ align: v }, 'align')} />
      <Segmented label="Положение фото" value={d.photoPosition} options={[['left', 'Слева'], ['right', 'Справа'], ['top', 'Сверху']]} onChange={(v) => set({ photoPosition: v }, 'pos')} />
    </>
  )
}

function TextForm({ block, set }: P<AboutBlock | CustomTextBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <TextAreaField label="Текст" rows={8} hint={FORMAT_HINT} value={d.text} onChange={(v) => set({ text: v }, 'text')} />
    </>
  )
}

function SkillsForm({ block, set }: P<SkillsBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <ItemList title="Категории" addLabel="Добавить категорию" items={d.categories} onChange={(categories) => set({ categories }, 'items')}
        makeNew={() => ({ id: uid(), name: '', skills: [] })}
        renderItem={(c, s) => (
          <>
            <TextField label="Название категории" value={c.name} onChange={(v) => s({ name: v })} />
            <TagsField label="Навыки" value={c.skills} onChange={(skills) => s({ skills })} />
          </>
        )} />
    </>
  )
}

function ProjectsForm({ block, set }: P<ProjectsBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <ItemList title="Проекты" addLabel="Добавить проект" items={d.items} onChange={(items) => set({ items }, 'items')}
        makeNew={() => ({ id: uid(), name: '', description: '', imageUrl: '', url: '', tags: [] })}
        renderItem={(p, s) => (
          <>
            <TextField label="Название" value={p.name} onChange={(v) => s({ name: v })} />
            <TextAreaField label="Описание" rows={3} value={p.description} onChange={(v) => s({ description: v })} />
            <ImageField label="Изображение" value={p.imageUrl} onChange={(v) => s({ imageUrl: v })} />
            <RangeField label="Ширина изображения" min={30} max={100} step={5} unit="%" value={p.imageWidth ?? 100} onChange={(v) => s({ imageWidth: v })} />
            <TextField label="Ссылка на проект" value={p.url} placeholder="https://" onChange={(v) => s({ url: v })} />
            <TagsField label="Технологии и инструменты" value={p.tags} onChange={(tags) => s({ tags })} />
          </>
        )} />
    </>
  )
}

function ExperienceForm({ block, set }: P<ExperienceBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <ItemList title="Места работы" addLabel="Добавить место работы" items={d.items} onChange={(items) => set({ items }, 'items')}
        makeNew={() => ({ id: uid(), company: '', position: '', period: '', description: '' })}
        renderItem={(i, s) => (
          <>
            <TextField label="Компания" value={i.company} onChange={(v) => s({ company: v })} />
            <TextField label="Должность" value={i.position} onChange={(v) => s({ position: v })} />
            <TextField label="Период" value={i.period} placeholder="2021 — 2024" onChange={(v) => s({ period: v })} />
            <TextAreaField label="Описание" rows={3} value={i.description} onChange={(v) => s({ description: v })} />
          </>
        )} />
    </>
  )
}

function EducationForm({ block, set }: P<EducationBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <ItemList title="Образование" addLabel="Добавить запись" items={d.items} onChange={(items) => set({ items }, 'items')}
        makeNew={() => ({ id: uid(), institution: '', specialty: '', period: '', details: '' })}
        renderItem={(i, s) => (
          <>
            <TextField label="Учебное заведение" value={i.institution} onChange={(v) => s({ institution: v })} />
            <TextField label="Специальность" value={i.specialty} onChange={(v) => s({ specialty: v })} />
            <TextField label="Период" value={i.period} onChange={(v) => s({ period: v })} />
            <TextAreaField label="Дополнительно" rows={3} value={i.details} onChange={(v) => s({ details: v })} />
          </>
        )} />
    </>
  )
}

function GalleryForm({ block, set }: P<GalleryBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <Segmented label="Колонок в сетке" value={d.columns} options={[[2, '2'], [3, '3'], [4, '4']]} onChange={(v) => set({ columns: v }, 'cols')} />
      <ItemList title="Изображения" addLabel="Добавить изображение" items={d.items} onChange={(items) => set({ items }, 'items')}
        makeNew={() => ({ id: uid(), imageUrl: '', title: '', caption: '' })}
        renderItem={(i, s) => (
          <>
            <ImageField label="Файл" value={i.imageUrl} onChange={(v) => s({ imageUrl: v })} />
            <TextField label="Название" value={i.title} onChange={(v) => s({ title: v })} />
            <TextField label="Подпись" value={i.caption} onChange={(v) => s({ caption: v })} />
          </>
        )} />
    </>
  )
}

function ContactForm({ block, set }: P<ContactBlock>) {
  const d = block.data
  return (
    <>
      <TextField label="Заголовок" value={d.title} onChange={(v) => set({ title: v }, 'title')} />
      <TextField label="Электронная почта" value={d.email} onChange={(v) => set({ email: v }, 'email')} />
      <TextField label="Телефон (необязательно)" value={d.phone} onChange={(v) => set({ phone: v }, 'phone')} />
      <LinksEditor items={d.links} onChange={(links) => set({ links }, 'links')} />
    </>
  )
}

function SocialForm({ block, set }: P<SocialLinksBlock>) {
  const d = block.data
  return (
    <>
      <p className="text-xs text-ink-muted">Можно указать ник или полную ссылку.</p>
      <TextField label="GitHub" value={d.github} onChange={(v) => set({ github: v }, 'github')} />
      <TextField label="Telegram" value={d.telegram} onChange={(v) => set({ telegram: v }, 'telegram')} />
      <TextField label="VK" value={d.vk} onChange={(v) => set({ vk: v }, 'vk')} />
      <TextField label="LinkedIn" value={d.linkedin} onChange={(v) => set({ linkedin: v }, 'linkedin')} />
      <LinksEditor items={d.custom} onChange={(custom) => set({ custom }, 'custom')} />
    </>
  )
}

function StyleControls({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.update)
  const theme = useEditorStore((s) => s.doc!.theme)
  const st = block.style ?? {}
  const setStyle = (patch: Partial<BlockStyle>, key: string) =>
    update((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === block.id ? { ...b, style: { ...b.style, ...patch } } : b)) }), `${block.id}:style:${key}`)
  const reset = () => update((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === block.id ? { ...b, style: undefined } : b)) }))
  return (
    <div className="space-y-4 border-t border-line pt-4">
      <span className="block text-sm font-semibold">Оформление блока</span>
      <Segmented label="Шрифт блока" value={st.fontFamily ?? ''}
        options={[['', 'Сайт'], ['inter', 'Inter'], ['manrope', 'Manrope'], ['playfair', 'Playfair'], ['jetbrains', 'Mono']]}
        onChange={(v) => setStyle({ fontFamily: v === '' ? undefined : v }, 'font')} />
      <Segmented label="Масштаб текста и элементов" value={st.scale ?? 1}
        options={[[0.85, '85%'], [1, '100%'], [1.15, '115%'], [1.3, '130%'], [1.5, '150%']]}
        onChange={(v) => setStyle({ scale: v === 1 ? undefined : v }, 'scale')} />
      <Segmented label="Выравнивание" value={st.align ?? ''}
        options={[['', 'Авто'], ['left', 'Слева'], ['center', 'Центр'], ['right', 'Справа']]}
        onChange={(v) => setStyle({ align: v === '' ? undefined : v }, 'align')} />
      <Segmented label="Внутренние отступы" value={st.padding ?? ''}
        options={[['', 'Авто'], ['none', 'Нет'], ['sm', 'S'], ['md', 'M'], ['lg', 'L']]}
        onChange={(v) => setStyle({ padding: v === '' ? undefined : v }, 'padding')} />
      <ColorField label="Цвет текста" value={st.textColor ?? theme.textColor} onChange={(v) => setStyle({ textColor: v }, 'color')} />
      <ColorField label="Фон блока" value={st.bgColor ?? theme.backgroundColor} onChange={(v) => setStyle({ bgColor: v }, 'bg')} />
      {block.style && <Button variant="secondary" size="sm" className="w-full" onClick={reset}>Сбросить оформление блока</Button>}
    </div>
  )
}

export function BlockSettings({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.update)
  const set = useCallback(
    (patch: Record<string, unknown>, key: string) =>
      update((d) => ({
        ...d,
        blocks: d.blocks.map((b) => (b.id === block.id ? ({ ...b, data: { ...b.data, ...patch } } as unknown as Block) : b)),
      }), `${block.id}:${key}`),
    [update, block.id],
  )
  return (
    <div className="space-y-4">
      {block.type === 'hero' && <HeroForm block={block} set={set} />}
      {(block.type === 'about' || block.type === 'customText') && <TextForm block={block} set={set} />}
      {block.type === 'skills' && <SkillsForm block={block} set={set} />}
      {block.type === 'projects' && <ProjectsForm block={block} set={set} />}
      {block.type === 'experience' && <ExperienceForm block={block} set={set} />}
      {block.type === 'education' && <EducationForm block={block} set={set} />}
      {block.type === 'gallery' && <GalleryForm block={block} set={set} />}
      {block.type === 'contact' && <ContactForm block={block} set={set} />}
      {block.type === 'socialLinks' && <SocialForm block={block} set={set} />}
      <StyleControls block={block} />
    </div>
  )
}
