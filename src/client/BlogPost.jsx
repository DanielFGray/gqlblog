import React from 'react'
import Helmet from 'react-helmet-async'
import ago from 's-ago'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import Loading from './Loading'
import query from './BlogPost.gql'

export const Post = ({
  date,
  title,
  category,
  url,
  file,
  tags,
  readTime,
  words,
  excerpt = '',
  content = '',
}) => {
  const dateObj = new Date(date)
  return (
    <div className="blog" key={file}>
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

const BlogPost = ({ file }) => (
  <div className="blogContainer">
    <Query query={query} variables={{ file }}>
      {({ errors, data }) => {
        if (errors) {
          console.error(errors)
          return 'something went wrong :('
        }
        if (! (data && data.BlogPost)) return <Loading />
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
