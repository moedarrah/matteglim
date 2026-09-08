export type Sound = 'tap' | 'correct' | 'wrong' | 'gameOver'
const melodies: Record<Sound, readonly number[]> = {
  tap: [660],
  correct: [523.25, 659.25, 783.99],
  wrong: [392, 349.23],
  gameOver: [392, 523.25, 659.25, 523.25],
}

// Audio is created and resumed only from a user interaction, never on page load.
export function createSoundPlayer() {
  let context: AudioContext | undefined
  let generation = 0
  const active = new Set<OscillatorNode>()

  function stop() {
    generation += 1
    for (const oscillator of active) {
      try {
        oscillator.stop()
      } catch {
        /* Already stopped. */
      }
      oscillator.disconnect()
    }
    active.clear()
  }

  async function play(sound: Sound) {
    stop()
    const request = generation
    try {
      const Audio =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Audio) return
      context ??= new Audio()
      if (context.state === 'suspended') await context.resume()
      // Muting or a newer sound cancels a pending resume as well.
      if (request !== generation || context.state !== 'running') return
      const duration = sound === 'tap' ? 0.09 : sound === 'wrong' ? 0.15 : 0.18
      const start = context.currentTime
      melodies[sound].forEach((frequency, index) => {
        const oscillator = context!.createOscillator()
        const gain = context!.createGain()
        const when = start + index * duration
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, when)
        gain.gain.setValueAtTime(0, when)
        gain.gain.linearRampToValueAtTime(0.055, when + 0.012)
        gain.gain.exponentialRampToValueAtTime(0.001, when + duration)
        oscillator.connect(gain)
        gain.connect(context!.destination)
        active.add(oscillator)
        oscillator.onended = () => {
          oscillator.disconnect()
          gain.disconnect()
          active.delete(oscillator)
        }
        oscillator.start(when)
        oscillator.stop(when + duration + 0.02)
      })
    } catch {
      // Unsupported or blocked audio must never interrupt the game.
      stop()
    }
  }

  function dispose() {
    stop()
    const previous = context
    context = undefined
    if (previous) void previous.close().catch(() => {})
  }
  return { play, stop, dispose }
}
