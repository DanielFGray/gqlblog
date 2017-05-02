// @flow
import React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'
import { provideState } from 'freactal'

import Home from './containers/Home'
import './style.sss'

const wrapComponentWithState = provideState({
  initialState: () => ({ list: [1, 2, 3] }),
  effects: {
    addItem: (effects, newVal) => state =>
      ({ ...state, list: state.list.concat(newVal) }),
  },
})

const Init = wrapComponentWithState(() =>
  <Router>
    <div>
      <Route exact path="/" component={Home} />
    </div>
  </Router>)

render(<Init />, document.getElementById('main'))
