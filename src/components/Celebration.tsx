import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

const colors = ['#f8cf56', '#365bd7', '#e88382', '#6eaa80', '#a08acd']

export function Celebration() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2400)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null
  return (
    <div className="celebration" aria-hidden="true" data-testid="celebration">
      {Array.from({ length: 32 }, (_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={
            {
              left: `${(index * 37) % 100}%`,
              backgroundColor: colors[index % colors.length],
              borderRadius: index % 3 === 0 ? '50%' : '2px',
              '--delay': `${(index % 6) * 65}ms`,
              '--drift': `${((index % 7) - 3) * 24}px`,
              '--spin': `${index % 2 === 0 ? 540 : -540}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
