import * as React from 'react'
import Helmet from 'react-helmet-async'
import { groupBy } from 'ramda'
import { Redirect, Switch, Route } from 'react-router-dom'

import Nav from './Nav'
import Footer from './Footer'
import Main from './Main'
import NotFound from './NotFound'
import Loading from './Loading'
import Query from './Query'
import query from './BlogList.gql'
import BlogPost from './BlogPost'
import BlogList from './BlogList'

const Layout = () => (
  <div className="layout">
    <Helmet
      defaultTitle={__appTitle}
      titleTemplate={`${__appTitle} | %s`}
    />
    <Query query={query}>
      {({ errors, data }) => {
        if (errors) {
          console.error(errors)
          return 'something went wrong :('
        }
        if (! (data && data.BlogList)) return <Loading />
        const byCategories = groupBy(x => x.category, data.BlogList)
        const tagList = Array.from(data.BlogList.reduce((set, post) => {
          post.tags.forEach(t => set.add(t))
          return set
        }, new Set()))
        const categories = Object.keys(byCategories)
        const routes = [
          {
            label: 'Home',
            path: '/',
            exact: true,
            component: Main,
          },
          ...data.BlogList.map(({ file, category }) => ({
            path: `/${category}/${file}`,
            exact: true,
            render: props => <BlogPost {...props} file={file} />,
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
          ...data.BlogList.map(({ file, category }) => ({
            path: `/${file}`,
            exact: true,
            render: () => <Redirect to={`/${category}/${file}`} />,
          })),
          {
            component: NotFound,
          },
        ]
        return (
          <>
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
          </>
        )
      }}
    </Query>
    <Footer />
  </div>
)

export default Layout
