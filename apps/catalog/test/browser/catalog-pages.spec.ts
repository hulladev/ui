import { expect, test } from "@playwright/test"
import {
  catalogPages,
  catalogSections,
  nativeCatalogDestination,
} from "../../src/data/catalogNavigation"

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
    await expect(page.locator(".masthead h1")).toHaveText(
      category.group === "Native only" ? "Native-only components." : `${category.group}.`
    )
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await expect(page.locator("#contrast")).toBeChecked()
  }
  await expect(pagination.locator('[rel="next"]')).toHaveCount(0)
  await pagination.locator('[rel="prev"]').click()
  await expect(page).toHaveURL(new RegExp(`${catalogPages.at(-2)!.href}/?$`))
  await page.goBack({ waitUntil: "domcontentloaded" })
  await expect(page).toHaveURL(new RegExp(`${catalogPages.at(-1)!.href}/?$`))
})

test("sidebar links open another category and mark the selected component", async ({ page }) => {
  await page.goto("/")
  await page
    .getByRole("region", { name: "Forms components", exact: true })
    .getByRole("link", { name: "Input", exact: true })
    .click()
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
  await page.goto(catalogPages.at(-1)!.href)
  const navigation = page.locator("[data-catalog-navigation]")
  await expect(navigation).not.toHaveAttribute("open", "")
  expect(
    await page
      .locator(".masthead h1")
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
  ).toBeGreaterThanOrEqual(32)
  await page.getByText("Browse components", { exact: true }).click()
  await expect(navigation).toHaveAttribute("open", "")
  await page.getByText("Browse components", { exact: true }).click()
  await expect(navigation).not.toHaveAttribute("open", "")
  const pagination = page.getByRole("navigation", { name: "Catalog pages" })
  await pagination.scrollIntoViewIfNeeded()
  await expect(pagination.getByRole("link")).toBeVisible()
  expect(
    await pagination.evaluate((element) => element.getBoundingClientRect().right)
  ).toBeLessThanOrEqual(390)
})

test("native components share framework pickers and one catalog theme control", async ({
  page,
}) => {
  await page.goto(nativeCatalogDestination("button")!)
  await expect(page).toHaveURL(/\/\?framework=react-native#button$/)
  const section = page.locator("#button")
  const native = section.getByTestId("native-catalog")
  await expect(native).toBeVisible({ timeout: 30_000 })
  const primary = native.getByRole("button", { name: "Primary", exact: true })
  await expect(primary).toBeVisible()
  expect(
    await primary.evaluate((element) => element.getBoundingClientRect().height)
  ).toBeGreaterThanOrEqual(48)
  expect(
    await primary
      .getByTestId("button-surface")
      .evaluate((element) => element.getBoundingClientRect().height)
  ).toBe(32)
  await primary.click()
  await expect(native.getByText("Actions triggered: 1", { exact: true })).toBeVisible()
  const frameworks = section.getByRole("combobox", { name: "Button framework", exact: true })
  await expect(frameworks).toHaveValue("React Native")
  await expect(frameworks.locator("option")).toHaveText(["React", "Solid", "Astro", "React Native"])
  await expect(page.locator("#contrast")).toHaveCount(1)
  await page.locator("#contrast").check()
  await expect(native).toHaveAttribute("id", "native-preview-dark")
  await page
    .getByRole("region", { name: "Forms components", exact: true })
    .getByRole("link", { name: "Switch", exact: true })
    .click()
  await expect(page).toHaveURL(/\/forms#switch$/)
  const switchSection = page.locator("#switch")
  await switchSection
    .getByRole("combobox", { name: "Switch framework", exact: true })
    .selectOption("React Native")
  const switchNative = switchSection.getByTestId("native-catalog")
  await expect(switchNative).toBeVisible({ timeout: 30_000 })
  await expect(switchNative).toHaveAttribute("id", "native-preview-dark")
  const toggle = switchNative.getByRole("switch", { name: "Notifications", exact: true })
  await expect(toggle).toBeChecked()
  const thumb = toggle.locator("..").locator(":scope > div").nth(1)
  await expect(thumb).toHaveCSS("background-color", "rgb(245, 245, 245)")
  await toggle.uncheck()
  await expect(switchNative.getByText("Notifications off", { exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Primary", exact: true })).toHaveCount(0)
})
