import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SoundContext } from '../hooks/useSound'
import { createSoundPlayer } from '../utils/soundPlayer'
import type { Sound } from '../utils/soundPlayer'
const STORAGE_KEY = 'matteglim:sound'
export function SoundProvider({ children }: { children: ReactNode }) {
  const [player] = useState(createSoundPlayer)
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'off'
    } catch {
      return true
    }
  })
  useEffect(() => {
    const quietWhenHidden = () => {
      if (document.hidden) player.stop()
    }
    document.addEventListener('visibilitychange', quietWhenHidden)
    return () => {
      document.removeEventListener('visibilitychange', quietWhenHidden)
      player.dispose()
    }
  }, [player])
  function toggle() {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    } catch {
      /* Storage can be disabled. */
    }
    if (next) void player.play('tap')
    else player.stop()
  }
  function play(sound: Sound) {
    if (enabled) void player.play(sound)
  }
  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  )
}
