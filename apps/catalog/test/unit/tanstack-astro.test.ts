import { describe, expect, test } from "bun:test"
import { createHighlighter, type HighlightToken } from "@tanstack/highlight/core"
import { css } from "@tanstack/highlight/languages/css"
import { html } from "@tanstack/highlight/languages/html"
import { ts } from "@tanstack/highlight/languages/ts"
import { tsx } from "@tanstack/highlight/languages/tsx"
import { astro } from "../../src/lib/tanstack-astro"

const highlighter = createHighlighter({ languages: [astro, css, html, ts, tsx] })

const valuesFor = (tokens: readonly HighlightToken[], className: HighlightToken["className"]) =>
  tokens.filter((token) => token.className === className).map((token) => token.value)

describe("TanStack Astro language prototype", () => {
  test("delegates frontmatter, template expressions, scripts, and styles", () => {
    const source = `---
import Button from "./Button.astro"

interface Props {
  active?: boolean
}

const { active = false } = Astro.props
---

<Button client:load class:list={{ active }}>
  {active ? "Ready" : "Waiting"}
</Button>

<script>
  import { connect } from "./client"
  const attempts: number = 1
  connect(attempts)
</script>

<style>
  .button { color: red; }
</style>`
    const result = highlighter.tokenize(source, { lang: "astro" })
    const keywords = valuesFor(result.tokens, "keyword")

    expect(result.lang).toBe("astro")
    expect(result.tokens.map((token) => token.value).join("")).toBe(source)
    expect(keywords.filter((value) => value === "import")).toHaveLength(2)
    expect(keywords).toContain("interface")
    expect(keywords).toContain("const")
    expect(valuesFor(result.tokens, "tag")).toEqual(
      expect.arrayContaining(["Button", "script", "style"])
    )
    expect(valuesFor(result.tokens, "attr")).toEqual(
      expect.arrayContaining(["client:load", "class:list"])
    )
    expect(valuesFor(result.tokens, "literal")).toContain("false")
    expect(valuesFor(result.tokens, "property")).toContain("color")
    expect(valuesFor(result.tokens, "meta")).toEqual(["---", "---"])
  })

  test("balances nested expressions, templates, regex literals, and JSX-like markup", () => {
    const source = `<section>
  {
    items
      .filter((item) => /[{}]/.test(item.label))
      .map((item) => (
        <Button data-value={{ nested: \`value-\${item.id}\` }}>
          {item.label}
        </Button>
      ))
  }
</section>`
    const result = highlighter.tokenize(source, { lang: "astro" })

    expect(result.tokens.map((token) => token.value).join("")).toBe(source)
    expect(valuesFor(result.tokens, "tag")).toEqual(expect.arrayContaining(["section", "Button"]))
    expect(valuesFor(result.tokens, "property")).toEqual(
      expect.arrayContaining(["filter", "map", "test", "label", "id"])
    )
    expect(valuesFor(result.tokens, "literal")).toContain("/[{}]/")
    expect(valuesFor(result.tokens, "operator").filter((value) => value === "{")).toHaveLength(1)
  })

  test("still highlights template-only Astro files", () => {
    const source = `<Fragment set:html={Astro.slots.render("default")} />`
    const result = highlighter.tokenize(source, { lang: "astro" })

    expect(result.tokens.map((token) => token.value).join("")).toBe(source)
    expect(valuesFor(result.tokens, "tag")).toContain("Fragment")
    expect(valuesFor(result.tokens, "attr")).toContain("set:html")
    expect(valuesFor(result.tokens, "property")).toEqual(
      expect.arrayContaining(["slots", "render"])
    )
  })
})
