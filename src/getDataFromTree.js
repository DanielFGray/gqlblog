// shamelessly stolen from react-apollo
import * as React from 'react'

const getProps = element => element.props || element.attributes
const isReactElement = element => Boolean(element.type)
const isComponentClass = Comp => Comp.prototype
  && (Comp.prototype.render || Comp.prototype.isReactComponent)
const providesChildContext = instance => Boolean(instance.getChildContext)
const hasFetchDataFunction = instance => typeof instance.fetchData === 'function'
const isPromise = promise => typeof promise.then === 'function'

// Recurse a React Element tree, running visitor on each element.
// If visitor returns `false`, don't call the element's render function
// or recurse into its child elements.
export function walkTree(
  element,
  context,
  visitor,
  newContext = new Map(),
) {
  if (! element) {
    return
  }

  if (Array.isArray(element)) {
    element.forEach(item => walkTree(item, context, visitor, newContext))
    return
  }

  // A stateless functional component or a class
  if (isReactElement(element)) {
    if (typeof element.type === 'function') {
      const Comp = element.type
      const props = Object.assign({}, Comp.defaultProps, getProps(element))
      let childContext = context
      let child

      // Are we are a react class?
      if (isComponentClass(Comp)) {
        const instance = new Comp(props, context)
        // In case the user doesn't pass these to super in the constructor.
        // Note: `Component.props` are now readonly in `@types/react`, so
        // we're using `defineProperty` as a workaround (for now).
        Object.defineProperty(instance, 'props', {
          value: instance.props || props,
        })
        instance.context = instance.context || context

        // Set the instance state to null (not undefined) if not set, to match React behaviour
        instance.state = instance.state || null

        // Override setState to just change the state, not queue up an update
        // (we can't do the default React thing as we aren't mounted
        // "properly", however we don't need to re-render as we only support
        // setState in componentWillMount, which happens *before* render).
        instance.setState = newState => {
          if (typeof newState === 'function') {
            newState = newState(instance.state, instance.props, instance.context)
          }
          instance.state = Object.assign({}, instance.state, newState)
        }

        if (Comp.getDerivedStateFromProps) {
          const result = Comp.getDerivedStateFromProps(instance.props, instance.state)
          if (result !== null) {
            instance.state = Object.assign({}, instance.state, result)
          }
        } else if (instance.UNSAFE_componentWillMount) {
          instance.UNSAFE_componentWillMount()
        } else if (instance.componentWillMount) {
          instance.componentWillMount()
        }

        if (providesChildContext(instance)) {
          childContext = Object.assign({}, context, instance.getChildContext())
        }

        if (visitor(element, instance, newContext, context, childContext) === false) {
          return
        }

        child = instance.render()
      } else {
        // Just a stateless functional
        if (visitor(element, null, newContext, context) === false) {
          return
        }

        child = Comp(props, context)
      }

      if (child) {
        if (Array.isArray(child)) {
          child.forEach(item => walkTree(item, childContext, visitor, newContext))
        } else {
          walkTree(child, childContext, visitor, newContext)
        }
      }
    } else if (element.type._context || element.type.Consumer) {
      // A React context provider or consumer
      if (visitor(element, null, newContext, context) === false) {
        return
      }

      let child
      if (element.type._context) {
        // A provider - sets the context value before rendering children
        // this needs to clone the map because this value should only apply to
        // children of the provider
        newContext = new Map(newContext)
        newContext.set(element.type, element.props.value)
        child = element.props.children
      } else {
        // A consumer
        let value = element.type._currentValue
        if (newContext.has(element.type.Provider)) {
          value = newContext.get(element.type.Provider)
        }
        child = element.props.children(value)
      }

      if (child) {
        if (Array.isArray(child)) {
          child.forEach(item => walkTree(item, context, visitor, newContext))
        } else {
          walkTree(child, context, visitor, newContext)
        }
      }
    } else {
      // A basic string or dom element, just get children
      if (visitor(element, null, newContext, context) === false) {
        return
      }

      if (element.props && element.props.children) {
        React.Children.forEach(element.props.children, child => {
          if (child) {
            walkTree(child, context, visitor, newContext)
          }
        })
      }
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    // Just visit these, they are leaves so we don't keep traversing.
    visitor(element, null, newContext, context)
  }
  // TODO: Portals?
}

export const getPromisesFromTree = ({ rootElement, rootContext, rootNewContext }) => {
  const promises = []

  walkTree(
    rootElement,
    rootContext,
    (_, instance, newContext, context, childContext) => {
      if (instance && hasFetchDataFunction(instance)) {
        const promise = instance.fetchData()
        if (isPromise(promise)) {
          promises.push({
            promise,
            context: childContext || context,
            instance,
            newContext,
          })
          return false
        }
      }
      return undefined
    },
    rootNewContext,
  )

  return promises
}

export const getDataAndErrorsFromTree = (
  rootElement,
  rootContext,
  storeError,
  rootNewContext = new Map(),
) => {
  const promises = getPromisesFromTree({ rootElement, rootContext, rootNewContext })

  if (! promises.length) {
    return Promise.resolve()
  }

  return Promise.all(promises.map(({ promise, context, instance, newContext }) => promise
    .then(_ => getDataAndErrorsFromTree(instance.render(), context, storeError, newContext))
    .catch(e => storeError(e))))
}

const processErrors = errors => {
  switch (errors.length) {
  case 0:
    break
  case 1:
    throw errors.pop()
  default:
    const wrapperError = new Error(
      `${errors.length} errors were thrown when executing your fetchData functions.`,
    )
    wrapperError.queryErrors = errors
    throw wrapperError
  }
}

export function getDataFromTree(rootElement, rootContext = {}) {
  const errors = []
  const storeError = error => errors.push(error)

  return getDataAndErrorsFromTree(rootElement, rootContext, storeError)
    .then(_ => processErrors(errors))
}
