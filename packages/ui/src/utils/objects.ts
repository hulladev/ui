import { resolve } from "node:path"

export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj)
}

export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function validateFrameworkPath(
  basepath: string,
  rootDir: string,
  framework: string,
  frameworkPath: string
): void {
  const resolvedRoot = resolve(basepath, rootDir)
  const resolvedFramework = resolve(basepath, rootDir, frameworkPath)
  
  // Check if framework path is within rootDir
  if (!resolvedFramework.startsWith(resolvedRoot)) {
    throw new Error(
      `Framework '${framework}' resolves to a path outside rootDir.\n` +
      `  Framework path: ${resolvedFramework}\n` +
      `  RootDir: ${resolvedRoot}`
    )
  }
}
