import { expect, test, type Locator } from "@playwright/test"

const paint = (locator: Locator) =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      border: style.borderColor,
      color: style.color,
      shadow: style.boxShadow,
      transform: style.transform,
      opacity: style.opacity,
    }
  })

for (const theme of ["light", "dark"]) {
  test(`disabled controls keep their value and ignore hover in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/forms", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((el, value) => {
      el.dataset.theme = value
    }, theme)
    for (const id of [
      "region",
      "textarea-disabled",
      "checkbox-disabled",
      "radio-disabled",
      "switch-disabled",
      "checkbox-disabled-checked",
      "radio-disabled-checked",
      "switch-disabled-checked",
    ]) {
      const control = page.locator(`#${id}`)
      await expect(control).toBeDisabled()
      await control.scrollIntoViewIfNeeded()
      await page.mouse.move(0, 0)
      const rest = await paint(control)
      expect(rest.opacity, id).toBe("1")
      await control.hover()
      expect(await paint(control), id).toEqual(rest)
      if (id.endsWith("-checked")) await expect(control).toBeChecked()
      const field = control.locator('xpath=ancestor::*[@data-slot="field"]')
      if (await field.count()) await expect(field).toHaveCSS("opacity", "1")
    }
    for (const type of ["checkbox", "radio", "switch"]) {
      expect((await paint(page.locator(`#${type}-disabled-checked`))).background).not.toBe(
        (await paint(page.locator(`#${type}-disabled`))).background
      )
    }
  })

  test(`input focus survives hover and grouped controls keep one surface in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/forms", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((el, value) => {
      el.dataset.theme = value
    }, theme)
    const input = page.locator("#input input[data-control]:not(:disabled):not([readonly])").first()
    await input.focus()
    const focused = await paint(input)
    await input.hover()
    expect(await paint(input)).toEqual(focused)
    const group = page.locator('#input [data-slot="input-group"]').first()
    const child = group.locator("[data-control]").first()
    await child.hover()
    await expect(child).toHaveCSS("border-top-width", "0px")
    await expect(child).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
    await child.evaluate((el) => {
      ;(el as HTMLInputElement).disabled = true
    })
    await page.mouse.move(0, 0)
    const disabled = await paint(group)
    await group.hover()
    expect(await paint(group)).toEqual(disabled)
  })

  test(`selection remains distinct from hover and disabled toggles stay still in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/forms#toggle", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((el, value) => {
      el.dataset.theme = value
    }, theme)
    const group = page.getByRole("group", { name: "Text formatting" })
    const selected = group.getByRole("button", { name: "Bold", exact: true })
    const unselected = group.getByRole("button", { name: "Italic", exact: true })
    await expect(selected).toHaveAttribute("aria-pressed", "true")
    await unselected.hover()
    const hover = await paint(unselected)
    await selected.hover()
    expect((await paint(selected)).background).not.toBe(hover.background)
    await unselected.focus()
    await expect(unselected).toBeFocused()
    await expect(unselected).toHaveCSS("outline-width", "2px")
    const standalone = page.getByRole("button", { name: "Follow live", exact: true })
    await standalone.evaluate((el) => {
      ;(el as HTMLButtonElement).disabled = true
    })
    await page.mouse.move(0, 0)
    const disabled = await paint(standalone)
    await standalone.hover()
    expect(await paint(standalone)).toEqual(disabled)
    await expect(standalone).toHaveAttribute("aria-pressed", "true")
  })
}

for (const theme of ["light", "dark"]) {
  test(`listbox and tab selection remain stronger than hover in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/forms#select", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((el, value) => {
      el.dataset.theme = value
    }, theme)
    const trigger = page.locator("#select-members-trigger")
    await trigger.click()
    const listbox = page.locator(`#${await trigger.getAttribute("aria-controls")}`)
    const selected = listbox.locator("[role=option][aria-selected=true]").first()
    const other = listbox
      .locator("[role=option][aria-selected=false]:not([aria-disabled=true])")
      .first()
    await other.hover()
    const highlighted = await paint(other)
    await selected.hover()
    expect((await paint(selected)).background).not.toBe(highlighted.background)
    await expect(selected).toHaveAttribute("aria-selected", "true")
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
    await page.goto("/navigation-overlays#tabs", { waitUntil: "domcontentloaded" })
    await page.locator("html").evaluate((el, value) => {
      el.dataset.theme = value
    }, theme)
    const tabs = page.locator('#tabs [data-slot="tabs"]').first()
    const active = tabs.locator("[role=tab][aria-selected=true]")
    const inactive = tabs.locator("[role=tab][aria-selected=false]:not(:disabled)").first()
    await inactive.hover()
    const hover = await paint(inactive)
    await active.hover()
    expect((await paint(active)).background).not.toBe(hover.background)
    await expect(active).toHaveAttribute("aria-selected", "true")
  })
}
