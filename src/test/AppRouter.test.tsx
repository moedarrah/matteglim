import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import App from '../App'
import { AppRouter } from '../components/AppRouter'

afterEach(() => {
  vi.unstubAllEnvs()
  window.history.replaceState(null, '', '/')
})
it('opens a shared Pages game link and keeps skip navigation within the game', () => {
  vi.stubEnv('MODE', 'pages')
  window.history.replaceState(null, '', '/matteglim/#/game/1')
  render(
    <AppRouter>
      <App />
    </AppRouter>,
  )
  expect(
    screen.getByRole('textbox', { name: 'Skriv ditt svar' }),
  ).toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Hoppa till innehållet' }))
  expect(window.location.hash).toBe('#/game/1')
  expect(document.getElementById('main')).toHaveFocus()
  fireEvent.click(screen.getByRole('link', { name: /Tillbaka/ }))
  expect(window.location.hash).toBe('#/levels')
  expect(
    screen.getByRole('heading', { name: 'Var vill du börja?' }),
  ).toBeInTheDocument()
})
it('redirects an invalid Pages game link', () => {
  vi.stubEnv('MODE', 'pages')
  window.history.replaceState(null, '', '/matteglim/#/game/missing')
  render(
    <AppRouter>
      <App />
    </AppRouter>,
  )
  expect(
    screen.getByRole('heading', { name: 'Var vill du börja?' }),
  ).toBeInTheDocument()
  expect(window.location.hash).toBe('#/levels')
})
it('preserves normal local game URLs', () => {
  vi.stubEnv('MODE', 'development')
  window.history.replaceState(null, '', '/game/1')
  render(
    <AppRouter>
      <App />
    </AppRouter>,
  )
  expect(
    screen.getByRole('textbox', { name: 'Skriv ditt svar' }),
  ).toBeInTheDocument()
})
