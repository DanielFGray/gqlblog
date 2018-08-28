import * as React from 'react'
import Nav from './Nav'
Import Helmet from 'react-helmet'
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
