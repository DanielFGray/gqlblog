import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (this.props.didCatch) {
      this.props.didCatch({ error, info })
    }
  }

  render() {
    const { error } = this.state
    const { fallback, children } = this.props
    if (error) {
      return fallback
    }
    return children
  }
}
