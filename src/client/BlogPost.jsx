import React from 'react'
import Helmet from 'react-helmet-async'
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
    <div className="blog" key={date}>
      <h2 className="title">
        <Link to={`/${file}`}>{title}</Link>
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
      <ul className="tags">
        {'tagged: '}
        {tags.map(e => (
          <li key={e} className="tag">
            <Link to={`/tags/${e}`}>{e}</Link>
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
  <div className="blogContainer">
    <Query query={query} variables={match.params}>
      {({ errors, loading, data }) => {
        if (errors) errors.forEach(e => console.error(e))
        if (loading || ! data || ! data.BlogPost) return 'loading...'
        return (
          <>
            <Helmet>
              <title>{data.BlogPost.title}</title>
            </Helmet>
            {Post(data.BlogPost)}
          </>
        )
      }}
    </Query>
  </div>
)

export default BlogPost
