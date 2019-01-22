import * as React from 'react'
import { sortWith, descend } from 'ramda'
import { Query } from 'react-apollo'
import Loading from './Loading'
import { Post } from './BlogPost'
import query from './BlogList.gql'

const pipe = (fns, x) => fns.reduce((a, f) => f(a), x)

const BlogList = ({ category, tag }) => (
  <div className="blogContainer">
    <h3>Blog posts</h3>
    {tag && <b>{`Tagged: ${tag}`}</b>}
    {category && <b>{`Category: ${category}`}</b>}
    <Query query={query}>
      {({ errors, data }) => {
        if (errors) {
          console.error(errors)
          return 'something went wrong :('
        }
        if (! (data && data.BlogList)) return <Loading />
        return pipe([
          sortWith([descend(x => x.date)]),
          x => (category ? x.filter(e => e.category === category) : x),
          x => (tag ? x.filter(e => e.tags.includes(tag)) : x),
          x => x.map(e => <Post key={e.file} {...e} />),
        ], data.BlogList)
      }}
    </Query>
  </div>
)

export default BlogList
