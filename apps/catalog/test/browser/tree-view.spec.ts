import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#tree-view", { waitUntil: "domcontentloaded" })
})

test("preserves native list structure and tree roles", async ({ page }) => {
  const tree = page.getByRole("tree", { name: "Repository files" })
  const packages = tree.locator('[data-slot="tree-item"][data-value="packages"]')
  const group = packages.locator(':scope > [data-slot="tree-group"]')

  await expect(tree).toHaveJSProperty("tagName", "UL")
  await expect(packages).toHaveJSProperty("tagName", "LI")
  await expect(group).toHaveJSProperty("tagName", "UL")
  await expect(packages).toHaveAttribute("aria-expanded", "true")
})

test("moves through visible items and traverses hierarchy with arrow keys", async ({ page }) => {
  const tree = page.getByRole("tree", { name: "Repository files" })
  const packages = tree.locator('[data-slot="tree-item"][data-value="packages"]')
  const components = tree.locator('[data-slot="tree-item"][data-value="components"]')
  const button = tree.locator('[data-slot="tree-item"][data-value="button.tsx"]')
  const toggle = tree.locator('[data-slot="tree-item"][data-value="toggle.tsx"]')

  await button.focus()
  await button.press("ArrowDown")
  await expect(toggle).toBeFocused()

  await packages.focus()
  await packages.press("ArrowLeft")
  await expect(packages).toHaveAttribute("aria-expanded", "false")

  await packages.press("ArrowRight")
  await expect(packages).toHaveAttribute("aria-expanded", "true")
  await packages.press("ArrowRight")
  await expect(components).toBeFocused()
})

test("selects enabled items and skips disabled items", async ({ page }) => {
  const tree = page.getByRole("tree", { name: "Repository files" })
  const toggle = tree.locator('[data-slot="tree-item"][data-value="toggle.tsx"]')
  const disabled = tree.locator('[data-slot="tree-item"][data-value="tree-view.tsx"]')

  await page.evaluate(() => {
    document.addEventListener(
      "hulla-tree-view-value-change",
      (event) => {
        document.body.dataset.lastTreeValue = (event as CustomEvent<{ value: string }>).detail.value
      },
      { once: true }
    )
  })
  await toggle.locator('[data-slot="tree-item-label"]').click()
  await expect(toggle).toHaveAttribute("aria-selected", "true")
  await expect(page.locator("body")).toHaveAttribute("data-last-tree-value", "toggle.tsx")

  await disabled.locator('[data-slot="tree-item-label"]').click({ force: true })
  await expect(toggle).toHaveAttribute("aria-selected", "true")
  await expect(disabled).toHaveAttribute("aria-selected", "false")
})

test("supports a focus-only tree without selection state", async ({ page }) => {
  const preview = page.locator('[data-preview-component="treeview-preview"]')
  const tree = preview.locator("[data-playground-tree]")
  const control = preview.locator("[data-tree-selection-mode]")

  await preview.getByRole("tab", { name: "Selection model" }).click()
  await control.selectOption("none")
  await expect(tree.locator('[role="treeitem"]').first()).not.toHaveAttribute("aria-selected")
})

test("fits nested content at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#tree-view", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="treeview-preview"]')
  const box = await preview.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
