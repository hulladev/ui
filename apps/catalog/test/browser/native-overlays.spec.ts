import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test } from "@playwright/test"

test.setTimeout(60_000)
for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test.describe(`${theme} native overlays at ${width}px`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.addInitScript((theme) => localStorage.setItem("catalog-theme", theme), theme)
      })
      test("dialog confirms, dismisses with Escape and restores trigger focus", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("dialog")!)
        const trigger = page.getByRole("button", { name: "Finish workout", exact: true })
        await expect(trigger).toHaveAttribute("aria-expanded", "false")
        await trigger.click()
        await expect(trigger).toHaveAttribute("aria-expanded", "true")
        await expect(
          page.getByRole("dialog", { name: "Finish this workout", exact: true })
        ).toBeVisible()
        await expect(page.getByTestId("dialog-content")).toBeVisible()
        await expect(page.getByRole("heading", { name: "Finish this workout?" })).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.getByTestId("dialog-content")).not.toBeVisible()
        await expect(trigger).toBeFocused()
        await trigger.click()
        await page.getByTestId("dialog-backdrop").click({ position: { x: 3, y: 3 } })
        await expect(page.getByTestId("dialog-content")).not.toBeVisible()
        await trigger.click()
        await page.getByRole("button", { name: "Save workout", exact: true }).click()
        await expect(page.getByText("Workout saved.", { exact: true })).toBeVisible()
      })
      test("drawer validates numeric editing and supports cancellation", async ({ page }) => {
        await page.goto(nativeCatalogDestination("drawer")!)
        const trigger = page.getByRole("button", { name: "Edit rest timer" })
        await expect(trigger).toHaveAttribute("aria-expanded", "false")
        await trigger.click()
        await expect(trigger).toHaveAttribute("aria-expanded", "true")
        await expect(
          page.getByRole("dialog", { name: "Rest timer settings", exact: true })
        ).toBeVisible()
        const input = page.getByRole("textbox", { name: "Rest duration in seconds" })
        await input.fill("0")
        await expect(page.getByRole("button", { name: "Apply rest timer" })).toBeDisabled()
        await input.fill("120")
        await page.getByRole("button", { name: "Apply rest timer" }).click()
        await expect(page.getByText("Rest timer: 120 seconds", { exact: true })).toBeVisible()
        await page.getByRole("button", { name: "Edit rest timer" }).click()
        await input.fill("45")
        await page.getByRole("button", { name: "Cancel", exact: true }).click()
        await expect(page.getByText("Rest timer: 120 seconds", { exact: true })).toBeVisible()
      })
      test("action sheet exposes disabled actions and closes after activation", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("dropdown-menu")!)
        await page.getByRole("button", { name: "Workout actions", exact: true }).click()
        await expect(
          page.getByRole("button", { name: "Export unavailable offline" })
        ).toBeDisabled()
        await page.getByRole("button", { name: "Duplicate workout", exact: true }).click()
        await expect(page.getByText("Workout duplicated.", { exact: true })).toBeVisible()
        await expect(page.getByTestId("drawer-content")).not.toBeVisible()
      })
      test("native help is discoverable and supports keyboard dismissal", async ({ page }) => {
        await page.goto(nativeCatalogDestination("tooltip")!)
        const trigger = page.getByRole("button", { name: "Explain repetitions in reserve" })
        expect(
          await trigger.evaluate((node) => node.getBoundingClientRect().height)
        ).toBeGreaterThanOrEqual(48)
        await trigger.focus()
        await page.keyboard.press("Space")
        await expect(trigger).toHaveAttribute("aria-expanded", "true")
        await expect(page.getByTestId("tooltip-content")).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(trigger).toHaveAttribute("aria-expanded", "false")
        await expect(page.getByRole("button", { name: "Unavailable help" })).toBeDisabled()
      })
      test("popover contextual detail uses a dismissible native modal", async ({ page }) => {
        await page.goto(nativeCatalogDestination("popover")!)
        await page.getByRole("button", { name: "About recovery score" }).click()
        await expect(
          page.getByRole("heading", { name: "Recovery score", exact: true })
        ).toBeVisible()
        await page.getByRole("button", { name: "Got it" }).click()
        await expect(page.getByTestId("dialog-content")).not.toBeVisible()
      })
      test("select uses explicit checked state and searchable selection filters real options", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("select")!)
        await expect(page.getByRole("button", { name: "Locked training plan" })).toBeDisabled()
        const selectionTrigger = page.getByRole("button", { name: "Training focus: Strength" })
        await expect(selectionTrigger).toHaveAttribute("aria-expanded", "false")
        await selectionTrigger.click()
        await expect(selectionTrigger).toHaveAttribute("aria-expanded", "true")
        await expect(page.getByRole("radio", { name: "Strength", exact: true })).toBeChecked()
        const endurance = page.getByRole("radio", { name: "Endurance", exact: true })
        await endurance.focus()
        await page.keyboard.press("Space")
        await expect(page.getByText("Selected: Endurance", { exact: true })).toBeVisible()
        await page.goto(nativeCatalogDestination("combobox")!)
        await page.getByRole("button", { name: "Choose exercise" }).click()
        const search = page.getByRole("textbox", { name: "Search exercises" })
        await search.fill("not an exercise")
        await expect(
          page.getByText("No exercises found. Try a different search.", { exact: true })
        ).toBeVisible()
        await search.fill("Romanian")
        await expect(
          page.getByRole("radio", { name: "Romanian deadlift", exact: true })
        ).toBeVisible()
        await search.press("Enter")
        await expect(page.getByText("Exercise: Romanian deadlift", { exact: true })).toBeVisible()
      })
      test("command search executes one matching action", async ({ page }) => {
        await page.goto(nativeCatalogDestination("command")!)
        await page.getByRole("button", { name: "Quick actions", exact: true }).click()
        const search = page.getByRole("textbox", { name: "Search actions" })
        await search.fill("history")
        await expect(page.getByRole("button", { name: "Open workout history" })).toBeVisible()
        await search.press("Enter")
        await expect(page.getByText("Ran: Open workout history", { exact: true })).toBeVisible()
      })
      test("toast undo and explicit dismissal preserve browser accessibility fallback", async ({
        page,
      }) => {
        await page.clock.install()
        await page.goto(nativeCatalogDestination("toast")!)
        await page.getByRole("button", { name: "Undo removal" }).click()
        await expect(page.getByText("Your set was restored.", { exact: true })).toBeVisible()
        await page.getByRole("button", { name: "Show notice", exact: true }).click()
        await page.getByRole("button", { name: "Dismiss notice" }).click()
        await expect(page.getByRole("button", { name: "Undo removal" })).not.toBeVisible()
        await page.getByRole("button", { name: "Show timed notice" }).click()
        await expect(page.getByRole("button", { name: "Undo removal" })).toBeVisible()
        // React Native Web conservatively reports screen-reader support enabled.
        await page.clock.fastForward(5000)
        await expect(page.getByRole("button", { name: "Undo removal" })).toBeVisible()
        await page.getByRole("button", { name: "Dismiss notice" }).click()
      })
    })
  }
}
