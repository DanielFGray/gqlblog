// @flow
import * as React from 'react'
import { render } from 'react-dom'

import 'normalize.css'
import './style.sss'

const Main = () => (
  <h1>
    hello world
  </h1>
)

render(<Main />, document.getElementById('main'))
