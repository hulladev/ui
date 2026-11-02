import { expect, test } from "bun:test"
import { readFile, readdir } from "node:fs/promises"
import { dirname, relative, resolve } from "node:path"
import { preProcessFile } from "typescript"

test("native component recipes keep independently relocated support imports aliased", async () => {
  const root = resolve(import.meta.dir, "../src/react-native")
  const families = (await readdir(root, { withFileTypes: true })).filter(
    (entry) => entry.isDirectory() && entry.name !== "lib"
  )
  const files = (
    await Promise.all(
      families.map(async (family) =>
        (await readdir(resolve(root, family.name)))
          .filter((name) => /\.tsx?$/.test(name))
          .map((name) => resolve(root, family.name, name))
      )
    )
  ).flat()
  for (const file of files) {
    for (const dependency of preProcessFile(await readFile(file, "utf8"), true).importedFiles) {
      if (!dependency.fileName.startsWith(".")) continue
      const target = relative(root, resolve(dirname(file), dependency.fileName))
      expect(
        target.startsWith("lib/"),
        `${relative(root, file)}: use @/lib/ for ${dependency.fileName}; the CLI installs support files separately from component families`
      ).toBe(false)
    }
  }
})
