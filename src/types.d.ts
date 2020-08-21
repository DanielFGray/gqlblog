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
