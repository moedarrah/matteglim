import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from './components/AppRouter'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import '@fontsource/nunito/latin-900.css'
import './index.css'
import App from './App'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter>
      <App />
    </AppRouter>
  </StrictMode>,
)
