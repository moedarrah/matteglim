import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { SoundProvider } from '../components/SoundProvider'
import { SoundToggle } from '../components/SoundToggle'
import { SoundContext } from '../hooks/useSound'
import { HomePage } from '../pages/HomePage'
import { LevelSelection } from '../pages/LevelSelection'
import { MathGame } from '../pages/MathGame'
import { Route, Routes } from 'react-router'

describe('sound controls', () => {
  it('toggles sound and remembers the preference after remount', () => {
    const view = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    const toggle = screen.getByRole('button', { name: 'Ljud' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(toggle)
    expect(toggle).toHaveTextContent('Ljud av')
    expect(localStorage.getItem('matteglim:sound')).toBe('off')
    view.unmount()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: 'Ljud' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ljud' }))
    expect(localStorage.getItem('matteglim:sound')).toBe('on')
  })
  it('works when browser storage is unavailable', () => {
    const read = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('Blocked')
      })
    const write = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Blocked')
      })
    render(
      <SoundProvider>
        <SoundToggle />
      </SoundProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ljud' }))
    expect(screen.getByRole('button', { name: 'Ljud' })).toHaveTextContent(
      'Ljud av',
    )
    read.mockRestore()
    write.mockRestore()
  })
  it('plays the right cues for navigation, answers and game over, without duplicate cues', () => {
    vi.useFakeTimers()
    const play = vi.fn()
    render(
      <SoundContext.Provider value={{ enabled: true, toggle: vi.fn(), play }}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/levels" element={<LevelSelection />} />
            <Route path="/game/:levelId" element={<MathGame />} />
          </Routes>
        </MemoryRouter>
      </SoundContext.Provider>,
    )
    fireEvent.click(screen.getByRole('link', { name: 'Start' }))
    expect(play).toHaveBeenLastCalledWith('tap')
    play.mockClear()
    fireEvent.click(screen.getByRole('link', { name: /Nivå 1/ }))
    expect(play).toHaveBeenCalledWith('tap')
    const input = screen.getByRole('textbox')
    const [a, , b] = screen.getByTestId('question').textContent!.split(' ')
    fireEvent.change(input, { target: { value: String(+a + +b) } })
    fireEvent.submit(input.closest('form')!)
    expect(play).toHaveBeenLastCalledWith('correct')
    const count = play.mock.calls.length
    fireEvent.submit(input.closest('form')!)
    expect(play).toHaveBeenCalledTimes(count)
    act(() => vi.advanceTimersByTime(1100))
    for (let remaining = 2; remaining >= 0; remaining--) {
      fireEvent.change(input, { target: { value: '999' } })
      fireEvent.submit(input.closest('form')!)
      expect(play).toHaveBeenLastCalledWith(
        remaining === 0 ? 'gameOver' : 'wrong',
      )
      act(() => vi.advanceTimersByTime(450))
    }
    fireEvent.click(screen.getByRole('button', { name: /Försök igen/ }))
    expect(play).toHaveBeenLastCalledWith('tap')
    vi.useRealTimers()
  })
})
