import * as React from 'react'
import { has } from 'ramda'
import { NavLink } from 'react-router-dom'
import routes from '../routes'

// https://reacttraining.com/react-router/web/api/NavLink

class Nav extends React.PureComponent {
  links = routes.filter(has('label'))

  render() {
    return (
      <nav>
        <ul>
          {this.links.map(({ label, path }) => (
            <li key={`${label}_${path}`}>
              <NavLink to={path}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
}

export default Nav
