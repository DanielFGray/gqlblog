import React from 'react'
import ago from 's-ago'
import Loading from './Loading'
import { Query } from 'react-apollo'
import { urlTokens } from '../utils'
import query from './GitActivity.gql'

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

const prettyData = data => ['stars', 'issues', 'forks']
  .map(name => ({ name, count: data[name] }))
  .filter(x => x.count > 0)
  .map(({ count, name }) => `${count} ${count === 1 ? name.replace(/s$/, '') : name}`)
  .join(', ')

const FeedItem = ({
  description = '',
  name,
  updated,
  url,
  ...data
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
        if (! (data && data.GitActivity.length)) {
          return <p>I swear they're around here somewhere..</p>
        }
        return (
          <ul className="repolist">
            {data.GitActivity.map(x => <FeedItem key={x.url} {...x} />)}
          </ul>
        )
      }}
    </Query>
  </div>
)
