import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSoundPlayer } from './soundPlayer'
const oscillator = () => ({
  type: '',
  frequency: { setValueAtTime: vi.fn() },
  connect: vi.fn(),
  disconnect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  onended: null,
})
function mockAudio(state = 'running') {
  const context = {
    state,
    currentTime: 0,
    destination: {},
    resume: vi.fn().mockImplementation(async () => {
      context.state = 'running'
    }),
    close: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn().mockImplementation(oscillator),
    createGain: vi
      .fn()
      .mockImplementation(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      })),
  }
  const constructor = vi.fn(function () {
    return context
  })
  vi.stubGlobal('AudioContext', constructor)
  return { context, constructor }
}
afterEach(() => vi.unstubAllGlobals())
describe('sound player', () => {
  it('creates audio only when played and schedules a quiet correct-answer chime', async () => {
    const { context, constructor } = mockAudio()
    const player = createSoundPlayer()
    expect(constructor).not.toHaveBeenCalled()
    await player.play('correct')
    expect(context.createOscillator).toHaveBeenCalledTimes(3)
    expect(
      context.createGain.mock.results[0].value.gain.linearRampToValueAtTime,
    ).toHaveBeenCalledWith(0.055, 0.012)
    player.dispose()
    expect(context.close).toHaveBeenCalled()
  })
  it.each([
    ['tap', 1],
    ['wrong', 2],
    ['gameOver', 4],
  ] as const)('plays %s with %i notes', async (sound, count) => {
    const { context } = mockAudio()
    await createSoundPlayer().play(sound)
    expect(context.createOscillator).toHaveBeenCalledTimes(count)
  })
  it('stops active audio on mute', async () => {
    const { context } = mockAudio()
    const player = createSoundPlayer()
    await player.play('gameOver')
    const first = context.createOscillator.mock.results[0].value
    player.stop()
    expect(first.stop).toHaveBeenCalledTimes(2)
    expect(first.disconnect).toHaveBeenCalled()
  })
  it('resumes suspended audio and cancels it if muted before resume finishes', async () => {
    const { context } = mockAudio('suspended')
    const player = createSoundPlayer()
    const pending = player.play('correct')
    player.stop()
    await pending
    expect(context.resume).toHaveBeenCalled()
    expect(context.createOscillator).not.toHaveBeenCalled()
  })
  it('handles unsupported and blocked audio without throwing', async () => {
    vi.stubGlobal('AudioContext', undefined)
    await expect(createSoundPlayer().play('correct')).resolves.toBeUndefined()
    const { context } = mockAudio('suspended')
    context.resume.mockRejectedValue(new Error('Audio blocked'))
    await expect(createSoundPlayer().play('correct')).resolves.toBeUndefined()
  })
})
