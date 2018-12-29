import { makeExecutableSchema } from 'graphql-tools'
import gql from 'graphql-tag'
import blog from './blog'
import git from './gitfeed'

const gitfeed = git()
const blogfeed = blog()

export const resolvers = {
  Query: {
    BlogList: () => blogfeed.list(),
    BlogPost: (root, { file }) => blogfeed.get(file),
    GitActivity: () => gitfeed.list(),
  },
}

export const typeDefs = gql`
  type Blog {
     title: String
     category: String
     tags: [String]
     date: Float
     words: Int
     readTime: String
     file: String
     url: String
     content: String
     excerpt: String
  }

  type Query {
    GitActivity: [GitActivity]!
    BlogList: [Blog]!
    BlogPost(file: String!): Blog
  }

  type GitActivity {
    url: String!
    name: String!
    updated: Float!
    stars: Float!
    issues: Float
    forks: Float!
    description: String
    language: String
  }
`

export default makeExecutableSchema({ typeDefs, resolvers })
