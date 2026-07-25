import { resolve } from "node:path"

type Command = {
  args: string[]
  label: string
}

const commands: Command[] = [
  {
    label: "shared TypeScript",
    args: ["bunx", "tsc", "--noEmit", "-p", "src/+css/tsconfig.json"],
  },
  {
    label: "React TypeScript",
    args: ["bunx", "tsc", "--noEmit", "-p", "src/react/tsconfig.json"],
  },
  {
    label: "Solid TypeScript",
    args: ["bunx", "tsc", "--noEmit", "-p", "src/solid/tsconfig.json"],
  },
  {
    label: "Astro",
    args: ["bunx", "astro", "check", "--root", "src/astro"],
  },
  {
    label: "Svelte",
    args: ["bunx", "svelte-check", "--tsconfig", "src/svelte/tsconfig.json"],
  },
  {
    label: "Vue",
    args: ["bunx", "vue-tsc", "--noEmit", "-p", "src/vue/tsconfig.json"],
  },
]

for (const command of commands) {
  console.log(`\n[types] ${command.label}`)
  const child = Bun.spawn(command.args, {
    cwd: resolve(import.meta.dir, ".."),
    stderr: "inherit",
    stdin: "ignore",
    stdout: "inherit",
  })
  const exitCode = await child.exited
  if (exitCode !== 0) process.exit(exitCode)
}
