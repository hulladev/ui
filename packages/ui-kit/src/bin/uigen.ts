#!/usr/bin/env node

import { flag, parser, positional } from "@hulla/args"
import { resolve } from "node:path"
import { cwd } from "node:process"
import { pathToFileURL } from "node:url"

const cli = parser({
  name: "uigen",
  arguments: [
    positional({ name: "configPath", description: "The path to the config file" }),
    flag({ name: "help", description: "Show help" }),
  ],
  settings: {
    startIndex: 2,
  },
})

async function main() {
  const result = cli.parse(process.argv)

  if (!result.arguments.configPath.value) {
    console.error("Usage: uigen <config-file>")
    console.error("Example: uigen ./src/ui.ts")
    process.exit(1)
  }

  const configPath = resolve(cwd(), result.arguments.configPath.value)

  try {
    console.log(`Loading config from: ${configPath}`)
    const config = await import(pathToFileURL(configPath).toString())
    await config.ui.build()
    console.log("\n✅ Build completed successfully!")
  } catch (error) {
    console.error("\n❌ Build failed:", error)
    process.exit(1)
  }
}

main()
