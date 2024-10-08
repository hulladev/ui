import { access, constants as fsConstants, readFile } from 'node:fs/promises'
import type { Config, PackageManagers } from '../lib/types'

const configExtensions = ['.mjs', '.js', '.ts']

export const attemptFile = async <R extends string>(subpath: string, result: R) => {
  try {
    const path = `${process.cwd()}/${subpath}`
    await access(path, fsConstants.F_OK)
    return { result, query: subpath }
  } catch {
    return undefined
  }
}

export const cycleExtension = <R extends string>(subpath: string, result: R) =>
  configExtensions.map((ext) => attemptFile<R>(`${subpath}${ext}`, result))

type Dep = {
  query: string
  value: string
}
export const extractDeps = async <D extends Dep>(...deps: D[]): Promise<Partial<Record<D['value'], string>>> => {
  try {
    const path = `${process.cwd()}/package.json`
    await access(path, fsConstants.R_OK)
    const contents = await readFile(path, 'utf8')
    const json = JSON.parse(contents)
    return deps.reduce((res, dep) => {
      const value =
        json.dependencies?.[dep.query] ??
        json.devDependencies?.[dep.query] ??
        json.peerDependencies?.[dep.query] ??
        json.optionalDependencies?.[dep.query]
      if (value) {
        return { ...res, [dep.value]: value }
      }
      return res
    }, {})
  } catch {
    return {}
  }
}

export function getInstallCommand(packageManager: PackageManagers, deps: string[], devDeps: string[]) {
  const installCommand: Record<PackageManagers, string> = {
    pnpm: 'pnpm add',
    npm: 'npm install',
    yarn: 'yarn add',
    bun: 'bun add',
  }
  const command = installCommand[packageManager]
  const depsInstall = `${command} ${deps.join(' ')}`
  const devDepsInstall = `${command} -D ${devDeps.join(' ')}`
  if (devDeps.length && deps.length) {
    return `${depsInstall} && ${devDepsInstall}`
  }
  if (deps.length) {
    return depsInstall
  }
  if (devDeps.length) {
    return devDepsInstall
  }
  return ''
}

export function getMajorVersion(versionString: string) {
  const match = versionString.match(/(\d+)/)
  return match ? parseInt(match[0], 10) : null
}

export function getSetupInstallCommand(config: Config, detectedDependencies: Partial<Record<string, string>>) {
  const deps = []
  const devDeps = []
  deps.push('@hulla/style')
  if (config.style.solution.includes('tailwind')) {
    devDeps.push('tailwindcss')
    devDeps.push('autoprefixer')
    devDeps.push('postcss')
    if (Object.keys(config.frameworks).includes('react-native')) {
      deps.push('nativewind')
    }
  }
  if (config.style.solution.includes('stylex')) {
    deps.push('@stylexjs/stylex')
  }
  const removeAlredyInstalled = (d: string[]) => d.filter((dep) => !detectedDependencies[dep])
  return getInstallCommand(config.packageManager, removeAlredyInstalled(deps), removeAlredyInstalled(devDeps))
}

export function replaceTypescriptAlias(alias: string, src: string, path: string) {
  if (src.startsWith('./')) {
    src = src.slice(2)
  } else if (src.startsWith('../')) {
    src = src.slice(3)
  } else if (src.startsWith('/')) {
    src = src.slice(1)
  }
  src = src.endsWith('/') ? src : `${src}/`
  return path.replace(new RegExp(alias, 'g'), src)
}
