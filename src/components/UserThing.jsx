// @flow
import React, { Component } from 'react'
import { injectState } from 'freactal'
import Spinner from './Spinner'

import styles from '../style.sss'

class UserThing extends Component {
  props: {
    effects: {
      getUser: Function,
    },
    state: {
      user: {},
      userPending: boolean,
    },
  }

  componentDidMount() {
    this.props.effects.getUser()
  }

  buttonClick = () => {
    this.props.effects.getUser()
  }

  render() {
    return (
      <div className={styles.card}>
        <button onClick={this.buttonClick}>
          Fetch
        </button>
        <div>
          {this.props.state.userPending || ! this.props.state.user
            ? <div style={{ textAlign: 'center' }}>Fetching data from randomuser.me<Spinner /></div>
            : JSON.stringify(this.props.state.user)}
        </div>
      </div>
    )
  }
}

export default injectState(UserThing)
