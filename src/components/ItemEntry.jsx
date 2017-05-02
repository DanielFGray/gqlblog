// @flow
import React, { Component } from 'react'
import { injectState } from 'freactal'
import styles from './list.sss'

class ItemEntry extends Component {
  state = {
    num: 4,
  }

  props: {
    addItem: Function,
  }

  numChange = (e: SyntheticInputEvent) => {
    this.setState({ num: Number(e.target.value) })
  }

  submit = (e: SyntheticInputEvent) => {
    e.preventDefault()
    this.props.addItem(this.state.num)
  }

  render() {
    return (
      <div className={styles.formGroup}>
        <form onSubmit={this.submit}>
          <label htmlFor="list_num">Enter a number: </label>
          <input name="list_num" type="number" value={this.state.num} onChange={this.numChange} />
        </form>
      </div>
    )
  }
}

export default injectState(({ effects }) => <ItemEntry {...effects} />)
