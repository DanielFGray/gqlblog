// @flow
import React, { PropTypes } from 'react'

const ListItem = e =>
  <li key={e}>{e}</li>

const SomeList = ({ name, list }: { name: string, list: Array<string>}) =>
  <div className="test">
    <h1>Hello {name}!</h1>
    <ul>
      {list.map(ListItem)}
    </ul>
  </div>

SomeList.propTypes = {
  name: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.string),
}

export default SomeList
