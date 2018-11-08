/* eslint-disable react/forbid-prop-types */
import * as React from 'react'
import PropTypes from 'prop-types'
import { fetchDedupe } from 'fetch-dedupe'
import { Consumer } from '../createContext'

const type = x => Object.prototype.toString(x).slice(8, -1)

const fetchGraphQL = ({ query, variables }) => fetchDedupe('/graphql', {
  method: 'POST',
  body: JSON.stringify({ query, variables }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(x => x.data)

class Query extends React.Component {
  static propTypes = {
    query: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    children: PropTypes.func.isRequired,
    variables: PropTypes.object,
    ctx: PropTypes.object,
  }

  static defaultProps = {
    ctx: {},
    variables: {},
  }

  constructor(props) {
    super(props)
    let data = null
    let errors = null
    let loading = true
    const res = this.props.ctx.get(this.gqlq, this.props.variables)
    if (res && res.errors) {
      errors = res.errors // eslint-disable-line prefer-destructuring
      loading = false
    } else if (res && res.data) {
      data = res.data // eslint-disable-line prefer-destructuring
      loading = false
    }
    this.state = { data, errors, loading }
  }

  componentDidMount() {
    if (! this.state.data) {
      this.makeRequest()
    }
  }

  gqlq = type(this.props.query) === 'Object' // eslint-disable-line react/sort-comp
    ? this.props.query.loc.source.body
    : this.props.query

  makeRequest = () => {
    this.setState({ loading: true })
    const { variables, ctx } = this.props
    const query = this.gqlq
    fetchGraphQL({ query, variables })
      .then(({ data, errors }) => {
        if (errors) return this.setState({ errors, loading: false })
        ctx.update(query, variables, data)
        return this.setState({ data, loading: false, errors: null })
      })
      .catch(e => {
        this.setState({ errors: [e.message], loading: false })
        console.log(e) // eslint-disable-line no-console
      })
  }

  render() {
    return this.props.children(this.state, this.makeRequest)
  }
}

export default props => (
  <Consumer>
    {ctx => <Query {...props} ctx={ctx} />}
  </Consumer>
)
