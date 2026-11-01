import { createBrowserRouter } from 'react-router-dom'
import StubPage from '@/pages/StubPage'
import PublicPortfolioPage from '@/pages/PublicPortfolio/PublicPortfolioPage'
import EditorPage from '@/pages/Editor/EditorPage'
import LandingPage from '@/pages/Landing/LandingPage'
import LoginPage from '@/pages/Login/LoginPage'
import RegisterPage from '@/pages/Register/RegisterPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import PortfoliosPage from '@/pages/Dashboard/PortfoliosPage'
import TemplateSelectionPage from '@/pages/TemplateSelection/TemplateSelectionPage'
import SettingsPage from '@/pages/Settings/SettingsPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/p/:slug', element: <PublicPortfolioPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/app', element: <DashboardPage /> },
          { path: '/app/portfolios', element: <PortfoliosPage /> },
          { path: '/app/new', element: <TemplateSelectionPage /> },
          { path: '/app/settings', element: <SettingsPage /> },
        ],
      },
      { path: '/app/:id/edit', element: <EditorPage /> },
    ],
  },
  { path: '*', element: <StubPage title="Страница не найдена" /> },
], { basename: import.meta.env.BASE_URL })
