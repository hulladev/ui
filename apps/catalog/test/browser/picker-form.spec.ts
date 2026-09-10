import { expect, test } from "@playwright/test"

test("submits, disables, and resets picker form bridges", async ({ page }) => {
  await page.goto("/forms#date-picker", { waitUntil: "domcontentloaded" })

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
  await page.goto("/forms#time-picker", { waitUntil: "domcontentloaded" })

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

for (const theme of ["light", "dark"]) {
  test(`picker triggers match Input styling in ${theme} mode`, async ({ page }) => {
    await page.goto("/forms#date-picker", { waitUntil: "domcontentloaded" })
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" })
    await page.locator("html").evaluate((element, value) => {
      element.dataset.theme = value
    }, theme)
    const reference = page.locator("#picker-input-reference")
    const triggers = [
      page.locator('#catalog-departure-date [data-slot="date-picker-trigger"]'),
      page.locator('#catalog-travel-dates [data-slot="date-picker-trigger"]'),
      page.locator('#date-picker [data-slot="date-time-picker-trigger"]').first(),
      page.locator('#catalog-workday-start [data-slot="time-picker-trigger"]'),
    ]
    const properties = [
      "height",
      "borderRadius",
      "paddingLeft",
      "paddingRight",
      "fontSize",
      "fontWeight",
      "color",
      "backgroundColor",
      "borderTopColor",
      "borderTopWidth",
      "boxShadow",
      "outlineStyle",
    ] as const
    for (const state of ["default", "focus", "disabled", "invalid"]) {
      const sample = async (control: typeof reference) => {
        await control.evaluate((element, next) => {
          element.removeAttribute("disabled")
          element.removeAttribute("aria-invalid")
          ;(element as HTMLElement).blur()
          if (next === "disabled") element.setAttribute("disabled", "")
          if (next === "invalid") element.setAttribute("aria-invalid", "true")
        }, state)
        if (state === "focus") await control.focus()
        return control.evaluate((element, names) => {
          const style = getComputedStyle(element)
          return {
            ...Object.fromEntries(names.map((name) => [name, style[name]])),
            fieldOpacity: getComputedStyle(element.closest('[data-slot="field"]')!).opacity,
          }
        }, properties)
      }
      const expected = await sample(reference)
      for (const trigger of triggers)
        expect(await sample(trigger), `${theme} ${state}`).toEqual(expected)
    }
  })
}
