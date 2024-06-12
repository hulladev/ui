export type PackageManagers = 'bun' | 'pnpm' | 'yarn' | 'npm'
export type Frameworks = 'react' | 'react-native' | 'solid' | 'astro'
export type Styles = 'tailwind' | 'stylex' | 'inline'
export type Config = {
  style: Styles
  rsc?: 'true' | 'false'
  output: string
  packageManager: PackageManagers
  frameworks: Frameworks[]
}
