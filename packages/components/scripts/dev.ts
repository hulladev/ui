import { watch } from "node:fs"
import { relative, resolve } from "node:path"
import { cwd, exit } from "node:process"

const root = cwd()
const sourceDir = resolve(root, "src")
const ignoredFilePatterns = [/^\.DS_Store$/, /~$/, /^\.swp$/, /^\.swx$/, /^\.#/]
const debounceMs = 180

let isBuilding = false
let queued = false
let pendingTimer: ReturnType<typeof setTimeout> | null = null
const changedPaths = new Set<string>()

function shouldIgnoreFile(path: string): boolean {
  const filename = path.split("/").pop() ?? path
  return ignoredFilePatterns.some((pattern) => pattern.test(filename))
}

function queueBuild(changedPath?: string): void {
  if (typeof changedPath === "string" && !shouldIgnoreFile(changedPath)) {
    changedPaths.add(changedPath)
  }

  if (pendingTimer) {
    clearTimeout(pendingTimer)
  }

  pendingTimer = setTimeout(() => {
    pendingTimer = null
    runBuild().catch((error) => {
      console.error("[components:dev] unexpected build error", error)
    })
  }, debounceMs)
}

function formatChangedSummary(): string {
  if (changedPaths.size === 0) {
    return "manual trigger"
  }

  const all = Array.from(changedPaths)
  changedPaths.clear()

  if (all.length <= 3) {
    return all.join(", ")
  }

  const preview = all.slice(0, 3).join(", ")
  return `${preview} (+${all.length - 3} more)`
}

async function runBuild(): Promise<void> {
  if (isBuilding) {
    queued = true
    return
  }

  isBuilding = true
  const startedAt = Date.now()
  const reason = formatChangedSummary()
  console.log(`[components:dev] rebuilding generated output (${reason})`)

  const proc = Bun.spawn(["bun", "run", "build"], {
    cwd: root,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "ignore",
  })

  const exitCode = await proc.exited
  const elapsed = Date.now() - startedAt

  if (exitCode === 0) {
    console.log(`[components:dev] build finished in ${elapsed}ms`)
  } else {
    console.error(`[components:dev] build failed in ${elapsed}ms (exit ${exitCode})`)
  }

  isBuilding = false

  if (queued) {
    queued = false
    await runBuild()
  }
}

async function main(): Promise<void> {
  console.log(`[components:dev] watching ${relative(root, sourceDir) || "src"}`)
  await runBuild()

  watch(
    sourceDir,
    {
      recursive: true,
      persistent: true,
    },
    (_eventType, filename) => {
      if (!filename) {
        queueBuild()
        return
      }

      const normalized = filename.toString().replace(/\\/g, "/")
      queueBuild(normalized)
    }
  )
}

main().catch((error) => {
  console.error("[components:dev] watcher failed", error)
  exit(1)
})
