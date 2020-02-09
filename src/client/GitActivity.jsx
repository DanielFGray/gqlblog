import React from 'react'
import ago from 's-ago'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Loading from './Loading'
import { urlTokens } from '../utils'

const GitActivityQuery = gql`
  query GitActivity {
    GitActivity {
      url
      name
      description
      updated
      stars
      issues
      forks
      language
    }
  }
`

const Linkify = text => urlTokens(text)
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

const prettyData = data => (
  <ul>
    {['stars', 'issues', 'forks']
      .map(name => ({ name, count: data[name] }))
      .filter(x => x.count > 0)
      .map(({ count, name }) => (
        <li key={name}>
          {`${count} ${count === 1 ? name.replace(/s$/, '') : name}`}
        </li>
      ))}
  </ul>
)

const FeedItem = ({
  description = '',
  name,
  updated,
  url,
  ...data
}) => (
  <li className="repoitem">
    <div className="repo">
      <h1 className="title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </h1>
      <div className="language">{data.language}</div>
      <div className="description">{Linkify(description)}</div>
      <div className="updated">
        {`updated ${ago(new Date(updated))}`}
      </div>
      <div className="extra">{prettyData(data)}</div>
    </div>
  </li>
)


export default function GitActivity() {
  const { data, errors, loading } = useQuery(GitActivityQuery)
  if (errors) {
    console.error(errors)
    return 'something went wrong :('
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
          <FeedItem key={x.url} {...x} />))}
      </ul>
    </div>
  )
}
