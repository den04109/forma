import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Временная страница для каркаса маршрутов; заменяется реальными страницами на следующих этапах.
export default function StubPage({ title }: { title: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
      <div>
        <p className="text-sm font-semibold text-brand-600">Forma</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">Каркас работает. Страница появится на следующем этапе.</p>
      </div>
      <Input label="Проверка поля" placeholder="Начните вводить" />
      <div className="flex gap-2">
        <Button>Основная</Button>
        <Button variant="secondary">Вторичная</Button>
        <Button variant="ghost">Текст</Button>
      </div>
      <nav className="flex flex-wrap gap-3 text-sm text-brand-700">
        <Link to="/">/</Link><Link to="/login">/login</Link><Link to="/register">/register</Link>
        <Link to="/app">/app</Link><Link to="/app/new">/app/new</Link>
      </nav>
    </main>
  )
}
