import { exec } from "node:child_process"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { promisify } from "node:util"
import type { PackageJson } from "type-fest"
import { BuildCache } from "../buildCache"
import { dimPath, formatFramework, log } from "./log"

const execAsync = promisify(exec)

type GenerateFrameworkPackageJsonOptions = {
  framework: string
  outputPath: string
  packageJson: {
    installDepCommand: string
    installDevDepCommand: string
    modifier?: (packageJson: PackageJson) => PackageJson
    frameworkModifiers?: Partial<Record<string, (packageJson: PackageJson) => PackageJson>>
  }
  cache: BuildCache
  executeInstall?: boolean
}

type GenerateFrameworkPackageJsonResult = {
  depCommand?: string
  devDepCommand?: string
}

function parsePackageString(packageString: string): { name: string; version?: string } {
  if (packageString.startsWith("@")) {
    const atIndex = packageString.indexOf("@", 1)
    if (atIndex !== -1) {
      return {
        name: packageString.substring(0, atIndex),
        version: packageString.substring(atIndex + 1),
      }
    }
    return { name: packageString }
  }

  const atIndex = packageString.indexOf("@")
  if (atIndex !== -1) {
    return {
      name: packageString.substring(0, atIndex),
      version: packageString.substring(atIndex + 1),
    }
  }

  return { name: packageString }
}

async function findRootCatalog(currentPath: string): Promise<Record<string, string> | undefined> {
  let currentDir = currentPath
  const maxDepth = 10

  for (let i = 0; i < maxDepth; i++) {
    const packageJsonPath = join(currentDir, "package.json")
    if (existsSync(packageJsonPath)) {
      try {
        const content = await readFile(packageJsonPath, "utf-8")
        const pkg = JSON.parse(content)
        if (pkg.workspaces?.catalog) {
          return pkg.workspaces.catalog
        }
      } catch {
        // Continue searching up
      }
    }
    const parent = dirname(currentDir)
    if (parent === currentDir) break
    currentDir = parent
  }

  return undefined
}

function resolveCatalogDeps(
  deps: Record<string, string> | undefined,
  catalog: Record<string, string> | undefined
): Record<string, string> | undefined {
  if (!deps || !catalog) return deps

  const resolved: Record<string, string> = {}
  for (const [name, version] of Object.entries(deps)) {
    if (version.startsWith("catalog:")) {
      const resolvedVersion = catalog[name]
      if (resolvedVersion) {
        resolved[name] = resolvedVersion
      } else {
        log.warn(`catalog reference for ${name} not found`)
        resolved[name] = version
      }
    } else {
      resolved[name] = version
    }
  }
  return resolved
}

export async function generateFrameworkPackageJson(
  options: GenerateFrameworkPackageJsonOptions
): Promise<GenerateFrameworkPackageJsonResult> {
  const {
    framework,
    outputPath,
    packageJson: packageJsonConfig,
    cache,
    executeInstall = true,
  } = options

  let packageJson: PackageJson = {
    name: `@hulla/ui-${framework}`,
    private: true,
  }

  if (packageJsonConfig.modifier) {
    packageJson = packageJsonConfig.modifier(packageJson)
  }

  if (packageJsonConfig.frameworkModifiers?.[framework]) {
    packageJson = packageJsonConfig.frameworkModifiers[framework](packageJson)
  }

  const catalog = await findRootCatalog(outputPath)
  packageJson.dependencies = resolveCatalogDeps(
    packageJson.dependencies as Record<string, string> | undefined,
    catalog
  )
  packageJson.devDependencies = resolveCatalogDeps(
    packageJson.devDependencies as Record<string, string> | undefined,
    catalog
  )

  const packageJsonPath = join(outputPath, "package.json")
  const newContent = JSON.stringify(packageJson, null, 2) + "\n"

  const dependencies = packageJson.dependencies
    ? Object.entries(packageJson.dependencies).map(([name, version]) =>
        typeof version === "string" ? `${name}@${version}` : name
      )
    : []
  const devDependencies = packageJson.devDependencies
    ? Object.entries(packageJson.devDependencies).map(([name, version]) =>
        typeof version === "string" ? `${name}@${version}` : name
      )
    : []

  let shouldInstallDeps = true
  let shouldInstallDevDeps = true
  let packageJsonChanged = true

  if (existsSync(packageJsonPath)) {
    try {
      const existingContent = await readFile(packageJsonPath, "utf-8")
      packageJsonChanged = existingContent !== newContent
      const existingJson = JSON.parse(existingContent)

      shouldInstallDeps =
        dependencies.length > 0 && !areDependenciesInstalled(existingJson, dependencies)
      shouldInstallDevDeps =
        devDependencies.length > 0 && !areDevDependenciesInstalled(existingJson, devDependencies)
    } catch (error) {
      log.error(`failed checking package.json for ${formatFramework(framework)}`, error)
    }
  }

  await writeFile(packageJsonPath, newContent)
  log.item(`${formatFramework(framework)} wrote package.json`)
  log.dimItem(dimPath(packageJsonPath))

  const depCommand =
    shouldInstallDeps && dependencies.length > 0
      ? buildInstallCommand(packageJsonConfig.installDepCommand, dependencies)
      : undefined
  const devDepCommand =
    shouldInstallDevDeps && devDependencies.length > 0
      ? buildInstallCommand(packageJsonConfig.installDevDepCommand, devDependencies)
      : undefined

  if (executeInstall && depCommand) {
    await execAsync(depCommand, { cwd: outputPath })
  }

  if (executeInstall && devDepCommand) {
    await execAsync(devDepCommand, { cwd: outputPath })
  }

  await cache.markFileProcessed(packageJsonPath)
  return { depCommand, devDepCommand }
}

function buildInstallCommand(baseCommand: string, packages: string[]): string {
  if (packages.length === 0) return ""

  const packageSpecs = packages.map((pkg) => {
    const { name, version } = parsePackageString(pkg)
    return version ? `${name}@${version}` : name
  })

  return `${baseCommand} ${packageSpecs.join(" ")}`
}

function areDependenciesInstalled(packageJson: any, requiredDeps: string[]): boolean {
  const installed = packageJson.dependencies || {}
  return requiredDeps.every((dep) => {
    const { name, version } = parsePackageString(dep)
    const installedSpec = installed[name]
    if (typeof installedSpec !== "string") return false
    return version ? installedSpec === version : true
  })
}

function areDevDependenciesInstalled(packageJson: any, requiredDevDeps: string[]): boolean {
  const installed = packageJson.devDependencies || {}
  return requiredDevDeps.every((dep) => {
    const { name, version } = parsePackageString(dep)
    const installedSpec = installed[name]
    if (typeof installedSpec !== "string") return false
    return version ? installedSpec === version : true
  })
}
