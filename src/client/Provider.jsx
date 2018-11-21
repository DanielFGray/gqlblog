import * as React from 'react'
import equals from 'fast-deep-equal'
import { Provider } from '../createContext'

class MyProvider extends React.Component {
  state = this.props.value

  static defaultProps = {
    value: {},
  }

  update = ({ query, variables, data }) => {
    this.setState(s => ({
      [query]: (s[query]
        ? [...s[query], [variables, data]]
        : [[variables, data]]),
    }))
  }

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
