import React from 'react'
import ago from 's-ago'
import Loading from './Loading'
import { urlTokens } from '../utils'
import { useGitActivityQuery, GitActivity as TGitActivity } from '../generated-types'

const Linkify = (text: string) => urlTokens(text)
  .map((t, i) => {
    switch (t.type) {
    case 'url':
      return (
        <a
          key={i}
          href={t.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.value}
        </a>
      )
    case 'string':
      return t.value
    default:
      throw new Error('unknown linkify token')
    }
  })

const prettyData = (data: { [key: string]: number | null | undefined }) => (
  <ul>
    {['stars', 'issues', 'forks']
      .map(name => ({ name, count: data[name] }))
      .filter(x => x.count)
      .map(({ count, name }) => (
        <li key={name}>
          {`${count} ${count === 1 ? name.replace(/s$/, '') : name}`}
        </li>
      ))}
  </ul>
)

const FeedItem = ({
  data: {
    description = '',
    name,
    updated,
    url,
    language,
    branches: _b,
    ...data
  },
}: { data: TGitActivity }) => (
  <li className="repoitem">
    <div className="repo">
      <h1 className="title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </h1>
      <div className="language">{language}</div>
      <div className="description">{description && Linkify(description)}</div>
      <div className="updated">
        {`updated ${ago(new Date(updated))}`}
      </div>
      <div className="extra">{prettyData(data)}</div>
    </div>
  </li>
)


export default function GitActivity() {
  const { data, error, loading } = useGitActivityQuery()
  if (error) {
    console.error(error)
    return <>something went wrong :(</>
  }
  if (loading) return <Loading />
  if (! (data?.GitActivity.length)) {
    return <p>I swear they&apos;re around here somewhere..</p>
  }
  return (
    <div className="projects">
      <h1>Git repos</h1>
      <ul className="repolist">
        {data.GitActivity.map(x => (
          <FeedItem key={x.url} data={x} />))}
      </ul>
    </div>
  )
}
