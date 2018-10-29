import fs from 'fs-extra'
import chokidar from 'chokidar'
import matter from 'gray-matter'
import markdown from './mdown'

const files = {}

const fname = f => f.replace(/^.*[\\/](.*?).md$/, '$1')

const file2markdown = file => fs.readFile(file)
  .then(matter)
  .then(({ data, content }) => ({
    ...data,
    file: fname(file),
    content: markdown(content),
    date: (new Date(data.date)).getTime(),
  }))
  .then(x => { files[x.file] = x })

chokidar.watch('./content/**/*.md')
  .on('add', f => file2markdown(f))
  .on('change', f => file2markdown(f))
  .on('unlink', f => files.delete(fname(f)))

export default {
  get: f => files[f],
  list: _ => Object.values(files),
}
