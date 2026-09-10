import { expect, test } from "@playwright/test"
import { catalogPages } from "../../src/data/catalogNavigation"

// Compare the same live components and public props against the shipping CSS alone.
// Width/position are intentionally excluded: a catalog is allowed to lay out examples.
for (const width of [390, 1440]) {
  for (const { href, group } of [...catalogPages, { href: "/showcase", group: "Showcase" }]) {
    for (const theme of ["light", "dark"]) {
      test(`${group}: catalog CSS does not restyle shared parts in ${theme} at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ reducedMotion: "reduce" })
        await page.goto(href, { waitUntil: "networkidle" })
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme
        }, theme)
        await page.addStyleTag({
          content:
            "*, *::before, *::after { transition: none !important; animation: none !important; }",
        })
        await page.evaluate(() => document.fonts.ready)
        const differences = await page.evaluate(() => {
          const properties = [
            "color",
            "background-color",
            "background-image",
            "box-shadow",
            "opacity",
            "border-top-color",
            "border-top-width",
            "border-top-style",
            "border-radius",
            "font-family",
            "font-size",
            "font-weight",
            "line-height",
            "letter-spacing",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
            "outline-color",
            "outline-width",
            "outline-style",
            "outline-offset",
            "row-gap",
            "column-gap",
            "text-transform",
            "text-decoration-line",
          ]
          // Include hidden prop cases and overlay parts as well as the initial examples.
          const elements = [
            ...document.querySelectorAll(
              "[data-preview-canvas] :is([data-slot], button, input, select, textarea, a, svg), [data-showcase-component], [data-showcase-component] [data-slot]"
            ),
          ].filter((element) => !element.closest(".prop-controls"))
          if (!elements.length) throw new Error("No shared components found")
          const snapshot = () =>
            elements.map((element) => {
              const style = getComputedStyle(element)
              return Object.fromEntries(
                properties.map((property) => [
                  property,
                  property === "border-top-color" && style.borderTopWidth === "0px"
                    ? "unpainted"
                    : style.getPropertyValue(property),
                ])
              )
            })
          const catalog = snapshot()
          let removed = 0
          for (const sheet of document.styleSheets) {
            for (let index = sheet.cssRules.length - 1; index >= 0; index--) {
              const rule = sheet.cssRules[index]!
              if (rule.cssText.startsWith("@layer catalog {")) {
                sheet.deleteRule(index)
                removed++
              }
            }
          }
          if (!removed)
            throw new Error("Catalog layer was not found; parity check would be vacuous")
          const shipping = snapshot()
          return elements.flatMap((element, index) =>
            properties.flatMap((property) =>
              catalog[index]![property] === shipping[index]![property]
                ? []
                : [
                    {
                      example: element
                        .closest("[data-preview-component]")
                        ?.getAttribute("data-preview-component"),
                      part: element.getAttribute("data-slot"),
                      property,
                      catalog: catalog[index]![property],
                      shipping: shipping[index]![property],
                    },
                  ]
            )
          )
        })
        expect(differences).toEqual([])
      })
    }
  }
}
