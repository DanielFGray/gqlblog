import React, { Component } from 'react'
import styles from './list.sss'

class ItemEntry extends Component {
  state = {
    num: 4,
  }

  props: {
    addItem: Function,
  }

  numChange = (e) => {
    this.setState({ num: e.target.value })
  }

  submit = (e) => {
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

export default ItemEntry
