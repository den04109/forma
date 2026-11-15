import { Link } from 'react-router-dom'
import { Link2, MousePointerClick, Palette, ShieldCheck, Smartphone, Zap } from 'lucide-react'
import { MiniPortfolio, type MiniVariant } from '@/components/shared/MiniPortfolio'

const features = [
  { icon: MousePointerClick, title: 'Визуальный редактор', text: 'Добавляйте и переставляйте блоки перетаскиванием. Код не нужен.' },
  { icon: Palette, title: 'Ваш стиль', text: 'Цвета, шрифты, скругления и ширина страницы настраиваются за пару кликов.' },
  { icon: Smartphone, title: 'Для любого экрана', text: 'Страница одинаково аккуратно выглядит на компьютере, планшете и смартфоне.' },
  { icon: Link2, title: 'Своя ссылка', text: 'Опубликуйте портфолио по короткому адресу и поделитесь им с кем угодно.' },
  { icon: Zap, title: 'Автосохранение', text: 'Изменения сохраняются сами. Снять страницу с публикации можно в любой момент.' },
  { icon: ShieldCheck, title: 'Черновики приватны', text: 'Незаконченную работу видите только вы, пока не нажмёте «Опубликовать».' },
]

const templates: { name: string; text: string; variant: MiniVariant }[] = [
  { name: 'Minimal', text: 'Строгая типографика и много воздуха.', variant: 'minimal' },
  { name: 'Creative', text: 'Яркий шаблон для дизайнеров и творческих профессий.', variant: 'creative' },
  { name: 'Professional', text: 'Структура для специалистов и делового портфолио.', variant: 'professional' },
]

const steps = [
  'Зарегистрируйтесь по электронной почте',
  'Выберите шаблон',
  'Заполните блоки и настройте дизайн',
  'Опубликуйте и отправьте ссылку',
]

const faq = [
  { q: 'Нужно ли уметь программировать?', a: 'Нет. Все настройки доступны в виде обычных полей и переключателей.' },
  { q: 'Можно ли изменить шаблон позже?', a: 'Содержимое блоков сохраняется, а внешний вид настраивается в разделе «Дизайн».' },
  { q: 'Что видят посетители, пока портфолио в черновиках?', a: 'Ничего. Публичная страница открывается только после публикации.' },
  { q: 'Сколько проектов можно добавить?', a: 'Мы не ограничиваем их число: добавляйте столько проектов, сколько нужно для вашей страницы. Так же можно создать любое количество отдельных портфолио.' },
  { q: 'Можно ли скачать свой сайт и разместить его в другом месте?', a: 'Да. В редакторе и в личном кабинете есть кнопка «Скачать»: вы получите один файл index.html со страницей, шрифтами и изображениями. Его можно загрузить на любой хостинг, например GitHub Pages, Netlify или к обычному хостинг-провайдеру.' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

export function Features() {
  return (
    <Section id="features" title="Всё, что нужно для портфолио">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <Icon className="h-5 w-5 text-brand-600" aria-hidden />
            <h3 className="mt-3 font-medium">{title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Templates() {
  return (
    <Section id="templates" title="Три шаблона на старте">
      <ul className="grid gap-5 md:grid-cols-3">
        {templates.map((t) => (
          <li key={t.name} className="rounded-2xl border border-line bg-white p-3 shadow-card">
            <MiniPortfolio variant={t.variant} />
            <p className="mt-3 px-1 font-medium">{t.name}</p>
            <p className="px-1 pb-1 text-sm text-ink-soft">{t.text}</p>
          </li>
        ))}
      </ul>
      <Link to="/register" className="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline">
        Выбрать шаблон →
      </Link>
    </Section>
  )
}

export function Steps() {
  return (
    <Section id="steps" title="Как это работает">
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s} className="rounded-2xl border border-line bg-white p-5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">{i + 1}</span>
            <p className="mt-3 text-sm font-medium">{s}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Faq() {
  return (
    <Section id="faq" title="Частые вопросы">
      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {faq.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium marker:hidden">{f.q}</summary>
            <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
