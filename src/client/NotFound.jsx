import * as React from 'react'

const NotFound = ({ location: { pathname } }) => (
  <p>
    {`${pathname} does not exist`}
  </p>
)

export default NotFound
