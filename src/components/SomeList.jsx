// @flow
import React, { Component } from 'react'

import styles from './list.sss'
import ItemEntry from './ItemEntry'

class SomeList extends Component {
  state = {
    list: [1, 2, 3],
  }

  addItem = (num: number) => {
    this.setState(prev => ({ list: prev.list.concat(num) }))
  }

  render() {
    return (
      <div className={styles.list}>
        <ItemEntry addItem={this.addItem} />
        <ListView list={this.state.list} />
      </div>
    )
  }
}

const ListView = ({ list }: { list: Array<number> }) =>
  <ul>
    {list.map(e =>
      <li key={e}>{e} * {e} = {e * e}</li>)}
  </ul>

export default SomeList
