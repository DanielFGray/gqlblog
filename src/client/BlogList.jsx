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
      {({ errors, data }) => {
        if (errors) {
          console.error(errors)
          return 'something went wrong :('
        }
        if (! (data && data.BlogList)) return <Loading />
        return sortWith([descend(x => x.date)], data.BlogList)
          .map(e => <Post key={e.file} {...e} />)
      }}
    </Query>
  </div>
)

export default BlogList
