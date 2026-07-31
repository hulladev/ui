import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#toast", { waitUntil: "load" })
})

test("gives each pushed toast an independent dismissal timer", async ({ page }) => {
  test.slow()

  const preview = page.locator('[data-preview-component="toast-preview"]')
  const push = preview.locator("[data-toast-push]")
  const toaster = preview.locator("[data-catalog-toaster]")
  const liveToasts = preview.locator('[data-catalog-toaster] [data-slot="toast"]')

  await toaster.evaluate((element) => {
    element.dataset.duration = "2500"
  })
  await push.evaluate((element) => (element as HTMLButtonElement).click())
  await expect(liveToasts).toHaveCount(1)
  await expect(liveToasts).toContainText("Release 1 queued")

  await page.waitForTimeout(800)
  await push.evaluate((element) => (element as HTMLButtonElement).click())
  await expect(liveToasts).toHaveCount(2)

  await page.waitForTimeout(1850)
  await expect(liveToasts).toHaveCount(1)
  await expect(liveToasts).toContainText("Release 2 queued")

  await page.waitForTimeout(800)
  await expect(liveToasts).toHaveCount(0)
})
