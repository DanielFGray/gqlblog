import db from './db'

const resolvers = {
  Query: {
    // foo: async (root, { variables }) => {},
    MessageList: (root, { start }) => db('messages').select()
      .then(x => ({ ...x, duration: Date.now() - start })),
  },
  Mutation: {
    MessageAdd: (root, { message }) => db('messages').insert({ message }),
  },
}

export default resolvers
