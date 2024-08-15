import { intro, outro, spinner } from '@clack/prompts'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import * as pc from 'picocolors'
import type { PackageJSON } from '../lib/types'
import { uniqBy } from '../lib/utils'

const execPromise = promisify(exec)

/**
 * Runs the generated files compiler. Look into individual helper functions for more information.
 */
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

type ChangedFile = {
  path: string
  component: string
}

/**
 * Lists all the changed files inside the packages/ui/src directory.
 * @returns List of modofied/new/deleted files
 */
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

/**
 * Runs the generation script on passed values
 * @param onDirs If passed override for only specific directories (see #getChangedFiles), otherwise runs on entire packages/ui/src directory
 * @returns Array of files that were changed
 */
async function generate(onDirs?: ChangedFile[]): Promise<string[]> {
  const changedFiles = new Set<string>()
  try {
    // dirs were specified from git changes
    if (onDirs) {
      for (const cf of onDirs) {
        changedFiles.add(cf.component)
        await generateFromPath(cf.path)
      }
    } else {
      // used with --clean - do everything from scratch
      const srcDirPath = join(process.cwd(), 'src')
      const dirs = await readdir(srcDirPath, { withFileTypes: true })

      for (const dir of dirs) {
        if (dir.isDirectory()) {
          changedFiles.add(dir.name)
          const dirPath = join(srcDirPath, dir.name)
          await generateFromPath(dirPath)
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  }
  return Array.from(changedFiles)
}

/**
 * The main compiler logic
 * @param dirPath The path to the directory containing the component files.
 */
async function generateFromPath(dirPath: string) {
  const paths = await readdir(dirPath)
  const frameworks = paths.filter((path) => !path.includes('.') && path !== 'style')

  const cssCache = new Map<string, string>()

  await Promise.all(
    // We map over individual frameworks
    frameworks.map(async (framework) => {
      const frameworkFiles = await readdir(join(dirPath, framework))
      const indexFile = frameworkFiles.find((file) => file.includes('index'))
      const packageJson = await readFile(join(dirPath, framework, 'package.json'), 'utf-8')
      // Validate the folder structure
      if (!existsSync(join(dirPath, framework, 'package.json'))) {
        throw new Error(`No package.json found in ${framework} directory`)
      }
      if (!indexFile) {
        throw new Error(`No index file found in ${framework} directory`)
      }
      const indexFilePath = join(dirPath, framework, indexFile)
      const indexContent = await readFile(indexFilePath, 'utf-8')
      const exportLines = indexContent.split('\n').filter((line) => line.includes('export'))
      if (exportLines.length === 0) {
        throw new Error(`No export lines found in ${indexFilePath}`)
      }
      const relevantFiles = frameworkFiles.filter(
        (path) => !path.includes('index') && !path.includes('package.json') && !path.includes('node_modules')
      )
      const fileExports = exportLines.map((line) => line.split('from')[1].trim())
      if (
        !relevantFiles.every((path) =>
          fileExports.some((file) => file.includes(path) || file.includes(path.split('.')[0]))
        )
      ) {
        throw new Error(`Not all files are exported in ${indexFilePath}`)
      }
      // Structure okay 👍🏻 Now we perform modifications to the code files
      const componentFiles = await Promise.all(
        relevantFiles.map(async (file) => {
          const filePath = join(dirPath, framework, file)
          const content = await readFile(filePath, 'utf-8')
          const lines = content.split('\n')
          const styleImportIndex = lines.findIndex((line) => line.includes('../style/tailwind'))
          if (styleImportIndex === -1) {
            throw new Error(`No style imports found in ${filePath}`)
          }
          const styleImports = extractImports(lines[styleImportIndex])
          if (!styleImports.length) {
            throw new Error(`No style imports found in ${filePath}`)
          }
          // Remove the imoport line from the original file, we no longer need it
          lines.splice(styleImportIndex, 1)
          // Now we map over the individual extracted style imports and inject their code
          const styleFrameworks = await readdir(join(dirPath, 'style'))
          // Map over individual style frameworks to generate each file
          return Promise.all(
            styleFrameworks.map(async (styleFramework) => {
              const styleFrameworkName = styleFramework.split('.')[0]
              let css: string
              // If we already read the css file, retrieve it from Map cache
              if (cssCache.has(styleFrameworkName)) {
                css = cssCache.get(styleFrameworkName) as string
              } else {
                css = await readFile(join(dirPath, 'style', styleFramework), 'utf-8')
                cssCache.set(styleFrameworkName, css)
              }
              const cssLines = css.split('\n')
              // And then we change the code for individual style definitions
              // this takes the export const = <#def>  value and attaches in in the component definition for the style
              // i.e. const css = button will be const css = vn({ ... })
              for (const styleImport of styleImports) {
                const styleImportStart = cssLines.findIndex((line) => line.includes(`export const ${styleImport}`))
                const styleImportEnd = findClosure(cssLines, styleImportStart)
                const styleDeclarationLineIndex = lines.findIndex(
                  (line) => line.includes(`cn(${styleImport}`) || line.includes(`vn(${styleImport}`)
                )
                if (styleDeclarationLineIndex === -1) {
                  throw new Error(`No style declaration found in ${filePath}`)
                }

                const styleValue = extractContentFromClosure(
                  cssLines.slice(styleImportStart, styleImportEnd + 1).join('\n')
                )

                const regex = new RegExp(`\\b${styleImport}\\b`)
                console.debug({ cssLines, styleImportStart, styleImportEnd, styleValue })
                lines[styleDeclarationLineIndex] = lines[styleDeclarationLineIndex].replace(regex, styleValue)
              }
              return {
                content: lines.join('\n'),
                name: file.split('.')[0],
                framework,
                style: styleFrameworkName,
              }
            })
          )
        })
      ).then((res) => res.flat())
      // Final step, we need to write the updated content to the files to the /generated directory 🎉
      // technically not ideal step, but we check for initialization (which means creating index file and package.json)
      // for each component sice we need to only do it once
      const didInitialize: Record<string, Record<string, Record<string, true>>> = {}
      return Promise.all(
        componentFiles.map(async (file) => {
          const jsonContent = JSON.parse(packageJson) as PackageJSON
          const component = jsonContent.name.split('.')[0]
          const generatedDirPath = join(process.cwd(), '../../generated', file.framework, file.style, component)
          // If we did not initialize the framework/style combo, we do it now
          if (!didInitialize[file.framework]?.[file.style]?.[component]) {
            if (!existsSync(generatedDirPath)) {
              await mkdir(generatedDirPath, { recursive: true })
            }
            await writeFile(join(generatedDirPath, 'package.json'), packageJson)
            await writeFile(join(generatedDirPath, `index${jsonContent.extension}`), indexContent)
            didInitialize[file.framework] = {}
            didInitialize[file.framework][file.style] = {}
            didInitialize[file.framework][file.style][component] = true
          }
          // And write the updated content to the file
          await writeFile(join(generatedDirPath, `${file.name}${jsonContent.extension}`), file.content)
        })
      )
    })
  )
}

/**
 * Extracts the imports for any import statements
 * @param importStatement String of the import statement
 * @returns Array of imports
 * @example extractImports("import { vn, cn } from '@/lib/style'") => ['vn', 'cn']
 */
function extractImports(importStatement: string): string[] {
  const importRegex = /import\s*{([^}]+)}\s*from\s*['"][^'"]+['"]/
  const match = importStatement.match(importRegex)
  if (match && match[1]) {
    return match[1].split(',').map((item) => item.trim())
  }
  return []
}

/**
 * Finds the closure of a given code block.
 * @param lines array of lines
 * @param start start index
 * @returns closure end index
 */
function findClosure(lines: string[], start: number) {
  const bracketStack = {
    '{': 0,
    '(': 0,
  }
  for (let i = start; i < lines.length; i++) {
    const line = lines[i]
    for (const char of line) {
      if (char === '{') {
        bracketStack['{'] += 1
      }
      if (char === '}') {
        bracketStack['{'] -= 1
      }
      if (char === '(') {
        bracketStack['('] += 1
      }
      if (char === ')') {
        bracketStack['('] -= 1
      }
    }
    if (bracketStack['{'] === 0 && bracketStack['('] === 0) {
      return i
    }
  }
  throw new Error('No closure found')
}

/**
 * Extracts the content between the outermost parentheses of a given string.
 * @param str - The input string containing content within parentheses.
 * @returns The extracted content between the outermost parentheses.
 * @throws {Error} If the input string is missing opening or closing parentheses.
 */
function extractContentFromClosure(str: string): string {
  // Find the index of the first opening parenthesis
  const openParenIndex: number = str.indexOf('(')

  // Find the index of the last closing parenthesis
  const closeParenIndex: number = str.lastIndexOf(')')

  // Check if both parentheses are found
  if (openParenIndex === -1 || closeParenIndex === -1) {
    throw new Error('Invalid input: missing parentheses')
  }

  // Extract the content between the parentheses
  const content: string = str.substring(openParenIndex + 1, closeParenIndex)

  // Remove any leading or trailing whitespace
  return content.trim()
}

// This line runs the program: ▷
main()
