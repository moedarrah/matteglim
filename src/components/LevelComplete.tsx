import { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { Link } from 'react-router'
import { t } from '../config/translations'

export function LevelComplete({
  score,
  onRestart,
}: {
  score: number
  onRestart: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])
  return (
    <section
      className="paper-card level-complete"
      aria-labelledby="level-complete-title"
    >
      <div className="completion-trophy" aria-hidden="true">
        🏆
      </div>
      <h1 id="level-complete-title" tabIndex={-1} ref={headingRef}>
        {t.levelComplete}
      </h1>
      <p className="completion-score">{t.milestoneCelebration(score)}</p>
      <p>{t.levelCompleteDescription}</p>
      <div className="stack-actions">
        <Link to="/levels" className="primary-link completion-link">
          {t.anotherLevel}
        </Link>
        <Button size="large" onClick={onRestart}>
          {t.playAgain}
        </Button>
      </div>
    </section>
  )
}
