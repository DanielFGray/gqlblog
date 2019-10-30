import React from 'react'
import { Helmet } from 'react-helmet-async'
import ago from 's-ago'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import Loading from './Loading'
import query from './BlogPost.gql'

export const Post = ({
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
}) => {
  const dateObj = new Date(date)
  return (
    <div className="blog" key={id}>
      <h2 className="title">
        <Link to={url}>{title}</Link>
      </h2>
      <div className="category">
        {'category: '}
        <Link to={`/${category}`}>{category}</Link>
      </div>
      <div className="date">
        <a title={dateObj.toLocaleDateString()}>
          {ago(dateObj)}
        </a>
      </div>
      <div className="readTime">
        <a title={`${words} words`}>
          {readTime}
        </a>
      </div>
      <ul className="tags">
        {'tagged: '}
        {tags.map(e => (
          <li key={e} className="tag">
            <Link to={`/tags/${e}`}>{e}</Link>
          </li>
        ))}
      </ul>
      {excerpt && (<div className="content">{excerpt}</div>)}
      {content && (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: content /* eslint-disable-line react/no-danger */ }}
        />
      )}
    </div>
  )
}

export default function BlogPost({ id }) {
  const { errors, data } = useQuery(query, { variables: { id } })
  if (errors) {
    console.error(errors)
    return 'something went wrong :('
  }
  if (! (data && data.BlogPost)) return <Loading />
  return (
    <div className="blogContainer">
      <Helmet>
        <title>{data.BlogPost.title}</title>
      </Helmet>
      {Post(data.BlogPost)}
    </div>
  )
}
