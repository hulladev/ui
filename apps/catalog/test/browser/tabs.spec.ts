import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/navigation-overlays#tabs", { waitUntil: "domcontentloaded" })
})

test("links tabs and panels with one selected value", async ({ page }) => {
  const list = page.getByRole("tablist", { name: "Project details" })
  const activity = list.getByRole("tab", { name: "Activity 12" })
  const activityPanel = page.getByRole("tabpanel", { name: "Activity 12" })
  const controls = await activity.getAttribute("aria-controls")

  expect(controls).toBeTruthy()
  await expect(activity).toHaveAttribute("aria-selected", "true")
  await expect(activity).toHaveAttribute("tabindex", "0")
  await expect(activityPanel).toHaveAttribute("id", controls!)
  await expect(activityPanel).toBeVisible()
})

test("automatically activates focused tabs and skips disabled tabs", async ({ page }) => {
  const list = page.getByRole("tablist", { name: "Project details" })
  const activity = list.getByRole("tab", { name: "Activity 12" })
  const settings = list.getByRole("tab", { name: "Settings" })
  const archived = list.getByRole("tab", { name: "Archived" })

  await activity.focus()
  await activity.press("End")

  await expect(settings).toBeFocused()
  await expect(settings).toHaveAttribute("aria-selected", "true")
  await expect(archived).toBeDisabled()

  await settings.press("ArrowRight")
  await expect(activity).toBeFocused()
  await expect(activity).toHaveAttribute("aria-selected", "true")
})

test("manual vertical tabs move focus before activation", async ({ page }) => {
  const list = page.getByRole("tablist", { name: "Workspace settings" })
  const general = list.getByRole("tab", { name: "General" })
  const members = list.getByRole("tab", { name: "Members" })

  await general.focus()
  await general.press("ArrowDown")

  await expect(members).toBeFocused()
  await expect(general).toHaveAttribute("aria-selected", "true")
  await expect(members).toHaveAttribute("aria-selected", "false")

  await members.press("Space")
  await expect(members).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel", { name: "Members" })).toBeVisible()
})

test("active indicators span the full tab in both orientations", async ({ page }) => {
  const horizontal = page.getByRole("tablist", { name: "Project details" }).getByRole("tab", {
    name: "Activity 12",
  })
  const vertical = page.getByRole("tablist", { name: "Workspace settings" }).getByRole("tab", {
    name: "General",
  })

  const horizontalIndicator = await horizontal.evaluate((tab) => {
    const indicator = getComputedStyle(tab, "::after")
    return {
      left: indicator.left,
      right: indicator.right,
      bottom: indicator.bottom,
      width: Number.parseFloat(indicator.width),
      tabWidth: tab.getBoundingClientRect().width,
    }
  })
  const verticalIndicator = await vertical.evaluate((tab) => {
    const indicator = getComputedStyle(tab, "::after")
    return {
      top: indicator.top,
      bottom: indicator.bottom,
      right: indicator.right,
      height: Number.parseFloat(indicator.height),
      tabHeight: tab.getBoundingClientRect().height,
    }
  })

  expect(horizontalIndicator.left).toBe("0px")
  expect(horizontalIndicator.right).toBe("0px")
  expect(horizontalIndicator.bottom).toBe("0px")
  expect(horizontalIndicator.width).toBeCloseTo(horizontalIndicator.tabWidth, 0)
  expect(verticalIndicator.top).toBe("0px")
  expect(verticalIndicator.bottom).toBe("0px")
  expect(verticalIndicator.right).toBe("0px")
  expect(verticalIndicator.height).toBeCloseTo(verticalIndicator.tabHeight, 0)
})

test("fits horizontal and vertical tabs at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/navigation-overlays#tabs", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="tabs-preview"]')
  const box = await preview.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
