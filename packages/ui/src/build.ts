import { copyFile, lstat, mkdir, readFile, readdir } from "node:fs/promises"
import { basename, dirname, extname, join, relative, resolve } from "node:path"
import { findWorkspaceCatalog, normalizeConfig, type NormalizedConfig } from "./config"
import {
  compareTrees,
  createStagingDirectory,
  hashTree,
  pathExists,
  removeTree,
  replaceTreeAtomically,
  writeText,
} from "./helpers/filesystem"
import { formatGeneratedSource } from "./helpers/format"
import { generateFrameworkPackageJson } from "./helpers/generateFrameworkPackageJson"
import { generateFrameworkTsconfig } from "./helpers/generateFrameworkTsconfig"
import { log } from "./helpers/log"
import { resolveInside, toPosixPath } from "./helpers/paths"
import {
  getGeneratedOutputFilename,
  isTransformableSource,
  transformSource,
} from "./helpers/sourceTransform"
import {
  GeneratedOutputOutOfDateError,
  type BuildOptions,
  type BuildResult,
  type Frameworks,
  type NormalizedCopyFile,
  type UILibrary,
  type UILibraryManifest,
  type Config,
} from "./types.public"

type PlannedFile = {
  destination: string
  framework: string
  source: string
  transform: boolean
}

type FrameworkPlan = {
  components: string[]
  files: PlannedFile[]
  name: string
  outputDir: string
  sourceToOutput: Map<string, string>
}

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

function normalizedFrameworkPath(root: string, frameworkPath: string): string {
  const path = toPosixPath(relative(root, frameworkPath))
  return path.startsWith(".") ? path : `./${path}`
}

async function listComponentFiles(root: string): Promise<string[]> {
  const result: string[] = []
  const walk = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const path = join(directory, entry.name)
      if (entry.isSymbolicLink()) {
        throw new Error(`Symbolic links are not supported in component sources: ${path}`)
      }
      if (entry.isDirectory()) await walk(path)
      else if (entry.isFile()) result.push(path)
    }
  }
  await walk(root)
  return result
}

function registerFile(
  plan: FrameworkPlan,
  destinations: Map<string, string>,
  file: PlannedFile
): void {
  const existing = destinations.get(file.destination)
  if (existing) {
    throw new Error(
      `Multiple sources emit the same ${file.framework} file:\n` +
        `  destination: ${file.destination}\n` +
        `  source 1: ${existing}\n` +
        `  source 2: ${file.source}`
    )
  }

  destinations.set(file.destination, file.source)
  plan.files.push(file)
  plan.sourceToOutput.set(resolve(file.source), file.destination)
}

async function discoverComponents(
  config: NormalizedConfig,
  stagingRoot: string
): Promise<FrameworkPlan[]> {
  const plans: FrameworkPlan[] = []

  for (const framework of config.frameworks) {
    const outputDir = resolveInside(
      stagingRoot,
      relative(config.outputRoot, framework.outputDir),
      `staging output for ${framework.name}`
    )
    const plan: FrameworkPlan = {
      components: [],
      files: [],
      name: framework.name,
      outputDir,
      sourceToOutput: new Map(),
    }
    const destinations = new Map<string, string>([
      [join(outputDir, "package.json"), "generated framework package.json"],
      [join(outputDir, "tsconfig.json"), "generated framework tsconfig.json"],
    ])
    const componentSources = new Map<string, string>()

    for (const inputDir of framework.inputDirs) {
      const entries = await readdir(inputDir, { withFileTypes: true })
      for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
        if (!entry.isDirectory()) continue
        const componentRoot = join(inputDir, entry.name)
        const packageJsonPath = join(componentRoot, "package.json")
        if (!(await pathExists(packageJsonPath))) continue

        const previousSource = componentSources.get(entry.name)
        if (previousSource) {
          throw new Error(
            `Duplicate ${framework.name} component "${entry.name}":\n` +
              `  source 1: ${previousSource}\n` +
              `  source 2: ${componentRoot}`
          )
        }
        componentSources.set(entry.name, componentRoot)
        plan.components.push(entry.name)

        for (const source of await listComponentFiles(componentRoot)) {
          const sourceRelative = relative(componentRoot, source)
          const destination = join(
            outputDir,
            entry.name,
            dirname(sourceRelative),
            getGeneratedOutputFilename(basename(source), framework.name)
          )
          registerFile(plan, destinations, {
            destination,
            framework: framework.name,
            source,
            transform: isTransformableSource(source),
          })
        }
      }
    }

    const copyFiles = [
      ...(config.copyFiles.shared ?? []),
      ...(config.copyFiles[framework.name] ?? []),
    ]
    for (const entry of copyFiles) {
      const source = resolveInside(
        config.copyFilesRoot,
        entry.src,
        `copyFiles.${framework.name}.src`
      )
      if (!(await pathExists(source))) {
        if (entry.required) throw new Error(`Required copy file does not exist: ${source}`)
        continue
      }
      const stats = await lstat(source)
      if (!stats.isFile())
        throw new Error(`copyFiles entries must reference regular files: ${source}`)

      const destination = resolveInside(outputDir, entry.dest, `copyFiles.${framework.name}.dest`)
      registerFile(plan, destinations, {
        destination,
        framework: framework.name,
        source,
        transform: isTransformableSource(source),
      })
    }

    plan.components.sort()
    plan.files.sort((left, right) => left.destination.localeCompare(right.destination))
    plans.push(plan)
  }

  return plans
}

