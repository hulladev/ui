import { isAbsolute } from "node:path"
import type { Frameworks, OutputDirs } from "../types.public"

export function withRootDir<F extends Frameworks>(
  rootDir: string,
  frameworks: Record<F[number], string>
): OutputDirs<F> {
  for (const [framework, path] of Object.entries(frameworks) as [string, string][]) {
    if (isAbsolute(path)) {
      throw new Error(`Framework path for '${framework}' must be relative. Received: ${path}`)
    }
  }

  return { rootDir, frameworks }
}
