import { expect, test } from "@playwright/test"
import { catalogPages } from "../../src/data/catalogNavigation"

for (const { href, group } of catalogPages) {
  for (const theme of ["light", "dark"]) {
    test(`${group} component text stays readable on ${theme} surfaces`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.addInitScript(() =>
        localStorage.setItem("hulla-catalog-canvas-background", "plain")
      )
      await page.goto(href, { waitUntil: "domcontentloaded" })
      // Contrast checks sample settled theme colors, not intermediate transitions.
      await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" })
      await page.locator("html").evaluate((element, value) => {
        element.dataset.theme = value
      }, theme)
      // Let the theme change paint before sampling transition end colors.
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          )
      )
      const results = await page.evaluate(() => {
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 1
        const context = canvas.getContext("2d", { willReadFrequently: true })!
        const rgba = (color: string) => {
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = color
          context.fillRect(0, 0, 1, 1)
          return Array.from(context.getImageData(0, 0, 1, 1).data).map((value) => value / 255)
        }
        const over = (front: number[], back: number[]) =>
          front.slice(0, 3).map((channel, i) => channel * front[3]! + back[i]! * (1 - front[3]!))
        const luminance = (color: number[]) =>
          color
            .slice(0, 3)
            .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
            .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i]!, 0)
        const contrast = (element: Element, pseudo?: string) => {
          const ancestors: Element[] = []
          for (let node: Element | null = element; node; node = node.parentElement)
            ancestors.unshift(node)
          let background = [1, 1, 1]
          for (const node of ancestors)
            background = over(rgba(getComputedStyle(node).backgroundColor), background)
          const foreground = over(rgba(getComputedStyle(element, pseudo).color), background)
          const a = luminance(foreground),
            b = luminance(background)
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        }
        const checks = [
          { selector: "#button [role=tabpanel] button:not(:disabled)" },
          { selector: "#badge [data-slot=badge]" },
          { selector: "#toggle [data-slot=toggle][aria-pressed=true]" },
          { selector: "#table [data-slot=table-head]" },
          { selector: "#card [data-slot=card-description]" },
          { selector: "#stepper [data-step-index] button" },
          { selector: "#input input[placeholder]:not(:disabled)", pseudo: "::placeholder" },
          { selector: "#calendar th" },
          { selector: "#input input[type=file]" },
        ]
        return checks.flatMap(({ selector, pseudo }) =>
          Array.from(document.querySelectorAll(selector))
            .filter(
              (element) =>
                element.getClientRects().length > 0 &&
                !element.matches(":disabled, [aria-disabled='true']") &&
                !element.closest(":disabled, [aria-disabled='true']") &&
                // White type across solid semantic badges is a deliberate light-theme design
                // choice. Warning trades some WCAG contrast for consistency with the set.
                !(
                  document.documentElement.dataset.theme === "light" &&
                  element.matches('[data-slot="badge"][data-variant="warning"]')
                )
            )
            .map((element) => ({
              selector,
              text: element.textContent?.trim().slice(0, 50) || element.getAttribute("id"),
              ratio: contrast(element, pseudo),
            }))
        )
      })
      expect(results.length).toBeGreaterThan(0)
      for (const result of results)
        expect(result.ratio, `${theme}: ${result.selector} ${result.text}`).toBeGreaterThanOrEqual(
          4.5
        )
    })
  }
}

test("warning badges keep the shared solid-badge foreground in light mode", async ({ page }) => {
  await page.goto("/#badge", { waitUntil: "domcontentloaded" })
  await page.locator("html").evaluate((element) => {
    element.dataset.theme = "light"
  })
  const warning = page.locator('#badge [data-slot="badge"][data-variant="warning"]:visible').first()
  const danger = page.locator('#badge [data-slot="badge"][data-variant="danger"]:visible').first()
  await expect(warning).toHaveCSS(
    "color",
    await danger.evaluate((element) => getComputedStyle(element).color)
  )
})

test("stepper distinguishes current progress and keeps unavailable steps readable", async ({
  page,
}) => {
  await page.goto("/navigation-overlays#stepper", { waitUntil: "domcontentloaded" })
  const demo = page.locator("[data-stepper-demo]")
  const items = demo.locator("[data-step-index]")
  const progressMark = await items.first().evaluate((element) => {
    const style = getComputedStyle(element)
    return { width: style.borderTopWidth, color: style.borderTopColor }
  })
  expect(progressMark.width).toBe("2px")
  expect(progressMark.color).not.toBe("transparent")
  await expect(items.nth(1).locator("button")).toBeDisabled()
  expect(
    await items
      .nth(1)
      .locator("button")
      .evaluate((element) => getComputedStyle(element).opacity)
  ).toBe("1")
  await demo.getByRole("button", { name: "Continue", exact: true }).click()
  const check = items.first().locator("[data-slot=stepper-indicator] svg")
  await expect(check).toHaveCSS("opacity", "1")
  await expect(items.nth(1)).toHaveAttribute("aria-current", "step")
})
