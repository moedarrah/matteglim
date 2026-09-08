import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { CELEBRATION_INTERVAL, LEVEL_TARGET } from '../config/levels'

const colors = ['#f8cf56', '#365bd7', '#e88382', '#6eaa80', '#a08acd']

export function Celebration({ score }: { score: number }) {
  const stage = Math.min(
    LEVEL_TARGET / CELEBRATION_INTERVAL,
    Math.max(1, Math.floor(score / CELEBRATION_INTERVAL)),
  )
  const duration = 2000 + stage * 300
  const particleCount = 24 + stage * 16
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration + 600)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null
  return (
    <div
      className="celebration"
      aria-hidden="true"
      data-testid="celebration"
      style={{ '--duration': `${duration}ms` } as CSSProperties}
    >
      {Array.from({ length: particleCount }, (_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={
            {
              left: `${(index * 37) % 100}%`,
              backgroundColor: colors[index % colors.length],
              borderRadius: index % 3 === 0 ? '50%' : '2px',
              width: `${8 + stage * 2}px`,
              height: `${12 + stage * 3}px`,
              '--delay': `${(index % 8) * 65}ms`,
              '--drift': `${((index % 7) - 3) * (20 + stage * 8)}px`,
              '--spin': `${index % 2 === 0 ? 540 : -540}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
