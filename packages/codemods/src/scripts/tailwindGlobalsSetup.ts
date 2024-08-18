import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { apiFetch, httpsFetch, type Protocol } from '../../../cli/src/lib/git'
import { createChanges } from '../changes'
import type { Codemod } from '../types'

export async function tailwindGlobalsSetup(opts: { protocol: Protocol; path: string }): Promise<Codemod> {
  const { protocol, path } = opts
  const codemod = {
    name: 'tailwindGlobalsSetup',
    description: 'Setup tailwind.config.ts',
    path,
  }
  const gitGlobals =
    protocol === 'api'
      ? await apiFetch(protocol)(
          `gh api repos/hulladev/ui/contents/packages/ui/downloads/tailwind/globals.css`,
          'text',
          '-H "Accept: application/vnd.github.v3.raw"'
        )
      : await httpsFetch(protocol)(
          'https://raw.githubusercontent.com/hulladev/ui/master/packages/ui/downloads/tailwind/globals.css',
          'text',
          { headers: { Accept: 'application/vnd.github.v3.raw' } }
        )

  if (gitGlobals.err) {
    console.error(
      `Unable to fetch default @hulla/ui globals.base.css. This is a github error: ${gitGlobals.err}. If it persists, please open an issue.`
    )
    process.exit(1)
  }

  const globalCss = gitGlobals.res

  if (existsSync(path)) {
    const userGlobalCss = await readFile(path, { encoding: 'utf-8' })
      .then((res) => res.toString())
      .catch((err) => {
        console.error(`Failed to read ${path}. Error: ${err.message}`)
        process.exit(1)
      })
    const lines = await createChanges(userGlobalCss, globalCss)
    return {
      ...codemod,
      lines,
      hasChanges: lines.some((line) => line.status !== 'unchanged'),
      run: () => writeFile(path, globalCss, { flag: 'w' }),
    } as Codemod
  }
  const lines = await createChanges('', globalCss)
  return {
    ...codemod,
    lines,
    hasChanges: lines.some((line) => line.status !== 'unchanged'),
    run: () => writeFile(path, globalCss, { flag: 'w' }),
  } as Codemod
}
