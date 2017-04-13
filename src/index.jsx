// @flow
import React, { PropTypes } from 'react'
import { render } from 'react-dom'

import './style.sss'

const someList = [
  'foo',
  'bar',
  'baz'
]

const listItem = (e: string) =>
  <li key={e}>{e}</li>

const App = ({ name, list }) =>
  <div className="test">
    <h1>Hello {name}!</h1>
    <ul>
      {list.map(listItem)}
    </ul>
  </div>

App.propTypes = {
  name: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.string),
}

render(<App name="world" list={someList} />, document.getElementById('main'))
