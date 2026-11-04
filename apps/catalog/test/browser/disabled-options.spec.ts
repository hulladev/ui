import { expect, test } from "@playwright/test"

test("disabled command options ignore pointer activation while enabled options still select", async ({
  page,
}) => {
  await page.goto("/navigation-overlays#command")
  const input = page.locator("#catalog-command-input")
  await input.fill("workspace")
  const disabled = page.getByRole("option", { name: /Workspace settings/ })
  const enabled = page.getByRole("option", { name: /Copy workspace link/ })
  const active = await input.getAttribute("aria-activedescendant")
  await disabled.click({ force: true })
  await expect(input).toHaveAttribute("aria-activedescendant", active!)
  await expect(page.locator("[data-command-selection]")).not.toHaveText("workspace-settings")
  await enabled.click()
  await expect(page.locator("[data-command-selection]")).toHaveText("copy-link")
  await expect(input).toBeFocused()
})

test("select and combobox disabled options ignore pointer activation", async ({ page }) => {
  await page.goto("/forms")
  for (const id of ["select-members-trigger", "combobox-reviewers-input"]) {
    const control = page.locator(`#${id}`)
    await control.click()
    const list = page.locator(`#${await control.getAttribute("aria-controls")}`)
    const disabled = list.getByRole("option", { name: "External contractor" })
    const selected = await list.locator('[aria-selected="true"]').allTextContents()
    await disabled.click({ force: true })
    expect(await list.locator('[aria-selected="true"]').allTextContents()).toEqual(selected)
    await page.keyboard.press("Escape")
  }
})
