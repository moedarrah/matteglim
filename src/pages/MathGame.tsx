import { useSound } from '../hooks/useSound'
import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import type { InputRef } from 'antd'
import { Link, Navigate, useParams } from 'react-router'
import {
  INITIAL_HEARTS,
  LEVEL_TARGET,
  CELEBRATION_INTERVAL,
  levels,
} from '../config/levels'
import { t } from '../config/translations'
import type { Level } from '../types'
import { generateQuestion } from '../utils/generateQuestion'
import { PlaceValueBlocks } from '../components/PlaceValueBlocks'
import { Hearts } from '../components/Hearts'
import { Score } from '../components/Score'
import { GameOver } from '../components/GameOver'
import { Celebration } from '../components/Celebration'
import { LevelComplete } from '../components/LevelComplete'

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
  const [ones, setOnes] = useState('')
  const [builtTens, setBuiltTens] = useState(0)
  const [builtOnes, setBuiltOnes] = useState(0)
  const isBuild = question.mode === 'build'
  const isSplit = question.mode === 'split'
  const canSubmit =
    isBuild || (/^\d+$/.test(answer) && (!isSplit || /^\d+$/.test(ones)))
  const [hearts, setHearts] = useState(INITIAL_HEARTS)
  const [score, setScore] = useState(0)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const completed = score >= LEVEL_TARGET
  const inputRef = useRef<InputRef>(null)
  const builderRef = useRef<HTMLDivElement>(null)
  const locked = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    builderRef.current
      ?.querySelector<HTMLButtonElement>('button:not(:disabled)')
      ?.focus({ preventScroll: true })
  }, [question])
  useEffect(() => {
    if (hearts > 0 && !completed)
      inputRef.current?.focus({ preventScroll: true })
  }, [question, hearts, status, completed])

  useEffect(() => {
    if (hearts === 0 || completed || question.mode) return

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
  }, [hearts, completed, question.mode])

  function checkAnswer(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    inputRef.current?.focus({ preventScroll: true })
    if (locked.current || completed || hearts === 0 || !canSubmit) return
    const correct = isBuild
      ? builtTens === question.first / 10 && builtOnes === question.second
      : isSplit
        ? Number(answer) === question.first && Number(ones) === question.second
        : Number(answer) === question.answer
    if (correct) {
      locked.current = true
      const nextScore = score + 1
      setScore(nextScore)
      if (nextScore % CELEBRATION_INTERVAL === 0) setMilestone(nextScore)
      setStatus('correct')
      play('correct')
      if (nextScore >= LEVEL_TARGET) return
      timer.current = setTimeout(() => {
        setQuestion((previous) => generateQuestion(level, previous))
        setAnswer('')
        setOnes('')
        setBuiltTens(0)
        setBuiltOnes(0)
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
      setOnes('')
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
    setOnes('')
    setBuiltTens(0)
    setBuiltOnes(0)
    setStatus('idle')
  }
  return (
    <section className="game-page">
      {milestone !== null && hearts > 0 && (
        <Celebration key={milestone} score={milestone} />
      )}
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
      <div className="level-progress">
        <label htmlFor="level-progress">
          {t.levelProgress(score, LEVEL_TARGET)}
        </label>
        <progress id="level-progress" value={score} max={LEVEL_TARGET} />
      </div>
      {completed ? (
        <LevelComplete score={score} onRestart={restart} />
      ) : hearts === 0 ? (
        <GameOver score={score} onRestart={restart} />
      ) : (
        <div className={`paper-card question-card ${status}`}>
          <p className="eyebrow">{t.questionNote}</p>
          <h1>
            {question.mode ? t.placeValue[question.mode] : t.questionPrompt}
          </h1>
          {question.mode && (
            <p className="place-hint">
              {isSplit ? t.placeValue.splitHint : t.placeValue.hint}
            </p>
          )}
          <form onSubmit={checkAnswer}>
            {question.mode === 'count' && (
              <PlaceValueBlocks
                tens={question.first / 10}
                ones={question.second}
              />
            )}
            {isBuild ? (
              <div className="place-builder" ref={builderRef}>
                <div className="place-target" data-testid="question">
                  {question.answer}
                </div>
                <PlaceValueBlocks tens={builtTens} ones={builtOnes} />
                <div className="place-controls">
                  {(
                    [
                      [
                        t.placeValue.tens,
                        builtTens,
                        setBuiltTens,
                        10,
                        t.placeValue.removeTen,
                        t.placeValue.addTen,
                      ],
                      [
                        t.placeValue.ones,
                        builtOnes,
                        setBuiltOnes,
                        9,
                        t.placeValue.removeOne,
                        t.placeValue.addOne,
                      ],
                    ] as const
                  ).map(([label, value, setValue, max, remove, add]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <div>
                        <Button
                          htmlType="button"
                          aria-label={remove}
                          disabled={value === 0 || status === 'correct'}
                          onClick={() => {
                            setValue(value - 1)
                            setStatus('idle')
                          }}
                        >
                          −
                        </Button>
                        <output aria-label={label}>{value}</output>
                        <Button
                          htmlType="button"
                          aria-label={add}
                          disabled={value === max || status === 'correct'}
                          onClick={() => {
                            setValue(value + 1)
                            setStatus('idle')
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className={`equation ${isSplit ? 'split-equation' : ''}`}>
                  {question.mode === 'count' ? null : isSplit ? (
                    <>
                      <span data-testid="question">{question.answer}</span>
                      <span aria-hidden="true">=</span>
                    </>
                  ) : (
                    <>
                      <span data-testid="question">
                        {question.first}{' '}
                        {question.operator === '-' ? '−' : question.operator}{' '}
                        {question.second}
                      </span>
                      <span aria-hidden="true">=</span>
                    </>
                  )}
                  <Input
                    id="answer"
                    ref={inputRef}
                    aria-label={
                      isSplit ? t.placeValue.tensValue : t.answerLabel
                    }
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
                  {isSplit && (
                    <>
                      <span aria-hidden="true">+</span>
                      <Input
                        aria-label={t.placeValue.ones}
                        aria-describedby="answer-feedback"
                        autoComplete="off"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        placeholder="?"
                        value={ones}
                        readOnly={status === 'correct'}
                        onChange={(event) => {
                          if (/^\d*$/.test(event.target.value)) {
                            setOnes(event.target.value)
                            if (status === 'wrong') setStatus('idle')
                          }
                        }}
                      />
                    </>
                  )}
                </div>
                <label htmlFor="answer" className="answer-label">
                  {isSplit
                    ? t.placeValue.tensValue + ' + ' + t.placeValue.ones
                    : t.answerLabel}
                </label>
              </>
            )}
            <div
              id="answer-feedback"
              className={`feedback ${status}`}
              role="status"
              aria-live="polite"
            >
              {status === 'correct'
                ? score % CELEBRATION_INTERVAL === 0
                  ? t.milestoneCelebration(score)
                  : t.greatJob
                : status === 'wrong'
                  ? t.wrongAnswer
                  : isBuild
                    ? t.placeValue.buildHint
                    : t.inputHint}
            </div>
            <Button
              className="check-button"
              type="primary"
              htmlType="submit"
              size="large"
              disabled={!canSubmit || status === 'correct'}
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
