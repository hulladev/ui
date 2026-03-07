import type { Frameworks, OutputDirs } from "../types.public"
import { entries } from "../utils/objects"

export function withRootDir<F extends Frameworks>(
  rootDir: string,
  frameworks: Record<F[number], string>
): OutputDirs<F> {
  // Validate all paths are relative (must start with './')
  for (const [framework, path] of entries(frameworks)) {
    if (!path.startsWith("./")) {
      throw new Error(
        `Framework path for '${String(framework)}' must be relative (start with './'). Got: '${path}'`
      )
    }
  }

  return { rootDir, frameworks }
}
