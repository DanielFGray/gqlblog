import fs from 'fs'
import path from 'path'
import { Observable } from 'rxjs'
import superagent from 'superagent'
import dequals from 'fast-deep-equal'
import {
  curry,
  flatten,
  map,
  merge,
  pipe,
  prop,
  propOr,
  reverse,
  sortBy,
  uniqBy,
  type,
} from 'ramda'

import secrets from '../secrets'

const cacheFile = path.resolve('./feedcache.json')
let cache = []

const on = curry((f, g, a, b) => f(g(a))(g(b)))
const equals = curry(dequals)
const mergeBy = curry((p, a, b) => on(merge, propOr({}, p), a, b))
const writeFile = Observable.bindNodeCallback(fs.writeFile)
const readFile = Observable.bindNodeCallback(fs.readFile)

const request = curry((a, b) => {
  const method = propOr('get', 'method', b)
  const headers = mergeBy('headers', a, b)
  const data = mergeBy('data', a, b)
  const url = b.url.startsWith('http') ? b.url : a.url.concat(b.url)
  const r = superagent(method, url).set(headers)
  return Observable.defer(() => prop(method, {
    get: () => r.query(data),
    post: () => r.send(data),
  })().then(prop('body')))
})

const gitlab = request({
  url: 'https://gitlab.com/api/v4/',
  headers: {
    'PRIVATE-TOKEN': secrets.gitlab.key,
  },
})

const github = request({
  url: 'https://api.github.com/',
  headers: {
    Authorization: `token ${secrets.github.key}`,
  },
})

const seconds = d => new Date(d).getTime()

const gitlabRepos = () => {
  const publicProjects = page => gitlab({
    url: `users/${secrets.gitlab.user}/projects`,
    data: { page, visibility: 'public' },
  })
  return publicProjects(1)
    .merge(publicProjects(2))
    .reduce((p, c) => p.concat(c), [])
    .map(map(x => ({
      url: x.web_url,
      name: x.name,
      description: x.description,
      updated: seconds(x.last_activity_at),
      stars: x.star_count,
      issues: x.open_issues_count,
      forks: x.forks_count,
    })))
    .do(x => console.log(`fetched ${x.length} public projects from gitlab`))
}

const githubRepos = () => github({
  url: 'search/repositories',
  data: { q: 'user:DanielFGray fork:false' },
  headers: {
    Accept: 'application/vnd.github.mercy-preview+json',
  },
})
  .map(x => prop('items', x))
  .do(x => console.log(`fetched ${x.length} public projects from github`))
  .map(map(x => ({
    url: x.html_url,
    name: x.name,
    description: x.description,
    updated: seconds(x.updated_at),
    language: x.language,
    stars: x.stargazers_count,
    issues: x.open_issues_count,
    forks: x.forks,
  })))

const getRepos = () => Observable.of([])
  .do(() => console.log('updating repolist cache'))
  .combineLatest(githubRepos(), gitlabRepos())
  .map(pipe(
    flatten,
    uniqBy(prop('name')),
    sortBy(prop('updated')),
    reverse,
  ))

const t = 3 * 60 * 60 * 1000

readFile(cacheFile, 'utf8')
  .map(f => {
    try {
      return JSON.parse(f)
    } catch(e) {return []}
  })
  .merge(Observable.timer(0, t).flatMap(getRepos))
  .do(x => console.log(`${x.length} repos in cache`))
  .do(x => {
    cache = x
    console.log('in-memory cache updated')
  })
  .flatMap(data => writeFile(cacheFile, JSON.stringify(data, null, 2), 'utf8')
    .do(() => console.log('disk cache updated'))
    .map(() => data))
  .subscribe(() => {}, e => {
    console.error(e)
    // process.exit(1)
  })

export default { list: () => cache }
