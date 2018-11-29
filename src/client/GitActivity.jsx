import React from 'react'
import gql from 'graphql-tag'
import ago from 's-ago'
import Loading from './Loading'
import Query from './Query'
import { urlTokens } from '../utils'

const Linkify = text => urlTokens(text)
  .map((t, i) => (
    t.type === 'url'
      ? (
        <a href={t.value} target="_blank" rel="noopener noreferrer" key={i}>
          {t.value}
        </a>
      )
      : t.value
  ))

const query = gql`
  query {
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

const prettyData = data => ['stars', 'issues', 'forks']
  .map(x => ({ name: x, count: data[x] }))
  .filter(x => x.count > 0)
  .map(x => `${x.count} ${x.count === 1 ? x.name.replace(/s$/, '') : x.name}`)
  .join(', ')

const FeedItem = ({
  description = '',
  name,
  updated,
  url,
  ...data,
}) => (
  <li className="repo">
    <h3 className="title">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    </h3>
    <div className="language">{data.language}</div>
    <div className="description">{Linkify(description)}</div>
    <div className="updated">
      {'updated '}
      {ago(new Date(updated))}
    </div>
    <div className="extra">{prettyData(data)}</div>
  </li>
)


export default () => (
  <div>
    <h3>Git repos</h3>
    <Query query={query}>
      {({ data, errors, loading }) => {
        if (errors) {
          console.error(errors)
          return 'something went wrong :('
        }
        if (loading) return <Loading />
        return data && data.GitActivity.length
          ? (
            <ul className="repolist">
              {data.GitActivity.map(x => <FeedItem key={x.url} {...x} />)}
            </ul>
          ) : (
            <p>{"I swear they're around here somewhere.."}</p>
          )
      }}
    </Query>
  </div>
)
