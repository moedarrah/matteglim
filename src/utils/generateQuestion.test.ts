import { describe, expect, it, vi } from 'vitest'
import { levels } from '../config/levels'
import { generateQuestion, isSameQuestion } from './generateQuestion'
describe('question generation', () => {
  it.each(levels)('keeps level $id questions within its rules', (level) => {
    const seen = new Set<string>()
    for (let i = 0; i < 1500; i++) {
      const q = generateQuestion(level)
      seen.add(q.operator)
      expect(level.operators).toContain(q.operator)
      const max = q.operator === '×' ? level.multiplicationMax : level.max
      expect(q.first).toBeGreaterThanOrEqual(0)
      expect(q.second).toBeGreaterThanOrEqual(0)
      expect(q.first).toBeLessThanOrEqual(max)
      expect(q.second).toBeLessThanOrEqual(max)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBe(
        q.operator === '+'
          ? q.first + q.second
          : q.operator === '-'
            ? q.first - q.second
            : q.first * q.second,
      )
    }
    expect(seen.size).toBe(level.operators.length)
  })
  it('rerolls an immediate repeat', () => {
    const random = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValue(0.5)
    const previous = { first: 0, second: 0, operator: '+' as const, answer: 0 }
    expect(
      isSameQuestion(generateQuestion(levels[0], previous), previous),
    ).toBe(false)
    random.mockRestore()
  })
  it('terminates even when randomness always returns the same value', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(
      generateQuestion(levels[0], {
        first: 0,
        second: 0,
        operator: '+',
        answer: 0,
      }).answer,
    ).toBe(0)
    random.mockRestore()
  })
})
