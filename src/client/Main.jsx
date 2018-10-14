import * as React from 'react'
import Helmet from 'react-helmet-async'
import GetApi from './GetApi'
import Stringify from './Stringify'

const query = `
  query ($start: Int) {
    MessageList(start: $start) {
      id
      message
    }
  }`

const Main = () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h3>Home</h3>
    <GetApi query={query} autoFetch={false} variables={{ start: Date.now() }}>
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
            {Stringify({ data, errors })}
          </div>
        )
      }}
    </GetApi>
  </div>
)

export default Main
