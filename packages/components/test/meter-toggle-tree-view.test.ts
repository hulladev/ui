import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

const generatedPart = (
  framework: "astro" | "react",
  family: "meter" | "toggle" | "tree-view",
  part: string
) => {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/${family}/${part}.${extension}`),
    "utf8"
  )
}

describe("Meter generated contract", () => {
  test("renders the native scalar measurement without replacing its semantics", async () => {
    const sources = await Promise.all([
      generatedPart("astro", "meter", "meter"),
      generatedPart("react", "meter", "meter"),
    ])

    for (const source of sources) {
      expect(source).toContain("<meter")
      expect(source).toContain('data-slot="meter"')
      expect(source).toContain("meter-optimum-value")
      expect(source).not.toContain('role="progressbar"')
    }
  })
})

describe("Toggle generated contract", () => {
  test("keeps every toggle a native pressed-state button", async () => {
    const sources = await Promise.all([
      generatedPart("astro", "toggle", "toggle"),
      generatedPart("react", "toggle", "toggle"),
    ])

    for (const source of sources) {
      expect(source).toContain("<button")
      expect(source).toContain("aria-pressed")
      expect(source).toContain('type = "button"')
      expect(source).toContain('data-slot="toggle"')
    }
  })

  test("supports standalone, single, multiple, and required state without context", async () => {
    const behavior = await readFile(
      resolve(repositoryRoot, "packages/components/src/lib/toggle.ts"),
      "utf8"
    )
    const reactGroup = await generatedPart("react", "toggle", "toggle-group")

    expect(behavior).toContain('root.dataset.type === "multiple"')
    expect(behavior).toContain('root.dataset.required === "true"')
    expect(behavior).toContain("TOGGLE_PRESSED_CHANGE_EVENT")
    expect(behavior).toContain("TOGGLE_GROUP_VALUE_CHANGE_EVENT")
    expect(reactGroup).not.toContain("createContext")
  })
})

describe("Tree View generated contract", () => {
  test("uses native lists with tree, treeitem, and group roles", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [tree, item, group] = await Promise.all([
        generatedPart(framework, "tree-view", "tree-view"),
        generatedPart(framework, "tree-view", "tree-item"),
        generatedPart(framework, "tree-view", "tree-group"),
      ])

      expect(tree).toContain("<ul")
      expect(tree).toContain('"tree"')
      expect(item).toContain("<li")
      expect(item).toContain('"treeitem"')
      expect(group).toContain("<ul")
      expect(group).toContain('"group"')
    }
  })

  test("implements the complete hierarchical keyboard path and stable state hooks", async () => {
    const behavior = await readFile(
      resolve(repositoryRoot, "packages/components/src/lib/tree-view.ts"),
      "utf8"
    )

    for (const key of [
      '"ArrowDown"',
      '"ArrowUp"',
      '"ArrowRight"',
      '"ArrowLeft"',
      '"Home"',
      '"End"',
      '"*"',
      '"Enter"',
    ]) {
      expect(behavior).toContain(key)
    }

    expect(behavior).toContain('item.setAttribute("aria-selected", String(selected))')
    expect(behavior).toContain('item.setAttribute("aria-expanded", String(expanded))')
    expect(behavior).toContain("TREE_VIEW_VALUE_CHANGE_EVENT")
    expect(behavior).toContain("TREE_VIEW_EXPANDED_CHANGE_EVENT")
  })
})
