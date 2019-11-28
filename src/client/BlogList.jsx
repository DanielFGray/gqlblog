import * as React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { thread, filterIf } from '../utils'
import Loading from './Loading'
import { Post } from './BlogPost'
import gql from 'graphql-tag'

export const BlogListQuery = gql`
query BlogList {
  BlogList {
    id
    title
    category
    url
    date
    tags
    excerpt
    words
    readTime
  }
}`

export default function BlogList({ category, tag }) {
  const { errors, data } = useQuery(BlogListQuery)

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
    {data.reduce((p, c) => {
      if ((category && c.category !== category) || (tag && c.tags.includes(tag))) {
        return p
      }
      p.push(c)
      return p
    }, [])
      .sort((a, b) => b.date - a.date)
      .map(y => <Post key={y.id} data={y} />) }
  </div>
)
