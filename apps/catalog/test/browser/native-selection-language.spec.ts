import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test, type Locator, type Page } from "@playwright/test"

test.setTimeout(60_000)

async function paint(locator: Locator, pseudo?: string) {
  await expect(locator).toBeVisible()
  await locator.evaluate(async (node) => {
    // Resolve the current style before awaiting any finite theme/state transitions.
    void getComputedStyle(node).backgroundColor
    await Promise.all(
      node
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined))
    )
  })
  return locator.evaluate((node, pseudo) => {
    const style = getComputedStyle(node, pseudo)
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const context = canvas.getContext("2d")!
    const rgba = (color: string) => {
      if (!CSS.supports("color", color)) throw new Error(`Unsupported computed color: ${color}`)
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      return [...context.getImageData(0, 0, 1, 1).data]
    }
    const number = (value: string) => (value === "normal" ? 0 : Number.parseFloat(value))
    return {
      color: rgba(style.color),
      background: rgba(style.backgroundColor),
      borderColor: rgba(style.borderTopColor),
      borderLeftColor: rgba(style.borderLeftColor),
      border: number(style.borderTopWidth),
      borderLeft: number(style.borderLeftWidth),
      radius: number(style.borderTopLeftRadius),
      fontSize: number(style.fontSize),
      lineHeight: number(style.lineHeight),
      weight: style.fontWeight === "normal" ? 400 : number(style.fontWeight),
      font: style.fontFamily.split(",")[0]!.trim().replaceAll(/["']/g, ""),
      tracking: number(style.letterSpacing),
      width: pseudo ? number(style.width) : node.getBoundingClientRect().width,
      height: pseudo ? number(style.height) : node.getBoundingClientRect().height,
    }
  }, pseudo)
}

type Paint = Awaited<ReturnType<typeof paint>>
function sameColor(actual: number[], expected: number[], label: string) {
  expect.soft(Math.abs(actual[3]! - expected[3]!), `${label}: alpha`).toBeLessThanOrEqual(2)
  for (let channel = 0; channel < 3; channel++)
    expect
      .soft(
        Math.abs((actual[channel]! * actual[3]!) / 255 - (expected[channel]! * expected[3]!) / 255),
        `${label}: premultiplied ${channel}`
      )
      .toBeLessThanOrEqual(2)
}
function sameNumbers(actual: Paint, expected: Paint, properties: (keyof Paint)[]) {
  for (const property of properties)
    expect.soft(actual[property], property).toBeCloseTo(expected[property] as number, 2)
}
function sameType(actual: Paint, expected: Paint) {
  sameNumbers(actual, expected, ["fontSize", "lineHeight", "weight", "tracking"])
  expect(actual.font).toBe(expected.font)
  sameColor(actual.color, expected.color, "text")
}
function effectiveRadius(value: Paint) {
  return Math.min(value.radius, value.width / 2, value.height / 2)
}
async function open(page: Page, path: string, native = false) {
  await page.goto(path, { waitUntil: "domcontentloaded" })
  const mode = await page.evaluate(() => localStorage.getItem("catalog-theme"))
  await expect(page.locator("html")).toHaveAttribute("data-theme", mode!)
  if (native) {
    const section = new URL(path, "http://catalog.local").hash
    const scope = section ? page.locator(section) : page
    await expect(scope.locator(`#native-preview-${mode}`)).toBeVisible()
  }
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(0, 0)
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} native selection follows web recipes`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1000 })
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.addInitScript((value) => localStorage.setItem("catalog-theme", value), theme)
    })

    test("radio uses the web filled disc and contrasting six-unit dot", async ({ page }) => {
      await open(page, "/forms#radio")
      const web = page.locator("#radio-checked")
      await expect(web).toBeChecked()
      const disc = await paint(web)
      const dot = await paint(web, "::before")
      await open(page, nativeCatalogDestination("radio")!, true)
      const radio = page
        .getByTestId("native-catalog")
        .getByRole("radio", { name: "Hypertrophy", exact: true })
      const indicator = radio.getByTestId("radio-indicator")
      const actual = await paint(indicator)
      const nativeDot = await paint(indicator.locator(":scope > div"))
      sameColor(actual.background, disc.background, "radio disc")
      sameColor(actual.borderColor, disc.borderColor, "radio border")
      sameNumbers(actual, disc, ["width", "height", "border"])
      expect(effectiveRadius(actual)).toBe(effectiveRadius(disc))
      sameColor(nativeDot.background, dot.background, "radio dot")
      sameNumbers(nativeDot, dot, ["width", "height"])
      expect(effectiveRadius(nativeDot)).toBe(effectiveRadius(dot))
      expect((await radio.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      expect((await radio.boundingBox())!.width).toBeGreaterThanOrEqual(48)
    })

    test("slider matches the real web neutral track and primary thumb", async ({
      page,
      browserName,
    }) => {
      await open(page, "/forms#slider")
      const web = page.locator("#mix-dynamics")
      const trackPseudo =
        browserName === "firefox" ? "::-moz-range-track" : "::-webkit-slider-runnable-track"
      const thumbPseudo =
        browserName === "firefox" ? "::-moz-range-thumb" : "::-webkit-slider-thumb"
      const exposed = await web.evaluate((node, pseudo) => {
        const style = getComputedStyle(node, pseudo)
        return Number.parseFloat(style.width) === 18 && CSS.supports("color", style.backgroundColor)
      }, thumbPseudo)
      test.skip(
        !exposed,
        "This engine does not expose range-internal pseudo-element computed styles; gesture and visual review cover its native preview separately."
      )
      const track = await paint(web, trackPseudo)
      const thumb = await paint(web, thumbPseudo)
      await open(page, nativeCatalogDestination("slider")!, true)
      const slider = page
        .getByTestId("native-catalog")
        .getByRole("slider", { name: "Rest interval", exact: true })
      const nativeThumb = slider.getByTestId("slider-thumb")
      const actualThumb = await paint(nativeThumb)
      const actualTrack = await paint(nativeThumb.locator(".."))
      sameNumbers(actualThumb, thumb, ["width", "height", "border"])
      expect(effectiveRadius(actualThumb)).toBe(effectiveRadius(thumb))
      sameColor(actualThumb.background, thumb.background, "slider thumb")
      sameColor(actualThumb.borderColor, thumb.borderColor, "slider thumb border")
      sameNumbers(actualTrack, track, ["height"])
      sameColor(actualTrack.background, track.background, "neutral slider track")
      expect((await slider.boundingBox())!.height).toBeGreaterThanOrEqual(48)
    })

    test("toggle outline, ghost, and inverse selected colors and type match web", async ({
      page,
    }) => {
      await open(page, "/forms#toggle")
      const reference = new Map<string, Paint>()
      for (const variant of ["outline", "ghost", "inverted"])
        reference.set(
          variant,
          await paint(
            page
              .locator(
                `#toggle [data-preview-panel="variants"] [data-slot="toggle"]:enabled[data-size="md"][data-variant="${variant}"][aria-pressed="true"]`
              )
              .last()
          )
        )
      await open(page, nativeCatalogDestination("toggle")!, true)
      for (const [variant, name, labelText] of [
        ["outline", "Pin workout", "Pin workout"],
        ["ghost", "Ghost toggle", "Ghost"],
        ["inverted", "Inverted toggle", "Inverted"],
      ]) {
        const button = page
          .getByTestId("native-catalog")
          .getByRole("button", { name: name!, exact: true })
        await button.click()
        await expect(button).toHaveAttribute("aria-pressed", "true")
        await page.mouse.move(0, 0)
        const surface = await paint(button.getByTestId("toggle-surface"))
        const label = await paint(button.getByText(labelText!, { exact: true }))
        const expected = reference.get(variant!)!
        sameColor(surface.background, expected.background, `${variant} toggle surface`)
        sameColor(surface.borderColor, expected.borderColor, `${variant} toggle border`)
        sameNumbers(surface, expected, ["height", "radius", "border"])
        sameType(label, expected)
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      }
    })

    test("tabs share selected surface, full-width underline and label typography", async ({
      page,
    }) => {
      await open(page, "/navigation-overlays#tabs")
      const web = page
        .locator(
          '#tabs [data-preview-panel="variants"] [data-slot="tabs-trigger"][aria-selected="true"]'
        )
        .first()
      const reference = await paint(web)
      const line = await paint(web, "::after")
      await open(page, nativeCatalogDestination("tabs")!, true)
      const tab = page
        .getByTestId("native-catalog")
        .getByRole("tab", { name: "Overview", exact: true })
      const surface = tab.locator(":scope > div").first()
      const actual = await paint(surface)
      const underline = await paint(surface.locator(":scope > div").last())
      sameColor(actual.background, reference.background, "selected tab")
      sameNumbers(actual, reference, ["height", "radius"])
      sameType(await paint(tab.getByText("Overview", { exact: true })), reference)
      sameColor(underline.background, line.background, "tab underline")
      sameNumbers(underline, line, ["height"])
      expect(underline.width).toBeCloseTo(actual.width, 1)
      expect(line.width).toBeCloseTo(reference.width, 1)
      expect((await tab.boundingBox())!.height).toBeGreaterThanOrEqual(48)
    })

    test("breadcrumbs keep muted links and medium current-page text", async ({ page }) => {
      await open(page, "/#breadcrumbs")
      const web = page
        .locator('#breadcrumbs [data-preview-panel="variants"] [data-slot="breadcrumbs"]')
        .first()
      const plain = await paint(web.locator('[data-slot="breadcrumb-item"] > a').first())
      const current = await paint(web.locator('[data-slot="breadcrumb-item"][aria-current="page"]'))
      await open(page, nativeCatalogDestination("breadcrumbs")!, true)
      const preview = page.getByTestId("native-catalog")
      sameType(await paint(preview.getByText("Templates", { exact: true })), plain)
      sameType(await paint(preview.getByText("Upper body A", { exact: true })), current)
      expect(
        (await preview.getByRole("link", { name: "Go to Templates", exact: true }).boundingBox())!
          .height
      ).toBeGreaterThanOrEqual(48)
    })

    test("vertical stepper shares neutral rules, mono indicators and current type", async ({
      page,
    }) => {
      await open(page, "/navigation-overlays#stepper")
      const web = page.locator(
        '#stepper [data-preview-panel="variants"] [data-slot="stepper"][data-orientation="vertical"][data-variant="progress"]'
      )
      const current = web.locator('[data-slot="stepper-item"][data-state="current"]')
      const upcoming = web.locator('[data-slot="stepper-item"][data-state="upcoming"]')
      const reference = await paint(current)
      const upcomingReference = await paint(upcoming)
      const mono = await paint(current.locator('[data-slot="stepper-indicator"]'))
      const label = await paint(current.locator('[data-slot="stepper-link"]'))
      await open(page, nativeCatalogDestination("stepper")!, true)
      const preview = page.getByTestId("native-catalog")
      const active = preview.getByRole("button", {
        name: "Choose a template, current",
        exact: true,
      })
      const next = preview.getByRole("button", { name: "Review exercises, upcoming", exact: true })
      const native = await paint(active)
      sameNumbers(native, reference, ["borderLeft"])
      sameColor(native.borderLeftColor, reference.borderLeftColor, "current step rule")
      sameColor(
        (await paint(next)).borderLeftColor,
        upcomingReference.borderLeftColor,
        "upcoming step rule"
      )
      const indicator = active.locator(":scope > div").first().locator(":scope > div").first()
      sameType(await paint(indicator), mono)
      sameType(await paint(active.getByText("Choose a template", { exact: true })), label)
      expect((await active.boundingBox())!.height).toBeGreaterThanOrEqual(48)
    })
  })
}

