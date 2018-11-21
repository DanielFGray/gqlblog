import * as React from 'react'
import equals from 'fast-deep-equal'
import { Provider } from '../createContext'

class MyProvider extends React.Component {
  state = this.props.value

  static defaultProps = {
    value: {},
  }

  update = patch => { this.setState(patch) }

  get = (query, variables) => {
    try {
      return this.state[query]
        .find(([vars]) => equals(vars, variables))[1]
    } catch (e) {
      return undefined
    }
  }

  render() {
    const { update, get } = this
    return (
      <Provider value={{ update, get }}>
        {this.props.children}
      </Provider>
    )
  }
}

export default MyProvider
