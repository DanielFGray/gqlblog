import { URL, URLSearchParams } from 'url'
import { promises as fs } from 'fs'
import path from 'path'
import fetch from 'isomorphic-unfetch'
import * as R from 'ramda'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { draw } from 'io-ts/lib/Decoder'
import { pipe } from 'fp-ts/lib/pipeable'
import { flow } from 'fp-ts/lib/function'
import * as T from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import githubUserDataQuery from './githubuser.gql'
import { GitActivity } from './generated-types'

const { GITHUB_KEY, GITHUB_USER, GITLAB_KEY, GITLAB_USER } = process.env

const cacheFile = path.resolve('./feedcache.json')
let cache: GitActivity[] = []

type fetchRequest = {
  url: string
  method?: string
  body?: { [k: string]: any }
  headers?: { [k: string]: any }
}

const request = R.curry(
  async (a: fetchRequest, b: fetchRequest): Promise<unknown> => {
    const method = a.method ?? b.method ?? 'get'
    const headers = {
      ...(a?.headers ?? {}),
      ...(b?.headers ?? {}),
    }
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

const seconds = (d: number | string): number => new Date(d).getTime()

const GLResponse = T.type({
  id: T.number,
  name: T.string,
  created_at: T.string,
  description: T.union([T.null, T.string]),
  forks_count: T.number,
  last_activity_at: T.string,
  mirror: T.boolean,
  open_issues_count: T.union([T.undefined, T.number]),
  star_count: T.number,
  tag_list: T.array(T.string),
  visibility: T.union([T.literal('private'), T.literal('public')]),
  web_url: T.string,
})
type GLResponse = T.TypeOf<typeof GLResponse>

const gitlabRepos = async (): Promise<GitActivity[]> => {
  const publicProjects = (page: number): Promise<unknown> =>
    gitlab({
      url: `users/${GITLAB_USER}/projects`,
      body: { page, visibility: 'public' },
    })

  const res = await Promise.all([publicProjects(1), publicProjects(2)]).then(x =>
    T.array(GLResponse).decode(x.flat(1)),
  )

  if (E.isLeft(res)) {
    console.log(E.map(PathReporter.report)(res))
    throw new Error('invalid response from gitlab')
  }

  const data = pipe(
    res.right,
    R.map(e => ({
      id: `${e.id}-${e.web_url}`,
      url: e.web_url,
      name: e.name,
      description: e.description,
      updated: seconds(e.last_activity_at),
      stars: e.star_count,
      issues: e.open_issues_count,
      forks: e.forks_count,
    })),
  )
  console.log(`fetched ${data.length} repos from gitlab`)
  return data
}

const TypeTotalCount = T.type({ totalCount: T.number })

const GHResponse = T.type({
  data: T.type({
    user: T.type({
      repositories: T.type({
        totalCount: T.number,
        nodes: T.array(
          T.type({
            id: T.string,
            name: T.string,
            description: T.union([T.null, T.string]),
            url: T.string,
            createdAt: T.string,
            diskUsage: T.number,
            collaborators: TypeTotalCount,
            licenseInfo: T.union([
              T.null,
              T.type({
                nickname: T.union([T.null, T.string]),
              }),
            ]),
            stargazers: TypeTotalCount,
            forks: TypeTotalCount,
            issues: TypeTotalCount,
            pullRequests: TypeTotalCount,
            primaryLanguage: T.union([T.null, T.type({ name: T.string })]),
            refs: T.type({
              nodes: T.array(
                T.type({
                  name: T.string,
                  target: T.type({
                    history: T.type({
                      nodes: T.array(
                        T.type({
                          author: T.type({ name: T.string }),
                          id: T.string,
                          committedDate: T.string,
                          message: T.string,
                          commitUrl: T.string,
                        }),
                      ),
                    }),
                  }),
                }),
              ),
            }),
          }),
        ),
      }),
    }),
  }),
})
type GHResponse = T.TypeOf<typeof GHResponse>

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
  }).then(x => GHResponse.decode(x))

  if (E.isLeft(res)) {
    console.log(E.map(PathReporter.report)(res))
    throw new Error('invalid response from github')
  }

  const { totalCount } = res.right.data.user.repositories
  return pipe(
    res.right.data.user.repositories.nodes,
    R.map(({ refs, stargazers, licenseInfo, primaryLanguage, ...rest }) => {
      const branches = pipe(
        refs.nodes,
        R.map(({ name, target }) => {
          const [node] = target.history.nodes
          return {
            name,
            ...node,
            committedDate: seconds(node.committedDate),
          }
        }),
        R.filter(x => !(x.author?.name?.endsWith('[bot]') || x.author?.name?.endsWith('bot'))),
        R.sort(R.descend(x => x.committedDate)),
      )
      return {
        ...rest,
        updated: branches[0].committedDate,
        createdAt: seconds(Number(rest.createdAt)),
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
  )
}

const getRepos = async (): Promise<GitActivity[]> => {
  console.log('updating repolist cache')
  const res = await Promise.all([githubRepos(), gitlabRepos()])
  return pipe(
    R.uniqBy(x => x.name, res.flat(1)),
    R.sort(R.descend(x => x.updated)),
  )
}

const writeCache = async (data: GitActivity[]) => {
  try {
    await fs.writeFile(cacheFile, JSON.stringify(data), 'utf8')
  } catch (e) {
    console.log('failed writing cache!', e)
    process.exit(1)
  }
  return data
}

const readCache = async (): Promise<GitActivity[]> => {
  let result = '[]'
  try {
    return pipe(
      await fs.readFile(cacheFile, 'utf8'),
      JSON.parse,
      (x: unknown) =>
        T.type({
          id: T.string,
          url: T.string,
          name: T.string,
          updated: T.number,
          stars: T.number,
          forks: T.number,
          issues: T.union([T.null, T.number]),
          description: T.union([T.null, T.string]),
          language: T.union([T.null, T.string]),
          collaborators: T.union([T.null, T.number]),
          diskUsage: T.union([T.null, T.number]),
          pullRequests: T.union([T.null, T.number]),
          license: T.union([T.null, T.string]),
          branches: T.union([
            T.null,
            T.array(
              T.type({
                id: T.string,
                committedDate: T.string,
                message: T.string,
                commitUrl: T.string,
              }),
            ),
          ]),
        }).decode(x),
      E.fold(
        _ => [],
        x => x,
      ),
    )
  } catch (e) {
    console.error('error reading cache! writing empty cache')
    return writeCache([])
  }
}

export default function main(interval?: number) {
  const t = interval ?? 30 * 60 * 1000 // 30 minutes

  async function subscribe() {
    const data = await getRepos()
    cache = data
    await writeCache(data)
    setTimeout(subscribe, t)
  }

  readCache().then(x => {
    cache = x
    console.log(`${cache.length} repos in cache`)
    setTimeout(subscribe, cache.length ? t : 0)
  })

  return {
    list: ({ branches = 1, limit = 100 }) =>
      cache
        .map(e => ({
          ...e,
          branches: e.branches?.slice(0, branches),
        }))
        .slice(0, limit),
  }
}