for (const theme of ["light", "dark"] as const) {
  test(`nine native selection canvases stay reviewable at phone width in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.addInitScript((value) => localStorage.setItem("catalog-theme", value), theme)
    for (const family of [
      "radio",
      "toggle",
      "slider",
      "tabs",
      "accordion",
      "collapsible",
      "stepper",
      "breadcrumbs",
      "tag-input",
    ]) {
      await open(page, nativeCatalogDestination(family)!, true)
      const preview = page
        .locator(`[data-native-preview-host][data-native-family="${family}"]`)
        .getByTestId("native-catalog")
      if (family === "toggle") {
        await preview.getByRole("button", { name: "Pin workout", exact: true }).click()
        await preview.getByRole("button", { name: "Inverted toggle", exact: true }).click()
      }
      expect(
        await page.locator("body").evaluate((node) => node.scrollWidth),
        family
      ).toBeLessThanOrEqual(390)
      if (family === "breadcrumbs") {
        await expect(preview.getByTestId("breadcrumb-item")).toHaveCount(3)
        for (const item of await preview.getByTestId("breadcrumb-item").all()) {
          const separator = item.getByTestId("breadcrumb-separator")
          if ((await separator.count()) === 0) continue
          const marker = (await separator.boundingBox())!
          const crumb = (await item.locator('[role="link"], [aria-current="page"]').boundingBox())!
          expect(marker.y + marker.height / 2).toBeGreaterThanOrEqual(crumb.y)
          expect(marker.y + marker.height / 2).toBeLessThanOrEqual(crumb.y + crumb.height)
        }
      }
      await preview.screenshot({
        path: testInfo.outputPath(`${family}-${theme}.png`),
        animations: "disabled",
      })
      if (family === "collapsible") {
        await preview.getByRole("button", { name: "Show previous session", exact: true }).click()
        await preview.screenshot({
          path: testInfo.outputPath(`${family}-open-${theme}.png`),
          animations: "disabled",
        })
      }
    }
  })
}
