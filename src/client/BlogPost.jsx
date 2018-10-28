import React from 'react'
import ago from 's-ago'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import Query from './Query'

export const Post = ({
  date,
  title,
  category,
  file,
  tags,
  content = '',
}) => {
  const dateObj = new Date(date)
  return (
    <div className="item" key={date}>
      <h2 className="title">
        <Link to={`/blog/${file}`}>{title}</Link>
      </h2>
      <div className="category">
        {'category: '}
        <Link to={`/blog/${category}`}>{category}</Link>
      </div>
      <div className="date">
        <a title={dateObj.toLocaleDateString()}>{ago(dateObj)}</a>
      </div>
      <ul className="tags">
        {'tagged: '}
        {tags.map(e => (
          <li key={e} className="tag">
            <Link to={`/blog/tags/${e}`}>{e}</Link>
          </li>
        ))}
      </ul>
      {content && (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: content /* eslint-disable-line react/no-danger */ }}
        />)}
    </div>
  )
}

const query = gql`
  query ($file: String!) {
    BlogPost(file: $file) {
      title
      category
      date
      tags
      file
      content
    }
  }
`

const BlogPost = ({ match }) => (
  <div>
    <Query query={query} variables={match.params}>
      {({
        errors,
        loading,
        data,
      }) => {
        if (errors !== null) errors.forEach(console.error)
        if (loading || ! data || ! data.BlogPost) return null
        return (
          <div className="blog">
            {Post(data.BlogPost)}
          </div>
        )
      }}
    </Query>
  </div>
)

export default BlogPost
