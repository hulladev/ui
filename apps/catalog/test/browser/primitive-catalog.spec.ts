import { expect, test, type Page } from "@playwright/test"

const generatedFamiliesFor = async (page: Page, sectionId: string) =>
  page
    .locator(`${sectionId} [data-source-record][data-mode="generated"]`)
    .evaluateAll((records) => records.map((record) => record.getAttribute("data-filename") ?? ""))

test("documents independent primitives in separate catalog sections", async ({ page }) => {
  await page.goto("/forms", { waitUntil: "domcontentloaded" })

  const navigation = page.locator("[data-catalog-nav]")
  for (const label of ["Input", "Field", "Tooltip", "HoverCard"]) {
    await expect(navigation.getByRole("link", { name: label, exact: true })).toHaveCount(1)
  }

  await expect(navigation.getByText("Input + Field", { exact: true })).toHaveCount(0)
  await expect(navigation.getByText("Tooltip + HoverCard", { exact: true })).toHaveCount(0)

  await expect(
    page.locator("#input").getByRole("heading", { name: "Input", exact: true })
  ).toBeVisible()
  await expect(
    page.locator("#field").getByRole("heading", { name: "Field", exact: true })
  ).toBeVisible()

  expect(await generatedFamiliesFor(page, "#input")).toEqual(
    expect.arrayContaining([expect.stringContaining("/input/")])
  )
  expect(await generatedFamiliesFor(page, "#input")).not.toEqual(
    expect.arrayContaining([expect.stringContaining("/field/")])
  )
  expect(await generatedFamiliesFor(page, "#field")).toEqual(
    expect.arrayContaining([expect.stringContaining("/field/")])
  )
  await page.goto("/navigation-overlays", { waitUntil: "domcontentloaded" })
  await expect(
    page.locator("#tooltip").getByRole("heading", { name: "Tooltip", exact: true })
  ).toBeVisible()
  await expect(
    page.locator("#hover-card").getByRole("heading", { name: "HoverCard", exact: true })
  ).toBeVisible()
  expect(await generatedFamiliesFor(page, "#tooltip")).toEqual(
    expect.arrayContaining([expect.stringContaining("/tooltip/")])
  )
  expect(await generatedFamiliesFor(page, "#hover-card")).toEqual(
    expect.arrayContaining([expect.stringContaining("/hover-card/")])
  )
})

for (const theme of ["light", "dark"]) {
  test(`fields keep consistent gaps beside taller controls in ${theme} mode`, async ({ page }) => {
    await page.goto("/forms#field", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((element, value) => {
      element.dataset.theme = value
    }, theme)
    // Simulate a user resizing the textarea: its neighbouring field must not redistribute space.
    await page.locator("#field-notes").evaluate((element) => {
      element.style.height = "240px"
    })
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const id of ["field-project-name", "field-owner-email", "field-region", "field-notes"]) {
        const spacing = await page.locator(`#${id}`).evaluate((control) => {
          const field = control.closest('[data-slot="field"]')!
          const label = field.querySelector('[data-slot="label"]')!
          const message = field.querySelector('[data-slot="description"], [data-slot="error"]')!
          return {
            before: control.getBoundingClientRect().top - label.getBoundingClientRect().bottom,
            after: message.getBoundingClientRect().top - control.getBoundingClientRect().bottom,
          }
        })
        expect(spacing.before, `${id} label gap at ${width}px`).toBeCloseTo(6, 0)
        expect(spacing.after, `${id} message gap at ${width}px`).toBeCloseTo(6, 0)
      }
    }
    const label = page.locator('label[for="field-project-name"]')
    expect(await label.evaluate((element) => getComputedStyle(element, "::after").marginLeft)).toBe(
      "2px"
    )
    await label.click()
    await expect(page.locator("#field-project-name")).toBeFocused()
    await expect(page.locator("#field-project-name")).toHaveAttribute("required", "")
    await expect(page.locator("#field-region")).toBeDisabled()
    await expect(page.locator("#field-owner-email")).toHaveAttribute(
      "aria-describedby",
      "field-owner-error"
    )
  })
}
