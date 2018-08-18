const React = require('react')

const NotFound = ({ router: { location: { pathname } } }) => (
  <p>{pathname} does not exist</p>
)

export default NotFound
