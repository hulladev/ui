import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#select", { waitUntil: "domcontentloaded" })
})

test("selects one option and synchronizes the native form control", async ({ page }) => {
  const trigger = page.locator("#select-team-trigger")
  const group = trigger.locator("xpath=..")
  const root = trigger.locator("xpath=ancestor::*[@data-slot='select']")
  const contentId = await trigger.getAttribute("aria-controls")

  await expect(trigger).toContainText("Engineering")
  await expect(group).toHaveAttribute("data-slot", "input-group")
  await expect(group).toHaveCSS("border-top-width", "1px")
  await expect(trigger).toHaveCSS("border-top-width", "0px")
  await expect(group.locator('[data-slot="input-adornment"]')).toBeVisible()
  expect(contentId).toBeTruthy()

  await trigger.click()
  const content = page.locator(`#${contentId}`)
  await expect(content).toBeVisible()
  await content.getByRole("option", { name: "Design" }).click()

  await expect(trigger).toContainText("Design")
  await expect(content).not.toBeVisible()
  await expect(root.locator('[data-slot="select-native-control"]')).toHaveValue("design")
})

test("toggles multiple options without closing the listbox", async ({ page }) => {
  const trigger = page.locator("#select-members-trigger")
  const root = trigger.locator("xpath=..")
  const contentId = await trigger.getAttribute("aria-controls")

  expect(contentId).toBeTruthy()
  await trigger.click()

  const content = page.locator(`#${contentId}`)
  const samuel = content.getByRole("option", { name: "Samuel Hulla" })
  await samuel.click()

  await expect(content).toBeVisible()
  await expect(samuel).toHaveAttribute("aria-selected", "true")
  await expect(trigger).toContainText("Alex Morgan, Mina Park, Samuel Hulla")

  const values = await root
    .locator('[data-slot="select-native-control"]')
    .evaluate((select) =>
      Array.from((select as HTMLSelectElement).selectedOptions).map((option) => option.value)
    )
  expect(values).toEqual(["alex", "mina", "samuel"])
})

test("supports keyboard navigation, grouping, and typeahead", async ({ page }) => {
  const trigger = page.locator("#select-team-trigger")
  const contentId = await trigger.getAttribute("aria-controls")

  expect(contentId).toBeTruthy()
  await trigger.press("ArrowDown")

  const content = page.locator(`#${contentId}`)
  await expect(content).toBeVisible()
  await expect(content.getByRole("group").first()).toHaveAttribute("aria-labelledby")

  await page.keyboard.type("op")
  await expect(content.getByRole("option", { name: "Operations" })).toBeFocused()
  await page.keyboard.press("Enter")

  await expect(trigger).toContainText("Operations")
  await expect(trigger).toBeFocused()
})

test("fits the custom and native controls at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#select", { waitUntil: "domcontentloaded" })

  const trigger = page.locator("#select-team-trigger")
  const nativeSelect = page.locator("#native-select-office")
  const triggerBox = await trigger.boundingBox()
  const nativeBox = await nativeSelect.boundingBox()

  expect(triggerBox).not.toBeNull()
  expect(nativeBox).not.toBeNull()
  expect((triggerBox?.x ?? 0) + (triggerBox?.width ?? 0)).toBeLessThanOrEqual(390)
  expect((nativeBox?.x ?? 0) + (nativeBox?.width ?? 0)).toBeLessThanOrEqual(390)
})
