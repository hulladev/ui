import { readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"

type GenerateFrameworkTsconfigOptions = {
  framework: string
  sourceTsconfigPath: string
  outputPath: string
  globalModifier?: (config: any) => any
  frameworkModifier?: (config: any) => any
}

function deepMerge(target: any, source: any): any {
  if (!source) return target
  if (!target) return source

  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

async function resolveExtends(
  tsconfigPath: string,
  basePath: string
): Promise<any[]> {
  const configContent = await readFile(tsconfigPath, "utf-8")
  const config = JSON.parse(configContent)

  if (!config.extends) {
    return [config]
  }

  const extendsArray = Array.isArray(config.extends) ? config.extends : [config.extends]
  const resolvedConfigs: any[] = []

  for (const extendPath of extendsArray) {
    let resolvedPath: string

    // Handle npm package paths like "@repo/typescript-config/react.json"
    if (extendPath.startsWith("@") || !extendPath.startsWith(".")) {
      // Resolve from node_modules relative to the base path
      const nodeModulesPath = join(basePath, "node_modules", extendPath)
      resolvedPath = nodeModulesPath
    } else {
      // Resolve relative paths
      resolvedPath = resolve(dirname(tsconfigPath), extendPath)
    }

    // Recursively resolve the extended config
    const extendedConfigs = await resolveExtends(resolvedPath, basePath)
    resolvedConfigs.push(...extendedConfigs)
  }

  // Add the current config (without extends field)
  const { extends: _, ...configWithoutExtends } = config
  resolvedConfigs.push(configWithoutExtends)

  return resolvedConfigs
}

function cleanupConfig(config: any): any {
  const cleaned = { ...config }

  // Remove fields that don't make sense in standalone output
  delete cleaned.references
  delete cleaned.composite
  delete cleaned.incremental

  // Remove compilerOptions that are development-specific
  if (cleaned.compilerOptions) {
    delete cleaned.compilerOptions.composite
    delete cleaned.compilerOptions.incremental
  }

  return cleaned
}

export async function generateFrameworkTsconfig(
  options: GenerateFrameworkTsconfigOptions
): Promise<void> {
  const {
    framework,
    sourceTsconfigPath,
    outputPath,
    globalModifier,
    frameworkModifier,
  } = options

  try {
    // Get the base path for resolving node_modules
    const basePath = resolve(dirname(sourceTsconfigPath), "../..")

    // Resolve all extends recursively
    const configs = await resolveExtends(sourceTsconfigPath, basePath)

    // Merge all configs in order (first to last, each overriding previous)
    let mergedConfig = configs.reduce((acc, config) => deepMerge(acc, config), {})

    // Clean up fields that don't make sense in output
    mergedConfig = cleanupConfig(mergedConfig)

    // Apply global modifier if provided
    if (globalModifier) {
      mergedConfig = globalModifier(mergedConfig)
    }

    // Apply framework-specific modifier if provided
    if (frameworkModifier) {
      mergedConfig = frameworkModifier(mergedConfig)
    }

    // Write the final tsconfig
    const tsconfigPath = join(outputPath, "tsconfig.json")
    await writeFile(tsconfigPath, JSON.stringify(mergedConfig, null, 2) + "\n")

    console.info(`[🤖 @hulla/ui]: created tsconfig.json for ${framework}`)
  } catch (error) {
    console.error(`[🤖 @hulla/ui]: failed to generate tsconfig for ${framework}:`, error)
    throw error
  }
}
