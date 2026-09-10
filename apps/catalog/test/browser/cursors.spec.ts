import { expect, test, type Locator } from "@playwright/test"

// Check the actual hit target: pointer-events:none can hide a correct computed cursor.
async function expectHoverCursor(locator: Locator, cursor: string) {
  await locator.hover()
  await expect(locator).toHaveCSS("cursor", cursor)
  expect(
    await locator.evaluate((element) => {
      const box = element.getBoundingClientRect()
      const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
      return target && getComputedStyle(target).cursor
    })
  ).toBe(cursor)
}

for (const theme of ["light", "dark"]) {
  test(`command cursors match activation and disabled behavior in ${theme}`, async ({ page }) => {
    await page.goto("/navigation-overlays#command")
    await page.locator("html").evaluate((el, value) => (el.dataset.theme = value), theme)
    const input = page.locator("#catalog-command-input")
    await input.fill("workspace")
    const disabled = page.getByRole("option", { name: /Workspace settings/ })
    const enabled = page.getByRole("option", { name: /Copy workspace link/ })
    await expectHoverCursor(enabled, "pointer")
    const active = await input.getAttribute("aria-activedescendant")
    await expectHoverCursor(disabled, "not-allowed")
    await disabled.click({ force: true })
    await expect(input).toHaveAttribute("aria-activedescendant", active!)
    await expect(page.locator("[data-command-selection]")).not.toHaveText("workspace-settings")
    await enabled.click()
    await expect(page.locator("[data-command-selection]")).toHaveText("copy-link")
    await expect(input).toBeFocused()
  })
}

test("select and combobox disabled options remain inert under the pointer", async ({ page }) => {
  await page.goto("/forms")
  for (const id of ["select-members-trigger", "combobox-reviewers-input"]) {
    const control = page.locator(`#${id}`)
    await control.click()
    const list = page.locator(`#${await control.getAttribute("aria-controls")}`)
    await expectHoverCursor(list.getByRole("option", { name: "Samuel Hulla" }), "pointer")
    const disabled = list.getByRole("option", { name: "External contractor" })
    const selected = await list.locator('[aria-selected="true"]').allTextContents()
    await expectHoverCursor(disabled, "not-allowed")
    await disabled.click({ force: true })
    expect(await list.locator('[aria-selected="true"]').allTextContents()).toEqual(selected)
    await page.keyboard.press("Escape")
  }
})

test("read-only fields allow text selection and disabled fields keep their cursor", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/forms")
  for (const id of ["input-group-token", "textarea-readonly"]) {
    const control = page.locator(`#${id}`)
    await expectHoverCursor(control, "text")
    await control.selectText()
    expect(
      await control.evaluate((el) => {
        const field = el as HTMLInputElement | HTMLTextAreaElement
        return field.selectionEnd! - field.selectionStart!
      })
    ).toBeGreaterThan(0)
    await control.evaluate((el) => ((el as HTMLInputElement).disabled = true))
    await expectHoverCursor(control, "not-allowed")
  }
})

test("drag and resize cursors honor native and ARIA disabled handles", async ({ page }) => {
  await page.goto("/layout-feedback")
  for (const [selector, cursor] of [
    ['[data-slot="drag-handle"]', "grab"],
    ['[data-slot="resize-handle"][data-edge="east"]', "ew-resize"],
  ]) {
    const handle = page.locator(selector!).first()
    await expectHoverCursor(handle, cursor!)
    await handle.evaluate((el) => ((el as HTMLButtonElement).disabled = true))
    await expectHoverCursor(handle, "not-allowed")
    await handle.evaluate((el) => {
      ;(el as HTMLButtonElement).disabled = false
      el.setAttribute("aria-disabled", "true")
    })
    await expectHoverCursor(handle, "not-allowed")
    await page.mouse.down()
    await expect(handle).toHaveCSS("cursor", "not-allowed")
    await page.mouse.up()
    await expect(handle).toHaveAttribute("data-state", "idle")
  }
})
