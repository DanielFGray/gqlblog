// @flow
import React, { Component } from 'react'

import styles from './list.sss'
import ItemEntry from './ItemEntry'

/* eslint-disable react/prop-types */

class SomeList extends Component {
  state = {
    list: [1, 2, 3],
  }

  addItem = (num: number) =>
    this.setState(prev => ({ list: prev.list.concat(num) }), () => console.log(this.state.list))

  render() {
    return (
      <div className={styles.list}>
        <ItemEntry addItem={this.addItem} />
        <ul>
          {this.state.list.map(e => <li key={e}>{e} * {e} = {e * e}</li>)}
        </ul>
      </div>
    )
  }
}

export default SomeList
