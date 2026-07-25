import { afterEach, describe, expect, test } from "bun:test"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"

const packageRoot = resolve(import.meta.dir, "..")
const temporaryRoots: string[] = []

async function write(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, "utf8")
}

async function runNode(
  args: string[]
): Promise<{ exitCode: number; stderr: string; stdout: string }> {
  const child = Bun.spawn(["node", ...args], {
    cwd: packageRoot,
    stderr: "pipe",
    stdout: "pipe",
  })
  const [exitCode, stderr, stdout] = await Promise.all([
    child.exited,
    new Response(child.stderr).text(),
    new Response(child.stdout).text(),
  ])
  return { exitCode, stderr, stdout }
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { force: true, recursive: true }))
  )
})

describe("published package surface", () => {
  test("loads through ESM and CommonJS", async () => {
    const esm = await runNode([
      "--input-type=module",
      "--eval",
      `import * as ui from "./dist/index.mjs"; console.log(Object.keys(ui).sort().join(","))`,
    ])
    expect(esm.exitCode).toBe(0)
    expect(esm.stdout).toContain("createLibrary")

    const commonJs = await runNode([
      "--eval",
      `console.log(Object.keys(require("./dist/index.js")).sort().join(","))`,
    ])
    expect(commonJs.exitCode).toBe(0)
    expect(commonJs.stdout).toContain("createLibrary")
  })

  test("CLI help and version are successful and do not require a config", async () => {
    const help = await runNode(["./dist/bin/uigen.js", "--help"])
    expect(help.exitCode).toBe(0)
    expect(help.stdout).toContain("uigen - deterministic")
    expect(help.stderr).toBe("")

    const version = await runNode(["./dist/bin/uigen.js", "--version"])
    expect(version.exitCode).toBe(0)
    const packageJson = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8")) as {
      version: string
    }
    expect(version.stdout.trim()).toBe(packageJson.version)
  })

  test("CLI loads a TypeScript default export and generates output", async () => {
    const root = await mkdtemp(join(tmpdir(), "hulla-ui-cli-test-"))
    temporaryRoots.push(root)
    const configPath = join(root, "ui.ts")
    const distImport = new URL("../dist/index.mjs", import.meta.url).href

    await write(join(root, "src/react/button/package.json"), `{ "private": true }\n`)
    await write(join(root, "src/react/button/button.react.ts"), `export const button = true\n`)
    await write(
      configPath,
      `import { createLibrary } from ${JSON.stringify(distImport)}\n` +
        `import { fileURLToPath } from "node:url"\n` +
        `export default createLibrary({\n` +
        `  name: "@fixture/cli",\n` +
        `  version: "1.0.0",\n` +
        `  basePath: fileURLToPath(new URL(".", import.meta.url)),\n` +
        `  frameworks: ["react"],\n` +
        `  inputDirs: { react: "./src/react" },\n` +
        `  outputDirs: { rootDir: "./generated", frameworks: { react: "react" } },\n` +
        `})\n`
    )

    const result = await runNode(["./dist/bin/uigen.js", "--quiet", configPath])
    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe("")
    expect(await readFile(join(root, "generated/react/button/button.ts"), "utf8")).toContain(
      "export const button = true"
    )
  })
})
