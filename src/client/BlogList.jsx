import * as React from 'react'
import { sortWith, descend } from 'ramda'
import posed, { PoseGroup } from 'react-pose'
import Loading from './Loading'
import { Query } from 'react-apollo'
import { Post } from './BlogPost'
import query from './BlogList.gql'

const pipe = (fns, x) => fns.reduce((a, f) => f(a), x)

const Container = posed.div({
  enter: { staggerChildren: 170 },
  exit: { staggerChildren: 90, staggerDirection: -1 },
})

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
        return (
          <PoseGroup>
            <Container key={''}>
              {pipe([
                sortWith([descend(x => x.date)]),
                x => (category ? x.filter(e => e.category === category) : x),
                x => (tag ? x.filter(e => e.tags.includes(tag)) : x),
                x => x.map(e => <Post key={e.file} {...e} />),
              ], data.BlogList)}
            </Container>
          </PoseGroup>
        )
      }}
    </Query>
  </div>
)

export default BlogList
