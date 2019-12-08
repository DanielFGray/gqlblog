import {
  curry,
} from 'ramda'

export const thread = (as, a) => as.reduce((x, f) => f(x), a)

export const filterIf = curry((truthy, fn, list) => (
  truthy
    ? list.filter(fn)
    : list
))

export const uniq = x => Array.from(new Set(x))

export const urlTokens = str => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
  const tokens = []
  let last = 0
  if (! str) return tokens
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
