import { useSound } from '../hooks/useSound'
import { Link } from 'react-router'
import { levels } from '../config/levels'
import { t } from '../config/translations'
export function LevelSelection() {
  const { play } = useSound()
  return (
    <section className="levels-page">
      <Link to="/" className="back-link">
        ← {t.back}
      </Link>
      <div className="page-heading">
        <p className="eyebrow">{t.chooseLevel}</p>
        <h1>{t.levelIntro}</h1>
        <p>{t.levelDescription}</p>
      </div>
      <div className="level-grid">
        {levels.map((level) => {
          const copy = t.levels[level.id]
          return (
            <Link
              to={`/game/${level.id}`}
              onClick={() => play('tap')}
              key={level.id}
              className={`level-card ${level.color}`}
            >
              <div className="level-card-top">
                <span className="level-icon" aria-hidden="true">
                  {level.icon}
                </span>
                <span className="level-number">
                  {t.level} {level.id}
                </span>
              </div>
              <h2>{copy.name}</h2>
              <p>{copy.description}</p>
              <div className="level-card-bottom">
                <span>{copy.example}</span>
                <span className="round-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="level-tip">
        <span aria-hidden="true">☀</span> {t.levelTip}
      </p>
    </section>
  )
}
