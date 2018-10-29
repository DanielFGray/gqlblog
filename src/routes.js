import Main from './client/Main'
import BlogPost from './client/BlogPost'
import NotFound from './client/NotFound'

export default [
  {
    path: '/:file',
    component: BlogPost,
  },
  {
    label: 'Home',
    path: '/',
    exact: true,
    component: Main,
  },
  {
    component: NotFound,
  },
]
