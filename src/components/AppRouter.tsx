import type { ReactNode } from 'react'
import { BrowserRouter, HashRouter } from 'react-router'

// Pages cannot rewrite game URLs to index.html, so use hash routes there.
export function AppRouter({ children }: { children: ReactNode }) {
  const Router = import.meta.env.MODE === 'pages' ? HashRouter : BrowserRouter
  return <Router>{children}</Router>
}
