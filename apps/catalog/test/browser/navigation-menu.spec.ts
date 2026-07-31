import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes("narrow width")) return
  await page.goto("/#navigation-menu", { waitUntil: "domcontentloaded" })
})

test("opens rich navigation content on hover and switches without a dropdown role", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", { name: "Primary navigation" })
  const product = navigation.getByRole("button", { name: "Product" })
  const solutions = navigation.getByRole("button", { name: "Solutions" })

  await product.hover()
  await expect(navigation.getByRole("region", { name: "Product" })).toBeVisible()
  await expect(product).toHaveAttribute("aria-expanded", "true")

  await solutions.hover()
  await expect(navigation.getByRole("region", { name: "Solutions" })).toBeVisible()
  await expect(product).toHaveAttribute("aria-expanded", "false")
  await expect(navigation.getByRole("menu")).toHaveCount(0)
})

test("uses arrow keys across triggers and restores trigger focus with Escape", async ({ page }) => {
  const navigation = page.getByRole("navigation", { name: "Primary navigation" })
  const product = navigation.getByRole("button", { name: "Product" })
  const solutions = navigation.getByRole("button", { name: "Solutions" })

  await expect(navigation).toHaveAttribute("data-state", "closed")
  await product.focus()
  await expect(navigation.getByRole("region", { name: "Product" })).toBeVisible()

  await product.press("ArrowRight")
  await expect(solutions).toBeFocused()
  await expect(navigation.getByRole("region", { name: "Solutions" })).toBeVisible()

  await solutions.press("ArrowDown")
  await expect(navigation.getByRole("link", { name: /Product teams/ })).toBeFocused()
  await page.keyboard.press("Escape")

  await expect(solutions).toBeFocused()
  await expect(solutions).toHaveAttribute("aria-expanded", "false")
})

test("keeps the active panel inside the viewport at narrow width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#navigation-menu", { waitUntil: "domcontentloaded" })

  const navigation = page.getByRole("navigation", { name: "Primary navigation" })
  await expect(navigation).toHaveAttribute("data-state", "closed")
  await navigation.getByRole("button", { name: "Product" }).click()
  const panel = navigation.getByRole("region", { name: "Product" })
  const box = await panel.boundingBox()

  expect(box).not.toBeNull()
  expect(box?.x).toBeGreaterThanOrEqual(0)
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
