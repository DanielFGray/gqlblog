import * as React from 'react'
import Helmet from 'react-helmet-async'
import GetApi from './GetApi'

const Stringify = data => <pre>{JSON.stringify(data, null, 2)}</pre>

const Main = ({ initData, ...props }) => (
  <>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <GetApi autoFetch={false} initData={initData}>
      {({
        error,
        loading,
        reload,
        data,
      }) => {
        if (error !== null) console.error(error)
        return (
          <div>
            <div>
              <button type="button" onClick={reload}>
                Reload
              </button>
            </div>
            {Stringify({
              seed: Math.random(),
              loading,
              data,
              ...props,
            })}
          </div>
        )
      }}
    </GetApi>
  </>
)

export default Main
