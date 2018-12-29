import fs from 'fs-extra'
import chokidar from 'chokidar'
import matter from 'gray-matter'
import cheerio from 'cheerio'
import readingTime from 'reading-time'
import markdown from './mdown'

const files = {}

const fname = f => f.replace(/^.*[\\/](.*?).md$/, '$1')

const file2markdown = async path => {
  const { data, content: orig } = await fs.readFile(path)
    .then(matter)
  const content = markdown(orig)
  const { words, text: readTime } = await readingTime(orig)
  const file = fname(path)
  files[file] = {
    ...data,
    content,
    file,
    date: (new Date(data.date)).getTime(),
    readTime,
    words,
    excerpt: cheerio(content).first('p').text(),
  }
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
