import { useSound } from '../hooks/useSound'
import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import type { InputRef } from 'antd'
import { Link, Navigate, useParams } from 'react-router'
import { INITIAL_HEARTS, levels } from '../config/levels'
import { t } from '../config/translations'
import type { Level } from '../types'
import { generateQuestion } from '../utils/generateQuestion'
import { Hearts } from '../components/Hearts'
import { Score } from '../components/Score'
import { GameOver } from '../components/GameOver'
import { Celebration } from '../components/Celebration'

export function MathGame() {
  const { levelId } = useParams()
  const level = levels.find((item) => item.id === levelId)
  return level ? (
    <GameSession key={level.id} level={level} />
  ) : (
    <Navigate to="/levels" replace />
  )
}
function GameSession({ level }: { level: Level }) {
  const { play } = useSound()
  const [question, setQuestion] = useState(() => generateQuestion(level))
  const [answer, setAnswer] = useState('')
  const [hearts, setHearts] = useState(INITIAL_HEARTS)
  const [score, setScore] = useState(0)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const inputRef = useRef<InputRef>(null)
  const locked = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (hearts > 0) inputRef.current?.focus({ preventScroll: true })
  }, [question, hearts, status])

  useEffect(() => {
    if (hearts === 0) return

    function restoreAnswerFocus(event: MouseEvent) {
      // Keep Tab navigation available; restore focus only after a click or tap.
      if (event.detail === 0 || !(event.target instanceof Element)) return
      if (
        event.target.closest(
          'a, input, textarea, select, [contenteditable], [role="dialog"]',
        )
      )
        return
      inputRef.current?.focus({ preventScroll: true })
    }

    document.addEventListener('click', restoreAnswerFocus)
    return () => document.removeEventListener('click', restoreAnswerFocus)
  }, [hearts])

  function checkAnswer(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    inputRef.current?.focus({ preventScroll: true })
    if (locked.current || hearts === 0 || !/^\d+$/.test(answer)) return
    if (Number(answer) === question.answer) {
      locked.current = true
      const nextScore = score + 1
      setScore(nextScore)
      if (nextScore % 5 === 0) setMilestone(nextScore)
      setStatus('correct')
      play('correct')
      timer.current = setTimeout(() => {
        setQuestion((previous) => generateQuestion(level, previous))
        setAnswer('')
        setStatus('idle')
        locked.current = false
      }, 1100)
    } else {
      // Lock briefly so a double tap costs only one heart.
      locked.current = true
      setHearts((value) => value - 1)
      setStatus('wrong')
      play(hearts === 1 ? 'gameOver' : 'wrong')
      setAnswer('')
      inputRef.current?.focus()
      timer.current = setTimeout(() => {
        locked.current = false
      }, 450)
    }
  }
  function restart() {
    play('tap')
    clearTimeout(timer.current)
    locked.current = false
    setQuestion((previous) => generateQuestion(level, previous))
    setHearts(INITIAL_HEARTS)
    setScore(0)
    setMilestone(null)
    setAnswer('')
    setStatus('idle')
  }
  return (
    <section className="game-page">
      {milestone !== null && hearts > 0 && <Celebration key={milestone} />}
      <div className="game-navigation">
        <Link to="/levels" className="back-link">
          ← {t.back}
        </Link>
        <span className={`level-badge ${level.color}`}>
          {level.icon} {t.level} {level.id} · {t.levels[level.id].name}
        </span>
      </div>
      <div className="game-stats">
        <Score score={score} />
        <Hearts count={hearts} />
      </div>
      {hearts === 0 ? (
        <GameOver score={score} onRestart={restart} />
      ) : (
        <div className={`paper-card question-card ${status}`}>
          <p className="eyebrow">{t.questionNote}</p>
          <h1>{t.questionPrompt}</h1>
          <form onSubmit={checkAnswer}>
            <div className="equation">
              <span data-testid="question">
                {question.first}{' '}
                {question.operator === '-' ? '−' : question.operator}{' '}
                {question.second}
              </span>
              <span aria-hidden="true">=</span>
              <Input
                id="answer"
                ref={inputRef}
                aria-label={t.answerLabel}
                aria-describedby="answer-feedback"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                placeholder="?"
                value={answer}
                readOnly={status === 'correct'}
                onChange={(event) => {
                  if (/^\d*$/.test(event.target.value)) {
                    setAnswer(event.target.value)
                    if (status === 'wrong') setStatus('idle')
                  }
                }}
              />
            </div>
            <label htmlFor="answer" className="answer-label">
              {t.answerLabel}
            </label>
            <div
              id="answer-feedback"
              className={`feedback ${status}`}
              role="status"
              aria-live="polite"
            >
              {status === 'correct'
                ? score % 5 === 0
                  ? t.milestoneCelebration(score)
                  : t.greatJob
                : status === 'wrong'
                  ? t.wrongAnswer
                  : t.inputHint}
            </div>
            <Button
              className="check-button"
              type="primary"
              htmlType="submit"
              size="large"
              disabled={!answer || status === 'correct'}
            >
              {status === 'correct' ? t.nextQuestion : t.checkAnswer}
              <span aria-hidden="true">{status === 'correct' ? '★' : '✓'}</span>
            </Button>
          </form>
        </div>
      )}
    </section>
  )
}
