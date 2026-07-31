import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedSidebarPart(
  framework: "astro" | "react",
  part:
    | "sidebar-content"
    | "sidebar-group-trigger"
    | "sidebar-menu-button"
    | "sidebar-menu-item"
    | "sidebar-menu-link"
    | "sidebar-menu-trigger"
    | "sidebar-menu"
    | "sidebar"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/sidebar/${part}.${extension}`),
    "utf8"
  )
}

describe("Sidebar generated contract", () => {
  test("preserves native landmark, list, link, and button semantics", async () => {
    const [root, content, menu, item, link, button] = await Promise.all([
      readGeneratedSidebarPart("react", "sidebar"),
      readGeneratedSidebarPart("react", "sidebar-content"),
      readGeneratedSidebarPart("react", "sidebar-menu"),
      readGeneratedSidebarPart("react", "sidebar-menu-item"),
      readGeneratedSidebarPart("react", "sidebar-menu-link"),
      readGeneratedSidebarPart("react", "sidebar-menu-button"),
    ])

    expect(root).toContain("<aside")
    expect(content).toContain("<nav")
    expect(menu).toContain("<ul")
    expect(item).toContain("<li")
    expect(link).toContain("<a")
    expect(button).toContain("<button")
    expect(button).toContain('type = "button"')
  })

  test("uses native summaries for recursive group and menu disclosure", async () => {
    const sources = await Promise.all(
      (["astro", "react"] as const).flatMap((framework) => [
        readGeneratedSidebarPart(framework, "sidebar-group-trigger"),
        readGeneratedSidebarPart(framework, "sidebar-menu-trigger"),
      ])
    )

    for (const source of sources) {
      expect(source).toContain("<summary")
      expect(source).toContain("group-open/collapsible")
      expect(source).not.toContain("useContext")
    }
  })

  test("styles active links through native aria-current", async () => {
    const sources = await Promise.all(
      (["astro", "react"] as const).flatMap((framework) => [
        readGeneratedSidebarPart(framework, "sidebar-menu-link"),
        readGeneratedSidebarPart(framework, "sidebar-menu-button"),
      ])
    )

    for (const source of sources) expect(source).toContain("aria-[current=page]")
  })
})
