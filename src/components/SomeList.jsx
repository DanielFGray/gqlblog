// @flow
import React from 'react'
import { string, arrayOf, number } from 'prop-types'

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
  name: string.isRequired,
  list: arrayOf(number),
}

export default SomeList
