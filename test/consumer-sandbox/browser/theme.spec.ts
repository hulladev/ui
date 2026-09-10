import { expect, test } from "@playwright/test"

const consumers = [
  { framework: "astro", url: "http://127.0.0.1:4411" },
  { framework: "react", url: "http://127.0.0.1:4412" },
  { framework: "solid", url: "http://127.0.0.1:4413" },
] as const

type StyleSnapshot = {
  backgroundColor: string
  borderRadius: string
  borderTopColor: string
  borderTopWidth: string
  boxShadow: string
  height: string
  fontSize: string
  fontFamily: string
  paddingLeft: string
  paddingTop: string
}

const snapshots = new Map<string, StyleSnapshot>()

for (const consumer of consumers) {
  test(`${consumer.framework} activates the base theme and renders production primitives`, async ({
    page,
  }) => {
    await page.goto(consumer.url)
    await expect(page.locator("main")).toHaveAttribute("data-framework", consumer.framework)
    await expect(page.getByTestId("card")).toBeVisible()
    await expect(page.getByTestId("button")).toBeVisible()

    const root = await page.locator("html").evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        fontFamily: style.fontFamily,
        primary: style.getPropertyValue("--color-primary").trim(),
      }
    })
    expect(root.fontFamily).toContain("Schibsted Grotesk")
    expect(root.backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
    expect(root.primary).not.toBe("")

    const styles = await page.getByTestId("button").evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        borderTopColor: style.borderTopColor,
        borderTopWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        height: style.height,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        paddingLeft: style.paddingLeft,
        paddingTop: style.paddingTop,
      }
    })
    expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
    expect(styles.borderTopWidth).toBe("1px")
    expect(styles.paddingLeft).toBe("12px")
    await page.goto("http://127.0.0.1:4414/")
    const catalogStyles = await page
      .locator('#button [data-preview-panel="variants"]')
      .getByRole("button", { name: "Medium", exact: true })
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element)
        return {
          backgroundColor: style.backgroundColor,
          borderRadius: style.borderRadius,
          borderTopColor: style.borderTopColor,
          borderTopWidth: style.borderTopWidth,
          boxShadow: style.boxShadow,
          height: style.height,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          paddingLeft: style.paddingLeft,
          paddingTop: style.paddingTop,
        }
      })
    expect(styles).toEqual(catalogStyles)
    await page.goto(consumer.url)
    snapshots.set(consumer.framework, styles)

    await expect(page).toHaveScreenshot(`${consumer.framework}-primitives.png`, {
      animations: "disabled",
      fullPage: true,
    })
  })
}

test.afterAll(() => {
  const astro = snapshots.get("astro")
  expect(astro).toBeDefined()
  expect(snapshots.get("react")).toEqual(astro)
  expect(snapshots.get("solid")).toEqual(astro)
})
