// @flow
import * as React from 'react'
import { componentFromStream, createEventHandler, setObservableConfig } from 'recompose'
import { curry, path } from 'ramda'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/do'

setObservableConfig({
  fromESObservable: Observable.from,
})

const tap = curry((f, v) => {
  f(v)
  return v
})

const log = tap(console.log) // eslint-disable-line no-console

const Main = componentFromStream(props$ => {
  const { handler: textChange, stream: textChange$ } = createEventHandler()
  return textChange$
    .map(path(['currentTarget', 'value']))
    .do(log)
    .startWith('')
    .combineLatest(props$)
    .map(([text, props]) => (
      <div {...props}>
        <div>
          <input
            placeholder="type stuff"
            value={text}
            onChange={textChange}
            style={{
              width: '100%',
              marginBottom: '10px',
              borderRadius: '3px',
              padding: '3px',
              border: '1px solid #aaa',
            }}
          />
        </div>
        <div>{text}</div>
      </div>
    ))
})

export default Main
