import { ConfigProvider } from 'antd'
import svSE from 'antd/locale/sv_SE'
import { Link, Route, Routes, Navigate } from 'react-router'
import { HomePage } from './pages/HomePage'
import { LevelSelection } from './pages/LevelSelection'
import { MathGame } from './pages/MathGame'
import { t } from './config/translations'
import { SoundProvider } from './components/SoundProvider'
import { SoundToggle } from './components/SoundToggle'
import './App.css'
export default function App() {
  return (
    <SoundProvider>
      <ConfigProvider
        locale={svSE}
        theme={{
          token: {
            colorPrimary: '#365bd7',
            borderRadius: 18,
            fontFamily: 'Nunito, sans-serif',
            fontSize: 18,
            controlHeightLG: 62,
            colorText: '#253c50',
          },
        }}
      >
        <div className="app-shell">
          <a className="skip-link" href="#main">
            {t.skip}
          </a>
          <header className="site-header">
            <Link
              to="/"
              className="brand"
              aria-label={`${t.appName} · ${t.home}`}
            >
              <span className="brand-icon" aria-hidden="true">
                ✦
              </span>
              {t.appName}
              <span className="brand-dot">.</span>
            </Link>
            <div className="header-actions">
              <span className="header-tagline">{t.tagline}</span>
              <SoundToggle />
            </div>
          </header>
          <main id="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/levels" element={<LevelSelection />} />
              <Route path="/game/:levelId" element={<MathGame />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer>
            <span aria-hidden="true">✦</span> {t.footer}
          </footer>
        </div>
      </ConfigProvider>
    </SoundProvider>
  )
}
