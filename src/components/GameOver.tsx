import { Button } from 'antd'
import { Link } from 'react-router'
import { t } from '../config/translations'
import { Mascot } from './Mascot'
export function GameOver({
  score,
  onRestart,
}: {
  score: number
  onRestart: () => void
}) {
  return (
    <section className="game-over paper-card" aria-labelledby="game-over-title">
      <Mascot small />
      <p className="eyebrow">{t.noHearts}</p>
      <h1
        id="game-over-title"
        tabIndex={-1}
        ref={(element) => {
          element?.focus()
        }}
      >
        {t.gameOverTitle}
      </h1>
      <p className="earned-stars">{t.earnedStars(score)}</p>
      <p>{t.gameOverDescription}</p>
      <div className="stack-actions">
        <Button type="primary" size="large" onClick={onRestart}>
          {t.tryAgain} <span aria-hidden="true">↻</span>
        </Button>
        <Link className="secondary-link" to="/levels">
          {t.anotherLevel}
        </Link>
      </div>
    </section>
  )
}
