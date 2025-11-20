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
    modifier?: (config: any) => any
    frameworkModifiers?: Partial<Record<F[number], (config: any) => any>>
  }
  scripts: {
    installDep: string
    installDevDep: string
  }
}
