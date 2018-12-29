// import fs from 'fs'
// import path from 'path'
import markdownIt from 'markdown-it'
import prism from 'markdown-it-prism'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'

const md = markdownIt({})
  .use(prism, { plugins: ['line-highlight'] })
  .use(anchor, { permalink: true, permalinkBefore: true, permalinkSymbol: '#' })
  .use(toc, { containerClass: 'toc', listType: 'ul' })

export default text => md.render(`\${toc}${text}`)
