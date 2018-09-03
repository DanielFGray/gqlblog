import * as React from 'react'
import PropTypes from 'prop-types'

export default class GetApi extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    initData: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    initData: null,
  }

  state = {
    data: this.props.initData,
    error: null,
    loading: true,
  }

  componentDidMount() {
    if (! this.props.autoFetch) {
      this.fetch()
    }
  }

  fetch = () => {
    this.setState({ loading: true })
    fetch(this.props.url)
      .then(x => x.json())
      .then(data => {
        if (data.status === 'ok') {
          this.setState({ data, loading: false, error: null })
        } else {
          throw new Error(data.message)
        }
      })
      .catch(e => this.setState({ error: e, loading: false }))
  }

  render() {
    const { data, error, loading } = this.state
    const { children } = this.props
    const reload = this.fetch
    return children({
      seed: Math.random(),
      data,
      reload,
      error,
      loading,
    })
  }
}
