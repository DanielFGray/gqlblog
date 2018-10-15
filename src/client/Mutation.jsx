import * as React from 'react'
import PropTypes from 'prop-types'
import { Consumer } from '../createContext'

export default class GetApi extends React.PureComponent {
  render() {
    const f = e => {
      e.preventDefault()
      console.info('not implemented')
    }
    return this.props.children(f)
  }
}
