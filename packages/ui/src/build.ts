import { constants, existsSync } from "node:fs"
import { access, copyFile, mkdir, readdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { cwd } from "node:process"
import { execAsync } from "./helpers/execAsync"
import { generateComponent } from "./helpers/generateComponent"
import { generateFrameworkPackageJson } from "./helpers/generateFrameworkPackageJson"
import { generateFrameworkTsconfig } from "./helpers/generateFrameworkTsconfig"
import { Config, Frameworks } from "./types.public"
import { entries } from "./utils/objects"

export async function build<const F extends Frameworks>(config: Config<F>): Promise<void> {
  console.info(`\n[🤖 @hulla/ui]: starting ui build process`)
  if (config.scripts.preBuild) {
    console.info(`[🤖 @hulla/ui]: running pre-install script`)
    await execAsync(config.scripts.preBuild)
  }

  const basepath = config.basePath ?? cwd()
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
      if (!existsSync(outputPath)) {
        await mkdir(outputPath, { recursive: true })
      }

      await Promise.all(
        files.map((file) =>
          generateComponent({
            dirent: file,
            framework,
            outputPath,
            tsconfigPath: config.tsconfigPath,
          })
        )
      )
    })
  )

  // Copy shared and framework-specific files
  if (config.copyFiles) {
    console.info(`\n[🤖 @hulla/ui]: copying shared files`)
    await Promise.all(
      entries(config.outputDirs).map(async ([framework, outputDir]) => {
        const frameworkOutputPath = join(basepath, outputDir)

        // Get shared and framework-specific files to copy
        const sharedFiles = config.copyFiles?.shared ?? []
        const frameworkFiles = config.copyFiles?.[framework] ?? []
        const allFilesToCopy = [...sharedFiles, ...frameworkFiles]

        if (allFilesToCopy.length === 0) return

        // Get the source directory from input dirs
        const inputPaths = config.inputDirs[framework]
        if (!inputPaths) return
        const firstInputPath = (Array.isArray(inputPaths) ? inputPaths[0] : inputPaths) as string
        const sourceDir = join(basepath, firstInputPath, "..")

        // Copy each file
        await Promise.all(
          allFilesToCopy.map(async (filePath) => {
            const sourcePath = join(sourceDir, filePath)
            const destPath = join(frameworkOutputPath, filePath)

            // Create destination directory if it doesn't exist
            const destDir = dirname(destPath)
            if (!existsSync(destDir)) {
              await mkdir(destDir, { recursive: true })
            }

            try {
              await copyFile(sourcePath, destPath)
              console.info(`[🤖 @hulla/ui]: copied ${filePath} to ${framework}`)
            } catch (error) {
              console.error(`[🤖 @hulla/ui]: failed to copy ${filePath} to ${framework}:`, error)
            }
          })
        )
      })
    )
  }

  // Generate framework-level package.json files
  console.info(`\n[🤖 @hulla/ui]: generating framework package.json files`)
  await Promise.all(
    entries(config.outputDirs).map(async ([framework, outputDir]) => {
      const frameworkOutputPath = join(basepath, outputDir)

      if (!existsSync(frameworkOutputPath)) {
        await mkdir(frameworkOutputPath, { recursive: true })
      }

      // Merge shared and framework-specific dependencies
      const sharedDeps = config.dependencies?.shared ?? []
      const frameworkDeps = config.dependencies?.[framework] ?? []
      const allDependencies = [...sharedDeps, ...frameworkDeps]

      const sharedDevDeps = config.devDependencies?.shared ?? []
      const frameworkDevDeps = config.devDependencies?.[framework] ?? []
      const allDevDependencies = [...sharedDevDeps, ...frameworkDevDeps]

      await generateFrameworkPackageJson({
        framework: String(framework),
        outputPath: frameworkOutputPath,
        dependencies: allDependencies,
        devDependencies: allDevDependencies,
        scripts: config.scripts,
      })
    })
  )

  // Generate framework-level tsconfig.json files
  console.info(`\n[🤖 @hulla/ui]: generating framework tsconfig.json files`)
  await Promise.all(
    entries(config.outputDirs).map(async ([framework, outputDir]) => {
      const frameworkOutputPath = join(basepath, outputDir)

      if (!existsSync(frameworkOutputPath)) {
        await mkdir(frameworkOutputPath, { recursive: true })
      }

      // Construct the source tsconfig path for the framework
      const inputPaths = config.inputDirs[framework]
      if (!inputPaths) return
      const firstInputPath = (Array.isArray(inputPaths) ? inputPaths[0] : inputPaths) as string
      const sourceTsconfigPath = join(basepath, firstInputPath, "tsconfig.json")

      // Check if source tsconfig exists
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
    })
  )

  if (config.scripts.postBuild) {
    console.info(`[🤖 @hulla/ui]: running post-install script`)
    await execAsync(config.scripts.postBuild)
  }

  console.info(`\n[🤖 @hulla/ui]: build process completed`)
}
