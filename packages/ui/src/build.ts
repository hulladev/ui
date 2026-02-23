import { constants, Dirent } from "node:fs"
import { access, copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises"
import { dirname, join, relative, resolve, sep } from "node:path"
import { cwd } from "node:process"
import { BuildCache } from "./buildCache"
import { execAsync } from "./helpers/execAsync"
import { generateComponent, getGeneratedOutputFilename } from "./helpers/generateComponent"
import { generateFrameworkPackageJson } from "./helpers/generateFrameworkPackageJson"
import { generateFrameworkTsconfig } from "./helpers/generateFrameworkTsconfig"
import { Config, CopyFileEntry, Frameworks, NormalizedCopyFile } from "./types.public"
import { entries, validateFrameworkPath } from "./utils/objects"

function normalizeCopyFileEntry(entry: CopyFileEntry): NormalizedCopyFile {
  if (typeof entry === "string") {
    return { src: entry, dest: entry, required: true }
  }
  return {
    src: entry.src,
    dest: entry.dest ?? entry.src,
    required: entry.required ?? true,
    ...(entry.description && { description: entry.description }),
  }
}

function normalizeRelPath(path: string): string {
  return path.split(sep).join("/")
}

async function collectExpectedOutputFiles(
  sourceRoot: string,
  framework: string
): Promise<Set<string>> {
  const expected = new Set<string>()

  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, { withFileTypes: true })

    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = join(currentPath, entry.name)
        if (entry.isDirectory()) {
          await walk(entryPath)
          return
        }

        const rel = relative(sourceRoot, entryPath)
        const relDir = dirname(rel)
        const outputName = getGeneratedOutputFilename(entry.name, framework)
        const outputRel = relDir === "." ? outputName : join(relDir, outputName)
        expected.add(normalizeRelPath(outputRel))
      })
    )
  }

  await walk(sourceRoot)
  return expected
}

async function pruneStaleOutputFiles(outputRoot: string, expectedFiles: Set<string>): Promise<void> {
  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, { withFileTypes: true })

    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = join(currentPath, entry.name)
        if (entry.isDirectory()) {
          await walk(entryPath)
          const remaining = await readdir(entryPath)
          if (remaining.length === 0) {
            await rm(entryPath, { recursive: false, force: true })
          }
          return
        }

        const rel = normalizeRelPath(relative(outputRoot, entryPath))
        if (!expectedFiles.has(rel)) {
          await rm(entryPath, { force: true })
        }
      })
    )
  }

  await walk(outputRoot)
}

