import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#sidebar", { waitUntil: "domcontentloaded" })
})

test("preserves native landmark and navigation semantics", async ({ page }) => {
  const sidebar = page.locator("#sidebar [data-slot=sidebar]").first()

  await expect(sidebar).toHaveJSProperty("tagName", "ASIDE")
  await expect(sidebar.locator('[data-slot="sidebar-content"]')).toHaveJSProperty("tagName", "NAV")
  await expect(sidebar.locator('[data-slot="sidebar-menu"]').first()).toHaveJSProperty(
    "tagName",
    "UL"
  )
  await expect(sidebar.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  await expect(sidebar.getByRole("button", { name: /Sam H\./ })).toHaveAttribute("type", "button")
})

test("toggles nested branches independently with pointer and keyboard", async ({ page }) => {
  const sidebar = page.locator("#sidebar [data-slot=sidebar]").first()
  const workspaceTrigger = sidebar.locator('[data-slot="sidebar-group-trigger"]').filter({
    hasText: "Workspace",
  })
  const projectsTrigger = sidebar.locator('[data-slot="sidebar-menu-trigger"]').filter({
    hasText: "Projects",
  })
  const platformTrigger = sidebar.locator('[data-slot="sidebar-menu-trigger"]').filter({
    hasText: "Platform",
  })
  const workspace = workspaceTrigger.locator("..")
  const projects = projectsTrigger.locator("..")
  const platform = platformTrigger.locator("..")

  await expect(workspace).toHaveAttribute("open", "")
  await expect(projects).toHaveAttribute("open", "")
  await expect(platform).toHaveAttribute("open", "")

  await projectsTrigger.click()
  await expect(projects).not.toHaveAttribute("open", "")
  await expect(workspace).toHaveAttribute("open", "")
  await expect(platform).toHaveAttribute("open", "")

  await projectsTrigger.press("Space")
  await expect(projects).toHaveAttribute("open", "")
  await expect(platform).toHaveAttribute("open", "")
})

test("keeps the nested sidebar legible in dark mode", async ({ page }) => {
  const theme = page.getByRole("switch", { name: "Dark theme" })
  const sidebar = page.locator("#sidebar [data-slot=sidebar]").first()

  await theme.check()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await expect(sidebar).toHaveCSS("color", "oklch(0.97 0 0)")
})

test("fits the composed sidebar at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#sidebar", { waitUntil: "domcontentloaded" })

  const sidebar = page.locator("#sidebar [data-slot=sidebar]").first()
  const box = await sidebar.boundingBox()

  expect(box).not.toBeNull()
  expect(box?.width).toBeLessThanOrEqual(390)
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
