import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const componentRoot = resolve(import.meta.dir, "../src")

async function readNavigationMenuPart(
  framework: "astro" | "react",
  part:
    | "navigation-menu"
    | "navigation-menu-content"
    | "navigation-menu-item"
    | "navigation-menu-link"
    | "navigation-menu-list"
    | "navigation-menu-trigger"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "react.tsx"
  return readFile(
    resolve(componentRoot, framework, "navigation-menu", `${part}.${extension}`),
    "utf8"
  )
}

describe("Navigation Menu authored contract", () => {
  test("preserves native navigation, list, link, and disclosure semantics", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [root, list, item, trigger, content, link] = await Promise.all([
        readNavigationMenuPart(framework, "navigation-menu"),
        readNavigationMenuPart(framework, "navigation-menu-list"),
        readNavigationMenuPart(framework, "navigation-menu-item"),
        readNavigationMenuPart(framework, "navigation-menu-trigger"),
        readNavigationMenuPart(framework, "navigation-menu-content"),
        readNavigationMenuPart(framework, "navigation-menu-link"),
      ])

      expect(root).toContain("<nav")
      expect(list).toContain("<ul")
      expect(item).toContain("<li")
      expect(trigger).toContain("<button")
      expect(trigger).not.toContain("aria-haspopup")
      expect(trigger).toContain('aria-expanded="false"')
      expect(content).toContain('"region"')
      expect(content).toContain("hidden")
      expect(link).toContain("<a")
      expect(root).not.toContain('role="menu"')
    }
  })

  test("supports hover grace, keyboard traversal, and escape restoration", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/navigation-menu.ts"), "utf8")

    expect(behavior).toContain('event.pointerType === "touch"')
    expect(behavior).toContain("root.dataset.openDelay ?? 90")
    expect(behavior).toContain("root.dataset.closeDelay ?? 180")
    expect(behavior).toContain('"ArrowLeft"')
    expect(behavior).toContain('"ArrowRight"')
    expect(behavior).toContain('"ArrowDown"')
    expect(behavior).toContain('"Home"')
    expect(behavior).toContain('"End"')
    expect(behavior).toContain('"Escape"')
    expect(behavior).toContain("focusTrigger(activeItem && itemTrigger(activeItem))")
    expect(behavior.indexOf("focusTrigger(activeItem")).toBeLessThan(
      behavior.indexOf("close()", behavior.indexOf("focusTrigger(activeItem"))
    )
    expect(behavior).toContain('"--navigation-menu-shift-x"')
    expect(behavior).toContain('addEventListener("resize", onResize)')
    expect(behavior).toContain("const wasOpenOnPointerDown")
    expect(behavior).toContain("wasOpenOnPointerDown || event.detail === 0")
  })

  test("links each trigger to its region and exposes stable state hooks", async () => {
    const behavior = await readFile(resolve(componentRoot, "lib/navigation-menu.ts"), "utf8")

    expect(behavior).toContain('trigger.setAttribute("aria-controls", content.id)')
    expect(behavior).toContain('content.setAttribute("aria-labelledby", trigger.id)')
    expect(behavior).toContain('trigger.setAttribute("aria-expanded", String(open))')
    expect(behavior).toContain('content.dataset.state = open ? "open" : "closed"')
    expect(behavior).toContain("content.hidden = !open")
    expect(behavior).toContain(
      "if (root.dataset.value !== currentValue) root.dataset.value = currentValue"
    )
  })
})
