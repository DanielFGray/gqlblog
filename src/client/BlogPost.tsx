import React from 'react'
import { Helmet } from 'react-helmet-async'
import ago from 's-ago'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import { useBlogPostQuery, Blog } from '../generated-types'

export const Post = ({ data }: { data: Blog }) => {
  const dateObj = (data.date && new Date(data.date)) || null
  return (
    <div className="blog" key={data.id}>
      <h1 className="title">
        <Link to={data.url}>{data.title}</Link>
      </h1>
      <div className="meta">
        <div className="category">
          category:
          {' '}
          <Link to={`/${data.category}`}>{data.category}</Link>
        </div>
        <div className="date">
          {dateObj && (
            <a title={dateObj.toLocaleDateString()}>
              {ago(dateObj)}
            </a>
          )}
        </div>
        <div className="readTime">
          <a title={`${data.words} words`}>
            {data.readTime}
          </a>
        </div>
        {(data.tags && data.tags.length) && (
          <ul className="tags">
            tagged:
            {data.tags.map(e => (
              <li key={e} className="tag">
                <Link to={`/tags/${e}`}>{e}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {data.excerpt && (
        <div className="content">
          <p>{data.excerpt}</p>
        </div>
      )}
      {data.content && (
        <div
          className="content"
          dangerouslySetInnerHTML={{__html: data.content /* eslint-disable-line react/no-danger */}}
        />
      )}
    </div>
  )
}

type Cache = Pick<Blog, 'id' | 'title' | 'category' | 'url' | 'date' | 'tags' | 'excerpt' | 'words' | 'readTime'>

// FIXME: why am i manually passing a cache around
export default function BlogPost({ id, cache }: { id: string; cache: Cache }) {
  const { error, data, loading } = useBlogPostQuery({ variables: { id } })
  if (error) {
    console.error(error)
    return <>something went wrong :(</>
  }
  return (
    <div className="blogContainer">
      <Helmet>
        <title>{cache.title}</title>
      </Helmet>
      <Post data={data?.BlogPost ?? cache} />
      {loading && <Loading />}
    </div>
  )
}
