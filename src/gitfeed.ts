import { URL, URLSearchParams } from 'url'
import fs from 'fs-extra'
import path from 'path'
import fetch from 'isomorphic-unfetch'
import * as R from 'ramda'
import query from './githubuser.gql'

import secrets from '../secrets'

export type GitActivity = {
  url: string;
  name: string;
  description: string;
  language?: string;
  updated?: number;
  stars: number;
  issues: number;
  forks: number;
  branches?: {
    committedDate: number;
    message: string;
  }[]
}

const cacheFile = path.resolve('./feedcache.json')
let cache: GitActivity[] = []

const on = R.curry((f, g, a, b) => f(g(a))(g(b)))
const mergeBy = R.curry((p, a, b) => on(R.merge, R.propOr({}, p), a, b))

const request = R.curry(async (a, b) => {
  const method = R.propOr('get', 'method', b)
  const headers = mergeBy('headers', a, b)
  const data = mergeBy('data', a, b)
  let url = b.url.startsWith('http') ? b.url : a.url.concat(b.url)
  let body = undefined
  if (method === 'get') url = url.concat('?').concat(new URLSearchParams(data).toString())
  else body = JSON.stringify(data)
  const res = await fetch(url, {
    method,
    headers,
    body,
  })
  return res.json()
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
    'User-Agent': 'danielfgray/gqlblog',
  },
})

const seconds = (d: number) => new Date(d).getTime()

const gitlabRepos = async (): Promise<GitActivity[]> => {
  const publicProjects = (page: number) => gitlab({
    url: `users/${secrets.gitlab.user}/projects`,
    data: { page, visibility: 'public' },
  })
  const res = (await Promise.all([
    publicProjects(1),
    publicProjects(2),
  ]))
  .flat(1)
  .map(x => ({
    url: x.web_url,
    name: x.name,
    description: x.description,
    updated: seconds(x.last_activity_at),
    stars: x.star_count,
    issues: x.open_issues_count,
    forks: x.forks_count,
  }))
  console.log(`fetched ${res.length} public projects from gitlab`)
  return res
}

const normalizeEdge = <T>(x: { edges: { node: T[] } }): T[] => {
  if (!(x.edges instanceof Array)) throw new Error(`expected input to "normalizeEdge" to be an array, received ${typeof x}`)
  return x.edges.flatMap(e => e.node) ?? []
}

const githubRepos = async (): Promise<GitActivity[]> => {
  const res = await github({
    url: 'graphql',
    method: 'post',
    data: {
      query: query.loc.source.body,
      variables: {
        user: 'danielfgray',
        limit: 100,
        branches: 100,
        forks: false,
      },
    },
  })
  const totalCount = res.data.user.repositories.totalCount
  return R.pipe(
    x => normalizeEdge(x.data.user.repositories),
    R.map(({refs, stargazers, languages, ...rest}) => {
      const branches = R.pipe(
        normalizeEdge,
        R.map(R.pipe(
          ({ name, target }) => {
            const [{ node }] = target.history.edges
            return {
              name,
              ...node
            }
          },
          R.over(R.lensProp('committedDate'), seconds),
        )),
        R.sort(R.descend(x => x.committedDate))
      )(refs)
      const updated = branches[0].committedDate
      return {
        ...rest,
        updated,
        forks: rest.forks.totalCount,
        issues: rest.issues.totalCount,
        stars: stargazers.totalCount,
        language: languages.nodes[0]?.name,
        branches,
      }
    }),
    R.sort(R.descend(x => x.branches[0].committedDate)),
    R.tap(x => console.log(`fetched ${x.length}/${totalCount} public projects from github`)),
  )(res)
}

const getRepos = async (): Promise<GitActivity[]> => {
  console.log('updating repolist cache')
  const res = await Promise.all([gitlabRepos(), githubRepos()])
  return R.pipe(
    R.flatten,
    R.uniqBy(x => x.name),
    R.sort(R.descend(x => x.updated)),
  )(res)
}


const writeCache = async (data: GitActivity[]) => {
  await fs.writeFile(cacheFile, JSON.stringify(data), 'utf8')
  return data
}

const readCache = async () => {
  let result = '[]'
  try {
    result = await fs.readFile(cacheFile, 'utf8')
  } catch (e) {
    console.log('cache missing! writing empty cache')
    return writeCache([])
  }
  return JSON.parse(result)
}

export default async function main(interval?: number) {
  const t = interval ?? 10 * 60 * 1000
  cache = await readCache()
  const f = async () => {
    const data = await getRepos()
    writeCache(data)
    cache = data
  }
  setTimeout(() => {f()}, t)
  if (cache.length === 0) { f() }
  return { list: () => cache }
}
