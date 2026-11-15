import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'

export function ProtectedRoute() {
  const { user, loading } = useAuthStore()
  const location = useLocation()
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center" role="status" aria-label="Загрузка">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
