import { createContext, useContext } from 'react'
import type { Sound } from '../utils/soundPlayer'
export const SoundContext = createContext({
  enabled: true,
  toggle: () => {},
  play: (_sound: Sound) => {},
})
export const useSound = () => useContext(SoundContext)
