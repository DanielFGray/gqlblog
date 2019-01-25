import * as React from 'react'
import { NavLink } from 'react-router-dom'

// https://reacttraining.com/react-router/web/api/NavLink

const Nav = ({ routes }) => (
  <header>
    <div>
      <img src="https://secure.gravatar.com/avatar/be9906326e4b79af7ab66a157acced4c" />
      {__appTitle}
    </div>
    <nav className="nav">
      <ul>
        {routes
          .filter(({ label }) => label)
          .map(({ label, path }) => (
            <li key={`${label}_${path}`}>
              <NavLink to={path} exact>
                {label[0].toUpperCase().concat(label.slice(1).toLowerCase())}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  </header>
)

export default Nav
