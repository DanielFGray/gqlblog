// @flow
import React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import Home from './containers/Home'
import './style.sss'

const Init = () =>
  <Router>
    <div>
      <Route exact path="/" component={Home} />
    </div>
  </Router>

render(<Init />, document.getElementById('main'))
