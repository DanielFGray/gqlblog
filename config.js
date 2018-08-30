import path from 'path'

export const outputDir = path.resolve('./dist')
export const publicDir = path.resolve('./public')
export const appTitle = '[insert title]'
export const appBase = '/'
export const appMountId = 'root'
export const port = process.env.PORT || 8765
export const host = process.env.HOST || 'localhost'
export const nodeEnv = process.env.NODE_ENV || 'development'
export const devMode = nodeEnv.startsWith('dev')
