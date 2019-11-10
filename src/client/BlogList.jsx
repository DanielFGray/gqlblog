import * as React from 'react'
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

  return (
    <List
      data={data.BlogList}
      tag={tag}
      category={category}
    />
  )
}

export const List = ({ tag, category, data }) => (
  <div className="blogContainer">
    <h1>Blog posts</h1>
    {tag && <b>{`Tagged: ${tag}`}</b>}
    {category && <b>{`Category: ${category}`}</b>}
    {thread(
      data.sort((a, b) => b.date - a.date),
      filterIf(category, e => e.category === category),
      filterIf(tag, e => e.tags.includes(tag)),
    ).map(x => <Post key={x.id} data={x} />)}
  </div>
)
