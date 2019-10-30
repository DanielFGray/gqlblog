import * as React from 'react'
import { sortWith, descend } from 'ramda'
import { useQuery } from '@apollo/react-hooks'
import { thread, filterIf } from '../utils'
import Loading from './Loading'
import { Post } from './BlogPost'
import query from './BlogList.gql'

export default function BlogList({ category, tag }) {
  const { errors, data } = useQuery(query)

  if (errors) {
    console.error(errors)
    return 'something went wrong :('
  }

  if (! (data && data.BlogList)) {
    return <Loading />
  }

  const sortPosts = thread(
    sortWith([descend(x => x.date)]),
    filterIf(category, e => e.category === category),
    filterIf(tag, e => e.tags.includes(tag)),
  )

  return (
    <div className="blogContainer">
      <h3>Blog posts</h3>
      {tag && <b>{`Tagged: ${tag}`}</b>}
      {category && <b>{`Category: ${category}`}</b>}
      {sortPosts(data.BlogList)
        .map(e => <Post key={e.id} {...e} />)}
    </div>
  )
}
