import { constants } from "node:fs"
import { access, readFile, stat } from "node:fs/promises"
import { dirname, extname, resolve } from "node:path"
import { cwd } from "node:process"
import {
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
  type CompilerOptions,
  type Diagnostic,
} from "typescript"
import { assertSafeOutputRoot, isPathInside, resolveInside } from "./helpers/paths"
import type {
  Config,
  CopyFileEntry,
  Frameworks,
  NormalizedCopyFile,
  PackageJsonConfig,
  TsconfigConfig,
} from "./types.public"

export type NormalizedFramework = {
  inputDirs: string[]
  name: string
  outputDir: string
}

export type NormalizedConfig<F extends Frameworks = Frameworks> = {
  author?: string | readonly string[]
  basePath: string
  compilerOptions: CompilerOptions
  copyFiles: Record<string, NormalizedCopyFile[] | undefined>
  copyFilesRoot: string
  frameworks: NormalizedFramework[]
  name: string
  outputRoot: string
  packageJson?: PackageJsonConfig<F>
  tsconfig?: TsconfigConfig<F>
  url?: string
  version: string
}

function normalizeCopyFile(entry: CopyFileEntry): NormalizedCopyFile {
  if (typeof entry === "string") {
    if (!entry.trim()) throw new Error("copyFiles string entries cannot be empty")
    return { src: entry, dest: entry, required: true }
  }

  if (!entry || typeof entry !== "object" || typeof entry.src !== "string" || !entry.src.trim()) {
    throw new Error("copyFiles entries must be a path string or an object with a non-empty src")
  }
  if (entry.dest !== undefined && (typeof entry.dest !== "string" || !entry.dest.trim())) {
    throw new Error("copyFiles entry dest must be a non-empty string when provided")
  }
  if (entry.globalStyle && extname(entry.dest ?? entry.src).toLowerCase() !== ".css") {
    throw new Error("copyFiles entries marked globalStyle must target a .css file")
  }

  return {
    src: entry.src,
    dest: entry.dest ?? entry.src,
    required: entry.required ?? true,
    ...(entry.description ? { description: entry.description } : {}),
    ...(entry.globalStyle ? { globalStyle: true } : {}),
  }
}

function formatDiagnostic(diagnostic: Diagnostic): string {
  return typeof diagnostic.messageText === "string"
    ? diagnostic.messageText
    : diagnostic.messageText.messageText
}

function loadCompilerOptions(basePath: string, tsconfigPath?: string): CompilerOptions {
  if (!tsconfigPath) {
    return {}
  }

  const absolutePath = resolve(basePath, tsconfigPath)
  const configFile = readConfigFile(absolutePath, sys.readFile)
  if (configFile.error) {
    throw new Error(
      `Unable to read tsconfig at ${absolutePath}: ${formatDiagnostic(configFile.error)}`
    )
  }

  const parsed = parseJsonConfigFileContent(configFile.config, sys, dirname(absolutePath))
  if (parsed.errors.length > 0) {
    throw new Error(
      `Invalid tsconfig at ${absolutePath}:\n${parsed.errors
        .map((error) => `  - ${formatDiagnostic(error)}`)
        .join("\n")}`
    )
  }

  return parsed.options
}

async function assertDirectory(path: string, label: string): Promise<void> {
  try {
    await access(path, constants.R_OK)
    if (!(await stat(path)).isDirectory()) {
      throw new Error(`${label} is not a directory: ${path}`)
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(`${label} is not a directory:`)) {
      throw error
    }
    throw new Error(`${label} does not exist or is not readable: ${path}`)
  }
}

function validateFrameworkLayouts(frameworks: NormalizedFramework[]): void {
  for (const [index, framework] of frameworks.entries()) {
    for (const other of frameworks.slice(index + 1)) {
      if (
        isPathInside(framework.outputDir, other.outputDir) ||
        isPathInside(other.outputDir, framework.outputDir)
      ) {
        throw new Error(
          `Framework output directories must not overlap: ${framework.name} and ${other.name}`
        )
      }
    }
  }
}

function assertCoreConfig<F extends Frameworks>(config: Config<F>): void {
  if (typeof config.name !== "string" || !config.name.trim()) {
    throw new Error("Library name must be a non-empty string")
  }
  if (typeof config.version !== "string" || !config.version.trim()) {
    throw new Error("Library version must be a non-empty string")
  }
  if (
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(
      config.version
    )
  ) {
    throw new Error(`Library version must use semantic versioning. Received: ${config.version}`)
  }
  if (!Array.isArray(config.frameworks) || config.frameworks.length === 0) {
    throw new Error("At least one framework is required")
  }
  if (config.frameworks.some((framework) => typeof framework !== "string" || !framework.trim())) {
    throw new Error("Framework names must be non-empty strings")
  }
  if (config.frameworks.some((framework) => !/^[a-z][a-z0-9-]*$/.test(framework))) {
    throw new Error("Framework names may contain lowercase letters, numbers, and hyphens")
  }
  if (!config.inputDirs || typeof config.inputDirs !== "object") {
    throw new Error("inputDirs must define the source directories for each framework")
  }
  if (config.basePath !== undefined && typeof config.basePath !== "string") {
    throw new Error("basePath must be a string when provided")
  }
  if (
    !config.outputDirs ||
    typeof config.outputDirs !== "object" ||
    typeof config.outputDirs.rootDir !== "string" ||
    !config.outputDirs.rootDir.trim() ||
    !config.outputDirs.frameworks ||
    typeof config.outputDirs.frameworks !== "object"
  ) {
    throw new Error("outputDirs must define rootDir and a directory for each framework")
  }
}

