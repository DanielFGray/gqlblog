import * as React from 'react'
import gql from 'graphql-tag'
import { sortBy } from 'ramda'
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
  <div className="blogContainer">
    <Query query={BlogList}>
      {({ errors, loading, data }) => {
        if (errors !== null) errors.forEach(e => console.error(e))
        if (loading) return 'loading'
        if (data && data.BlogList) {
          return sortBy(x => x.date, data.BlogList).map(e => <Post {...e} />)
        }
        return null
      }}
    </Query>
  </div>
)

export default Main
