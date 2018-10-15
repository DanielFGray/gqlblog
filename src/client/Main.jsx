import * as React from 'react'
import Helmet from 'react-helmet-async'
import Query from './GetApi'
import Mutation from './Mutation'
import Stringify from './Stringify'

const gqlMessageList = `
  query {
    MessageList {
      id
      message
    }
  }
`

const gqlMessagePatch = `
mutation ($message: String! $id: Int!) {
  MessagePatch(message: $message id: $id) {
    message
    id
  }
}
`

const gqlMessageDel = `
  mutation ($id: Int!) {
    MessageDel(id: $id) {
      message
      id
    }
  }
`

const Item = ({ id, del, patch, message }) => (
  <div key={id}>
    {message}
    {' '}
    <button onClick={del}>Trash</button>
    {' '}
    <button onClick={patch}>Pencil</button>
  </div>
)

const Main = () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h3>Home</h3>
    <Query query={gqlMessageList}>
      {({
        errors,
        loading,
        refresh,
        data,
      }) => {
        if (errors !== null) errors.forEach(console.error)
        return (
          <div>
            <button type="button" onClick={refresh}>
              Reload
            </button>
            {loading && <div>loading...</div>}
            <Mutation query={gqlMessagePatch}>
              {patch => (
                <Mutation query={gqlMessageDel}>
                  {del => data.MessageList.map(({ id, ...x }) => (
                    <Item {...{ key: id, id, del, patch, ...x }} />
                  ))}
                </Mutation>
              )}
            </Mutation>
          </div>
        )
      }}
    </Query>
  </div>
)

export default Main
