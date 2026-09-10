import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/forms#slider", { waitUntil: "domcontentloaded" })
})

test("exposes a native minimum and maximum with a selected interval", async ({ page }) => {
  const range = page.getByRole("group", { name: "Release window" })
  const minimum = page.getByRole("slider", { name: "Minimum release" })
  const maximum = page.getByRole("slider", { name: "Maximum release" })

  await expect(range).toHaveAttribute("data-value", "28 74")
  await expect(minimum).toHaveValue("28")
  await expect(maximum).toHaveValue("74")
  await expect(minimum).toHaveAttribute("aria-valuemax", "74")
  await expect(maximum).toHaveAttribute("aria-valuemin", "28")
  await expect(range).toHaveCSS("--range-slider-start", /23\.3/)
  await expect(range).toHaveCSS("--range-slider-size", /38\.3/)
})

test("updates both output and constraints with native input events", async ({ page }) => {
  const minimum = page.getByRole("slider", { name: "Minimum release" })
  const maximum = page.getByRole("slider", { name: "Maximum release" })
  const output = page.locator("[data-range-slider-output]")

  await minimum.focus()
  await minimum.press("ArrowRight")
  await expect(minimum).toHaveValue("29")
  await expect(output).toHaveText("29–74 ms")

  await minimum.evaluate((input: HTMLInputElement) => {
    input.value = "100"
    input.dispatchEvent(new InputEvent("input", { bubbles: true }))
  })
  await expect(minimum).toHaveValue("74")
  await expect(output).toHaveText("74–74 ms")

  await maximum.evaluate((input: HTMLInputElement) => {
    input.value = "10"
    input.dispatchEvent(new InputEvent("input", { bubbles: true }))
  })
  await expect(maximum).toHaveValue("74")
  await expect(output).toHaveText("74–74 ms")
})

test("fits the two-point slider at a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/forms#slider", { waitUntil: "domcontentloaded" })

  const preview = page.locator('[data-preview-component="slider-preview"]')
  const box = await preview.boundingBox()

  expect(box).not.toBeNull()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
})
