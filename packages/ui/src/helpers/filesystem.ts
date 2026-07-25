import { createHash, randomUUID } from "node:crypto"
import { constants } from "node:fs"
import { access, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises"
import { basename, dirname, join, relative } from "node:path"
import { toPosixPath } from "./paths"

const IGNORED_TREE_ENTRIES = new Set([".DS_Store", ".turbo", "node_modules"])

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function createStagingDirectory(outputRoot: string): Promise<string> {
  const parent = dirname(outputRoot)
  await mkdir(parent, { recursive: true })
  return mkdtemp(join(parent, `.${basename(outputRoot)}.staging-`))
}

export async function writeText(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, "utf8")
}

export async function listFiles(root: string): Promise<string[]> {
  if (!(await pathExists(root))) return []
  const files: string[] = []

  const walk = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (IGNORED_TREE_ENTRIES.has(entry.name)) continue
      const path = join(directory, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (entry.isFile() || entry.isSymbolicLink()) files.push(path)
    }
  }

  await walk(root)
  return files
}

export async function hashFile(path: string): Promise<string> {
  return createHash("sha256")
    .update(await readFile(path))
    .digest("hex")
}

export async function hashTree(root: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  for (const path of await listFiles(root)) {
    result[toPosixPath(relative(root, path))] = await hashFile(path)
  }
  return result
}

export async function compareTrees(expectedRoot: string, actualRoot: string): Promise<string[]> {
  const [expected, actual] = await Promise.all([hashTree(expectedRoot), hashTree(actualRoot)])
  const differences: string[] = []

  for (const path of Object.keys(expected).sort()) {
    if (!(path in actual)) differences.push(`missing ${path}`)
    else if (expected[path] !== actual[path]) differences.push(`changed ${path}`)
  }
  for (const path of Object.keys(actual).sort()) {
    if (!(path in expected)) differences.push(`unexpected ${path}`)
  }
  return differences
}

export async function replaceTreeAtomically(
  stagingRoot: string,
  outputRoot: string
): Promise<void> {
  const backupRoot = `${outputRoot}.backup-${randomUUID()}`
  const hadOutput = await pathExists(outputRoot)

  if (hadOutput) await rename(outputRoot, backupRoot)
  try {
    await rename(stagingRoot, outputRoot)
  } catch (error) {
    if (hadOutput && (await pathExists(backupRoot))) await rename(backupRoot, outputRoot)
    throw error
  }

  if (hadOutput) await rm(backupRoot, { force: true, recursive: true })
}

export async function removeTree(path: string): Promise<void> {
  if (await pathExists(path)) await rm(path, { force: true, recursive: true })
}
