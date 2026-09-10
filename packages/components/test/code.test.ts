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

const componentRoot = resolve(import.meta.dir, "../src")
const generatedRoot = resolve(import.meta.dir, "../../../generated")

function sourceFrom(result: HighlightedCode): string {
  return result.lines.map((line) => line.tokens.map((token) => token.content).join("")).join("\n")
}

async function readCodePart(
  framework: "astro" | "react",
  part:
    | "code"
    | "code-block"
    | "code-block-actions"
    | "code-block-body"
    | "code-block-content"
    | "code-block-description"
    | "code-block-footer"
    | "code-block-header"
    | "code-block-path"
    | "code-block-title"
): Promise<string> {
  const extension = framework === "astro" ? "astro" : "react.tsx"
  return readFile(resolve(componentRoot, framework, "code", `${part}.${extension}`), "utf8")
}

describe("Code authored contract", () => {
  test("uses semantic code and pre elements in both frameworks", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [inline, content] = await Promise.all([
        readCodePart(framework, "code"),
        readCodePart(framework, "code-block-content"),
      ])

      expect(inline).toContain("<code")
      expect(inline).toContain('data-slot="code"')
      expect(content).toContain("<pre")
      expect(content).toContain("<code")
      expect(content).toContain('data-slot="code-block-content"')
      expect(content).toMatch(/tabindex|tabIndex/)
    }
  })

  test("provides composable header, metadata, action, and footer regions", async () => {
    const parts = [
      "code-block-header",
      "code-block-body",
      "code-block-path",
      "code-block-title",
      "code-block-description",
      "code-block-actions",
      "code-block-footer",
    ] as const

    for (const framework of ["astro", "react"] as const) {
      const sources = await Promise.all(parts.map((part) => readCodePart(framework, part)))
      parts.forEach((part, index) => {
        expect(sources[index]).toContain(`data-slot="${part}"`)
      })
    }
  })

  test("keeps body actions optional and outside the pre element", async () => {
    for (const framework of ["astro", "react"] as const) {
      const [body, content] = await Promise.all([
        readCodePart(framework, "code-block-body"),
        readCodePart(framework, "code-block-content"),
      ])

      expect(body).toContain("[&>[data-slot=code-block-actions]]:absolute")
      expect(body).toContain("[&>[data-slot=code-block-actions]]:top-2")
      expect(body).not.toContain("CodeBlockActions")
      expect(content).not.toContain("code-block-actions")
    }
  })

  test("stretches code tabs and docks actions without overlap", async () => {
    for (const framework of ["astro", "react"] as const) {
      const header = await readCodePart(framework, "code-block-header")

      expect(header).toContain("has-[>[data-slot=tabs-list]]:p-0")
      expect(header).toContain("[&>[data-slot=tabs-list]]:h-9")
      expect(header).toContain("[&>[data-slot=tabs-list]]:gap-0")
      expect(header).toContain("[&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:border-r")
      expect(header).toContain(
        "[&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:self-stretch"
      )
    }
  })

  test("exposes line numbering, wrapping, and common annotation states", async () => {
    for (const framework of ["astro", "react"] as const) {
      const content = await readCodePart(framework, "code-block-content")

      expect(content).toContain("lineNumbers")
      expect(content).toContain("startLine")
      expect(content).toContain("wrap")
      for (const state of ["highlighted", "inserted", "deleted", "focused", "error", "warning"]) {
        expect(content).toContain(`data-${state}`)
      }
    }
  })

  test("scopes focused-line dimming to each code content surface", async () => {
    for (const framework of ["astro", "react"] as const) {
      const content = await readCodePart(framework, "code-block-content")

      expect(content).toContain("group/code-content")
      expect(content).toContain("group-has-[[data-focused]]/code-content:opacity-45")
      expect(content).toContain(
        "group-has-[[data-focused]]/code-content:data-[focused]:opacity-100"
      )
      expect(content).not.toContain("group-has-[[data-focused]]/code-block:opacity-45")
    }
  })
})

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
