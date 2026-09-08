import type { Level, Question } from '../types'
const randomInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
export function isSameQuestion(a: Question, b: Question) {
  return (
    a.first === b.first && a.second === b.second && a.operator === b.operator
  )
}
export function generateQuestion(level: Level, previous?: Question): Question {
  let question: Question
  let attempts = 0
  do {
    const operator =
      level.operators[randomInteger(0, level.operators.length - 1)]
    const max = operator === '×' ? level.multiplicationMax : level.max
    const min = operator === '×' ? 0 : level.min
    let first = randomInteger(min, max)
    let second = randomInteger(min, max)
    if (operator === '-' && first < second) [first, second] = [second, first]
    const answer =
      operator === '+'
        ? first + second
        : operator === '-'
          ? first - second
          : first * second
    question = { first, second, operator, answer }
    attempts += 1
  } while (previous && isSameQuestion(question, previous) && attempts < 30)
  return question
}
