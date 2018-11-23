import * as React from 'react'
import equals from 'fast-deep-equal'
import { fetchDedupe } from 'fetch-dedupe'
import { Provider } from '../createContext'

class MyProvider extends React.Component {
  state = this.props.value

  static defaultProps = {
    value: {},
  }

  update = ({ query, variables, data }) => {
    this.setState(s => {
      if (! s[query]) return { [query]: [[variables, data]] }
      const inI = s[query].findIndex(([cache]) => equals(cache, variables))
      if (inI < 0) return { [query]: s[query].concat([[variables, data]]) }
      return null
      // FIXME: overwrite cache? merge??
    })
  }

  get = (query, variables) => {
    try {
      return this.state[query].find(([cache]) => equals(cache, variables))[1]
    } catch (e) {
      return { data: null, errors: null }
    }
  }

  fetchGraphQL = ({ query, variables }) => {
    fetchDedupe('/graphql', {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(x => x.data)
      .then(data => {
        this.update({ query, variables, data })
      })
  }

  render() {
    const { update, get, fetchGraphQL } = this
    return (
      <Provider value={{ update, get, fetchGraphQL }}>
        {this.props.children}
      </Provider>
    )
  }
}

export default MyProvider
