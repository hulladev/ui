import { expect, test } from "@playwright/test"
import { catalogPages, nativeCatalogDestination } from "../../src/data/catalogNavigation"
import { nativeCatalogEntries } from "../../../native-catalog/src/entries"

const reviewPages = [
  ...catalogPages.filter((page) => page.group !== "Native only"),
  ...nativeCatalogEntries.map((entry) => ({
    href: nativeCatalogDestination(entry.id)!,
    group: `React Native / ${entry.title}`,
  })),
]

// Compare the same live components and public props against the shipping CSS alone.
// Width/position are intentionally excluded: a catalog is allowed to lay out examples.
for (const width of [390, 1440]) {
  for (const { href, group } of [...reviewPages, { href: "/showcase", group: "Showcase" }]) {
    for (const theme of ["light", "dark"]) {
      test(`${group}: catalog CSS does not restyle shared parts in ${theme} at ${width}px`, async ({
        page,
      }) => {
        if (group.startsWith("React Native /")) test.setTimeout(60_000)
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ reducedMotion: "reduce" })
        await page.addInitScript((theme) => localStorage.setItem("catalog-theme", theme), theme)
        await page.goto(href, { waitUntil: "domcontentloaded" })
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme
        }, theme)
        if (group.startsWith("React Native /"))
          await expect(page.locator(`#native-preview-${theme}`)).toBeVisible({ timeout: 30_000 })
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
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
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
              '[data-preview-canvas] :is([data-slot], button, input, select, textarea, a, svg, [data-testid="native-description"], [data-testid="status-label"], [data-testid="button-surface"]), [data-testid="native-catalog"] *, [data-showcase-component], [data-showcase-component] [data-slot]'
            ),
          ].filter((element) => !element.closest(".prop-controls"))
          if (!elements.length) throw new Error("No shared components found")
          // Resolved auto margins change when the catalog's layout disappears. Compare
          // fixed component spacing, while leaving alignment and centering to the canvas.
          const marginProperties = [
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
            "margin-inline-start",
            "margin-inline-end",
            "margin-block-start",
            "margin-block-end",
          ]
          const autoRules: { selector: string; properties: string[] }[] = []
          const findAutoRules = (rules: CSSRuleList) => {
            for (const rule of rules) {
              if (rule instanceof CSSStyleRule) {
                const properties = marginProperties.filter(
                  (property) => rule.style.getPropertyValue(property) === "auto"
                )
                if (properties.length) autoRules.push({ selector: rule.selectorText, properties })
              }
              if ("cssRules" in rule) findAutoRules((rule as CSSGroupingRule).cssRules)
            }
          }
          for (const sheet of document.styleSheets) findAutoRules(sheet.cssRules)
          const autoMargins = elements.map((element) => {
            const properties = new Set<string>()
            const rtl = getComputedStyle(element).direction === "rtl"
            const logicalMargins: Record<string, string> = {
              "margin-inline-start": rtl ? "margin-right" : "margin-left",
              "margin-inline-end": rtl ? "margin-left" : "margin-right",
              "margin-block-start": "margin-top",
              "margin-block-end": "margin-bottom",
            }
            const physical = (property: string) => logicalMargins[property] ?? property
            for (const rule of autoRules) {
              try {
                if (element.matches(rule.selector))
                  for (const property of rule.properties) properties.add(physical(property))
              } catch {
                /* An unsupported pseudo-element cannot match a host element. */
              }
            }
            for (const property of marginProperties)
              if ((element as HTMLElement).style.getPropertyValue(property) === "auto")
                properties.add(physical(property))
            return properties
          })
          const snapshot = () =>
            elements.map((element, index) => {
              const style = getComputedStyle(element)
              return Object.fromEntries(
                properties.map((property) => [
                  property,
                  autoMargins[index]!.has(property)
                    ? "layout-auto"
                    : property === "border-top-color" && style.borderTopWidth === "0px"
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
