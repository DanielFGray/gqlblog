import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import routes from '../routes'

const Routes = props => (
  <div>
    <Switch>
      {routes.map(({ path, exact, component: C, render }) => (
        <Route
          key={path || 'notfound'}
          path={path}
          exact={exact}
          render={router => {
            if (render) {
              return render({ ...router, ...props })
            }
            return <C {...router} {...props} />
          }}
        />
      ))}
    </Switch>
  </div>
)

export default Routes