async function renderPlannedFile(
  file: PlannedFile,
  plan: FrameworkPlan,
  config: NormalizedConfig
): Promise<void> {
  await mkdir(dirname(file.destination), { recursive: true })
  const extension = extname(file.source).toLowerCase()

  if (extension === ".json") {
    let parsed: unknown
    try {
      parsed = JSON.parse(await readFile(file.source, "utf8"))
    } catch (error) {
      throw new Error(`Invalid JSON source ${file.source}`, { cause: error })
    }
    await writeText(file.destination, await formatGeneratedSource(file.destination, json(parsed)))
    return
  }

  if (file.transform) {
    const transformed = await transformSource(await readFile(file.source, "utf8"), {
      compilerOptions: config.compilerOptions,
      destinationPath: file.destination,
      framework: file.framework,
      sourcePath: file.source,
      sourceToOutput: plan.sourceToOutput,
    })
    await writeText(file.destination, await formatGeneratedSource(file.destination, transformed))
    return
  }

  await copyFile(file.source, file.destination)
}

function copyFilesForConfig(config: NormalizedConfig): UILibrary["copyFiles"] {
  const result: Record<string, NormalizedCopyFile[] | undefined> = {}
  for (const [framework, files] of Object.entries(config.copyFiles)) {
    if (files && files.length > 0) result[framework] = files
  }
  return Object.keys(result).length > 0 ? (result as UILibrary["copyFiles"]) : undefined
}

function createLibraryConfig(config: NormalizedConfig, plans: FrameworkPlan[]): UILibrary {
  const components: UILibrary["components"] = {}
  for (const plan of plans) {
    for (const component of plan.components) {
      const existing = components[component] ?? { frameworks: [] }
      existing.frameworks.push(plan.name)
      existing.frameworks.sort()
      components[component] = existing
    }
  }

  const copyFiles = copyFilesForConfig(config)
  return {
    schemaVersion: 1,
    name: config.name,
    version: config.version,
    frameworks: Object.fromEntries(
      config.frameworks.map((framework) => [
        framework.name,
        normalizedFrameworkPath(config.outputRoot, framework.outputDir),
      ])
    ),
    components: Object.fromEntries(
      Object.entries(components).sort(([left], [right]) => left.localeCompare(right))
    ),
    ...(config.author ? { author: config.author } : {}),
    ...(copyFiles ? { copyFiles } : {}),
    ...(config.url ? { url: config.url } : {}),
  }
}

async function renderOutput(
  config: NormalizedConfig,
  stagingRoot: string
): Promise<{ components: number; files: number }> {
  const plans = await discoverComponents(config, stagingRoot)
  const catalog = await findWorkspaceCatalog(config.basePath)

  for (const plan of plans) {
    await mkdir(plan.outputDir, { recursive: true })
    await Promise.all(plan.files.map((file) => renderPlannedFile(file, plan, config)))
    const packageJsonPath = join(plan.outputDir, "package.json")
    await writeText(
      packageJsonPath,
      await formatGeneratedSource(
        packageJsonPath,
        json(generateFrameworkPackageJson(config, plan.name, catalog))
      )
    )
    const tsconfigPath = join(plan.outputDir, "tsconfig.json")
    await writeText(
      tsconfigPath,
      await formatGeneratedSource(tsconfigPath, json(generateFrameworkTsconfig(config, plan.name)))
    )
  }

  const library = createLibraryConfig(config, plans)
  const uiConfigPath = join(stagingRoot, "ui.config.ts")
  const uiConfigContent =
    `import type { UILibrary } from "@hulla/ui"\n\n` +
    `export const config = ${JSON.stringify(library, null, 2)} satisfies UILibrary\n`
  await writeText(uiConfigPath, await formatGeneratedSource(uiConfigPath, uiConfigContent))

  const files = await hashTree(stagingRoot)
  const manifest: UILibraryManifest = {
    schemaVersion: 1,
    library,
    files,
  }
  const manifestPath = join(stagingRoot, "ui.manifest.json")
  await writeText(manifestPath, await formatGeneratedSource(manifestPath, json(manifest)))

  return {
    components: Object.keys(library.components).length,
    files: Object.keys(files).length + 1,
  }
}

export async function build<const F extends Frameworks>(
  rawConfig: Config<F>,
  options: BuildOptions = {}
): Promise<BuildResult> {
  const mode = options.mode ?? "write"
  const config = await normalizeConfig(rawConfig)
  const stagingRoot = await createStagingDirectory(config.outputRoot)
  let stagingExists = true

  try {
    const rendered = await renderOutput(config, stagingRoot)
    const differences = await compareTrees(stagingRoot, config.outputRoot)
    const changed = differences.length > 0

    if (mode === "check" && changed) {
      throw new GeneratedOutputOutOfDateError(config.outputRoot, differences)
    }

    if (mode === "write" && changed) {
      await replaceTreeAtomically(stagingRoot, config.outputRoot)
      stagingExists = false
    }

    if (!options.quiet) {
      log.section(mode === "check" ? "✅ Generated output verified" : "✅ Generated output ready")
      log.item(`library: ${config.name}@${config.version}`)
      log.item(`components: ${rendered.components}`)
      log.item(`files: ${rendered.files}`)
      log.item(`output: ${config.outputRoot}`)
      log.item(
        changed ? (mode === "write" ? "status: updated" : "status: stale") : "status: current"
      )
    }

    return {
      changed,
      components: rendered.components,
      files: rendered.files,
      mode,
      outputRoot: config.outputRoot,
    }
  } finally {
    if (stagingExists) await removeTree(stagingRoot)
  }
}
