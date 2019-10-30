import {
  curry,
  over,
  lensPath,
} from 'ramda'

export const thread = (a, ...as) => (
  typeof a === 'function'
    ? as.reduce((f, g) => x => f(g(x)), a)
    : as.reduce((x, f) => f(x), a)
)

export const filterIf = curry((truthy, fn, list) => (truthy ? list.filter(fn) : list))

export const uniq = x => Array.from(new Set(x))

export const overPath = curry((lens, fn, x) => over(lensPath(lens), fn, x))

export const findOr = curry((alt, fn, list) => {
  let idx = 0
  const len = list.length
  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx]
    }
    idx += 1
  }
  return alt
})

export const partition = curry((predicates, foldable) => {
  const ps = [].concat(predicates)
  return foldable
    .reduce((prev, item) => {
      let i = ps.findIndex(p => p(item))
      if (i < 0) i = prev.length - 1
      return overPath([i], x => x.concat([item]), prev)
    }, ps.map(() => []).concat([[]]))
})

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
