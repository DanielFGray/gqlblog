import * as React from 'react'
import PropTypes from 'prop-types'
import equals from 'fast-deep-equal'
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

class Query extends React.Component {
  static propTypes = {
    query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    children: PropTypes.func.isRequired,
    variables: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    ctx: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
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
      const [res, vars] = initData.get(this.props.query)
      if (res.errors) {
        errors = res.errors // eslint-disable-line prefer-destructuring
      } else if (res.data && equals(vars, this.props.variables)) {
        data = res.data // eslint-disable-line prefer-destructuring
      }
    }

    this.state = { data, errors, loading: false }
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
        if (errors) return this.setState({ errors, loading: false })
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
    {ctx => <Query {...props} {...{ ctx }} />}
  </Consumer>
)
