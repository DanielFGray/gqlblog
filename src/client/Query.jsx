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
    const { body } = this.props.query.loc.source
    if (initData.has(body)) {
      const [res, vars] = initData.get(body)
      if (res.errors) {
        errors = res.errors // eslint-disable-line prefer-destructuring
      } else if (res.data && equals(vars, this.props.variables)) {
        data = res.data // eslint-disable-line prefer-destructuring
      }
    }

    this.state = { data, errors, loading: false }
  }

  componentDidMount() {
    console.log('mounting')
    if (this.state.data === null) {
      this.makeRequest()
    }
  }

  makeRequest = () => {
    console.log('firing')
    this.setState({ loading: true })
    const { variables } = this.props
    const { body } = this.props.query.loc.source
    fetchGraphQL({ query: body, variables })
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
