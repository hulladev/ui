import type { PackageJson, TsConfigJson } from "type-fest"

export type Frameworks = readonly string[]

export type OutputDirs<F extends Frameworks> = {
  rootDir: string
  frameworks: Record<F[number], string>
}

export type Config<F extends Frameworks> = {
  name: string
  url?: string
  version: string
  author?: string | string[]
  frameworks: F
  basePath?: string
  tsconfigPath?: string
  inputDirs: Record<F[number], string[] | string>
  outputDirs: OutputDirs<F>
  copyFiles?: Partial<Record<F[number], string[]>> & { shared?: string[] }
  tsconfig?: {
    modifier?: (config: TsConfigJson) => TsConfigJson
    frameworkModifiers?: Partial<Record<F[number], (config: TsConfigJson) => TsConfigJson>>
  }
  packageJson: {
    installDepCommand: string
    installDevDepCommand: string
    modifier?: (packageJson: PackageJson) => PackageJson
    frameworkModifiers?: Partial<Record<F[number], (packageJson: PackageJson) => PackageJson>>
  }
  scripts: {
    preBuild?: string
    postBuild?: string
  }
}

export type UILibraryAPI<F extends Frameworks> = {
  config: Config<F>
  build: () => Promise<void>
}

export type UILibrary = {
  name: string
  url?: string
  author?: string | string[]
  frameworks: Record<string, string>
  version: string
}