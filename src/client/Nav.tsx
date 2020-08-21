import * as React from 'react'
import { NavLink } from 'react-router-dom'

const { APP_TITLE } = process.env

export default function Nav({ routes }) {
  return (
    <header>
      <div className="title">{APP_TITLE}</div>
      <nav className="nav">
        <ul>
          {routes
            .filter(({ label }) => label)
            .map(({ label, path }) => (
              <NavLink to={path} exact={path === '/'} key={`${label}_${path}`}>
                <li>{label[0].toUpperCase().concat(label.slice(1).toLowerCase())}</li>
              </NavLink>
            ))}
        </ul>
      </nav>
    </header>
  )
}
