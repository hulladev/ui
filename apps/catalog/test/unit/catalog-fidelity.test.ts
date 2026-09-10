import { expect, test } from "bun:test"
import { readFileSync, readdirSync } from "node:fs"
import { basename, resolve } from "node:path"

const root = resolve(import.meta.dir, "../..")
const previews = resolve(root, "src/components/previews")

// Layout belongs to the example. Component surfaces, typography, internal spacing,
// and interaction states must be supplied by the installed public component.
const layout =
  /^(?:(?:max-\[[^ ]+\]|sm|md|lg):)?(?:w-|max-w-|min-w-|h-|max-h-|min-h-|m[trblxyse]?-|col-span-|justify-self-|self-|shrink-|z-|top-|right-|bottom-|left-)|^(?:absolute|relative|group|overflow-hidden|draggable-panel|resizable-panel)$/

const examples = [
  ...readdirSync(previews)
    .filter((file) => file.endsWith(".astro"))
    .map((file) => resolve(previews, file)),
  resolve(root, "src/pages/showcase.astro"),
]
for (const path of examples) {
  const file = basename(path)
  test(`${file} uses public component appearance`, () => {
    const source = readFileSync(path, "utf8")
    const imports = new Set(
      [...source.matchAll(/import (\w+) from "@\/ui\//g)].map((match) => match[1])
    )
    expect(source).not.toContain("customized=")
    for (const tag of source.matchAll(/<([A-Z]\w*)\b(?:"[^"]*"|'[^']*'|[^>])*?>/g)) {
      if (!imports.has(tag[1])) continue
      expect(tag[0], `${file}: inline styling`).not.toMatch(/\sstyle=/)
      // Skeleton geometry and its documented animation variable are the primitive's API.
      if (tag[1] === "Skeleton") continue
      expect(tag[0], `${file}: dynamic class overrides`).not.toMatch(/\sclass(?::list)?=\{/)
      const classes = tag[0].match(/\sclass="([^"]*)"/)?.[1]?.split(/\s+/) ?? []
      for (const className of classes) {
        // These selectors only switch user-supplied folder illustrations with native tree state.
        if (tag[1] === "TreeView" && /^\[&.*>\.tree-folder-(closed|open)\]:hidden$/.test(className))
          continue
        const tableAlignment =
          ["TableHead", "TableCell"].includes(tag[1]!) && className === "text-right"
        expect(
          layout.test(className) || tableAlignment,
          `${file}: ${tag[1]} class="${className}"`
        ).toBe(true)
      }
    }
  })
}

test("catalog imports the shipping theme unchanged", () => {
  const canonical = readFileSync(resolve(root, "../../packages/components/src/styles.css"), "utf8")
  for (const framework of ["astro", "react", "solid"]) {
    expect(readFileSync(resolve(root, `../../generated/${framework}/styles.css`), "utf8")).toBe(
      canonical
    )
  }
  expect(readFileSync(resolve(root, "src/styles/catalog.css"), "utf8")).toStartWith(
    '@import "../../../../generated/astro/styles.css";'
  )
})
