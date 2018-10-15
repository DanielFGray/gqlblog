import gql from 'graphql-tag'

const typeDefs = gql`
  type Message {
    id: Int
    message: String
  }

  type Query {
    MessageList: [Message]
  }

  type Mutation {
    MessageAdd(message: String!): [Message]
    MessagePatch(message: String! id: Int!): [Message]
    MessageDel(id: Int!): [Message]
  }
`

export default typeDefs
