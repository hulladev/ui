import { readFile, writeFile } from "node:fs/promises"
import { dirname, join, relative, resolve } from "node:path"

type GenerateFrameworkTsconfigOptions = {
  framework: string
  sourceTsconfigPath: string
  outputPath: string
  userTsconfigPath: string
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

async function resolveExtends(tsconfigPath: string, basePath: string): Promise<any[]> {
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

/**
 * Extract jsx-related compiler options from the extends chain.
 */
async function extractJsxSettings(
  sourceTsconfigPath: string,
  basePath: string
): Promise<Record<string, string>> {
  const configs = await resolveExtends(sourceTsconfigPath, basePath)
  const merged = configs.reduce((acc, config) => deepMerge(acc, config), {})
  const jsxSettings: Record<string, string> = {}

  if (merged.compilerOptions?.jsx) {
    jsxSettings.jsx = merged.compilerOptions.jsx
  }
  if (merged.compilerOptions?.jsxImportSource) {
    jsxSettings.jsxImportSource = merged.compilerOptions.jsxImportSource
  }

  return jsxSettings
}

export async function generateFrameworkTsconfig(
  options: GenerateFrameworkTsconfigOptions
): Promise<void> {
  const {
    framework,
    sourceTsconfigPath,
    outputPath,
    userTsconfigPath,
    globalModifier,
    frameworkModifier,
  } = options

  try {
    // Read the source framework tsconfig directly (no recursive resolution)
    const sourceContent = await readFile(sourceTsconfigPath, "utf-8")
    const sourceConfig = JSON.parse(sourceContent)

    // Compute relative path from output directory to user's tsconfig
    const extendsPath = relative(outputPath, userTsconfigPath)

    // Extract jsx settings from the extends chain
    const basePath = resolve(dirname(sourceTsconfigPath), "../..")
    const jsxSettings = await extractJsxSettings(sourceTsconfigPath, basePath)

    // Build paths from source, filtering out monorepo-specific ones
    const paths: Record<string, string[]> = {}
    if (sourceConfig.compilerOptions?.paths) {
      for (const [key, value] of Object.entries(sourceConfig.compilerOptions.paths)) {
        // Skip monorepo-internal aliases like @shared/*
        if (key === "@shared/*") continue
        paths[key] = value as string[]
      }
    }

    // Build include from source, adjusting parent-relative paths
    let include: string[] | undefined
    if (sourceConfig.include) {
      include = (sourceConfig.include as string[])
        .map((path: string) => {
          // Transform "../lib/style.ts" to "lib/style.ts" etc.
          if (path.startsWith("..")) {
            return path.replace(/^\.\.\//, "")
          }
          return path
        })
        .filter((path: string) => {
          // Remove paths that no longer exist (like +css)
          return !path.includes("+css")
        })
    }

    // Build minimal config
    let config: any = {
      extends: extendsPath,
      compilerOptions: {
        baseUrl: ".",
        ...(Object.keys(paths).length > 0 && { paths }),
        ...jsxSettings,
      },
      ...(include && { include }),
    }

    // Apply global modifier if provided
    if (globalModifier) {
      config = globalModifier(config)
    }

    // Apply framework-specific modifier if provided
    if (frameworkModifier) {
      config = frameworkModifier(config)
    }

    // Write the final tsconfig
    const tsconfigPath = join(outputPath, "tsconfig.json")
    await writeFile(tsconfigPath, JSON.stringify(config, null, 2) + "\n")

    console.info(`[🤖 @hulla/ui]: created tsconfig.json for ${framework}`)
  } catch (error) {
    console.error(`[🤖 @hulla/ui]: failed to generate tsconfig for ${framework}:`, error)
    throw error
  }
}
