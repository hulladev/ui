import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

type Command = {
  args: string[]
  framework: string
  label: string
}

const packageRoot = resolve(import.meta.dir, "..")
const repositoryRoot = resolve(packageRoot, "../..")
const temporaryRoot = await mkdtemp(join(tmpdir(), "hulla-generated-check-"))
const manifest = JSON.parse(
  await readFile(join(repositoryRoot, "generated/ui.manifest.json"), "utf8")
) as {
  library: { components: Record<string, { frameworks: string[] }> }
}
const frameworksWithComponents = new Set(
  Object.values(manifest.library.components).flatMap((component) => component.frameworks)
)

async function run(command: Command): Promise<void> {
  console.log(`\n[generated] ${command.label}`)
  const child = Bun.spawn(command.args, {
    cwd: packageRoot,
    stderr: "inherit",
    stdin: "ignore",
    stdout: "inherit",
  })
  const exitCode = await child.exited
  if (exitCode !== 0)
    throw new Error(`${command.label} validation failed with exit code ${exitCode}`)
}

try {
  await symlink(join(packageRoot, "node_modules"), join(temporaryRoot, "node_modules"), "dir")
  for (const framework of ["astro", "react", "solid", "svelte", "vue"]) {
    await cp(join(repositoryRoot, "generated", framework), join(temporaryRoot, framework), {
      recursive: true,
    })
  }
  await writeFile(
    join(temporaryRoot, "astro", "astro.config.mjs"),
    `import { defineConfig } from "astro/config"\nexport default defineConfig({ srcDir: "." })\n`,
    "utf8"
  )
  await mkdir(join(temporaryRoot, "astro", "pages"), { recursive: true })

  const commands: Command[] = [
    {
      label: "React",
      framework: "react",
      args: ["bunx", "tsc", "--noEmit", "-p", join(temporaryRoot, "react/tsconfig.json")],
    },
    {
      label: "Solid",
      framework: "solid",
      args: ["bunx", "tsc", "--noEmit", "-p", join(temporaryRoot, "solid/tsconfig.json")],
    },
    {
      label: "Astro",
      framework: "astro",
      args: ["bunx", "astro", "check", "--root", join(temporaryRoot, "astro")],
    },
    {
      label: "Svelte",
      framework: "svelte",
      args: ["bunx", "svelte-check", "--tsconfig", join(temporaryRoot, "svelte/tsconfig.json")],
    },
    {
      label: "Vue",
      framework: "vue",
      args: ["bunx", "vue-tsc", "--noEmit", "-p", join(temporaryRoot, "vue/tsconfig.json")],
    },
  ]

  for (const command of commands) {
    if (frameworksWithComponents.has(command.framework)) await run(command)
    else console.log(`\n[generated] ${command.label} skipped (no components)`)
  }
} finally {
  await rm(temporaryRoot, { force: true, recursive: true })
}