export async function normalizeConfig<const F extends Frameworks>(
  config: Config<F>
): Promise<NormalizedConfig<F>> {
  assertCoreConfig(config)

  const frameworkNames = [...config.frameworks] as F[number][]
  const duplicates = frameworkNames.filter(
    (framework, index) => frameworkNames.indexOf(framework) !== index
  )
  if (duplicates.length > 0) {
    throw new Error(`Framework names must be unique: ${[...new Set(duplicates)].join(", ")}`)
  }

  const basePath = resolve(config.basePath ?? cwd())
  const outputRoot = resolve(basePath, config.outputDirs.rootDir)
  assertSafeOutputRoot(outputRoot, basePath)
  const copyFilesRoot = resolveInside(basePath, config.copyFilesRoot ?? "./src", "copyFilesRoot")
  const hasCopyFiles = Object.values(config.copyFiles ?? {}).some(
    (entries) => Array.isArray(entries) && entries.length > 0
  )

  await assertDirectory(basePath, "basePath")
  if (hasCopyFiles) await assertDirectory(copyFilesRoot, "copyFilesRoot")

  const frameworks: NormalizedFramework[] = []
  for (const name of frameworkNames) {
    const configuredInputs = config.inputDirs[name]
    const configuredOutput = config.outputDirs.frameworks[name]
    if (!configuredInputs) throw new Error(`Missing inputDirs entry for framework: ${name}`)
    if (!configuredOutput) throw new Error(`Missing outputDirs.frameworks entry for: ${name}`)

    const inputEntries = Array.isArray(configuredInputs) ? configuredInputs : [configuredInputs]
    if (inputEntries.length === 0) throw new Error(`inputDirs.${name} cannot be empty`)
    if (inputEntries.some((entry) => typeof entry !== "string" || !entry.trim())) {
      throw new Error(`inputDirs.${name} must contain non-empty relative paths`)
    }
    if (typeof configuredOutput !== "string" || !configuredOutput.trim()) {
      throw new Error(`outputDirs.frameworks.${name} must be a non-empty relative path`)
    }

    const inputDirs = inputEntries.map((entry, index) =>
      resolveInside(basePath, entry, `inputDirs.${name}[${index}]`)
    )
    for (const inputDir of inputDirs) await assertDirectory(inputDir, `inputDirs.${name}`)

    frameworks.push({
      inputDirs,
      name,
      outputDir: resolveInside(outputRoot, configuredOutput, `outputDirs.frameworks.${name}`),
    })
  }
  for (const framework of frameworks) {
    if (framework.outputDir === outputRoot) {
      throw new Error(`outputDirs.frameworks.${framework.name} must be below outputDirs.rootDir`)
    }
    for (const inputDir of framework.inputDirs) {
      if (isPathInside(inputDir, outputRoot) || isPathInside(outputRoot, inputDir)) {
        throw new Error(
          `Generated output must not overlap component sources for ${framework.name}:\n` +
            `  output: ${outputRoot}\n` +
            `  source: ${inputDir}`
        )
      }
    }
  }
  validateFrameworkLayouts(frameworks)

  const copyFiles: NormalizedConfig<F>["copyFiles"] = {}
  for (const [key, entries] of Object.entries(config.copyFiles ?? {})) {
    if (!entries) continue
    if (key !== "shared" && !frameworkNames.includes(key)) {
      throw new Error(`copyFiles contains an unknown framework: ${key}`)
    }

    if (!Array.isArray(entries)) {
      throw new Error(`copyFiles.${key} must be an array`)
    }
    const normalized = (entries as readonly CopyFileEntry[]).map(normalizeCopyFile)
    for (const [index, entry] of normalized.entries()) {
      const source = resolveInside(copyFilesRoot, entry.src, `copyFiles.${key}[${index}].src`)
      if (isPathInside(outputRoot, source)) {
        throw new Error(
          `copyFiles.${key}[${index}].src cannot read from generated output: ${source}`
        )
      }
      const frameworkTargets =
        key === "shared" ? frameworks : frameworks.filter((framework) => framework.name === key)
      for (const framework of frameworkTargets) {
        resolveInside(framework.outputDir, entry.dest, `copyFiles.${key}[${index}].dest`)
      }
    }
    copyFiles[key] = normalized
  }

  return {
    basePath,
    compilerOptions: loadCompilerOptions(basePath, config.tsconfigPath),
    copyFiles,
    copyFilesRoot,
    frameworks,
    name: config.name,
    outputRoot,
    version: config.version,
    ...(config.author ? { author: config.author } : {}),
    ...(config.packageJson ? { packageJson: config.packageJson } : {}),
    ...(config.tsconfig ? { tsconfig: config.tsconfig } : {}),
    ...(config.url ? { url: config.url } : {}),
  }
}

export async function findWorkspaceCatalog(startPath: string): Promise<Record<string, string>> {
  let current = startPath
  while (true) {
    const packageJsonPath = resolve(current, "package.json")
    let content: string | undefined
    try {
      content = await readFile(packageJsonPath, "utf8")
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error(`Unable to read workspace package.json: ${packageJsonPath}`, {
          cause: error,
        })
      }
    }

    if (content !== undefined) {
      let packageJson: { workspaces?: { catalog?: Record<string, string> } }
      try {
        packageJson = JSON.parse(content) as typeof packageJson
      } catch (error) {
        throw new Error(`Invalid workspace package.json: ${packageJsonPath}`, { cause: error })
      }
      if (packageJson.workspaces?.catalog) return packageJson.workspaces.catalog
    }

    const parent = dirname(current)
    if (parent === current) return {}
    current = parent
  }
}
