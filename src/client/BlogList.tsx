import * as React from 'react'
import Loading from './Loading'
import { Post } from './BlogPost'
import { useBlogListQuery } from '../generated-types'

export default function BlogList({
  category,
  tag,
}: {
  category?: string;
  tag?: string;
}) {
  const { error, data } = useBlogListQuery()

  if (error) {
    console.error(error)
    return <>something went wrong :(</>
  }

  if (! (data && data.BlogList)) {
    return <Loading />
  }

  return (
    <div className="blogContainer">
      <h1>Blog posts</h1>
      {tag && <b>{`Tagged: ${tag}`}</b>}
      {category && <b>{`Category: ${category}`}</b>}
      {data.BlogList
        .filter(e => {
          if (category && e.category !== category) return false
          if (tag && e.tags?.length && ! e.tags?.includes(tag)) return false
          return true
        })
        .sort((a, b) => {
          const aa = a.date
          const bb = b.date
          return aa > bb ? -1 : aa < bb ? 1 : 0
        })
        .map(y => <Post key={y.id} data={y} />)}
    </div>
  )
}
