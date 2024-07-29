export type PackageManagers = 'bun' | 'pnpm' | 'yarn' | 'npm'
export type FrameworksKeys = 'react' | 'react-native' | 'solid' | 'astro'
export type StyleKeys = 'tailwind' | 'stylex' | 'inline'
export type Config = {
  style: {
    solution: StyleKeys
    path: string
    config: string
  }
  rsc?: 'true' | 'false'
  output: string
  packageManager: PackageManagers
  githubProtocol: 'https' | 'api'
  frameworks: Record<FrameworksKeys, string>
}

export type ArgConfig = Record<
  keyof Config,
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
