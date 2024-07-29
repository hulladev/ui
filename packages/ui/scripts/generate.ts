import { intro, outro, spinner } from '@clack/prompts'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import * as pc from 'picocolors'
import { uniqBy } from '../lib/utils'

const execPromise = promisify(exec)

async function main() {
  const isClean = process.argv.slice(2).includes('--clean')
  if (isClean) {
    intro(`[${pc.cyan('@hulla/ui 🤖')}] Cleaning up generated files...`)
    if (existsSync(join(process.cwd(), '../../generated'))) {
      await promisify(exec)('rm -rf ../../generated')
    }
  }
  let updatedComponents: string[] = []
  const s = spinner()
  s.start('Generating files... Feel free to grab a drink of your choice 🍺')
  if (isClean) {
    updatedComponents = await generate()
  } else {
    const changedFiles = uniqBy(await getChangedFiles(), 'component')
    const updateDirs = changedFiles.map((file) => {
      const path = join(process.cwd(), 'src', file.component)
      if (!existsSync(path)) {
        throw new Error(`Component directory ${path} does not exist!`)
      }
      return {
        path,
        component: file.component,
      } satisfies ChangedFile
    })
    updatedComponents = await generate(updateDirs)
  }
  s.stop(`[${pc.cyan('@hulla/ui 🤖')}] Generated files successfully! ✅`)
  outro(
    `[${pc.cyan('@hulla/ui 🤖')}] Updated the following components: 🥇\n\t${pc.cyan('↪')} ${pc.cyan(updatedComponents.join('\n\t↪ '))}`
  )
}

main()

type ChangedFile = {
  path: string
  component: string
}

async function getChangedFiles(): Promise<ChangedFile[]> {
  let changedFiles: ChangedFile[] = []
  try {
    const { stdout } = await execPromise('git status --porcelain | grep packages/ui/src')

    changedFiles = stdout
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map(
        (line: string) =>
          ({
            path: line.slice(3),
            component: line.split('/')[3],
          }) satisfies ChangedFile
      )
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  }
  return changedFiles
}

async function generate(onDirs?: ChangedFile[]): Promise<string[]> {
  const changedFiles = new Set<string>()
  try {
    // dirs were specified from git changes
    if (onDirs) {
      for (const cf of onDirs) {
        changedFiles.add(cf.component)
        await generateFromPath(cf.path, cf.component)
      }
    } else {
      // used with --clean - do everything from scratch
      const srcDirPath = join(process.cwd(), 'src')
      const dirs = await readdir(srcDirPath, { withFileTypes: true })

      for (const dir of dirs) {
        if (dir.isDirectory()) {
          changedFiles.add(dir.name)
          const dirPath = join(srcDirPath, dir.name)
          await generateFromPath(dirPath, dir.name)
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  }
  return Array.from(changedFiles)
}

async function generateFromPath(dirPath: string, component: string) {
  const files = await readdir(dirPath)
  const jsonFiles = files.filter((file) => file.endsWith('.json'))

  if (jsonFiles.length === 0) {
    throw new Error(`No JSON configuration files found in ${dirPath}`)
  }
  if (jsonFiles.length > 1) {
    throw new Error(`Multiple JSON configuration files found in ${dirPath}`)
  }

  const file = jsonFiles[0]
  const filePath = join(dirPath, file)
  const content = await readFile(filePath, 'utf-8').then((data) => JSON.parse(data))

  // cache just in case a css file is imported multiple times
  const cssCache = new Map<string, string>()
  // Fetch css frameworks content
  await Promise.all(
    Object.entries(content.style as Record<string, string>).map(async ([lib, cssPath]) => {
      let css: string
      if (cssCache.has(cssPath)) {
        css = cssCache.get(cssPath) as string
      }
      css = await readFile(join(dirPath, cssPath), 'utf-8')
      cssCache.set(lib, css)
      // now we read the js framework code and can replace the css template with actual css
      await Promise.all(
        Object.entries(content.imports as Record<string, string>).map(async ([key, value]) => {
          const extension = value.split('.').slice(-1).join('.')
          const importPath = join(dirPath, value as string)
          const codetemplate = await readFile(importPath, 'utf-8')
          const cssRegex = /export const css = (vn|cn)\(([\s\S]*?)\)/
          const [extractedCss] = css.match(cssRegex) as [string]

          if (!extractedCss) {
            throw new Error(`No css found in ${importPath}`)
          }

          const updatedCode = codetemplate.replace(/const css = (vn|cn)\(([\s\S]*?)\)/, extractedCss)
          const generatedDirPath = join(process.cwd(), '../../generated', key, lib)
          if (!existsSync(generatedDirPath)) {
            await mkdir(generatedDirPath, { recursive: true })
          }
          await writeFile(join(generatedDirPath, `${component}.${extension}`), updatedCode)
        })
      )
    })
  )
}
