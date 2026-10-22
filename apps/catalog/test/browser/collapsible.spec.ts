import { expect, test } from "@playwright/test"

test("animates pointer and keyboard toggles but keeps mounted and restored state instant", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.addInitScript(() => {
    document.addEventListener("transitionrun", (event) => {
      if (!(event.target instanceof Element) || !event.target.closest("#collapsible")) return
      if (
        ![
          "block-size",
          "content-visibility",
          "opacity",
          "translate",
          "rotate",
          "transform",
        ].includes(event.propertyName)
      )
        return
      const root = document.documentElement
      root.dataset.disclosureTransitions = String(
        Number(root.dataset.disclosureTransitions ?? 0) + 1
      )
    })
  })
  await page.goto("/navigation-overlays#collapsible")
  const disclosure = page.locator("#collapsible details").first()
  const summary = disclosure.locator(":scope > summary")
  const transitionCount = () =>
    page.evaluate(() => Number(document.documentElement.dataset.disclosureTransitions ?? 0))
  const settle = () =>
    expect(disclosure.locator(":scope > [data-slot=collapsible-content]")).toHaveCSS(
      "transition-property",
      "none"
    )

  await expect(disclosure).toHaveJSProperty("open", true)
  expect(await transitionCount()).toBe(0)
  await summary.click()
  await expect(disclosure).toHaveJSProperty("open", false)
  await settle()
  const pointerTransitions = await transitionCount()
  expect(pointerTransitions).toBeGreaterThan(0)

  await summary.press("Enter")
  await expect(disclosure).toHaveJSProperty("open", true)
  await settle()
  expect(await transitionCount()).toBeGreaterThan(pointerTransitions)

  const userTransitions = await transitionCount()
  await disclosure.evaluate((element: HTMLDetailsElement) => {
    element.open = false
  })
  await settle()
  await disclosure.evaluate((element: HTMLDetailsElement) => {
    element.open = true
  })
  await settle()
  expect(await transitionCount()).toBe(userTransitions)

  await page.reload()
  await expect(disclosure).toHaveJSProperty("open", true)
  expect(await transitionCount()).toBe(0)
})

test("respects reduced motion for native disclosure activation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/navigation-overlays#collapsible")
  const disclosure = page.locator("#collapsible details").first()
  await disclosure.locator(":scope > summary").click()
  await expect(disclosure).toHaveJSProperty("open", false)
  expect(
    await disclosure.evaluate((element) => element.getAnimations({ subtree: true }).length)
  ).toBe(0)
})
