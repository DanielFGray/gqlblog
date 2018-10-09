import gql from 'graphql-tag'

const typeDefs = gql`
  type Message {
    id: Int
    message: String
  }

  type Query {
    MessageList: [Message]
  }`


export default typeDefs
