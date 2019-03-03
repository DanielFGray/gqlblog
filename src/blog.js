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

export const toObject = path => source => {
  const { data, content: orig } = matter(source)
  const content = markdown(orig)
  const { words, text: readTime } = readingTime(orig)
  const file = fname(path)
  return {
    ...data,
    content,
    file,
    readTime,
    words,
    date: (new Date(data.date)).getTime(),
    url: `/${data.category}/${file}`,
    excerpt: cheerio('p', content).first().text(),
  }
}

const file2markdown = async path => {
  const { file, ...data } = await fs.readFile(path)
    .then(toObject(path))
  files[file] = { file, ...data }
}

const main = () => {
  chokidar.watch('./content/**/*.md')
    .on('add', file2markdown)
    .on('change', file2markdown)
    .on('unlink', f => delete files[fname(f)])

  return {
    get: f => files[f],
    list: _ => Object.values(files),
  }
}

export default main
