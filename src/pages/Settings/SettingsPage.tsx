import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/authStore'

export default function SettingsPage() {
  const { user, signOut } = useAuthStore()
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Настройки аккаунта</h1>
      <div className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-5">
        <div>
          <p className="text-sm text-ink-soft">Электронная почта</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={() => void signOut()}>Выйти из аккаунта</Button>
      </div>
    </div>
  )
}
