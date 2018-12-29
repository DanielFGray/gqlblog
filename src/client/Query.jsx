/* eslint-disable react/forbid-prop-types */
import * as React from 'react'
import PropTypes from 'prop-types'
import { Consumer } from '../createContext'

class Query extends React.PureComponent {
  gqlq = () => {
    try {
      if (typeof this.props.query === 'object') {
        return this.props.query.loc.source.body
      }
      return this.props.query
    } catch (e) {
      console.log(this.props.query)
    }
  }

  render() {
    return (
      <Consumer>
        {ctx => {
          const { variables } = this.props
          const query = this.gqlq()
          let { data, errors } = ctx.get({ query, variables })
          const sendRequest = ({ variables: v, query: q } = {}) => ctx
            .fetchGraphQL({ query: q || query, variables: v || variables })
          let loading = false
          if (data === undefined && errors === undefined && this.props.autoFetch) {
            try {
              if (fetch) {
                loading = true
                sendRequest()
              }
            } catch (e) {
              errors = e
            }
          }
          return this.props.children({ loading, errors, data }, sendRequest)
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
  autoFetch: PropTypes.bool,
  variables: PropTypes.object,
}

Query.defaultProps = {
  variables: {},
  autoFetch: true,
}

export default Query
