import { exec } from "node:child_process"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { promisify } from "node:util"
import { BuildCache } from "../buildCache"

const execAsync = promisify(exec)

type GenerateFrameworkPackageJsonOptions = {
  framework: string
  outputPath: string
  dependencies: string[]
  devDependencies: string[]
  scripts: {
    installDep: string
    installDevDep: string
  }
  cache: BuildCache
}

function parsePackageString(packageString: string): { name: string; version?: string } {
  // Handle scoped packages like @hulla/style@1.0.0
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
): Promise<void> {
  const { framework, outputPath, dependencies, devDependencies, scripts, cache } = options

  const packageJson = {
    name: `@hulla/ui-${framework}`,
    private: true,
  }

  const packageJsonPath = join(outputPath, "package.json")
  const newContent = JSON.stringify(packageJson, null, 2) + "\n"

  // Check if package.json exists and compare content
  let shouldInstallDeps = true
  let shouldInstallDevDeps = true

  if (existsSync(packageJsonPath)) {
    try {
      const existingContent = await readFile(packageJsonPath, "utf-8")
      const existingJson = JSON.parse(existingContent)

      // Check if dependencies changed by comparing the actual installed packages
      shouldInstallDeps = dependencies.length > 0 && !areDependenciesInstalled(existingJson, dependencies)
      shouldInstallDevDeps =
        devDependencies.length > 0 && !areDevDependenciesInstalled(existingJson, devDependencies)

      if (!shouldInstallDeps && !shouldInstallDevDeps) {
        console.info(`[🤖 @hulla/ui]: dependencies unchanged for ${framework}, skipping installation`)
      }
    } catch (error) {
      // If there's an error reading/parsing, proceed with install
      console.warn(`[🤖 @hulla/ui]: error checking existing package.json for ${framework}:`, error)
    }
  }

  await writeFile(packageJsonPath, newContent)
  console.info(`[🤖 @hulla/ui]: created package.json for ${framework}`)

  // Install dependencies only if they changed
  if (shouldInstallDeps && dependencies.length > 0) {
    const depCommand = buildInstallCommand(scripts.installDep, dependencies)
    console.info(`[🤖 @hulla/ui]: installing dependencies for ${framework}: ${depCommand}`)
    await execAsync(depCommand, { cwd: outputPath })
  }

  // Install devDependencies only if they changed
  if (shouldInstallDevDeps && devDependencies.length > 0) {
    const devDepCommand = buildInstallCommand(scripts.installDevDep, devDependencies)
    console.info(`[🤖 @hulla/ui]: installing devDependencies for ${framework}: ${devDepCommand}`)
    await execAsync(devDepCommand, { cwd: outputPath })
  }

  await cache.markFileProcessed(packageJsonPath)
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
