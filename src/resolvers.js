import db from './db'

const resolvers = {
  Query: {
    // foo: async (root, { variables }) => {},
    MessageList: () => db('messages').select(),
  },
  // Mutation: {
  //   MessageAdd: () => db('messages').insert(),
  // },
}

export default resolvers
