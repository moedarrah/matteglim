import { t } from '../config/translations'
export function Score({ score }: { score: number }) {
  return (
    <div className="score" aria-live="polite">
      <span aria-hidden="true">⭐</span> {t.score}: <strong>{score}</strong>
    </div>
  )
}
