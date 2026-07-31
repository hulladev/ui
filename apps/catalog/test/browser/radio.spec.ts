import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#radio", { waitUntil: "domcontentloaded" })
})

test("uses native pointer and keyboard selection within a named group", async ({ page }) => {
  const group = page.locator('[data-slot="radio-group"]').first()
  const starter = page.locator("#plan-starter")
  const studio = page.locator("#plan-studio")
  const company = page.locator("#plan-company")

  await expect(group).toHaveJSProperty("tagName", "FIELDSET")
  await expect(group.locator("legend")).toHaveText("Choose a workspace plan")
  await expect(group).not.toHaveAttribute("role", "radiogroup")
  await expect(studio).toBeChecked()
  await starter.click()
  await expect(starter).toBeChecked()
  await expect(studio).not.toBeChecked()

  await starter.focus()
  await starter.press("ArrowDown")
  await expect(studio).toBeChecked()
  await expect(studio).toBeFocused()
  await studio.press("ArrowDown")
  await expect(company).toBeChecked()
})

test("inherits disabled state through the native fieldset", async ({ page }) => {
  const group = page.locator('[data-slot="radio-group"]').first()
  const radios = group.locator('[data-slot="radio"]')

  await group.evaluate((element) => {
    const fieldset = element as HTMLFieldSetElement
    fieldset.disabled = true
  })

  await expect(group).toHaveAttribute("disabled", "")
  await expect(radios).toHaveCount(3)
  for (const radio of await radios.all()) {
    await expect(radio).toBeDisabled()
  }
})

test("keeps disabled radios unavailable", async ({ page }) => {
  const disabled = page.locator("#radio-disabled")

  await expect(disabled).toBeDisabled()
  await expect(disabled).not.toBeChecked()
})

test("fits the radio preview at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#radio", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="radio-radiogroup-preview"]')
  const box = await preview.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
