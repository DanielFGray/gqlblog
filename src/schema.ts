import { makeExecutableSchema } from 'graphql-tools'
import blog from './blog'
import git from './gitfeed'
import { Resolvers } from './generated-types'
import typeDefs from './typeDefs.gql'

const gitfeed = git()
const blogfeed = blog()

export const resolvers: Resolvers = {
  Query: {
    BlogPost: (_, { id }) => blogfeed.get(id),
    BlogList: () => blogfeed.list(),
    GitActivity: (_, { branches, limit }) => gitfeed.list({ branches, limit }),
  },
}

export default makeExecutableSchema({ typeDefs, resolvers })
