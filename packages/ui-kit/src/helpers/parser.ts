import { existsSync } from "node:fs"
import { dirname, isAbsolute, join, resolve as resolvePath } from "node:path"
import { parseJsonConfigFileContent, readConfigFile, sys } from "typescript"

type PathMapping = {
  [key: string]: string[]
}

export async function resolveTsconfigPath(
  searchDir: string,
  providedPath?: string
): Promise<string | null> {
  if (providedPath) {
    if (existsSync(providedPath)) {
      return providedPath
    }
    throw new Error(`Provided tsconfig path does not exist: ${providedPath}`)
  }

  // Search for tsconfig.json starting from searchDir and going up
  let currentDir = searchDir
  while (true) {
    const tsconfigPath = join(currentDir, "tsconfig.json")
    if (existsSync(tsconfigPath)) {
      return tsconfigPath
    }

    const parentDir = dirname(currentDir)
    if (parentDir === currentDir) {
      // Reached root
      return null
    }
    currentDir = parentDir
  }
}

function loadTsconfig(tsconfigPath: string): { baseUrl?: string; paths?: PathMapping } {
  const configFile = readConfigFile(tsconfigPath, sys.readFile)
  if (configFile.error) {
    throw new Error(`Error reading tsconfig: ${configFile.error.messageText}`)
  }

  const parsedConfig = parseJsonConfigFileContent(configFile.config, sys, dirname(tsconfigPath))

  return {
    baseUrl: parsedConfig.options.baseUrl,
    paths: parsedConfig.options.paths as PathMapping | undefined,
  }
}

export function resolvePathAlias(
  importPath: string,
  sourceFileDir: string,
  tsconfigPath: string | null
): string {
  // If it's a relative path, resolve it directly
  if (importPath.startsWith(".")) {
    return resolvePath(sourceFileDir, importPath)
  }

  // If it's an absolute path, return as is
  if (isAbsolute(importPath)) {
    return importPath
  }

  // If it's a node_modules import (no path alias), we can't resolve it
  if (!importPath.startsWith("@/") && !importPath.startsWith("@")) {
    throw new Error(
      `Cannot resolve non-relative import "${importPath}". This appears to be a module import.`
    )
  }

  // Need tsconfig for path aliases
  if (!tsconfigPath) {
    throw new Error(
      `Cannot resolve path alias "${importPath}". A tsconfig.json file is required for path alias resolution. ` +
        `Either provide a tsconfigPath in the config or ensure a tsconfig.json exists in the component directory.`
    )
  }

  const tsconfig = loadTsconfig(tsconfigPath)
  if (!tsconfig.paths) {
    throw new Error(
      `Cannot resolve path alias "${importPath}". The tsconfig.json at ${tsconfigPath} does not define any path mappings.`
    )
  }

  // Find matching path alias
  for (const [pattern, replacements] of Object.entries(tsconfig.paths)) {
    const patternRegex = new RegExp("^" + pattern.replace("*", "(.*)") + "$")
    const match = importPath.match(patternRegex)

    if (match) {
      const matchedPart = match[1] || ""
      for (const replacement of replacements) {
        const resolvedPath = replacement.replace("*", matchedPart)
        const baseDir = tsconfig.baseUrl
          ? join(dirname(tsconfigPath), tsconfig.baseUrl)
          : dirname(tsconfigPath)
        const fullPath = join(baseDir, resolvedPath)

        // Try with various extensions
        const extensions = [".ts", ".tsx", ".js", ".jsx", ""]
        for (const ext of extensions) {
          const pathWithExt = fullPath + ext
          if (existsSync(pathWithExt)) {
            return pathWithExt
          }
        }
      }
    }
  }

  throw new Error(
    `Cannot resolve path alias "${importPath}". No matching pattern found in tsconfig paths.`
  )
}
