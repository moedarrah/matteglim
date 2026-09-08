import userEvent from '@testing-library/user-event'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { t } from '../config/translations'
function open(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}
function input() {
  return screen.getByRole('textbox', { name: t.answerLabel })
}
function submit(value: string) {
  fireEvent.change(input(), { target: { value } })
  fireEvent.submit(input().closest('form')!)
}
function currentAnswer() {
  const [first, operator, second] = screen
    .getByTestId('question')
    .textContent!.split(' ')
  return String(
    operator === '+'
      ? +first + +second
      : operator === '−'
        ? +first - +second
        : +first * +second,
  )
}
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})
describe('Matteglim', () => {
  it('navigates Home → Start → five levels → game', () => {
    open()
    fireEvent.click(screen.getByRole('link', { name: 'Start' }))
    expect(
      screen.getByRole('heading', { name: t.levelIntro }),
    ).toBeInTheDocument()
    expect(document.querySelectorAll('.level-card')).toHaveLength(5)
    fireEvent.click(screen.getByRole('link', { name: /Nivå 1/ }))
    expect(input()).toHaveFocus()
    expect(screen.getByRole('img', { name: t.hearts(3) })).toBeInTheDocument()
  })
  it.each(['1', '2', '3', '4', '5'])('opens level %s directly', (id) => {
    open(`/game/${id}`)
    expect(input()).toHaveFocus()
    expect(screen.getByText('0', { selector: 'strong' })).toBeInTheDocument()
  })
  it('redirects invalid level IDs safely', () => {
    open('/game/banana')
    expect(
      screen.getByRole('heading', { name: t.levelIntro }),
    ).toBeInTheDocument()
  })
  it('awards one point, blocks duplicates, changes question and restores focus', () => {
    vi.useFakeTimers()
    open('/game/1')
    const original = screen.getByTestId('question').textContent
    submit(currentAnswer())
    fireEvent.submit(input().closest('form')!)
    expect(screen.getByText('1', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(t.greatJob)
    expect(screen.getByRole('button', { name: /Nästa fråga/ })).toBeDisabled()
    act(() => vi.advanceTimersByTime(1100))
    expect(input()).toHaveValue('')
    expect(input()).toHaveFocus()
    expect(screen.getByTestId('question').textContent).not.toBe(original)
    expect(screen.getByRole('img', { name: t.hearts(3) })).toBeInTheDocument()
  })
  it('keeps wrong questions, removes hearts, ends after three mistakes, and restarts', () => {
    vi.useFakeTimers()
    open('/game/2')
    submit(currentAnswer())
    act(() => vi.advanceTimersByTime(1100))
    const question = screen.getByTestId('question').textContent
    for (let remaining = 2; remaining >= 0; remaining--) {
      submit('999')
      expect(
        screen.getByRole('img', { name: t.hearts(remaining) }),
      ).toBeInTheDocument()
      if (remaining) {
        expect(screen.getByTestId('question').textContent).toBe(question)
        expect(screen.getByRole('status')).toHaveTextContent(t.wrongAnswer)
        expect(input()).toHaveFocus()
        submit('999')
        expect(
          screen.getByRole('img', { name: t.hearts(remaining) }),
        ).toBeInTheDocument()
      }
      act(() => vi.advanceTimersByTime(450))
    }
    expect(screen.getByRole('heading', { name: t.gameOverTitle })).toHaveFocus()
    expect(screen.getByText(t.earnedStars(1))).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Försök igen/ }))
    expect(input()).toHaveFocus()
    expect(screen.getByRole('img', { name: t.hearts(3) })).toBeInTheDocument()
    expect(screen.getByText('0', { selector: 'strong' })).toBeInTheDocument()
    for (let i = 0; i < 3; i++) {
      submit('999')
      act(() => vi.advanceTimersByTime(450))
    }
    fireEvent.click(screen.getByRole('link', { name: t.anotherLevel }))
    expect(
      screen.getByRole('heading', { name: t.levelIntro }),
    ).toBeInTheDocument()
  })
  it('submits a numeric answer with Enter', async () => {
    const user = userEvent.setup()
    open('/game/1')
    await user.type(input(), `${currentAnswer()}{Enter}`)
    expect(screen.getByRole('status')).toHaveTextContent(t.greatJob)
    expect(screen.getByText('1', { selector: 'strong' })).toBeInTheDocument()
  })
  it('restores answer focus after clicks and keeps keyboard navigation available', async () => {
    const user = userEvent.setup()
    open('/game/1')
    await user.click(screen.getByRole('heading', { name: t.questionPrompt }))
    expect(input()).toHaveFocus()
    await user.click(screen.getByRole('button', { name: t.sound }))
    expect(input()).toHaveFocus()
    await user.type(input(), currentAnswer())
    await user.tab()
    const checkButton = screen.getByRole('button', { name: t.checkAnswer })
    expect(checkButton).toHaveFocus()
    await user.click(checkButton)
    expect(input()).toHaveFocus()
    expect(input()).toHaveAttribute('readonly')
    await user.click(screen.getByRole('link', { name: /Tillbaka/ }))
    expect(
      screen.getByRole('heading', { name: t.levelIntro }),
    ).toBeInTheDocument()
  })
  it('celebrates every five points once, without interrupting focus or the next question', () => {
    vi.useFakeTimers()
    open('/game/1')
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
    for (let score = 1; score <= 10; score++) {
      submit(currentAnswer())
      if (score % 5 === 0) {
        expect(screen.getByRole('status')).toHaveTextContent(
          t.milestoneCelebration(score),
        )
        expect(screen.getByTestId('celebration')).toBeInTheDocument()
        expect(input()).toHaveFocus()
        fireEvent.submit(input().closest('form')!)
        expect(
          screen.getByText(String(score), { selector: 'strong' }),
        ).toBeInTheDocument()
        act(() => vi.advanceTimersByTime(1100))
        expect(input()).toHaveValue('')
        expect(input()).not.toHaveAttribute('readonly')
        expect(screen.getByTestId('celebration')).toBeInTheDocument()
        act(() => vi.advanceTimersByTime(5000))
        expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
        submit('999')
        expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
        act(() => vi.advanceTimersByTime(450))
      } else {
        expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
        act(() => vi.advanceTimersByTime(1100))
      }
    }
    submit('999')
    fireEvent.click(screen.getByRole('button', { name: /Försök igen/ }))
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
    expect(input()).toHaveFocus()
    expect(screen.getByText('0', { selector: 'strong' })).toBeInTheDocument()
  })
  it('grows celebrations and finishes at 30 points, then allows replay and another level', () => {
    vi.useFakeTimers()
    open('/game/1')
    let previousCount = 0
    let previousSize = 0
    let previousDuration = 0
    for (let score = 1; score <= 30; score++) {
      submit(currentAnswer())
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'value',
        String(score),
      )
      if (score % 5 === 0) {
        const celebration = screen.getByTestId('celebration')
        expect(celebration.childElementCount).toBeGreaterThan(previousCount)
        const size = parseFloat(
          (celebration.firstElementChild as HTMLElement).style.width,
        )
        const duration = parseFloat(
          celebration.style.getPropertyValue('--duration'),
        )
        expect(size).toBeGreaterThan(previousSize)
        expect(duration).toBeGreaterThan(previousDuration)
        previousCount = celebration.childElementCount
        previousSize = size
        previousDuration = duration
      }
      act(() => vi.advanceTimersByTime(1100))
    }
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: t.levelComplete })).toHaveFocus()
    expect(screen.getByText('30', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByTestId('celebration')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: t.playAgain }))
    expect(input()).toHaveFocus()
    expect(screen.getByText('0', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: t.hearts(3) })).toBeInTheDocument()
    for (let score = 1; score <= 30; score++) {
      submit(currentAnswer())
      if (score < 30) act(() => vi.advanceTimersByTime(1100))
    }
    fireEvent.click(screen.getByRole('link', { name: t.anotherLevel }))
    expect(
      screen.getByRole('heading', { name: t.levelIntro }),
    ).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument()
  })
  it('rejects empty, signed, decimal and nonnumeric input without losing hearts', () => {
    open('/game/1')
    for (const answer of ['', '-1', '1.2', 'abc', '1e2', ' ']) submit(answer)
    expect(input()).toHaveValue('')
    expect(screen.getByRole('img', { name: t.hearts(3) })).toBeInTheDocument()
  })
  it('cleans up a pending transition when leaving the game', () => {
    vi.useFakeTimers()
    open('/game/1')
    submit(currentAnswer())
    fireEvent.click(screen.getByRole('link', { name: /Tillbaka/ }))
    act(() => vi.advanceTimersByTime(1100))
    fireEvent.click(screen.getByRole('link', { name: /Nivå 2/ }))
    expect(screen.getByText('0', { selector: 'strong' })).toBeInTheDocument()
    expect(input()).toHaveFocus()
  })
})
