// const fs = require('fs')
// const path = require('path')
import prism from 'prismjs'
import { has } from 'ramda'
import Marked from 'marked'

const renderer = new Marked.Renderer()
renderer.code = function renderCode(code, header) {
  const unknown = `<code><pre class="language-">${code}</pre></code>`
  if (! header) return unknown
  const lang = header.toLowerCase()
  let c = code
  if (! prism.languages[lang]) {
    try {
      const component = `prismjs/components/prism-${lang.toLowerCase()}.min.js`
      // flow-disable-next-line
      __non_webpack_require__(component) // eslint-disable-line global-require,import/no-dynamic-require,max-len
      c = this.options.highlight(code, lang)
    } catch (e) {
      // console.error(e, code)
      return unknown
    }
  }
  const langClass = `${this.options.langPrefix}${lang}`
  return `<code><pre class="${langClass}">${c}</pre></code>`
}

renderer.heading = function headings(text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
  return `<h${level}><a name="${escapedText}" class="anchor" href="#${escapedText}"><span class="header-link">${'#'.repeat(level)}</span></a> ${text}</h${level}>`
}

Marked.setOptions({
  sanitize: false,
  breaks: true,
  tables: true,
  gfm: true,
  langPrefix: 'language-',
  renderer,
  highlight: (code, language) => {
    if (! has(prism.languages, language)) {
      language = prism.languages[language] || 'markup' // eslint-disable-line no-param-reassign
    }
    return prism.highlight(code, prism.languages[language])
  },
})

export default Marked
