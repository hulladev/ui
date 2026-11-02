import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test } from "@playwright/test"

test.setTimeout(60_000)
for (const theme of ["light", "dark"]) {
  for (const width of [390, 1280]) {
    test.describe(`native platform controls ${theme} at ${width}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.addInitScript((theme) => localStorage.setItem("catalog-theme", theme), theme)
      })
      test("calendar enforces inclusive limits and navigates months", async ({ page }) => {
        await page.goto(nativeCatalogDestination("calendar")!)
        const preview = page.getByTestId("native-catalog")
        await expect(
          preview.getByRole("button", { name: "Sunday, October 4, 2026", exact: true })
        ).toBeDisabled()
        await preview.getByRole("button", { name: "Friday, October 30, 2026", exact: true }).click()
        await expect(preview.getByText("Selected date: 2026-10-30", { exact: true })).toBeVisible()
        await preview.getByRole("button", { name: "Next month", exact: true }).click()
        await expect(
          preview.getByRole("heading", { name: "November 2026", exact: true })
        ).toBeVisible()
        await preview.getByRole("button", { name: "Next month", exact: true }).click()
        await expect(
          preview.getByRole("button", { name: "Next month", exact: true })
        ).toBeDisabled()
        await expect(
          preview.getByRole("button", { name: "Monday, December 21, 2026", exact: true })
        ).toBeDisabled()
      })
      test("date picker cancels drafts, confirms selection, and disables trigger", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("date-picker")!)
        const trigger = page.getByRole("button", { name: /^Next workout:/ })
        await trigger.click()
        const sunday = await page
          .getByRole("button", { name: "Sunday, October 25, 2026", exact: true })
          .boundingBox()
        expect(sunday).not.toBeNull()
        expect(sunday!.x).toBeGreaterThanOrEqual(0)
        expect(sunday!.x + sunday!.width).toBeLessThanOrEqual(width)
        await page.getByRole("button", { name: "Friday, October 30, 2026", exact: true }).click()
        await page.getByRole("button", { name: "Cancel", exact: true }).click()
        await expect(page.getByText("Scheduled: 2026-10-29", { exact: true })).toBeVisible()
        await trigger.click()
        await page.getByRole("button", { name: "Friday, October 30, 2026", exact: true }).click()
        await page.getByRole("button", { name: "Confirm date", exact: true }).click()
        await expect(page.getByText("Scheduled: 2026-10-30", { exact: true })).toBeVisible()
        await expect(page.getByRole("button", { name: /^Locked workout date:/ })).toBeDisabled()
      })
      test("time picker commits local time and supports cancellation", async ({ page }) => {
        await page.goto(nativeCatalogDestination("time-picker")!)
        const trigger = page.getByRole("button", { name: /^Training reminder:/ })
        await trigger.click()
        await page.getByRole("button", { name: "Increase Hour", exact: true }).click()
        await page.getByRole("button", { name: "Increase Minute", exact: true }).click()
        await page.getByRole("button", { name: "Confirm time", exact: true }).click()
        await expect(page.getByText("Reminder: 19:31", { exact: true })).toBeVisible()
        await trigger.click()
        await page.getByRole("button", { name: "Decrease Hour", exact: true }).click()
        await page.getByRole("button", { name: "Cancel", exact: true }).click()
        await expect(page.getByText("Reminder: 19:31", { exact: true })).toBeVisible()
      })
      test("number fields clamp input, reject incomplete drafts, and retain fractional steps", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("number-field")!)
        const reps = page.getByRole("textbox", { name: "Repetitions", exact: true })
        await reps.fill("99")
        await reps.press("Tab")
        await expect(reps).toHaveValue("30")
        await expect(
          page.getByRole("button", { name: "Increase Repetitions", exact: true })
        ).toBeDisabled()
        await reps.fill("-")
        await reps.press("Tab")
        await expect(reps).toHaveValue("30")
        await page.getByRole("button", { name: "Increase Weight", exact: true }).click()
        await expect(page.getByRole("textbox", { name: "Weight", exact: true })).toHaveValue("62.5")
        await expect(
          page.getByRole("textbox", { name: "Locked repetitions", exact: true })
        ).not.toBeEditable()
      })
      test("row actions are discoverable, reversible, and disabled explicitly", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("swipe-actions")!)
        const actions = page.getByRole("button", { name: "Bench press actions", exact: true })
        await expect(
          page.getByRole("button", { name: "Archive exercise", exact: true })
        ).toHaveCount(0)
        await actions.click()
        await page.getByRole("button", { name: "Archive exercise", exact: true }).click()
        await expect(
          page.getByText("Exercise archived. Undo is available.", { exact: true })
        ).toBeVisible()
        await page.getByRole("button", { name: "Undo archive", exact: true }).click()
        await expect(actions).toBeVisible()
        await expect(
          page.getByRole("button", { name: "Locked exercise actions", exact: true })
        ).toBeDisabled()
      })
      test("keyboard-aware form preserves editing and submit actions", async ({ page }) => {
        await page.goto(nativeCatalogDestination("keyboard-aware")!)
        await page
          .getByRole("textbox", { name: "Keyboard aware workout name", exact: true })
          .fill("Evening A")
        await page
          .getByRole("textbox", { name: "Keyboard aware session notes", exact: true })
          .fill("Strong session\nAdd weight next time")
        await page.getByRole("button", { name: "Save session", exact: true }).click()
        await expect(page.getByText("Session saved.", { exact: true })).toBeVisible()
      })
    })
  }
}
