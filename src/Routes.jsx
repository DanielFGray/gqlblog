import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import Main from './client/Main'

const Routes = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/testing">Testing</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/testing" exact render={() => 'hello world'} />
    </Switch>
  </div>
)

export default Routes
