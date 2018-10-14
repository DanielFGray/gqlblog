import db from './db'

const resolvers = {
  Query: {
    MessageList: () => db('messages').select()
  },
  Mutation: {
    MessageAdd: (root, { message }) => db('messages').insert({ message })
      .then(() => db('messages').select()),
  },
}

export default resolvers
