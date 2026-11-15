import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'
import { loginSchema, registerSchema, type AuthFormValues } from './schemas'

function translateError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Неверный email или пароль'
  if (/already registered/i.test(message)) return 'Пользователь с таким email уже существует'
  if (/email not confirmed/i.test(message)) return 'Подтвердите email по ссылке из письма'
  if (/rate limit/i.test(message)) return 'Слишком много попыток. Попробуйте позже'
  return `Ошибка: ${message}`
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const [signedIn, setSignedIn] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  })
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  if (user && signedIn) return <Navigate to={from} replace />
  if (user) {
    return (
      <main className="grid min-h-screen place-items-center p-5">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
          <Logo />
          <h1 className="text-xl font-semibold">Вы уже вошли в аккаунт</h1>
          <p className="break-all text-sm text-ink-soft">{user.email}</p>
          <Link to="/app" className="block"><Button className="w-full">Перейти в личный кабинет</Button></Link>
          <Button variant="secondary" className="w-full" onClick={() => void signOut()}>Выйти и войти под другим аккаунтом</Button>
        </div>
      </main>
    )
  }

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setServerError(null)
    if (!isSupabaseConfigured) {
      setServerError('Supabase не настроен: добавьте ключи в файл .env (см. .env.example) и перезапустите dev-сервер.')
      return
    }
    setSignedIn(true)
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (error) { setSignedIn(false); return setServerError(translateError(error.message)) }
    if (data.session) navigate(from, { replace: true })
    else setNeedsConfirm(true)
  })

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          {needsConfirm ? (
            <div role="status">
              <h1 className="text-xl font-semibold">Проверьте почту</h1>
              <p className="mt-2 text-sm text-ink-soft">Мы отправили письмо со ссылкой для подтверждения. После подтверждения войдите в аккаунт.</p>
              <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline">Перейти ко входу</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <h1 className="text-xl font-semibold">{isLogin ? 'Вход в Forma' : 'Создать аккаунт'}</h1>
              <Input label="Электронная почта" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
              <Input label="Пароль" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} error={errors.password?.message} {...register('password')} />
              {!isLogin && <Input label="Повторите пароль" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />}
              {serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
              <Button type="submit" className="w-full" loading={isSubmitting}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</Button>
            </form>
          )}
        </div>
        {!needsConfirm && (
          <p className="mt-4 text-center text-sm text-ink-soft">
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <Link to={isLogin ? '/register' : '/login'} className="font-medium text-brand-700 hover:underline">{isLogin ? 'Зарегистрироваться' : 'Войти'}</Link>
          </p>
        )}
      </div>
    </main>
  )
}
