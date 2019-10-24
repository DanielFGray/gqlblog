import * as React from 'react'
import { pipe, sortWith, descend } from 'ramda'
import { useQuery } from '@apollo/react-hooks'
import Loading from './Loading'
import { Post } from './BlogPost'
import query from './BlogList.gql'

export default function BlogList({ category, tag }) {
  const { errors, data } = useQuery(query)
  if (errors) {
    console.error({ errors })
    return 'something went wrong :('
  }
  if (! (data && data.BlogList)) {
    return <Loading />
  }
  const list = pipe(
    sortWith([descend(x => x.date)]),
    x => (category ? x.filter(e => e.category === category) : x),
    x => (tag ? x.filter(e => e.tags.includes(tag)) : x),
  )(data.BlogList)
  return (
    <div className="blogContainer">
      <h3>Blog posts</h3>
      {tag && <b>{`Tagged: ${tag}`}</b>}
      {category && <b>{`Category: ${category}`}</b>}
      {list.map(e => <Post key={e.file} {...e} />)}
    </div>
  )
}
