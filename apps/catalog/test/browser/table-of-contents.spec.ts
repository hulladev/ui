import { expect, test } from "@playwright/test"

test("tracks nested scrolling without writing history and uses native shareable links", async ({
  page,
}) => {
  await page.goto("/navigation-overlays#table-of-contents")
  const nav = page.locator('[data-toc-for="toc-guide"]')
  await expect(nav.getByRole("link")).toHaveCount(3)
  await expect(nav.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute(
    "aria-current",
    "location"
  )
  await page.locator("#toc-guide").evaluate((element) => {
    element.scrollTop = 270
  })
  await expect(nav.getByRole("link", { name: "Composition", exact: true })).toHaveAttribute(
    "aria-current",
    "location"
  )
  await expect(page).toHaveURL(/#table-of-contents$/)
  await nav.getByRole("link", { name: "Sharing links" }).click()
  await expect(page).toHaveURL(/#toc-sharing$/)
  await expect(nav.getByRole("link", { name: "Sharing links" })).toHaveAttribute(
    "aria-current",
    "location"
  )
  await nav.getByRole("link", { name: "Overview", exact: true }).focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#toc-overview$/)
  await page.goBack()
  await expect(page).toHaveURL(/#toc-sharing$/)
  await expect(nav.getByRole("link", { name: "Sharing links" })).toHaveAttribute(
    "aria-current",
    "location"
  )
  await page.reload()
  await expect(nav.getByRole("link", { name: "Sharing links" })).toHaveAttribute(
    "aria-current",
    "location"
  )
})

test("updates labels, visibility, order, and encoded IDs within its own scope", async ({
  page,
}) => {
  await page.goto("/navigation-overlays#table-of-contents")
  const preview = page.locator('[data-preview-component="table-of-contents-preview"]')
  await preview.getByRole("tab", { name: "Props", exact: true }).click()
  const nav = page.locator('[data-toc-for="toc-playground-content"]')
  await page.locator("[data-toc-label-control]").fill("Installation")
  await expect(nav.getByRole("link").first()).toHaveText("Installation")
  await page.locator("[data-toc-visible-control]").uncheck()
  await expect(nav.getByRole("link")).toHaveCount(1)
  await page.locator("[data-toc-visible-control]").check()
  await expect(nav.getByRole("link")).toHaveCount(2)
  await page.locator("#toc-next").evaluate((section) => {
    section.id = "next / café"
    section.parentElement!.prepend(section)
  })
  await expect(nav.getByRole("link").first()).toHaveAttribute("href", "#next%20%2F%20caf%C3%A9")
  await nav.getByRole("link").first().click()
  await expect(nav.getByRole("link").first()).toHaveAttribute("aria-current", "location")
  await expect(
    page.locator('[data-toc-for="toc-guide"]').getByRole("link", { includeHidden: true })
  ).toHaveCount(3)
})

test("tracks window scrolling and releases observers on disconnect", async ({ page }) => {
  await page.goto("/navigation-overlays#table-of-contents")
  await expect(page.locator('[data-toc-for="toc-guide"] a')).toHaveCount(3)
  await page.locator("#toc-guide").evaluate((element) => {
    element.style.height = "auto"
    element.style.overflow = "visible"
  })
  await page.locator("#toc-composition").evaluate((element) => element.scrollIntoView())
  await expect(page.locator('[data-toc-for="toc-guide"] a[aria-current]')).toHaveText("Composition")
  await page.locator('[data-toc-for="toc-guide"]').evaluate((nav) => {
    const host = nav.parentElement!
    host.remove()
    document.body.append(host)
  })
  await expect(page.locator('[data-toc-for="toc-guide"] a')).toHaveCount(3)
})
