import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import Main from './client/Main'

const Routes = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/test">test</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/test" exact render={() => <p>hello world</p>} />
      <Route render={({ location: { pathname } }) => <p>{pathname} does not exist</p>} />
    </Switch>
  </div>
)

export default Routes
