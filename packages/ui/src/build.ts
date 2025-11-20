import { constants, existsSync } from "node:fs"
import { access, mkdir, readdir } from "node:fs/promises"
import { join } from "node:path"
import { cwd } from "node:process"
import { generateComponent } from "./helpers/generateComponent"
import { generateFrameworkPackageJson } from "./helpers/generateFrameworkPackageJson"
import { Config, Frameworks } from "./types.public"
import { entries } from "./utils/objects"

export async function build<const F extends Frameworks>(config: Config<F>): Promise<void> {
  console.info(`\n[🤖 @hulla/ui]: starting ui build process`)
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

  console.info(`\n[🤖 @hulla/ui]: build process completed`)
}
