import { Field } from "../src/react/field/field.react"
import { BreadcrumbEllipsis } from "../src/react/breadcrumbs/breadcrumb-ellipsis.react"
import { RadioGroupLegend } from "../src/react/radio/radio-group-legend.react"
import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { TagInputLabel } from "../src/react/tag-input/tag-input-label.react"
import { TagInputRemove } from "../src/react/tag-input/tag-input-remove.react"
import { FieldOutput } from "../src/react/field/field-output.react"
import { FieldStatus } from "../src/react/field/field-status.react"
import { PopoverLink } from "../src/react/popover/popover-link.react"
import { LinkCard } from "../src/react/link-card/link-card.react"
import { LinkCardContent } from "../src/react/link-card/link-card-content.react"
import { LinkCardTitle } from "../src/react/link-card/link-card-title.react"
import { LinkCardDescription } from "../src/react/link-card/link-card-description.react"

test("link cards compose optional content inside one native anchor", () => {
  const markup = renderToStaticMarkup(
    createElement(
      LinkCard,
      {
        href: "/guides/api/quick-start",
        target: "_blank",
        rel: "noreferrer",
        "aria-labelledby": "guide-title",
        "aria-describedby": "guide-description",
        "aria-current": "page",
        className: "max-w-sm",
      },
      createElement(
        LinkCardContent,
        {},
        createElement(LinkCardTitle, { id: "guide-title" }, "Build your first route"),
        createElement(LinkCardDescription, { id: "guide-description" }, "One working example.")
      )
    )
  )
  expect(markup).toStartWith("<a ")
  expect(markup).toContain('href="/guides/api/quick-start"')
  expect(markup).toContain('target="_blank"')
  expect(markup).toContain('rel="noreferrer"')
  expect(markup).toContain('aria-current="page"')
  expect(markup).toContain('aria-labelledby="guide-title"')
  expect(markup).toContain('aria-describedby="guide-description"')
  expect(markup).toContain('id="guide-title"')
  expect(markup).toContain('id="guide-description"')
  expect(markup).toContain("Build your first route")
  expect(markup).toContain("One working example.")
  expect(markup).toContain("max-w-sm")
  expect(markup.match(/<a /g)).toHaveLength(1)
  expect(markup).not.toContain("<button")

  const plain = renderToStaticMarkup(createElement(LinkCard, { href: "/docs" }, "Read the docs"))
  expect(plain).toContain(">Read the docs</a>")
})

test("tag labels truncate without catalog attributes and retain consumer classes", () => {
  const markup = renderToStaticMarkup(
    createElement(TagInputLabel, { className: "max-w-24", title: "Long label" }, "Long label")
  )
  expect(markup).toContain("truncate")
  expect(markup).toContain("max-w-24")
  expect(markup).toContain('title="Long label"')
  expect(markup).not.toContain("data-tag-label")
  expect(markup).toContain(">Long label</span>")
})

test("remove buttons provide a default icon and allow replacement children", () => {
  const markup = renderToStaticMarkup(
    createElement(TagInputRemove, { "aria-label": "Remove Design", disabled: true })
  )
  expect(markup).toContain('type="button"')
  expect(markup).toContain('aria-label="Remove Design"')
  expect(markup).toContain('disabled=""')
  expect(markup).toContain('<svg aria-hidden="true"')
  const custom = renderToStaticMarkup(
    createElement(TagInputRemove, { "aria-label": "Remove Design" }, "Remove")
  )
  expect(custom).not.toContain("<svg")
  expect(custom).toContain(">Remove</button>")
})

test("field readouts retain native associations and explicit live-region attributes", () => {
  const markup = renderToStaticMarkup(
    createElement(FieldOutput, { htmlFor: "minimum maximum", form: "filters" }, "12–24")
  )
  expect(markup).toStartWith("<output")
  expect(markup).toContain('for="minimum maximum"')
  expect(markup).toContain('form="filters"')
  expect(markup).toContain(">12–24</output>")
  const status = renderToStaticMarkup(
    createElement(FieldStatus, { "aria-live": "assertive", id: "upload-status" }, "Upload failed")
  )
  expect(status).toContain('aria-live="assertive"')
  expect(status).toContain('id="upload-status"')
  expect(status).toContain(">Upload failed</output>")
})

test("popover links preserve native anchor semantics", () => {
  const markup = renderToStaticMarkup(
    createElement(PopoverLink, { href: "/profile", "aria-current": "page" }, "Profile")
  )
  expect(markup).toStartWith("<a")
  expect(markup).toContain('href="/profile"')
  expect(markup).toContain('aria-current="page"')
  expect(markup).not.toContain('role="menuitem"')
  expect(markup).toContain("focus-visible:outline-focus-ring")
})

test("group labels retain legend semantics and omitted ancestors have accessible text", () => {
  const legend = renderToStaticMarkup(
    createElement(RadioGroupLegend, { id: "plans" }, "Choose a plan")
  )
  expect(legend).toStartWith('<legend id="plans"')
  expect(legend).toContain(">Choose a plan</legend>")
  const ellipsis = renderToStaticMarkup(createElement(BreadcrumbEllipsis))
  expect(ellipsis).toContain('<span aria-hidden="true">···</span>')
  expect(ellipsis).toContain('<span class="sr-only">More pages</span>')
  const localized = renderToStaticMarkup(createElement(BreadcrumbEllipsis, {}, "Další stránky"))
  expect(localized).not.toContain("More pages")
  expect(localized).toContain("Další stránky")
})

test("Field defaults to vertical and accepts horizontal composition without another wrapper", () => {
  const children = [
    createElement("input", { key: "control", id: "consent", type: "checkbox" }),
    createElement("label", { key: "label", htmlFor: "consent" }, "Consent"),
  ]
  const vertical = renderToStaticMarkup(createElement(Field, { children }))
  expect(vertical).toContain('data-orientation="vertical"')
  const horizontal = renderToStaticMarkup(
    createElement(Field, {
      children,
      orientation: "horizontal",
      id: "consent-field",
      className: "max-w-sm",
    })
  )
  expect(horizontal).toContain('data-orientation="horizontal"')
  expect(horizontal).not.toContain(' orientation="horizontal"')
  expect(horizontal.match(/<div/g)).toHaveLength(1)
  expect(horizontal).toContain('for="consent"')
  expect(horizontal).toContain('id="consent-field"')
  expect(horizontal).toContain("max-w-sm")
})
