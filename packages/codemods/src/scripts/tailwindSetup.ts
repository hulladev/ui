import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { apiFetch, httpsFetch, type Protocol } from '../../../cli/src/lib/git'
import { createChanges } from '../changes'
import type { Codemod } from '../types'

export async function tailwindSetup(opts: { path: string; protocol: Protocol }): Promise<Codemod> {
  const { path, protocol } = opts
  const codemod = {
    name: 'tailwindSetup',
    description: 'Setup tailwind.config.ts',
    path,
  }
  const gitTw =
    protocol === 'api'
      ? await apiFetch(protocol)(
          `gh api repos/hulladev/ui/contents/packages/ui/tailwind.config.base.ts`,
          'text',
          '-H "Accept: application/vnd.github.v3.raw"'
        )
      : await httpsFetch(protocol)(
          'https://raw.githubusercontent.com/hulladev/ui/master/packages/ui/tailwind.config.base.ts',
          'text',
          { headers: { Accept: 'application/vnd.github.v3.raw' } }
        )
  if (gitTw.err) {
    console.error(
      `Unable to fetch default @hulla/ui tailwind.config.ts. This is a github error: ${gitTw.err}. If it persists, please open an issue.`
    )
    process.exit(1)
  }
  const tailwindConfig = gitTw.res

  if (existsSync(path)) {
    const userTailwindConfig = await readFile(path, { encoding: 'utf-8' })
      .then((res) => res.toString())
      .catch((err) => {
        console.error(`Failed to read ${path}. Error: ${err.message}`)
        process.exit(1)
      })
    const lines = await createChanges(userTailwindConfig, tailwindConfig)
    return {
      ...codemod,
      lines,
      hasChanges: lines.some((line) => line.status !== 'unchanged'),
      run: () => writeFile(path, tailwindConfig, { flag: 'w' }),
    } satisfies Codemod
  }
  const lines = await createChanges('', tailwindConfig)
  return {
    ...codemod,
    lines,
    hasChanges: lines.some((line) => line.status !== 'unchanged'),
    run: () => writeFile(path, tailwindConfig, { flag: 'w' }),
  } satisfies Codemod
}
