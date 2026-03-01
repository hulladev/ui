import { exec } from "node:child_process"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
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

type CatalogData = {
  defaultCatalog: Record<string, string>
  namedCatalogs: Record<string, Record<string, string>>
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

function parseYamlMappingLine(line: string): { key: string; value: string } | null {
  const match = line.match(
    /^\s*(?:"([^"]+)"|'([^']+)'|([^:#][^:]*?))\s*:\s*(?:"([^"]*)"|'([^']*)'|([^#]+?))\s*$/
  )
  if (!match) return null

  const key = (match[1] ?? match[2] ?? match[3] ?? "").trim()
  const value = (match[4] ?? match[5] ?? match[6] ?? "").trim()
  if (!key || !value) return null

  return { key, value }
}

async function readCatalogData(workspaceFilePath: string): Promise<CatalogData> {
  const content = await readFile(workspaceFilePath, "utf-8")
  const lines = content.split("\n")

  const result: CatalogData = {
    defaultCatalog: {},
    namedCatalogs: {},
  }

  let inCatalog = false
  let inCatalogs = false
  let currentNamedCatalog: string | null = null

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "    ")
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) continue

    const indent = line.length - line.trimStart().length

    if (indent === 0) {
      inCatalog = trimmed === "catalog:"
      inCatalogs = trimmed === "catalogs:"
      currentNamedCatalog = null
      continue
    }

    if (inCatalog && indent >= 2) {
      const parsed = parseYamlMappingLine(trimmed)
      if (parsed) {
        result.defaultCatalog[parsed.key] = parsed.value
      }
      continue
    }

    if (inCatalogs) {
      if (indent === 2 && trimmed.endsWith(":")) {
        currentNamedCatalog = trimmed.slice(0, -1).trim()
        if (currentNamedCatalog && !result.namedCatalogs[currentNamedCatalog]) {
          result.namedCatalogs[currentNamedCatalog] = {}
        }
        continue
      }

      if (indent >= 4 && currentNamedCatalog) {
        const parsed = parseYamlMappingLine(trimmed)
        if (parsed) {
          const namedCatalog = result.namedCatalogs[currentNamedCatalog]
          if (namedCatalog) {
            namedCatalog[parsed.key] = parsed.value
          }
        }
      }
    }
  }

  return result
}

function findWorkspaceFile(startDir: string): string | null {
  let currentDir = resolve(startDir)

  while (true) {
    const workspaceFilePath = join(currentDir, "pnpm-workspace.yaml")
    if (existsSync(workspaceFilePath)) {
      return workspaceFilePath
    }

    const parent = dirname(currentDir)
    if (parent === currentDir) {
      return null
    }
    currentDir = parent
  }
}

function resolveCatalogVersion(
  depName: string,
  spec: string,
  catalogData: CatalogData
): string | undefined {
  if (!spec.startsWith("catalog:")) return undefined

  if (spec === "catalog:") {
    return catalogData.defaultCatalog[depName]
  }

  const catalogName = spec.slice("catalog:".length)
  if (!catalogName) {
    return catalogData.defaultCatalog[depName]
  }

  return catalogData.namedCatalogs[catalogName]?.[depName]
}

async function normalizeCatalogDependencies(
  packageJson: PackageJson,
  outputPath: string,
  framework: string
): Promise<PackageJson> {
  const normalized = { ...packageJson } as PackageJson
  if (packageJson.dependencies) {
    normalized.dependencies = { ...packageJson.dependencies }
  }
  if (packageJson.devDependencies) {
    normalized.devDependencies = { ...packageJson.devDependencies }
  }

  const workspaceFilePath = findWorkspaceFile(outputPath)
  const catalogData = workspaceFilePath
    ? await readCatalogData(workspaceFilePath)
    : { defaultCatalog: {}, namedCatalogs: {} }

  const sections: Array<"dependencies" | "devDependencies"> = ["dependencies", "devDependencies"]

  for (const section of sections) {
    const deps = normalized[section] as Record<string, string | undefined> | undefined
    if (!deps) continue

    for (const [depName, depSpec] of Object.entries(deps)) {
      if (typeof depSpec !== "string" || !depSpec.startsWith("catalog:")) continue

      const resolvedVersion = resolveCatalogVersion(depName, depSpec, catalogData)
      if (resolvedVersion) {
        deps[depName] = resolvedVersion
        continue
      }

      // Fallback keeps generated outputs installable outside pnpm catalog workspaces.
      deps[depName] = "*"
      log.warn(
        `${formatFramework(framework)} unresolved ${section} ${depName}@${depSpec}; using '*'`
      )
    }
  }

  return normalized
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
  packageJson = await normalizeCatalogDependencies(packageJson, outputPath, framework)

  const packageJsonPath = join(outputPath, "package.json")
  const newContent = JSON.stringify(packageJson, null, 2) + "\n"

  // Extract dependencies and devDependencies for installation
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
