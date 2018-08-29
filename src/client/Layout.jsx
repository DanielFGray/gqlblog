import * as React from 'react'
import { Helmet } from 'react-helmet'
// import Nav from './Nav'
import { appTitle } from '../../config'

const Layout = ({ children }) => (
  <div>
    <Helmet
      defaultTitle={appTitle}
      titleTemplate={`${appTitle} | %s`}
    >
      <title>{appTitle}</title>
    </Helmet>
    {/* <Nav /> */}
    {children}
  </div>
)
export default Layout
