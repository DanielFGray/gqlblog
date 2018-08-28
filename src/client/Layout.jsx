import * as React from 'react'
import Nav from './Nav'
import { Helmet } from 'react-helmet'
import { appTitle } from '../../config'

export default ({ children }) => (
  <div>
    <Helmet>
      <title>{appTitle}</title>
    </Helmet>
    <Nav />
    {children}
  </div>
)
