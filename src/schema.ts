import { makeExecutableSchema } from 'graphql-tools'
import gql from 'graphql-tag'
import blog from './blog'
import git from './gitfeed'
import { Resolvers } from './generated-types'
import typeDefs from './schema.gql'

const gitfeed = git()
const blogfeed = blog()

export const resolvers: Resolvers = {
  Query: {
    BlogList: () => blogfeed.list(),
    BlogPost: (_, { id }) => blogfeed.get(id),
    GitActivity: () => gitfeed.list(),
  },
}

export default makeExecutableSchema({ typeDefs, resolvers })
