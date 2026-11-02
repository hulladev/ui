import { nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { expect, test } from "@playwright/test"

test.setTimeout(60_000)

for (const theme of ["light", "dark"] as const) {
  test.describe(`native content in ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 })
      await page.addInitScript((value) => localStorage.setItem("catalog-theme", value), theme)
    })

    test("new alert feedback is announced after an action", async ({ page }) => {
      await page.goto(nativeCatalogDestination("alert")!)
      const preview = page.getByTestId("native-catalog")
      await expect(preview).toBeVisible()
      await expect(preview.getByRole("alert")).toHaveCount(0)
      await preview.getByRole("button", { name: "Save session", exact: true }).click()
      await expect(preview.getByRole("alert")).toContainText("Session saved")
      await preview.getByRole("button", { name: "Reset saved state", exact: true }).click()
      await expect(preview.getByRole("alert")).toHaveCount(0)
    })

    test("avatar images load and native image errors expose explicit fallback", async ({
      page,
    }) => {
      await page.goto(nativeCatalogDestination("avatar")!)
      const preview = page.getByTestId("native-catalog")
      await expect(preview).toBeVisible()
      await expect(
        preview.getByRole("img", { name: "Alex Morgan avatar", exact: true })
      ).toBeVisible()
      await preview.getByRole("button", { name: "Try unavailable image", exact: true }).click()
      await expect(
        preview.getByText("Image failed; initials remain available.", { exact: true })
      ).toBeVisible()
      await expect(preview.getByText("JK", { exact: true })).toBeVisible()
    })

    test("progress exposes real values, completion, reset, and unknown progress", async ({
      page,
    }) => {
      await page.goto(nativeCatalogDestination("progress")!)
      const preview = page.getByTestId("native-catalog")
      const progress = preview.getByRole("progressbar", { name: "Workout progress", exact: true })
      await expect(progress).toHaveAttribute("aria-valuenow", "2")
      await expect(progress).toHaveAttribute("aria-valuemax", "5")
      const complete = preview.getByRole("button", { name: "Complete next set", exact: true })
      await complete.click()
      await complete.click()
      await complete.click()
      await expect(progress).toHaveAttribute("aria-valuenow", "5")
      await expect(complete).toBeDisabled()
      await preview.getByRole("button", { name: "Reset progress", exact: true }).click()
      await expect(progress).toHaveAttribute("aria-valuenow", "0")
      const unknown = preview.getByRole("progressbar", { name: "Syncing session", exact: true })
      await expect(unknown).toHaveAttribute("aria-busy", "true")
      await expect(unknown).not.toHaveAttribute("aria-valuenow")
    })

    test("measurements retain their labels and non-zero range", async ({ page }) => {
      await page.goto(nativeCatalogDestination("meter")!)
      const effort = page
        .getByTestId("native-catalog")
        .getByRole("progressbar", { name: "Perceived effort", exact: true })
      await expect(effort).toHaveAttribute("aria-valuemin", "1")
      await expect(effort).toHaveAttribute("aria-valuemax", "10")
      await expect(effort).toHaveAttribute("aria-valuenow", "8")
      await expect(effort).toHaveAttribute("aria-valuetext", "8 of 10, high effort")
    })

    test("skeleton content transitions preserve the loading announcement", async ({ page }) => {
      await page.goto(nativeCatalogDestination("skeleton")!)
      const preview = page.getByTestId("native-catalog")
      await expect(preview.locator('[aria-busy="true"]')).toBeVisible()
      await preview.getByRole("button", { name: "Show loaded content", exact: true }).click()
      await expect(
        preview.getByRole("heading", { name: "Upper body A", exact: true })
      ).toBeVisible()
      await expect(preview.getByText("Workout summary loaded.", { exact: true })).toBeVisible()
      await expect(preview.locator('[aria-busy="true"]')).toHaveCount(0)
    })

    test("list rows support keyboard activation, focus, and disabled state", async ({ page }) => {
      await page.goto(nativeCatalogDestination("list")!)
      const preview = page.getByTestId("native-catalog")
      const row = preview.getByRole("button", { name: "Open bench press", exact: true })
      await expect(row).toBeVisible()
      expect(
        await row.evaluate((node) => node.getBoundingClientRect().height)
      ).toBeGreaterThanOrEqual(48)
      await row.focus()
      await expect(row).toHaveCSS("outline-width", "2px")
      await row.press("Enter")
      await expect(preview.getByText("Opened Bench press.", { exact: true })).toBeVisible()
      const disabled = preview.getByRole("button", { name: "Open archived exercise", exact: true })
      await expect(disabled).toBeDisabled()
    })

    test("empty state actions create content", async ({ page }) => {
      await page.goto(nativeCatalogDestination("empty-state")!)
      const preview = page.getByTestId("native-catalog")
      await expect(
        preview.getByRole("heading", { name: "No workouts yet", exact: true })
      ).toBeVisible()
      await preview.getByRole("button", { name: "Create workout", exact: true }).click()
      await expect(
        preview.getByRole("heading", { name: "First workout created", exact: true })
      ).toBeVisible()
      await preview.getByRole("button", { name: "Reset example", exact: true }).click()
      await expect(
        preview.getByRole("heading", { name: "No workouts yet", exact: true })
      ).toBeVisible()
    })

    test("navigation cards retain native link activation and disabled state", async ({ page }) => {
      await page.goto(nativeCatalogDestination("link-card")!)
      const preview = page.getByTestId("native-catalog")
      const link = preview.getByRole("link", { name: "Open workout history", exact: true })
      await expect(link).toBeVisible()
      await link.focus()
      await expect(link).toHaveCSS("outline-width", "2px")
      await link.press("Enter")
      await expect(
        preview.getByText("Workout history opened in this preview.", { exact: true })
      ).toBeVisible()
      await expect(preview.getByText("Destination opened 1 time.", { exact: true })).toBeVisible()
      await page.keyboard.down("Enter")
      await expect(preview.getByText("Destination opened 2 times.", { exact: true })).toBeVisible()
      await page.keyboard.down("Enter")
      await expect(preview.getByText("Destination opened 2 times.", { exact: true })).toBeVisible()
      await page.keyboard.up("Enter")
      await link.click()
      await expect(preview.getByText("Destination opened 3 times.", { exact: true })).toBeVisible()
      await expect(
        preview.getByRole("link", { name: "Open coach profile", exact: true })
      ).toBeDisabled()
    })

    test("tree disclosures and leaf selection stay explicit and keyboard accessible", async ({
      page,
    }) => {
      await page.goto(nativeCatalogDestination("tree-view")!)
      const preview = page.getByTestId("native-catalog")
      const group = preview.getByRole("button", { name: "Upper body exercises", exact: true })
      await expect(group).toHaveAttribute("aria-expanded", "true")
      await group.focus()
      await expect(group.getByTestId("tree-item-surface")).toHaveCSS("outline-width", "2px")
      await group.press("Space")
      await expect(group).toHaveAttribute("aria-expanded", "false")
      await expect(
        preview.getByRole("button", { name: "Select bench press", exact: true })
      ).toHaveCount(0)
      await group.press("Enter")
      await preview.getByRole("button", { name: "Select seated row", exact: true }).click()
      await expect(
        preview.getByRole("button", { name: "Select seated row", exact: true })
      ).toHaveAttribute("aria-selected", "true")
      await expect(
        preview.getByRole("button", { name: "Select bench press", exact: true })
      ).toHaveAttribute("aria-selected", "false")
      await expect(preview.getByText("Selected: Seated row", { exact: true })).toBeVisible()
      await expect(
        preview.getByRole("button", { name: "Select archived exercise", exact: true })
      ).toBeDisabled()
    })

    test("document attachment uses the real browser picker and explicit removal", async ({
      page,
    }) => {
      await page.goto(nativeCatalogDestination("file-upload")!)
      const preview = page.getByTestId("native-catalog")
      await expect(preview.getByText("workout-plan.txt", { exact: true })).toBeVisible()
      await preview.getByRole("button", { name: "Remove workout-plan.txt", exact: true }).click()
      await expect(preview.getByText("Removed workout-plan.txt.", { exact: true })).toBeVisible()
      const chooserPromise = page.waitForEvent("filechooser")
      await preview.getByRole("button", { name: "Attach document", exact: true }).click()
      const chooser = await chooserPromise
      await chooser.setFiles({
        name: "new-plan.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("3 sets of 8"),
      })
      await expect(preview.getByText("Attached new-plan.txt.", { exact: true })).toBeVisible()
      await expect(preview.getByText("new-plan.txt", { exact: true })).toBeVisible()
      await expect(
        preview.getByRole("button", { name: "Attach document", exact: true })
      ).toBeEnabled()
      await preview.getByRole("button", { name: "Remove new-plan.txt", exact: true }).click()
      await expect(preview.getByText("new-plan.txt", { exact: true })).toHaveCount(0)
    })

    test("code preserves selectable multiline text", async ({ page }) => {
      await page.goto(nativeCatalogDestination("code")!)
      const code = page.getByTestId("native-catalog").getByLabel("Session export", { exact: true })
      await expect(code).toContainText('"exercise": "Bench press"')
      expect(
        await code.evaluate((node) => {
          const style = getComputedStyle(node)
          return style.userSelect || style.getPropertyValue("-webkit-user-select")
        })
      ).toBe("text")
    })

    test("table keeps comparison rows and horizontal overflow inside the surface", async ({
      page,
    }) => {
      await page.goto(nativeCatalogDestination("table")!)
      const preview = page.getByTestId("native-catalog")
      const table = preview.getByLabel("Recent sets, horizontally scrollable", { exact: true })
      await expect(table).toBeVisible()
      await expect(preview.getByText("Bench press", { exact: true })).toBeVisible()
      expect(await table.evaluate((node) => node.scrollWidth)).toBeGreaterThan(
        await table.evaluate((node) => node.clientWidth)
      )
      await table.evaluate((node) => {
        node.scrollLeft = node.scrollWidth
      })
      expect(await table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0)
      expect(await page.locator("body").evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
        390
      )
    })
  })
}
