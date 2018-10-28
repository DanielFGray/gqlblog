import { makeExecutableSchema } from 'graphql-tools'
import gql from 'graphql-tag'
import md from './mdown'

export const resolvers = {
  Query: {
    BlogList: () => md.list(),
    BlogPost: (root, { file }) => md.get(file),
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
    BlogList: [Blog]
    BlogPost(file: String!): Blog
  }
`

export default makeExecutableSchema({ typeDefs, resolvers })
