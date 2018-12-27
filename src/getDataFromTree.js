/* eslint-disable no-underscore-dangle */
// shamelessly stolen from react-apollo
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { graphql } from 'graphql'

function getProps(element) {
  return element.props || element.attributes
}

function isReactElement(element) {
  return !! element.type
}

function isComponentClass(Comp) {
  return Comp.prototype && (Comp.prototype.render || Comp.prototype.isReactComponent)
}

function providesChildContext(instance) {
  return !! instance.getChildContext
}

// Recurse a React Element tree, running visitor on each element.
// If visitor returns `false`, don't call the element's render function
// or recurse into its child elements.
export function walkTree(element, context, visitor, newContext = new Map()) {
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
          let patch = newState
          if (typeof newState === 'function') {
            patch = newState(instance.state, instance.props, instance.context)
          }
          instance.state = Object.assign({}, instance.state, patch)
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
        // this needs to clone the map because this value should only apply
        // to children of the provider
        newContext = new Map(newContext) // eslint-disable-line no-param-reassign
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

export const getPromisesFromTree = ({
  rootElement,
  rootContext = {},
  rootNewContext,
}) => {
  const matches = []

  walkTree(
    rootElement,
    rootContext,
    (_, instance, newContext, context, childContext) => {
      if (instance && instance.gqlq) {
        matches.push({
          context: childContext || context,
          instance,
          newContext,
        })
        return false
      }
      return undefined
    },
    rootNewContext,
  )

  return matches
}

export const renderToStringWithData = (app, {
  schema,
  render = renderToString,
  context = {},
  root = {},
}) => Promise.all(
  getPromisesFromTree({ rootElement: app() })
    .map(({ instance }) => {
      const { variables } = instance.props
      const query = instance.gqlq()
      return graphql(schema, query, root, context, variables)
        .then(data => [query, [variables, data]])
    }),
).then(x => x.reduce((p, [k, v]) => ({
  ...p,
  [k]: p[k] ? [v].concat(p[k]) : [v],
}), {}))
  .then(data => ({ html: render(app(data)), data }))
