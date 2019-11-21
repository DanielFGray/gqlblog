import * as React from 'react'
import { NavLink } from 'react-router-dom'

// https://reacttraining.com/react-router/web/api/NavLink

export default function Nav({ routes }) {
  return (
    <header>
      <div>
        {__appTitle}
      </div>
      <nav className="nav">
        <ul>
          {routes
            .filter(({ label }) => label)
            .map(({ label, path }) => (
              <NavLink to={path} exact key={`${label}_${path}`}>
                <li>
                  {label[0].toUpperCase().concat(label.slice(1).toLowerCase())}
                </li>
              </NavLink>
            ))}
        </ul>
      </nav>
    </header>
  )
}
