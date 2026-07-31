import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await expect(page.locator("#catalog-navigation-input")).toHaveAttribute("aria-controls", /.+/, {
    timeout: 15_000,
  })
})

test("opens from the global shortcut and navigates to filtered component sections", async ({
  page,
}) => {
  const dialog = page.locator("[data-catalog-command-dialog]")
  const input = page.locator("#catalog-navigation-input")

  await page.keyboard.press("ControlOrMeta+KeyK")

  await expect(dialog).toBeVisible()
  await expect(input).toBeFocused()
  await input.fill("autocomplete")
  await expect(dialog.getByRole("option", { name: /Combobox/ })).toBeVisible()
  await input.press("Enter")

  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/#combobox$/)
  await expect(
    page.locator('[data-catalog-nav] [data-slot="sidebar-menu-link"][href="#combobox"]')
  ).toHaveAttribute("aria-current", "page")
})

test("searches component aliases and closes cleanly with Escape", async ({ page }) => {
  const dialog = page.locator("[data-catalog-command-dialog]")
  const input = page.locator("#catalog-navigation-input")

  await page.keyboard.press("ControlOrMeta+KeyK")
  await input.fill("range")

  await expect(dialog.getByRole("option", { name: /Slider/ })).toBeVisible()
  await input.press("Escape")
  await expect(dialog).toBeHidden()

  await page.keyboard.press("ControlOrMeta+KeyK")
  await expect(input).toHaveValue("")
  await input.press("Escape")
})

test("opens from the visible trigger and restores focus when dismissed", async ({ page }) => {
  const trigger = page.getByRole("button", { name: /Search catalog/ })
  const dialog = page.locator("[data-catalog-command-dialog]")
  const input = page.locator("#catalog-navigation-input")

  await trigger.click()

  await expect(dialog).toBeVisible()
  await expect(input).toBeFocused()
  await input.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})
