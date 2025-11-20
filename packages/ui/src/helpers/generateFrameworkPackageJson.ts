import { exec } from "node:child_process"
import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { promisify } from "node:util"

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
  const { framework, outputPath, dependencies, devDependencies, scripts } = options

  const packageJson = {
    name: `@hulla/ui-${framework}`,
    private: true,
  }

  const packageJsonPath = join(outputPath, "package.json")
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")

  console.info(`[🤖 @hulla/ui]: created package.json for ${framework}`)

  // Install dependencies
  if (dependencies.length > 0) {
    const depCommand = buildInstallCommand(scripts.installDep, dependencies)
    console.info(`[🤖 @hulla/ui]: installing dependencies for ${framework}: ${depCommand}`)
    await execAsync(depCommand, { cwd: outputPath })
  }

  // Install devDependencies
  if (devDependencies.length > 0) {
    const devDepCommand = buildInstallCommand(scripts.installDevDep, devDependencies)
    console.info(`[🤖 @hulla/ui]: installing devDependencies for ${framework}: ${devDepCommand}`)
    await execAsync(devDepCommand, { cwd: outputPath })
  }
}
