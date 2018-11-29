import * as React from 'react'
import gql from 'graphql-tag'
import { sortWith, descend } from 'ramda'
import Loading from './Loading'
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
        if (errors) {
          console.error(errors)
          return 'something went wrong :('
        }
        if (loading) return <Loading />
        if (data && data.BlogList) {
          return sortWith([descend(x => x.date)], data.BlogList)
            .map(e => <Post key={e.file} {...e} />)
        }
        return null
      }}
    </Query>
  </div>
)

export default BlogList
