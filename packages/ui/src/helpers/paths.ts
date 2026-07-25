import { isAbsolute, parse, relative, resolve, sep } from "node:path"

export function isPathInside(root: string, candidate: string): boolean {
  const relationship = relative(root, candidate)
  return (
    relationship === "" ||
    (!relationship.startsWith(`..${sep}`) && relationship !== ".." && !isAbsolute(relationship))
  )
}

export function resolveInside(root: string, candidate: string, label: string): string {
  if (isAbsolute(candidate)) {
    throw new Error(`${label} must be relative. Received: ${candidate}`)
  }

  const resolved = resolve(root, candidate)
  if (!isPathInside(root, resolved)) {
    throw new Error(`${label} must stay inside ${root}. Received: ${candidate}`)
  }

  return resolved
}

export function assertSafeOutputRoot(outputRoot: string, basePath: string): void {
  if (parse(outputRoot).root === outputRoot) {
    throw new Error(`Refusing to use a filesystem root as outputDir: ${outputRoot}`)
  }

  if (isPathInside(outputRoot, basePath)) {
    throw new Error(
      `outputDirs.rootDir cannot contain the library source directory.\n` +
        `  output: ${outputRoot}\n` +
        `  source: ${basePath}`
    )
  }
}

export function toPosixPath(path: string): string {
  return path.split(sep).join("/")
}
