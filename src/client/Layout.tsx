import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Redirect, Switch, Route, RouteProps, RouteComponentProps } from 'react-router-dom'

import { uniq } from '../utils'
import Nav from './Nav'
import Footer from './Footer'
import Main from './Main'
import NotFound from './NotFound'
import Loading from './Loading'
import BlogPost from './BlogPost'
import BlogList from './BlogList'
import GitActivity from './GitActivity'
import { useBlogListQuery } from '../generated-types'

const { APP_TITLE } = process.env

export default function Layout() {
  const { error, data } = useBlogListQuery()
  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  if (!(data && data.BlogList)) return <Loading />

  const categories = uniq(data.BlogList.map(x => x?.category))
  const tagList = uniq(data.BlogList.flatMap(x => x?.tags ?? []))

  // FIXME: this should probably be lifted and computed sooner?
  const routes: (RouteProps & { path: string; label: string })[] = [
    {
      label: 'Home',
      path: '/',
      exact: true,
      component: Main,
    },
    ...data.BlogList.flatMap(({ id, category }) => [
      {
        path: `/${category}/${id}`,
        exact: true,
        render: (props: RouteComponentProps) => (
          <BlogPost {...props} id={id} cache={data.BlogList.find(x => x?.id === id)} />
        ),
      },
      {
        path: `/${id}`,
        exact: true,
        render: _ => <Redirect to={`/${category}/${id}`} />,
      },
    ]),
    ...categories.map(c => ({
      path: `/${c}`,
      label: c,
      exact: true,
      render: (props: RouteComponentProps) => <BlogList {...props} category={c} />,
    })),
    ...tagList.map(t => ({
      path: `/tags/${t}`,
      exact: true,
      render: (props: RouteComponentProps) => <BlogList {...props} tag={t} />,
    })),
    {
      label: 'Projects',
      path: '/projects',
      component: GitActivity,
    },
    {
      component: NotFound,
    },
  ]

  return (
    <div className="layout">
      <Helmet defaultTitle={APP_TITLE} titleTemplate={`${APP_TITLE} | %s`} />
      <Nav {...{ routes }} />
      <main>
        <Switch>
          {routes.map(({ path, render, label: _, component: C, ...rest }) => (
            <Route
              key={path || 'notfound'}
              path={path}
              {...rest}
              render={router => (render ? render(router) : <C {...router} />)}
            />
          ))}
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
