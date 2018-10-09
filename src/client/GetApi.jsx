import * as React from 'react'
import PropTypes from 'prop-types'
import { findOr } from '../utils'
import { Consumer } from '../createContext'

const fetchGraphQL = query => fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({ query }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(x => x.json())

class GetApi extends React.Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    autoFetch: PropTypes.bool,
  }

  static defaultProps = {
    autoFetch: true,
  }

  gql = this.props.query

  constructor(props) {
    super(props)
    let data = null
    let errors = null
    if (this.props.ctx instanceof Array) {
      const d = findOr(null, ({ source }) => source === this.props.query, this.props.ctx)
      if (d.errors) {
        errors = d.errors // eslint-disable-line prefer-destructuring
      } else if (d.data) {
        data = d.data // eslint-disable-line prefer-destructuring
      }
    }
    this.state = {
      data,
      errors,
      loading: false,
    }
  }

  componentDidMount() {
    if (this.props.autoFetch) {
      this.makeRequest()
    }
  }

  makeRequest = () => {
    this.setState({ loading: true })
    fetchGraphQL(this.props.query)
      .then(({ data, errors }) => {
        if (errors) {
          return this.setState({ errors, loading: false })
        }
        return this.setState({ data, loading: false, errors: null })
      })
      .catch(e => {
        this.setState({ errors: [e.message], loading: false })
        console.log(e) // eslint-disable-line no-console
      })
  }

  render() {
    const { data, errors, loading } = this.state
    return this.props.children({
      refresh: this.makeRequest,
      data,
      errors,
      loading,
    })
  }
}

export default props => (
  <Consumer>
    {ctx => <GetApi {...props} ctx={ctx} />}
  </Consumer>
)
