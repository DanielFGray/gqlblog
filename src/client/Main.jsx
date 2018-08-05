import React from 'react'
import GetJson from './GetJson'

const Stringify = data => <pre>{JSON.stringify(data, null, 2)}</pre>

const Main = () => (
  <GetJson url="https://randomuser.me/api">
    {({ error, reload, ...x }) => {
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
            {Stringify({ error, ...x })}
          </div>
        </div>
      )
    }}
  </GetJson>
)

export default Main
