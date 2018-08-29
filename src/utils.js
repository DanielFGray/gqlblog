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

export const partition = curry((predicates, foldable) => foldable
  .reduce((previous, item) => {
    let i = predicates.findIndex(p => p(item))
    if (i < 0) i = previous.length - 1
    return overPath([i], x => x.concat([item]), previous)
  }, predicates.map(() => []).concat([[]])))
