import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test, type Locator, type Page } from "@playwright/test"

test.setTimeout(60_000)

async function paint(locator: Locator) {
  await expect(locator).toBeVisible()
  return locator.evaluate((node) => {
    const style = getComputedStyle(node)
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
      borderBottomColor: rgba(style.borderBottomColor),
      border: number(style.borderTopWidth),
      borderLeft: number(style.borderLeftWidth),
      borderBottom: number(style.borderBottomWidth),
      radius: number(style.borderTopLeftRadius),
      paddingX: number(style.paddingLeft),
      paddingY: number(style.paddingTop),
      fontSize: number(style.fontSize),
      lineHeight: number(style.lineHeight),
      fontWeight: style.fontWeight === "normal" ? 400 : Number.parseFloat(style.fontWeight),
      font: style.fontFamily.split(",")[0]!.trim().replaceAll(/["']/g, ""),
      tracking: number(style.letterSpacing),
      gap: number(style.rowGap),
      marginTop: number(style.marginTop),
      width: node.getBoundingClientRect().width,
      height: node.getBoundingClientRect().height,
    }
  })
}

type Paint = Awaited<ReturnType<typeof paint>>

function sameColor(actual: number[], expected: number[], label: string) {
  expect(Math.abs(actual[3]! - expected[3]!), `${label}: alpha`).toBeLessThanOrEqual(2)
  // Canvas unpremultiplication can round RGB significantly for a 5% fill.
  // Premultiplied channels compare its actual paint, including transparency.
  for (let channel = 0; channel < 3; channel++) {
    expect(
      Math.abs((actual[channel]! * actual[3]!) / 255 - (expected[channel]! * expected[3]!) / 255),
      `${label}: channel ${channel}`
    ).toBeLessThanOrEqual(2)
  }
}

function sameNumbers(actual: Paint, expected: Paint, properties: (keyof Paint)[]) {
  for (const property of properties)
    expect(actual[property], property).toBeCloseTo(expected[property] as number, 2)
}

function sameType(actual: Paint, expected: Paint) {
  sameNumbers(actual, expected, ["fontSize", "lineHeight", "fontWeight", "tracking"])
  expect(actual.font).toBe(expected.font)
  sameColor(actual.color, expected.color, "text")
}

async function open(page: Page, path: string, native = false) {
  await page.goto(path, { waitUntil: "domcontentloaded" })
  if (native) await expect(page.getByTestId("native-catalog")).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(0, 0)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  )
}

