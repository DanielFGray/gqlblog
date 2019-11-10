import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Redirect, Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { uniq } from '../utils'
import Nav from './Nav'
import Footer from './Footer'
import Main from './Main'
import NotFound from './NotFound'
import Loading from './Loading'
import BlogPost from './BlogPost'
import BlogList from './BlogList'
import GitActivity from './GitActivity'
import query from './BlogList.gql'

export default function Layout() {
  const { errors, data } = useQuery(query)
  if (errors) {
    console.error(errors)
    return 'something went wrong :('
  }

  if (! (data && data.BlogList)) return <Loading />

  const categories = uniq(data.BlogList.map(x => x.category))
  const tagList = uniq(data.BlogList.flatMap(x => x.tags))

  const routes = useMemo(() => [ // FIXME: this should probably be lifted and computed sooner?
    {
      label: 'Home',
      path: '/',
      exact: true,
      component: Main,
    },
    ...data.BlogList.map(({ id, category }) => ({
      path: `/${category}/${id}`,
      exact: true,
      render: props => <BlogPost {...props} id={id} cache={data.BlogList.find(x => x.id === id)} />,
    })),
    ...categories.map(c => ({
      path: `/${c}`,
      label: c,
      exact: true,
      render: props => <BlogList {...props} category={c} />,
    })),
    ...tagList.map(t => ({
      path: `/tags/${t}`,
      exact: true,
      render: props => <BlogList {...props} tag={t} />,
    })),
    ...data.BlogList.map(({ id, category }) => ({
      path: `/${id}`,
      exact: true,
      render: () => <Redirect to={`/${category}/${file}`} />,
    })),
    {
      label: 'Projects',
      path: '/projects',
      component: GitActivity,
    },
    {
      component: NotFound,
    },
  ], [data])

  return (
    <div className="layout">
      <Helmet
        defaultTitle={__appTitle}
        titleTemplate={`${__appTitle} | %s`}
      />
      <Nav {...{ routes }} />
      <div className="main">
        <Switch>
          {routes.map(({ path, label: _, component: C, render, ...rest }) => (
            <Route
              key={path || 'notfound'}
              path={path}
              {...rest}
              render={router => (render ? render(router) : <C {...router} />)}
            />
          ))}
        </Switch>
      </div>
      <Footer />
    </div>
  )
}
