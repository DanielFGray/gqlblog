/* eslint-disable react/forbid-prop-types */
import * as React from 'react'
import PropTypes from 'prop-types'
import { Consumer } from '../createContext'

class Query extends React.PureComponent {
  gqlq = typeof this.props.query === 'object'
    ? this.props.query.loc.source.body : this.props.query

  render() {
    return (
      <Consumer>
        {ctx => {
          const { variables } = this.props
          const query = this.gqlq
          const { data, errors } = ctx.get(query, variables)
          const sendRequest = () => ctx.fetchGraphQL({ query, variables })
          let loading = false
          if (data === null && errors === null) {
            sendRequest()
            loading = true
          }
          return this.props.children({ loading, data, errors }, sendRequest)
        }}
      </Consumer>
    )
  }
}

Query.propTypes = {
  query: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  children: PropTypes.func.isRequired,
  variables: PropTypes.object,
}

Query.defaultProps = {
  variables: {},
}


export default Query
