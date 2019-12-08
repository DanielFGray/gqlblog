import React from 'react'
import { Helmet } from 'react-helmet-async'
import ago from 's-ago'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Loading from './Loading'

export const BlogPostQuery = gql`
query BlogPost($id: String!) {
  BlogPost(id: $id) {
    id
    title
    category
    url
    date
    tags
    content
    words
    readTime
  }
}`

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
    excerpt,
    content,
  },
}) => {
  const dateObj = new Date(date)
  return (
    <div className="blog" key={id}>
      <h1 className="title">
        <Link to={url}>{title}</Link>
      </h1>
      <div className="meta">
        <div className="category">
          {`category: `}
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
          tagged:
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
  const { errors, data, loading } = useQuery(BlogPostQuery, { variables: { id } })
  if (errors) {
    console.error(errors)
    return 'something went wrong :('
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
