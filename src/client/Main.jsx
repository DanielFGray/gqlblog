import React from 'react'
import GetJson from './GetJson'

const Stringify = data => <pre>{JSON.stringify(data, null, 2)}</pre>

const Main = () => (
  <GetJson url="/api/v1">
    {({ error, reload, data, loading }) => {
      if (error) {
        console.error(error)
      }
      return (
        <div>
          <div>
            <button onClick={reload}>
              Reload
            </button>
          </div>
          <div>
            {Stringify({ error, loading, data })}
          </div>
        </div>
      )
    }}
  </GetJson>
)

export default Main
