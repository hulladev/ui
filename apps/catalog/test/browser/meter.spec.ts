import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#meter", { waitUntil: "domcontentloaded" })
})

test("preserves native meter semantics and threshold attributes", async ({ page }) => {
  const meter = page.getByRole("meter", { name: "Storage" })

  await expect(meter).toHaveJSProperty("tagName", "METER")
  await expect(meter).toHaveAttribute("min", "0")
  await expect(meter).toHaveAttribute("max", "24")
  await expect(meter).toHaveAttribute("low", "12")
  await expect(meter).toHaveAttribute("high", "21")
  await expect(meter).toHaveAttribute("optimum", "8")
})

test("updates the native value in the playground", async ({ page }) => {
  const preview = page.locator('[data-preview-component="meter-preview"]')
  const control = preview.locator("[data-meter-value]")
  const meter = preview.locator("[data-playground-meter]")

  await preview.getByRole("tab", { name: "Native range" }).click()
  await control.fill("42")

  await expect(meter).toHaveJSProperty("value", 42)
  await expect(preview.locator("[data-meter-output]")).toHaveText("42 / 100")
})

test("fits measurement cards at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#meter", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="meter-preview"]')
  const box = await preview.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})

test("Firefox meter thresholds use the shared semantic palette", async ({ page, browserName }) => {
  test.skip(
    browserName !== "firefox",
    "Firefox exposes its native meter fill through this pseudo-element"
  )
  const meter = page.getByRole("meter", { name: "Storage" })
  for (const theme of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => {
      element.dataset.theme = value
    }, theme)
    for (const [value, token] of [
      [8, "success"],
      [18, "warning"],
      [23, "danger"],
    ] as const) {
      const colors = await meter.evaluate(
        (element, state) => {
          ;(element as HTMLMeterElement).value = state.value
          const probe = document.createElement("span")
          probe.style.backgroundColor = `var(--color-${state.token})`
          element.parentElement!.append(probe)
          const expected = getComputedStyle(probe).backgroundColor
          const actual = getComputedStyle(element, "::-moz-meter-bar").backgroundColor
          probe.remove()
          return { actual, expected }
        },
        { value, token }
      )
      expect(colors.actual, `${theme} ${token}`).toBe(colors.expected)
    }
  }
})