const variants = (page: Page, family: string) =>
  page.locator(`#${family} [data-preview-panel="variants"]`).first()

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} native content follows the web design language`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 1000 })
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.addInitScript((value) => localStorage.setItem("catalog-theme", value), theme)
    })

    test("LinkCard shares the borderless row, typography, spacing, and current-page paint", async ({
      page,
    }) => {
      await open(page, "/layout-feedback#link-card")
      const web = variants(page, "link-card").locator('[data-slot="link-card"]').first()
      const current = variants(page, "link-card").locator(
        '[data-slot="link-card"][aria-current="page"]'
      )
      const row = await paint(web)
      const title = await paint(web.locator('[data-slot="link-card-title"]'))
      const description = await paint(web.locator('[data-slot="link-card-description"]'))
      const content = await paint(web.locator('[data-slot="link-card-content"]'))
      const selectedRow = await paint(current)
      const selectedTitle = await paint(current.locator('[data-slot="link-card-title"]'))

      await open(page, nativeCatalogDestination("link-card")!, true)
      const native = page
        .getByTestId("native-catalog")
        .getByRole("link", { name: "Open workout history", exact: true })
      const nativeTitle = native.getByText("Workout history", { exact: true })
      const actual = await paint(native)
      sameNumbers(actual, row, ["border", "radius", "paddingX", "paddingY", "gap"])
      expect(actual.border).toBe(0)
      sameColor(actual.background, row.background, "unselected LinkCard")
      sameType(await paint(nativeTitle), title)
      sameType(
        await paint(
          native.getByText("Review previous sessions and follow your progress.", { exact: true })
        ),
        description
      )
      sameNumbers(await paint(nativeTitle.locator("..")), content, ["gap"])
      expect(actual.height).toBeGreaterThanOrEqual(48)
      await native.click()
      await page.mouse.move(0, 0)
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          )
      )
      await expect(native).toHaveAttribute("aria-current", "page")
      sameColor((await paint(native)).background, selectedRow.background, "current LinkCard")
      sameType(await paint(nativeTitle), selectedTitle)
    })

    test("Alert shares subtle mixed fills, uniform borders, title tracking, and description spacing", async ({
      page,
    }) => {
      await open(page, "/layout-feedback#alert")
      const web = variants(page, "alert").locator('[data-slot="alert"][data-variant="note"]')
      const root = await paint(web)
      const title = await paint(web.locator('[data-slot="alert-title"]'))
      const description = await paint(web.locator('[data-slot="alert-description"]'))
      const warning = await paint(
        variants(page, "alert").locator('[data-slot="alert"][data-variant="warning"]')
      )

      await open(page, nativeCatalogDestination("alert")!, true)
      const native = page.getByTestId("native-catalog")
      const nativeTitle = native.getByText("Session stays on this device", { exact: true })
      const actual = await paint(nativeTitle.locator(".."))
      sameNumbers(actual, root, ["border", "borderLeft", "radius", "paddingX", "paddingY"])
      expect(actual.borderLeft).toBe(1)
      sameColor(actual.background, root.background, "note background")
      sameColor(actual.borderColor, root.borderColor, "note border")
      sameType(await paint(nativeTitle), title)
      const nativeDescription = await paint(
        native.getByText("You can continue logging sets while offline.", { exact: true })
      )
      sameType(nativeDescription, description)
      sameNumbers(nativeDescription, description, ["marginTop"])
      const nativeWarning = await paint(
        native.getByText("Check your equipment", { exact: true }).locator("..")
      )
      sameColor(nativeWarning.background, warning.background, "warning background")
      sameColor(nativeWarning.borderColor, warning.borderColor, "warning border")
      // Web's warning composition includes an icon and wider left inset; the
      // native example omits it, so only shared variant paint is compared there.
    })

    test("Avatar keeps the default 32-unit circle and initials typography", async ({ page }) => {
      await open(page, "/#avatar")
      const web = variants(page, "avatar").locator(
        '[data-slot="avatar"][aria-label="Initials, md avatar"]'
      )
      const root = await paint(web)
      const initials = await paint(web.locator('[data-slot="avatar-fallback"]'))
      await open(page, nativeCatalogDestination("avatar")!, true)
      const native = page
        .getByTestId("native-catalog")
        .getByRole("img", { name: "Sam Lee", exact: true })
      const actual = await paint(native)
      sameNumbers(actual, root, ["width", "height"])
      expect(actual.width).toBe(32)
      expect(actual.radius).toBeGreaterThanOrEqual(actual.width / 2)
      expect(root.radius).toBeGreaterThanOrEqual(root.width / 2)
      sameColor(actual.background, root.background, "avatar root background")
      const nativeInitials = await paint(native.getByText("SL", { exact: true }))
      sameNumbers(nativeInitials, initials, ["fontSize", "fontWeight", "tracking"])
      expect(nativeInitials.font).toBe(initials.font)
      sameColor(nativeInitials.color, initials.color, "initials")
      // Native border and web inset ring preserve circle geometry through
      // different paint mechanisms; text centering need not share line boxes.
    })

    test("Progress shares the thin neutral track and primary fill", async ({ page }) => {
      await open(page, "/#progress")
      const web = await paint(page.locator("#progress-default"))
      await open(page, nativeCatalogDestination("progress")!, true)
      const progress = page
        .getByTestId("native-catalog")
        .getByRole("progressbar", { name: "Workout progress", exact: true })
      const actual = await paint(progress)
      sameNumbers(actual, web, ["height", "border"])
      sameColor(actual.background, web.background, "progress track")
      sameColor(
        (await paint(progress.locator(":scope > div").first())).background,
        web.color,
        "progress fill"
      )
      expect(actual.radius).toBeGreaterThanOrEqual(actual.height / 2)
      expect(web.radius).toBeGreaterThanOrEqual(web.height / 2)
      // Indeterminate native progress deliberately does not require animation.
    })

    test("Skeleton shares the neutral fill and radius while geometry remains composable", async ({
      page,
    }) => {
      await open(page, "/#skeleton")
      const web = await paint(
        variants(page, "skeleton")
          .locator('[aria-label="Loading feature article"] [data-slot="skeleton"]')
          .nth(1)
      )
      await open(page, nativeCatalogDestination("skeleton")!, true)
      const actual = await paint(
        page
          .getByTestId("native-catalog")
          .getByLabel("Workout summary", { exact: true })
          .locator(":scope > div")
          .first()
      )
      sameNumbers(actual, web, ["radius"])
      sameColor(actual.background, web.background, "skeleton fill")
      // Custom placeholder width/height do not define the shared recipe.
      // Reduced motion settles web pulse without injecting preview styles.
    })

    test("Table shares header type and tint, separators, and cell padding", async ({ page }) => {
      await open(page, "/layout-feedback#table")
      const web = variants(page, "table").locator('[data-slot="table"][data-variant="divided"]')
      const header = web.locator('[data-slot="table-header"]')
      const heading = await paint(header.locator('[data-slot="table-head"]').first())
      const tint = await paint(header)
      const cell = await paint(web.locator('[data-slot="table-cell"]').nth(1))
      const surface = await paint(web)
      await open(page, nativeCatalogDestination("table")!, true)
      const native = page.getByTestId("native-catalog")
      const nativeHeading = await paint(native.getByText("Exercise", { exact: true }))
      sameNumbers(nativeHeading, heading, ["fontSize", "fontWeight", "tracking"])
      expect(nativeHeading.font).toBe(heading.font)
      sameColor(nativeHeading.color, heading.color, "table header text")
      // Native's 13/20 text grid keeps a 20-unit line box. Web derives 18.5714
      // from its inherited unitless ratio; only this font line box may differ.
      expect(nativeHeading.lineHeight).toBe(20)
      expect(Math.abs(nativeHeading.lineHeight - heading.lineHeight)).toBeLessThanOrEqual(2)
      sameNumbers(nativeHeading, heading, ["paddingX", "paddingY"])
      sameColor(nativeHeading.background, tint.background, "table header fill")
      sameColor(
        (await paint(native.getByLabel("Recent sets, horizontally scrollable", { exact: true })))
          .background,
        surface.background,
        "table surface"
      )
      const nativeCell = await paint(native.getByText("60 kg", { exact: true }))
      sameType(nativeCell, cell)
      sameNumbers(nativeCell, cell, ["paddingX", "paddingY"])
      const row = await paint(native.getByText("Exercise", { exact: true }).locator(".."))
      sameNumbers(row, heading, ["borderBottom"])
      sameColor(row.borderBottomColor, heading.borderBottomColor, "table separator")
      // Native columns retain readable widths and horizontal scrolling; web
      // content-driven column widths are intentionally not compared.
    })

    test("Code preserves the inline recipe relative to surrounding text size", async ({ page }) => {
      await open(page, "/#code")
      const webCode = variants(page, "code").locator('[data-slot="code"]').first()
      const web = await paint(webCode)
      const webText = await paint(webCode.locator(".."))
      await open(page, nativeCatalogDestination("code")!, true)
      const native = page.getByTestId("native-catalog")
      const code = await paint(native.getByLabel("Template identifier", { exact: true }))
      const body = await paint(native.getByText("Template identifier", { exact: true }))
      expect(code.fontSize / body.fontSize).toBeCloseTo(0.875, 3)
      expect(web.fontSize / webText.fontSize).toBeCloseTo(0.875, 3)
      expect(code.paddingX / code.fontSize).toBeCloseTo(web.paddingX / web.fontSize, 3)
      expect(code.paddingY / code.fontSize).toBeCloseTo(web.paddingY / web.fontSize, 3)
      expect(code.radius / code.fontSize).toBeCloseTo(web.radius / web.fontSize, 3)
      expect(code.fontWeight).toBe(web.fontWeight)
      expect(code.font).toBe(web.font)
      sameColor(code.background, web.background, "inline code fill")
      sameColor(code.color, web.color, "inline code text")
    })
  })
}
