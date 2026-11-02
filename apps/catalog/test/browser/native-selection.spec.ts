import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test } from "@playwright/test"

test.setTimeout(60_000)

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test.describe(`${theme} native selection at ${width}px`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.addInitScript((mode) => localStorage.setItem("catalog-theme", mode), theme)
      })

      test("radio navigation keeps selection, focus, and disabled state coherent", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("radio")!, { waitUntil: "domcontentloaded" })
        const strength = page.getByRole("radio", { name: "Strength", exact: true })
        const hypertrophy = page.getByRole("radio", { name: "Hypertrophy", exact: true })
        const conditioning = page.getByRole("radio", { name: "Conditioning", exact: true })
        await expect(hypertrophy).toBeChecked()
        await hypertrophy.focus()
        await page.keyboard.press("ArrowRight")
        await expect(conditioning).toBeChecked()
        await expect(conditioning).toBeFocused()
        await page.keyboard.press("Home")
        await expect(strength).toBeChecked()
        await strength.press("Space")
        await expect(strength).toBeChecked()
        await expect(page.getByRole("radio", { name: "Recovery plan unavailable" })).toBeDisabled()
        expect(
          await strength.evaluate((node) => node.getBoundingClientRect().height)
        ).toBeGreaterThanOrEqual(48)
        await expect(strength.getByTestId("radio-indicator")).toHaveCSS("outline-width", "2px")
      })

      test("toggle supports pointer, keyboard, uncontrolled, and disabled states", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("toggle")!, { waitUntil: "domcontentloaded" })
        const pin = page.getByRole("button", { name: "Pin workout", exact: true })
        await expect(pin).toHaveAttribute("aria-pressed", "false")
        await pin.click()
        await expect(pin).toHaveAttribute("aria-pressed", "true")
        await pin.press("Space")
        await expect(pin).toHaveAttribute("aria-pressed", "false")
        const warmup = page.getByRole("button", { name: "Include warm-up", exact: true })
        await expect(warmup).toHaveAttribute("aria-pressed", "true")
        await warmup.click()
        await expect(warmup).toHaveAttribute("aria-pressed", "false")
        await expect(page.getByRole("button", { name: "Unavailable setting" })).toBeDisabled()
      })

      test("slider clamps keyboard adjustment and exposes an accessible value", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("slider")!, { waitUntil: "domcontentloaded" })
        const interval = page.getByRole("slider", { name: "Rest interval", exact: true })
        await expect(interval).toHaveAttribute("aria-valuenow", "90")
        await interval.focus()
        await page.keyboard.press("ArrowRight")
        await expect(interval).toHaveAttribute("aria-valuenow", "105")
        await expect(page.getByText("Saved interval: 105 seconds", { exact: true })).toBeVisible()
        await page.keyboard.press("End")
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        await page.keyboard.press("ArrowRight")
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        await page.keyboard.press("Home")
        await expect(interval).toHaveAttribute("aria-valuenow", "30")
        await expect(
          page.getByRole("slider", { name: "Locked target", exact: true })
        ).toBeDisabled()
        await page.evaluate(() => document.fonts.ready)
        const box = await interval.boundingBox()
        if (!box) throw new Error("Slider has no layout")
        await interval.click({ position: { x: box.width - 11, y: box.height / 2 } })
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        await page.mouse.move(box.x + box.width - 11, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + 11, box.y + box.height / 2, { steps: 8 })
        await page.mouse.up()
        await expect(interval).toHaveAttribute("aria-valuenow", "30")
        await expect(page.getByText("Saved interval: 30 seconds", { exact: true })).toBeVisible()
        await page.mouse.move(box.x + 11, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 })
        await expect(interval).not.toHaveAttribute("aria-valuenow", "30")
        await interval.dispatchEvent("contextmenu")
        await expect(interval).toHaveAttribute("aria-valuenow", "30")
        await page.mouse.up()
        await expect(page.getByText("Saved interval: 30 seconds", { exact: true })).toBeVisible()
        await interval.click({ position: { x: box.width - 11, y: box.height / 2 } })
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        expect(box.height).toBeGreaterThanOrEqual(48)
        const touch = async (
          type: "touchstart" | "touchmove" | "touchend" | "touchcancel",
          x: number,
          y: number
        ) => {
          await interval.evaluate(
            (node, { type, x, y }) => {
              const point = {
                identifier: 1,
                target: node,
                clientX: x,
                clientY: y,
                pageX: x + scrollX,
                pageY: y + scrollY,
                screenX: x,
                screenY: y,
                force: 1,
              }
              const active = type === "touchend" || type === "touchcancel" ? [] : [point]
              const event = new Event(type, { bubbles: true, cancelable: true })
              Object.defineProperties(event, {
                touches: { value: active },
                targetTouches: { value: active },
                changedTouches: { value: [point] },
              })
              node.dispatchEvent(event)
            },
            { type, x, y }
          )
        }
        // Exercise the same responder path with touch events without requiring browser-specific CDP.
        await interval.press("Home")
        await touch("touchstart", box.x + 11, box.y + box.height / 2)
        await touch("touchmove", box.x + 30, box.y + box.height / 2)
        await touch("touchmove", box.x + box.width - 11, box.y + box.height / 2)
        await touch("touchend", box.x + box.width - 11, box.y + box.height / 2)
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        await expect(page.getByText("Saved interval: 180 seconds", { exact: true })).toBeVisible()
        await touch("touchstart", box.x + box.width - 11, box.y + box.height / 2)
        await touch("touchmove", box.x + box.width / 2, box.y + box.height / 2)
        await expect(interval).not.toHaveAttribute("aria-valuenow", "180")
        await touch("touchcancel", box.x + box.width / 2, box.y + box.height / 2)
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        await expect(page.getByText("Saved interval: 180 seconds", { exact: true })).toBeVisible()
        await touch("touchstart", box.x + box.width / 2, box.y + box.height / 2)
        await touch("touchmove", box.x + box.width / 2, box.y + box.height / 2 + 30)
        await expect(interval).toHaveAttribute("aria-valuenow", "180")
        await touch("touchcancel", box.x + box.width / 2, box.y + box.height / 2 + 30)
      })

      test("tabs expose one panel and allow roving keyboard focus", async ({ page }) => {
        await page.goto(nativeCatalogDestination("tabs")!, { waitUntil: "domcontentloaded" })
        const preview = page.getByTestId("native-catalog")
        const overview = preview.getByRole("tab", { name: "Overview", exact: true })
        const exercises = preview.getByRole("tab", { name: "Exercises", exact: true })
        await expect(overview).toHaveAttribute("aria-selected", "true")
        await overview.focus()
        await page.keyboard.press("ArrowRight")
        await expect(exercises).toBeFocused()
        await expect(exercises).toHaveAttribute("aria-selected", "true")
        await expect(preview.getByRole("tabpanel")).toHaveCount(1)
        await expect(preview.getByRole("tabpanel")).toHaveText(
          "Bench press, row, overhead press, pulldown."
        )
        await page.keyboard.press("End")
        await expect(preview.getByRole("tab", { name: "History", exact: true })).toBeFocused()
        await expect(preview.getByRole("tabpanel")).toHaveText("Last completed Monday.")
      })

      test("accordion and collapsible remove closed content and expose expansion", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("accordion")!, { waitUntil: "domcontentloaded" })
        const rest = page.getByRole("button", { name: "How long should I rest?", exact: true })
        const warmup = page.getByRole("button", { name: "Do warm-up sets count?", exact: true })
        await expect(rest).toHaveAttribute("aria-expanded", "true")
        await warmup.click()
        await expect(rest).toHaveAttribute("aria-expanded", "false")
        await expect(warmup).toHaveAttribute("aria-expanded", "true")
        await expect(
          page.getByTestId("native-catalog").getByText("Start with 90 seconds", { exact: false })
        ).toHaveCount(0)
        await warmup.press("Enter")
        await expect(warmup).toHaveAttribute("aria-expanded", "false")
        await page.goto(nativeCatalogDestination("collapsible")!, { waitUntil: "domcontentloaded" })
        const trigger = page.getByRole("button", { name: "Show previous session", exact: true })
        await expect(trigger).toHaveAttribute("aria-expanded", "false")
        await trigger.click()
        await expect(page.getByText("Bench press · 3 × 8 at 60 kg", { exact: true })).toBeVisible()
        await trigger.press("Space")
        await expect(page.getByText("Bench press · 3 × 8 at 60 kg", { exact: true })).toHaveCount(0)
      })

      test("stepper, breadcrumb and pagination callbacks produce meaningful state", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("stepper")!, { waitUntil: "domcontentloaded" })
        const next = page.getByRole("button", { name: "Next step", exact: true })
        await next.click()
        await expect(
          page.getByRole("button", { name: "Review exercises, current", exact: true })
        ).toHaveAttribute("aria-current", "step")
        await next.click()
        await expect(next).toBeDisabled()
        await page.goto(nativeCatalogDestination("breadcrumbs")!, { waitUntil: "domcontentloaded" })
        await page.getByRole("link", { name: "Go to Templates", exact: true }).click()
        await expect(
          page.getByText("Selected destination: Templates", { exact: true })
        ).toBeVisible()
        await page.goto(nativeCatalogDestination("pagination")!, { waitUntil: "domcontentloaded" })
        await expect(
          page.getByRole("button", { name: "Previous page", exact: true })
        ).toBeDisabled()
        await page.getByRole("button", { name: "Page 3", exact: true }).click()
        await expect(page.getByRole("button", { name: "Next page", exact: true })).toBeDisabled()
        await expect(page.getByRole("button", { name: "Page 3", exact: true })).toHaveAttribute(
          "aria-current",
          "page"
        )
        await expect(page.getByText("Two weeks ago: 2 sessions", { exact: true })).toBeVisible()
      })

      test("tag input adds, deduplicates, removes and locks tags", async ({ page }) => {
        await page.goto(nativeCatalogDestination("tag-input")!, { waitUntil: "domcontentloaded" })
        const input = page.getByRole("textbox", { name: "New template tag", exact: true })
        await input.fill("  Mobility  ")
        await input.press("Enter")
        await expect(
          page.getByRole("button", { name: "Remove Mobility", exact: true })
        ).toBeVisible()
        await input.fill("Strength")
        await page.getByRole("button", { name: "Add tag", exact: true }).first().click()
        await expect(
          page.getByRole("button", { name: "Remove Strength", exact: true })
        ).toHaveCount(1)
        await page.getByRole("button", { name: "Remove Mobility", exact: true }).click()
        await expect(input).toBeFocused()
        await expect(page.getByText("2 tags selected", { exact: true })).toBeVisible()
        const longTag = "W".repeat(32)
        await input.fill(longTag)
        await input.press("Enter")
        const chip = page.getByRole("button", { name: `Remove ${longTag}`, exact: true })
        await expect(chip).toBeVisible()
        expect(
          await chip.evaluate((node) => node.getBoundingClientRect().right)
        ).toBeLessThanOrEqual(width)
        await expect(
          page.getByRole("button", { name: "Remove Archived", exact: true })
        ).toBeDisabled()
        await expect(
          page.getByRole("textbox", { name: "Locked tag input", exact: true })
        ).not.toBeEditable()
        expect(await page.locator("body").evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
          width
        )
      })
    })
  }
}
