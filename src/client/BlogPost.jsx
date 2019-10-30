import React from 'react'
import { Helmet } from 'react-helmet-async'
import ago from 's-ago'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import Loading from './Loading'
import query from './BlogPost.gql'

export const Post = ({
  data: {
    date,
    title,
    category,
    url,
    id,
    tags,
    readTime,
    words,
    excerpt = '',
    content = '',
  },
}) => {
  const dateObj = new Date(date)
  return (
    <div className="blog" key={id}>
      <h1 className="title">
        <Link to={url}>{title}</Link>
      </h1>
      <div className="meta">
        {'category: '}
        <Link to={`/${category}`}>{category}</Link>
        {' - '}
        <a title={dateObj.toLocaleDateString()}>
          {ago(dateObj)}
        </a>
        {' - '}
        <a title={`${words} words`}>
          {readTime}
        </a>
        {' - '}
        <ul className="tags">
          {'tagged: '}
          {tags.map(e => (
            <li key={e} className="tag">
              <Link to={`/tags/${e}`}>{e}</Link>
            </li>
          ))}
        </ul>
      </div>
      {excerpt && (
        <div className="content">
          <p>{excerpt}</p>
        </div>
      )}
      {content && (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: content /* eslint-disable-line react/no-danger */ }}
        />
      )}
    </div>
  )
}

export default function BlogPost({ id, cache }) { // FIXME: why am i manually passing a cache around
  const { errors, data } = useQuery(query, { variables: { id } })
  if (errors) {
    console.error(errors)
    return 'something went wrong :('
  }
  return (
    <div className="blogContainer">
      <Helmet>
        <title>{cache.title}</title>
      </Helmet>
      <Post data={(data && data.BlogPost) || cache} />
    </div>
  )
}
