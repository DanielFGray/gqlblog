import * as React from 'react'
import gql from 'graphql-tag'
import Query from './Query'
import { Post } from './BlogPost'

const BlogList = gql`
query {
  BlogList {
    title
    category
    date
    tags
    file
  }
}`

const Main = () => (
  <div className="blog">
    <Query query={BlogList}>
      {({ errors, loading, data }) => {
        if (errors !== null) errors.forEach(e => console.error(e))
        if (loading) return 'loading'
        if (data && data.BlogList) return data.BlogList.map(e => <Post {...e} />)
        return ''
      }}
    </Query>
  </div>
)

export default Main
