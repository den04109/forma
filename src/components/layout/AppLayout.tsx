import { NavLink, Outlet } from 'react-router-dom'
import { FolderOpen, LayoutDashboard, LogOut, PlusSquare, Settings } from 'lucide-react'
import { Logo } from './Logo'
import { useAuthStore } from '@/features/auth/authStore'
import { cn } from '@/lib/utils/cn'

const items = [
  { to: '/app', label: 'Главная', icon: LayoutDashboard, end: true },
  { to: '/app/portfolios', label: 'Мои портфолио', icon: FolderOpen, end: false },
  { to: '/app/new', label: 'Создать портфолио', icon: PlusSquare, end: false },
  { to: '/app/settings', label: 'Настройки аккаунта', icon: Settings, end: false },
]

export function AppLayout() {
  const signOut = useAuthStore((s) => s.signOut)
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line bg-white p-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <Logo />
        <nav aria-label="Личный кабинет" className="mt-4 flex gap-1 overflow-x-auto md:flex-col">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-ink/5',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />{label}
            </NavLink>
          ))}
          <button onClick={() => void signOut()} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft hover:bg-ink/5 md:mt-6">
            <LogOut className="h-4 w-4" aria-hidden />Выйти
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10"><Outlet /></main>
    </div>
  )
}