export async function build<const F extends Frameworks>(
  config: Config<F>,
  options: { force?: boolean } = {}
): Promise<void> {
  console.info(`\n[🤖 @hulla/ui]: starting ui build process`)

  const basepath = config.basePath ?? cwd()
  const cache = new BuildCache(basepath)

  // Load cache unless force flag is set
  if (options.force) {
    console.info(`[🤖 @hulla/ui]: force rebuild requested, skipping cache`)
    cache.clear()
  } else {
    await cache.load()
  }

  // Validate all framework paths
  console.info(`[🤖 @hulla/ui]: validating framework paths`)
  for (const [framework, frameworkPath] of entries(config.outputDirs.frameworks)) {
    // Validate paths are relative (start with './')
    if (!frameworkPath.startsWith('./')) {
      throw new Error(
        `Framework path for '${String(framework)}' must be relative (start with './'). Got: '${frameworkPath}'`
      )
    }
    
    // Validate paths are within rootDir
    validateFrameworkPath(basepath, config.outputDirs.rootDir, String(framework), frameworkPath)
  }

  let componentsSkipped = 0
  let componentsRebuilt = 0

  if (config.scripts.preBuild) {
    console.info(`[🤖 @hulla/ui]: running pre-install script`)
    await execAsync(config.scripts.preBuild)
  }

  const frameworksDirs = await Promise.all(
    entries(config.inputDirs).map(async ([framework, paths]) => {
      const pathsArray = Array.isArray(paths) ? paths : [paths]

      const dirsWithPackageJson = await Promise.all(
        pathsArray.map(async (path) => {
          const fullPath = join(basepath, path)
          const entries = await readdir(fullPath, { withFileTypes: true })

          // Filter for directories and check if they contain package.json
          const dirChecks = await Promise.all(
            entries
              .filter((entry) => entry.isDirectory())
              .map(async (entry) => {
                const packageJsonPath = join(fullPath, entry.name, "package.json")
                try {
                  await access(packageJsonPath, constants.F_OK)
                  return { name: entry.name, path: join(fullPath, entry.name), framework }
                } catch {
                  return null
                }
              })
          )

          return dirChecks.filter(
            (dir): dir is { name: string; path: string; framework: F[number] } => dir !== null
          )
        })
      )

      return dirsWithPackageJson.flat()
    })
  ).then((dirs) => dirs.flat())

  await Promise.all(
    frameworksDirs.map(async (component) => {
      const { name, path, framework } = component

      const files = await readdir(path, { withFileTypes: true })
      const outputDir = join(config.outputDirs.rootDir, config.outputDirs.frameworks[framework])
      const outputPath = join(basepath, outputDir, name)

      // Collect all source file paths to check cache
      const sourceFiles: string[] = []
      async function collectFiles(dirPath: string, dirent: Dirent): Promise<void> {
        if (dirent.isDirectory()) {
          const subDirPath = join(dirPath, dirent.name)
          const subFiles = await readdir(subDirPath, { withFileTypes: true })
          await Promise.all(subFiles.map((f) => collectFiles(subDirPath, f)))
        } else {
          sourceFiles.push(join(dirPath, dirent.name))
        }
      }

      await Promise.all(files.map((file) => collectFiles(path, file)))

      // Check if component needs rebuilding
      const hasChanged = await cache.hasAnyFileChanged(sourceFiles)

      if (!hasChanged) {
        componentsSkipped++
        return
      }

      componentsRebuilt++
      await mkdir(outputPath, { recursive: true })

      await Promise.all(
        files.map((file) =>
          generateComponent({
            dirent: file,
            framework,
            outputPath,
            tsconfigPath: config.tsconfigPath,
            cache,
          })
        )
      )

      const expectedOutputFiles = await collectExpectedOutputFiles(path, String(framework))
      await pruneStaleOutputFiles(outputPath, expectedOutputFiles)
    })
  )

  // Process framework-level operations: copy files, generate package.json, generate tsconfig
  console.info(`\n[🤖 @hulla/ui]: processing framework-level operations`)
  await Promise.all(
    entries(config.outputDirs.frameworks).map(async ([framework, frameworkPath]) => {
      const frameworkOutputPath = join(basepath, config.outputDirs.rootDir, frameworkPath)
      await mkdir(frameworkOutputPath, { recursive: true })

      // Run all framework operations in parallel
      await Promise.all([
        // Copy shared and framework-specific files
        (async () => {
          if (!config.copyFiles) return

          const sharedFiles = config.copyFiles?.shared ?? []
          const frameworkFiles = config.copyFiles?.[framework] ?? []
          const allFilesToCopy = [...sharedFiles, ...frameworkFiles].map(normalizeCopyFileEntry)

          if (allFilesToCopy.length === 0) return

          const inputPaths = config.inputDirs[framework as F[number]]
          if (!inputPaths) return
          const firstInputPath = (Array.isArray(inputPaths) ? inputPaths[0] : inputPaths) as string
          const sourceDir = join(basepath, firstInputPath, "..")

          await Promise.all(
            allFilesToCopy.map(async (file) => {
              const sourcePath = join(sourceDir, file.src)
              const destPath = join(frameworkOutputPath, file.dest)
              const destDir = dirname(destPath)

              await mkdir(destDir, { recursive: true })

              try {
                // Check if file needs copying using cache
                const hasChanged = await cache.hasFileChanged(sourcePath)
                if (hasChanged) {
                  await copyFile(sourcePath, destPath)
                  await cache.markFileProcessed(sourcePath)
                  console.info(`[🤖 @hulla/ui]: copied ${file.src} to ${framework}`)
                }
              } catch (error) {
                console.error(`[🤖 @hulla/ui]: failed to copy ${file.src} to ${framework}:`, error)
              }
            })
          )
        })(),

        // Generate framework-level package.json
        (async () => {
          await generateFrameworkPackageJson({
            framework: String(framework),
            outputPath: frameworkOutputPath,
            packageJson: config.packageJson,
            cache,
          })
        })(),

        // Generate framework-level tsconfig.json
        (async () => {
          const inputPaths = config.inputDirs[framework as F[number]]
          if (!inputPaths) return
          const firstInputPath = (Array.isArray(inputPaths) ? inputPaths[0] : inputPaths) as string
          const sourceTsconfigPath = join(basepath, firstInputPath, "tsconfig.json")
          const userTsconfigAbsolute = resolve(basepath, config.tsconfigPath ?? "./tsconfig.json")

          try {
            await access(sourceTsconfigPath, constants.F_OK)

            await generateFrameworkTsconfig({
              framework: String(framework),
              sourceTsconfigPath,
              outputPath: frameworkOutputPath,
              userTsconfigPath: userTsconfigAbsolute,
              globalModifier: config.tsconfig?.modifier,
              frameworkModifier: config.tsconfig?.frameworkModifiers?.[framework],
            })
          } catch {
            console.warn(
              `[🤖 @hulla/ui]: skipping tsconfig generation for ${framework} (source not found at ${sourceTsconfigPath})`
            )
          }
        })(),
      ])
    })
  )

  // Generate ui.config.ts at rootDir
  console.info(`[🤖 @hulla/ui]: generating ui.config.ts`)
  const uiConfigPath = join(basepath, config.outputDirs.rootDir, 'ui.config.ts')
  const authorString = Array.isArray(config.author)
    ? `[${config.author.map(a => `'${a}'`).join(', ')}]`
    : `'${config.author}'`

  const frameworksEntries = entries(config.outputDirs.frameworks)
    .map(([framework, path]) => `  ${String(framework)}: '${path}'`)
    .join(',\n')

  // Normalize copyFiles for output
  let copyFilesOutput = ''
  if (config.copyFiles) {
    const normalizedCopyFiles: Record<string, NormalizedCopyFile[]> = {}

    for (const [key, files] of Object.entries(config.copyFiles)) {
      if (files && files.length > 0) {
        normalizedCopyFiles[key] = files.map(normalizeCopyFileEntry)
      }
    }

    if (Object.keys(normalizedCopyFiles).length > 0) {
      const formatFile = (f: NormalizedCopyFile) => {
        const parts = [
          `src: '${f.src}'`,
          `dest: '${f.dest}'`,
          `required: ${f.required}`,
        ]
        if (f.description) {
          parts.push(`description: '${f.description}'`)
        }
        return `{ ${parts.join(', ')} }`
      }

      const copyFilesEntries = Object.entries(normalizedCopyFiles)
        .map(([key, files]) => `    ${key}: [\n      ${files.map(formatFile).join(',\n      ')}\n    ]`)
        .join(',\n')

      copyFilesOutput = `,\n  copyFiles: {\n${copyFilesEntries}\n  }`
    }
  }

  const configLines = [
    `  name: '${config.name}',`,
    ...(config.url ? [`  url: '${config.url}',`] : []),
    ...(config.author ? [`  author: ${authorString},`] : []),
    `  frameworks: {`,
    frameworksEntries,
    `  },`,
    `  version: '${config.version}'${copyFilesOutput}`
  ]

  const uiConfigContent = `import type { UILibrary } from '@hulla/ui'

export const config: UILibrary = {
${configLines.join('\n')}
}
`

  await mkdir(dirname(uiConfigPath), { recursive: true })
  await writeFile(uiConfigPath, uiConfigContent, 'utf-8')
  console.info(`[🤖 @hulla/ui]: created ui.config.ts at ${config.outputDirs.rootDir}`)

  if (config.scripts.postBuild) {
    console.info(`[🤖 @hulla/ui]: running post-install script`)
    await execAsync(config.scripts.postBuild)
  }

  // Save cache
  await cache.save()

  // Log build metrics
  console.info(`\n[🤖 @hulla/ui]: build metrics:`)
  console.info(`  - Components rebuilt: ${componentsRebuilt}`)
  console.info(`  - Components skipped (cached): ${componentsSkipped}`)
  if (componentsSkipped > 0) {
    const percentSkipped = Math.round(
      (componentsSkipped / (componentsRebuilt + componentsSkipped)) * 100
    )
    console.info(`  - Cache hit rate: ${percentSkipped}%`)
  }

  console.info(`\n[🤖 @hulla/ui]: build process completed`)
}
