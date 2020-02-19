import React from 'react'
import Stringify from './Stringify'

interface ErrorBoundary {
  didCatch: (error: Error, info: any) => void;
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundary, { error: null | Error }> {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: any) {
    if (this.props.didCatch) {
      this.props.didCatch(error, info)
    }
  }

  render() {
    const { error } = this.state
    const { fallback, children } = this.props
    if (error) {
      if (fallback) return fallback(error)
      return (
        <div className="ugly_error">
          there was an error :(
          {Stringify(
            error instanceof Error
              ? error.message
              : error
          )}
        </div>
      )
    }
    return children
  }
}

export default ErrorBoundary
