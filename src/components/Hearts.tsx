import { INITIAL_HEARTS } from '../config/levels'
import { t } from '../config/translations'
export function Hearts({ count }: { count: number }) {
  return (
    <div className="hearts" role="img" aria-label={t.hearts(count)}>
      {Array.from({ length: INITIAL_HEARTS }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={index < count ? 'heart' : 'heart lost'}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
