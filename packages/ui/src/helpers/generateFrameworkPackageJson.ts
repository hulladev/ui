import { exec } from "node:child_process"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
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
  // Handle scoped packages like @hulla/style@x.y.z
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

  // Handle regular packages like react@18 or react
  const atIndex = packageString.indexOf("@")
  if (atIndex !== -1) {
    return {
      name: packageString.substring(0, atIndex),
      version: packageString.substring(atIndex + 1),
    }
  }

  return { name: packageString }
}

function buildInstallCommand(baseCommand: string, packages: string[]): string {
  if (packages.length === 0) return ""

  const packageSpecs = packages.map((pkg) => {
    const { name, version } = parsePackageString(pkg)
    return version ? `${name}@${version}` : name
  })

  return `${baseCommand} ${packageSpecs.join(" ")}`
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

  // Start with base package.json
  let packageJson: PackageJson = {
    name: `@hulla/ui-${framework}`,
    private: true,
  }

  // Apply base modifier if provided
  if (packageJsonConfig.modifier) {
    packageJson = packageJsonConfig.modifier(packageJson)
  }

  // Apply framework-specific modifier if provided
  if (packageJsonConfig.frameworkModifiers?.[framework]) {
    packageJson = packageJsonConfig.frameworkModifiers[framework](packageJson)
  }

  const packageJsonPath = join(outputPath, "package.json")
  const newContent = JSON.stringify(packageJson, null, 2) + "\n"

  // Extract dependencies and devDependencies for installation
  const dependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : []
  const devDependencies = packageJson.devDependencies
    ? Object.keys(packageJson.devDependencies)
    : []

  // Check if package.json exists and compare content
  let shouldInstallDeps = true
  let shouldInstallDevDeps = true

  if (existsSync(packageJsonPath)) {
    try {
      const existingContent = await readFile(packageJsonPath, "utf-8")
      const existingJson = JSON.parse(existingContent)

      // Check if dependencies changed by comparing the actual installed packages
      shouldInstallDeps =
        dependencies.length > 0 && !areDependenciesInstalled(existingJson, dependencies)
      shouldInstallDevDeps =
        devDependencies.length > 0 && !areDevDependenciesInstalled(existingJson, devDependencies)
    } catch (error) {
      // If there's an error reading/parsing, proceed with install
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

  // Install dependencies only if they changed
  if (executeInstall && depCommand) {
    await execAsync(depCommand, { cwd: outputPath })
  }

  // Install devDependencies only if they changed
  if (executeInstall && devDepCommand) {
    await execAsync(devDepCommand, { cwd: outputPath })
  }

  await cache.markFileProcessed(packageJsonPath)
  return { depCommand, devDepCommand }
}

function areDependenciesInstalled(packageJson: any, requiredDeps: string[]): boolean {
  const installed = packageJson.dependencies || {}
  return requiredDeps.every((dep) => {
    const { name } = parsePackageString(dep)
    return name in installed
  })
}

function areDevDependenciesInstalled(packageJson: any, requiredDevDeps: string[]): boolean {
  const installed = packageJson.devDependencies || {}
  return requiredDevDeps.every((dep) => {
    const { name } = parsePackageString(dep)
    return name in installed
  })
}
