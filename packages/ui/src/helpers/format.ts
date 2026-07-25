import { extname } from "node:path"
import { format } from "prettier"
import * as astroPlugin from "prettier-plugin-astro"
import * as sveltePlugin from "prettier-plugin-svelte"

const SUPPORTED_EXTENSIONS = new Set([
  ".astro",
  ".cjs",
  ".css",
  ".cts",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".mts",
  ".svelte",
  ".ts",
  ".tsx",
  ".vue",
])

export async function formatGeneratedSource(path: string, content: string): Promise<string> {
  if (!SUPPORTED_EXTENSIONS.has(extname(path).toLowerCase())) return content
  return format(content, {
    filepath: path,
    plugins: [astroPlugin, sveltePlugin],
    printWidth: 100,
    semi: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
  })
}
