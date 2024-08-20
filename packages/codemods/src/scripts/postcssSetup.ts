import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { apiFetch, httpsFetch, type Protocol } from '../../../cli/src/lib/git'
import { createChanges } from '../changes'
import type { Codemod } from '../types'

export async function postcssSetup(opts: { path: string; protocol: Protocol }): Promise<Codemod> {
  const { path, protocol } = opts
  const codemod = {
    name: 'postcssSetup',
    description: 'Setup postcss.config.js',
    path,
  }
  const gitPostcss =
    protocol === 'api'
      ? await apiFetch(protocol)(
          `gh api repos/hulladev/ui/contents/packages/ui/downloads/tailwind/postcss.config.js`,
          'text',
          '-H "Accept: application/vnd.github.v3.raw"'
        )
      : await httpsFetch(protocol)(
          'https://raw.githubusercontent.com/hulladev/ui/master/packages/ui/downloads/tailwind/postcss.config.js',
          'text',
          { headers: { Accept: 'application/vnd.github.v3.raw' } }
        )

  if (gitPostcss.err) {
    console.error(
      `Unable to fetch default @hulla/ui postcss.config.js. This is a github error: ${gitPostcss.err}. If it persists, please open an issue.`
    )
    process.exit(1)
  }
  let postcssConfig = gitPostcss.res
  if (existsSync(path)) {
    const userPostcssConfig = await readFile(path, { encoding: 'utf-8' })
      .then((res) => res.toString())
      .catch((err) => {
        console.error(`Failed to read ${path}. Error: ${err.message}`)
        process.exit(1)
      })
    // Extract the JSON-like object from the module.exports assignment
    const jsonString = (postcss: string) =>
      postcss
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
        .replace(/module\.exports\s*=\s*/, '') // Remove module.exports assignment
        .replace(/(\w+):/g, '"$1":') // Add quotes around keys
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
        .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets

    try {
      const userConfigJson = JSON.parse(jsonString(userPostcssConfig))
      const defaultConfigJson = JSON.parse(jsonString(postcssConfig))
      const mergedConfig = { ...defaultConfigJson, ...userConfigJson }
      if (!mergedConfig.plugins) {
        mergedConfig.plugins = defaultConfigJson.plugins
      }
      if (!mergedConfig.plugins.tailwindcss) {
        mergedConfig.plugins.tailwindcss = defaultConfigJson.plugins.tailwindcss
      }
      if (!mergedConfig.plugins.autoprefixer) {
        mergedConfig.plugins.autoprefixer = defaultConfigJson.plugins.autoprefixer
      }
      // Convert mergedConfig to string
      const mergedConfigString = `module.exports = ${JSON.stringify(mergedConfig, null, 2)};`

      // Replace the content inside module.exports = {} with mergedConfigString
      const [beforeModuleExports, afterModuleExports] = userPostcssConfig.split(/module\.exports\s*=\s*{[\s\S]*?}/)
      postcssConfig = `${beforeModuleExports ?? ''} ${mergedConfigString} ${afterModuleExports ?? ''}`
      const lines = await createChanges(userPostcssConfig, postcssConfig)
      return {
        ...codemod,
        lines,
        hasChanges: lines.some((line) => line.status !== 'unchanged'),
        run: () => writeFile(path, postcssConfig, { flag: 'w' }),
      }
    } catch (error) {
      console.error('Failed to parse user config:', error)
    }

    const lines = await createChanges(userPostcssConfig, postcssConfig)
    return {
      ...codemod,
      lines,
      hasChanges: lines.some((line) => line.status !== 'unchanged'),
      run: () => writeFile(path, postcssConfig, { flag: 'w' }),
    }
  }

  const lines = await createChanges('', postcssConfig)
  return {
    ...codemod,
    lines,
    hasChanges: lines.some((line) => line.status !== 'unchanged'),
    run: () => writeFile(path, postcssConfig, { flag: 'w' }),
  }
}
