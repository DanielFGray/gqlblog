import * as React from 'react'
import { NavLink } from 'react-router-dom'

// https://reacttraining.com/react-router/web/api/NavLink

const Nav = ({ routes }) => (
  <nav className="nav">
    <ul>
      {routes
        .filter(({ label }) => label)
        .map(({ label, path }) => (
          <li key={`${label}_${path}`}>
            <NavLink to={path}>
              {label[0].toUpperCase().concat(label.slice(1).toLowerCase())}
            </NavLink>
          </li>
        ))}
    </ul>
  </nav>
)

export default Nav
