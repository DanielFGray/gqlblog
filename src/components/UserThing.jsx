// @flow
import React, { Component } from 'react'
import { injectState } from 'freactal'
import Spinner from './Spinner'

import styles from '../style.sss'

const User = props => (
  <div
    style={{
      padding: '10px',
      margin: '10px 0',
      background: '#fff',
      'border-radius': '5px',
    }}
  >
    <img
      alt=""
      src={props.picture.large}
      style={{ 'border-radius': '5px', float: 'right' }}
    />
    <pre style={{ margin: 0 }}>
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>
)

class UserThing extends Component {
  props: {
    effects: {
      getUser: Function,
    },
    state: {
      user: Array<Object>,
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
          {this.props.state.userPending &&
            <div style={{ textAlign: 'center' }}>
              Fetching data from randomuser.me
              <Spinner />
            </div>}
          {this.props.state.user.map(User)}
        </div>
      </div>
    )
  }
}

export default injectState(UserThing)
