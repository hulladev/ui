import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const componentRoot = resolve(import.meta.dir, "../src")

async function readTabsPart(
  framework: "astro" | "react",
  part: "tabs" | "tabs-content" | "tabs-list" | "tabs-trigger"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "react.tsx"
  return readFile(resolve(componentRoot, framework, "tabs", `${part}.${extension}`), "utf8")
}

describe("Tabs authored contract", () => {
  test("uses the tablist, tab, and tabpanel roles in both frameworks", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [list, trigger, content] = await Promise.all([
        readTabsPart(framework, "tabs-list"),
        readTabsPart(framework, "tabs-trigger"),
        readTabsPart(framework, "tabs-content"),
      ])

      expect(list).toContain('"tablist"')
      expect(trigger).toContain('"tab"')
      expect(trigger).toContain('data-slot="tabs-trigger"')
      expect(content).toContain('"tabpanel"')
      expect(content).toContain("hidden")
    }
  })

  test("requires shared value keys without framework context", async () => {
    const [astroTrigger, reactTrigger, astroContent, reactContent, reactRoot] = await Promise.all([
      readTabsPart("astro", "tabs-trigger"),
      readTabsPart("react", "tabs-trigger"),
      readTabsPart("astro", "tabs-content"),
      readTabsPart("react", "tabs-content"),
      readTabsPart("react", "tabs"),
    ])

    for (const source of [astroTrigger, reactTrigger, astroContent, reactContent]) {
      expect(source).toContain("value: string")
      expect(source).toContain("data-value={value}")
    }
    expect(reactRoot).not.toContain("createContext")
  })

  test("implements orientation-aware roving focus and both activation modes", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/tabs.ts"), "utf8")

    expect(behavior).toContain('"ArrowUp"')
    expect(behavior).toContain('"ArrowDown"')
    expect(behavior).toContain('"ArrowLeft"')
    expect(behavior).toContain('"ArrowRight"')
    expect(behavior).toContain('"Home"')
    expect(behavior).toContain('"End"')
    expect(behavior).toContain('root.dataset.activationMode !== "manual"')
    expect(behavior).toContain('tab.getAttribute("aria-disabled") === "true"')
    expect(behavior).toContain('tab.setAttribute("aria-selected", String(active))')
    expect(behavior).toContain("panel.hidden = !active")
  })

  test("links every selected pair and exposes stable state hooks", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/tabs.ts"), "utf8")

    expect(behavior).toContain('tab.setAttribute("aria-controls", panel.id)')
    expect(behavior).toContain('panel.setAttribute("aria-labelledby", tab.id)')
    expect(behavior).toContain('tab.dataset.state = active ? "active" : "inactive"')
    expect(behavior).toContain('panel.dataset.state = active ? "active" : "inactive"')
    expect(behavior).toContain("tab.tabIndex = active ? 0 : -1")
  })
})
