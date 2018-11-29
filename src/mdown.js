// import fs from 'fs'
// import path from 'path'
import markdownIt from 'markdown-it'
import prism from 'markdown-it-prism'

const md = markdownIt({})
  .use(prism, { plugins: ['line-highlight'] })

export default text => md.render(text)
