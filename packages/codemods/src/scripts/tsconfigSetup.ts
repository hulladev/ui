import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { createChanges } from '../changes'
import { jsonToText } from '../format'
import type { Codemod } from '../types'

export async function tsConfigSetup(opts: { path: string; src: string; alias: string }): Promise<Codemod> {
  const { path, src, alias } = opts
  const name = 'tsconfigSetup'
  const description = 'Setup tsconfig.json with paths'
  const codemod = {
    name,
    description,
    path,
  }
  const compilerOptions = {
    baseUrl: '.',
    paths: {
      [`${alias}*`]: [`${src}*`],
    },
  }
  let tsconfigRaw = ''
  // Check if tsconfig exists
  if (existsSync(path)) {
    tsconfigRaw = await readFile(path, 'utf-8')
    const tsconfig = JSON.parse(tsconfigRaw)
    // If compilerOptions exists just add the paths
    if (tsconfig.compilerOptions) {
      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = compilerOptions.paths
      }
      if (!tsconfig.compilerOptions.baseUrl) {
        tsconfig.compilerOptions.baseUrl = compilerOptions.baseUrl
      }
      const lines = await createChanges(tsconfigRaw, jsonToText(tsconfig))
      return {
        ...codemod,
        lines,
        hasChanges: lines.some((line) => line.status !== 'unchanged'),
        run: () => writeFile(path, JSON.stringify(tsconfig, null, 2), { flag: 'w' }),
      }
    } else {
      // compilerOptions does not exist, create it
      tsconfig.compilerOptions = compilerOptions
      const lines = await createChanges(tsconfigRaw, jsonToText(tsconfig))
      return {
        ...codemod,
        lines,
        hasChanges: lines.some((line) => line.status !== 'unchanged'),
        run: () => writeFile(path, JSON.stringify(tsconfig, null, 2), { flag: 'w' }),
      }
    }
  }
  // File not created just create the base template
  const lines = await createChanges(tsconfigRaw, jsonToText({ compilerOptions }))
  return {
    ...codemod,
    lines,
    hasChanges: lines.some((line) => line.status !== 'unchanged'),
    run: () =>
      writeFile(
        path,
        JSON.stringify(
          {
            compilerOptions,
          },
          null,
          2
        ),
        { flag: 'wx' }
      ),
  }
}
