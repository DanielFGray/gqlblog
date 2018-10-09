import {
  pipe,
  curry,
  over,
  lensPath,
} from 'ramda'

export const on = curry((f, g, a, b) => f(g(a))(g(b)))

export const thread = (a, ...as) => (
  typeof a === 'function'
    ? pipe(a, ...as)
    : as.reduce((p, f) => f(p), a)
)

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
