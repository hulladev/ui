import { expect, test } from "@playwright/test"
import { catalogPages, catalogSections } from "../../src/data/catalogNavigation"

for (const category of catalogPages) {
  test(`${category.group} renders only its registered component sections`, async ({ request }) => {
    const response = await request.get(category.href)
    expect(response.ok()).toBe(true)
    const html = await response.text()
    for (const section of catalogSections) {
      expect(html.includes(`id="${section.href.slice(1)}"`), section.label).toBe(
        section.group === category.group
      )
    }
  })
}

test("moves through categories, preserves theme, and supports back navigation", async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.locator("#contrast").check()
  const pagination = page.getByRole("navigation", { name: "Catalog pages" })
  await expect(pagination.locator('[rel="prev"]')).toHaveCount(0)
  for (const category of catalogPages.slice(1)) {
    await pagination.getByRole("link", { name: `Next page → ${category.group}` }).click()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${category.group}.`)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await expect(page.locator("#contrast")).toBeChecked()
  }
  await expect(pagination.locator('[rel="next"]')).toHaveCount(0)
  await pagination.locator('[rel="prev"]').click()
  await expect(page).toHaveURL(/\/navigation-overlays\/?$/)
  await page.goBack({ waitUntil: "domcontentloaded" })
  await expect(page).toHaveURL(/\/layout-feedback\/?$/)
})

test("sidebar links open another category and mark the selected component", async ({ page }) => {
  await page.goto("/")
  await page.locator("[data-catalog-nav]").getByRole("link", { name: "Input", exact: true }).click()
  await expect(page).toHaveURL(/\/forms#input$/)
  await expect(page.locator("#input")).toBeVisible()
  await expect(page.locator('[data-catalog-nav] a[aria-current="page"]')).toHaveText("Input")
  await expect(page.locator("#button")).toHaveCount(0)
})

test("old component bookmarks resolve to their category with query parameters intact", async ({
  page,
}) => {
  await page.goto("/")
  await page.evaluate(() => {
    window.location.assign("/?ref=bookmark#dialog")
  })
  await expect(page).toHaveURL(/\/navigation-overlays\?ref=bookmark#dialog$/, { timeout: 15_000 })
  await expect(page.locator("#dialog")).toBeVisible()
})

test("mobile category navigation fits the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/layout-feedback")
  const pagination = page.getByRole("navigation", { name: "Catalog pages" })
  await pagination.scrollIntoViewIfNeeded()
  await expect(pagination.getByRole("link")).toBeVisible()
  expect(
    await pagination.evaluate((element) => element.getBoundingClientRect().right)
  ).toBeLessThanOrEqual(390)
})
