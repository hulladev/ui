export type PackageManagers = 'bun' | 'pnpm' | 'yarn' | 'npm'
export type FrameworksKeys = 'react' | 'react-native' | 'solid' | 'astro'
export type StyleKeys = 'tailwind' | 'stylex' | 'inline'
export type Config = {
  style: {
    solution: StyleKeys
    globals: string
    util: string
    config: string
  }
  typescript: {
    alias: string
    tsconfig: string
    src: string
  }
  output: string
  packageManager: PackageManagers
  githubProtocol: 'https' | 'api'
  scripts?: {
    add?: string
    setup?: string
  }
  frameworks: Record<FrameworksKeys, Pick<Partial<Config>, 'output'> & { extension: string; rsc?: 'true' | 'false' }>
}

export type ArgConfig = Record<
  keyof Omit<Config, 'typescript'>,
  {
    values: string[]
    access: '=' | 'flag' | 'cumulative'
    variant: 'config'
  }
> & {
  config: {
    values: string[]
    access: '='
    variant: 'arg'
  }
  init: {
    values: string[]
    access: 'flag'
    variant: 'arg'
  }
  add: {
    values: string[]
    access: 'cumulative'
    variant: 'arg'
  }
}

export type ParsedArgs = {
  isInit: boolean
  config: Partial<Config>
  errors: Record<string, string>
  args: Partial<Record<keyof ArgConfig, string | string[]>>
}
