import pc from "picocolors"

const FRAMEWORK_COLORS = [
  pc.cyan,
  pc.green,
  pc.blue,
  pc.yellow,
  pc.magenta,
  pc.red,
  pc.inverse,
]

function pickFrameworkColor(framework: string): (value: string) => string {
  const name = framework.toLowerCase()

  if (name.includes("react")) return pc.cyanBright
  if (name.includes("vue")) return pc.greenBright
  if (name.includes("solid")) return pc.blue
  if (name.includes("svelte")) return pc.yellow
  if (name.includes("astro")) return pc.magentaBright
  if (name.includes("angular")) return pc.redBright
  if (name.includes("preact")) return pc.cyan
  if (name.includes("qwik")) return pc.magenta

  let hash = 0
  for (const char of framework) {
    hash = (hash << 5) - hash + char.charCodeAt(0)
    hash |= 0
  }

  return FRAMEWORK_COLORS[Math.abs(hash) % FRAMEWORK_COLORS.length] ?? pc.cyan
}

export function formatPath(path: string): string {
  return pc.cyan(path)
}

export function dimPath(path: string): string {
  return pc.dim(pc.gray(path))
}

export function formatFramework(framework: string): string {
  return pickFrameworkColor(framework)(framework)
}

export const log = {
  section(title: string): void {
    console.info(`\n${pc.bold(title)}`)
  },
  item(message: string): void {
    console.info(`  • ${message}`)
  },
  dimItem(message: string): void {
    console.info(`    ${dimPath(message)}`)
  },
  warn(message: string): void {
    console.warn(`  • ${pc.yellow(message)}`)
  },
  error(message: string, error?: unknown): void {
    if (error !== undefined) {
      console.error(`  • ${pc.red(message)}`, error)
      return
    }
    console.error(`  • ${pc.red(message)}`)
  },
}
