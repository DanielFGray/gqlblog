import { URL, URLSearchParams } from 'url'
import { promises as fs } from 'fs'
import path from 'path'
import fetch from 'isomorphic-unfetch'
import * as R from 'ramda'
import githubUserDataQuery from './githubuser.gql'
import { GitActivity } from './generated-types'

const { GITHUB_KEY, GITHUB_USER, GITLAB_KEY, GITLAB_USER } = require('../secrets')

const cacheFile = path.resolve('./feedcache.json')
let cache: GitActivity[] = []

type fetchRequest = RequestInit & { url: string }

const request = R.curry(
  async (a: fetchRequest, b: fetchRequest): Promise<unknown> => {
    const method = a.method ?? b.method ?? 'get'
    const headers = { ...(a?.headers ?? {}), ...(b?.headers ?? {}) }
    const data = {
      ...(a.body ?? {}),
      ...(b.body ?? {}),
    }
    let body = null
    let url = b.url.startsWith('http') ? b.url : a.url.concat(b.url)
    if (method === 'get') url = url.concat('?').concat(new URLSearchParams(data).toString())
    else body = JSON.stringify(data)
    const res = await fetch(url, { method, headers, body })
    return res.json()
  },
)

const gitlab = request({
  url: 'https://gitlab.com/api/v4/',
  headers: {
    'PRIVATE-TOKEN': GITLAB_KEY,
  },
})

const github = request({
  url: 'https://api.github.com/',
  headers: {
    Authorization: `token ${GITHUB_KEY}`,
    'User-Agent': 'danielfgray/gqlblog',
  },
})

const seconds = (d: number) => new Date(d).getTime()

const gitlabRepos = async (): Promise<GitActivity[]> => {
  const publicProjects = (page: number) => gitlab({
    url: `users/${GITLAB_USER}/projects`,
    body: { page, visibility: 'public' },
  })
  const res = (await Promise.all([publicProjects(1), publicProjects(2)])).flat(1).map(x => ({
    id: `${x.id}-${x.web_url}`,
    url: x.web_url,
    name: x.name,
    description: x.description,
    updated: seconds(x.last_activity_at),
    stars: x.star_count,
    issues: x.open_issues_count,
    forks: x.forks_count,
  }))
  console.log(`fetched ${res.length} repos from gitlab`)
  return res
}

const normalizeEdge = <T>(x: { edges: { node: T[] } }): T[] => {
  if (! (x.edges instanceof Array)) {
    throw new Error(`expected input to "normalizeEdge" to be an array, received ${typeof x}`)
  }
  return x.edges.flatMap(e => e.node) ?? []
}

const githubRepos = async (): Promise<GitActivity[]> => {
  const res = await github({
    url: 'graphql',
    method: 'post',
    body: {
      query: githubUserDataQuery.loc.source.body,
      variables: {
        user: GITHUB_USER,
        limit: 100,
        branches: 100,
        commits: 1,
        forks: false,
      },
    },
  })
  if (res.errors) {
    console.error(res)
    throw new Error()
  }
  const { totalCount } = res.data.user.repositories
  return R.pipe(
    x => x.data.user.repositories,
    normalizeEdge,
    R.map(({ refs, stargazers, licenseInfo, primaryLanguage, ...rest }) => {
      const branches = R.pipe(
        normalizeEdge,
        R.filter(x => ! x.name.startsWith('dependabot')),
        R.map(
          R.pipe(({ name, target }) => {
            const [{ node }] = target.history.edges
            return {
              name,
              ...node,
            }
          }, R.over(R.lensProp('committedDate'), seconds)),
        ),
        R.sort(R.descend(x => x.committedDate)),
      )(refs)
      return {
        ...rest,
        updated: branches[0].committedDate,
        createdAt: seconds(rest.createdAt),
        forks: rest.forks.totalCount,
        issues: rest.issues.totalCount,
        stars: stargazers.totalCount,
        language: primaryLanguage?.name,
        collaborators: rest.collaborators?.totalCount,
        pullRequests: rest.pullRequests?.totalCount,
        license: licenseInfo?.nickname,
        branches,
      }
    }),
    R.sort(R.descend(x => x.branches[0].committedDate)),
    R.tap(x => console.log(`fetched ${x.length}/${totalCount} repos from github`)),
  )(res)
}

const getRepos = async (): Promise<GitActivity[]> => {
  console.log('updating repolist cache')
  const res = await Promise.all([githubRepos(), gitlabRepos()])
  return R.pipe<GitActivity[]>(
    R.flatten,
    R.uniqBy(x => x.name),
    R.sort(R.descend(x => x.updated)),
  )(res)
}

const writeCache = async (data: GitActivity[]) => {
  try {
    await fs.writeFile(cacheFile, JSON.stringify(data), 'utf8')
  } catch (e) {
    console.log('failed writing cache!', e)
  }
  return data
}

const readCache = async (): Promise<GitActivity[]> => {
  let result = '[]'
  try {
    result = await fs.readFile(cacheFile, 'utf8')
    return JSON.parse(result)
  } catch (e) {
    console.error('error reading cache! writing empty cache')
    return writeCache([])
  }
}

export default function main(interval?: number) {
  const t = interval ?? 30 * 60 * 1000 // 30 minutes

  const subscribe = async () => {
    const data = await getRepos()
    writeCache(data)
    cache = data
    setTimeout(
      () => {
        subscribe()
      },
      cache.length ? t : 0,
    )
  }

  readCache()
    .then(x => {
      cache = x
      console.log(`${cache.length} repos in cache`)
      subscribe()
    })

  return {
    list: ({ branches = 1, limit = 100 }) => cache
      .map(e => ({
        ...e,
        branches: e.branches?.slice(0, branches),
      }))
      .slice(0, limit),
  }
}
