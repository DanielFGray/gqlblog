import fs from 'fs-extra'
import chokidar from 'chokidar'
import matter from 'gray-matter'
import cheerio from 'cheerio'
import readingTime from 'reading-time'
import markdownIt from 'markdown-it'
import prism from 'markdown-it-prism'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'

const md = markdownIt({})
  .use(prism, { plugins: ['line-highlight'] })
  .use(anchor, { permalink: true, permalinkBefore: true, permalinkSymbol: '#' })
  .use(toc, { containerClass: 'toc', listType: 'ul' })

export const markdown = text => md.render(`\${toc}${text}`)

const files = {}

const fname = f => f.replace(/^.*[\\/](.*?).md$/, '$1')

const file2markdown = async path => {
  const source = await fs.readFile(path)
  const { data, content: orig } = matter(source)
  const content = markdown(orig)
  const { words, text: readTime } = readingTime(orig)
  const id = fname(path)
  files[id] = {
    id,
    ...data,
    content,
    readTime,
    words,
    date: (new Date(data.date)).getTime(),
    url: `/${data.category}/${id}`,
    excerpt: cheerio('p', content).first().text(),
  }
}
export default function main() {
  chokidar.watch('./content/**/*.md')
    .on('add', file2markdown)
    .on('change', file2markdown)
    .on('unlink', f => delete files[fname(f)])

  return {
    list() {
      return Object.values(files)
    },
    get(f) {
      return files[f]
    },
  }
}
