import type { Level } from '../types'
export const INITIAL_HEARTS = 3
export const LEVEL_TARGET = 30
export const CELEBRATION_INTERVAL = 5
export const levels: readonly Level[] = [
  {
    id: '1',
    min: 0,
    max: 10,
    operators: ['+'],
    multiplicationMax: 0,
    color: 'mint',
    icon: '🌱',
  },
  {
    id: '2',
    min: 0,
    max: 20,
    operators: ['+', '-'],
    multiplicationMax: 0,
    color: 'peach',
    icon: '🧭',
  },
  {
    id: '3',
    min: 0,
    max: 50,
    operators: ['+', '-'],
    multiplicationMax: 0,
    color: 'lavender',
    icon: '🎈',
  },
  {
    id: '4',
    min: 0,
    max: 50,
    operators: ['+', '-', '×'],
    multiplicationMax: 5,
    color: 'blue',
    icon: '🚀',
  },
  {
    id: '5',
    min: 0,
    max: 100,
    operators: ['+', '-', '×'],
    multiplicationMax: 10,
    color: 'yellow',
    icon: '🌟',
  },
]
