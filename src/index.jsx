// @flow
import React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import 'normalize.css'
import './style.sss'

import Home from './containers/Home'

const Init = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
    </div>
  </Router>)

render(<Init />, document.getElementById('main'))
