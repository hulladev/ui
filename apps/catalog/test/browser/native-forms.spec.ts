import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test } from "@playwright/test"

test.setTimeout(60_000)

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test.describe(`${theme} native forms at ${width}px`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.addInitScript((theme) => localStorage.setItem("catalog-theme", theme), theme)
      })

      test("checkbox rows support controlled, mixed, uncontrolled, disabled and keyboard states", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("checkbox")!)
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme
        }, theme)
        await expect(page.locator(`#native-preview-${theme}`)).toBeVisible()
        const complete = page.getByRole("checkbox", { name: "Mark set complete", exact: true })
        await expect(complete).not.toBeChecked()
        expect(
          await complete.evaluate((node) => node.getBoundingClientRect().height)
        ).toBeGreaterThanOrEqual(48)
        expect(
          await complete
            .getByTestId("checkbox-indicator")
            .evaluate((node) => node.getBoundingClientRect().width)
        ).toBe(18)
        await complete.click()
        await expect(complete).toBeChecked()
        await expect(page.getByText("Set completed", { exact: true })).toBeVisible()
        await complete.focus()
        await expect(complete.getByTestId("checkbox-indicator")).toHaveCSS("outline-width", "2px")
        await page.keyboard.press("Space")
        await expect(complete).not.toBeChecked()
        await page.keyboard.press("Enter")
        await expect(complete).toBeChecked()
        await page.keyboard.down("Space")
        await expect(complete).not.toBeChecked()
        await page.keyboard.down("Space")
        await expect(complete).not.toBeChecked()
        await page.keyboard.up("Space")
        const mixed = page.getByRole("checkbox", { name: "Select all exercises", exact: true })
        await expect(mixed).toHaveAttribute("aria-checked", "mixed")
        await mixed.click()
        await expect(mixed).toBeChecked()
        const remembered = page.getByRole("checkbox", { name: "Remember equipment", exact: true })
        await expect(remembered).toBeChecked()
        await remembered.click()
        await expect(remembered).not.toBeChecked()
        const locked = page.getByRole("checkbox", { name: "Locked completed set", exact: true })
        await expect(locked).toBeDisabled()
        await locked.click({ force: true })
        await expect(locked).toBeChecked()
        const invalid = page.getByRole("checkbox", { name: "Required confirmation", exact: true })
        await expect(invalid).toHaveAttribute("aria-invalid", "true")
      })

      test("field validation is explicit, focusable, and clears after correction", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("field")!)
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme
        }, theme)
        await expect(page.locator(`#native-preview-${theme}`)).toBeVisible()
        const input = page.getByRole("textbox", { name: "Workout name", exact: true })
        await page.getByRole("button", { name: "Save template", exact: true }).click()
        await expect(page.getByRole("alert")).toHaveText("Enter a workout name.")
        await expect(input).toBeFocused()
        await expect(input).toHaveAttribute("aria-invalid", "true")
        await input.fill("Upper body B")
        await expect(page.getByRole("alert")).toHaveCount(0)
        await expect(input).not.toHaveAttribute("aria-invalid", "true")
        await input.press("Enter")
        await expect(page.getByText("Saved Upper body B.", { exact: true })).toBeVisible()
        await expect(
          page.getByRole("checkbox", { name: "Include warm-up sets", exact: true })
        ).toBeChecked()
        expect(
          await input.evaluate((node) => node.getBoundingClientRect().height)
        ).toBeGreaterThanOrEqual(48)
        expect(await page.locator("body").evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
          width
        )
      })

      test("textarea preserves multiline input, length limits, and readonly state", async ({
        page,
      }) => {
        await page.goto(nativeCatalogDestination("textarea")!)
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme
        }, theme)
        await expect(page.locator(`#native-preview-${theme}`)).toBeVisible()
        const notes = page.getByRole("textbox", { name: "Session notes", exact: true })
        await notes.fill("Steady pace.\nOne more set next week.")
        await expect(notes).toHaveValue("Steady pace.\nOne more set next week.")
        await notes.fill("x".repeat(240))
        await notes.press("End")
        await notes.press("x")
        await expect(notes).toHaveValue("x".repeat(240))
        await expect(page.getByText("240 / 240 characters", { exact: true })).toBeVisible()
        await expect(
          page.getByRole("textbox", { name: "Previous session", exact: true })
        ).not.toBeEditable()
        expect(
          await notes.evaluate((node) => node.getBoundingClientRect().height)
        ).toBeGreaterThanOrEqual(112)
      })

      test("card parts compose a working editor and preserve route isolation", async ({ page }) => {
        await page.goto(nativeCatalogDestination("card")!)
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme
        }, theme)
        await expect(page.locator(`#native-preview-${theme}`)).toBeVisible()
        await expect(
          page.getByRole("heading", { name: "Workout template", exact: true })
        ).toBeVisible()
        const input = page.getByRole("textbox", { name: "Template name", exact: true })
        const save = page.getByRole("button", { name: "Save changes", exact: true })
        const label = save.getByText("Save changes", { exact: true })
        const enabledLabelColor = await label.evaluate((node) => getComputedStyle(node).color)
        await input.fill("")
        await expect(save).toBeDisabled()
        await expect(label).not.toHaveCSS("color", enabledLabelColor)
        await input.fill("Lower body A")
        await expect(label).toHaveCSS("color", enabledLabelColor)
        await save.click()
        await expect(page.getByText("Saved Lower body A.", { exact: true })).toBeVisible()
        await expect(
          page.getByRole("checkbox", { name: "Rest timer reminder", exact: true })
        ).toBeChecked()
        await expect(page.getByRole("textbox", { name: "Session notes", exact: true })).toHaveCount(
          0
        )
        expect(await page.locator("body").evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
          width
        )
      })
    })
  }
}
