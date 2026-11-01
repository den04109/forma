import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { MiniPortfolio } from '@/components/shared/MiniPortfolio'
import { Faq, Features, Steps, Templates } from './sections'

const navLinks = [
  ['#features', 'Преимущества'], ['#templates', 'Шаблоны'], ['#faq', 'FAQ'],
]

function EditorMock() {
  const blocks = ['Hero', 'Обо мне', 'Навыки', 'Проекты']
  return (
    <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-line bg-white shadow-card" aria-hidden>
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-ink/15" />)}
      </div>
      <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr_170px]">
        <div className="space-y-2 border-r border-line bg-canvas p-3">
          {blocks.map((b, i) => (
            <div key={b} className={`rounded-lg border px-2.5 py-1.5 text-xs ${i === 0 ? 'border-brand-600 bg-white text-brand-700' : 'border-line bg-white text-ink-soft'}`}>{b}</div>
          ))}
        </div>
        <div className="p-4"><MiniPortfolio variant="professional" /></div>
        <div className="hidden space-y-3 border-l border-line p-3 sm:block">
          {['Имя', 'Профессия', 'Описание'].map((l) => (
            <div key={l}>
              <div className="text-[10px] text-ink-muted">{l}</div>
              <div className="mt-1 h-6 rounded-md border border-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav aria-label="Основная" className="hidden gap-6 text-sm text-ink-soft md:flex">
            {navLinks.map(([href, label]) => <a key={href} href={href} className="hover:text-ink">{label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Войти</Button></Link>
            <Link to="/register"><Button size="sm">Создать портфолио</Button></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 text-center sm:pt-24">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Ваше портфолио. Ваши правила</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Создайте персональный сайт без программирования: выберите шаблон, заполните блоки и опубликуйте страницу по своей ссылке.
            </p>
            <Link to="/register" className="mt-8 inline-block"><Button size="lg">Начать создание</Button></Link>
          </motion.div>
          <EditorMock />
        </section>
        <Features />
        <Templates />
        <Steps />
        <Faq />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-muted sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Forma. Конструктор персональных портфолио.</p>
        </div>
      </footer>
    </div>
  )
}
