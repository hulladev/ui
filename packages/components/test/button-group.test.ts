import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dir, "../../..")

async function readGeneratedButtonGroup(framework: "astro" | "react"): Promise<string> {
  const extension = framework === "astro" ? "astro" : "tsx"
  return readFile(
    resolve(repositoryRoot, `generated/${framework}/button/button-group.${extension}`),
    "utf8"
  )
}

describe("ButtonGroup generated contract", () => {
  test("provides an accessible group and exposes its orientation", async () => {
    const sources = await Promise.all([
      readGeneratedButtonGroup("astro"),
      readGeneratedButtonGroup("react"),
    ])

    for (const source of sources) {
      expect(source).toContain('role = "group"')
      expect(source).toContain('data-slot="button-group"')
      expect(source).toContain("data-orientation={orientation}")
    }
  })

  test("joins direct children without flattening their own button styles", async () => {
    const sources = await Promise.all([
      readGeneratedButtonGroup("astro"),
      readGeneratedButtonGroup("react"),
    ])

    for (const source of sources) {
      expect(source).toContain("[&>*:not(:first-child)]:-ml-px")
      expect(source).toContain("[&>*:not(:last-child)]:rounded-r-none")
      expect(source).toContain("[&>*:not(:first-child)]:-mt-px")
      expect(source).toContain("[&>*:not(:last-child)]:rounded-b-none")
      expect(source).toContain("[&>*]:focus-visible:z-10")
    }
  })
})
