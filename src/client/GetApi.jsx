import * as React from 'react'
import PropTypes from 'prop-types'
import { pathOr } from 'ramda'
import { Consumer } from '../createContext'

class GetApi extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    autoFetch: PropTypes.bool,
  }

  static defaultProps = {
    autoFetch: true,
  }

  state = {
    data: pathOr(null, ['ctx', this.props.url], this.props),
    error: null,
    loading: this.props.autoFetch,
  }

  componentDidMount() {
    if (this.props.autoFetch) {
      this.makeRequest()
    }
  }

  fetchData = () => fetch(`${__fullUrl}api${this.props.url}`)
    .then(x => x.json())

  makeRequest = () => {
    this.setState({ loading: true })
    this.fetchData()
      .then(({ status, body }) => {
        if (status === 'ok') {
          this.setState({ data: body, loading: false, error: null })
        } else throw new Error(body)
      })
      .catch(e => {
        this.setState({ error: e.message, loading: false })
        console.log(e)
      })
  }

  render() {
    const { data, error, loading } = this.state
    return this.props.children({
      refresh: this.makeRequest,
      data,
      error,
      loading,
    })
  }
}

export default props => (
  <Consumer>
    {ctx => <GetApi {...props} ctx={ctx} />}
  </Consumer>
)
