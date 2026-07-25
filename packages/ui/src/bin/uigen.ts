#!/usr/bin/env node

import { resolve } from "node:path"
import { cwd } from "node:process"
import { parseArgs } from "node:util"
import { createJiti } from "jiti"
import type { BuildOptions, UILibraryAPI } from "../types.public"

declare const __PACKAGE_VERSION__: string

const usage = `uigen - deterministic Hulla UI library generator

Usage:
  uigen [options] <config-file>

Options:
  --check       Verify committed output without changing files
  --quiet       Suppress the build summary
  --help, -h    Show this help
  --version, -v Show the installed version

Examples:
  uigen ./src/ui.ts
  uigen --check ./src/ui.ts
`

function packageVersion(): string {
  return __PACKAGE_VERSION__
}

function isLibraryApi(value: unknown): value is UILibraryAPI<readonly string[]> {
  return (
    value !== null &&
    typeof value === "object" &&
    "build" in value &&
    typeof (value as { build?: unknown }).build === "function"
  )
}

async function loadLibrary(configPath: string): Promise<UILibraryAPI<readonly string[]>> {
  const jiti = createJiti(resolve(cwd(), ".uigen-loader.mjs"), { interopDefault: true })
  const loaded = (await jiti.import(configPath)) as {
    default?: unknown
    ui?: unknown
  }
  const library = loaded.ui ?? loaded.default
  if (!isLibraryApi(library)) {
    throw new Error(
      `Config must export the result of createLibrary(...) as either "ui" or the default export: ${configPath}`
    )
  }
  return library
}

async function main(): Promise<void> {
  const parsed = parseArgs({
    allowPositionals: true,
    options: {
      check: { type: "boolean" },
      help: { short: "h", type: "boolean" },
      quiet: { type: "boolean" },
      version: { short: "v", type: "boolean" },
    },
    strict: true,
  })

  if (parsed.values.help) {
    process.stdout.write(usage)
    return
  }
  if (parsed.values.version) {
    process.stdout.write(`${packageVersion()}\n`)
    return
  }

  const requestedPath = parsed.positionals[0]
  if (!requestedPath || parsed.positionals.length > 1) {
    process.stderr.write(usage)
    process.exitCode = 2
    return
  }

  const configPath = resolve(cwd(), requestedPath)
  const library = await loadLibrary(configPath)
  const options: BuildOptions = {
    mode: parsed.values.check ? "check" : "write",
    quiet: parsed.values.quiet,
  }
  await library.build(options)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`uigen: ${message}\n`)
  process.exitCode = 1
})
