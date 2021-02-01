import React, { useState } from 'react'
import ago from 's-ago'
import { useParams } from 'react-router'
import { descend } from 'ramda'
import Loading from './Loading'
import { urlTokens } from '../utils'
import { useGitActivityQuery, GitActivity as TGitActivity } from '../generated-types'
import Stringify from './Stringify'

const Linkify = (text: string) =>
  urlTokens(text).map((t, i) => {
    switch (t.type) {
      case 'url':
        return (
          <a key={i} href={t.value} target="_blank" rel="noopener noreferrer">
            {t.value}
          </a>
        )
      case 'string':
        return t.value
      default:
        throw new Error('unknown linkify token')
    }
  })

const prettyData = (data: Partial<TGitActivity>) =>
  ['stars', 'issues', 'forks'].reduce((p: JSX.Element[], name) => {
    const count = data[name]
    if (count) {
      p.push(<li key={name}>{`${count} ${count === 1 ? name.replace(/s$/, '') : name}`}</li>)
    }
    return p
  }, [])

const FeedItem = ({
  data: { description, name, url, language, ...data },
  toggleFilter,
}: {
  data: TGitActivity
  toggleFilter: () => void
}) => {
  const [branch] = data.branches ?? []
  const date = new Date(branch ? branch.committedDate : data.updated)
  const pretty = prettyData(data)
  return (
    <li className="project">
      {language && (
        <button className="language" onClick={() => toggleFilter(language)}>
          {language}
        </button>
      )}
      <div className="title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </div>
      {description && <div className="description">{Linkify(description)}</div>}
      {branch ? (
        <div className="branchinfo">
          <a className="date" title={date.toLocaleString()}>
            {ago(date)}
          </a>
          {' on '}
          <span className="name">{branch.name}</span>
          {': '}
          <a href={branch.commitUrl} className="message" target="_blank" rel="noopener noreferrer">
            {branch.message}
          </a>
        </div>
      ) : (
        <div className="branchinfo">
          <span className="date">{ago(date)}</span>
        </div>
      )}
      {pretty.length > 0 && <ul className="extra">{pretty}</ul>}
    </li>
  )
}

export default function GitActivity() {
  const { data, error, loading } = useGitActivityQuery()
  const [filter, filter$] = useState<string | null>(null)
  const [sort, sort$] = useState<'date' | 'stars' | null>('stars')

  if (error) {
    console.error(error)
    return <>something went wrong :(</>
  }
  if (loading) return <Loading />
  if (!data?.GitActivity.length) {
    return <p>I swear they&apos;re around here somewhere..</p>
  }

  const toggleFilter = (language: string) => filter$(filter === language ? null : language)
  const changeSort = (label: string) => sort$(label)

  const list = data.GitActivity.filter(e => {
    if (filter && filter !== e.language) return false
    return true
  }).sort(descend(x => x[sort === 'stars' ? 'stars' : 'updated']))

  return (
    <div className="projects">
      <h1>Projects</h1>
      <div className="controls">
        {filter && (
          <div className="filterLabel">
            {`filtered by ${filter} `}
            <button className="reset" onClick={() => filter$(null)}>
              X
            </button>
          </div>
        )}
        sort:
        <button
          className={sort === 'date' ? 'active' : undefined}
          onClick={() => changeSort('date')}>
          date
        </button>
        <button
          className={sort === 'stars' ? 'active' : undefined}
          onClick={() => changeSort('stars')}>
          stars
        </button>
      </div>
      <ul className="projectList">
        {list.map(x => (
          <FeedItem key={x.url} data={x} toggleFilter={toggleFilter} />
        ))}
      </ul>
    </div>
  )
}
