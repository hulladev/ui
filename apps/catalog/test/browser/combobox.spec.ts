import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#combobox", { waitUntil: "domcontentloaded" })
  await expect(page.locator("#combobox-team-input")).toHaveAttribute("aria-controls", /.+/, {
    timeout: 15_000,
  })
})

test("stays open when the editable input is clicked", async ({ page }) => {
  const input = page.locator("#combobox-team-input")
  const contentId = await input.getAttribute("aria-controls")

  expect(contentId).toBeTruthy()
  await input.click()

  await expect(input).toBeFocused()
  await expect(input).toHaveAttribute("aria-expanded", "true")
  await expect(page.locator(`#${contentId}`)).toBeVisible()
})

test("filters options and selects one result with the keyboard", async ({ page }) => {
  const input = page.locator("#combobox-team-input")
  const group = input.locator("xpath=..")
  const root = input.locator("xpath=ancestor::*[@data-slot='combobox']")
  const contentId = await input.getAttribute("aria-controls")

  await expect(input).toHaveValue("Engineering")
  await expect(group).toHaveAttribute("data-slot", "input-group")
  await expect(group).toHaveCSS("border-top-width", "1px")
  await expect(input).toHaveCSS("border-top-width", "0px")
  await expect(group.locator('[data-slot="input-adornment"]')).toBeVisible()
  expect(contentId).toBeTruthy()

  await input.focus()
  await input.fill("opera")

  const content = page.locator(`#${contentId}`)
  const operations = content.getByRole("option", { name: "Operations" })
  const operationsId = await operations.getAttribute("id")
  await expect(content).toBeVisible()
  await expect(operations).toBeVisible()
  await expect(content.getByRole("option", { name: "Engineering" })).toBeHidden()
  expect(operationsId).toBeTruthy()
  await expect(input).toHaveAttribute("aria-activedescendant", operationsId!)

  await input.press("Enter")

  await expect(input).toHaveValue("Operations")
  await expect(content).not.toBeVisible()
  await expect(root.locator('[data-slot="combobox-native-control"]')).toHaveValue("operations")
})

test("announces an empty filtered result", async ({ page }) => {
  const input = page.locator("#combobox-team-input")
  const contentId = await input.getAttribute("aria-controls")

  expect(contentId).toBeTruthy()
  await input.focus()
  await input.fill("not a team")

  const content = page.locator(`#${contentId}`)
  await expect(content.getByRole("status")).toBeVisible()
  await expect(content.getByRole("status")).toHaveText("No teams match that search.")
  await expect(input).not.toHaveAttribute("aria-activedescendant")
})

test("adds multiple values while keeping focus in the editable input", async ({ page }) => {
  const input = page.locator("#combobox-reviewers-input")
  const root = input.locator("xpath=..")
  const contentId = await input.getAttribute("aria-controls")

  await expect(input).toHaveValue("Alex Morgan, Mina Park")
  expect(contentId).toBeTruthy()

  await input.focus()
  await input.fill("sam")
  await input.press("Enter")

  const content = page.locator(`#${contentId}`)
  await expect(content).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue("")
  await expect(content.getByRole("option", { name: "Samuel Hulla" })).toHaveAttribute(
    "aria-selected",
    "true"
  )

  const values = await root
    .locator('[data-slot="combobox-native-control"]')
    .evaluate((select) =>
      Array.from((select as HTMLSelectElement).selectedOptions).map((option) => option.value)
    )
  expect(values).toEqual(["alex", "mina", "samuel"])

  await input.press("Escape")
  await expect(input).toHaveValue("Alex Morgan, Mina Park, Samuel Hulla")
})

test("fits the input and popup at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#combobox", { waitUntil: "domcontentloaded" })

  const input = page.locator("#combobox-team-input")
  await input.focus()
  const contentId = await input.getAttribute("aria-controls")
  const inputBox = await input.boundingBox()
  const contentBox = await page.locator(`#${contentId}`).boundingBox()

  expect(inputBox).not.toBeNull()
  expect(contentBox).not.toBeNull()
  expect((inputBox?.x ?? 0) + (inputBox?.width ?? 0)).toBeLessThanOrEqual(390)
  expect((contentBox?.x ?? 0) + (contentBox?.width ?? 0)).toBeLessThanOrEqual(390)
})
