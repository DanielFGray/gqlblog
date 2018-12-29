import * as React from 'react'
import equals from 'fast-deep-equal'
import { fetchDedupe } from 'fetch-dedupe'
import { over, lensPath } from 'ramda'
import { Provider } from '../createContext'

class MyProvider extends React.Component {
  state = { queryCache: this.props.value }

  static defaultProps = {
    value: {},
  }

  update = ({ query, variables, data }) => {
    this.setState(s => {
      if (! s.queryCache[query]) {
        return over(lensPath(['queryCache', query]), () => [[variables, data]], s)
      }
      const inIndex = s.queryCache[query].findIndex(([cache]) => equals(cache, variables))
      if (inIndex < 0) {
        return over(lensPath(['queryCache', query]), c => c.concat([[variables, data]]), s)
      }
      return over(lensPath(['queryCache', query, inIndex]), () => [variables, data], s)
    })
  }

  get = ({ query, variables }) => {
    try {
      return this.state.queryCache[query].find(([cache]) => equals(cache, variables))[1]
    } catch (e) {
      return { data: undefined, errors: undefined }
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
      .then(({ data }) => {
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
