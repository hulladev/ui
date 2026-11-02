import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { ts } from "@tanstack/highlight/languages/ts"
import { createShikiCodeHighlighter } from "../src/react/code-highlighter-shiki/code-highlighter-shiki"
import { createTanStackCodeHighlighter } from "../src/react/code-highlighter-tanstack/code-highlighter-tanstack"
import {
  plainHighlightedCode,
  tokensToHighlightedCode,
  type HighlightedCode,
} from "../src/react/code/code-highlight"

const generatedRoot = resolve(import.meta.dir, "../../../generated")

function sourceFrom(result: HighlightedCode): string {
  return result.lines.map((line) => line.tokens.map((token) => token.content).join("")).join("\n")
}

describe("Code highlighting adapters", () => {
  test("preserves newlines when normalizing plain and class-based tokens", () => {
    const source = "const first = 1\n\nconst last = 2\n"
    const plain = plainHighlightedCode(source, "ts")
    const tokenized = tokensToHighlightedCode(source, "ts", [
      { className: "th-keyword", content: "const" },
      { content: " first = 1\n\nconst last = 2\n" },
    ])

    expect(sourceFrom(plain)).toBe(source)
    expect(sourceFrom(tokenized)).toBe(source)
    expect(tokenized.lines).toHaveLength(4)
    expect(tokenized.lines[0]?.tokens[0]?.className).toBe("th-keyword")
  })

  test("normalizes TanStack Highlight without leaking rendered HTML", () => {
    const highlighter = createTanStackCodeHighlighter({ languages: [ts] })
    const source = "const ready: boolean = true"
    const result = highlighter.highlight(source, { language: "ts" })

    expect(sourceFrom(result)).toBe(source)
    expect(result.lines.flatMap((line) => line.tokens).some((token) => token.className)).toBe(true)
    expect(
      result.lines.flatMap((line) => line.tokens).every((token) => !token.content.includes("<span"))
    ).toBe(true)
  })

  test("normalizes Shiki tokens through its shared highlighter", async () => {
    const highlighter = await createShikiCodeHighlighter({ languages: ["ts"] })
    const source = "const ready: boolean = true"
    const result = highlighter.highlight(source, { language: "ts" })

    expect(sourceFrom(result)).toBe(source)
    expect(result.lines.flatMap((line) => line.tokens).some((token) => token.color)).toBe(true)
  })

  test("preserves source-language tokens inside Shiki diffs", async () => {
    const source = "-import { api } from '@hulla/api'\n+import { defineContract } from '@hulla/api'"
    const highlighter = await createShikiCodeHighlighter({ languages: ["ts"] })
    const result = highlighter.highlightDiff(source, { language: "ts" })

    expect(sourceFrom(result)).toBe(source)
    expect(result.lines[0]?.tokens[0]).toMatchObject({
      color: "var(--color-danger)",
      content: "-",
    })
    expect(result.lines[1]?.tokens[0]).toMatchObject({
      color: "var(--color-success)",
      content: "+",
    })
    expect(
      new Set(result.lines[1]?.tokens.slice(1).map((token) => token.color)).size
    ).toBeGreaterThan(1)
  })

  test("keeps highlighters optional, independently selectable generated components", async () => {
    const [manifestSource, shikiPackageSource, tanstackPackageSource] = await Promise.all([
      readFile(resolve(generatedRoot, "ui.manifest.json"), "utf8"),
      readFile(resolve(generatedRoot, "astro/code-highlighter-shiki/package.json"), "utf8"),
      readFile(resolve(generatedRoot, "astro/code-highlighter-tanstack/package.json"), "utf8"),
    ])
    const manifest = JSON.parse(manifestSource)
    const shikiPackage = JSON.parse(shikiPackageSource)
    const tanstackPackage = JSON.parse(tanstackPackageSource)

    expect(manifest.library.components.code).toBeDefined()
    expect(manifest.library.components["code-highlighter-shiki"]).toBeDefined()
    expect(manifest.library.components["code-highlighter-tanstack"]).toBeDefined()
    expect(shikiPackage.dependencies).toEqual({ shiki: "^4.3.1" })
    expect(tanstackPackage.dependencies).toEqual({ "@tanstack/highlight": "^0.0.9" })
  })
})
