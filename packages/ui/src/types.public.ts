import type { TsConfigJson, PackageJson } from "type-fest"

export type Frameworks = readonly string[]

export type Config<F extends Frameworks> = {
  frameworks: F
  basePath?: string
  tsconfigPath?: string
  inputDirs: Record<F[number], string[] | string>
  outputDirs: Record<F[number], string>
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

