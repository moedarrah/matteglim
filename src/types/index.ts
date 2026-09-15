export type Operator = '+' | '-' | '×'
export interface Level {
  id: string
  min: number
  max: number
  operators: readonly Operator[]
  multiplicationMax: number
  color: string
  icon: string
  exercise?: 'place-value'
}
export interface Question {
  first: number
  second: number
  operator: Operator
  answer: number
  mode?: 'count' | 'build' | 'split'
}
