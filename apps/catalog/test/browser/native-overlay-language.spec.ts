import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test, type Locator, type Page } from "@playwright/test"

test.setTimeout(60_000)

async function paint(locator: Locator) {
  await expect(locator).toBeVisible()
  return locator.evaluate((element) => {
    const style = getComputedStyle(element)
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const context = canvas.getContext("2d")!
    const color = (value: string) => {
      if (!CSS.supports("color", value)) throw new Error(`Unsupported computed color: ${value}`)
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      return [...context.getImageData(0, 0, 1, 1).data]
    }
    const number = (value: string) => (value === "normal" ? 0 : Number.parseFloat(value))
    return {
      color: color(style.color),
      background: color(style.backgroundColor),
      borderColor: color(style.borderTopColor),
      backdropFilter:
        style.getPropertyValue("backdrop-filter") ||
        style.getPropertyValue("-webkit-backdrop-filter") ||
        "none",
      borderWidth: number(style.borderTopWidth),
      borderLeftWidth: number(style.borderLeftWidth),
      radius: number(style.borderTopLeftRadius),
      paddingX: number(style.paddingLeft),
      paddingY: number(style.paddingTop),
      paddingBottom: number(style.paddingBottom),
      gap: number(style.columnGap),
      fontSize: number(style.fontSize),
      lineHeight: number(style.lineHeight),
      weight: style.fontWeight === "normal" ? 400 : Number.parseFloat(style.fontWeight),
      font: style.fontFamily.split(",")[0]!.replaceAll(/["']/g, "").trim(),
      tracking: number(style.letterSpacing),
      marginTop: number(style.marginTop),
      height: element.getBoundingClientRect().height,
    }
  })
}

type Paint = Awaited<ReturnType<typeof paint>>
function sameColor(actual: number[], expected: number[], label: string) {
  expect.soft(Math.abs(actual[3]! - expected[3]!), `${label} alpha`).toBeLessThanOrEqual(2)
  // Transparent fills can round significantly when Canvas unpremultiplies RGB.
  for (let channel = 0; channel < 3; channel++)
    expect
      .soft(
        Math.abs((actual[channel]! * actual[3]!) / 255 - (expected[channel]! * expected[3]!) / 255),
        `${label} channel ${channel}`
      )
      .toBeLessThanOrEqual(2)
}
function sameOpaqueNativeFallback(actual: Paint, reference: Paint, label: string) {
  // Core React Native has no backdrop blur. Its preview must expose the same
  // opaque material fallback as iOS/Android, rather than imitate web glass.
  expect(reference.backdropFilter, `${label} web blur`).toContain("blur(")
  expect(actual.backdropFilter, `${label} native blur`).toBe("none")
  expect(actual.background[3], `${label} native opaque fill`).toBe(255)
  for (let channel = 0; channel < 3; channel++)
    expect(
      Math.abs(actual.background[channel]! - reference.background[channel]!),
      `${label} material channel ${channel}`
    ).toBeLessThanOrEqual(3)
}

function sameGeometry(actual: Paint, expected: Paint, properties: (keyof Paint)[]) {
  for (const property of properties)
    expect(actual[property], property).toBeCloseTo(expected[property] as number, 2)
}
function sameType(actual: Paint, expected: Paint) {
  sameGeometry(actual, expected, ["fontSize", "lineHeight", "weight", "tracking"])
  expect(actual.font).toBe(expected.font)
  sameColor(actual.color, expected.color, "text")
}
async function open(page: Page, path: string, native = false) {
  await page.goto(path, { waitUntil: "domcontentloaded" })
  if (native) await expect(page.getByTestId("native-catalog")).toBeVisible()
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
  })
  await page.evaluate(() => document.fonts.ready)
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test.describe(`${theme} overlay design language at ${width}px`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 })
        await page.emulateMedia({ reducedMotion: "reduce" })
        await page.addInitScript((theme) => localStorage.setItem("catalog-theme", theme), theme)
      })
      test("dialog shares compact surface geometry and title/description typography", async ({
        page,
      }) => {
        await open(page, "/navigation-overlays#dialog")
        await page.locator("[data-open-catalog-dialog]").click()
        const web = page.locator('#catalog-dialog > [data-slot="dialog"]')
        const surface = await paint(web)
        const title = await paint(web.locator('[data-slot="dialog-title"]'))
        const description = await paint(web.locator('[data-slot="dialog-description"]'))
        await open(page, nativeCatalogDestination("dialog")!, true)
        await page.getByRole("button", { name: "Finish workout", exact: true }).click()
        const native = page.getByTestId("dialog-content")
        const nativeTitle = native.getByRole("heading", {
          name: "Finish this workout?",
          exact: true,
        })
        const actual = await paint(native)
        sameGeometry(actual, surface, ["radius", "borderWidth"])
        if (theme === "dark") sameOpaqueNativeFallback(actual, surface, "dialog surface")
        else sameColor(actual.background, surface.background, "dialog surface")
        sameColor(actual.borderColor, surface.borderColor, "dialog edge")
        sameType(await paint(nativeTitle), title)
        sameType(
          await paint(
            native.getByText("Your completed sets will be saved. You can add notes later.", {
              exact: true,
            })
          ),
          description
        )
        // Native separates the scroll layout from the painted modal surface.
        sameGeometry(await paint(nativeTitle.locator("../..")), surface, ["paddingX", "paddingY"])
      })
      test("action rows share square compact paint, label typography and danger state", async ({
        page,
      }) => {
        await open(page, "/navigation-overlays#dropdown-menu")
        await page.getByRole("button", { name: "Open project actions", exact: true }).click()
        const web = page
          .locator('#catalog-project-actions [data-slot="dropdown-menu-item"]')
          .first()
        await web.hover()
        const row = await paint(web)
        const webDanger = page.locator(
          '#catalog-project-actions [data-slot="dropdown-menu-item"][data-variant="danger"]'
        )
        await webDanger.hover()
        const danger = await paint(webDanger)
        await open(page, nativeCatalogDestination("dropdown-menu")!, true)
        await page.getByRole("button", { name: "Workout actions", exact: true }).click()
        const native = page.getByRole("button", { name: "Duplicate workout", exact: true })
        await native.focus()
        const nativeSurface = native.getByTestId("dropdown-menu-item-surface")
        await expect.poll(async () => (await paint(nativeSurface)).background[3]).toBeGreaterThan(0)
        const actual = await paint(nativeSurface)
        sameGeometry(actual, row, [
          "height",
          "radius",
          "paddingX",
          "paddingY",
          "gap",
          "borderLeftWidth",
        ])
        sameType(await paint(native.getByText("Duplicate workout", { exact: true })), row)
        sameColor(actual.background, row.background, "highlighted action")
        expect((await native.boundingBox())!.height).toBeGreaterThanOrEqual(48)
        const nativeDanger = page.getByRole("button", { name: "Archive workout", exact: true })
        await nativeDanger.focus()
        const dangerSurface = nativeDanger.getByTestId("dropdown-menu-item-surface")
        await expect.poll(async () => (await paint(dangerSurface)).background[3]).toBeGreaterThan(0)
        const dangerPaint = await paint(dangerSurface)
        sameGeometry(dangerPaint, danger, ["radius", "borderLeftWidth"])
        sameColor(dangerPaint.background, danger.background, "danger highlight")
        sameType(await paint(nativeDanger.getByText("Archive workout", { exact: true })), danger)
      })
      test("popover keeps its header spacing and small title/description hierarchy", async ({
        page,
      }) => {
        await open(page, "/navigation-overlays#popover")
        await page.getByRole("button", { name: "Open account actions", exact: true }).click()
        const web = page.locator("#catalog-account-popover")
        const surface = await paint(web)
        const header = await paint(web.locator('[data-slot="popover-header"]'))
        const title = await paint(web.locator('[data-slot="popover-title"]'))
        const description = await paint(web.locator('[data-slot="popover-description"]'))
        await open(page, nativeCatalogDestination("popover")!, true)
        await page.getByRole("button", { name: "About recovery score", exact: true }).click()
        const native = page.getByTestId("dialog-content")
        const nativeTitle = native.getByText("Recovery score", { exact: true })
        sameGeometry(await paint(native), surface, ["radius", "borderWidth"])
        sameOpaqueNativeFallback(await paint(native), surface, "popover surface")
        sameType(await paint(nativeTitle), title)
        sameType(
          await paint(
            native.getByText(
              "A rough guide based on rest and recent training. Use how you feel to decide whether to adjust your session.",
              { exact: true }
            )
          ),
          description
        )
        sameGeometry(await paint(nativeTitle.locator("../..")), header, [
          "paddingX",
          "paddingY",
          "gap",
        ])
      })
      test("tap help preserves the web tooltip inverse fill and compact type", async ({ page }) => {
        await open(page, "/navigation-overlays#tooltip")
        await page.locator("#catalog-tooltip-trigger").focus()
        const reference = await paint(page.locator("#catalog-tooltip"))
        await open(page, nativeCatalogDestination("tooltip")!, true)
        const trigger = page.getByRole("button", {
          name: "Explain repetitions in reserve",
          exact: true,
        })
        await trigger.click()
        const actual = await paint(
          page
            .getByTestId("tooltip-content")
            .getByText(
              "Stop when you could still perform about two more repetitions with good form.",
              { exact: true }
            )
        )
        sameType(actual, reference)
        sameGeometry(actual, reference, ["radius", "borderWidth", "paddingX", "paddingY"])
        sameColor(actual.background, reference.background, "tooltip inverse fill")
        sameColor(actual.borderColor, reference.borderColor, "tooltip edge")
        expect((await trigger.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      })
      test("toast shares the note tint, floating radius and title/description hierarchy", async ({
        page,
      }) => {
        await open(page, "/layout-feedback#toast")
        const web = page.locator(
          '#toast [data-preview-panel="variants"] [data-slot="toast"][data-variant="note"]'
        )
        const surface = await paint(web)
        const title = await paint(web.locator('[data-slot="toast-title"]'))
        const description = await paint(web.locator('[data-slot="toast-description"]'))
        await open(page, nativeCatalogDestination("toast")!, true)
        const nativeTitle = page
          .getByTestId("native-catalog")
          .getByText("Set removed", { exact: true })
        const actual = await paint(nativeTitle.locator(".."))
        sameGeometry(actual, surface, [
          "radius",
          "borderWidth",
          "paddingX",
          "paddingY",
          "paddingBottom",
        ])
        sameOpaqueNativeFallback(actual, surface, "toast note fill")
        sameColor(actual.borderColor, surface.borderColor, "toast note edge")
        sameType(await paint(nativeTitle), title)
        const nativeDescription = await paint(
          page.getByText("Undo restores it to this session.", { exact: true })
        )
        sameType(nativeDescription, description)
        sameGeometry(nativeDescription, description, ["marginTop"])
      })
    })
  }
}
