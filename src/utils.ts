import { curry } from 'ramda'

export const thread = curry((as, a) => as.reduce((x, f) => f(x), a))

export const uniq = <T>(x: T[]): T[] => Array.from(new Set(x))

interface Token {
  type: 'string' | 'url'
  value: string
}

/* blame greenjello on freenode for this */
export const urlTokens = (str: string) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
  const tokens: Token[] = []
  let last = 0
  if (!str) return tokens
  str.replace(regex, (m, ...args) => {
    const index = args[args.length - 2]
    tokens.push({
      type: 'string',
      value: str.slice(last, index),
    })
    tokens.push({
      type: 'url',
      value: m,
    })
    last = index + m.length
  })
  tokens.push({
    type: 'string',
    value: str.slice(last),
  })
  return tokens
}
