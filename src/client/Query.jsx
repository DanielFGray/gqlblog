import * as React from 'react'
import PropTypes from 'prop-types'
import { Consumer } from '../createContext'

const fetchGraphQL = ({ query, variables }) => fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({ query, variables }),
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
    variables: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    ctx: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    autoFetch: false,
    ctx: {},
    variables: {},
  }

  gql = this.props.query

  constructor(props) {
    super(props)
    let data = null
    let errors = null
    const { initData } = this.props.ctx
    if (initData.has(this.props.query)) {
      const q = initData.get(this.props.query)
      if (q.errors) {
        errors = q.errors // eslint-disable-line prefer-destructuring
      } else if (q.data) {
        data = q.data // eslint-disable-line prefer-destructuring
      }
    }

    this.state = {
      data,
      errors,
      loading: false,
    }
  }

  componentDidMount() {
    if (this.props.autoFetch || this.props.data === null) {
      this.makeRequest()
    }
  }

  makeRequest = () => {
    this.setState({ loading: true })
    const { query, variables } = this.props
    fetchGraphQL({ query, variables })
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
