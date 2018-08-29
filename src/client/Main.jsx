import * as React from 'react'
import GetJson from './GetJson'

const Stringify = data => <pre>{JSON.stringify(data, null, 2)}</pre>

const Main = ({ rootProps, ...props }) => (
  <GetJson url="/api/v1" initData={rootProps}>
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
  </GetJson>
)

export default Main
