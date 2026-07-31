import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedSeparator(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/separator/separator.${extension}`),
    "utf8"
  )
}

describe("Separator generated contract", () => {
  test("preserves a native separator when no content is passed", async () => {
    const sources = await Promise.all([
      readGeneratedSeparator("astro"),
      readGeneratedSeparator("react"),
    ])

    for (const source of sources) {
      const nativeSeparator = source.match(/<hr[\s\S]*?\/>/)?.[0]

      expect(nativeSeparator).toBeDefined()
      expect(source).toContain('data-slot="separator"')
      expect(nativeSeparator).not.toContain('role="separator"')
    }
  })

  test("supports visual variants and both orientations", async () => {
    const sources = await Promise.all([
      readGeneratedSeparator("astro"),
      readGeneratedSeparator("react"),
    ])

    for (const source of sources) {
      expect(source).toContain('orientation = "horizontal"')
      expect(source).toContain('variant = "solid"')
      expect(source).toContain(
        'aria-orientation={orientation === "vertical" ? "vertical" : undefined}'
      )
      expect(source).toContain("data-orientation={orientation}")
      expect(source).toContain("data-variant={variant}")
      expect(source).toContain('dashed: "border-dashed"')
      expect(source).toContain('dotted: "border-dotted"')
    }
  })

  test("centers passed content between matching separator lines", async () => {
    const sources = await Promise.all([
      readGeneratedSeparator("astro"),
      readGeneratedSeparator("react"),
    ])

    for (const source of sources) {
      expect(source).toContain('role="separator"')
      expect(source).toContain('data-slot="separator-content"')
      expect(source).toContain('data-slot="separator-line"')
      expect(source).toContain("$contentLineOrientation(orientation)")
      expect(source).toContain("$variant(variant)")
    }
  })
})
