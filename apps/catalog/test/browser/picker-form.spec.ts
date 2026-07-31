import { expect, test } from "@playwright/test"

test("submits, disables, and resets picker form bridges", async ({ page }) => {
  await page.goto("/#date-picker", { waitUntil: "domcontentloaded" })

  const initialData = await page
    .locator("#catalog-trip-form")
    .evaluate((form) => Object.fromEntries(new FormData(form as HTMLFormElement)))
  expect(initialData).toEqual({
    departureDate: "2026-07-30",
    meetingAt: "2026-07-30T09:30",
    travelEnd: "2026-08-04",
    travelStart: "2026-07-30",
  })
  expect(initialData).not.toHaveProperty("unavailableDate")

  await page.locator("#catalog-departure-date").evaluate((picker) => {
    ;(picker as HTMLElement & { value: string }).value = "2026-08-04"
  })
  await expect(page.locator("#catalog-departure-date [data-slot='date-picker-input']")).toHaveValue(
    "2026-08-04"
  )

  await page.locator("#catalog-trip-form").evaluate((form) => (form as HTMLFormElement).reset())
  await expect(page.locator("#catalog-departure-date [data-slot='date-picker-input']")).toHaveValue(
    "2026-07-30"
  )
  await expect(
    page.locator("#catalog-departure-date [data-slot='date-picker-value']")
  ).toContainText("Jul 30, 2026")
})

test("resets the time picker form bridge", async ({ page }) => {
  await page.goto("/#time-picker", { waitUntil: "domcontentloaded" })

  await page.locator("#catalog-workday-start").evaluate((picker) => {
    ;(picker as HTMLElement & { value: string }).value = "10:30"
  })
  await expect(page.locator("#catalog-workday-start [data-slot='time-picker-input']")).toHaveValue(
    "10:30"
  )

  await page.locator("#catalog-time-form").evaluate((form) => (form as HTMLFormElement).reset())
  await expect(page.locator("#catalog-workday-start [data-slot='time-picker-input']")).toHaveValue(
    "09:00"
  )
  await expect(page.locator("#catalog-workday-start [data-slot='time-picker-value']")).toHaveText(
    "09:00"
  )
})
