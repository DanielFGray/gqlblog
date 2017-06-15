// @flow
import React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import 'normalize.css'
import './style.sss'

import Provider from './actions'
import Home from './containers/Home'

const Init = Provider(() => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
    </div>
  </Router>))

render(<Init />, document.getElementById('main'))
