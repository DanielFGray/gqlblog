import fs from 'fs-extra'
import flyd from 'flyd'
import chokidar from 'chokidar'
import matter from 'gray-matter'
import markdown from './markdown'

const files = new Map()

const fname = f => f.replace(/^.*[\\/](.*?).md$/, '$1')

const file2markdown = file => fs.readFile(file)
  .then(matter)
  .then(({ data, content }) => ({
    ...data,
    file: fname(file),
    content: markdown(content),
    date: (new Date(data.date)).getTime(),
  }))

const file$ = flyd.stream()
const watcher = chokidar.watch('./content/**/*.md')
watcher.on('add', f => file$(f))
watcher.on('change', f => file$(f))
watcher.on('unlink', f => files.delete(fname(f)))

file$
  .map(file2markdown)
  .pipe(flyd.flattenPromise)
  .map(x => files.set(x.file, x))

export default {
  get: f => files.get(f),
  list: _ => {
    const list = []
    for (const x of files.values()) {
      list.push(x)
    }
    return list
  },
}
