export type PackageJSON = {
  name: string
  private: false
  scripts: Record<string, string>
  extension: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}
