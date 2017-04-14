// @flow
import React, { PropTypes } from 'react'

const ListItem = (e: number) =>
  <li key={e}>{e} * {e} = {e * e}</li>

const SomeList = ({ name, list }: { name: string, list: Array<number> }) =>
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
