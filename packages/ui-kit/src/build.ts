import { constants, Dirent } from "node:fs"
import { access, copyFile, mkdir, readdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { cwd } from "node:process"
import { BuildCache } from "./buildCache"
import { execAsync } from "./helpers/execAsync"
import { generateComponent } from "./helpers/generateComponent"
import { generateFrameworkPackageJson } from "./helpers/generateFrameworkPackageJson"
import { generateFrameworkTsconfig } from "./helpers/generateFrameworkTsconfig"
import { Config, Frameworks } from "./types.public"
import { entries } from "./utils/objects"

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
      const outputDir = config.outputDirs[framework]
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
    })
  )

  // Process framework-level operations: copy files, generate package.json, generate tsconfig
  console.info(`\n[🤖 @hulla/ui]: processing framework-level operations`)
  await Promise.all(
    entries(config.outputDirs).map(async ([framework, outputDir]) => {
      const frameworkOutputPath = join(basepath, outputDir)
      await mkdir(frameworkOutputPath, { recursive: true })

      // Run all framework operations in parallel
      await Promise.all([
        // Copy shared and framework-specific files
        (async () => {
          if (!config.copyFiles) return

          const sharedFiles = config.copyFiles?.shared ?? []
          const frameworkFiles = config.copyFiles?.[framework] ?? []
          const allFilesToCopy = [...sharedFiles, ...frameworkFiles]

          if (allFilesToCopy.length === 0) return

          const inputPaths = config.inputDirs[framework]
          if (!inputPaths) return
          const firstInputPath = (Array.isArray(inputPaths) ? inputPaths[0] : inputPaths) as string
          const sourceDir = join(basepath, firstInputPath, "..")

          await Promise.all(
            allFilesToCopy.map(async (filePath) => {
              const sourcePath = join(sourceDir, filePath)
              const destPath = join(frameworkOutputPath, filePath)
              const destDir = dirname(destPath)

              await mkdir(destDir, { recursive: true })

              try {
                // Check if file needs copying using cache
                const hasChanged = await cache.hasFileChanged(sourcePath)
                if (hasChanged) {
                  await copyFile(sourcePath, destPath)
                  await cache.markFileProcessed(sourcePath)
                  console.info(`[🤖 @hulla/ui]: copied ${filePath} to ${framework}`)
                }
              } catch (error) {
                console.error(`[🤖 @hulla/ui]: failed to copy ${filePath} to ${framework}:`, error)
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
          const inputPaths = config.inputDirs[framework]
          if (!inputPaths) return
          const firstInputPath = (Array.isArray(inputPaths) ? inputPaths[0] : inputPaths) as string
          const sourceTsconfigPath = join(basepath, firstInputPath, "tsconfig.json")

          try {
            await access(sourceTsconfigPath, constants.F_OK)

            await generateFrameworkTsconfig({
              framework: String(framework),
              sourceTsconfigPath,
              outputPath: frameworkOutputPath,
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
    const percentSkipped = Math.round((componentsSkipped / (componentsRebuilt + componentsSkipped)) * 100)
    console.info(`  - Cache hit rate: ${percentSkipped}%`)
  }

  console.info(`\n[🤖 @hulla/ui]: build process completed`)
}
