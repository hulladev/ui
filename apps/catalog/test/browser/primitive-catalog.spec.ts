import { expect, test, type Page } from "@playwright/test"

const generatedFamiliesFor = async (page: Page, sectionId: string) =>
  page
    .locator(`${sectionId} [data-source-record][data-mode="generated"]`)
    .evaluateAll((records) => records.map((record) => record.getAttribute("data-filename") ?? ""))

test("documents independent primitives in separate catalog sections", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

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
  await expect(
    page.locator("#tooltip").getByRole("heading", { name: "Tooltip", exact: true })
  ).toBeVisible()
  await expect(
    page.locator("#hover-card").getByRole("heading", { name: "HoverCard", exact: true })
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
  expect(await generatedFamiliesFor(page, "#tooltip")).toEqual(
    expect.arrayContaining([expect.stringContaining("/tooltip/")])
  )
  expect(await generatedFamiliesFor(page, "#hover-card")).toEqual(
    expect.arrayContaining([expect.stringContaining("/hover-card/")])
  )
})
