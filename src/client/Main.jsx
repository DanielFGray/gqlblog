import * as React from 'react'
import Helmet from 'react-helmet-async'
import GetApi from './GetApi'

const Stringify = data => <pre>{JSON.stringify(data, null, 2)}</pre>

const Main = props => (
  <>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <GetApi
      url="/"
      autoFetch={false}
      initData={props.initData}
    >
      {({
        error,
        loading,
        refresh,
        data,
      }) => {
        if (error !== null) console.error(error)
        return (
          <div>
            <button type="button" onClick={refresh}>
              Reload
            </button>
            {Stringify({
              seed: Math.random(),
              loading,
              data,
              props,
            })}
          </div>
        )
      }}
    </GetApi>
  </>
)

export default Main
