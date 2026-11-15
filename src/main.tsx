import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/index.css'
import { router } from '@/app/router'
import { useAuthStore } from '@/features/auth/authStore'

function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { void init() }, [init])
  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
