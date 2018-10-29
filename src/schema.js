import { makeExecutableSchema } from 'graphql-tools'
import gql from 'graphql-tag'
import blog from './blog'
import git from './gitfeed'

export const resolvers = {
  Query: {
    BlogList: () => blog.list(),
    BlogPost: (root, { file }) => blog.get(file),
    GitActivity: () => git.list(),
  },
}

export const typeDefs = gql`
  type Blog {
     title: String
     category: String
     tags: [String]
     date: Float
     file: String
     content: String
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
    issues: Float!
    forks: Float!
    description: String
    language: String
  }
`

export default makeExecutableSchema({ typeDefs, resolvers })
