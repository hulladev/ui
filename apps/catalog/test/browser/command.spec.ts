import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/navigation-overlays#command", { waitUntil: "domcontentloaded" })
  await expect(page.locator("#catalog-command-input")).toHaveAttribute("aria-controls", /.+/, {
    timeout: 15_000,
  })
})

test("filters across labels and keywords and announces an empty result", async ({ page }) => {
  const input = page.locator("#catalog-command-input")
  const listId = await input.getAttribute("aria-controls")
  expect(listId).toBeTruthy()

  await input.fill("git")
  const list = page.locator(`#${listId}`)
  await expect(list.getByRole("option", { name: /Create branch/ })).toBeVisible()
  await expect(list.getByRole("option", { name: /New file/ })).toBeHidden()

  await input.fill("nothing matches this")
  await expect(list.getByRole("status")).toHaveText(/No matching action/)
  await expect(input).not.toHaveAttribute("aria-activedescendant")
})

test("navigates enabled items and selects with Enter", async ({ page }) => {
  const input = page.locator("#catalog-command-input")
  await input.fill("workspace")

  const disabled = page.getByRole("option", { name: /Workspace settings/ })
  await expect(disabled).toHaveAttribute("aria-disabled", "true")

  await input.press("ArrowDown")
  await input.press("Enter")

  await expect(page.locator("[data-command-selection]")).toHaveText("copy-link")
  await expect(input).toBeFocused()
})

test("Escape clears a query before it can dismiss a containing layer", async ({ page }) => {
  const input = page.locator("#catalog-command-input")
  await input.fill("theme")
  await input.press("Escape")

  await expect(input).toHaveValue("")
  await expect(page.getByRole("option", { name: /New file/ })).toBeVisible()
})

test("composes with Dialog as a page-level command palette", async ({ page }) => {
  const trigger = page.getByRole("button", { name: /Open command menu/ })
  const dialog = page.locator("[data-command-dialog]")
  const input = page.locator("#catalog-command-dialog-input")

  await trigger.click()

  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveCSS("position", "fixed")
  await expect(input).toBeFocused()
  expect(await dialog.evaluate((element) => element.parentElement === document.body)).toBe(true)

  const overlayBox = await dialog.boundingBox()
  const pageWidth = await page.evaluate(() => document.body.clientWidth)
  expect(overlayBox).not.toBeNull()
  expect(overlayBox?.x).toBe(0)
  expect(overlayBox?.width).toBe(pageWidth)

  await input.fill("source")
  await input.press("Enter")

  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.locator("[data-command-overlay-selection]")).toHaveText("source")
})
