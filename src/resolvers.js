import db from './db'

const resolvers = {
  Query: {
    MessageList: () => db('messages').select()
  },
  Mutation: {
    MessageAdd: (root, { message }) => db('messages').insert({ message })
      .then(() => db('messages').select()),
    MessagePatch: (root, { id, message }) => db('messages').where({ id }).update({ message })
      .then(() => db('messages').select()),
    MessageDel: (root, { id }) => db('messages').where({ id }).delete()
      .then(() => db('messages').select()),
  },
}

export default resolvers
