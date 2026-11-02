import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test, type Locator } from "@playwright/test"

test.setTimeout(60_000)
async function appearance(element: Locator) {
  return element.evaluate((element) => {
    const style = getComputedStyle(element)
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const context = canvas.getContext("2d")!
    const rgba = (value: string) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data)
    }
    return {
      color: rgba(style.color),
      background: rgba(style.backgroundColor),
      border: rgba(style.borderTopColor),
      borderWidth: parseFloat(style.borderTopWidth),
      radius: parseFloat(style.borderTopLeftRadius),
      fontSize: parseFloat(style.fontSize),
      weight: style.fontWeight,
      tracking: parseFloat(style.letterSpacing) || 0,
      font: style.fontFamily.split(",")[0]!.replaceAll('"', "").trim(),
      paddingX: parseFloat(style.paddingLeft),
      height: element.getBoundingClientRect().height,
    }
  })
}
function sameColor(actual: number[], expected: number[]) {
  expect(Math.abs(actual[3]! - expected[3]!)).toBeLessThanOrEqual(2)
  if (actual[3]! === 0 && expected[3]! === 0) return
  for (let channel = 0; channel < 3; channel++)
    expect(
      Math.abs((actual[channel]! * actual[3]!) / 255 - (expected[channel]! * expected[3]!) / 255)
    ).toBeLessThanOrEqual(3)
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`web/native design language in ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((theme) => localStorage.setItem("catalog-theme", theme), theme)
      await page.setViewportSize({ width: 1280, height: 900 })
    })
    test("pagination uses the same inverse current page, plain neighbors and mono labels", async ({
      page,
    }, testInfo) => {
      await page.goto("/")
      const webCurrent = await appearance(page.locator('#pagination [aria-current="page"]').first())
      const webPlain = await appearance(page.locator('#pagination [aria-label="Page 1"]').first())
      await page.goto(nativeCatalogDestination("pagination")!)
      const preview = page.getByTestId("native-catalog")
      const current = preview.getByRole("button", { name: "Page 1", exact: true })
      const plain = preview.getByRole("button", { name: "Page 2", exact: true })
      const currentPaint = await appearance(current.getByTestId("pagination-surface"))
      const plainPaint = await appearance(plain.getByTestId("pagination-surface"))
      const label = await appearance(current.getByText("1", { exact: true }))
      sameColor(currentPaint.background, webCurrent.background)
      sameColor(label.color, webCurrent.color)
      sameColor(plainPaint.background, webPlain.background)
      expect(currentPaint.height).toBe(webCurrent.height)
      expect(currentPaint.radius).toBe(webCurrent.radius)
      expect(plainPaint.borderWidth).toBe(0)
      expect(label.fontSize).toBe(webCurrent.fontSize)
      expect(label.font).toBe(webCurrent.font)
      expect(label.weight).toBe(webCurrent.weight)
      expect((await current.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      expect((await current.boundingBox())!.width).toBeGreaterThanOrEqual(48)
      await plain.click()
      sameColor((await appearance(plain.getByText("2", { exact: true }))).color, webCurrent.color)
      await expect(plain).toHaveAttribute("aria-current", "page")
      await preview.screenshot({ path: testInfo.outputPath(`pagination-${theme}.png`) })
    })
    test("button variants keep web fills, borders, label type and compact paint", async ({
      page,
    }) => {
      await page.goto("/")
      await page.locator('#button [data-preview-tab="props"]').click()
      const reference = new Map<string, Awaited<ReturnType<typeof appearance>>>()
      for (const variant of ["primary", "secondary", "inverted", "outline", "ghost", "danger"]) {
        await page.getByLabel("Button variant", { exact: true }).selectOption(variant)
        reference.set(
          variant,
          await appearance(
            page.locator(
              `#button [data-playground-button][data-variant="${variant}"][data-size="md"]`
            )
          )
        )
      }
      await page.goto(nativeCatalogDestination("button")!)
      const preview = page.getByTestId("native-catalog")
      for (const [variant, web] of reference) {
        const button = preview.getByRole("button", {
          name: variant[0]!.toUpperCase() + variant.slice(1),
          exact: true,
        })
        const native = await appearance(button.getByTestId("button-surface"))
        const label = await appearance(button.getByTestId("action-label"))
        sameColor(native.background, web.background)
        sameColor(native.border, web.border)
        sameColor(label.color, web.color)
        expect(native.radius).toBe(web.radius)
        expect(native.height).toBe(web.height)
        expect(label.fontSize).toBe(web.fontSize)
        expect(label.weight).toBe(web.weight)
        expect(label.tracking).toBeCloseTo(web.tracking, 2)
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      }
    })
    test("badges share the solid-light and tonal-dark variants", async ({ page }) => {
      await page.goto("/")
      await page.locator('#badge [data-preview-tab="props"]').click()
      const reference = new Map<string, Awaited<ReturnType<typeof appearance>>>()
      for (const variant of ["neutral", "primary", "success", "warning", "danger"]) {
        await page.getByLabel("Badge variant", { exact: true }).selectOption(variant)
        reference.set(
          variant,
          await appearance(
            page.locator(
              `#badge [data-playground-badge][data-variant="${variant}"][data-size="md"]`
            )
          )
        )
      }
      await page.goto(nativeCatalogDestination("badge")!)
      for (const [variant, web] of reference) {
        const badge = page.getByTestId("native-catalog").getByText(variant, { exact: true })
        await expect(badge).toHaveAttribute("data-variant", variant)
        const native = await appearance(badge)
        sameColor(native.background, web.background)
        sameColor(native.color, web.color)
        expect(native.radius).toBe(web.radius)
        expect(native.fontSize).toBe(web.fontSize)
        expect(native.weight).toBe(web.weight)
        expect(native.height).toBe(web.height)
      }
    })
    test("date and time triggers share web field paint instead of a button skin", async ({
      page,
    }) => {
      await page.goto("/forms")
      const references = {
        date: await appearance(
          page.locator('#date-picker [data-slot="date-picker-trigger"]:not(:disabled)').first()
        ),
        time: await appearance(
          page.locator('#time-picker [data-slot="time-picker-trigger"]:not(:disabled)').first()
        ),
      }
      for (const [family, name, web] of [
        ["date-picker", "Next workout", references.date],
        ["time-picker", "Training reminder", references.time],
      ] as const) {
        await page.goto(nativeCatalogDestination(family)!)
        const trigger = page
          .getByTestId("native-catalog")
          .getByRole("button", { name: new RegExp(`^${name}:`) })
        const surface = await appearance(trigger.getByTestId("select-surface"))
        const label = await appearance(trigger.locator('[dir="auto"]').first())
        sameColor(surface.background, web.background)
        sameColor(surface.border, web.border)
        sameColor(label.color, web.color)
        expect(surface.height).toBe(web.height)
        expect(surface.radius).toBe(web.radius)
        expect(label.fontSize).toBe(web.fontSize)
        expect(label.weight).toBe(web.weight)
        expect((await trigger.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      }
    })
    test("card title type and surface spacing follow the web recipe", async ({ page }) => {
      await page.goto("/layout-feedback")
      await page.locator('#card [data-preview-tab="props"]').click()
      const web = await appearance(
        page.locator(
          '#card [data-playground-card][data-variant="outline"] [data-slot="card-title"]'
        )
      )
      const webRoot = await appearance(
        page.locator('#card [data-playground-card][data-variant="outline"]')
      )
      await page.goto(nativeCatalogDestination("card")!)
      const title = page
        .getByTestId("native-catalog")
        .getByRole("heading", { name: "Workout template", exact: true })
      const native = await appearance(title)
      sameColor(native.color, web.color)
      expect(native.fontSize).toBe(web.fontSize)
      expect(native.weight).toBe(web.weight)
      expect(native.tracking).toBeCloseTo(web.tracking, 2)
      const root = title.locator("../..")
      const nativeRoot = await appearance(root)
      sameColor(nativeRoot.background, webRoot.background)
      expect(nativeRoot.paddingX).toBe(webRoot.paddingX)
      expect(nativeRoot.radius).toBe(webRoot.radius)
    })
  })
}
