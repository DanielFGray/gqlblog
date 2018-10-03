import * as React from 'react'
import PropTypes from 'prop-types'

export default class GetApi extends React.Component {
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
    data: this.props.initData,
    error: null,
    loading: true,
  }

  componentDidMount() {
    if (this.props.autoFetch) {
      this.fetch()
    }
  }

  fetch = () => {
    this.setState({ loading: true })
    fetch(`/api/v1${this.props.url || ''}`)
      .then(x => x.json())
      .then(res => {
        if (res.status === 'ok') {
          this.setState({ data: res.body, loading: false, error: null })
        } else {
          throw new Error(res.body)
        }
      })
      .catch(e => this.setState({ error: e, loading: false }))
  }

  render() {
    const { data, error, loading } = this.state
    return this.props.children({
      seed: Math.random(),
      reload: this.fetch,
      data,
      error,
      loading,
    })
  }
}
