import * as React from 'react'
import PropTypes from 'prop-types'

class GetApi extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    autoFetch: PropTypes.bool,
    initData: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    initData: null,
    autoFetch: true,
  }

  state = {
    data: this.props.initData ? this.props.initData[this.props.url] : null,
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

export default GetApi
