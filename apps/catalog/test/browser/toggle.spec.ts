import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/forms#toggle", { waitUntil: "domcontentloaded" })
})

test("toggles a standalone native button with pointer and keyboard", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Follow live" })

  await expect(toggle).toHaveJSProperty("tagName", "BUTTON")
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "false")
  await toggle.press("Space")
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
})

test("coordinates required single selection", async ({ page }) => {
  const group = page.getByRole("group", { name: "Document view" })
  const list = group.getByRole("button", { name: "List" })
  const board = group.getByRole("button", { name: "Board" })

  await expect(list).toHaveAttribute("aria-pressed", "true")
  await board.click()
  await expect(list).toHaveAttribute("aria-pressed", "false")
  await expect(board).toHaveAttribute("aria-pressed", "true")

  await board.click()
  await expect(board).toHaveAttribute("aria-pressed", "true")
})

test("coordinates independent multiple selection", async ({ page }) => {
  const group = page.getByRole("group", { name: "Text formatting" })
  const bold = group.getByRole("button", { name: "Bold" })
  const italic = group.getByRole("button", { name: "Italic" })
  const code = group.getByRole("button", { name: "Inline code" })

  await expect(bold).toHaveAttribute("aria-pressed", "true")
  await expect(code).toHaveAttribute("aria-pressed", "true")
  await italic.click()

  await expect(bold).toHaveAttribute("aria-pressed", "true")
  await expect(italic).toHaveAttribute("aria-pressed", "true")
  await expect(code).toHaveAttribute("aria-pressed", "true")
})

test("fits grouped controls at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/forms#toggle", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="toggle-preview"]')
  const box = await preview.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
