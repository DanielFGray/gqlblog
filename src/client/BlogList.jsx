import * as React from 'react'
import gql from 'graphql-tag'
import { sortBy } from 'ramda'
import Query from './Query'
import { Post } from './BlogPost'

const query = gql`
query {
  BlogList {
    title
    category
    date
    tags
    file
  }
}`

const BlogList = () => (
  <div className="blogContainer">
    <h3>Blog posts</h3>
    <Query query={query}>
      {({ errors, loading, data }) => {
        if (errors) errors.forEach(e => console.error(e))
        if (loading) return 'loading'
        if (data && data.BlogList) {
          return sortBy(x => x.date, data.BlogList).map(e => <Post key={e.file} {...e} />)
        }
        return null
      }}
    </Query>
  </div>
)

export default BlogList
