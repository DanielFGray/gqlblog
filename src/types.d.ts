/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  export interface ProcessEnv {
    APP_TITLE: string
    APP_BASE: string
    MOUNT: string
    CONTENT_DIR: string
    OUTPUT_DIR: string
    PUBLIC_DIR: string
    PORT: string
    HOST: string
    NODE_ENV: 'development' | 'production'
    APP_URL: string
    SESSION_KEY: string
    GITLAB_USER: string
    GITLAB_KEY: string
    GITHUB_USER: string
    GITHUB_KEY: string
  }
}
type StrMap<T> = { [k: string]: T }
type Scalar = number | string | boolean | Date | symbol | bigint
type Mixed = Scalar[] | StrMap<Scalar> | StrMap<Scalar[]>
type Nullable<T> = T | null | undefined
