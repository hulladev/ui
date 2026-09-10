import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"]) {
  for (const variant of ["primary", "secondary", "outline", "inverted", "danger"]) {
    test(`${variant} button preserves contrast and visible hover in ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.goto("/#button", { waitUntil: "domcontentloaded" })
      await page.locator("html").evaluate((element, value) => {
        element.dataset.theme = value
      }, theme)
      const preview = page.getByRole("region", { name: "Button", exact: true })
      await preview.getByRole("tab", { name: "Props", exact: true }).click()
      await preview.getByRole("combobox", { name: "Button variant" }).selectOption(variant)
      const button = preview.getByRole("button", { name: "Preview action" })
      const sample = () =>
        button.evaluate((element) => {
          const canvas = document.createElement("canvas")
          canvas.width = canvas.height = 1
          const context = canvas.getContext("2d", { willReadFrequently: true })!
          const rgba = (color: string) => {
            context.clearRect(0, 0, 1, 1)
            context.fillStyle = color
            context.fillRect(0, 0, 1, 1)
            return Array.from(context.getImageData(0, 0, 1, 1).data).map((n) => n / 255)
          }
          const over = (front: number[], back: number[]) =>
            front.slice(0, 3).map((v, i) => v * front[3]! + back[i]! * (1 - front[3]!))
          const luminance = (color: number[]) =>
            color
              .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i]!, 0)
          const ancestors: Element[] = []
          for (let node: Element | null = element; node; node = node.parentElement)
            ancestors.unshift(node)
          let background = [1, 1, 1]
          for (const node of ancestors)
            background = over(rgba(getComputedStyle(node).backgroundColor), background)
          const style = getComputedStyle(element)
          const foreground = over(rgba(style.color), background)
          const a = luminance(foreground),
            b = luminance(background)
          return {
            background,
            foreground,
            contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
          }
        })
      await page.mouse.move(0, 0)
      const rest = await sample()
      await button.hover()
      const hover = await sample()
      await page.mouse.down()
      const pressed = await sample()
      await page.mouse.up()
      for (const [name, state] of Object.entries({ rest, hover, pressed }))
        expect(state.contrast, name).toBeGreaterThanOrEqual(4.5)
      expect(
        Math.max(...hover.background.map((v, i) => Math.abs(v - rest.background[i]!))) * 255
      ).toBeGreaterThanOrEqual(10)
      await preview.getByRole("switch", { name: "Disabled", exact: true }).check()
      await expect(button).toBeDisabled()
      await page.mouse.move(0, 0)
      const disabled = await sample()
      await button.hover()
      expect(await sample()).toEqual(disabled)
    })
  }
}
