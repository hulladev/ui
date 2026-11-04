import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { preProcessFile } from "typescript"

/** Follow emitted imports, including aliases, type imports and support-file cycles. */
export async function supportDependencies(outputDir: string, paths: string[]) {
  const files = new Set(paths.map((path) => resolve(path)))
  const graph = new Map<string, string[]>()

  for (const path of files) {
    if (!/\.(?:[cm]?[jt]sx?|astro|vue|svelte)$/.test(path)) continue
    const content = await readFile(path, "utf8")
    const scripts = /\.astro$/.test(path)
      ? [
          content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "",
          ...[...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(
            (match) => match[1] ?? ""
          ),
        ]
      : /\.(vue|svelte)$/.test(path)
        ? [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(
            (match) => match[1] ?? ""
          )
        : /\.[cm]?[jt]sx?$/.test(path)
          ? [content]
          : []
    const imports = scripts.flatMap((script) => preProcessFile(script, true, true).importedFiles)
    const dependencies: string[] = []
    for (const { fileName } of imports) {
      const target = fileName.startsWith("@/")
        ? resolve(outputDir, fileName.slice(2))
        : fileName.startsWith(".")
          ? resolve(dirname(path), fileName)
          : undefined
      if (!target) continue
      const stem = target.replace(/\.[cm]?jsx?$/, "")
      const candidates = [
        target,
        ...[".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"].flatMap((ext) => [
          stem + ext,
          join(target, "index" + ext),
        ]),
      ]
      const dependency = candidates.find((candidate) => files.has(candidate))
      if (dependency) dependencies.push(dependency)
    }
    graph.set(path, dependencies)
  }

  return (roots: string[]): Set<string> => {
    const visited = new Set<string>()
    const pending = roots.map((path) => resolve(path))
    while (pending.length) {
      const path = pending.pop()!
      if (visited.has(path)) continue
      visited.add(path)
      pending.push(...(graph.get(path) ?? []))
    }
    return visited
  }
}
