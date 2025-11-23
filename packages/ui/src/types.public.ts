import type { TsConfigJson } from "type-fest"

export type Frameworks = readonly string[]

export type Config<F extends Frameworks> = {
  frameworks: F
  basePath?: string
  tsconfigPath?: string
  inputDirs: Record<F[number], string[] | string>
  outputDirs: Record<F[number], string>
  dependencies?: Partial<Record<F[number], string[]>> & { shared?: string[] }
  devDependencies?: Partial<Record<F[number], string[]>> & { shared?: string[] }
  copyFiles?: Partial<Record<F[number], string[]>> & { shared?: string[] }
  tsconfig?: {
    modifier?: (config: TsConfigJson) => TsConfigJson
    frameworkModifiers?: Partial<Record<F[number], (config: TsConfigJson) => TsConfigJson>>
  }
  scripts: {
    installDep: string
    installDevDep: string
    preBuild?: string
    postBuild?: string
  }
}

