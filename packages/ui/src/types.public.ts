import type { PackageJson, TsConfigJson } from "type-fest"

export type Frameworks = readonly string[]

export type CopyFileEntry =
  | string
  | {
      src: string
      dest?: string
      required?: boolean
      description?: string
      globalStyle?: boolean
    }

export type NormalizedCopyFile = {
  src: string
  dest: string
  required: boolean
  description?: string
  globalStyle?: boolean
}

export type OutputDirs<F extends Frameworks> = {
  rootDir: string
  frameworks: Record<F[number], string>
}

export type PackageJsonConfig<F extends Frameworks> = {
  base?: PackageJson
  modifier?: (packageJson: PackageJson) => PackageJson
  frameworkModifiers?: Partial<Record<F[number], (packageJson: PackageJson) => PackageJson>>
}

export type TsconfigConfig<F extends Frameworks> = {
  base?: TsConfigJson
  frameworks?: Partial<Record<F[number], TsConfigJson>>
}

export type Config<F extends Frameworks> = {
  name: string
  version: string
  frameworks: F
  inputDirs: Record<F[number], string | readonly string[]>
  outputDirs: OutputDirs<F>
  author?: string | readonly string[]
  basePath?: string
  copyFiles?: Partial<Record<F[number], readonly CopyFileEntry[]>> & {
    shared?: readonly CopyFileEntry[]
  }
  copyFilesRoot?: string
  packageJson?: PackageJsonConfig<F>
  tsconfig?: TsconfigConfig<F>
  tsconfigPath?: string
  url?: string
}

export type BuildMode = "check" | "write"

export type BuildOptions = {
  mode?: BuildMode
  quiet?: boolean
}

export type BuildResult = {
  changed: boolean
  components: number
  files: number
  mode: BuildMode
  outputRoot: string
}

export type UILibraryAPI<F extends Frameworks> = {
  config: Config<F>
  build: (options?: BuildOptions) => Promise<BuildResult>
}

export type UILibraryComponent = {
  frameworks: string[]
}

export type UILibrary = {
  schemaVersion: 1
  name: string
  version: string
  frameworks: Record<string, string>
  components: Record<string, UILibraryComponent>
  author?: string | readonly string[]
  copyFiles?: {
    shared?: NormalizedCopyFile[]
  } & Record<string, NormalizedCopyFile[] | undefined>
  url?: string
}

export type UILibraryManifest = {
  schemaVersion: 1
  library: UILibrary
  files: Record<string, string>
}

export class GeneratedOutputOutOfDateError extends Error {
  readonly differences: string[]

  constructor(outputRoot: string, differences: string[]) {
    super(
      `Generated output is out of date at ${outputRoot}:\n${differences
        .map((difference) => `  - ${difference}`)
        .join("\n")}`
    )
    this.name = "GeneratedOutputOutOfDateError"
    this.differences = differences
  }
}
