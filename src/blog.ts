import { promises as fs } from 'fs'
import readdirp from 'readdirp'
import chokidar from 'chokidar'
import matter from 'gray-matter'
import cheerio from 'cheerio'
import readingTime from 'reading-time'
import MarkdownIt from 'markdown-it'
import prism from 'markdown-it-prism'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'
import * as R from 'ramda'
import { Blog } from './generated-types'

const { NODE_ENV } = process.env

const md = new MarkdownIt({})
  .use(prism, { plugins: ['line-highlight'] })
  .use(anchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#',
  })
  .use(toc, { containerClass: 'toc', listType: 'ul' })

export const markdown = (text: string) => md.render(`\${toc}${text}`)

const cache: StrMap<Blog> = {}

const basenameWithoutExtension = R.replace(/^.*[\\/](.*?).md$/, '$1')

async function file2markdown(path: string) {
  if (NODE_ENV !== 'production') console.log('processing markdown file: %s', path)
  const source = await fs.readFile(path)
  const { data, content: orig } = matter(source)
  const { title, date, category, tags } = data
  const content = markdown(orig)
  const { words, text: readTime } = readingTime(orig)
  const id = basenameWithoutExtension(path)
  const url = `/${category}/${id}`
  const excerpt = cheerio('p', content).first().text()
  const post: Blog = {
    id,
    title,
    category,
    tags,
    content,
    readTime,
    words,
    date: new Date(date).getTime(),
    url,
    excerpt,
  }
  cache[id] = post
}

export default function main() {
  if (NODE_ENV === 'development') {
    console.log('watching markdown files...')
    const watcher = chokidar.watch('./content/**/*.md')
    watcher.on('add', file2markdown)
    watcher.on('change', file2markdown)
    watcher.on('unlink', f => {
      delete cache[basenameWithoutExtension(f)]
    })
  } else {
    readdirp
      .promise('./content', {
        root: './content',
        fileFilter: ['*.md'],
        directoryFilter: ['!.git', '!*modules'],
        type: 'files',
        depth: 3,
      })
      .then(
        R.tap(files => {
          console.log(`${files.length} blog posts found`)
        }),
      )
      .then(
        R.forEach(f => {
          file2markdown(f.fullPath)
        }),
      )
      .catch(e => console.log(e))
  }

  return {
    list() {
      return Object.values(cache).sort(R.descend(x => x.date))
    },
    get(f: string) {
      return cache[f]
    },
  }
}
